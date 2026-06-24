# 🔍 Audit Konten Tulis Noon — Comprehensive

Tanggal: **2026-06-24**
Total items diaudit: **2.616**

## 📊 Statistik Per Source

| Source | Items | % dari total |
|---|---:|---:|
| Lesson Umrah | 565 | 21.6% |
| Lesson Profesional | 542 | 20.7% |
| Lesson Pelajar | 316 | 12.1% |
| Cerita | 277 | 10.6% |
| Tebak Gambar | 199 | 7.6% |
| Perkenalan Diri | 125 | 4.8% |
| Nahwu | 120 | 4.6% |
| Tulis Arab | 111 | 4.2% |
| Shorf | 96 | 3.7% |
| Challenge | 80 | 3.1% |
| Ngomong | 64 | 2.4% |
| Hafalan | 55 | 2.1% |
| Match | 43 | 1.6% |
| Roleplay | 23 | 0.9% |

## 🏷️ Per Type Item

| Type | Count |
|---|---:|
| `dialog` | 1.029 |
| `vocab` | 862 |
| `quiz-mc` | 372 |
| `tap-letter` | 111 |
| `mc` | 80 |
| `ayat` | 55 |
| `match` | 43 |
| `ngomong-kata` | 36 |
| `ngomong-kalimat` | 18 |
| `ngomong-cerita` | 10 |

## 🎯 Ringkasan Temuan

| Kategori | Jumlah | Severity |
|---|---:|---|
| Exact duplicate (Arab+Indo persis sama) | 84 | 🔴 Tinggi |
| Intra-section duplikat | 61 | 🔴 Tinggi (lazy authoring) |
| Translation mismatch | 95 | 🟠 Sedang |
| Vocab overlap cross-section | 120 | 🟡 Rendah (mostly OK) |
| Semantic similar (beda teks, sama maksud) | 9 | 🟡 Review |
| Distractor reuse (>5×) | 49 | 🟠 Sedang |
| Position bias (correct answer terbias) | 5 sources | 🟠 Sedang |
| Harakat inconsistency (<30%) | 128 | 🟠 Sedang |
| Orphan vocab (Tebak/Match tanpa konteks lesson) | 204 | 🟡 Rendah |
| Missing transliterasi Latin | 142 | 🟢 Cosmetic |

---

## 🚨 1. Exact Duplicates

Soal/vocab yang Arab DAN Indonesia-nya sama persis di multiple file. **Wajib fix** — user akan ngerasa "kok sama lagi".

Total: **84** duplicate keys

### 1. `مَاء` — _Air_

Muncul **5×** di:
- **Tebak Gambar** → `makanan/maa'` (vocab)
- **Lesson Umrah** → `restoran-makanan/vocab` (vocab)
- **Match** → `level2/q17/air` (match)
- **Ngomong** → `kata/kata-mandi/item3` (ngomong-kata)
- **Ngomong** → `kata/kata-makanan/item4` (ngomong-kata)

### 2. `شُكْرًا جَزِيلًا` — _"Terima kasih banyak."_

Muncul **5×** di:
- **Cerita** → `tanya-waktu-sholat/page3/line0` (dialog)
- **Lesson Umrah** → `bandara-imigrasi/conv3/line2` (dialog)
- **Tulis Arab** → `menulis-kalimat/L11/Terima kasih banyak` (tap-letter)
- **Challenge** → `pasar-madinah/L5/q2` (mc)
- **Roleplay** → `tanya-arah/vocab` (vocab)

### 3. `تَمْر` — _Kurma_

Muncul **4×** di:
- **Tebak Gambar** → `makanan/tamr` (vocab)
- **Challenge** → `pasar-madinah/L3/q0` (mc)
- **Match** → `level2/q19/kurma` (match)
- **Roleplay** → `order-kopi/vocab` (vocab)

### 4. `صَبَاحُ الْخَيْر` — _Selamat pagi_

Muncul **4×** di:
- **Cerita** → `sarapan-hotel/page1/vocab` (vocab)
- **Lesson Umrah** → `sosial-salam/vocab` (vocab)
- **Lesson Pelajar** → `sapa-guru/vocab` (vocab)
- **Challenge** → `pasar-madinah/L1/q2` (mc)

### 5. `بَعِيد` — _Jauh_

Muncul **4×** di:
- **Lesson Umrah** → `transportasi-hotel/vocab` (vocab)
- **Lesson Umrah** → `arah-lokasi/vocab` (vocab)
- **Challenge** → `pasar-madinah/L4/q2` (mc)
- **Roleplay** → `tanya-arah/vocab` (vocab)

### 6. `قَرِيب` — _Dekat_

Muncul **4×** di:
- **Lesson Umrah** → `transportasi-hotel/vocab` (vocab)
- **Lesson Umrah** → `arah-lokasi/vocab` (vocab)
- **Challenge** → `pasar-madinah/L4/q1` (mc)
- **Roleplay** → `tanya-arah/vocab` (vocab)

### 7. `خُبْز` — _Roti_

Muncul **3×** di:
- **Tebak Gambar** → `makanan/khubz` (vocab)
- **Cerita** → `sarapan-hotel/page2/vocab` (vocab)
- **Ngomong** → `kata/kata-makanan/item0` (ngomong-kata)

### 8. `شَاي` — _Teh_

Muncul **3×** di:
- **Tebak Gambar** → `makanan/shay` (vocab)
- **Lesson Umrah** → `restoran-makanan/vocab` (vocab)
- **Ngomong** → `kata/kata-makanan/item5` (ngomong-kata)

### 9. `أَرُزّ` — _Nasi_

Muncul **3×** di:
- **Tebak Gambar** → `makanan/aruzz` (vocab)
- **Lesson Umrah** → `restoran-makanan/vocab` (vocab)
- **Ngomong** → `kata/kata-makanan/item1` (ngomong-kata)

### 10. `لَحْم` — _Daging_

Muncul **3×** di:
- **Tebak Gambar** → `makanan/lahm` (vocab)
- **Lesson Umrah** → `restoran-makanan/vocab` (vocab)
- **Ngomong** → `kata/kata-makanan/item2` (ngomong-kata)

### 11. `الْكَعْبَة` — _Ka'bah_

Muncul **3×** di:
- **Tebak Gambar** → `tempat/al-ka'ba` (vocab)
- **Tebak Gambar** → `pakaian-umrah/al-ka'ba` (vocab)
- **Lesson Umrah** → `masjidil-haram/vocab` (vocab)

### 12. `هَدِيَّة` — _Hadiah_

Muncul **3×** di:
- **Tebak Gambar** → `pakaian-umrah/hadiya` (vocab)
- **Cerita** → `salman-al-farisi/page6/vocab` (vocab)
- **Lesson Umrah** → `pasar-belanja/vocab` (vocab)

