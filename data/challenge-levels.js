// data/challenge-levels.js
// ============================================================================
// CHALLENGE LEVELS — 4 lokasi Tanah Suci × 100 level masing-masing
// ============================================================================
// Status v1 (25 Mei 2026):
//   - Level 1-5 per lokasi: SEEDED dengan konten berkualitas (20 level total)
//   - Level 6-100: SCAFFOLDED sebagai placeholder "Coming Soon"
//   - Konten AI-drafted, butuh native speaker review sebelum production besar
//
// Tipe soal yang sudah di-support:
//   - 'mc'    : Multiple choice (pilih 1 dari 4)
//   - 'match' : Cocokkan vocab Arab ↔ Indonesia (drag/tap pairs)
//
// Tipe soal direncanakan (Phase 2):
//   - 'fill'  : Isi kata yang hilang dalam kalimat
//   - 'order' : Susun kata jadi kalimat (drag-order)
//   - 'audio' : Dengar audio TTS, pilih arti (Web Speech API ar-SA)
//
// XP scaling per level: 25 + level × 5 (level 1 = 30 XP, level 100 = 525 XP)
// ============================================================================

export function getXpForLevel(level) {
  return 25 + level * 5;
}

/**
 * Pick "Tantangan Hari Ini" berdasarkan tanggal — rotasi otomatis.
 * Day-of-year modulo jumlah scenarios.
 */
export function getTodayChallenge() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
  return CHALLENGE_SCENARIOS[dayOfYear % CHALLENGE_SCENARIOS.length];
}

/**
 * Build scaffold — DISABLED.
 * Sebelumnya generate placeholder "Coming Soon" Level 6-100, tapi itu bikin user
 * bingung. Sekarang return array kosong — cuma level yang udah seeded yang tampil.
 * Konten baru ditambah berkala via authoring real.
 */
function scaffoldComingSoonLevels(_startLevel, _endLevel = 100) {
  return [];
}

