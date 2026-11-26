# IWV prediction coverage

Universe: `data/iwv-universe.json`, dated November 24, 2026. IWV ETF holdings are a proxy, not official complete Russell 3000 membership. Unsupported/unlisted holdings were excluded in the original import audit.

The website refreshes at most 60 due companies per build through `iwvResearchSnapshot`, with six concurrent requests and a minimum 2.5-second gap between starts. API credentials remain on the backend. All provider calls use the existing shared 240/minute limiter, below the Starter 300/minute allowance. Failure retry dates and snapshots survive in the GitHub Actions cache. There is an eight-minute refresh budget per normal build.

Prices and company research refresh every three days; annual financial statements at most monthly. Existing provider caches further reduce calls. Missing or invalid history does not produce new prediction pages. Financial values remain null when unavailable; statements join only matching fiscal dates and currencies. Existing URLs and cached research are retained.

Prediction HTML contains complete SEO metadata, chart data and content. Cloudflare serves HTML and other existing assets directly. The small fallback Worker returns the identical Next.js navigation payload embedded in each prediction page, replacing duplicate `_next/data` files. It rejects obsolete build IDs and missing pages. `cloudflare-check.cjs` still enforces the 100,000-file and 25 MiB-per-file limits.

The deployed backend source is preserved in `/Users/aness/Documents/firebase/functions/src/research/iwvResearchSnapshot.js`, `iwvFinancials.js` and `iwv-universe.json`, exported by that project's `index.js`. It is restricted to approved holdings and stores research through the existing atomic backup/lease helpers. No user/member content is exposed and no app posts or notifications are created.

Publication makes valid pages discoverable through the sitemap. Search Console submission requests recrawling; Google decides whether and when to index them.
