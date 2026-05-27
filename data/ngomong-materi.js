// data/ngomong-materi.js
// Game #6 "Belajar Ngomong" — tangga produksi: Kata → Susun Kalimat → Susun Cerita.
// FASE 1 (sekarang): Level "Kata" terisi penuh — barang sehari-hari, bahasa baku (fusha).
// Level "kalimat" & "cerita" rangkanya udah disiapin, kontennya nyusul.
//
// Model gratis/bayar:
//   - Tiap materi: 3 soal pertama GRATIS (dicoba dulu).
//   - "Sesi lanjutan" (sisa soal yang lebih seru) buka dengan 5 koin per materi.

export const NGOMONG_FREE_ITEMS = 3; // jumlah soal gratis per materi
export const NGOMONG_SESSION_COST = 5; // koin untuk buka sesi lanjutan

// Tangga 3 level. Yang "comingSoon" belum aktif (rangka untuk fase berikutnya).
export const NGOMONG_LEVELS = [
  { id: 'kata', label: 'Kata', emoji: '🔤', desc: 'Ucapkan nama barang sehari-hari' },
  { id: 'kalimat', label: 'Susun Kalimat', emoji: '📝', desc: 'Rangkai kata jadi kalimat utuh' },
  { id: 'cerita', label: 'Susun Cerita', emoji: '📖', desc: 'Ceritakan kegiatan harianmu' },
];

// LEVEL 1 — KATA. Tiap materi punya items: { ar (berharakat), latin, id, emoji }.
// ar dipakai buat TTS + target pengucapan; pencocokan suara mengabaikan harakat.
export const NGOMONG_MATERI = [
  {
    id: 'kata-dapur',
    level: 'kata',
    title: 'Barang di Dapur',
    emoji: '🍽️',
    desc: 'Peralatan makan & masak',
    items: [
      { ar: 'صَحْن', latin: 'sahn', id: 'piring', emoji: '🍽️' },
      { ar: 'كُوب', latin: 'kuub', id: 'gelas', emoji: '🥤' },
      { ar: 'مِلْعَقَة', latin: "mil'aqah", id: 'sendok', emoji: '🥄' },
      { ar: 'شَوْكَة', latin: 'syaukah', id: 'garpu', emoji: '🍴' },
      { ar: 'سِكِّين', latin: 'sikkiin', id: 'pisau', emoji: '🔪' },
      { ar: 'قِدْر', latin: 'qidr', id: 'panci', emoji: '🍲' },
    ],
  },
  {
    id: 'kata-tas',
    level: 'kata',
    title: 'Isi Tas Perjalanan',
    emoji: '🎒',
    desc: 'Barang penting saat bepergian & umrah',
    items: [
      { ar: 'حَقِيبَة', latin: 'haqiibah', id: 'tas', emoji: '🎒' },
      { ar: 'جَوَاز', latin: 'jawaaz', id: 'paspor', emoji: '🛂' },
      { ar: 'مِفْتَاح', latin: 'miftaah', id: 'kunci', emoji: '🔑' },
      { ar: 'هَاتِف', latin: 'haatif', id: 'telepon', emoji: '📱' },
      { ar: 'نُقُود', latin: 'nuquud', id: 'uang', emoji: '💵' },
      { ar: 'نَظَّارَة', latin: 'nazhzhaarah', id: 'kacamata', emoji: '👓' },
    ],
  },
  {
    id: 'kata-kamar',
    level: 'kata',
    title: 'Barang di Kamar',
    emoji: '🛏️',
    desc: 'Perabot kamar tidur',
    items: [
      { ar: 'سَرِير', latin: 'sariir', id: 'tempat tidur', emoji: '🛏️' },
      { ar: 'مِخَدَّة', latin: 'mikhaddah', id: 'bantal', emoji: '🛌' },
      { ar: 'سَاعَة', latin: "saa'ah", id: 'jam', emoji: '⏰' },
      { ar: 'مِصْبَاح', latin: 'mishbaah', id: 'lampu', emoji: '💡' },
      { ar: 'خِزَانَة', latin: 'khizaanah', id: 'lemari', emoji: '🗄️' },
      { ar: 'مِرْآة', latin: "mir'aah", id: 'cermin', emoji: '🪞' },
    ],
  },
  {
    id: 'kata-belajar',
    level: 'kata',
    title: 'Alat Tulis & Belajar',
    emoji: '✏️',
    desc: 'Perlengkapan sekolah & kuliah',
    items: [
      { ar: 'قَلَم', latin: 'qalam', id: 'pena', emoji: '🖊️' },
      { ar: 'كِتَاب', latin: 'kitaab', id: 'buku', emoji: '📖' },
      { ar: 'دَفْتَر', latin: 'daftar', id: 'buku tulis', emoji: '📓' },
      { ar: 'مِسْطَرَة', latin: 'mistharah', id: 'penggaris', emoji: '📏' },
      { ar: 'مِقَصّ', latin: 'miqass', id: 'gunting', emoji: '✂️' },
      { ar: 'مِمْحَاة', latin: 'mimhaah', id: 'penghapus', emoji: '🧽' },
    ],
  },
  {
    id: 'kata-mandi',
    level: 'kata',
    title: 'Barang di Kamar Mandi',
    emoji: '🛁',
    desc: 'Perlengkapan mandi sehari-hari',
    items: [
      { ar: 'صَابُون', latin: 'saabuun', id: 'sabun', emoji: '🧼' },
      { ar: 'مِنْشَفَة', latin: 'minsyafah', id: 'handuk', emoji: '🧖' },
      { ar: 'فُرْشَاة', latin: 'fursyaah', id: 'sikat gigi', emoji: '🪥' },
      { ar: 'مَاء', latin: "maa'", id: 'air', emoji: '💧' },
      { ar: 'مِشْط', latin: 'misyth', id: 'sisir', emoji: '🪮' },
      { ar: 'مَعْجُون', latin: "ma'juun", id: 'pasta gigi', emoji: '🧴' },
    ],
  },
  {
    id: 'kata-makanan',
    level: 'kata',
    title: 'Makanan & Minuman',
    emoji: '🍞',
    desc: 'Yang ada di meja makan',
    items: [
      { ar: 'خُبْز', latin: 'khubz', id: 'roti', emoji: '🍞' },
      { ar: 'أَرُزّ', latin: 'aruzz', id: 'nasi', emoji: '🍚' },
      { ar: 'لَحْم', latin: 'lahm', id: 'daging', emoji: '🍖' },
      { ar: 'فَاكِهَة', latin: 'faakihah', id: 'buah', emoji: '🍎' },
      { ar: 'مَاء', latin: "maa'", id: 'air', emoji: '💧' },
      { ar: 'شَاي', latin: 'syaay', id: 'teh', emoji: '🍵' },
    ],
  },
];