### 13. `كُرَة الْقَدَم` — _Sepak Bola_

Muncul **3×** di:
- **Tebak Gambar** → `olahraga/kurat al-qadam` (vocab)
- **Perkenalan Diri** → `hobi/vocab` (vocab)
- **Lesson Pelajar** → `olahraga-budaya/vocab` (vocab)

### 14. `قَهْوَة عَرَبِيَّة` — _Kopi Arab_

Muncul **3×** di:
- **Cerita** → `order-kopi-saudi/page0/vocab` (vocab)
- **Challenge** → `tower-zamzam/L3/q1` (mc)
- **Roleplay** → `order-kopi/vocab` (vocab)

### 15. `مِنْ أَيْنَ أَنْتَ؟` — _Dari mana asalmu?_

Muncul **3×** di:
- **Perkenalan Diri** → `asal/vocab` (vocab)
- **Lesson Umrah** → `sosial-salam/vocab` (vocab)
- **Tulis Arab** → `menulis-kalimat/L10/Dari mana asalmu?` (tap-letter)

### 16. `الحَمْدُ لِلَّه.` — _Alhamdulillah._

Muncul **3×** di:
- **Lesson Umrah** → `restoran-makanan/conv1/line2` (dialog)
- **Lesson Umrah** → `sosial-salam/vocab` (vocab)
- **Tulis Arab** → `menulis-kalimat/L12/Alhamdulillah` (tap-letter)

### 17. `نَعَم، تَفَضَّل.` — _Iya, silakan._

Muncul **3×** di:
- **Lesson Umrah** → `restoran-makanan/conv4/line3` (dialog)
- **Lesson Profesional** → `telepon-bisnis/conv2/line3` (dialog)
- **Lesson Pelajar** → `administrasi-kampus/conv0/line2` (dialog)

### 18. `لِمَاذَا؟` — _Kenapa?_

Muncul **3×** di:
- **Lesson Profesional** → `diskusi-pendapat/conv0/line1` (dialog)
- **Lesson Profesional** → `cuti-izin/conv3/line1` (dialog)
- **Lesson Pelajar** → `tugas-ujian/conv5/line1` (dialog)

### 19. `قَهْوَة` — _Kopi_

Muncul **2×** di:
- **Tebak Gambar** → `makanan/qahwa` (vocab)
- **Lesson Umrah** → `restoran-makanan/vocab` (vocab)

### 20. `دَجَاج` — _Ayam_

Muncul **2×** di:
- **Tebak Gambar** → `makanan/dajaj` (vocab)
- **Lesson Umrah** → `restoran-makanan/vocab` (vocab)

### 21. `مَسْجِد` — _Masjid_

Muncul **2×** di:
- **Tebak Gambar** → `tempat/masjid` (vocab)
- **Match** → `level2/q18/masjid` (match)

### 22. `فُنْدُق` — _Hotel_

Muncul **2×** di:
- **Tebak Gambar** → `tempat/funduq` (vocab)
- **Cerita** → `pesan-hotel/page0/vocab` (vocab)

### 23. `مَطَار` — _Bandara_

Muncul **2×** di:
- **Tebak Gambar** → `tempat/matar` (vocab)
- **Cerita** → `tiba-di-madinah/page0/vocab` (vocab)

### 24. `سَمَك` — _Ikan_

Muncul **2×** di:
- **Tebak Gambar** → `hewan-alam/samak` (vocab)
- **Lesson Umrah** → `restoran-makanan/vocab` (vocab)

### 25. `صَحْرَاء` — _Padang Pasir_

Muncul **2×** di:
- **Tebak Gambar** → `hewan-alam/sahra'` (vocab)
- **Cerita** → `taksi-mekkah/page6/vocab` (vocab)

### 26. `كِتَاب` — _Buku_

Muncul **2×** di:
- **Tebak Gambar** → `benda/kitab` (vocab)
- **Ngomong** → `kata/kata-belajar/item1` (ngomong-kata)

### 27. `قَلَم` — _Pena_

Muncul **2×** di:
- **Tebak Gambar** → `benda/qalam` (vocab)
- **Ngomong** → `kata/kata-belajar/item0` (ngomong-kata)

### 28. `هَاتِف` — _Telepon_

Muncul **2×** di:
- **Tebak Gambar** → `benda/hatif` (vocab)
- **Ngomong** → `kata/kata-tas/item3` (ngomong-kata)

### 29. `سَاعَة` — _Jam_

Muncul **2×** di:
- **Tebak Gambar** → `benda/sa'a` (vocab)
- **Ngomong** → `kata/kata-kamar/item2` (ngomong-kata)

### 30. `مِفْتَاح` — _Kunci_

Muncul **2×** di:
- **Tebak Gambar** → `benda/miftah` (vocab)
- **Ngomong** → `kata/kata-tas/item2` (ngomong-kata)

_(... 54 lebih — lihat audit-exact-duplicates.csv)_

---

## 🔂 2. Intra-Section Duplikat

Vocab/frasa sama muncul lebih dari 1× di FILE/SOURCE yang sama. **Biasanya bug authoring — copy-paste**.

Total: **61** cases

### 1. [Tulis Arab] `ب` (7×)
- `mengenal-huruf/L1/ba` — _ba_
- `mengenal-huruf/L2/ba (1 titik bawah)` — _ba (1 titik bawah)_
- `mengenal-huruf/L3/ba + fatha (ba)` — _ba + fatha (ba)_
- `mengenal-huruf/L3/ba + kasra (bi)` — _ba + kasra (bi)_
- `mengenal-huruf/L3/ba + dhamma (bu)` — _ba + dhamma (bu)_
- `mengenal-huruf/L3/ba + sukun (b mati)` — _ba + sukun (b mati)_
- `cara-baca/L6/ba sukun (b mati) — di "lab"` — _ba sukun (b mati) — di "lab"_

### 2. [Cerita] `abu bakr ash-shiddiq` (3×)
- `sahabat-bilal/endQuiz#2` — _Yang membebaskan Bilal dari perbudakan adalah..._
- `hijrah-madinah/endQuiz#1` — _Teman Nabi saat hijrah..._
- `aisyah-ra/endQuiz#0` — _Aisyah adalah putri dari sahabat..._

### 3. [Perkenalan Diri] `ما اسمك` (3×)
- `nama/vocab` — _Siapa namamu? (ke laki)_
- `nama/vocab` — _Siapa namamu? (ke perempuan)_
- `nama/quiz#3` — _Cara tanya nama ke perempuan?_

### 4. [Lesson Pelajar] `لماذا` (3×)
- `tanya-diskusi/conv3/line2` — _Mengapa?_
- `minta-izin-kelas/conv5/line1` — _Mengapa?_
- `tugas-ujian/conv5/line1` — _Kenapa?_