// ============================================================================
// 🕌 PASAR MADINAH — Level 1-5 (seeded)
// ============================================================================
const PASAR_MADINAH_LEVELS = [
  {
    level: 1,
    title: 'Salam & Tegur Sapa',
    description: 'Cara menyapa pedagang & pembeli',
    questions: [
      { type: 'mc', ar: 'السَّلَامُ عَلَيْكُمْ', latin: 'As-salamu \'alaikum', options: ['Selamat malam', 'Semoga keselamatan untukmu', 'Apa kabar', 'Sampai jumpa'], correct: 1 },
      { type: 'mc', ar: 'مَرْحَبًا', latin: 'Marhaban', options: ['Selamat datang/Halo', 'Selamat tinggal', 'Terima kasih', 'Maaf'], correct: 0 },
      { type: 'mc', ar: 'صَبَاحُ الْخَيْر', latin: 'Sabaahul khair', options: ['Selamat malam', 'Selamat pagi', 'Selamat sore', 'Selamat siang'], correct: 1 },
      { type: 'match', instruction: 'Cocokkan sapaan dengan artinya', pairs: [
        { ar: 'كَيْفَ حَالُك؟', latin: 'Kayfa haaluk?', id: 'Apa kabar?' },
        { ar: 'بِخَيْر', latin: 'Bikhair', id: 'Baik' },
        { ar: 'الْحَمْدُ لِلَّه', latin: 'Alhamdulillah', id: 'Segala puji bagi Allah' },
        { ar: 'تَشَرَّفْنَا', latin: 'Tasyarrafnaa', id: 'Senang berkenalan' },
      ]},
      { type: 'mc', ar: 'مَعَ السَّلَامَة', latin: 'Ma\'a as-salaamah', options: ['Selamat tinggal', 'Selamat datang', 'Halo', 'Sampai nanti'], correct: 0 },
    ],
  },
  {
    level: 2,
    title: 'Tanya Harga',
    description: 'Frasa belanja: tanya harga & nominal',
    questions: [
      { type: 'mc', ar: 'كَمِ السِّعْر؟', latin: 'Kam as-si\'r?', options: ['Apa namamu', 'Berapa harganya', 'Di mana hotel', 'Selamat datang'], correct: 1 },
      { type: 'mc', ar: 'هَذَا غَالِي', latin: 'Hadha ghaali', options: ['Ini murah', 'Ini bagus', 'Ini mahal', 'Ini lezat'], correct: 2 },
      { type: 'mc', ar: 'هَذَا رَخِيص', latin: 'Hadha rakhiis', options: ['Ini murah', 'Ini mahal', 'Ini segar', 'Ini busuk'], correct: 0 },
      { type: 'match', instruction: 'Cocokkan nominal Riyal', pairs: [
        { ar: 'عَشَرَة رِيَال', latin: '\'Asyrah riyal', id: '10 Riyal' },
        { ar: 'عِشْرُون رِيَال', latin: '\'Isyruun riyal', id: '20 Riyal' },
        { ar: 'خَمْسِيْن رِيَال', latin: 'Khamsiin riyal', id: '50 Riyal' },
        { ar: 'مِائَة رِيَال', latin: 'Mi\'ah riyal', id: '100 Riyal' },
      ]},
      { type: 'mc', ar: 'أَقَل مِنْ فَضْلِك', latin: 'Aqal min fadhlik', options: ['Lebih banyak', 'Lebih murah dong', 'Saya tidak mau', 'Habis'], correct: 1 },
    ],
  },
  {
    level: 3,
    title: 'Belanja Kurma & Oleh-oleh',
    description: 'Vocab pasar Madinah: kurma, kemenyan, sajadah',
    questions: [
      { type: 'mc', ar: 'تَمْر', latin: 'Tamr', options: ['Kurma', 'Apel', 'Madu', 'Susu'], correct: 0 },
      { type: 'mc', ar: 'أُرِيدُ كِيلُو وَاحِد', latin: 'Uriidu kiilu waahid', options: ['Saya ingin satu kilo', 'Saya ingin dua kilo', 'Saya ingin satu liter', 'Saya ingin gratis'], correct: 0 },
      { type: 'match', instruction: 'Cocokkan oleh-oleh khas', pairs: [
        { ar: 'سَجَّادَة', latin: 'Sajjaadah', id: 'Sajadah' },
        { ar: 'مِسْك', latin: 'Misk', id: 'Misik/Parfum' },
        { ar: 'عُود', latin: '\'Uud', id: 'Kemenyan/Buhur' },
        { ar: 'تَسْبِيح', latin: 'Tasbiih', id: 'Tasbih' },
      ]},
      { type: 'mc', ar: 'هَذِهِ الْكُرْمَا طَازَة', latin: 'Hadhihi al-kurmaa thaazah', options: ['Kurma ini busuk', 'Kurma ini kering', 'Kurma ini segar', 'Kurma ini manis'], correct: 2 },
      { type: 'mc', ar: 'كَمْ كِيلُو؟', latin: 'Kam kiilu?', options: ['Berapa kilo', 'Berapa liter', 'Berapa harga', 'Berapa banyak'], correct: 0 },
    ],
  },
  {
    level: 4,
    title: 'Tanya Arah ke Nabawi',
    description: 'Frasa untuk minta petunjuk lokasi',
    questions: [
      { type: 'mc', ar: 'أَيْنَ الْمَسْجِد النَّبَوِي؟', latin: 'Wayn al-Masjid an-Nabawi?', options: ['Apa itu Masjid Nabawi', 'Di mana Masjid Nabawi', 'Kapan ke Masjid Nabawi', 'Berapa jauh Masjid Nabawi'], correct: 1 },
      { type: 'mc', ar: 'قَرِيب', latin: 'Qariib', options: ['Jauh', 'Dekat', 'Sulit', 'Mudah'], correct: 1 },
      { type: 'mc', ar: 'بَعِيد', latin: 'Ba\'iid', options: ['Dekat', 'Jauh', 'Tertutup', 'Buka'], correct: 1 },
      { type: 'match', instruction: 'Cocokkan arah', pairs: [
        { ar: 'يَمِين', latin: 'Yamiin', id: 'Kanan' },
        { ar: 'يَسَار', latin: 'Yasaar', id: 'Kiri' },
        { ar: 'أَمَام', latin: 'Amaam', id: 'Depan' },
        { ar: 'وَرَاء', latin: 'Waraa\'', id: 'Belakang' },
      ]},
      { type: 'mc', ar: 'مُسْتَقِيم', latin: 'Mustaqiim', options: ['Putar balik', 'Belok', 'Lurus', 'Berhenti'], correct: 2 },
    ],
  },
  {
    level: 5,
    title: 'Bayar & Terima Kasih',
    description: 'Closing transaksi yang sopan',
    questions: [
      { type: 'mc', ar: 'كَاش أَوْ بِطَاقَة؟', latin: 'Kaash aw bithaaqah?', options: ['Cash atau debit', 'Cash atau kartu', 'Kecil atau besar', 'Sekarang atau nanti'], correct: 1 },
      { type: 'mc', ar: 'بَاقِي', latin: 'Baaqi', options: ['Habis', 'Kembalian', 'Tutup', 'Pesanan'], correct: 1 },
      { type: 'mc', ar: 'شُكْرًا جَزِيلًا', latin: 'Syukran jaziilan', options: ['Maaf banget', 'Terima kasih banyak', 'Selamat jalan', 'Sampai jumpa'], correct: 1 },
      { type: 'match', instruction: 'Cocokkan ucapan penutup', pairs: [
        { ar: 'الْعَفْو', latin: 'Al-\'afw', id: 'Sama-sama' },
        { ar: 'بَارَكَ اللهُ فِيك', latin: 'Baarakallahu fiik', id: 'Semoga Allah berkahi' },
        { ar: 'فِي أَمَانِ اللَّه', latin: 'Fii amaanillaah', id: 'Dalam penjagaan Allah' },
        { ar: 'إِلَى اللِّقَاء', latin: 'Ila al-liqaa\'', id: 'Sampai jumpa' },
      ]},
      { type: 'mc', ar: 'إِيصَال مِنْ فَضْلِك', latin: 'Iishaal min fadhlik', options: ['Diskon tolong', 'Bonus tolong', 'Struk tolong', 'Ulang tolong'], correct: 2 },
    ],
  },
  ...scaffoldComingSoonLevels(6, 100),
];

