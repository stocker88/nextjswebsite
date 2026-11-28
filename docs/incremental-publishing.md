# Incremental website publishing

The production workflow restores the most recent successfully deployed `cloudflare-site` artifact. It compares each dynamic route's page props and rendering assets against that export, generates changed/new pages, and retains unchanged HTML and immutable assets. Routes are independent, including `/es/`, `/de/`, `/fr/`, `/ja/` and `/ko/` paths. Static hubs and all sitemaps are refreshed during each build.

This covers the existing `getStaticPaths` routes: news, earnings/catalysts, options results, guides, company pages, prediction periods and localized equivalents. It still compiles the application and checks current page inputs; it does not promise zero build time. Changed shared components, CSS or client data can require all pages using those assets to render again. When only translation dictionaries change, matching per-language signatures permit retaining unaffected languages.

## Safety and deployment

- The baseline must come from a successful production deploy. A failed Search Console submission does not invalidate an otherwise successful deployment.
- For code releases, no baseline or an expired artifact means a full build. Content-only runs fail safely instead. Artifacts retain the existing one-day retention; the regular publishing schedule refreshes the baseline.
- Scheduled and repository-dispatch runs are content-only. Manual runs default to content-only; incompatible rendering assets stop publication rather than forcing a broad rebuild. A successful shared-code release must establish the compatible baseline first.
- A manual workflow run offers `full_build` to deliberately regenerate everything.
- Current `getStaticPaths` is authoritative. Deleted dynamic routes are not copied forward.
- Only matching props and compatible rendering assets qualify for reuse. Static assets referenced by retained pages are retained too.
- The Worker returns embedded Next.js navigation data for retained pages. The current build ID is accepted for retained HTML; unrelated build IDs are rejected. Updated pages requested by an old browser build return 404 so Next can perform a full page navigation.
- The complete merged export passes the existing sitemap, language, public-access and Cloudflare-size checks before deployment. A failed build leaves production unchanged.
- `__deployment.json` contains only build/signature hashes and is marked noindex.

Checks: `node scripts/incremental/check.cjs`, `node scripts/prediction-export-check.cjs`, and the isolated real-Next fixture `node scripts/incremental/check-next.cjs`.

The first incremental build after an older release has no signature metadata and uses HTML asset comparisons. Subsequent releases also have language-aware signatures. Shared-code releases can still be large; this deliberately favors correct HTML and compatible navigation over reusing stale pages.

## Publisher audit (November 28, 2026)

All website routes publish through the same atomic deployment to avoid two publishers overwriting each other's pages. Individual unchanged dynamic pages are retained; jobs do not deploy truncated exports. Static indexes, sitemaps and feeds refresh with the resulting release. This still compiles the app and scans inputs, so it is not a standalone single-file upload service.

| Producer/feed | Routes | Trigger |
| --- | --- | --- |
| Earnings reviews and mover/sector reports | `/news/[slug]/` | Shared `website_build.request_build`, plus scheduled sync |
| Earnings previews, daily and weekly outlooks | `/catalysts/[slug]/` | Market-briefing publisher / scheduled sync |
| Premarket, post-close and weekly market recaps | `/news/briefings/[slug]/` | Market-briefing publisher / scheduled sync |
| Stock research, news and rumor coverage supplied by the research feed | `/stock-market-news/[id]/`, `/posts/[slug]/` | Research feed sync; no separate rumor route found |
| Options results | `/results/[slug]/` | Saved results feed sync |
| Insider/fund disclosures | `/insider-news/[slug]/`, investor pages | Smart-money and insider sync |
| Earnings calendars and company research | Calendar, company and instrument routes | Earnings/research sync |
| Prices, predictions, comparisons and macro tools | Corresponding instrument and tool routes | Market-history, crypto, sentiment, macro and IPO refreshes |
| Guides, learning and legal pages | Their existing routes | Repository code/content changes |

Locale routes are evaluated separately wherever translations exist. This does not create translations for English-only news articles.

The external earnings-preview publisher currently has an explicit `blocked_single_page_deployment` guard. Do not remove it merely because this incremental workflow exists: its requirement is a separately validated isolated-page publication path. Its stored articles remain eligible for scheduled sync. No external publisher, notification, approval, or visibility guards were changed in this audit.
