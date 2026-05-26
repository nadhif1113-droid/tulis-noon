# Setup Deploy Tulis Noon — Payment + App Store + Play Store

Dokumen ini step-by-step buat Nadhif setup semua yang butuh akun eksternal.
Code-nya sudah ready di repo — sisanya tinggal isi keys/akun.

---

## 1️⃣ MIDTRANS PAYMENT GATEWAY

Midtrans Snap handle semua method: QRIS, VA Bank (BCA/Mandiri/BNI/BRI/Permata/CIMB), GoPay, ShopeePay, OVO, DANA, kartu kredit, Apple Pay, Google Pay.

### Step 1: Daftar Akun Midtrans
1. Buka https://midtrans.com → Sign Up (gratis)
2. Submit dokumen: KTP, NPWP, rekening bank, foto profil bisnis (bisa pakai nama "Tulis Noon" atau perusahaan kamu)
3. Verifikasi via email + KYC (1-3 hari kerja)
4. Setelah approved → dashboard.midtrans.com

### Step 2: Ambil API Keys
Di Midtrans Dashboard:
- **Settings → Access Keys**
- Copy: **Server Key** + **Client Key**
- Mode: pilih **Sandbox** dulu buat testing, **Production** untuk live

### Step 3: Set Env Vars di Vercel
Buka https://vercel.com/[your-team]/tulis-noon/settings/environment-variables

Tambah 3 variable:
```
MIDTRANS_SERVER_KEY=SB-Mid-server-XXXXXXXX        (atau Mid-server-... untuk production)
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-XXX (atau Mid-client-...)
MIDTRANS_IS_PRODUCTION=false                       (atau "true" kalau sudah live)
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false           (samain dengan di atas)
```

⚠️ **PENTING**: `Server Key` JANGAN kasih awalan `NEXT_PUBLIC_` — kalau pakai itu dia bakal exposed ke client. Server key cuma boleh di server-side env.

### Step 4: Setup Webhook URL
Di Midtrans Dashboard:
- **Settings → Configuration → Payment Notification URL**
- Isi: `https://tulis-noon.vercel.app/api/midtrans/webhook`
- Save

Test webhook: di Dashboard ada "Test Notification" — kirim test ke URL kamu, harus respond `200 OK`.

### Step 5: Aktifkan Payment Methods
Default Midtrans aktifin semua. Kalau ada yang ke-disable:
- **Settings → Snap Preferences → Payment Methods**
- Centang: Credit Card, QRIS, GoPay, ShopeePay, OVO, DANA, BCA VA, Mandiri VA, BNI VA, BRI VA, Permata VA, Indomaret, Alfamart
- **Apple Pay & Google Pay** — perlu approval khusus dari Midtrans (kontak CS, biasanya 1-2 minggu)

### Step 6: Test Pembayaran
1. Deploy ke Vercel (push)
2. Buka app → klik koin di header → "Top Up"
3. Pilih paket → bayar pakai test card sandbox Midtrans:
   - Card: `4811 1111 1111 1114`, CVV `123`, Exp `01/25`
   - 3DS OTP: `112233`
4. Koin auto-credit setelah pembayaran berhasil (cek Firestore `users/[uid]/coins`)

---

## 2️⃣ NATIVE APP (Capacitor) — iOS + Android

### Step 1: Install Capacitor di Local
Di Mac/laptop kamu (bukan di sandbox), buka folder `tulis-noon`:
```bash
npm install
npx cap init "Tulis Noon" "app.tulisnoon.app" --web-dir=out
```

Note: config sudah ada di `capacitor.config.ts` — kalau ditanya overwrite, JAWAB **No**.

### Step 2: Add iOS Platform (perlu Mac + Xcode)
```bash
npm run cap:init:ios       # = npx cap add ios
```

Folder `ios/` akan dibuat. Buka di Xcode:
```bash
npm run cap:open:ios       # buka Xcode
```

Di Xcode:
1. Set **Signing & Capabilities** → pilih Team (perlu Apple Developer account, $99/tahun)
2. Bundle Identifier: harus match `app.tulisnoon.app` (atau ganti sesuai punya kamu)
3. Build & Run di simulator → app harus muncul