// ============================================================================
// 🕋 PASAR KAKKIYAH — Level 1-5 (seeded)
// ============================================================================
const PASAR_KAKKIYAH_LEVELS = [
  {
    level: 1,
    title: 'Ihram & Pakaian',
    description: 'Vocab pakaian ihram untuk umrah',
    questions: [
      { type: 'mc', ar: 'إِحْرَام', latin: 'Ihraam', options: ['Pakaian biasa', 'Pakaian ihram', 'Sajadah', 'Selimut'], correct: 1 },
      { type: 'mc', ar: 'أُرِيدُ إِحْرَام أَبْيَض', latin: 'Uriidu ihraam abyadh', options: ['Saya ingin ihram putih', 'Saya ingin ihram hitam', 'Saya ingin sajadah', 'Saya ingin tas'], correct: 0 },
      { type: 'match', instruction: 'Cocokkan ukuran/warna', pairs: [
        { ar: 'صَغِير', latin: 'Sagheer', id: 'Kecil (S)' },
        { ar: 'وَسَط', latin: 'Wasath', id: 'Sedang (M)' },
        { ar: 'كَبِير', latin: 'Kabiir', id: 'Besar (L)' },
        { ar: 'كَبِير جِدًّا', latin: 'Kabiir jiddan', id: 'Sangat besar (XL)' },
      ]},
      { type: 'mc', ar: 'مَا مَقَاسِي؟', latin: 'Maa maqaasi?', options: ['Apa warnaku', 'Apa ukuranku', 'Berapa harganya', 'Di mana saya'], correct: 1 },
      { type: 'mc', ar: 'مُمْكِن أَجَرِّبُهُ؟', latin: 'Mumkin ajarribuhu?', options: ['Boleh dibeli', 'Boleh dicoba', 'Boleh dibawa', 'Boleh ditukar'], correct: 1 },
    ],
  },
  {
    level: 2,
    title: 'Bahan & Kualitas',
    description: 'Tanya bahan kain, kualitas, asal',
    questions: [
      { type: 'mc', ar: 'قُطْن', latin: 'Qutn', options: ['Sutra', 'Wol', 'Kapas', 'Polyester'], correct: 2 },
      { type: 'mc', ar: 'هَلْ هَذَا قُطْن أَصْلِي؟', latin: 'Hal hadha qutn ashli?', options: ['Apakah ini kapas asli', 'Apakah ini sutra asli', 'Apakah ini baru', 'Apakah ini bersih'], correct: 0 },
      { type: 'match', instruction: 'Cocokkan bahan', pairs: [
        { ar: 'حَرِير', latin: 'Hariir', id: 'Sutra' },
        { ar: 'صُوف', latin: 'Suuf', id: 'Wol' },
        { ar: 'بُولِيِسْتَر', latin: 'Buulistar', id: 'Polyester' },
        { ar: 'كَتَّان', latin: 'Kattaan', id: 'Linen' },
      ]},
      { type: 'mc', ar: 'صُنْعِ بَلَدِي', latin: 'Sun\'ii baladi', options: ['Buatan lokal', 'Buatan luar negeri', 'Buatan tangan', 'Buatan pabrik'], correct: 0 },
      { type: 'mc', ar: 'جَوْدَة عَالِيَة', latin: 'Jaudah \'aaliyah', options: ['Kualitas rendah', 'Kualitas tinggi', 'Harga rendah', 'Harga tinggi'], correct: 1 },
    ],
  },
  {
    level: 3,
    title: 'Diskon & Tawar-Menawar',
    description: 'Negosiasi harga & minta diskon jamaah',
    questions: [
      { type: 'mc', ar: 'خَصْم', latin: 'Khasm', options: ['Tambah', 'Diskon/Potongan', 'Pajak', 'Hadiah'], correct: 1 },
      { type: 'mc', ar: 'عِنْدَكُمْ خَصْم لِلْحُجَّاج؟', latin: '\'Indakum khasm lil-hujjaaj?', options: ['Ada diskon untuk anak', 'Ada diskon untuk jamaah', 'Ada hadiah', 'Ada paket'], correct: 1 },
      { type: 'mc', ar: 'مُمْكِن أَقَل؟', latin: 'Mumkin aqal?', options: ['Bisa lebih banyak', 'Bisa lebih murah', 'Bisa diganti', 'Bisa dikembalikan'], correct: 1 },
      { type: 'match', instruction: 'Cocokkan istilah bisnis', pairs: [
        { ar: 'سِعْر نِهَائِي', latin: 'Si\'r nihaa\'i', id: 'Harga net/final' },
        { ar: 'جُمْلَة', latin: 'Jumlah', id: 'Grosir' },
        { ar: 'مُفْرَد', latin: 'Mufrad', id: 'Eceran' },
        { ar: 'هَدِيَّة', latin: 'Hadiyyah', id: 'Hadiah/Bonus' },
      ]},
      { type: 'mc', ar: 'أَكْثَر مِنْ وَاحِد', latin: 'Aktsar min waahid', options: ['Hanya satu', 'Lebih dari satu', 'Tidak ada', 'Habis'], correct: 1 },
    ],
  },
  {
    level: 4,
    title: 'Souvenir Khas Mekkah',
    description: 'Oleh-oleh khusus dari Tanah Suci',
    questions: [
      { type: 'mc', ar: 'تَسْبِيح', latin: 'Tasbiih', options: ['Sajadah', 'Tasbih', 'Mukena', 'Kopiah'], correct: 1 },
      { type: 'mc', ar: 'سَجَّادَة صَلَاة', latin: 'Sajjaadah shalaah', options: ['Mukena sholat', 'Sajadah sholat', 'Tasbih sholat', 'Sarung sholat'], correct: 1 },
      { type: 'match', instruction: 'Cocokkan oleh-oleh Mekkah', pairs: [
        { ar: 'عِطْر', latin: '\'Ithr', id: 'Parfum' },
        { ar: 'مِسْك', latin: 'Misk', id: 'Minyak misik' },
        { ar: 'زَعْفَرَان', latin: 'Za\'faraan', id: 'Saffron/Kunyit' },
        { ar: 'مُصْحَف', latin: 'Mushaf', id: 'Al-Quran' },
      ]},
      { type: 'mc', ar: 'لِأُمِّي', latin: 'Li-ummi', options: ['Untuk ayahku', 'Untuk ibuku', 'Untuk anakku', 'Untuk istriku'], correct: 1 },
      { type: 'mc', ar: 'هَدِيَّة لِلْعَائِلَة', latin: 'Hadiyyah lil-\'aa\'ilah', options: ['Hadiah untuk keluarga', 'Hadiah untuk teman', 'Hadiah untuk guru', 'Hadiah untuk anak'], correct: 0 },
    ],
  },
  {
    level: 5,
    title: 'Pengiriman & Pembayaran',
    description: 'Bayar, kirim ke hotel, atau bawa pulang',
    questions: [
      { type: 'mc', ar: 'تَوْصِيل لِلْفُنْدُق', latin: 'Tawshiil lil-funduq', options: ['Antar ke bandara', 'Antar ke hotel', 'Antar ke masjid', 'Antar ke pasar'], correct: 1 },
      { type: 'mc', ar: 'مَتَى يَصِل؟', latin: 'Mataa yashil?', options: ['Berapa lama', 'Kapan sampai', 'Berapa harga', 'Siapa yang antar'], correct: 1 },
      { type: 'match', instruction: 'Cocokkan metode bayar', pairs: [
        { ar: 'نَقْد', latin: 'Naqd', id: 'Tunai' },
        { ar: 'بِطَاقَة', latin: 'Bithaaqah', id: 'Kartu' },
        { ar: 'تَحْوِيل', latin: 'Tahwiil', id: 'Transfer' },
        { ar: 'تَقْسِيط', latin: 'Taqsiith', id: 'Cicilan' },
      ]},
      { type: 'mc', ar: 'هَلْ يَقْبَلُ بِطَاقَة فِيزَا؟', latin: 'Hal yaqbal bithaaqah Visa?', options: ['Apakah menerima Visa', 'Apakah menerima cash', 'Apakah menerima dollar', 'Apakah menerima cek'], correct: 0 },
      { type: 'mc', ar: 'إِيصَال', latin: 'Iishaal', options: ['Barang', 'Struk/Resi', 'Cek', 'Faktur'], correct: 1 },
    ],
  },
  ...scaffoldComingSoonLevels(6, 100),
];