// LEVEL 2 — KALIMAT. Tiap kalimat: { ar (berharakat), tokens (urutan benar untuk
// latihan susun), latin, id (arti) }. Pakai kosakata dari Level 1 biar nyambung.
export const NGOMONG_KALIMAT = [
  {
    id: 'kalimat-lokasi',
    level: 'kalimat',
    title: 'Di Mana Barangnya?',
    emoji: '📍',
    desc: 'Kalimat lokasi: fi (di dalam) & ala (di atas)',
    items: [
      { ar: 'الْمِفْتَاحُ فِي الْحَقِيبَةِ', tokens: ['الْمِفْتَاحُ', 'فِي', 'الْحَقِيبَةِ'], latin: 'al-miftaahu fil-haqiibah', id: 'Kunci itu ada di dalam tas' },
      { ar: 'الْكِتَابُ عَلَى الطَّاوِلَةِ', tokens: ['الْكِتَابُ', 'عَلَى', 'الطَّاوِلَةِ'], latin: "al-kitaabu 'alath-thaawilah", id: 'Buku itu ada di atas meja' },
      { ar: 'الْمَاءُ فِي الْكُوبِ', tokens: ['الْمَاءُ', 'فِي', 'الْكُوبِ'], latin: 'al-maa-u fil-kuub', id: 'Air itu ada di dalam gelas' },
      { ar: 'السَّاعَةُ عَلَى الْجِدَارِ', tokens: ['السَّاعَةُ', 'عَلَى', 'الْجِدَارِ'], latin: "as-saa'atu 'alal-jidaar", id: 'Jam itu ada di dinding' },
      { ar: 'الصَّابُونُ فِي الْحَمَّامِ', tokens: ['الصَّابُونُ', 'فِي', 'الْحَمَّامِ'], latin: 'ash-shaabuunu fil-hammaam', id: 'Sabun itu ada di kamar mandi' },
      { ar: 'الْقَلَمُ فِي الدَّفْتَرِ', tokens: ['الْقَلَمُ', 'فِي', 'الدَّفْتَرِ'], latin: 'al-qalamu fid-daftar', id: 'Pena itu ada di buku tulis' },
    ],
  },
  {
    id: 'kalimat-milik',
    level: 'kalimat',
    title: 'Ini Punyaku',
    emoji: '🙋',
    desc: 'Kalimat kepemilikan: hadza/hadzihi (ini)',
    items: [
      { ar: 'هَذَا قَلَمِي', tokens: ['هَذَا', 'قَلَمِي'], latin: 'haadzaa qalamii', id: 'Ini penaku' },
      { ar: 'هَذِهِ حَقِيبَتِي', tokens: ['هَذِهِ', 'حَقِيبَتِي'], latin: 'haadzihi haqiibatii', id: 'Ini tasku' },
      { ar: 'هَذَا كِتَابُكَ', tokens: ['هَذَا', 'كِتَابُكَ'], latin: 'haadzaa kitaabuka', id: 'Ini bukumu' },
      { ar: 'هَذَا هَاتِفِي', tokens: ['هَذَا', 'هَاتِفِي'], latin: 'haadzaa haatifii', id: 'Ini teleponku' },
      { ar: 'هَذِهِ نَظَّارَتِي', tokens: ['هَذِهِ', 'نَظَّارَتِي'], latin: 'haadzihi nazhzhaaratii', id: 'Ini kacamataku' },
      { ar: 'هَذَا صَحْنٌ كَبِيرٌ', tokens: ['هَذَا', 'صَحْنٌ', 'كَبِيرٌ'], latin: 'haadzaa sahnun kabiir', id: 'Ini piring besar' },
    ],
  },
  {
    id: 'kalimat-aktivitas',
    level: 'kalimat',
    title: 'Kegiatan Harian',
    emoji: '🏃',
    desc: 'Kalimat aktivitas: kata kerja + objek',
    items: [
      { ar: 'أَشْرَبُ الْمَاءَ', tokens: ['أَشْرَبُ', 'الْمَاءَ'], latin: "asyrabul-maa'", id: 'Aku minum air' },
      { ar: 'آكُلُ الْخُبْزَ', tokens: ['آكُلُ', 'الْخُبْزَ'], latin: 'aakulul-khubz', id: 'Aku makan roti' },
      { ar: 'أَقْرَأُ الْكِتَابَ', tokens: ['أَقْرَأُ', 'الْكِتَابَ'], latin: "aqra-ul-kitaab", id: 'Aku membaca buku' },
      { ar: 'أَكْتُبُ بِالْقَلَمِ', tokens: ['أَكْتُبُ', 'بِالْقَلَمِ'], latin: 'aktubu bil-qalam', id: 'Aku menulis dengan pena' },
      { ar: 'أَفْتَحُ الْبَابَ', tokens: ['أَفْتَحُ', 'الْبَابَ'], latin: 'aftahul-baab', id: 'Aku membuka pintu' },
      { ar: 'أَغْسِلُ الصَّحْنَ', tokens: ['أَغْسِلُ', 'الصَّحْنَ'], latin: 'aghsilush-shahn', id: 'Aku mencuci piring' },
    ],
  },
];