### 5. [Tulis Arab] `ر` (3×)
- `mengenal-huruf/L1/ra` — _ra_
- `mengenal-huruf/L3/ra + dhamma (ru)` — _ra + dhamma (ru)_
- `cara-baca/L6/ra sukun (r mati)` — _ra sukun (r mati)_

### 6. [Tulis Arab] `م` (3×)
- `mengenal-huruf/L1/mim` — _mim_
- `mengenal-huruf/L3/mim + sukun (m mati)` — _mim + sukun (m mati)_
- `cara-baca/L6/mim sukun (m mati)` — _mim sukun (m mati)_

### 7. [Tulis Arab] `ن` (3×)
- `mengenal-huruf/L1/nun` — _nun_
- `mengenal-huruf/L3/nun + fatha (na)` — _nun + fatha (na)_
- `cara-baca/L6/nun tasydid (nn)` — _nun tasydid (nn)_

### 8. [Tebak Gambar] `الكعبة` (2×)
- `tempat/al-ka'ba` — _Ka'bah_
- `pakaian-umrah/al-ka'ba` — _Ka'bah_

### 9. [Tebak Gambar] `جمل` (2×)
- `hewan-alam/jamal` — _Unta_
- `transportasi/jamal` — _Unta (tunggangan)_

### 10. [Tebak Gambar] `حصان` (2×)
- `hewan-alam/hisan` — _Kuda_
- `transportasi/hisan` — _Kuda (tunggangan)_

### 11. [Cerita] `من فضلك` (2×)
- `tiba-di-madinah/page6/vocab` — _Tolong / Silakan (sopan)_
- `tiba-di-madinah/endQuiz#4` — _Untuk meminta diantar dengan sopan, kita pakai kata..._

### 12. [Cerita] `عبد` (2×)
- `sahabat-bilal/page1/vocab` — _Hamba / Budak_
- `salman-al-farisi/page4/vocab` — _Budak / Hamba_

### 13. [Cerita] `صباح الخير` (2×)
- `sarapan-hotel/page1/vocab` — _Selamat pagi_
- `sarapan-hotel/endQuiz#1` — _Bagaimana mengucap "Selamat pagi"?_

### 14. [Cerita] `لذيذ` (2×)
- `sarapan-hotel/page4/vocab` — _Enak / Lezat_
- `sarapan-hotel/endQuiz#3` — _Untuk bilang "enak", pakai kata..._

### 15. [Cerita] `من أين` (2×)
- `bertemu-jamaah/page1/vocab` — _Dari mana_
- `bertemu-jamaah/endQuiz#1` — _Cara tanya "Dari mana?" dalam Arab..._

### 16. [Cerita] `أيضا` (2×)
- `bertemu-jamaah/page3/vocab` — _Juga_
- `bertemu-jamaah/endQuiz#2` — _Kata "juga" dalam Arab..._

### 17. [Cerita] `كيف حالك` (2×)
- `telepon-keluarga/page1/vocab` — _Apa kabar (untuk perempuan)_
- `telepon-keluarga/endQuiz#1` — _Cara tanya "Apa kabar" ke perempuan..._

### 18. [Cerita] `بخير` (2×)
- `telepon-keluarga/page2/vocab` — _Baik / Sehat_
- `telepon-keluarga/endQuiz#2` — _Jawaban "Baik" dalam Arab..._

### 19. [Cerita] `يوم الأربعاء` (2×)
- `pesan-hotel/page4/vocab` — _Hari Rabu_
- `pesan-hotel/endQuiz#2` — _Hari Rabu dalam Arab..._

### 20. [Cerita] `1000` (2×)
- `perang-badar/endQuiz#2` — _Jumlah pasukan Quraisy..._
- `perang-badar/endQuiz#4` — _Allah mengirim ... malaikat untuk membantu._

### 21. [Perkenalan Diri] `تشرفنا` (2×)
- `nama/vocab` — _Senang berkenalan_
- `nama/quiz#2` — _Apa yang diucapkan setelah kenalan?_

### 22. [Perkenalan Diri] `من أين أنت` (2×)
- `asal/vocab` — _Dari mana asalmu?_
- `asal/quiz#0` — _Bagaimana cara tanya asal seseorang?_

### 23. [Perkenalan Diri] `كم عمرك` (2×)
- `umur/vocab` — _Berapa umurmu? (ke laki)_
- `umur/quiz#0` — _Bagaimana cara tanya umur?_

### 24. [Perkenalan Diri] `ما مهنتك` (2×)
- `pekerjaan/vocab` — _Apa pekerjaanmu?_
- `pekerjaan/quiz#0` — _Bagaimana cara tanya pekerjaan?_

### 25. [Perkenalan Diri] `زوجتي` (2×)
- `keluarga/vocab` — _Istriku_
- `keluarga/quiz#1` — _Cara bilang "istriku"?_

### 26. [Perkenalan Diri] `كم ولد عندك` (2×)
- `keluarga/vocab` — _Berapa anakmu?_
- `keluarga/quiz#3` — _Cara tanya jumlah anak?_

### 27. [Perkenalan Diri] `جئت للعمرة` (2×)
- `tujuan/vocab` — _Aku datang untuk umrah_
- `tujuan/quiz#0` — _Cara bilang "aku datang untuk umrah"?_

### 28. [Perkenalan Diri] `بطلاقة` (2×)
- `bahasa/vocab` — _Lancar_
- `bahasa/quiz#1` — _Cara bilang "lancar"?_

### 29. [Perkenalan Diri] `أتعلم` (2×)
- `bahasa/vocab` — _Aku belajar_
- `bahasa/quiz#2` — _Cara bilang "aku sedang belajar"?_

### 30. [Perkenalan Diri] `سأرسل لك` (2×)
- `kontak/vocab` — _Aku akan kirim untukmu_
- `kontak/quiz#1` — _Cara bilang "aku akan kirim untukmu"?_

_(... 31 lebih)_

---

## 🌐 3. Translation Mismatch

Vocab Arab sama, tapi terjemahan Indo BEDA di file beda. Bikin user bingung.

Total: **95**

### 1. `ب`

Terjemahan berbeda:
- "ba"
- "ba (1 titik bawah)"
- "ba + fatha (ba)"
- "ba + kasra (bi)"
- "ba + dhamma (bu)"
- "ba + sukun (b mati)"
- "ba sukun (b mati) — di "lab""