// ============================================================================
// 🏗️ TOWER ZAM-ZAM — Level 1-5 (seeded)
// ============================================================================
const TOWER_ZAMZAM_LEVELS = [
  {
    level: 1,
    title: 'Order Menu',
    description: 'Cara minta menu & pesan makanan',
    questions: [
      { type: 'mc', ar: 'اَلْقَائِمَة لَوْ سَمَحْت', latin: 'Al-qaa\'imah law samaht', options: ['Air mineral tolong', 'Menu tolong', 'Tagihan tolong', 'Tisu tolong'], correct: 1 },
      { type: 'mc', ar: 'أُرِيدُ أَنْ أَطْلُب', latin: 'Uriidu an athlub', options: ['Saya ingin pulang', 'Saya ingin pesan', 'Saya ingin bayar', 'Saya ingin pergi'], correct: 1 },
      { type: 'match', instruction: 'Cocokkan jenis hidangan', pairs: [
        { ar: 'إِفْطَار', latin: 'Ifthaar', id: 'Sarapan' },
        { ar: 'غَدَاء', latin: 'Ghadaa\'', id: 'Makan siang' },
        { ar: 'عَشَاء', latin: '\'Ashaa\'', id: 'Makan malam' },
        { ar: 'وَجْبَة خَفِيفَة', latin: 'Wajbah khafiifah', id: 'Snack ringan' },
      ]},
      { type: 'mc', ar: 'مَا الْأَطْيَب؟', latin: 'Maa al-athyab?', options: ['Yang termurah apa', 'Yang paling enak apa', 'Yang termahal apa', 'Yang terbaru apa'], correct: 1 },
      { type: 'mc', ar: 'وَجْبَة عَائِلِيَّة', latin: 'Wajbah \'aa\'iliyyah', options: ['Porsi anak', 'Porsi keluarga', 'Porsi tunggal', 'Porsi besar'], correct: 1 },
    ],
  },
  {
    level: 2,
    title: 'Halal & Bahan',
    description: 'Pastikan makanan halal & cek bahan',
    questions: [
      { type: 'mc', ar: 'هَلْ هَذَا حَلَال؟', latin: 'Hal hadha halaal?', options: ['Apakah ini lezat', 'Apakah ini pedas', 'Apakah ini halal', 'Apakah ini panas'], correct: 2 },
      { type: 'mc', ar: 'هَلْ يَحْتَوِي عَلَى لَحْم خِنْزِيْر؟', latin: 'Hal yahtawii \'ala lahm khinziir?', options: ['Apakah pakai ayam', 'Apakah pakai daging babi', 'Apakah pakai sapi', 'Apakah pakai ikan'], correct: 1 },
      { type: 'match', instruction: 'Cocokkan jenis daging', pairs: [
        { ar: 'دَجَاج', latin: 'Dajaaj', id: 'Ayam' },
        { ar: 'لَحْم بَقَر', latin: 'Lahm baqar', id: 'Daging sapi' },
        { ar: 'لَحْم خَرُوف', latin: 'Lahm kharuuf', id: 'Daging kambing' },
        { ar: 'سَمَك', latin: 'Samak', id: 'Ikan' },
      ]},
      { type: 'mc', ar: 'بِدُونِ بَصَل', latin: 'Bidoon basal', options: ['Tanpa garam', 'Tanpa gula', 'Tanpa bawang', 'Tanpa pedas'], correct: 2 },
      { type: 'mc', ar: 'حَارّ جِدًّا', latin: 'Haarr jiddan', options: ['Sangat pedas', 'Sangat panas', 'Sangat enak', 'Sangat banyak'], correct: 0 },
    ],
  },
  {
    level: 3,
    title: 'Minuman',
    description: 'Order minuman: kopi, teh, jus, zam-zam',
    questions: [
      { type: 'mc', ar: 'مَاء زَمْزَم', latin: 'Maa\' zamzam', options: ['Air mineral', 'Air zam-zam', 'Air dingin', 'Air panas'], correct: 1 },
      { type: 'mc', ar: 'قَهْوَة عَرَبِيَّة', latin: 'Qahwah \'arabiyyah', options: ['Teh Arab', 'Kopi Arab', 'Susu Arab', 'Jus Arab'], correct: 1 },
      { type: 'match', instruction: 'Cocokkan minuman', pairs: [
        { ar: 'شَاي', latin: 'Syaay', id: 'Teh' },
        { ar: 'قَهْوَة', latin: 'Qahwah', id: 'Kopi' },
        { ar: 'حَلِيب', latin: 'Haliib', id: 'Susu' },
        { ar: 'عَصِير', latin: '\'Ashiir', id: 'Jus' },
      ]},
      { type: 'mc', ar: 'بَارِد', latin: 'Baarid', options: ['Hangat', 'Dingin', 'Panas', 'Hambar'], correct: 1 },
      { type: 'mc', ar: 'سَاخِن', latin: 'Saakhin', options: ['Dingin', 'Panas', 'Manis', 'Pahit'], correct: 1 },
    ],
  },
  {
    level: 4,
    title: 'Special Request',
    description: 'Permintaan khusus & alergi',
    questions: [
      { type: 'mc', ar: 'بِدُونِ سُكَّر', latin: 'Bidoon sukkar', options: ['Tanpa gula', 'Tanpa susu', 'Tanpa es', 'Tanpa garam'], correct: 0 },
      { type: 'mc', ar: 'عِنْدِي حَسَاسِيَّة', latin: '\'Indi hasaasiyyah', options: ['Saya tidak suka', 'Saya alergi', 'Saya lapar', 'Saya kenyang'], correct: 1 },
      { type: 'match', instruction: 'Cocokkan permintaan', pairs: [
        { ar: 'قَلِيل الْمِلْح', latin: 'Qaliil al-milh', id: 'Sedikit garam' },
        { ar: 'بِدُونِ زَيْت', latin: 'Bidoon zait', id: 'Tanpa minyak' },
        { ar: 'حَارّ قَلِيل', latin: 'Haarr qaliil', id: 'Sedikit pedas' },
        { ar: 'ثَلْج زَائِد', latin: 'Tsalj zaa\'id', id: 'Es tambahan' },
      ]},
      { type: 'mc', ar: 'لِلتَّوْصِيل', latin: 'Lit-tawshiil', options: ['Untuk dimakan di sini', 'Untuk dibawa pulang', 'Untuk diantar', 'Untuk takeaway'], correct: 2 },
      { type: 'mc', ar: 'سَفَرِي', latin: 'Safari', options: ['Makan di sini', 'Take away', 'Antar pulang', 'Cicipi'], correct: 1 },
    ],
  },
  {
    level: 5,
    title: 'Bayar Tagihan',
    description: 'Minta bill, bayar, tip',
    questions: [
      { type: 'mc', ar: 'اَلْحِسَاب مِنْ فَضْلِك', latin: 'Al-hisaab min fadhlik', options: ['Sendok tolong', 'Tagihan tolong', 'Garpu tolong', 'Piring tolong'], correct: 1 },
      { type: 'mc', ar: 'الْفَاتُورَة', latin: 'Al-faatuurah', options: ['Menu', 'Tagihan/Struk', 'Garpu', 'Bumbu'], correct: 1 },
      { type: 'match', instruction: 'Cocokkan istilah pembayaran', pairs: [
        { ar: 'بَقْشِيش', latin: 'Baqsyiisy', id: 'Tip' },
        { ar: 'ضَرِيبَة', latin: 'Dhariibah', id: 'Pajak' },
        { ar: 'مَجْمُوع', latin: 'Majmuu\'', id: 'Total' },
        { ar: 'صَافِي', latin: 'Saafi', id: 'Bersih (net)' },
      ]},
      { type: 'mc', ar: 'كَانَ لَذِيذًا', latin: 'Kaana ladziidzan', options: ['Sudah cukup', 'Sudah enak', 'Sudah pedas', 'Sudah dingin'], correct: 1 },
      { type: 'mc', ar: 'سَنَعُود مَرَّة أُخْرَى', latin: 'Sa-na\'uud marrah ukhraa', options: ['Kami akan kembali lagi', 'Kami sudah selesai', 'Kami akan pergi', 'Kami akan bayar'], correct: 0 },
    ],
  },
  ...scaffoldComingSoonLevels(6, 100),
];

