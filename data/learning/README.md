# Public course library

The catalog is a saved snapshot of all available videos in the three instructor playlists configured in `scripts/sync-learning.py`. Titles, descriptions, publication dates and durations come from public YouTube metadata; editorial course summaries live in `lib/learning.ts`.

Run `npm run sync:learning` manually to refresh the catalog, inspect the diff, then rebuild/deploy the website. The build does not scrape YouTube. The importer validates the channel, follows playlist continuations, and refuses to replace the snapshot if videos are missing or the library shrinks unexpectedly. Investigate legitimate playlist removals before explicitly replacing that snapshot.

Captions are included only when the public endpoint returns them. The first snapshot contains 31 videos with original descriptions and no retrievable transcripts. Never invent transcripts or describe these notes as transcripts.

Routes: `/learn/`, `/learn/courses/[slug]/`, `/learn/watch/[id]/`. All pages are public and statically generated. Their URLs appear in the main sitemap; video metadata also appears in `/video-sitemap.xml` and each lesson’s VideoObject structured data. Updating source files makes pages eligible for discovery after deployment; indexing is controlled by search engines.

Founder credentials are on `/authors/aness-hussein-ali/`; the founder-supplied diploma is in `public/assets/credentials/`. Program ranking claims cite their source and year. Reviews at `/reviews/` link to all three source platforms without a combined rating or AggregateRating markup.