Lokasi:
- **Tulis Arab** → `mengenal-huruf/L1/ba` → "ba"
- **Tulis Arab** → `mengenal-huruf/L2/ba (1 titik bawah)` → "ba (1 titik bawah)"
- **Tulis Arab** → `mengenal-huruf/L3/ba + fatha (ba)` → "ba + fatha (ba)"
- **Tulis Arab** → `mengenal-huruf/L3/ba + kasra (bi)` → "ba + kasra (bi)"
- **Tulis Arab** → `mengenal-huruf/L3/ba + dhamma (bu)` → "ba + dhamma (bu)"
- **Tulis Arab** → `mengenal-huruf/L3/ba + sukun (b mati)` → "ba + sukun (b mati)"
- **Tulis Arab** → `cara-baca/L6/ba sukun (b mati) — di "lab"` → "ba sukun (b mati) — di "lab""
- **Match** → `level1/q1/ba` → "ba"

### 2. `الحمد لله`

Terjemahan berbeda:
- "Segala puji bagi Allah"
- "Alhamdulillah."
- "Alhamdulillah"
- "Alhamdulillah (segala puji bagi Allah)"

Lokasi:
- **Cerita** → `tiba-di-madinah/page7/vocab` → "Segala puji bagi Allah"
- **Perkenalan Diri** → `nama/vocab` → "Segala puji bagi Allah"
- **Lesson Umrah** → `restoran-makanan/conv1/line2` → "Alhamdulillah."
- **Lesson Umrah** → `sosial-salam/vocab` → "Alhamdulillah"
- **Tulis Arab** → `menulis-kalimat/L12/Alhamdulillah` → "Alhamdulillah"
- **Match** → `level4/q36/Alhamdulillah (segala puji bagi Allah)` → "Alhamdulillah (segala puji bagi Allah)"

### 3. `تمر`

Terjemahan berbeda:
- "Kurma"
- "tamr (kurma)"
- "kurma"

Lokasi:
- **Tebak Gambar** → `makanan/tamr` → "Kurma"
- **Tulis Arab** → `menulis-kata/L8/tamr (kurma)` → "tamr (kurma)"
- **Challenge** → `pasar-madinah/L3/q0` → "Kurma"
- **Match** → `level2/q19/kurma` → "kurma"
- **Roleplay** → `order-kopi/vocab` → "Kurma"

### 4. `صباح الخير`

Terjemahan berbeda:
- "Selamat pagi"
- "Bagaimana mengucap "Selamat pagi"?"

Lokasi:
- **Cerita** → `sarapan-hotel/page1/vocab` → "Selamat pagi"
- **Cerita** → `sarapan-hotel/endQuiz#1` → "Bagaimana mengucap "Selamat pagi"?"
- **Lesson Umrah** → `sosial-salam/vocab` → "Selamat pagi"
- **Lesson Pelajar** → `sapa-guru/vocab` → "Selamat pagi"
- **Challenge** → `pasar-madinah/L1/q2` → "Selamat pagi"

### 5. `لماذا`

Terjemahan berbeda:
- "Kenapa?"
- "Mengapa?"

Lokasi:
- **Lesson Profesional** → `diskusi-pendapat/conv0/line1` → "Kenapa?"
- **Lesson Profesional** → `cuti-izin/conv3/line1` → "Kenapa?"
- **Lesson Pelajar** → `tanya-diskusi/conv3/line2` → "Mengapa?"
- **Lesson Pelajar** → `minta-izin-kelas/conv5/line1` → "Mengapa?"
- **Lesson Pelajar** → `tugas-ujian/conv5/line1` → "Kenapa?"

### 6. `كيف حالك`

Terjemahan berbeda:
- "Apa kabar (untuk perempuan)"
- "Cara tanya "Apa kabar" ke perempuan..."
- "Apa kabar"
- "Apa kabar?"

Lokasi:
- **Cerita** → `telepon-keluarga/page1/vocab` → "Apa kabar (untuk perempuan)"
- **Cerita** → `telepon-keluarga/endQuiz#1` → "Cara tanya "Apa kabar" ke perempuan..."
- **Lesson Umrah** → `sosial-salam/vocab` → "Apa kabar"
- **Tulis Arab** → `menulis-kalimat/L10/Apa kabar?` → "Apa kabar?"

### 7. `ما اسمك`

Terjemahan berbeda:
- "Siapa namamu? (ke laki)"
- "Siapa namamu? (ke perempuan)"
- "Cara tanya nama ke perempuan?"
- "Siapa namamu?"

Lokasi:
- **Perkenalan Diri** → `nama/vocab` → "Siapa namamu? (ke laki)"
- **Perkenalan Diri** → `nama/vocab` → "Siapa namamu? (ke perempuan)"
- **Perkenalan Diri** → `nama/quiz#3` → "Cara tanya nama ke perempuan?"
- **Tulis Arab** → `menulis-kalimat/L10/Siapa namamu?` → "Siapa namamu?"

### 8. `من أين أنت`

Terjemahan berbeda:
- "Dari mana asalmu?"
- "Bagaimana cara tanya asal seseorang?"
- "Dari mana asalmu"

Lokasi:
- **Perkenalan Diri** → `asal/vocab` → "Dari mana asalmu?"
- **Perkenalan Diri** → `asal/quiz#0` → "Bagaimana cara tanya asal seseorang?"
- **Lesson Umrah** → `sosial-salam/vocab` → "Dari mana asalmu"
- **Tulis Arab** → `menulis-kalimat/L10/Dari mana asalmu?` → "Dari mana asalmu?"

### 9. `جزاك الله خيرا`

Terjemahan berbeda:
- "Semoga Allah membalas kebaikan Anda."
- "Semoga Allah balas."
- "Semoga Allah balas kebaikanmu."
- "Jazakallahu khairan (semoga Allah balas kebaikan)"

Lokasi:
- **Lesson Umrah** → `transportasi-hotel/conv6/line3` → "Semoga Allah membalas kebaikan Anda."
- **Lesson Pelajar** → `minta-izin-kelas/conv4/line2` → "Semoga Allah balas."
- **Lesson Pelajar** → `kantin/conv2/line3` → "Semoga Allah balas kebaikanmu."
- **Match** → `level4/q38/Jazakallahu khairan (semoga Allah balas kebaikan)` → "Jazakallahu khairan (semoga Allah balas kebaikan)"

### 10. `ما السبب`

Terjemahan berbeda:
- "Sebabnya?"
- "Penyebabnya?"
- "Apa sebabnya?"

Lokasi:
- **Lesson Profesional** → `jadwal-tugas/conv2/line1` → "Sebabnya?"
- **Lesson Profesional** → `krisis-masalah/conv4/line1` → "Penyebabnya?"
- **Lesson Pelajar** → `minta-izin-kelas/conv1/line1` → "Apa sebabnya?"
- **Lesson Pelajar** → `minta-izin-kelas/conv2/line1` → "Sebabnya?"

### 11. `ر`

Terjemahan berbeda:
- "ra"
- "ra + dhamma (ru)"
- "ra sukun (r mati)"

