# Investor Academy

Local/production route: `/learn/get-certified/`.

The curriculum snapshot comes from the Flutter app's `course_structure.dart`,
`questions.dart`, `answers.dart` and `survey.dart`. The export test is
`test/export_web_academy_test.dart` in the app checkout. It writes
`/private/tmp/academy-app-export.json`.

There are eight core Level 1 sections and one Advanced & Edge section (Level 2).
The website uses the app's 90% quiz pass mark. A certificate records course
completion; it is not professional accreditation.

## Data and synchronization

- Public snapshot: `data/learning/academy.json`; do not include `correctIndex` or
  `explanation` in the public questions.
- Answer-key snapshot: Firebase `functions/src/learning/academy.json`.
- Callable: `websiteAcademy` grades answers and writes the authenticated user's
  `users/{uid}/progress/onboarding_v1`, matching app lesson IDs and category names.
- Certificate and review-dismissal records: server-only
  `accountSecurity/{uid}/learning/academy`. Existing rules deny client access.
- Level 1 completion feeds the existing Ultra purchase eligibility check.
- Account access/profile/device rules remain in place. The mobile login exception
  is limited to `/login/?next=/learn/get-certified/`.

For curriculum refreshes, export from the app, bump the version in both snapshots,
keep answers only in the backend copy, run the checks, and deploy the backend and
website together. A mismatched version prompts a page reload rather than grading
against the wrong questionnaire.

## Review prompt

Show a neutral optional Trustpilot link after Level 1 completion for everyone,
including free, Pro and Ultra members. No billing lookup is required. No rating/sentiment filtering or incentive.
Review-link clicks record a server timestamp and level, separately from dismissals.
They do not prove a review was submitted. Level 1 dismissals do not prevent one
more invitation after Level 2; a recorded click at either level suppresses further
invitations. Each level can be dismissed separately. Existing legacy dismissal
records cannot distinguish clicks and remain Level 1 dismissals. Certificates
and Level 2 access never depend on reviewing. The Start Level 2 button remains
available after Level 1 regardless of the review prompt.

## Checks

Website: `node scripts/academy-check.cjs`, `node scripts/profile-onboarding-check.cjs`,
`node scripts/site-auth-check.cjs`, `node scripts/mobile-app-check.cjs`,
`node scripts/membership-check.cjs`, `npx tsc --noEmit --incremental false`.

Backend: `node --test test/academy.test.js test/ultraEligibility.test.js`.

## Website YouTube players

`data/learning/academy-youtube.json` maps app lesson IDs to individual YouTube videos.
The website uses a responsive privacy-enhanced YouTube embed and an external watch link.
Only mappings whose original app video URL still matches are used; unmapped or changed
app videos retain their hosted player. Do not substitute the long combined financial-analysis
video for individual lessons. Keep this mapping separate from the shared curriculum so
app exports do not erase it; quiz IDs, answers and progress do not change.

Pending individual YouTube matches:
- `starter_tips` — Starter Tips (`cfa/vertical/cfa5vertical.mp4`)
- `find_signals` — Where to Find Stock-Buying Signals (`cfa/vertical/cfa1vertical.mp4`)
- `portfolio_5k` — Building Your First $5,000 Portfolio (`beginners1.mp4`)
- `portfolio_100k_options` — Boosting a $10k+ Portfolio with Options (`beginners2.mp4`)
- `financial_analysis_intro` — Intro to Financial Analysis (`cfa/vertical/cfa2vertical.mp4`)
- `better_alternative` — Buy the Stock? Is there a Better Alternative? (`cfa/vertical/cfa1vertical.mp4`)
- `momentum` — Look at Momentum (`cfa/vertical/cfa4vertical.mp4`)
- `beta_volatility` — Look at Beta and Volatility (`cfa/vertical/cfa4vertical.mp4`)
- `eps_growth` — EPS (Earnings per Share) Growth (`cfa/vertical/cfa3vertical.mp4`)
- `pe_analysis` — PE (Price to Earnings) Analysis (`cfa/vertical/cfa3vertical.mp4`)
- `compare_eps` — Compare with Competitors EPS growth (`cfa/vertical/cfa4vertical.mp4`)
- `compare_pe` — Compare with Competitors PE (`cfa/vertical/cfa4vertical.mp4`)
- `ownership_data` — Ownership Data Analysis (`cfa/vertical/cfa3vertical.mp4`)
- `short_interest` — Short Interest Ratio Analysis (`cfa/vertical/cfa3vertical.mp4`)
- `social_hype` — Social Hype Analysis (`cfa/vertical/cfa3vertical.mp4`)
- `screen_alternatives` — Screen Through Alternatives (`cfa/vertical/cfa4vertical.mp4`)
- `review_predictions` — Review Predictions and Admin Portfolio Insights (`cfa/vertical/cfa5vertical.mp4`)

## Sequential learning

Learners use Next to review lessons in order; the selector permits revisiting unlocked lessons.
The section quiz appears only after all lessons are completed. Passing unlocks the next
section. Signed-in learners resume the first unread lesson in their first unpassed section.
The backend rejects out-of-order lesson completion and section skips. Existing passed
sections remain revisitable even if older app records omit individual lesson IDs.
Guests can browse the first section sequentially in the current session; sign in to record
completion and take assessments. Guest browsing does not issue certificates or update accounts.
