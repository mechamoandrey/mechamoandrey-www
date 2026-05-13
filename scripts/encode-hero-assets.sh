#!/usr/bin/env bash
# Gera poster WebP + MP4/WebM otimizados para o hero (mesmo enquadramento, menor bitrate).
# Requer ffmpeg no PATH (incl. libx264; opcional libvpx-vp9 para WebM).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${HERO_VIDEO_SRC_URL:-https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4}"
OUT="$ROOT/public"

mkdir -p "$OUT"

echo "→ Poster (primeiro quadro) → $OUT/hero-poster.webp"
ffmpeg -y -hide_banner -loglevel error -i "$SRC" -vframes 1 -vf "scale='min(1920,iw)':-2" "$OUT/hero-poster.webp"

echo "→ MP4 (H.264, max largura 1280, CRF 28, faststart) → $OUT/hero-loop.mp4"
ffmpeg -y -hide_banner -loglevel error -i "$SRC" -an -vf "scale='min(1280,iw)':-2" \
  -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart \
  "$OUT/hero-loop.mp4"

if ffmpeg -hide_banner -encoders 2>/dev/null | grep -q libvpx-vp9; then
  echo "→ WebM (VP9, max largura 1280, CRF 35) → $OUT/hero-loop.webm"
  ffmpeg -y -hide_banner -loglevel error -i "$SRC" -an -vf "scale='min(1280,iw)':-2" \
    -c:v libvpx-vp9 -crf 35 -b:v 0 -row-mt 1 \
    "$OUT/hero-loop.webm"
else
  echo "(skip WebM: encoder libvpx-vp9 não disponível)"
fi

echo "Pronto."
echo "  MP4: defina NEXT_PUBLIC_HERO_VIDEO_SRC=/hero-loop.mp4 (ou URL absoluta no CDN)."
echo "  WebM (opcional): NEXT_PUBLIC_HERO_VIDEO_WEBM_SRC=/hero-loop.webm"
