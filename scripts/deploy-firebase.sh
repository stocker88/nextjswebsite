#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${FIREBASE_PROJECT_ID:?Set FIREBASE_PROJECT_ID (for example stocker-fcda2)}"
: "${FIREBASE_SITE_ID:?Set the dedicated Firebase Hosting site ID to deploy}"
command -v gcloud >/dev/null || { echo "Install Google Cloud CLI and run gcloud auth login first." >&2; exit 1; }
command -v firebase >/dev/null || { echo "Install Firebase CLI and run firebase login first." >&2; exit 1; }
# The site must already exist; never overwrite another app's default Hosting site.
gcloud run deploy stocker-website --source . --project "$FIREBASE_PROJECT_ID" --region us-central1 --allow-unauthenticated --port 8080 --memory 1Gi --cpu 1 --min-instances 0 --max-instances 3 --timeout 60 --quiet
firebase target:apply hosting website "$FIREBASE_SITE_ID" --project "$FIREBASE_PROJECT_ID"
firebase deploy --only hosting:website --project "$FIREBASE_PROJECT_ID"