### Step 3: Add Android Platform (Mac/Windows/Linux + Android Studio)
```bash
npm run cap:init:android   # = npx cap add android
```

Buka di Android Studio:
```bash
npm run cap:open:android
```

Di Android Studio:
1. Tunggu Gradle sync
2. Run di emulator atau device USB → app harus muncul

### Step 4: Update Native Wrapper Setelah Code Berubah
Setiap kali ubah `components/`, `app/`, dll:
```bash
npm run build              # build Next.js
npm run cap:sync           # sync ke native
# Lalu rebuild di Xcode/Android Studio
```

⚠️ Karena `capacitor.config.ts` set `server.url = 'https://tulis-noon.vercel.app'`, native wrapper akan **load dari Vercel** — jadi sebenernya tiap deploy Vercel = update otomatis ke app native, **tanpa perlu rebuild native**. Cuma butuh rebuild kalau:
- Ubah ikon/splash
- Update Capacitor plugins
- Submit versi baru ke App Store/Play Store

---

## 3️⃣ APP STORE (iOS) — Submit ke Apple

### Step 1: Apple Developer Account ($99/tahun)
1. https://developer.apple.com/programs/enroll/
2. Pilih: Individual (kalau pakai nama Nadhif) atau Organization (kalau pakai PT)
3. Bayar $99 (≈ Rp 1,5 juta)
4. Verifikasi (1-2 hari)

### Step 2: App Store Connect
1. Buka https://appstoreconnect.apple.com
2. **My Apps → +** → New App
3. Isi:
   - Platform: iOS
   - Name: **Tulis Noon**
   - Bundle ID: `app.tulisnoon.app` (sama persis dengan Capacitor config)
   - SKU: `tulis-noon-001`
   - Primary Language: Bahasa Indonesia

### Step 3: Siapkan Assets (Mandatory)
- **App Icon**: 1024×1024 PNG (no transparency, no rounded corners — Apple yg rounding)
- **Screenshots**: minimal 5 untuk masing-masing device size:
  - iPhone 6.7" (1290×2796)
  - iPhone 6.5" (1284×2778)
  - iPad 12.9" (2048×2732)
- **Description**: 4000 char max
- **Keywords**: 100 char (e.g. "bahasa arab,umrah,haji,jamaah,quran")
- **Support URL**: e.g. https://tulis-noon.vercel.app/support
- **Privacy Policy URL**: mandatory — buat di `app/privacy/page.jsx` (kasih tau saya kalau perlu di-generate)

### Step 4: Build & Upload via Xcode
1. Di Xcode → **Product → Archive**
2. **Organizer** akan muncul → klik "Distribute App" → "App Store Connect" → "Upload"
3. Tunggu upload selesai (5-15 menit)

### Step 5: Submit for Review
1. Di App Store Connect, app build kamu akan muncul setelah 10-30 menit
2. Pilih build → fill: rating (4+), kategori (Education / Reference), pricing (Free)
3. Submit for Review
4. **Apple review: 1-7 hari** (rata-rata 2 hari)
5. Possible rejections: missing privacy policy, IAP harus pakai Apple In-App Purchase (NOT Midtrans!)

⚠️ **PENTING IAP RULE**:
- **Apple wajib pakai Apple IAP** untuk DIGITAL goods (koin, premium unlock).
- Midtrans hanya boleh dipakai untuk **physical goods** atau **services di luar app**.
- **Workaround sah**: 
  - **Option A**: Pakai Apple IAP untuk paket koin (perlu setup IAP di App Store Connect)
  - **Option B**: Top-up koin cuma di web/Android. iOS user redirect ke web. App Store oke selama gak ada CTA "Beli di sini" inside iOS app.
  - **Option C**: Apple kasih "reader app" exception kalau app cuma konsumsi content user yg dibeli di tempat lain.
- **Recommend**: Submit awal app **TANPA top-up modal di iOS** (hide pakai platform check). Bahas IAP di update v2.

### Step 6: Live!
Setelah approved → app muncul di App Store. Update bisa di-push tanpa review (kalau cuma server-side via `server.url`).

---

