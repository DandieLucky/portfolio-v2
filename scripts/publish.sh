#!/usr/bin/env bash
# Build dan terbitkan HANYA ke repositori versi 2.
set -euo pipefail
cd "$(dirname "$0")/.."

EXPECTED_REPO="DandieLucky/portfolio-v2"
SITE="https://dandielucky.github.io/portfolio-v2/"
MSG="${1:-Perbarui portofolio versi 2}"

# Periksa URL fetch DAN push sebelum build, stage, atau commit.
check_remote() {
  local remote_url="$1"
  case "$remote_url" in
    https://github.com/DandieLucky/portfolio-v2|https://github.com/DandieLucky/portfolio-v2.git|git@github.com:DandieLucky/portfolio-v2|git@github.com:DandieLucky/portfolio-v2.git|ssh://git@github.com/DandieLucky/portfolio-v2|ssh://git@github.com/DandieLucky/portfolio-v2.git) return 0 ;;
    *) return 1 ;;
  esac
}
FETCH_URL="$(git remote get-url --all origin 2>/dev/null || true)"
PUSH_URL="$(git remote get-url --push --all origin 2>/dev/null || true)"
if ! check_remote "$FETCH_URL" || ! check_remote "$PUSH_URL"; then
  echo "Publikasi dihentikan: origin harus menunjuk https://github.com/${EXPECTED_REPO}.git"
  echo "Periksa folder dengan pwd dan koneksi dengan git remote -v."
  echo "Repo portofolio lama tidak boleh digunakan untuk versi 2."
  exit 1
fi
if [ "$(git branch --show-current)" != "main" ]; then
  echo "Publikasi dihentikan: pindah ke branch main setelah menyimpan perubahanmu."
  exit 1
fi

echo "→ memeriksa build versi 2"
SITE_BASE=/portfolio-v2 ASTRO_TELEMETRY_DISABLED=1 npm run build

echo "→ simpan perubahan"
git add -A
if git diff --cached --quiet; then
  echo "   tidak ada perubahan baru untuk di-commit."
else
  git commit -m "$MSG"
fi
git push origin HEAD:main
COMMIT_SHA="$(git rev-parse HEAD)"

if command -v gh >/dev/null 2>&1; then
  echo "→ menunggu GitHub menerbitkan commit ini"
  RUN_ID=""
  for attempt in 1 2 3 4 5 6 7 8 9 10; do
    RUN_ID="$(gh run list --repo "$EXPECTED_REPO" --workflow deploy.yml --commit "$COMMIT_SHA" --limit 1 --json databaseId --jq '.[0].databaseId' 2>/dev/null || true)"
    if [ -n "$RUN_ID" ] && [ "$RUN_ID" != "null" ]; then break; fi
    sleep 3
  done
  if [ -n "$RUN_ID" ] && [ "$RUN_ID" != "null" ]; then
    if ! gh run watch "$RUN_ID" --repo "$EXPECTED_REPO" --exit-status --interval 5; then
      echo "Build/deploy gagal. Cek https://github.com/${EXPECTED_REPO}/actions"
      exit 1
    fi
  else
    echo "Commit sudah terkirim. Pantau proses di https://github.com/${EXPECTED_REPO}/actions"
  fi
else
  echo "Commit sudah terkirim. Pantau proses di https://github.com/${EXPECTED_REPO}/actions"
fi

echo "Situs versi 2: $SITE"
