# Audit & Strategi Tulis Noon

**Tanggal**: 7 Juni 2026
**Konteks**: Pre-launch Event Tantangan 10 Hari Aktif (13–22 Juni 2026)
**Untuk**: Founder & solo dev

---

## Ringkasan eksekutif

Tulis Noon punya kondisi yang jarang dimiliki app sejenis dari solo dev: konten dalam jumlah commercial-grade (200+ jam belajar), sistem anti-cheat multi-layer untuk event berhadiah, branding yang konsisten, dan diferensiasi yang jelas dari kompetitor (Hijazi dialect + Indonesia-first + persona-based paths). Posisi ini cukup kuat untuk launch.

Tapi ada **tiga risiko serius** yang harus diatasi sebelum tanggal 13 Juni. Dan di luar event, ada **isu fondasi** yang kalau tidak dibenahi akan jadi penghalang utama saat user mulai bertambah: monorepo 5.500 baris yang sulit di-maintain, ketiadaan testing, dan ketergantungan total pada satu orang.

Rekomendasi utama: **fokus stabilkan dulu, baru tambah fitur**. 6 bulan ke depan diarahkan ke launch–monetize–sustain, bukan terus menambah scope.

---

## Apa yang berjalan baik

### Konten
Total konten yang playable hari ini setara dengan app komersial menengah. 45 modul lesson di tiga path (Umrah, Profesional, Pelajar), 64 pelajaran grammar (Nahwu + Shorf), 37 surat Juz 30 lengkap dengan audio, 200 vocab Tebak Gambar dengan gambar AI custom, 21 cerita interaktif, 15 level Tulis Arab dari nol sampai paragraf, 12 materi Perkenalan Diri persona-tailored, plus 7 sertifikat path dan Master capstone. Untuk solo dev dalam beberapa bulan, ini di atas norma.

### Anti-cheat
Sistem proteksi untuk event Rp 1 juta termasuk yang paling ketat dibanding mayoritas app sejenis. Enam lapis bersusun: anti-replay (XP 30% kalau ulangi konten yang sama), quality gate (kuis di bawah 40% = 0 XP), diversity threshold (bonus hanya kalau fitur dipakai serius), sertifikat gate (Juara 1 wajib selesaikan minimal 1 path), registration gate (data diri + 8 pernyataan), dan verifikasi manual via WhatsApp. Test result: 9/9 validation cases passed.

### Branding & UX
Identitas visual konsisten: warna hijau tua + emas, font Fraunces untuk header, badge "ن" sebagai signature. Aplikasi terasa premium dan terjaga (Islamic appropriate). Tidak terasa seperti generic clone Duolingo.

### Persona-based paths
Pilihan persona di onboarding (Umrah, Profesi, Pelajar, Religi, Serius semua) langsung memetakan user ke konten relevan. Ini diferensiator besar dari Duolingo Arabic yang generic. Strategy ini "wins on specificity" — orang yang mau berangkat umrah Mei tahu bahwa app ini fokus untuk dia.

### AI yang fresh
Tiga AI integration berfungsi: Insight per percakapan via Claude Haiku (frasa kunci + konteks budaya + tip + grammar), Tanya Cepat AI Hijazi unlimited, dan image generation AI untuk vocab. Cost-wise terkendali karena pakai caching di Firestore.

---

## Risiko serius — wajib atasi sebelum 13 Juni

### 1. Bug Tanya Cepat — XP tidak ter-award
Cap 30 XP per hari sudah dipasang di event scoring, tapi `TanyaCepatScreen` tidak memanggil `awardXp` dengan feature key. User tidak dapat XP event meskipun pakai Tanya Cepat. Implikasi: theoretical max event score turun dari 4.300 ke 4.000 XP — tepat sama dengan threshold Juara 1, **margin nol**. User yang main perfect masih bisa gagal capai jackpot. Fix wajib dalam 5 hari ke depan.

### 2. Test coverage kosong
Tidak ada unit test, integration test, maupun end-to-end test. Setiap perubahan ke `TulisNoonApp.jsx` (5.500+ baris) berisiko merusak fitur lain tanpa terdeteksi. Untuk event berhadiah real, ini risiko keuangan: bug yang lolos bisa membuat seseorang menang yang seharusnya tidak, atau membuat pemenang sah tidak terdeteksi.

### 3. Tidak ada Terms & Conditions formal
Modal registration berisi 8 pernyataan, tapi belum ada T&C dokumen lengkap yang publik (tentang pajak, dispute resolution, batas tanggung jawab, dst). Untuk event Rp 1 juta, kalau ada user yang merasa dicurangi/dirugikan, kamu butuh dokumen ini sebagai dasar legal. Minimal halaman `/terms-event-juni-2026` yang link-nya muncul di modal pendaftaran.

---

## Risiko sedang — atasi dalam 30 hari pasca launch

