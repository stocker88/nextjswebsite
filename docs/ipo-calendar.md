# IPO calendar

Public page: `/ipo-calendar/`. Shared app JSON: `/data/ipo-calendar.json`.

Source: Nasdaq public IPO calendar (EDGAR Online); current and next two months. Expected dates are pricing estimates, not guaranteed trading dates. Filed, expected, priced and withdrawn remain distinct. Missing fields remain null.

The existing half-hourly Pages workflow checks whether the snapshot is seven days old. Only then does it fetch three provider months. State is preserved in Actions cache and the deployed JSON is a recovery copy. Failed attempts retain last good data and defer retry for 24 hours. The original update timestamp is never advanced on failure. First-ever failure without a snapshot fails the job.

Manual refresh: `node scripts/sync-ipo-calendar.cjs --force`, then publish the updated `data/ipo-calendar.json` and `public/data/ipo-calendar.json`.

Tests: `node scripts/ipo-calendar-check.cjs`. Static-export verification checks page, sitemap, app JSON and calendar link.

Native app entry: Market calendar → Upcoming IPOs, in `lib/ui/calendar/ipo_calendar_page.dart`. The app downloads the same public snapshot with a timeout, refresh control and stale/error notices. Source changes ship via the normal app release process.