// LEVEL 3 — CERITA. Tiap item = cerita pendek (3 kalimat). Latihan: urutkan
// kalimat jadi cerita yang runtut, lalu narasikan paragrafnya.
//   ar = paragraf penuh (TTS + target ucapan), id = arti penuh,
//   sentences[] = kalimat dalam urutan BENAR (buat latihan urutkan).
export const NGOMONG_CERITA = [
  {
    id: 'cerita-pagi',
    level: 'cerita',
    title: 'Pagiku',
    emoji: '🌅',
    desc: 'Ceritakan kegiatan pagi harimu',
    items: [
      {
        title: 'Bangun Pagi',
        ar: 'أَسْتَيْقِظُ مُبَكِّرًا، أُصَلِّي الْفَجْرَ، ثُمَّ أَقْرَأُ الْقُرْآنَ',
        id: 'Aku bangun pagi-pagi, salat subuh, lalu membaca Al-Quran.',
        sentences: [
          { ar: 'أَسْتَيْقِظُ مُبَكِّرًا', id: 'Aku bangun pagi-pagi' },
          { ar: 'أُصَلِّي الْفَجْرَ', id: 'Aku salat subuh' },
          { ar: 'ثُمَّ أَقْرَأُ الْقُرْآنَ', id: 'Lalu aku membaca Al-Quran' },
        ],
      },
      {
        title: 'Sarapan',
        ar: 'أَذْهَبُ إِلَى الْمَطْبَخِ، آكُلُ الْخُبْزَ، وَأَشْرَبُ الشَّايَ',
        id: 'Aku pergi ke dapur, makan roti, dan minum teh.',
        sentences: [
          { ar: 'أَذْهَبُ إِلَى الْمَطْبَخِ', id: 'Aku pergi ke dapur' },
          { ar: 'آكُلُ الْخُبْزَ', id: 'Aku makan roti' },
          { ar: 'وَأَشْرَبُ الشَّايَ', id: 'Dan aku minum teh' },
        ],
      },
      {
        title: 'Bersih-bersih',
        ar: 'أَغْسِلُ الصَّحْنَ، أُرَتِّبُ الْغُرْفَةَ، ثُمَّ أَلْبَسُ مَلَابِسِي',
        id: 'Aku mencuci piring, merapikan kamar, lalu memakai bajuku.',
        sentences: [
          { ar: 'أَغْسِلُ الصَّحْنَ', id: 'Aku mencuci piring' },
          { ar: 'أُرَتِّبُ الْغُرْفَةَ', id: 'Aku merapikan kamar' },
          { ar: 'ثُمَّ أَلْبَسُ مَلَابِسِي', id: 'Lalu aku memakai bajuku' },
        ],
      },
      {
        title: 'Berangkat',
        ar: 'آخُذُ حَقِيبَتِي، أَفْتَحُ الْبَابَ، وَأَخْرُجُ مِنَ الْبَيْتِ',
        id: 'Aku mengambil tasku, membuka pintu, dan keluar dari rumah.',
        sentences: [
          { ar: 'آخُذُ حَقِيبَتِي', id: 'Aku mengambil tasku' },
          { ar: 'أَفْتَحُ الْبَابَ', id: 'Aku membuka pintu' },
          { ar: 'وَأَخْرُجُ مِنَ الْبَيْتِ', id: 'Dan aku keluar dari rumah' },
        ],
      },
      {
        title: 'Di Jalan',
        ar: 'أَرْكَبُ السَّيَّارَةَ، أَنْظُرُ مِنَ النَّافِذَةِ، ثُمَّ أَصِلُ إِلَى الْعَمَلِ',
        id: 'Aku naik mobil, melihat dari jendela, lalu sampai di tempat kerja.',
        sentences: [
          { ar: 'أَرْكَبُ السَّيَّارَةَ', id: 'Aku naik mobil' },
          { ar: 'أَنْظُرُ مِنَ النَّافِذَةِ', id: 'Aku melihat dari jendela' },
          { ar: 'ثُمَّ أَصِلُ إِلَى الْعَمَلِ', id: 'Lalu aku sampai di tempat kerja' },
        ],
      },
    ],
  },
  {
    id: 'cerita-haram',
    level: 'cerita',
    title: 'Di Tanah Suci',
    emoji: '🕋',
    desc: 'Ceritakan pengalaman ibadah umrah',
    items: [
      {
        title: 'Menuju Masjid',
        ar: 'أَلْبَسُ الْإِحْرَامَ، أَذْهَبُ إِلَى الْمَسْجِدِ، ثُمَّ أَدْخُلُ الْحَرَمَ',
        id: 'Aku memakai ihram, pergi ke masjid, lalu masuk ke Masjidil Haram.',
        sentences: [
          { ar: 'أَلْبَسُ الْإِحْرَامَ', id: 'Aku memakai ihram' },
          { ar: 'أَذْهَبُ إِلَى الْمَسْجِدِ', id: 'Aku pergi ke masjid' },
          { ar: 'ثُمَّ أَدْخُلُ الْحَرَمَ', id: 'Lalu aku masuk ke Masjidil Haram' },
        ],
      },
      {
        title: 'Melihat Kabah',
        ar: 'أَنْظُرُ إِلَى الْكَعْبَةِ، أَرْفَعُ يَدَيَّ، وَأَدْعُو اللَّهَ',
        id: 'Aku melihat Kabah, mengangkat kedua tanganku, dan berdoa kepada Allah.',
        sentences: [
          { ar: 'أَنْظُرُ إِلَى الْكَعْبَةِ', id: 'Aku melihat Kabah' },
          { ar: 'أَرْفَعُ يَدَيَّ', id: 'Aku mengangkat kedua tanganku' },
          { ar: 'وَأَدْعُو اللَّهَ', id: 'Dan aku berdoa kepada Allah' },
        ],
      },
      {
        title: 'Tawaf',
        ar: 'أَطُوفُ حَوْلَ الْكَعْبَةِ، أَذْكُرُ اللَّهَ، ثُمَّ أُصَلِّي رَكْعَتَيْنِ',
        id: 'Aku tawaf mengelilingi Kabah, berzikir kepada Allah, lalu salat dua rakaat.',
        sentences: [
          { ar: 'أَطُوفُ حَوْلَ الْكَعْبَةِ', id: 'Aku tawaf mengelilingi Kabah' },
          { ar: 'أَذْكُرُ اللَّهَ', id: 'Aku berzikir kepada Allah' },
          { ar: 'ثُمَّ أُصَلِّي رَكْعَتَيْنِ', id: 'Lalu aku salat dua rakaat' },
        ],
      },
      {
        title: 'Minum Zamzam',
        ar: 'أَشْرَبُ مَاءَ زَمْزَمَ، أَحْمَدُ اللَّهَ، وَأَشْعُرُ بِالسَّعَادَةِ',
        id: 'Aku minum air zamzam, memuji Allah, dan merasa bahagia.',
        sentences: [
          { ar: 'أَشْرَبُ مَاءَ زَمْزَمَ', id: 'Aku minum air zamzam' },
          { ar: 'أَحْمَدُ اللَّهَ', id: 'Aku memuji Allah' },
          { ar: 'وَأَشْعُرُ بِالسَّعَادَةِ', id: 'Dan aku merasa bahagia' },
        ],
      },
      {
        title: 'Sai',
        ar: 'أَسْعَى بَيْنَ الصَّفَا وَالْمَرْوَةِ، أَتَذَكَّرُ هَاجَرَ، ثُمَّ أَشْكُرُ رَبِّي',
        id: 'Aku sai antara Shafa dan Marwah, mengingat Hajar, lalu bersyukur kepada Tuhanku.',
        sentences: [
          { ar: 'أَسْعَى بَيْنَ الصَّفَا وَالْمَرْوَةِ', id: 'Aku sai antara Shafa dan Marwah' },
          { ar: 'أَتَذَكَّرُ هَاجَرَ', id: 'Aku mengingat Hajar' },
          { ar: 'ثُمَّ أَشْكُرُ رَبِّي', id: 'Lalu aku bersyukur kepada Tuhanku' },
        ],
      },
    ],
  },
];

// Gabungan semua materi (kata + kalimat + cerita) untuk lookup.
const ALL_NGOMONG = [...NGOMONG_MATERI, ...NGOMONG_KALIMAT, ...NGOMONG_CERITA];

// Helper: ambil materi by id (semua level)
export function getNgomongMateri(id) {
  return ALL_NGOMONG.find((m) => m.id === id) || null;
}

// Helper: materi level Kata aja
export function getNgomongKataMateri() {
  return NGOMONG_MATERI.filter((m) => m.level === 'kata');
}

// Helper: materi per level ('kata' | 'kalimat')
export function getNgomongMateriByLevel(level) {
  return ALL_NGOMONG.filter((m) => m.level === level);
}