// ============================================================================
// ⛰️ GUNUNG UHUD — Level 1-5 (seeded)
// ============================================================================
const GUNUNG_UHUD_LEVELS = [
  {
    level: 1,
    title: 'Ziarah Pertama',
    description: 'Sapaan & pertanyaan dasar di lokasi ziarah',
    questions: [
      { type: 'mc', ar: 'جَبَل أُحُد', latin: 'Jabal Uhud', options: ['Gunung Sinai', 'Gunung Uhud', 'Gunung Tursina', 'Gunung Arafah'], correct: 1 },
      { type: 'mc', ar: 'مَقْبَرَة الشُّهَدَاء', latin: 'Maqbaratu sy-syuhadaa\'', options: ['Makam Nabi', 'Makam para syuhada', 'Makam Sahabat', 'Pemakaman umum'], correct: 1 },
      { type: 'match', instruction: 'Cocokkan tokoh sejarah', pairs: [
        { ar: 'حَمْزَة', latin: 'Hamzah', id: 'Hamzah bin Abdul Muthalib' },
        { ar: 'مُصْعَب بْنُ عُمَيْر', latin: 'Mush\'ab bin \'Umair', id: 'Mush\'ab bin Umair' },
        { ar: 'أَنَس بْنُ النَّضْر', latin: 'Anas bin an-Nadhr', id: 'Anas bin Nadhr' },
        { ar: 'عَبْدُ اللَّه بْنُ جَحْش', latin: '\'Abdullah bin Jahsy', id: 'Abdullah bin Jahsy' },
      ]},
      { type: 'mc', ar: 'مَكَان مُقَدَّس', latin: 'Makaan muqaddas', options: ['Tempat indah', 'Tempat suci', 'Tempat ramai', 'Tempat tinggi'], correct: 1 },
      { type: 'mc', ar: 'مَعْرَكَة', latin: 'Ma\'rakah', options: ['Perang', 'Damai', 'Hijrah', 'Wukuf'], correct: 0 },
    ],
  },
  {
    level: 2,
    title: 'Tanya Lokasi',
    description: 'Lokasi penting di kompleks Uhud',
    questions: [
      { type: 'mc', ar: 'أَيْنَ قَبْرُ حَمْزَة؟', latin: 'Wayn qabr Hamzah?', options: ['Di mana masjid', 'Di mana makam Hamzah', 'Di mana lokasi perang', 'Di mana sumber air'], correct: 1 },
      { type: 'mc', ar: 'جَبَل الرُّمَاة', latin: 'Jabal ar-Rumaah', options: ['Gunung Penjaga', 'Gunung Pemanah', 'Gunung Tertinggi', 'Gunung Saksi'], correct: 1 },
      { type: 'match', instruction: 'Cocokkan tempat ziarah', pairs: [
        { ar: 'مَسْجِد', latin: 'Masjid', id: 'Masjid' },
        { ar: 'قَبْر', latin: 'Qabr', id: 'Makam' },
        { ar: 'جَبَل', latin: 'Jabal', id: 'Gunung' },
        { ar: 'مَيْدَان', latin: 'Maidaan', id: 'Lapangan' },
      ]},
      { type: 'mc', ar: 'كَيْف أَصِل؟', latin: 'Kayfa ashil?', options: ['Berapa harga', 'Bagaimana sampai', 'Berapa jauh', 'Kapan buka'], correct: 1 },
      { type: 'mc', ar: 'مَتَى يُغْلَق؟', latin: 'Mataa yughlaq?', options: ['Kapan buka', 'Kapan tutup', 'Berapa lama', 'Siapa yang jaga'], correct: 1 },
    ],
  },
  {
    level: 3,
    title: 'Pedagang Air & Souvenir',
    description: 'Beli air mineral & oleh-oleh batu Uhud',
    questions: [
      { type: 'mc', ar: 'مَاء بَارِد لَوْ سَمَحْت', latin: 'Maa\' baarid law samaht', options: ['Air panas tolong', 'Air mineral tolong', 'Air dingin tolong', 'Air hangat tolong'], correct: 2 },
      { type: 'mc', ar: 'كَمْ ثَمَنُ الْمَاء؟', latin: 'Kam thaman al-maa\'?', options: ['Berapa harga air', 'Berapa banyak air', 'Air dari mana', 'Air sampai jam berapa'], correct: 0 },
      { type: 'match', instruction: 'Cocokkan oleh-oleh Uhud', pairs: [
        { ar: 'تُرَاب أُحُد', latin: 'Turaab Uhud', id: 'Tanah/Pasir Uhud' },
        { ar: 'حَجَر صَغِير', latin: 'Hajar sagheer', id: 'Batu kecil' },
        { ar: 'كِتَاب التَّارِيخ', latin: 'Kitaab at-taariikh', id: 'Buku sejarah' },
        { ar: 'لَوْحَة', latin: 'Lawhah', id: 'Lukisan/Papan' },
      ]},
      { type: 'mc', ar: 'هَل هَذَا حَلَال؟', latin: 'Hal hadha halaal?', options: ['Apakah ini halal (boleh dibawa)', 'Apakah ini enak', 'Apakah ini baru', 'Apakah ini murah'], correct: 0 },
      { type: 'mc', ar: 'تَذْكَار', latin: 'Tadzkaar', options: ['Toko', 'Kenang-kenangan', 'Catatan', 'Hadiah'], correct: 1 },
    ],
  },
  {
    level: 4,
    title: 'Doa & Adab Ziarah',
    description: 'Ungkapan doa & adab di tempat sejarah',
    questions: [
      { type: 'mc', ar: 'بَارَكَ اللهُ فِي زِيَارَتِنَا', latin: 'Baarakallahu fii ziyaaratina', options: ['Semoga sukses perjalanan', 'Semoga berkah ziarah kita', 'Semoga sehat selalu', 'Semoga lulus ujian'], correct: 1 },
      { type: 'mc', ar: 'رَحِمَهُمُ اللَّه', latin: 'Rahimahumullaah', options: ['Semoga Allah merahmati mereka', 'Semoga sukses', 'Semoga selamat', 'Semoga sehat'], correct: 0 },
      { type: 'match', instruction: 'Cocokkan doa ziarah', pairs: [
        { ar: 'اَلسَّلَامُ عَلَيْكُمْ يَا أَهْلَ الْقُبُور', latin: 'As-salaamu \'alaikum yaa ahlal-qubuur', id: 'Salam ahli kubur' },
        { ar: 'اَللَّهُمَّ اغْفِرْ لَهُمْ', latin: 'Allaahummaghfir lahum', id: 'Ya Allah ampuni mereka' },
        { ar: 'اَللَّهُمَّ ارْحَمْهُمْ', latin: 'Allaahummarhamhum', id: 'Ya Allah rahmati mereka' },
        { ar: 'إِنَّا لِلَّهِ', latin: 'Innaa lillaahi', id: 'Sesungguhnya milik Allah' },
      ]},
      { type: 'mc', ar: 'صَمْت', latin: 'Shamt', options: ['Berisik', 'Diam/Hening', 'Tertawa', 'Bicara'], correct: 1 },
      { type: 'mc', ar: 'اِحْتِرَام', latin: 'Ihtiraam', options: ['Hormat', 'Marah', 'Sedih', 'Bahagia'], correct: 0 },
    ],
  },
  {
    level: 5,
    title: 'Foto & Dokumentasi',
    description: 'Minta izin foto, foto bareng, dokumentasi',
    questions: [
      { type: 'mc', ar: 'هَلْ يَجُوزُ التَّصْوِير هُنَا؟', latin: 'Hal yajuuz at-tashwiir huna?', options: ['Boleh foto di sini', 'Boleh duduk di sini', 'Boleh masuk di sini', 'Boleh berdoa di sini'], correct: 0 },
      { type: 'mc', ar: 'مُمْكِن صُورَة مَعَك؟', latin: 'Mumkin shuurah ma\'ak?', options: ['Boleh foto sendiri', 'Boleh foto bersamamu', 'Boleh tanda tangan', 'Boleh berjabat tangan'], correct: 1 },
      { type: 'match', instruction: 'Cocokkan istilah foto', pairs: [
        { ar: 'كَامِيرَا', latin: 'Kaamiiraa', id: 'Kamera' },
        { ar: 'فِيدْيُو', latin: 'Fiidyoo', id: 'Video' },
        { ar: 'سِيلْفِي', latin: 'Siilfii', id: 'Selfie' },
        { ar: 'صُورَة جَمَاعِيَّة', latin: 'Shuurah jamaa\'iyyah', id: 'Foto bareng' },
      ]},
      { type: 'mc', ar: 'مَمْنُوع التَّصْوِير', latin: 'Mamnuu\' at-tashwiir', options: ['Boleh foto', 'Dilarang foto', 'Boleh masuk', 'Dilarang masuk'], correct: 1 },
      { type: 'mc', ar: 'شُكْرًا، رَحْلَة جَمِيلَة', latin: 'Syukran, rihlah jamiilah', options: ['Terima kasih, perjalanan indah', 'Maaf, sampai jumpa', 'Selamat datang lagi', 'Hati-hati di jalan'], correct: 0 },
    ],
  },
  ...scaffoldComingSoonLevels(6, 100),
];

