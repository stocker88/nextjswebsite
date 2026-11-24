"""Read-only signal backtest. No Firebase writes; no broker-execution claims.

Run with --output DIRECTORY. Credentials come from Google Application Default
Credentials (GOOGLE_APPLICATION_CREDENTIALS), never from the output artifact.
"""
import argparse, concurrent.futures, datetime as dt, hashlib, json, math, statistics
from collections import Counter, defaultdict
from pathlib import Path
from zoneinfo import ZoneInfo
import requests

NY = ZoneInfo('America/New_York')
VERSION = 'target-date-v1.1'
# Verified ticker rename: https://infomemo.theocc.com/infomemos?number=55886
ALIASES = {'SQ':'XYZ'}
FIELDS = ['symbol1', 'quoteType1', 'timestampInt', 'recommendationTimeInt', 'targetDateInt', 'isShort']

def number(v):
    return isinstance(v, (int, float)) and not isinstance(v, bool) and math.isfinite(v)

def annualized_return(return_pct, days):
    if not number(return_pct) or not number(days) or days <= 0 or return_pct < -100:
        return None
    if return_pct == -100:
        return -100.0
    try:
        value = math.expm1(math.log1p(return_pct / 100) * 365 / days) * 100
        return value if math.isfinite(value) else None
    except OverflowError:
        return None

def evaluate(signal, bars, benchmark, cutoff):
    r = dict(signal)
    publication = signal.get('timestampInt')
    recommendation = signal.get('recommendationTimeInt')
    target = signal.get('targetDateInt')
    if not number(publication) or publication <= 0:
        return {**r, 'status': 'missing_publication'}
    # Never use a recommendation timestamp earlier than the stored publication.
    published = max(publication, recommendation if number(recommendation) else publication)
    r['entryAfterTimestamp'] = published
    if not number(target) or target <= 0:
        return {**r, 'status': 'hold_no_target'}
    timezone = ZoneInfo(bars[0].get('timezone','America/New_York')) if bars else NY
    r['priceTimezone'] = str(timezone)
    r['priceSymbol'] = ALIASES.get(str(signal.get('symbol1','')).upper(),str(signal.get('symbol1','')).upper())
    target_day = dt.datetime.fromtimestamp(target, timezone).date().isoformat()
    r['targetDay'] = target_day
    if target <= published:
        return {**r, 'status': 'target_before_publication'}
    if target_day > cutoff:
        return {**r, 'status': 'target_pending'}
    if not bars:
        return {**r, 'status': 'price_data_unavailable'}
    entry = next((b for b in bars if b['timestamp'] >= published and b['date'] <= cutoff), None)
    exit_bar = next((b for b in bars if b['date'] >= target_day and b['date'] <= cutoff), None)
    if not entry or not exit_bar or exit_bar['date'] < entry['date']:
        return {**r, 'status': 'no_completed_price_window'}
    # Do not silently bridge a delisting or a long missing-price interval.
    entry_gap = (dt.date.fromisoformat(entry['date']) - dt.datetime.fromtimestamp(published, timezone).date()).days
    exit_gap = (dt.date.fromisoformat(exit_bar['date']) - dt.date.fromisoformat(target_day)).days
    if entry_gap > 7 or exit_gap > 7:
        return {**r, 'status': 'price_gap_over_7_days'}
    direction = -1 if signal.get('isShort') is True else 1
    result = direction * (exit_bar['close'] / entry['open'] - 1) * 100
    r.update(status='completed', entryDate=entry['date'], exitDate=exit_bar['date'],
             entryAdjustedOpen=entry['open'], exitAdjustedClose=exit_bar['close'],
             returnPct=result, holdingDays=(dt.date.fromisoformat(exit_bar['date'])-dt.date.fromisoformat(entry['date'])).days)
    r['entryTimestamp'] = entry['timestamp']
    r['annualizedReturnPct'] = annualized_return(result, r['holdingDays'])
    a, b = benchmark.get(entry['date']), benchmark.get(exit_bar['date'])
    if a and b and str(timezone)=='America/New_York':
        r['benchmarkPct'] = (b['close'] / a['open'] - 1) * 100
        r['excessPct'] = result - r['benchmarkPct']
    return r