Lokasi:
- **Tulis Arab** → `mengenal-huruf/L1/ra` → "ra"
- **Tulis Arab** → `mengenal-huruf/L3/ra + dhamma (ru)` → "ra + dhamma (ru)"
- **Tulis Arab** → `cara-baca/L6/ra sukun (r mati)` → "ra sukun (r mati)"
- **Match** → `level1/q6/ra` → "ra"

### 12. `م`

Terjemahan berbeda:
- "mim"
- "mim + sukun (m mati)"
- "mim sukun (m mati)"

Lokasi:
- **Tulis Arab** → `mengenal-huruf/L1/mim` → "mim"
- **Tulis Arab** → `mengenal-huruf/L3/mim + sukun (m mati)` → "mim + sukun (m mati)"
- **Tulis Arab** → `cara-baca/L6/mim sukun (m mati)` → "mim sukun (m mati)"
- **Match** → `level1/q9/mim` → "mim"

### 13. `ن`

Terjemahan berbeda:
- "nun"
- "nun + fatha (na)"
- "nun tasydid (nn)"

Lokasi:
- **Tulis Arab** → `mengenal-huruf/L1/nun` → "nun"
- **Tulis Arab** → `mengenal-huruf/L3/nun + fatha (na)` → "nun + fatha (na)"
- **Tulis Arab** → `cara-baca/L6/nun tasydid (nn)` → "nun tasydid (nn)"
- **Match** → `level1/q10/nun` → "nun"

### 14. `مسجد`

Terjemahan berbeda:
- "Masjid"
- "masjid (masjid)"
- "masjid"

Lokasi:
- **Tebak Gambar** → `tempat/masjid` → "Masjid"
- **Tulis Arab** → `menulis-kata/L9/masjid (masjid)` → "masjid (masjid)"
- **Match** → `level2/q18/masjid` → "masjid"

### 15. `كتاب`

Terjemahan berbeda:
- "Buku"
- "kitab/buku"
- "buku"

Lokasi:
- **Tebak Gambar** → `benda/kitab` → "Buku"
- **Match** → `level2/q16/kitab/buku` → "kitab/buku"
- **Ngomong** → `kata/kata-belajar/item1` → "buku"

### 16. `ملعقة`

Terjemahan berbeda:
- "Sendok"
- "Sendok takar"
- "sendok"

Lokasi:
- **Tebak Gambar** → `benda/mil'aqa` → "Sendok"
- **Lesson Umrah** → `apotek-kesehatan/vocab` → "Sendok takar"
- **Ngomong** → `kata/kata-dapur/item2` → "sendok"

### 17. `من فضلك`

Terjemahan berbeda:
- "Tolong / Silakan (sopan)"
- "Untuk meminta diantar dengan sopan, kita pakai kata..."
- "tolong (min fadlik)"

Lokasi:
- **Cerita** → `tiba-di-madinah/page6/vocab` → "Tolong / Silakan (sopan)"
- **Cerita** → `tiba-di-madinah/endQuiz#4` → "Untuk meminta diantar dengan sopan, kita pakai kata..."
- **Match** → `level3/q34/tolong (min fadlik)` → "tolong (min fadlik)"

### 18. `غالي`

Terjemahan berbeda:
- "Mahal"
- "ghaali (mahal)"
- "mahal (ghali)"

Lokasi:
- **Cerita** → `belanja-kurma/page4/vocab` → "Mahal"
- **Tulis Arab** → `menulis-kata/L8/ghaali (mahal)` → "ghaali (mahal)"
- **Match** → `level3/q27/mahal (ghali)` → "mahal (ghali)"

### 19. `abu bakr ash-shiddiq`

Terjemahan berbeda:
- "Yang membebaskan Bilal dari perbudakan adalah..."
- "Teman Nabi saat hijrah..."
- "Aisyah adalah putri dari sahabat..."

Lokasi:
- **Cerita** → `sahabat-bilal/endQuiz#2` → "Yang membebaskan Bilal dari perbudakan adalah..."
- **Cerita** → `hijrah-madinah/endQuiz#1` → "Teman Nabi saat hijrah..."
- **Cerita** → `aisyah-ra/endQuiz#0` → "Aisyah adalah putri dari sahabat..."

### 20. `ماء زمزم`

Terjemahan berbeda:
- "Air Zam-zam"
- "Air zamzam"
- "Air zam-zam"

Lokasi:
- **Cerita** → `bertemu-jamaah/page0/vocab` → "Air Zam-zam"
- **Lesson Umrah** → `check-in-hotel/vocab` → "Air zamzam"
- **Challenge** → `tower-zamzam/L3/q0` → "Air zam-zam"

### 21. `بخير`

Terjemahan berbeda:
- "Baik / Sehat"
- "Jawaban "Baik" dalam Arab..."
- "Baik"

Lokasi:
- **Cerita** → `telepon-keluarga/page2/vocab` → "Baik / Sehat"
- **Cerita** → `telepon-keluarga/endQuiz#2` → "Jawaban "Baik" dalam Arab..."
- **Lesson Pelajar** → `sapa-guru/vocab` → "Baik"

### 22. `تشرفنا`

Terjemahan berbeda:
- "Senang berkenalan"
- "Apa yang diucapkan setelah kenalan?"

Lokasi:
- **Perkenalan Diri** → `nama/vocab` → "Senang berkenalan"
- **Perkenalan Diri** → `nama/quiz#2` → "Apa yang diucapkan setelah kenalan?"
- **Lesson Umrah** → `sosial-salam/vocab` → "Senang berkenalan"

### 23. `يمين`

Terjemahan berbeda:
- "Kanan"
- "kanan (yamin)"

Lokasi:
- **Lesson Umrah** → `arah-lokasi/vocab` → "Kanan"
- **Match** → `level3/q32/kanan (yamin)` → "kanan (yamin)"
- **Roleplay** → `tanya-arah/vocab` → "Kanan"

### 24. `الفاتورة`

Terjemahan berbeda:
- "Tagihan"
- "Faktur"
- "Tagihan/Struk"

Lokasi:
- **Lesson Umrah** → `restoran-makanan/vocab` → "Tagihan"
- **Lesson Profesional** → `keuangan/vocab` → "Faktur"
- **Challenge** → `tower-zamzam/L5/q1` → "Tagihan/Struk"

### 25. `رخيص`

Terjemahan berbeda:
- "Murah"
- "rakhiis (murah)"
- "murah (rakhis)"

Lokasi:
- **Lesson Umrah** → `pasar-belanja/vocab` → "Murah"
- **Tulis Arab** → `menulis-kata/L8/rakhiis (murah)` → "rakhiis (murah)"
- **Match** → `level3/q28/murah (rakhis)` → "murah (rakhis)"

