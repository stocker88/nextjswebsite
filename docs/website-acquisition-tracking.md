# Website signup and app handoff measurement

The website emits GA4 `sign_up` only when Firebase reports a newly created account; returning authentication emits `login`. `app_store_click` covers direct links to our Apple/Google app listings. Explicit CTA callbacks and the global link listener share duplicate prevention. Review links are excluded. Campaign labels persist during the browsing session; handoff secrets are stripped from GA URLs.

Immediately after Firebase authentication, the website records the visit then calls authenticated `recordAccountAcquisition`, without waiting for a `users` profile or survey completion. This links the campaign to the Firebase UID using the backend's verified handoff token. Calls are single-flight and successful captures are cached for the arrival/session. Failed captures receive two bounded retries plus focus/online retries; there is no permanent polling timer. Browser account switches start a separate visit. Later app usage must use the same Firebase account. Existing backend acquisition purchase snapshots can join to this account, but are not a substitute for validated transaction webhooks or a complete revenue ledger.

New signup profiles offer an optional source question when automatic evidence is missing. Its answer is saved separately as `self_reported`; “Not sure” remains unknown. The native profile flow restores the same question and accepts the existing website recovery code. `signupContext` records the first capture platform/browser separately from the device most recently used. It is a capture context, not proof of where Auth creation happened.

The download panel offers “I’ve installed it — open the app” to deliver the verified visitor credentials to the installed app after saving the visit. A seven-day recovery code remains available. Neither mechanism silently identifies an anonymous iOS install; the user must return/open or enter the code, or sign in to the same website-created account.

Opening Instagram links in Safari may lose browser cookies and the referring domain. Preserve `referrerUid` (or the supported referral route) **and** campaign tags in the external-browser URL. A referrer ID alone identifies the inviter, not Instagram. Do not fingerprint devices or merge accounts based solely on an IP address.

Rollout: deploy `recordAccountAcquisition`, `trackSignupProfileCreated`, the updated `matchReferral` and the support acquisition endpoint before the website. Profile creation retries verified referral credit, with the existing transaction preventing duplicate credit. Native changes require a new app release. Existing missing attribution cannot be reconstructed without evidence.

## Instagram paid campaigns

Use explicit campaign tagging, for example:
`?utm_source=instagram&utm_medium=paid_social&utm_campaign={{campaign.id}}&utm_content={{ad.id}}&ad_group={{adset.id}}`

Separate Instagram-only placements or use an appropriate dynamic source label for mixed Facebook/Instagram delivery. Test the final resolved ad destination, not the literal template.

The measurable website path is campaign visit -> completed signup -> store click -> same account in app -> recorded purchase. A store click is not an installation. For iOS first installs without a website account or recovery handoff, arbitrary website campaign identity cannot automatically survive the App Store.

## Remaining production/account setup

- Deploy the website changes and validate `sign_up`, `login`, and `app_store_click` in GA4 DebugView/Realtime. Mark `sign_up` as a key event if desired. Do not sum legacy getTheAppClicked/storeClick with app_store_click.
- Configure Meta app attribution through a supported native SDK or mobile measurement partner, and connect RevenueCat's Meta integration for purchase delivery. Credentials and Meta/RevenueCat dashboard setup are still required. Campaign attributes alone do not send purchase conversions to Meta.
- Use verified RevenueCat/Stripe payment events for revenue, refunds and renewals with transaction-ID deduplication. Do not label a checkout click as purchase or send duplicate SDK/server purchase events.
- Respect consent/ATT. iOS reporting can be aggregated or unavailable; do not present inferred attribution as verified individual attribution.
- End-to-end test with a tagged campaign, new account, store handoff and sandbox purchase before declaring the full funnel verified.

Reference: https://www.revenuecat.com/docs/integrations/attribution/meta-ads

Checks: `npm run typecheck`, `node scripts/acquisition-check.cjs`, `node scripts/analytics-check.cjs`.
## Native iPhone fallback remains enabled

After an iPhone account's profile is saved, `matchReferralAfterSignup` still
calls the legacy `matchReferral` endpoint. A recent, unconsumed referral click
can match the app request's IP within 48 hours. This is best-effort, not device
recognition: shared networks can cause false matches and network changes can
miss matches. It searches referral clicks, not every anonymous website visit.

Verified website handoffs are credited before this fallback, including when
their background trigger has not run yet. IP matches are stored separately as
`inferredTouch` with `ip_best_effort` evidence; they do not replace verified
first-touch data. A click already claimed by another account is not reused.

Read-only daily audit: `node scripts/account-origins-report.js YYYY-MM-DD`
in the backend functions directory (Dubai day). Its denominator is Firebase
Auth account creation, including incomplete profiles. Add `--accounts` only
when individual UID/username details are needed; the default output is aggregate.
