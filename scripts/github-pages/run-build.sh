#!/usr/bin/env bash
set -euo pipefail
# Leave headroom for the hosted runner, filesystem compression, and two Node workers.
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1536}"
monitor_resources() {
  while true; do
    printf '\nBuild resources at %s\n' "$(date -u +%FT%TZ)"
    free -m
    df -h "${WEBSITE_EXPORT_VOLUME:-.}"
    sleep 60
  done
}
monitor_resources &
resource_monitor_pid=$!
trap 'kill "$resource_monitor_pid" 2>/dev/null || true' EXIT
yarn build:pages
