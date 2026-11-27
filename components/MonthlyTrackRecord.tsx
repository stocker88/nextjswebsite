import LocalizedContent from './localization/LocalizedContent';
import report from '../data/target-date-performance-2025-12-31.json';
const values = report.summary.months.map(month => month.meanReturnPct);
const min = Math.min(...values), max = Math.max(...values);
const start = Math.floor(min / 25) * 25;
const bins = Array.from({length: Math.floor((max - start) / 25) + 1}, (_, i) => {
 const low = start + i * 25;
 return {low, high: low + 25, count: values.filter(v => v >= low && v < low + 25).length};
});
const pct = (n:number) => `${n > 0 ? '+' : ''}${n.toFixed(2)}%`;
export default function MonthlyTrackRecord() {
 return <LocalizedContent><section className="track-preview" aria-label="Monthly track record">
  <p className="eyebrow">Track record · Stocks to Buy Now Research</p>
  <h2>Monthly outcome distribution</h2>
  <p>{`All ${values.length} exit-month cohorts · each month counted once · weighted gross, non-annualized signal returns.`}</p>
  <div className="range"><span>Minimum<strong>{pct(min)}</strong></span><span>Maximum<strong>{pct(max)}</strong></span></div>
  <ol aria-label="Month counts by cohort return range">{bins.map(bin => <li key={bin.low}>
   <span>{`${bin.low}% – <${bin.high}%`}</span><span className="track" aria-hidden="true"><span style={{width:`${100 * bin.count / Math.max(...bins.map(b=>b.count))}%`,background:bin.high<=0?'#c18eab':'#87d4bd'}}/></span><span className="count">{bin.count} <small>({(100*bin.count/values.length).toFixed(1)}%)</small></span>
  </li>)}</ol>
  <p className="note">Full holding-period signal outcomes grouped by exit month—not monthly portfolio returns. 25-percentage-point ranges; months count equally. Past returns do not predict future results.</p>
  <a href="/methodology/" data-public-content="true">Explore the track record <span aria-hidden="true">→</span></a>
  <style jsx>{`
   .track-preview{margin:28px 0;padding:30px;border:1px solid #2b3750;border-radius:22px;background:#0e1728;color:#c2ccdc;font-size:14px;line-height:1.65}.track-preview h2{color:#f0f4fc;font-size:clamp(23px,3vw,32px);margin:10px 0 14px;line-height:1.2}.eyebrow{color:#bca5f4;font-size:11px;letter-spacing:.08em;text-transform:uppercase}.range{display:flex;justify-content:space-between;gap:20px;margin:24px 0}.range strong{display:block;color:#edf3ff;font-size:25px}.range>span:last-child{text-align:right}ol{padding:0;list-style:none}li{display:grid;grid-template-columns:110px minmax(0,1fr) 95px;gap:14px;align-items:center;margin:12px 0;font-variant-numeric:tabular-nums}.track{background:#1c283b;border-radius:5px;height:16px;overflow:hidden}.track>span{display:block;height:100%;border-radius:5px}.count{text-align:right}small,.note{color:#98aac2}.note{font-size:12px;margin:22px 0}a{display:inline-flex;align-items:center;justify-content:center;gap:20px;background:#bca5f4;color:#151025;padding:13px 20px;min-height:48px;box-sizing:border-box;border-radius:10px;font-weight:650;text-decoration:none}a:hover{background:#d0bfff}a:focus-visible{outline:2px solid #fff;outline-offset:4px}@media(max-width:600px){.track-preview{padding:20px}li{grid-template-columns:90px minmax(0,1fr) 77px;gap:7px;font-size:11px}a{width:100%}}
  `}</style>
 </section></LocalizedContent>;
}