// ============================================================================
// EXPORT — semua 4 scenarios dengan level structure
// ============================================================================
export const CHALLENGE_SCENARIOS = [
  {
    id: 'pasar-madinah',
    name: 'Pasar Madinah',
    arName: 'سوق المدينة',
    emoji: '🕌',
    location: 'Pasar tradisional sekitar Masjid Nabawi',
    desc: 'Belanja kurma, kemenyan, & oleh-oleh',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    levels: PASAR_MADINAH_LEVELS,
  },
  {
    id: 'pasar-kakkiyah',
    name: 'Pasar Kakkiyah',
    arName: 'سوق الكعكية',
    emoji: '🕋',
    location: 'Pasar dekat Masjidil Haram — ihram, oleh-oleh, parfum',
    desc: 'Pakaian ihram & oleh-oleh Mekkah',
    color: '#7a3d2a',
    bgGradient: 'linear-gradient(135deg, #7a3d2a, #a05536)',
    levels: PASAR_KAKKIYAH_LEVELS,
  },
  {
    id: 'tower-zamzam',
    name: 'Tower Zam-Zam',
    arName: 'برج الزمزم',
    emoji: '🗼',
    location: 'Komplek Abraj Al-Bait — restoran, kafe, oleh-oleh premium',
    desc: 'Order makanan & minuman halal',
    color: '#8b6b3d',
    bgGradient: 'linear-gradient(135deg, #8b6b3d, #c9a961)',
    levels: TOWER_ZAMZAM_LEVELS,
  },
  {
    id: 'gunung-uhud',
    name: 'Gunung Uhud',
    arName: 'جبل أحد',
    emoji: '⛰️',
    location: 'Bukit ziarah Perang Uhud — pedagang air & souvenir',
    desc: 'Ziarah sejarah & beli oleh-oleh kerikil',
    color: '#5a3220',
    bgGradient: 'linear-gradient(135deg, #5a3220, #8b4a30)',
    levels: GUNUNG_UHUD_LEVELS,
  },
];