## 4️⃣ GOOGLE PLAY STORE (Android)

### Step 1: Google Play Console ($25 one-time)
1. https://play.google.com/console/signup
2. Bayar $25 (≈ Rp 400 ribu) — sekali bayar, lifetime
3. Verifikasi identitas (1-3 hari)

### Step 2: Create App
1. Play Console → **Create app**
2. App name: **Tulis Noon**
3. Default language: Indonesian
4. App or game: **App**
5. Free or paid: **Free**
6. Centang declarations (Developer Program Policies + US export laws)

### Step 3: Generate Signed AAB di Android Studio
1. **Build → Generate Signed Bundle / APK**
2. Pilih **Android App Bundle (.aab)**
3. Buat keystore baru (SIMPAN BAIK-BAIK — kalau hilang, gak bisa update app):
   - Path: `tulis-noon-release-key.jks`
   - Password: bikin yg kuat (catat di password manager)
   - Alias: `tulis-noon`
   - Validity: 50 tahun
4. Build → `app-release.aab` siap di `android/app/build/outputs/bundle/release/`

### Step 4: Upload AAB ke Play Console
1. Play Console → **Production → Create new release**
2. Upload `app-release.aab`
3. Fill release notes

### Step 5: Store Listing
- **Short description**: 80 char
- **Full description**: 4000 char
- **Icon**: 512×512 PNG
- **Feature graphic**: 1024×500 PNG
- **Screenshots**: minimal 2, max 8 per device type (phone, tablet)
- **Privacy Policy URL**: mandatory
- **Category**: Education
- **Content rating**: fill questionnaire → biasanya "Everyone"
- **Data safety**: declare apa data yg di-collect (Firebase Auth = email, FCM = device ID, dll)

### Step 6: Submit
- Klik "Send for review"
- **Google review: 1-7 hari** (rata-rata 1-3 hari)
- Update bisa di-push lebih cepat setelah trust established (kadang 1 jam aja)

### IAP Rules Google Play
- Mirip Apple: digital goods **wajib pakai Google Play Billing**
- Tapi Google lebih lunak — ada **"alternative billing"** program (3% potongan vs 15% Play Billing)
- Untuk awal: bisa pakai Midtrans di Android, tapi siap kalau Google warning, switch ke Play Billing
- Detail: https://support.google.com/googleplay/android-developer/answer/12348241

---

## 5️⃣ CHECKLIST FINAL SEBELUM LAUNCH

### Code & Backend
- [ ] Push semua commit ke main branch via GitHub Desktop
- [ ] Vercel auto-deploy berhasil (Status: Ready)
- [ ] Midtrans Server Key + Client Key set di Vercel env vars
- [ ] Webhook URL configured di Midtrans Dashboard
- [ ] Firebase FIREBASE_SERVICE_ACCOUNT env var set (untuk webhook credit koin)
- [ ] Test pembayaran sandbox sukses → koin masuk ke user

### iOS
- [ ] Apple Developer account approved ($99)
- [ ] Bundle ID `app.tulisnoon.app` registered di developer.apple.com
- [ ] Capacitor sync sukses, app jalan di iPhone simulator
- [ ] App icon 1024×1024 + 5+ screenshots ready
- [ ] Privacy Policy page live
- [ ] Submit ke App Store Connect → Review

### Android
- [ ] Google Play Console account approved ($25)
- [ ] Signed AAB build sukses
- [ ] Keystore disimpan aman (password manager)
- [ ] Store listing lengkap (icon, screenshots, privacy)
- [ ] Submit production release

### Marketing
- [ ] Privacy Policy + Terms of Service di `app/privacy` & `app/terms`
- [ ] Landing page www (optional, bisa pakai homepage tulis-noon.vercel.app)
- [ ] Support email aktif (e.g. support@tulisnoon.app)

---

## 5.5️⃣ AI ADMIN — EMAIL ESCALATION (Resend)

Fitur **Admin AI** (FAB di Profile) menjawab keluhan user pakai Claude. Kalau AI gak bisa jawab → tap "Tanyakan ke Founder" → otomatis kirim email ke `nadhif1113@gmail.com`.