### Monorepo `TulisNoonApp.jsx` 5.500+ baris
File ini menampung semua tab (Home, Belajar, Sosial, Profil), semua handler, semua state management. Setiap pekerjaan baru jadi makin lambat karena scope-nya susah dipahami. Risk: change kecil bisa crash beberapa fitur sekaligus. Solusi: extract `HomeTab.jsx`, `BelajarTab.jsx`, `SosialTab.jsx`, `ProfilTab.jsx` masing-masing jadi file terpisah. Bisa dilakukan bertahap, satu tab per minggu.

### Tidak ada moderasi komunitas
Posts dan komentar dari user bisa berisi spam, link phishing, konten tidak pantas. Kalau viral pas event, ini bisa eskalasi cepat (terutama kalau user marah karena tidak menang). Minimal butuh: tombol report, auto-flag kata-kata kasar, dan admin queue untuk moderasi.

### Bus factor = 1
Tidak ada dokumentasi setup, deployment, atau architecture overview. Kalau kamu sakit atau hilang akses, app dead. Minimal butuh: README.md yang menjelaskan cara setup local, cara deploy ke Vercel, lokasi env vars, dan flow penting (event scoring, anti-cheat, payment kalau aktif).

### Konten authoring tanpa review native
64 pelajaran grammar (Nahwu + Shorf) di-author dengan bantuan AI. Tanpa review dari penutur asli Arab atau musyrif berlatar pendidikan Arab klasik, kemungkinan ada error subtle yang tidak ketahuan (i'rab salah, contoh tidak tepat, transliterasi misleading). Risk untuk reputasi: kalau user lapor "salah!" di sosmed, kepercayaan rusak.

### Backup strategy kosong
Firestore dan Storage di Google, tapi tidak ada scheduled backup. Kalau ada accidental delete atau security incident, data hilang. Cukup setup `gcloud firestore export` mingguan ke bucket terpisah.

---

## Risiko legal — PDP Law

UU 27/2022 tentang Perlindungan Data Pribadi sudah berlaku di Indonesia. Modal pendaftaran event mengumpulkan: nama, HP, email, alamat, tahun lahir, no rekening, nama bank. Ini termasuk data pribadi yang diatur. Yang dibutuhkan:

1. **Privacy Policy** yang menjelaskan: data apa dikumpulkan, untuk tujuan apa, disimpan berapa lama, hak user untuk request delete.
2. **Explicit consent** di modal pendaftaran (selain 8 agreement points, perlu satu checkbox khusus "Saya setuju data pribadi saya diproses sesuai Privacy Policy").
3. **Right to deletion**: user harus bisa request akun + data-nya dihapus.

Penalti maksimal PDP Law bisa sampai 2% dari pendapatan tahunan, tapi yang lebih realistis untuk launch: risk teguran konsumen dan reputasi.

---

## Konteks pasar & posisi kompetitif

Tulis Noon bersaing tidak langsung dengan:

| Kompetitor | Strength mereka | Weakness mereka |
|---|---|---|
| Duolingo Arabic | Brand, gamifikasi, free | Generic Arabic (Fusha + dialek campur), bukan Hijazi |
| Bayyinah TV (Nouman Ali Khan) | Brand spiritual, content depth | Mahal ($11/bulan), bahasa Inggris, fokus tafsir |
| Madinah Arabic | Klasik, akademik | Static (PDF + video), no app, no gamifikasi |
| LingoAce / italki | Live tutor 1-on-1 | Mahal ($15-50/jam), butuh booking |
| YouTube channels (free) | Variasi banyak, free | No struktur, no progress tracking |

Posisi Tulis Noon: "Tulis Arab + Tutor + Komunitas, semua dalam 1 app, untuk Muslim Indonesia, dialek praktis Saudi". Tidak ada kompetitor langsung dengan kombinasi ini.

Threat utama bukan kompetitor sekarang, tapi **Duolingo Arabic kalau mereka tambah Hijazi mode** atau **Bayyinah kalau mereka launch app berbahasa Indonesia**. Window of opportunity 12–18 bulan untuk establish brand sebelum salah satu giant masuk.

---

## Roadmap 6 bulan

### Phase A — Launch & Stabilize (Juni–Juli 2026)

**Goal**: event sukses, user feedback collected, bug critical fixed.

Concrete tasks:
- Minggu 1 (sebelum 13 Juni): fix Tanya Cepat XP award. Buat T&C formal. Test full registration flow di device real.
- Minggu 2-3 (event berjalan): monitor crash report Vercel + Firebase, respon user via WhatsApp, screenshot daily leaderboard.
- Minggu 4 (pasca event): verifikasi pemenang via WhatsApp, transfer hadiah, post-mortem kumpulkan apa yang berhasil/gagal, write public recap blog post (good for SEO).

Metric sukses Phase A: 100+ user mendaftar event, 30+ user lulus eligibility (streak 10 hari), 3 pemenang valid, zero scandal di sosmed.

### Phase B — Monetize (Agustus–September 2026)

**Goal**: validasi willingness-to-pay, build sustainable revenue model.

Concrete tasks:
- Akhiri `LAUNCH_OPEN_ALL_PREMIUM` setelah event berakhir. User existing tetap dapat akses, user baru kena paywall normal.
- Test Midtrans payment flow di sandbox dulu, deploy ke prod hati-hati.
- Soft launch event kedua dengan hadiah kecil (Rp 250rb total) untuk validate scoring model bekerja di scale lebih besar.
- A/B test pricing: tier Coba 3 Bulan di Rp 79rb vs Rp 99rb vs Rp 149rb. Lihat conversion rate.
- Setup analytics tracking di funnel: register → trial → first purchase → renewal.

Metric sukses Phase B: paid conversion rate ≥3%, churn rate <40% setelah trial, revenue Rp 5jt/bulan minimum.

### Phase C — Sustain & Scale (Oktober–Desember 2026)

**Goal**: turunkan technical debt, siapkan untuk pertumbuhan.

Concrete tasks:
- Refactor `TulisNoonApp.jsx`: extract 4 tab files satu per minggu. Add JSDoc comments di handler utama.
- Setup Jest + React Testing Library, target coverage 30% untuk kode anti-cheat + event scoring + payment.
- Hire 1 musyrif freelance (Rp 2jt/bulan) untuk review konten grammar. Prioritas: 64 lessons Nahwu+Shorf.
- Setup scheduled backup Firestore mingguan ke bucket Cloud Storage terpisah.
- iOS feature parity (kalau belum). Submit ke App Store.
- Write minimal docs/README.md untuk siapa pun yang masuk codebase nanti.

Metric sukses Phase C: zero downtime selama Q4, payment flow zero error rate, content error rate <1% (user reports).

### Phase D — Differentiate (Januari 2027 onwards)

Kalau Phase A–C lancar, opsi-opsi yang layak dijajaki:

- **Live tutor 1-on-1** via video (bisa harga Rp 50-150rb/sesi).
- **Family plan / sekolah wholesale** untuk pesantren Indonesia.
- **Sertifikat resmi** dengan kerjasama lembaga di Saudi.
- **Marketplace musyrif Indonesia** yang sertifikasi via Tulis Noon.

Tapi jangan dimulai sebelum Phase A–C solid. Premature scale = premature death.

---

## Yang sebaiknya **TIDAK** dilakukan dalam 6 bulan ke depan

Ini sama pentingnya dengan apa yang harus dilakukan.

- **Tambah fitur major baru sebelum existing stable**. Tahan diri dari membuat "Mini Tafsir mode", "Live battle royale", atau ide kreatif lain sampai Phase B selesai.
- **Tambah path persona baru**. 5 sudah cukup. Fokus dalami 5 yang ada, bukan tambah jadi 10.
- **Bikin desktop app / Mac app**. Mobile-first dulu sampai 10rb DAU.
- **Run event berhadiah besar lagi sebelum infrastruktur stabil**. Event Juni cukup. Event berikutnya yang Rp 250rb baru di Phase B.
- **Negosiasi partnership besar (KemenAg, travel umrah)** sebelum ada data user 1.000+. Mereka butuh proof point.

---

## Refleksi: bekerja sendirian

Kondisi solo dev punya keuntungan velocity tapi punya batas yang nyata. Dalam 1 sesi hari ini saja kamu shipping 15+ major features — ini luar biasa, tapi juga berarti tidak ada yang me-review keputusan teknis dan strategis kamu secara independen.

Tiga rekomendasi praktis untuk sustainability mental + product:

1. **Set hari refleksi mingguan** (mungkin Jumat sore?) untuk tidak coding, tapi review apa yang kerja, apa yang tidak, dan apa yang next week.
2. **Cari satu teman dev** yang bisa di-bounce ideas. Bukan harus co-founder. Cukup orang yang ngerti React/Firebase dan kamu trust judgement-nya. Kasih akses read-only ke repo, sebulan sekali ngobrol 1 jam.
3. **Set hard limit jumlah fitur baru per minggu**. Misal: maksimal 1 fitur major + 2 bug fixes per minggu. Sisanya refactor, testing, dokumentasi.

---

## Penutup

Apa yang sudah dibangun di sini bukan project iseng. Ini foundation yang serius dan kalau dipertahankan dengan disiplin selama 6–12 bulan ke depan, punya potensi jadi salah satu app belajar Arab terbaik untuk pasar Indonesia.

Tantangan terbesar bukan lagi "apa fitur berikutnya yang harus ditambah", tapi **"bagaimana memastikan yang sudah ada terus jalan dengan stabil saat user mulai banyak"**. Mindset shift dari builder ke operator.

Selamat menyiapkan launch. Bismillah.
