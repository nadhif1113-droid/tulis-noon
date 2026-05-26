# 📱 Build Tulis Noon jadi App iOS + Android

Guide step-by-step buat ubah web app jadi aplikasi native yang bisa di-install dari App Store + Google Play.

**Strategi**: Pakai **Capacitor** (open-source dari Ionic) yang wrap Next.js jadi native WebView app. **1 codebase, deploy ke 2 store.**

Karena `capacitor.config.ts` set `server.url = 'https://tulis-noon.vercel.app'`, **setiap deploy Vercel = update otomatis** ke semua app native — tanpa rebuild & resubmit ke store. Cuma butuh rebuild saat ubah icon/splash/permissions.

---

## ⚡ TL;DR — One-Liner Setup di Mac

```bash
# Di folder project (Mac/Linux):
cd ~/Documents/GitHub/tulis-noon
bash scripts/setup-mobile.sh
```

Script ini auto-jalanin: install deps, convert icon SVG→PNG, generate semua variant, add iOS + Android platforms. ~5-10 menit.

Setelah selesai:
```bash
npm run cap:open:ios       # buka Xcode (iOS)
npm run cap:open:android   # buka Android Studio (Android)
```

---

## 📋 PRASYARAT

### Untuk iOS App:
- ✅ **Mac** (wajib — gak bisa di Windows/Linux)
- ✅ **Xcode** 15+ (free, install dari App Store, butuh ~15 GB disk)
- ✅ **Apple Developer Account** $99/tahun ([daftar](https://developer.apple.com/programs/enroll/))

### Untuk Android App:
- ✅ **Mac / Windows / Linux** (semua bisa)
- ✅ **Android Studio** ([download](https://developer.android.com/studio), free, ~5 GB)
- ✅ **Google Play Console** $25 sekali bayar ([daftar](https://play.google.com/console/signup))

### Common:
- Node.js 18+ (kamu sudah punya untuk Next.js)
- npm
- (Optional tapi recommended) `librsvg` untuk auto-convert SVG → PNG:
  ```bash
  brew install librsvg
  ```

---

## 🚀 SETUP STEP-BY-STEP

### Step 1: Install Capacitor Dependencies

```bash
cd ~/Documents/GitHub/tulis-noon
npm install
```

Ini install semua Capacitor plugins: core, ios, android, splash-screen, status-bar, haptics, app, keyboard, network, dll.

### Step 2: Convert Icon SVG → PNG

App butuh PNG, bukan SVG. Source SVG sudah disediakan:
- `resources/icon.svg` (1024×1024 — app icon)
- `resources/splash.svg` (2732×2732 — splash screen)

**Cara convert (pilih salah satu):**

**Opsi A — Pakai librsvg (recommended):**
```bash
brew install librsvg
rsvg-convert -w 1024 -h 1024 resources/icon.svg > resources/icon.png
rsvg-convert -w 2732 -h 2732 resources/splash.svg > resources/splash.png
```

**Opsi B — Pakai macOS native:**
```bash
qlmanage -t -s 1024 -o resources/ resources/icon.svg
qlmanage -t -s 2732 -o resources/ resources/splash.svg
mv resources/icon.svg.png resources/icon.png
mv resources/splash.svg.png resources/splash.png
```

**Opsi C — Online (paling gampang):**
1. Buka https://cloudconvert.com/svg-to-png
2. Upload `resources/icon.svg`, set width=1024 height=1024, convert, download as `icon.png`
3. Ulangi untuk `splash.svg` (2732×2732 → `splash.png`)
4. Simpan ke folder `resources/`

**Opsi D — Bikin custom icon:**
Ganti `resources/icon.svg` & `resources/splash.svg` dengan design kamu (atau langsung edit `resources/icon.png` di Figma/Canva → export 1024×1024 PNG).

### Step 3: Generate Semua Icon Variants

iOS butuh icon dalam ~15 ukuran (20×20 sampai 1024×1024). Android butuh adaptive icon (foreground + background). Capacitor Assets handle ini otomatis:

```bash
npx @capacitor/assets generate \
  --iconBackgroundColor '#0a4d3c' \
  --iconBackgroundColorDark '#0a4d3c' \
  --splashBackgroundColor '#0a4d3c' \
  --splashBackgroundColorDark '#0a4d3c'
```

Output: `ios/App/App/Assets.xcassets/AppIcon.appiconset/` + `android/app/src/main/res/mipmap-*`

### Step 4: Add iOS + Android Platforms

```bash
npx cap add ios
npx cap add android
```

Ini buat folder:
- `ios/` — Xcode project (gak perlu edit kecuali signing)
- `android/` — Android Studio project

### Step 5: Sync Web Code ke Native

```bash
npx cap sync
```

Wajib dijalanin tiap kali install/uninstall Capacitor plugin atau ganti capacitor.config.ts.

---

## 🍎 iOS — Build & Test

### A. Buka Xcode

```bash
npm run cap:open:ios
```

### B. Setup Signing (Wajib Sekali)

Di Xcode:
1. Klik nama project di sidebar kiri → **App** target
2. Tab **Signing & Capabilities**
3. **Team**: pilih akun Apple Developer kamu
4. **Bundle Identifier**: `app.tulisnoon.app` (sudah ke-set di config)
5. Xcode auto-generate provisioning profile

### C. Run di Simulator (gratis, gak butuh device)

1. Top bar Xcode → pilih simulator: **iPhone 15 Pro**
2. Klik tombol **▶ Play** (atau ⌘+R)
3. Simulator akan boot + install app + open Tulis Noon dari Vercel

### D. Run di Device Asli (butuh USB cable)

1. Connect iPhone ke Mac via cable
2. Di iPhone: Settings → Privacy & Security → Developer Mode → ON, restart
3. Di Xcode top bar → pilih device fisik kamu (bukan simulator)
4. ▶ Play → app install di device

**Trust developer**: Pas first run di device, iPhone block app. Buka **Settings → General → VPN & Device Management → pilih profile kamu → Trust**.

### E. iOS Permissions yang Perlu Ditambah

Xcode → **Info.plist** → tambah keys ini (atau biarkan otomatis pas Capacitor sync):

| Key | Value | Untuk |
|---|---|---|
| `NSMicrophoneUsageDescription` | "Tulis Noon perlu akses mikrofon untuk fitur Tanya Cepat dan rekam bacaan Quran." | Web Speech API + voice rec |
| `NSCameraUsageDescription` | "Tulis Noon perlu kamera untuk scan QR pembayaran." | QRIS scan (optional) |

Cara tambah: Xcode → `App/App/Info.plist` → klik kanan → Add Row.

---

## 🤖 Android — Build & Test

### A. Buka Android Studio

```bash
npm run cap:open:android
```

Tunggu Gradle sync selesai (~2-5 menit pertama kali).

### B. Run di Emulator

1. Top bar → **Device Manager** → Create Virtual Device
2. Pilih **Pixel 7** (atau apa aja), download image (1-2 GB)
3. Top bar → pilih device emulator
4. **▶ Run** (Shift+F10)
5. Emulator boot + install + open Tulis Noon

### C. Run di Device Asli (USB)

1. Di phone Android: Settings → About Phone → tap **Build Number** 7× → Developer Mode active
2. Settings → Developer Options → **USB Debugging** ON
3. Connect via USB → device muncul di Android Studio
4. **▶ Run**

### D. Android Permissions

Otomatis ditambah oleh Capacitor plugins (`@capacitor/microphone` dll). Cek di:
- `android/app/src/main/AndroidManifest.xml`

Permissions yang aktif:
- `INTERNET`
- `RECORD_AUDIO` (untuk Tanya Cepat & voice rec)
- `MODIFY_AUDIO_SETTINGS`

---

## 🚢 SUBMIT KE STORE

### iOS App Store

1. **App Store Connect** ([appstoreconnect.apple.com](https://appstoreconnect.apple.com))
2. **My Apps → +** → New App
   - Name: `Tulis Noon`
   - Bundle ID: pick `app.tulisnoon.app`
   - SKU: `tulis-noon-001`
   - Primary Language: Indonesian
3. Siapin assets:
   - Icon 1024×1024 (gak punya alpha)
   - Screenshots minimal 5 untuk 6.7"/6.5"/12.9" device
   - Description, keywords, support URL, privacy policy URL
4. Di Xcode: **Product → Archive** → tunggu archive selesai → **Distribute App → App Store Connect → Upload**
5. App Store Connect → pilih build → fill rating + submit for review
6. **Review: 1-7 hari** (rata-rata 2 hari)

⚠️ **PENTING — Apple In-App Purchase rule**: Apple wajibin pakai Apple IAP untuk digital goods. Untuk launch awal, **disable tombol Top-Up di iOS** pakai platform check:

```jsx
import { isIOS } from '@/lib/native-helpers';
// ...
const [hideIOSPurchase, setHideIOSPurchase] = useState(false);
useEffect(() => { isIOS().then(setHideIOSPurchase); }, []);
// Lalu di JSX:
{!hideIOSPurchase && <button onClick={() => setShowTopUpModal(true)}>Top Up</button>}
```

Atau: redirect user iOS ke web untuk top-up (link ke `https://tulis-noon.vercel.app/topup`). App Store oke dengan ini selama gak ada CTA "Beli di sini" di app iOS.

### Google Play Store

1. **Play Console** ([play.google.com/console](https://play.google.com/console))
2. **Create App** → fill metadata
3. Build AAB di Android Studio:
   - Build → **Generate Signed Bundle/APK**
   - Pilih **Android App Bundle (.aab)**
   - Buat keystore baru (**SIMPAN PASSWORD** — kalau hilang gak bisa update app forever)
   - Output di `android/app/build/outputs/bundle/release/app-release.aab`
4. Play Console → **Production → Create new release** → Upload AAB
5. Fill store listing: icon, screenshots, description, privacy policy
6. **Review: 1-7 hari** (Google biasanya lebih cepat — 1-3 hari)

---

## 🔄 WORKFLOW HARIAN

Setelah setup selesai, daily workflow simple:

| Yang Berubah | Aksi |
|---|---|
| **Code React/CSS** (di `components/`, `app/`, dll) | Push ke Vercel → otomatis live di app native (no rebuild needed!) |
| **Icon / Splash** | `bash scripts/setup-mobile.sh` lagi, rebuild di Xcode/Android Studio, submit update |
| **Permission baru** / **Capacitor plugin baru** | `npx cap sync`, rebuild di Xcode/Android Studio, submit update |
| **App config** (capacitor.config.ts) | `npx cap sync`, rebuild |

**Pro tip**: 95% perubahan cuma React/CSS = update Vercel = instant ke app native. Submit ke store cuma butuh kalau ubah icon/permission/plugin.

---

## 🐛 TROUBLESHOOTING

### iOS: "Cannot find module @capacitor/cli"
→ `npm install` belum dijalanin. Run: `npm install`.

### iOS: Signing fails
→ Pastikan Apple Developer account aktif & Team dipilih di Xcode.

### iOS: App stuck di splash screen
→ Check Vercel deploy. App load dari `https://tulis-noon.vercel.app` — kalau Vercel down, app native gak bisa load.

### Android: Gradle build fails
→ Update Android Studio ke versi terbaru. Atau di Android Studio: File → Invalidate Caches → Restart.

### Android: White screen di emulator
→ Sama kayak iOS, app butuh internet untuk load Vercel. Check emulator network connection.

### Voice rec gak jalan di native iOS
→ Pastikan `NSMicrophoneUsageDescription` ada di `Info.plist`. Reinstall app setelah tambah.

### "Origin app.tulisnoon.app not allowed by CORS"
→ Vercel headers harus allow capacitor scheme. Tambah di `next.config.js`:
```js
headers: async () => [{
  source: '/(.*)',
  headers: [
    { key: 'Access-Control-Allow-Origin', value: '*' },
  ],
}]
```

---

## 📚 LINKS PENTING

- Capacitor docs: https://capacitorjs.com/docs
- Apple Developer: https://developer.apple.com
- App Store Connect: https://appstoreconnect.apple.com
- Google Play Console: https://play.google.com/console
- Setup detail lain: lihat [DEPLOY_SETUP.md](./DEPLOY_SETUP.md) untuk Midtrans + Resend + env vars
