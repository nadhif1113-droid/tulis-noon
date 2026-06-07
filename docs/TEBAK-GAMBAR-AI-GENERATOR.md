# Panduan Lengkap: Tebak Gambar AI Image Generator

Generate 200 gambar AI untuk game Tebak Gambar via OpenAI DALL-E 3, simpan di Firebase Storage, auto-merge ke aplikasi.

---

## 🎯 Apa yang sudah dibangun

| Komponen | File | Fungsi |
|---|---|---|
| **Data soal** | `data/tebak-gambar-levels.js` | 10 kategori × 20 item = 200 vocab dengan field `image` (emoji) + `imageUrl` (URL) |
| **URL mapping** | `data/tebak-gambar-urls.js` | Map `{categoryId: {arabicWord: url}}` — populated by script |
| **Generator** | `scripts/generate-tebak-images.js` | CLI tool: DALL-E 3 → Firebase Storage → URL map |
| **Frontend** | `components/TebakGambarScreen.jsx` | Render `<img>` kalau URL ada, fallback ke emoji |

---

## 📋 Pra-syarat

### 1. OpenAI Account + Saldo
- Daftar di [platform.openai.com](https://platform.openai.com/signup)
- **Tambah saldo minimal $10** di [Billing](https://platform.openai.com/account/billing)
- Buat API key di [API Keys](https://platform.openai.com/api-keys) — copy `sk-proj-xxx...` atau `sk-xxx...`

> ⚠️ **Akun baru harus top-up dulu!** Akun gratis nggak bisa pakai DALL-E 3. Top-up $10 dapat ~250 gambar — cukup untuk 200 item kita.

### 2. Firebase Storage
- Buka [Firebase Console](https://console.firebase.google.com) → project Tulis Noon
- **Storage** → kalau belum aktif, klik "Get Started" → pilih region `asia-southeast1` (Singapore, terdekat ke Indonesia)
- **Rules** → pastikan public read allowed untuk path `tebak-gambar/`:
  ```
  rules_version = '2';
  service firebase.storage {
    match /b/{bucket}/o {
      match /tebak-gambar/{allPaths=**} {
        allow read: if true;          // public read
        allow write: if false;        // hanya via admin SDK
      }
      match /{allPaths=**} {
        allow read, write: if request.auth != null;
      }
    }
  }
  ```
- Copy **bucket name** dari Storage tab — format: `tulis-noon.firebasestorage.app` atau `tulis-noon.appspot.com`

### 3. Firebase Service Account (untuk Admin SDK)
Kalau belum punya:
- **Project Settings** → **Service Accounts** → **Generate new private key**
- File JSON terdownload, contoh: `tulis-noon-firebase-adminsdk-xxxxx.json`
- ⚠️ **JANGAN commit file ini ke GitHub!**

### 4. Setup `.env.local`
Edit `.env.local` di root project. Tambahkan 3 baris:

```bash
# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Firebase Storage bucket (mungkin sudah ada)
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tulis-noon.firebasestorage.app

# Firebase Service Account (JSON 1 baris — convert dari file .json yang di-download)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"tulis-noon","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**Convert file JSON ke 1 baris untuk env var:**
```bash
# Mac/Linux
cat ~/Downloads/tulis-noon-firebase-adminsdk-xxxxx.json | jq -c .

# Atau pakai Node
node -e "console.log(JSON.stringify(require('/Users/fahrianaditya/Downloads/tulis-noon-firebase-adminsdk-xxxxx.json')))"
```

Copy output (1 baris panjang), paste ke `.env.local` setelah `FIREBASE_SERVICE_ACCOUNT=`.

### 5. Install dotenv (sekali aja)
```bash
npm i -D dotenv
```

---

## 🩺 Step 1: Diagnose (WAJIB sebelum generate)

```bash
npm run tebak:doctor
```

Output yang **harus muncul semua hijau**:
```
🩺 Doctor — diagnose environment

✅ OPENAI_API_KEY: set (sk-proj-...xxxx)
   → testing OpenAI API... ✅ OK (dall-e-3 available)
   → test generate 1 image (cek billing)... ✅ Berhasil generate ($0.04 ke-charge)
   Sample URL: https://oaidalleapiprodscus.blob.core.windows.net/...

✅ FIREBASE_SERVICE_ACCOUNT: parse OK (project: tulis-noon)
✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: tulis-noon.firebasestorage.app
   → test upload ke Firebase Storage... ✅ Upload OK
   File: https://storage.googleapis.com/tulis-noon.firebasestorage.app/tebak-gambar/_doctor-test.txt

✅ Semua OK — siap run generator
```

**Kalau ada yang merah ❌**, troubleshoot dulu (lihat tabel di bawah).

---

## 🧪 Step 2: Test 1 Gambar

```bash
npm run tebak:test
```

Ini akan generate **1 gambar saja** (Roti dari kategori makanan) dengan output verbose:

```
   🎨 Roti... [DALL-E] [download] [upload] ✅
      → https://storage.googleapis.com/tulis-noon.firebasestorage.app/tebak-gambar/makanan/roti.png
```

Buka URL di browser — kalau gambar muncul, semua infrastruktur OK.

---

## 🚀 Step 3: Generate per Kategori (Recommended)

Lebih aman generate per kategori, biar bisa pantau quality:

```bash
# Kategori 1 (~$0.80, ~40 detik)
node scripts/generate-tebak-images.js --category makanan

# Cek hasilnya di app/browser dulu, kalau OK lanjut:
node scripts/generate-tebak-images.js --category tempat
node scripts/generate-tebak-images.js --category hewan-alam
# ... dst
```

ID kategori: `makanan`, `tempat`, `hewan-alam`, `benda`, `pakaian-umrah`, `tubuh`, `transportasi`, `cuaca-waktu`, `profesi`, `olahraga`

---

## 💥 Step 4: Generate Semua (~$8, ~13 menit)

Kalau yakin:
```bash
npm run tebak:gen
```

Script **idempotent** — kalau interrupted di tengah, tinggal re-run, yang udah ada di-skip.

---

## 🔧 Flag CLI Reference

| Flag | Fungsi | Contoh |
|---|---|---|
| `--doctor` | Diagnose env, test API, test upload | `--doctor` |
| `--dry-run` | Tampilin yang akan di-generate, tanpa call API | `--dry-run --limit 5` |
| `--category X` | Hanya kategori X | `--category makanan` |
| `--limit N` | Maksimum N gambar | `--limit 10` |
| `--force` | Regenerate item yang udah ada | `--force --category profesi` |
| `--verbose` / `-v` | Output detail per-stage | `-v` |
| `--sleep MS` | Delay antar request (default 2000ms) | `--sleep 10000` (tier 1) |

---

## 🐛 Troubleshooting

### Error: `❌ HTTP 401 invalid_api_key`
**Penyebab**: API key salah/expired/typo.
**Fix**: Generate key baru di [platform.openai.com/api-keys](https://platform.openai.com/api-keys), update `.env.local`.

### Error: `❌ HTTP 429 rate_limit_exceeded`
**Penyebab**: Akun tier 1 = 5-7 RPM untuk DALL-E 3. Script default 30 RPM, kelewatan.
**Fix**: Tingkatin sleep — `node scripts/generate-tebak-images.js --sleep 10000` (= 6 RPM aman).

### Error: `❌ HTTP 429 insufficient_quota`
**Penyebab**: Saldo OpenAI habis atau tier free.
**Fix**: Top-up di [Billing](https://platform.openai.com/account/billing). Minimum $5, recommended $10.

### Error: `❌ HTTP 400 billing_hard_limit_reached`
**Penyebab**: Hit soft/hard limit billing yang kamu set sendiri.
**Fix**: Naikin limit di [Usage Limits](https://platform.openai.com/account/limits).

### Error: `❌ Firebase: does not exist`
**Penyebab**: Bucket name salah atau Firebase Storage belum di-enable.
**Fix**: Cek Firebase Console → Storage → Get Started. Copy bucket name persis (case-sensitive).

### Error: `❌ Firebase: permission denied`
**Penyebab**: Service Account nggak punya role yang cukup.
**Fix**: Di [GCP IAM Console](https://console.cloud.google.com/iam-admin/iam), cari service account `firebase-adminsdk-xxx@tulis-noon.iam.gserviceaccount.com`, tambah role **"Storage Admin"**.

### Error: `❌ Cannot find module 'firebase-admin'`
**Penyebab**: Dependency missing.
**Fix**: `npm install firebase-admin`

### Error: `❌ Cannot find module 'dotenv'`
**Penyebab**: Script gak bisa baca `.env.local` otomatis.
**Fix**: `npm i -D dotenv` (atau export env vars manual: `export OPENAI_API_KEY=sk-...`)

### Semua 200 error tanpa 1 sukses
**Penyebab**: Systemic issue — biasanya 1 dari 3:
1. API key invalid → cek dengan `--doctor`
2. Saldo OpenAI 0 → top-up
3. Firebase Service Account malformed → cek dengan `--doctor`

**Cara baca log lengkap:**
```bash
cat tebak-gen-errors.log
```

File ini contains stacktrace lengkap per item — gampang spot pattern.

---

## 📁 File yang Dihasilkan

```
data/
├── tebak-gambar-levels.js       # Source data (200 item)
└── tebak-gambar-urls.js         # Auto-generated, format:
                                  # export const TEBAK_GAMBAR_URLS = {
                                  #   "makanan": {
                                  #     "خُبْز": "https://storage.googleapis.com/...",
                                  #     ...
                                  #   },
                                  #   ...
                                  # };

Firebase Storage:
tebak-gambar/
├── makanan/
│   ├── roti.png
│   ├── kurma.png
│   └── ... (20 file)
├── tempat/
└── ... (10 kategori)

tebak-gen-errors.log              # Error log (kalau ada)
```

---

## 💰 Cost Breakdown

| Item | Hitungan |
|---|---|
| DALL-E 3 standard 1024×1024 | $0.040/gambar |
| 200 gambar | **$8.00** one-time |
| Firebase Storage (200 × ~500KB = 100MB) | ~$0.026/bulan (Spark tier free up to 5GB) |
| Firebase egress (1000 user × 20 view × 500KB) | masih dalam free tier |

**Total ongoing**: $0/bulan (Firebase Spark free tier).

---

## ✅ Verifikasi Setelah Generate

1. **Build local dev**: `npm run dev`
2. Buka app → Tebak Gambar → pilih kategori → cek apakah gambar muncul (bukan emoji)
3. Tap soal — gambar harus tampil clear, label Indonesia disembunyikan (pure visual challenge)
4. Build production: `npm run build`
5. Commit & push:
   ```bash
   git add data/tebak-gambar-urls.js
   git commit -m "feat(tebak-gambar): populate 200 AI-generated images"
   git push
   ```

---

## 🔄 Maintenance

**Tambah kategori baru / item baru:**
1. Edit `data/tebak-gambar-levels.js` — tambah item dengan `imageUrl: null`
2. Run `npm run tebak:gen` — hanya item baru yang di-generate (idempotent)
3. Commit `data/tebak-gambar-urls.js` dengan URL baru

**Regenerate item tertentu** (gambar jelek):
1. Delete entry dari `data/tebak-gambar-urls.js` manually
2. Run `npm run tebak:gen --category X --force`

**Ganti style global** (mis. semua jadi photorealistic):
1. Edit `buildPrompt()` di `scripts/generate-tebak-images.js`
2. Backup `data/tebak-gambar-urls.js` ke file lain
3. Hapus isi `TEBAK_GAMBAR_URLS = {}`
4. Run `npm run tebak:gen` — regenerate semua

---

## 📌 Quick Reference Card

```bash
# Setup
npm i -D dotenv firebase-admin
# Edit .env.local → tambah OPENAI_API_KEY, FIREBASE_SERVICE_ACCOUNT, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

# Test
npm run tebak:doctor           # diagnose
npm run tebak:test             # 1 gambar
npm run tebak:gen:dry          # preview tanpa call API

# Generate
node scripts/generate-tebak-images.js --category makanan         # 1 kategori
npm run tebak:gen                                                # semua

# Debug
cat tebak-gen-errors.log                                         # error log
node scripts/generate-tebak-images.js --doctor                   # re-diagnose
```
