import datetime as dt
import unittest
from target_date_performance import NY, evaluate, summarize, annualized_return

def stamp(day, hour=9, minute=30):
    return int(dt.datetime.fromisoformat(day).replace(hour=hour,minute=minute,tzinfo=NY).timestamp())

def bar(day, opening, closing):
    return dict(timestamp=stamp(day), date=day, open=opening, close=closing)

class TargetDateTests(unittest.TestCase):
    def test_annualization_and_invalid_durations(self):
        self.assertAlmostEqual(annualized_return(10,365),10)
        self.assertAlmostEqual(annualized_return(10,182.5),21)
        self.assertAlmostEqual(annualized_return(-10,182.5),-19)
        self.assertEqual(annualized_return(-100,30),-100)
        self.assertIsNone(annualized_return(10,0))
        self.assertIsNone(annualized_return(-101,30))

    def test_premarket_same_day_and_afterhours_next_session(self):
        early=evaluate({**self.signal,'timestampInt':stamp('2026-11-19',8)},self.bars,{},'2026-11-23')
        late=evaluate({**self.signal,'timestampInt':stamp('2026-11-19',17)},self.bars,{},'2026-11-23')
        self.assertEqual(early['entryDate'],'2026-11-19')
        self.assertEqual(late['entryDate'],'2026-11-20')
        self.assertGreaterEqual(late['entryTimestamp'],late['entryAfterTimestamp'])

    def setUp(self):
        self.signal=dict(id='one',symbol1='ABC',timestampInt=stamp('2026-11-19',10),targetDateInt=stamp('2026-11-21'),isShort=False)
        self.bars=[bar('2026-11-19',90,95),bar('2026-11-20',100,110),bar('2026-11-23',115,120)]

    def test_no_prepublication_entry_and_weekend_exit(self):
        r=evaluate(self.signal,self.bars,{},'2026-11-23')
        self.assertEqual(r['entryDate'],'2026-11-20')
        self.assertEqual(r['exitDate'],'2026-11-23')
        self.assertAlmostEqual(r['returnPct'],20)

    def test_future_target_and_hold_are_not_losses(self):
        self.assertEqual(evaluate(self.signal,self.bars,{},'2026-11-20')['status'],'target_pending')
        self.assertEqual(evaluate({**self.signal,'targetDateInt':0},self.bars,{},'2026-11-23')['status'],'hold_no_target')

    def test_later_recommendation_timestamp_is_respected(self):
        r=evaluate({**self.signal,'recommendationTimeInt':stamp('2026-11-20',10),'targetDateInt':stamp('2026-11-23')},self.bars,{},'2026-11-23')
        self.assertEqual(r['entryDate'],'2026-11-23')

    def test_benchmark_uses_identical_dates_and_short_direction(self):
        benchmark={b['date']:b for b in self.bars}
        r=evaluate({**self.signal,'isShort':True},self.bars,benchmark,'2026-11-23')
        self.assertAlmostEqual(r['returnPct'],-20)
        self.assertAlmostEqual(r['benchmarkPct'],20)
        self.assertAlmostEqual(r['excessPct'],-40)

    def test_missing_prices_and_stale_exit_not_fabricated(self):
        self.assertEqual(evaluate(self.signal,[],{},'2026-11-23')['status'],'price_data_unavailable')
        self.assertEqual(evaluate(self.signal,self.bars[:2]+[bar('2026-12-03',115,120)],{},'2026-12-03')['status'],'price_gap_over_7_days')

    def test_average_and_denominator_include_losses_and_flat(self):
        rows=[dict(status='completed',returnPct=v,holdingDays=3,exitDate='2026-11-23') for v in [20,-10,0]]+[dict(status='target_pending')]
        s=summarize(rows)
        self.assertEqual(s['completed'],3)
        self.assertAlmostEqual(s['meanReturnPct'],10/3)
        self.assertAlmostEqual(s['winRatePct'],100/3)
        self.assertEqual(s['averageLossPct'],-10)
        self.assertAlmostEqual(s['meanSimpleAnnualizedReturnPct'],(20-10)/3*365/3)
        self.assertEqual(s['simpleAnnualizedCount'],3)

if __name__=='__main__':unittest.main()
