# Options intelligence

## What is implemented

The Firebase `optionsIntelligenceRefresh` job scans the existing saved chains every 15 minutes, 09:00–17:59 New York time on weekdays. It makes **zero** provider calls, preserves the existing shared budget and kill switch, and writes one replaceable report plus one daily history document under `optionsActivity/intelligence`. The public report only uses SPY, QQQ and the public market-cap universe; private analyst signal membership is excluded.

The website's **Call intelligence** tab requests `?view=intelligence` from the existing options endpoint. Both the Firebase public endpoint (static site) and Next.js proxy (server site) support this view. The public response is allowlisted. No market rows are invented when data is missing.

Candidate rules: standard calls, 30–120 DTE, >=500 daily contracts, volume strictly above OI (zero OI is allowed without an infinite ratio), strikes -2% through +15% from the supplied stock price, and estimated session premium >=$250k when daily VWAP exists. When the provider omits the stock price, a same-session dated reference price may supply moneyness; the dashboard labels that basis. Older reference prices do not qualify. Missing VWAP stays unknown and can be excluded with the dashboard filter. Daily premium is **not** per-trade premium or net buying. VWAP is collected on future provider pages; existing records are not backfilled using last price.

Score: 30 base +20 for available qualifying VWAP premium + up to 20 for volume/OI (zero OI gets 10) + up to 20 for relative volume. It ranks evidence, not investor sophistication or probability of profit. Current maximum is 90.

Current chains cover monthly expiries within 90 days, a limited strike band and capped pagination. A 120-day screener cannot create uncollected expiries. A report uses the latest activity date present across the public chains, accepting only today or the immediately previous exchange session. On weekends/holidays only the previous session is accepted. The pre-open collector usually supplies the previous session: its batch date is not treated as its activity date. Before collection completes it can legitimately have no candidates. All included contract activity must carry that same session date; stale chain rows never get promoted.

## Strict trade-flow classifier

`optionsIntelligenceCore.classifyFlow(contract, sessionDay, session)` is a tested, fail-closed adapter for a future licensed trade feed. It is not wired to fabricated data or the latest quote. `session` must have:

- `contractId`, `day`, `complete: true`, `trades`.
- Every trade: provider-unique `id`, ISO `time`, `price`, integer `size`, historical NBBO `bid`, `ask`, ISO `quoteTime`, and provider-established boolean `multileg`.
- Quotes must precede the trade by at most two seconds and have an unlocked spread. Exact duplicate IDs are deduplicated; conflicting IDs, cancellations/corrections, missing quote/leg evidence or session-volume mismatch reject classification. A real ingestion adapter must reconcile cancellations and corrections before submitting the complete session.

The classifier requires >=$250k actual traded premium, >=70% volume at/above ask, <=10% known multileg volume and at least one single-leg ask-side trade >=$50k. It retains unconfirmed opening status. Buyer identity and opening/closing intent cannot be inferred. It does not claim sweep detection from timestamps alone. No production flow collector is installed: current Massive chain snapshots lack historical quote joins and full trade/condition data.

## Release

Backend source: `/Users/aness/Documents/firebase/functions`.

1. Run `node --test test/optionsIntelligence.test.js test/optionsIntelligenceJob.test.js test/optionsBudget.test.js test/optionsPerformance.test.js` there.
2. Deploy only `optionsIntelligenceRefresh`, `optionsPublicSnapshots`, `optionsSnapshots`, `optionsQueueWorker` from the Firebase project. The worker deployment enables future daily VWAP collection; scheduler deployment activates the new job. Existing data-provider/display permissions and controls still apply.
3. Deploy the website through its established release process. No new frontend secrets or provider subscription are needed for the candidate report.
4. Verify report generation and partial-coverage labels after the next collection. Confirm the public report excludes private universe fields and raw provider credentials.

Backend deployed to `stocker-fcda2`: `optionsIntelligenceRefresh`, `optionsPublicSnapshots`, `optionsSnapshots`, and `optionsQueueWorker`. The scheduler is enabled in `europe-west2` (the project App Engine region), while the functions run in `us-central1`. The first run completed successfully. The public website release remains pending; source changes and a local preview are available. Firebase reported a build-image cleanup warning after successful deployment; only old deployment build artifacts should be reviewed for cleanup. A licensed trade-and-quote source with reliable multileg conditions is needed to activate actual ask-side flow; connect it to a reconciled session store and the strict classifier before setting `flowAvailable` true. Do not replace unknown fields with assumed values. Prefer a separate budgeted, checkpointed collector for trade/quote data rather than spending the existing chain budget on per-print quote lookups.

## Next improvements

Prioritize intraday chain refresh and full 30–120 DTE coverage after measuring subscription/budget headroom, then trade/quote ingestion and correction reconciliation. Add next-session OI corroboration with comparable dates, per-ticker baselines matched to time of day, sector/expiry concentration, earnings context, repeated activity across strikes, and paper outcome tracking including failed signals. Build watchlist alerts only after freshness and duplicate-delivery checks are in place. Avoid institution/bullish labels based solely on call volume.

References: https://massive.com/docs/rest/options/snapshots/option-chain-snapshot ; https://docs.unusualwhales.com/features/2-options-flow/ ; https://docs.unusualwhales.com/faq/items/4-flow/

## Verified production run

The final bounded-memory run generated a report at 2026-11-02T21:39:01.318Z for the October 30 activity session, with 11 volume candidates in QQQ and partial chain coverage. Same-session reference prices were explicitly labeled. Flow remained unavailable; none of these records is asserted to be an individual $50k buy. The job now uses 512 MB and reads four chains at a time. The stock/ADR-only constraint from the reference screener is not this report's universe: it includes public large-cap stocks plus SPY/QQQ benchmarks.