def summarize(rows):
    closed = [r for r in rows if r['status'] == 'completed']
    values = [r['returnPct'] for r in closed]
    gains, losses = [v for v in values if v > 0], [v for v in values if v < 0]
    mean = lambda xs: sum(xs) / len(xs) if xs else None
    paired = [r for r in closed if 'benchmarkPct' in r]
    annualized = [annualized_return(r['returnPct'],r['holdingDays']) for r in closed]
    annualized = [v for v in annualized if v is not None]
    simple_annualized = [r['returnPct'] * 365 / r['holdingDays'] for r in closed if r['holdingDays'] > 0]
    months = defaultdict(list)
    for r in closed:
        months[r['exitDate'][:7]].append(r['returnPct'])
    return dict(totalRecords=len(rows), statuses=dict(Counter(r['status'] for r in rows)),
                completed=len(values), winners=len(gains), losers=len(losses), flat=sum(v == 0 for v in values),
                winRatePct=100*len(gains)/len(values) if values else None,
                meanReturnPct=mean(values), averageGainPct=mean(gains), averageLossPct=mean(losses),
                medianReturnPct=statistics.median(values) if values else None,
                estimatedNetReturn10bpsPct=mean([v-0.10 for v in values]),
                estimatedNetReturn20bpsPct=mean([v-0.20 for v in values]),
                bestReturnPct=max(values) if values else None, worstReturnPct=min(values) if values else None,
                meanHoldingDays=mean([r['holdingDays'] for r in closed]),
                annualizedCount=len(annualized), annualizedExcluded=len(closed)-len(annualized),
                meanAnnualizedReturnPct=mean(annualized),
                meanSimpleAnnualizedReturnPct=mean(simple_annualized),
                simpleAnnualizedCount=len(simple_annualized),
                medianAnnualizedReturnPct=statistics.median(annualized) if annualized else None,
                benchmarkPairs=len(paired), meanBenchmarkPct=mean([r['benchmarkPct'] for r in paired]),
                meanPairedReturnPct=mean([r['returnPct'] for r in paired]),
                meanExcessPct=mean([r['excessPct'] for r in paired]),
                months=[dict(month=m, completed=len(v), meanReturnPct=mean(v)) for m,v in sorted(months.items())])

def fetch_prices(symbol, start, end):
    response = requests.get('https://query1.finance.yahoo.com/v8/finance/chart/'+requests.utils.quote(symbol, safe=''),
                            params={'period1':start, 'period2':end, 'interval':'1d'},
                            headers={'User-Agent':'Mozilla/5.0'}, timeout=25)
    response.raise_for_status()
    raw = response.json()['chart']['result'][0]
    timezone=ZoneInfo(raw['meta']['exchangeTimezoneName'])
    q = raw['indicators']['quote'][0]
    adjusted = raw['indicators']['adjclose'][0]['adjclose']
    bars = []
    for i,t in enumerate(raw['timestamp']):
        o,c,a = q['open'][i],q['close'][i],adjusted[i]
        if all(number(x) and x > 0 for x in [o,c,a]):
            bars.append(dict(timestamp=t, date=dt.datetime.fromtimestamp(t,timezone).date().isoformat(), open=o*a/c, close=a,timezone=str(timezone)))
    return sorted(bars, key=lambda b:b['timestamp'])

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    parser.add_argument('--cutoff',required=True,help='Inclusive observation cutoff YYYY-MM-DD')
    args=parser.parse_args()
    import firebase_admin
    from firebase_admin import firestore
    firebase_admin.initialize_app()
    end=int(dt.datetime.combine(dt.date.fromisoformat(args.cutoff)+dt.timedelta(days=1),dt.time(),NY).timestamp())
    source=[{'id':d.id, **{k:d.to_dict().get(k) for k in FIELDS}} for d in firestore.client().collection('stocksToBuyAnalyst').stream(timeout=120)]
    signals=[r for r in source if number(r.get('timestampInt')) and max(r['timestampInt'],r.get('recommendationTimeInt') or r['timestampInt']) < end]
    signals.sort(key=lambda r:r['id'])
    folder=Path(args.output); folder.mkdir(parents=True,exist_ok=True)
    snapshot=json.dumps(signals,sort_keys=True)
    (folder/'signals.json').write_text(snapshot)
    first=min(r['timestampInt'] for r in signals if number(r.get('timestampInt')) and r['timestampInt']>0)
    prices={}; errors={}
    symbols=sorted({r['symbol1'].upper() for r in signals if r.get('symbol1')} | {'SPY'})
    def fetch(symbol):
        cache=folder/(symbol.replace('/','_')+'.json')
        if cache.exists():return symbol,json.loads(cache.read_text())
        bars=fetch_prices(ALIASES.get(symbol,symbol),int(first)-7*86400,end)
        cache.write_text(json.dumps(bars))
        return symbol,bars
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        tasks={pool.submit(fetch,s):s for s in symbols}
        for future in concurrent.futures.as_completed(tasks):
            s=tasks[future]
            try:prices[s]=future.result()[1]
            except Exception as e:errors[s]=str(e)
    benchmark={b['date']:b for b in prices.get('SPY',[])}
    ledger=[evaluate(r,prices.get(str(r.get('symbol1','')).upper(),[]),benchmark,args.cutoff) for r in signals]
    report=dict(version=VERSION,asOf=args.cutoff,excludedAfterCutoff=len(source)-len(signals),generatedAt=dt.datetime.now(dt.timezone.utc).isoformat(),
                source='stocksToBuyAnalyst',sourceSHA256=hashlib.sha256(snapshot.encode()).hexdigest(),
                priceSource='Yahoo Finance daily adjusted OHLC',summary=summarize(ledger),priceErrors=errors,ledger=ledger)
    (folder/'report.json').write_text(json.dumps(report,indent=2))
    (folder/'summary.json').write_text(json.dumps({k:v for k,v in report.items() if k not in ['ledger','priceErrors']},indent=2))
    print(json.dumps({'summary':report['summary'],'priceErrors':errors},indent=2))

if __name__=='__main__': main()
