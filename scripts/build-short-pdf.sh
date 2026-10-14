#!/bin/sh
# Rebuilds the static Short PDF that the portfolio viewer downloads (instant, served from the CDN).
# Run after changing anything that appears in the Short version, with `vercel dev --listen 3112` running:
#   sh scripts/build-short-pdf.sh
set -e
OUT="$(dirname "$0")/../portfolio/Vivien-Evers_Portfolio_Short_2026.pdf"
curl -f -s -o "$OUT" "http://localhost:3112/api/portfolio-pdf?v=short&h=13"
echo "Wrote $OUT ($(wc -c < "$OUT") bytes)"
