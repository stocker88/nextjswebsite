# Search and public research operations

## Hosting and deployment
The website is prepared for Firebase Hosting in front of a Next.js standalone server on Cloud Run. GitHub Pages cannot serve these dynamic routes. The old Pages workflow is disabled; it does not delete the currently published site.

1. Install Google Cloud CLI and Firebase CLI, then authenticate with `gcloud auth login` and `firebase login`.
2. Use the existing project `stocker-fcda2` with billing enabled. Enable Cloud Run, Cloud Build and Artifact Registry APIs in its console. The deploying account needs the relevant build, service-account and deployment permissions.
3. Create a **dedicated** Firebase Hosting site (for example an available `stocker-website` name) in the Firebase console. Do not select a site that serves the existing app. Keep the GitHub custom domain unchanged for now.
4. From the website repository run `FIREBASE_PROJECT_ID=stocker-fcda2 FIREBASE_SITE_ID=YOUR_DEDICATED_SITE_ID npm run deploy`. The script builds remotely using Docker, deploys Cloud Run, and deploys only the website Hosting target. It does not deploy or change Firebase Functions.
5. Test the Firebase site's web.app URL, representative research pages, unknown-page 404, sitemap.xml, news pagination and app buttons. Check the Cloud Run logs. The canonical URLs intentionally remain www.stockstobuynow.ai.
6. Add www.stockstobuynow.ai as a custom domain on the dedicated Hosting site. Follow Firebase's exact verification and DNS values. Keep the old GitHub site available until Firebase's certificate and domain are healthy. Then switch DNS and verify both root/www behavior. DNS changes are not automated here.

Cloud Run scales to zero and caps at three instances in the supplied command. This can introduce cold-start latency and usage charges. Increase minimum instances only if that tradeoff is wanted. Cloud Run's local ISR cache is per instance and can disappear on restart; rebuilding on demand remains safe. `pinTag` keeps the Hosting release tied to its Cloud Run revision. Roll back Hosting and its pinned revision together if necessary.

## What refreshes
The existing Firebase refreshWebsiteFeeds job produces the public news/signals snapshot every 30 minutes. The website checks the preview API cache every minute and rendered pages become eligible for on-request regeneration every minute. This avoids layering another full 30-minute website cache over the Firebase schedule. An idle page regenerates when visited; it is not an exact deadline or a guarantee of Google recrawling. Existing browser tabs do not automatically poll the full archive.

## Content publication
Do not expose full Firebase member text by default. `educationPreview` remains limited to its approved preview. Full articles are separate public editorial content in data/public-articles.json. Prepare a JSON object with postId, summary, paragraphs[], sources[{title,url}], author{name,url}, reviewer, publishedAt, updatedAt, aiAssisted, disclosure, optional correction, and approved:true. Run `npm run publish:article -- /path/to/article.json`. Review the diff, build and deploy. A timestamp is not proof of review: the named reviewer must actually check primary evidence, all numbers, attribution and rights. Do not publish copied news text or invented price catalysts.

## Market data integration remaining
Select a commercial provider and confirm public web display/redistribution rights. FMP commercial is a candidate for fundamentals and earnings; Twelve Data business is another for quotes/charts. Configure a server-only key using the hosting secret manager, not NEXT_PUBLIC variables or client JS. Public quote records need symbol, exchange/currency, observedAt, delay/session labels, source and license attribution. Earnings need fiscal period, actual/estimate distinction, reporting date confirmation and sources. Store the last valid snapshot on provider failure; label stale data and never replace missing values with zero. Current ticker pages do not claim to show live quotes. Earnings/forecast framework pages remain noindex and outside the sitemap until unique sourced data is integrated.

## Automated article production design
Schedule ingestion of licensed headlines, company releases and earnings events. Deduplicate by source URL/event ID, store evidence and observed timestamps, and draft a public article from those sources. Separate reporting from inference; require a reason for calling a move 'because of' an event. Validate numeric claims against source fields and mark disagreements. Route drafts to a human reviewer; only approved source-supported records enter the public article projection. No automated generation service or paid API has been activated without provider credentials and an editorial source feed.

## Search Console and measurement
Verify domain ownership in Google Search Console; submit https://www.stockstobuynow.ai/sitemap.xml. Inspect representative ticker, article and archive-page URLs. Test structured data using Google's Rich Results Test. Monitor impressions, query intent, indexing exclusions and Core Web Vitals. Existing app_store_click events now include landing_page, landing_referrer and UTM fields; configure the event as a GA4 key event if appropriate. App install/subscription attribution requires the mobile attribution/deep-link integration; a website click is not a confirmed subscription.

## Social distribution
Prepare genuinely useful, source-linked summaries for YouTube descriptions, LinkedIn and relevant communities. Link each item to its relevant research URL rather than always the homepage. Do not automate unsolicited forum promotion or claim third-party endorsements. Account access and explicit posting approval are required before changing external profiles or publishing messages.

## Release checks
Run npm run test:seo, type-check with the project's TypeScript version, then npm run build. Check desktop/mobile HTML, canonical URLs and sitemap links. Test a new article's URL before promoting it. No rankings, rich results or AI citations are guaranteed by schema or content volume.

## Validation completed locally
TypeScript and the production Next.js build passed. Production-server checks verified the homepage, NVDA hub, news pages 1/2, earnings framework and glossary return 200; unknown tickers/pages return 404; the legacy NVDA route returns 308; JSON-LD parses; and sitemap includes ticker hubs but excludes unfinished earnings/forecast content. The news page serializes 40 previews (approximately 11 KB in the checked response), rather than the full archive. The Docker image was built successfully in Google Cloud Build and deployed to Cloud Run, behind the dedicated Firebase Hosting site.

## Deployment completed
Project: stocker-fcda2. Hosting site: stocker-marketing-website. Preview URL: https://stocker-marketing-website.web.app. Cloud Run service: stocker-website in us-central1. The existing default Hosting site was not modified. Namecheap DNS and www.stockstobuynow.ai still point to the original host. Next, add the apex/www custom domains to this dedicated Firebase site and use the exact DNS records supplied by Firebase after validating the preview.
