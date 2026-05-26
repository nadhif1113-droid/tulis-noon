#!/bin/bash
# scripts/setup-mobile.sh
# One-shot setup untuk build Tulis Noon jadi native iOS + Android.
# Run di Mac (atau Linux untuk Android-only). Usage: bash scripts/setup-mobile.sh

set -e

echo "🚀 Tulis Noon Mobile App Setup"
echo "================================"
echo ""

# Step 0: Pastikan di root project
if [ ! -f "package.json" ]; then
  echo "❌ Error: Jalankan dari root project (di mana package.json berada)"
  exit 1
fi

# Step 1: Install deps
echo "📦 Step 1/5 — Install Node.js dependencies (termasuk Capacitor)..."
npm install
echo "✅ Done"
echo ""

# Step 2: Convert SVG icons → PNG
echo "🎨 Step 2/5 — Convert SVG icons to PNG..."
mkdir -p resources
if command -v rsvg-convert &> /dev/null; then
  rsvg-convert -w 1024 -h 1024 resources/icon.svg > resources/icon.png
  rsvg-convert -w 2732 -h 2732 resources/splash.svg > resources/splash.png
  echo "✅ Icons converted via rsvg-convert"
elif command -v magick &> /dev/null; then
  magick -background none -resize 1024x1024 resources/icon.svg resources/icon.png
  magick -background "#0a4d3c" -resize 2732x2732 resources/splash.svg resources/splash.png
  echo "✅ Icons converted via ImageMagick"
elif command -v sips &> /dev/null && command -v qlmanage &> /dev/null; then
  # macOS fallback — use Quick Look
  qlmanage -t -s 1024 -o resources/ resources/icon.svg > /dev/null 2>&1
  qlmanage -t -s 2732 -o resources/ resources/splash.svg > /dev/null 2>&1
  mv resources/icon.svg.png resources/icon.png 2>/dev/null || true
  mv resources/splash.svg.png resources/splash.png 2>/dev/null || true
  echo "✅ Icons converted via qlmanage (macOS native)"
else
  echo "⚠️  No SVG converter found."
  echo "    Install salah satu:"
  echo "      brew install librsvg     (recommended)"
  echo "      brew install imagemagick"
  echo "    Atau convert manual di https://cloudconvert.com/svg-to-png"
  echo "    Output: resources/icon.png (1024x1024) + resources/splash.png (2732x2732)"
fi
echo ""

# Step 3: Generate semua asset variants pakai @capacitor/assets
echo "🖼️  Step 3/5 — Generate semua icon/splash sizes untuk iOS + Android..."
if [ -f "resources/icon.png" ] && [ -f "resources/splash.png" ]; then
  npx @capacitor/assets generate --iconBackgroundColor '#0a4d3c' --iconBackgroundColorDark '#0a4d3c' --splashBackgroundColor '#0a4d3c' --splashBackgroundColorDark '#0a4d3c' || echo "⚠️ Asset generation skipped (perlu icon.png + splash.png)"
  echo "✅ All asset variants generated"
else
  echo "⚠️  Skipped — perlu icon.png & splash.png. Run convert manual."
fi
echo ""

# Step 4: Add native platforms
echo "📱 Step 4/5 — Add iOS + Android platforms..."

if [ ! -d "ios" ]; then
  echo "  → Add iOS platform..."
  npx cap add ios && echo "  ✅ iOS added"
else
  echo "  ⏭  iOS platform already exists"
fi

if [ ! -d "android" ]; then
  echo "  → Add Android platform..."
  npx cap add android && echo "  ✅ Android added"
else
  echo "  ⏭  Android platform already exists"
fi
echo ""

# Step 5: Sync
echo "🔄 Step 5/5 — Sync code ke native projects..."
npx cap sync
echo "✅ Done"
echo ""

echo "================================"
echo "🎉 Mobile setup selesai!"
echo "================================"
echo ""
echo "📝 Next steps:"
echo "  iOS:     npm run cap:open:ios       # buka di Xcode"
echo "  Android: npm run cap:open:android   # buka di Android Studio"
echo ""
echo "  Untuk pertama kali run di iOS:"
echo "    1. Di Xcode: Signing & Capabilities → pilih Team (perlu Apple Dev account \$99/yr)"
echo "    2. Bundle ID: app.tulisnoon.app"
echo "    3. Product → Run (Cmd+R) di simulator"
echo ""
echo "  Untuk pertama kali run di Android:"
echo "    1. Android Studio auto-sync Gradle"
echo "    2. Run (Shift+F10) di emulator atau device"
echo ""
echo "📖 Detail lengkap di MOBILE_BUILD.md"
