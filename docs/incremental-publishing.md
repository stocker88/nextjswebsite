# Incremental website publishing

The production workflow restores the most recent successfully deployed `cloudflare-site` artifact. It compares each dynamic route's page props and rendering assets against that export, generates changed/new pages, and retains unchanged HTML and immutable assets. Routes are independent, including `/es/`, `/de/`, `/fr/`, `/ja/` and `/ko/` paths. Static hubs and all sitemaps are refreshed during each build.

This covers the existing `getStaticPaths` routes: news, earnings/catalysts, options results, guides, company pages, prediction periods and localized equivalents. It still compiles the application and checks current page inputs; it does not promise zero build time. Changed shared components, CSS or client data can require all pages using those assets to render again. When only translation dictionaries change, matching per-language signatures permit retaining unaffected languages.

## Safety and deployment

- The baseline must come from a successful production deploy. A failed Search Console submission does not invalidate an otherwise successful deployment.
- No baseline or an expired artifact means a full build. Artifacts retain the existing one-day retention; the regular publishing schedule refreshes the baseline.
- A manual workflow run offers `full_build` to deliberately regenerate everything.
- Current `getStaticPaths` is authoritative. Deleted dynamic routes are not copied forward.
- Only matching props and compatible rendering assets qualify for reuse. Static assets referenced by retained pages are retained too.
- The Worker returns embedded Next.js navigation data for retained pages. The current build ID is accepted for retained HTML; unrelated build IDs are rejected. Updated pages requested by an old browser build return 404 so Next can perform a full page navigation.
- The complete merged export passes the existing sitemap, language, public-access and Cloudflare-size checks before deployment. A failed build leaves production unchanged.
- `__deployment.json` contains only build/signature hashes and is marked noindex.

Checks: `node scripts/incremental/check.cjs`, `node scripts/prediction-export-check.cjs`, and the isolated real-Next fixture `node scripts/incremental/check-next.cjs`.

The first incremental build after an older release has no signature metadata and uses HTML asset comparisons. Subsequent releases also have language-aware signatures. Shared-code releases can still be large; this deliberately favors correct HTML and compatible navigation over reusing stale pages.
