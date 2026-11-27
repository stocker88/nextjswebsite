# Research-page localization

English remains at the original URLs. Spanish, German, French, Japanese and Korean use `/es/`, `/de/`, `/fr/`, `/ja/` and `/ko/`. New-language scope is prediction directory, stock overview/horizon pages, Fear & Greed and Pentagon Pizza. Articles/headlines stay in their original language. Unsupported destinations retain their English URL.

The route files delegate to shared components and data loaders. Edit shared components/CSS once to change layout, chart logic or behavior across languages. Catalog JSON contains fixed, server-rendered translations; no browser translation provider or per-view API is needed. Market values and symbols come from the same feeds. The selector preserves the stock/horizon; prediction period changes use shallow routing without a page reload.

When changing copy:
1. Update the source and each applicable catalog in `data/localization/`. Prefer complete `message()` templates with named placeholders instead of sentence fragments.
2. Run `npm run test:localization`. The copy baseline detects changes to JSX text, visible string attributes and `t/message` calls in shared localized components. It is a review guard, not proof of translation completeness or a replacement for linguistic review. Dynamic provider content still requires explicit mapping.
3. Review new text in all languages. Then acknowledge the source-copy baseline with `node scripts/localization/copy-check.cjs --update` and rerun checks. Do not update it merely to hide missing translations.
4. Check rendered HTML and mobile/desktop layouts. Canonicals, hreflang, HTML language and sitemap alternates use the same locale registry in `lib/localization/routes.ts`.

Catalog parity and placeholder checks prevent missing entries among the four new languages. Localized sitemap entries inherit the existing English freshness/eligibility rules. Publication and search-engine indexing are separate steps; local routes are not live or indexed until deployment/crawling.