### 26. `خصم`

Terjemahan berbeda:
- "Diskon"
- "Diskon/Potongan"

Lokasi:
- **Lesson Umrah** → `pasar-belanja/vocab` → "Diskon"
- **Lesson Profesional** → `negosiasi/vocab` → "Diskon"
- **Challenge** → `pasar-kakkiyah/L3/q0` → "Diskon/Potongan"

### 27. `ت`

Terjemahan berbeda:
- "ta"
- "ta + fatha (ta)"

Lokasi:
- **Tulis Arab** → `mengenal-huruf/L1/ta` → "ta"
- **Tulis Arab** → `mengenal-huruf/L3/ta + fatha (ta)` → "ta + fatha (ta)"
- **Match** → `level1/q2/ta` → "ta"

### 28. `ج`

Terjemahan berbeda:
- "jim"
- "jim (titik bawah)"

Lokasi:
- **Tulis Arab** → `mengenal-huruf/L1/jim` → "jim"
- **Tulis Arab** → `mengenal-huruf/L2/jim (titik bawah)` → "jim (titik bawah)"
- **Match** → `level1/q3/jim` → "jim"

### 29. `د`

Terjemahan berbeda:
- "dal"
- "dal tasydid (dd)"

Lokasi:
- **Tulis Arab** → `mengenal-huruf/L1/dal` → "dal"
- **Tulis Arab** → `cara-baca/L6/dal tasydid (dd)` → "dal tasydid (dd)"
- **Match** → `level1/q5/dal` → "dal"

### 30. `س`

Terjemahan berbeda:
- "sin"
- "sin + fatha (sa)"

Lokasi:
- **Tulis Arab** → `mengenal-huruf/L1/sin` → "sin"
- **Tulis Arab** → `mengenal-huruf/L3/sin + fatha (sa)` → "sin + fatha (sa)"
- **Match** → `level1/q7/sin` → "sin"

_(... 65 lebih)_

---

## 📚 4. Vocab Overlap Cross-Section

Vocab muncul di multiple section. **Mostly intentional** (spaced repetition).

Filter: vocab yang muncul di ≥3 source.

| Arab | # source | Sources |
|---|---:|---|
| `تمر` | 5 | Tebak Gambar, Tulis Arab, Challenge, Match, Roleplay |
| `الحمد لله` | 5 | Cerita, Perkenalan Diri, Lesson Umrah, Tulis Arab, Match |
| `شكرا جزيلا` | 5 | Cerita, Lesson Umrah, Tulis Arab, Challenge, Roleplay |
| `ماء` | 4 | Tebak Gambar, Lesson Umrah, Match, Ngomong |
| `صباح الخير` | 4 | Cerita, Lesson Umrah, Lesson Pelajar, Challenge |
| `خبز` | 3 | Tebak Gambar, Cerita, Ngomong |
| `شاي` | 3 | Tebak Gambar, Lesson Umrah, Ngomong |
| `أرز` | 3 | Tebak Gambar, Lesson Umrah, Ngomong |
| `لحم` | 3 | Tebak Gambar, Lesson Umrah, Ngomong |
| `مسجد` | 3 | Tebak Gambar, Tulis Arab, Match |
| `كتاب` | 3 | Tebak Gambar, Match, Ngomong |
| `ملعقة` | 3 | Tebak Gambar, Lesson Umrah, Ngomong |
| `هدية` | 3 | Tebak Gambar, Cerita, Lesson Umrah |
| `كرة القدم` | 3 | Tebak Gambar, Perkenalan Diri, Lesson Pelajar |
| `غالي` | 3 | Cerita, Tulis Arab, Match |
| `ماء زمزم` | 3 | Cerita, Lesson Umrah, Challenge |
| `قهوة عربية` | 3 | Cerita, Challenge, Roleplay |
| `كيف حالك` | 3 | Cerita, Lesson Umrah, Tulis Arab |
| `من أين أنت` | 3 | Perkenalan Diri, Lesson Umrah, Tulis Arab |
| `بعيد` | 3 | Lesson Umrah, Challenge, Roleplay |
| `قريب` | 3 | Lesson Umrah, Challenge, Roleplay |
| `جزاك الله خيرا` | 3 | Lesson Umrah, Lesson Pelajar, Match |
| `يمين` | 3 | Lesson Umrah, Match, Roleplay |
| `الفاتورة` | 3 | Lesson Umrah, Lesson Profesional, Challenge |
| `نعم تفضل` | 3 | Lesson Umrah, Lesson Profesional, Lesson Pelajar |
| `رخيص` | 3 | Lesson Umrah, Tulis Arab, Match |
| `خصم` | 3 | Lesson Umrah, Lesson Profesional, Challenge |
| `السلام عليكم` | 3 | Tulis Arab, Challenge, Roleplay |

---

## 🧠 5. Semantic Similar (beda teks, mungkin sama maksud)

Setelah strip kata tanya umum, sisa teks Arab sama. Bisa redundant.

Total: **9**

### 1. Semantic key: `أين`

Variant Arab:
- `مِنْ أَيْن`
- `أَيْنَ`

Lokasi:
- **Cerita** → `bertemu-jamaah/page1/vocab` — "Dari mana"
- **Cerita** → `bertemu-jamaah/endQuiz#1` — "Cara tanya "Dari mana?" dalam Arab..."
- **Lesson Umrah** → `arah-lokasi/vocab` — "Di mana"
- **Match** → `level3/q35/di mana (aina)` — "di mana (aina)"

### 2. Semantic key: `الإفطار`

Variant Arab:
- `الإِفْطَار`
- `مَتَى الإِفْطَار؟`

Lokasi:
- **Lesson Umrah** → `check-in-hotel/vocab` — "Sarapan"
- **Lesson Umrah** → `check-in-hotel/conv2/line0` — "Kapan sarapan?"
- **Lesson Umrah** → `restoran-makanan/vocab` — "Sarapan"

### 3. Semantic key: `الشروط`

Variant Arab:
- `مَا الشُّرُوط؟`
- `الشُّرُوط`

Lokasi:
- **Lesson Profesional** → `evaluasi-promosi/conv3/line2` — "Apa syaratnya?"
- **Lesson Profesional** → `negosiasi/vocab` — "Syarat"
- **Lesson Pelajar** → `administrasi-kampus/conv3/line2` — "Apa syaratnya?"

### 4. Semantic key: `يوم`

Variant Arab:
- `يَوْم`
- `كَمْ يَوْم؟`

Lokasi:
- **Tebak Gambar** → `cuaca-waktu/yawm` — "Hari"
- **Lesson Profesional** → `cuti-izin/conv0/line1` — "Berapa hari?"

### 5. Semantic key: `منشفة`

