#!/usr/bin/env bash
# Hosted CI only: transparent compression keeps the expanded static export within disk limits.
set -euo pipefail
[[ "${GITHUB_ACTIONS:-}" == "true" && "${RUNNER_OS:-}" == "Linux" ]] || { echo 'This helper is only for the Linux GitHub runner.' >&2; exit 1; }
image=/mnt/website-language-build.img
volume=/mnt/website-language-build
[[ ! -e "$image" && ! -e "$volume" ]] || { echo 'Build volume already exists; refusing to replace it.' >&2; exit 1; }
if ! command -v mkfs.btrfs >/dev/null; then sudo apt-get update -qq && sudo apt-get install -y -qq btrfs-progs; fi
sudo mkdir "$volume"
sudo truncate -s 200G "$image"
sudo mkfs.btrfs -q "$image"
sudo mount -o loop,compress=zstd:3 "$image" "$volume"
sudo chown "$(id -u):$(id -g)" "$volume"
printf 'WEBSITE_EXPORT_VOLUME=%s\n' "$volume" >> "$GITHUB_ENV"
echo 'Prepared an isolated compressed filesystem for generated website files.'