### Step 1: Daftar Resend (gratis 100 email/hari)
1. https://resend.com → Sign up (pakai email kamu)
2. Verify email
3. Dashboard → **API Keys** → Create API Key → copy

### Step 2: Verify Domain (optional tapi recommended)
- Untuk launch awal, bisa pakai `onboarding@resend.dev` (default Resend test address, langsung jalan)
- Untuk production: Settings → Domains → add `tulisnoon.app` (atau apapun domain kamu), tambah DNS records, tunggu verify

### Step 3: Env Vars di Vercel
```
RESEND_API_KEY=re_XXXXXXXXXXXX
ESCALATION_FROM_EMAIL=onboarding@resend.dev    # atau admin@tulisnoon.app kalau domain sudah verified
```

⚠️ Kalau `RESEND_API_KEY` gak di-set, escalation tetap jalan — tapi cuma simpan ke Firestore (`escalations` collection). Founder bisa cek manual di Firebase Console. Email gak terkirim.

### Step 4: Test
1. Buka Profile → tap FAB "Tanya Admin" (hijau, bawah kanan)
2. Tanya: "Pembayaran QRIS saya belum masuk koinnya"
3. AI akan jawab + flag `needs_human = true` → tombol "Tanyakan ke Founder" muncul
4. Tap tombol itu → email masuk ke `nadhif1113@gmail.com` dalam ~5 detik
5. Cek juga di Firebase Console → Firestore → `escalations` collection

---

## 6️⃣ ENV VARS YANG WAJIB SET DI VERCEL

```bash
# Anthropic (sudah ada)
ANTHROPIC_API_KEY=sk-ant-...

# Firebase Client (sudah ada — NEXT_PUBLIC_ jadi exposed ke client)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin (sudah ada — server-only)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}   # paste full JSON

# Midtrans (BARU)
MIDTRANS_SERVER_KEY=SB-Mid-server-XXX
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-XXX
MIDTRANS_IS_PRODUCTION=false
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false

# Resend (BARU — untuk AI Admin email escalation ke founder)
RESEND_API_KEY=re_XXXXXXXXXXXX
ESCALATION_FROM_EMAIL=onboarding@resend.dev    # atau admin@tulisnoon.app kalau domain sudah verified
```

Setelah set env vars, **redeploy** dari Vercel dashboard (atau push commit kosong).

---

## 7️⃣ TIMELINE REALISTIS

| Task | Estimasi | Catatan |
|---|---|---|
| Midtrans signup + KYC | 1-3 hari | Online, gratis |
| Setup keys + test sandbox | 2 jam | Hari yang sama |
| Apple Developer signup | 1-2 hari | + $99 |
| Setup Xcode + first build | 4-8 jam | Belajar curve kalau baru |
| iOS app review | 1-7 hari | Pertama kali biasanya 3-5 hari |
| Google Play Console signup | 1-3 hari | + $25 |
| Android build + upload | 2-4 jam | |
| Android app review | 1-7 hari | Pertama biasanya 1-3 hari |
| **TOTAL hingga live** | **2-4 minggu** | Kalau lancar |

---

## TROUBLESHOOTING

**Vercel error: `MIDTRANS_SERVER_KEY belum di-set`**
→ Belum tambah env var. Vercel Dashboard → Settings → Environment Variables → tambah → Redeploy.

**Webhook gak credit koin**
→ Cek Vercel logs (Deployments → latest → Functions → /api/midtrans/webhook). Biasanya: signature mismatch (server key salah), atau Firebase admin gak ke-init (FIREBASE_SERVICE_ACCOUNT salah format).

**Apple reject: "Guideline 3.1.1 — In-App Purchase"**
→ Hapus tombol top-up di iOS pakai platform detection. Atau implement Apple IAP (StoreKit).

**Capacitor: `Failed to load resource: https://tulis-noon.vercel.app`**
→ Native app butuh internet (Mode B). Atau switch ke Mode A (offline) dengan `next export`. Tapi Next.js dynamic routes (API) gak bisa di-export — perlu refactor.

---

Kalau ada step yang stuck, ping aja dengan screenshot error-nya — bisa di-debug.