Variant Arab:
- `كَمْ مِنْشَفَة؟`
- `مِنْشَفَة`

Lokasi:
- **Lesson Umrah** → `check-in-hotel/conv3/line1` — "Berapa handuk?"
- **Ngomong** → `kata/kata-mandi/item1` — "handuk"

### 6. Semantic key: `الإمام`

Variant Arab:
- `الإِمَام`
- `مَنْ الإِمَام؟`

Lokasi:
- **Lesson Umrah** → `masjidil-haram/vocab` — "Imam"
- **Lesson Umrah** → `masjidil-haram/conv4/line2` — "Siapa imamnya?"

### 7. Semantic key: `كيلو`

Variant Arab:
- `كِيلُو`
- `كَمْ كِيلُو؟`

Lokasi:
- **Lesson Umrah** → `pasar-belanja/vocab` — "Kilo"
- **Challenge** → `pasar-madinah/L3/q4` — "Berapa kilo"

### 8. Semantic key: `الأولوية`

Variant Arab:
- `الأَوْلَوِيَّة`
- `مَا الأَوْلَوِيَّة؟`

Lokasi:
- **Lesson Profesional** → `jadwal-tugas/vocab` — "Prioritas"
- **Lesson Profesional** → `jadwal-tugas/conv0/line2` — "Prioritasnya yang mana?"

### 9. Semantic key: `موعد التسليم`

Variant Arab:
- `مَوْعِد التَّسْلِيم`
- `مَتَى مَوْعِد التَّسْلِيم؟`

Lokasi:
- **Lesson Pelajar** → `tugas-ujian/vocab` — "Deadline"
- **Lesson Pelajar** → `tugas-ujian/conv0/line2` — "Deadlinenya kapan?"


---

## 🎲 6. Distractor Reuse

Distractor (pilihan salah) dipakai ≥5×. Bikin pattern predictable.

| Distractor | Count | Top sources |
|---|---:|---|
| `بِ` | 31 | Nahwu, Tulis Arab, Match |
| `ن` | 22 | Tulis Arab, Match |
| `ل` | 19 | Tulis Arab, Match |
| `Jar` | 17 | Nahwu |
| `تُ` | 16 | Nahwu, Shorf, Tulis Arab, Match |
| `م` | 16 | Tulis Arab, Match |
| `Rofa'` | 14 | Nahwu |
| `Jazm` | 14 | Nahwu |
| `ي` | 14 | Tulis Arab, Match |
| `Fa'il` | 13 | Nahwu, Shorf |
| `ك` | 13 | Tulis Arab, Match |
| `Sama saja` | 12 | Nahwu, Shorf |
| `ر` | 12 | Tulis Arab, Match |
| `ث` | 11 | Tulis Arab, Match |
| `Maf'ul` | 10 | Nahwu, Shorf |
| `ش` | 10 | Tulis Arab, Match |
| `Mubtada'` | 9 | Nahwu |
| `Mashdar` | 8 | Nahwu, Shorf |
| `Tidak ada` | 8 | Nahwu, Challenge |
| `كَتَبَ` | 8 | Shorf, Tulis Arab, Match |
| `و` | 8 | Tulis Arab, Match |
| `د` | 8 | Tulis Arab, Match |
| `مَدْرَسَة` | 7 | Tebak Gambar, Match |
| `حَافِلَة` | 7 | Tebak Gambar |
| `Hal` | 7 | Nahwu |
| `فُعِلَ` | 7 | Nahwu, Shorf |
| `ع` | 7 | Tulis Arab, Match |
| `ز` | 7 | Tulis Arab, Match |
| `س` | 7 | Tulis Arab, Match |
| `جَلِسَ` | 7 | Tulis Arab |
| _(... 19 lebih)_ | | |

---

## 🎯 7. Position Bias (correct answer pattern)

Distribusi posisi jawaban benar per source. Kalau biased, user bisa "cheat by pattern".

### Cerita (115 kuis)

| Posisi (index) | Count | Ratio |
|---:|---:|---:|
| 0 | 7 | 6.1% |
| 1 | 81 | 70.4% |
| 2 | 24 | 20.9% |
| 3 | 3 | 2.6% |

### Perkenalan Diri (41 kuis)

| Posisi (index) | Count | Ratio |
|---:|---:|---:|
| 0 | 11 | 26.8% |
| 1 | 24 | 58.5% |
| 2 | 6 | 14.6% |

### Nahwu (120 kuis)

| Posisi (index) | Count | Ratio |
|---:|---:|---:|
| 0 | 5 | 4.2% |
| 1 | 75 | 62.5% |
| 2 | 38 | 31.7% |
| 3 | 2 | 1.7% |

### Shorf (96 kuis)

| Posisi (index) | Count | Ratio |
|---:|---:|---:|
| 0 | 5 | 5.2% |
| 1 | 61 | 63.5% |
| 2 | 28 | 29.2% |
| 3 | 2 | 2.1% |

### Challenge (80 kuis)

| Posisi (index) | Count | Ratio |
|---:|---:|---:|
| 0 | 21 | 26.3% |
| 1 | 50 | 62.5% |
| 2 | 9 | 11.3% |


---

## 🔣 8. Harakat Inconsistency

Item dengan harakat ratio rendah (<30%). User Indonesia butuh harakat lengkap untuk baca.

Total: **128** items

