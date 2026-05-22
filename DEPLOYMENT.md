# Panduan Deploy Tulis Noon — Step by Step (untuk iPad)

Panduan ini dirancang untuk pengguna iPad/HP tanpa install software apapun. Semua dilakukan lewat browser.

---

## 📋 SESI 1: Upload Kode ke GitHub (~20 menit)

### Langkah 1.1 — Buat Repository Baru di GitHub

1. Buka **github.com** di Safari/Chrome iPad
2. Login ke akun Anda
3. Klik tombol **"+"** di pojok kanan atas → pilih **"New repository"**
4. Isi form:
   - **Repository name**: ketik `tulis-noon`
   - **Description**: (opsional) `Aplikasi belajar bahasa Arab`
   - Pilih **"Public"** (gratis & cukup untuk trial)
   - ✅ Centang **"Add a README file"**
   - **".gitignore template"**: pilih **"Node"**
5. Klik tombol hijau **"Create repository"**

✅ **Cek**: Anda akan melihat halaman repository baru dengan file README.md.

---

### Langkah 1.2 — Upload File-File Kode

⚠️ **Penting:** Anda akan dapat file ZIP dari saya. Cara upload:

**Opsi A — Via GitHub Web (paling simpel di iPad):**

1. Di halaman repository, klik tombol **"Add file"** → pilih **"Upload files"**
2. Akan muncul kotak besar bertuliskan "Drag files here..."
3. Klik kotak itu → pilih **"Pilih dari iCloud"** atau **"Browse"**
4. Pilih file ZIP yang saya berikan
5. **TAPI** GitHub web tidak bisa extract ZIP otomatis. Jadi:

**Opsi B (RECOMMENDED untuk iPad):**

Gunakan fitur **"github.dev"**:
1. Di halaman repo Anda, **ubah URL** dari:
   `https://github.com/USERNAME/tulis-noon`
   menjadi:
   `https://github.dev/USERNAME/tulis-noon`
2. (Atau cukup tekan tombol `.` di keyboard kalau pakai keyboard external)
3. Akan terbuka VS Code di browser
4. Drag-drop file dari Files iPad ke sidebar kiri
5. Setelah semua file ter-upload, klik ikon **Source Control** (3 lingkaran terhubung) di sidebar kiri
6. Tulis pesan commit: `Initial commit — Tulis Noon MVP`
7. Klik tombol **"Commit & Push"**

**Opsi C — Pakai aplikasi GitHub iOS:**
1. Install **"GitHub"** dari App Store (gratis)
2. Login ke repo Anda
3. Lebih nyaman untuk navigasi, tapi upload tetap via github.dev

---

### Langkah 1.3 — Konfirmasi ke Saya

Setelah selesai upload, kasih tahu saya:
1. **Username GitHub Anda** (boleh dishare, ini public)
2. Screenshot atau konfirmasi bahwa file-file ini ada di repo:
   - `app/` (folder)
   - `components/` (folder)
   - `package.json`
   - `README.md`

Kalau ada error/bingung di mana pun, **STOP dan tanya saya**. Jangan paksa, kita debug bareng.

---

## 📋 SESI 2: Deploy ke Vercel (~20 menit)

*Akan dijalankan setelah Sesi 1 selesai.*

Preview langkahnya:
1. Login ke **vercel.com** pakai Google
2. Klik **"Add New Project"** → pilih repo `tulis-noon`
3. Vercel auto-detect Next.js → klik **"Deploy"**
4. Tunggu 2-3 menit → dapat link `tulis-noon.vercel.app`
5. **Web LIVE!** 🎉

---

## 📋 SESI 3: Setup Database Supabase (~30 menit)

*Akan dijalankan setelah Sesi 2 selesai.*

Akan buat database untuk:
- Tabel `users` (simpan email & profile user trial)
- Tabel `feedback` (kumpulkan masukan)
- Tabel `events` (tracking lesson selesai, game dimainkan, dll)

---

## 📋 SESI 4: Connect Claude AI (~20 menit)

Akan buat API route untuk fitur:
- AI Roleplay (chat dengan "pedagang Madinah" pakai AI nyata)
- Koreksi pengucapan dengan feedback detail
- Generate skenario sesuai minat user

---

## 📋 SESI 5: Form Pendaftaran & Tracking (~30 menit)

- Halaman daftar trial dengan email
- Form feedback in-app
- Tracking otomatis ke Supabase
- Generate link share untuk 5 user trial

---

## 🆘 Kalau Stuck di Mana Saja

Kasih tahu saya dengan format ini:
- **Sesi & Langkah:** misal "Sesi 1, Langkah 1.2"
- **Apa yang terjadi:** screenshot atau deskripsi singkat
- **Pesan error (kalau ada):** copy paste teks error-nya

Tidak ada pertanyaan bodoh. Tugas saya pandu Anda sampai sukses. 🚀
