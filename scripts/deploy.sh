#!/usr/bin/env bash
# Deploy situs ke Cloudflare Pages.
#
#   npm run deploy          (atau ./scripts/deploy.sh)
#
# Ganti nama proyek kalau perlu alamat lain:
#   PROJECT=nama-proyek-versi-2 npm run deploy
#
# Autentikasi — pilih salah satu, cukup sekali:
#   1. OAuth (paling mudah, sekali klik):
#        npx wrangler login
#   2. API token (kalau CLI tidak bisa membuka browser):
#        simpan token di ~/.cloudflare-pages-token
#      Token dibuat di https://dash.cloudflare.com/profile/api-tokens
#      dengan izin: Account → Cloudflare Pages → Edit.
#
# Setelah terautentikasi, perintah ini bisa dijalankan kapan pun. Setiap deploy
# menyimpan versi lama, jadi bisa dikembalikan lewat dashboard:
#   Workers & Pages → pilih proyek → Deployments → ⋯ → Rollback
set -euo pipefail
cd "$(dirname "$0")/.."

PROJECT="${PROJECT:-portfolio-dandie-v2}"
if [ "$PROJECT" = "dandielucky" ]; then
  echo "Deploy dihentikan: proyek dandielucky adalah portofolio lama. Gunakan nama proyek versi 2."
  exit 1
fi
WRANGLER="./node_modules/.bin/wrangler"
TOKEN_FILE="${HOME}/.cloudflare-pages-token"

if [ ! -d node_modules ] || [ ! -x "$WRANGLER" ]; then
  echo "→ memasang dependensi (sekali saja)…"
  npm install
fi

# API token dari file lokal (isinya tidak pernah dicetak ke layar)
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] && [ -f "$TOKEN_FILE" ]; then
  CLOUDFLARE_API_TOKEN="$(tr -d '\r\n' < "$TOKEN_FILE")"
  export CLOUDFLARE_API_TOKEN
  echo "→ memakai API token dari ${TOKEN_FILE}"
fi

if "$WRANGLER" whoami 2>&1 | grep -qi "not authenticated\|necessary to set a CLOUDFLARE_API_TOKEN"; then
  cat <<'MSG'
Belum terautentikasi ke Cloudflare. Jalankan salah satu:

  1) npx wrangler login
     browser terbuka, tekan Allow — cukup sekali untuk seterusnya

  2) atau simpan API token ke ~/.cloudflare-pages-token
     (buat di https://dash.cloudflare.com/profile/api-tokens
      dengan izin: Account → Cloudflare Pages → Edit)

Setelah itu ulangi: npm run deploy
MSG
  exit 1
fi

echo "→ build"
SITE_BASE= ASTRO_TELEMETRY_DISABLED=1 npm run build

echo "→ kirim ke Cloudflare Pages (proyek: ${PROJECT})"
"$WRANGLER" pages deploy dist \
  --project-name "$PROJECT" \
  --branch main \
  --commit-dirty=true

echo
echo "Selesai. Situs: https://${PROJECT}.pages.dev"