| Source | Lokasi | Arab | Ratio harakat |
|---|---|---|---:|
| Cerita | `tiba-di-madinah/endQuiz#0` | Bandara | 0% |
| Cerita | `tiba-di-madinah/endQuiz#2` | Tolong/Silakan | 0% |
| Cerita | `tiba-di-madinah/endQuiz#3` | Al-Munawwarah | 0% |
| Cerita | `belanja-kurma/endQuiz#0` | Berapa per kilo? | 0% |
| Cerita | `belanja-kurma/endQuiz#2` | Tamu | 0% |
| Cerita | `belanja-kurma/endQuiz#3` | Harga terakhir | 0% |
| Cerita | `belanja-kurma/endQuiz#4` | Ajwa | 0% |
| Cerita | `belanja-kurma/endQuiz#5` | Fresh/segar | 0% |
| Cerita | `sahabat-bilal/endQuiz#0` | Habsyah (Ethiopia) | 0% |
| Cerita | `sahabat-bilal/endQuiz#1` | Esa/Satu | 0% |
| Cerita | `sahabat-bilal/endQuiz#2` | Abu Bakr Ash-Shiddiq | 0% |
| Cerita | `sahabat-bilal/endQuiz#3` | Muadzin | 0% |
| Cerita | `sahabat-bilal/endQuiz#4` | Merdeka | 0% |
| Cerita | `sahabat-bilal/endQuiz#5` | Pembebasan Makkah | 0% |
| Cerita | `sahabat-bilal/endQuiz#6` | Ketakwaan | 0% |
| Cerita | `sarapan-hotel/endQuiz#0` | Sarapan | 0% |
| Cerita | `sarapan-hotel/endQuiz#2` | Roti | 0% |
| Cerita | `sarapan-hotel/endQuiz#4` | Zaitun | 0% |
| Cerita | `naik-bus-masjid/endQuiz#0` | Bus | 0% |
| Cerita | `naik-bus-masjid/endQuiz#1` | Ḥājja | 0% |
| Cerita | `naik-bus-masjid/endQuiz#2` | Al-qubba al-khaḍrā' | 0% |
| Cerita | `bertemu-jamaah/endQuiz#0` | Air berkah dari mata air Mekkah | 0% |
| Cerita | `bertemu-jamaah/endQuiz#3` | Anā min indūnīsiyā | 0% |
| Cerita | `tanya-waktu-sholat/endQuiz#0` | Sholat | 0% |
| Cerita | `tanya-waktu-sholat/endQuiz#1` | Kapan | 0% |
| Cerita | `tanya-waktu-sholat/endQuiz#2` | Setengah jam | 0% |
| Cerita | `order-kopi-saudi/endQuiz#0` | Mau apa | 0% |
| Cerita | `order-kopi-saudi/endQuiz#1` | Saya mau | 0% |
| Cerita | `order-kopi-saudi/endQuiz#2` | Teko kopi tradisional Saudi | 0% |
| Cerita | `order-kopi-saudi/endQuiz#3` | Kapulaga & saffron | 0% |
| Cerita | `order-kopi-saudi/endQuiz#4` | Ḥārra | 0% |
| Cerita | `cari-apotek/endQuiz#0` | Sakit | 0% |
| Cerita | `cari-apotek/endQuiz#1` | Apotek | 0% |
| Cerita | `cari-apotek/endQuiz#2` | Flu/Pilek | 0% |
| Cerita | `cari-apotek/endQuiz#3` | Obat | 0% |
| Cerita | `cari-apotek/endQuiz#4` | Daqā'iq mashy | 0% |
| Cerita | `taksi-mekkah/endQuiz#0` | Pergi | 0% |
| Cerita | `taksi-mekkah/endQuiz#1` | Seratus | 0% |
| Cerita | `taksi-mekkah/endQuiz#3` | Padang pasir | 0% |
| Cerita | `taksi-mekkah/endQuiz#4` | Ghālī | 0% |
| Cerita | `telepon-keluarga/endQuiz#0` | HP/Ponsel | 0% |
| Cerita | `telepon-keluarga/endQuiz#3` | Area khusus antara mimbar dan makam Nabi | 0% |
| Cerita | `pesan-hotel/endQuiz#0` | Hotel | 0% |
| Cerita | `pesan-hotel/endQuiz#1` | Kamar | 0% |
| Cerita | `pesan-hotel/endQuiz#4` | Saya reservasi | 0% |
| Cerita | `khadijah-ra/endQuiz#0` | Aṭ-Ṭāhira | 0% |
| Cerita | `khadijah-ra/endQuiz#1` | 40 tahun | 0% |
| Cerita | `khadijah-ra/endQuiz#2` | Beriman kepada Nabi | 0% |
| Cerita | `khadijah-ra/endQuiz#3` | Wafatnya Khadijah & Abu Thalib | 0% |
| Cerita | `khadijah-ra/endQuiz#4` | Amanah/Kejujuran | 0% |
| _(... 78 lebih)_ | | | |

---

## 🪦 9. Orphan Vocab (Tebak Gambar tanpa konteks)

Vocab di Tebak Gambar / Match yang tidak pernah muncul di Lesson / Cerita manapun. User belajar tanpa konteks.

Total: **204** orphan items

| Source | Arab | Indo |
|---|---|---|
| Tebak Gambar | `لَبَن` | Susu |
| Tebak Gambar | `تُفَّاح` | Apel |
| Tebak Gambar | `بُرْتُقَال` | Jeruk |
| Tebak Gambar | `مَوْز` | Pisang |
| Tebak Gambar | `عِنَب` | Anggur |
| Tebak Gambar | `بَيْض` | Telur |
| Tebak Gambar | `جُبْن` | Keju |
| Tebak Gambar | `عَسَل` | Madu |
| Tebak Gambar | `كَعْك` | Kue |
| Tebak Gambar | `سَلَطَة` | Salad |
| Tebak Gambar | `شُورْبَة` | Sup |
| Tebak Gambar | `طَعَام` | Makanan |
| Tebak Gambar | `مَسْجِد` | Masjid |
| Tebak Gambar | `سُوق` | Pasar |
| Tebak Gambar | `مَطْعَم` | Restoran |
| Tebak Gambar | `مُسْتَشْفَى` | Rumah Sakit |
| Tebak Gambar | `بَيْت` | Rumah |
| Tebak Gambar | `مَدْرَسَة` | Sekolah |
| Tebak Gambar | `الْمَدِينَة` | Kota Madinah |
| Tebak Gambar | `بَنْك` | Bank |
| Tebak Gambar | `نَافُورَة` | Air Mancur |
| Tebak Gambar | `حَدِيقَة` | Taman |
| Tebak Gambar | `شَارِع` | Jalan Raya |
| Tebak Gambar | `جِسْر` | Jembatan |
| Tebak Gambar | `بُرْج` | Menara |
| Tebak Gambar | `قَصْر` | Istana |
| Tebak Gambar | `مَلْعَب` | Stadion |
| Tebak Gambar | `مَكْتَب الْبَرِيد` | Kantor Pos |
| Tebak Gambar | `خَيْمَة` | Tenda |
| Tebak Gambar | `جَمَل` | Unta |
| _(... 174 lebih)_ | | |

---

## 🆎 10. Missing Latin Transliterasi

Item yang gak punya Latin. Bikin UX inconsistent (sebagian punya, sebagian gak).

Total: **142** items

| Source | Missing |
|---|---:|
| Cerita | 114 |
| Perkenalan Diri | 18 |
| Ngomong | 10 |

---

## 💡 Rekomendasi Aksi

1. **Fix intra-section dup dulu** — paling lazy, paling kentara.
2. **Resolve translation mismatch** — pilih 1 terjemahan canonical per vocab.
3. **Cek position bias** — kalau >70% jawaban di posisi B, randomize.
4. **Lengkapi harakat** — untuk item yang kurang.
5. **Tambah Latin** di item yang missing (kalau bukan exempt type).
6. **Embrace cross-section overlap** sebagai spaced repetition — gak perlu di-fix.
7. **Orphan vocab**: bikin lesson tambahan yang cover vocab Tebak Gambar yang belum diajar.