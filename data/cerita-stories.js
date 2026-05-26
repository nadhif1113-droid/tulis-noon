// data/cerita-stories.js
// Cerita Interaktif — narrative learning dengan vocab Arab embedded.
// AI-generated content, akan terus diperbaharui & diperkuat tiap update.
// Format per cerita: pages array (narrative + vocab + dialog) + endQuiz.

export const CERITA_STORIES = [
  // ===========================================================================
  // STORY 1 — EASY: Tiba di Madinah
  // ===========================================================================
  {
    id: 'tiba-di-madinah',
    title: 'Tiba di Madinah',
    subtitle: 'Pertama kali menginjak Tanah Suci',
    emoji: '✈️',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    difficulty: 'Mudah',
    estimatedMinutes: 5,
    xpReward: 60,
    description: 'Ikuti perjalanan Ahmad, jamaah umrah dari Indonesia yang pertama kali tiba di Madinah.',
    pages: [
      {
        type: 'narrative',
        text: 'Setelah 9 jam terbang dari Jakarta, akhirnya pesawat Ahmad mendarat di Bandara Pangeran Mohammad bin Abdul Aziz, Madinah. Hatinya berdebar — ini kali pertama dia menginjak Tanah Suci.',
        vocab: { ar: 'مَطَار', latin: 'matar', id: 'Bandara' },
      },
      {
        type: 'narrative',
        text: 'Setelah turun pesawat, Ahmad mengikuti antrian imigrasi. Seorang petugas tersenyum sambil memberikan salam.',
        dialog: { speaker: 'Petugas', ar: 'السَّلَامُ عَلَيْكُمْ، أَهْلًا وَسَهْلًا', latin: 'as-salamu \'alaykum, ahlan wa sahlan', id: '"Assalamualaikum, selamat datang."' },
      },
      {
        type: 'narrative',
        text: 'Ahmad membalas salam dengan canggung tapi senang. Dia mencoba pakai sedikit bahasa Arab yang dia pelajari.',
        dialog: { speaker: 'Ahmad', ar: 'وَعَلَيْكُمُ السَّلَامُ، شُكْرًا', latin: 'wa \'alaykumussalam, syukran', id: '"Wa alaikumussalam, terima kasih."' },
      },
      {
        type: 'narrative',
        text: 'Petugas itu memeriksa visa Ahmad lalu mengangguk ramah. Stempel paspor mendarat di halaman visa umrah-nya. Resmi!',
        vocab: { ar: 'تَأْشِيرَة', latin: 'ta\'shirah', id: 'Visa' },
      },
      {
        type: 'narrative',
        text: 'Ahmad keluar dari ruang imigrasi. Udara Madinah hangat tapi terasa sejuk di hatinya. Dia melihat papan petunjuk dalam bahasa Arab.',
        vocab: { ar: 'الْمَدِينَة الْمُنَوَّرَة', latin: 'al-madinah al-munawwarah', id: 'Madinah Al-Munawwarah (Kota Bercahaya)' },
      },
      {
        type: 'narrative',
        text: 'Di luar bandara, Ahmad mencari taksi yang akan mengantarnya ke hotel dekat Masjid Nabawi. Seorang sopir taksi menghampirinya.',
        dialog: { speaker: 'Sopir', ar: 'تَاكْسِي؟ إِلَى أَيْن؟', latin: 'taksi? ila ayn?', id: '"Taksi? Mau ke mana?"' },
      },
      {
        type: 'narrative',
        text: 'Ahmad menjawab dengan percaya diri — kata-kata yang sudah dia hafal di Tulis Noon sebelum berangkat.',
        dialog: { speaker: 'Ahmad', ar: 'إِلَى الْمَسْجِد النَّبَوِي، مِنْ فَضْلِك', latin: 'ila al-masjid an-nabawi, min fadhlik', id: '"Ke Masjid Nabawi, tolong."' },
        vocab: { ar: 'مِنْ فَضْلِك', latin: 'min fadhlik', id: 'Tolong / Silakan (sopan)' },
      },
      {
        type: 'narrative',
        text: 'Sopir tersenyum bangga karena Ahmad pakai bahasa Arab. Taksi melaju ke jalan Madinah yang lebar dan rapi. Ahmad tidak bisa berhenti tersenyum. Alhamdulillah.',
        vocab: { ar: 'الْحَمْدُ لِلَّه', latin: 'al-hamdu lillah', id: 'Segala puji bagi Allah' },
      },
    ],
    endQuiz: [
      { q: 'Apa arti مَطَار?', choices: ['Bandara', 'Hotel', 'Pasar', 'Masjid'], correctIdx: 0 },
      { q: 'Bagaimana cara mengucapkan "terima kasih" dalam bahasa Arab?', choices: ['Tafaddhal', 'Shukran', 'Ahlan', 'Mafi musykila'], correctIdx: 1 },
      { q: 'Apa makna مِنْ فَضْلِك?', choices: ['Permisi', 'Tolong/Silakan', 'Maaf', 'Selamat datang'], correctIdx: 1 },
      { q: 'Madinah biasa disebut juga sebagai...', choices: ['Al-Munawwarah', 'Al-Mukarramah', 'Al-Mubarakah', 'Al-Aqsha'], correctIdx: 0 },
      { q: 'Untuk meminta diantar dengan sopan, kita pakai kata...', choices: ['Khalas', 'Min fadhlik', 'Khallas wallah', 'Yallah'], correctIdx: 1 },
    ],
  },

  // ===========================================================================
  // STORY 2 — MEDIUM: Belanja Kurma di Pasar Madinah
  // ===========================================================================
  {
    id: 'belanja-kurma',
    title: 'Belanja Kurma di Pasar',
    subtitle: 'Latihan nawar di Suq Tamr Madinah',
    emoji: '🛍️',
    color: '#a05536',
    bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
    difficulty: 'Sedang',
    estimatedMinutes: 7,
    xpReward: 90,
    description: 'Siti pertama kali ke pasar kurma Madinah. Bisakah dia nawar dengan dialek Hijazi?',
    pages: [
      {
        type: 'narrative',
        text: 'Siti turun dari bus jamaah di Suq Tamr — pasar kurma Madinah yang terkenal. Aroma kurma manis menyambutnya. Penjual berbaris dengan tumpukan kurma berbagai jenis.',
        vocab: { ar: 'سُوق التَّمْر', latin: 'suq at-tamr', id: 'Pasar Kurma' },
      },
      {
        type: 'narrative',
        text: 'Siti tertarik pada kurma Ajwa yang gelap dan mengkilap. Penjual yang ramah memanggilnya.',
        dialog: { speaker: 'Pedagang', ar: 'أَهْلَيْن! تَفَضَّلِي، التَّمْر الْعَجْوَة طَازِج', latin: 'ahleyn! tafaddhali, at-tamr al-\'ajwa thazij', id: '"Halo! Silakan, kurma Ajwanya fresh."' },
        vocab: { ar: 'طَازِج', latin: 'thazij', id: 'Fresh / Segar' },
      },
      {
        type: 'narrative',
        text: 'Siti menyapa balik dengan ramah. Dia ingin menanyakan harga sebelum memutuskan.',
        dialog: { speaker: 'Siti', ar: 'السَّلَامُ عَلَيْكُمْ، بِكَمْ الْكِيلُو؟', latin: 'as-salamu \'alaykum, bi kam al-kilo?', id: '"Assalamualaikum, berapa per kilo?"' },
        vocab: { ar: 'بِكَمْ الْكِيلُو', latin: 'bi kam al-kilo', id: 'Berapa per kilo?' },
      },
      {
        type: 'narrative',
        text: 'Pedagang menjawab dengan harga yang lumayan tinggi.',
        dialog: { speaker: 'Pedagang', ar: 'بِخَمْسِين رِيَال، أَصْلِي مِنَ الْمَدِينَة', latin: 'bi khamsin riyal, asli min al-madina', id: '"50 Riyal, asli dari Madinah."' },
      },
      {
        type: 'narrative',
        text: 'Siti tahu ini harga awal — dia harus menawar. Dia ingat tips dari Tulis Noon: jangan langsung setuju.',
        dialog: { speaker: 'Siti', ar: 'وَاللَّه غَالِي شَوَيّ، رَخِّص', latin: 'wallah ghali shway, rakhkhis', id: '"Aduh agak mahal, kasih murah dong."' },
        vocab: { ar: 'غَالِي', latin: 'ghali', id: 'Mahal' },
      },
      {
        type: 'narrative',
        text: 'Pedagang tersenyum — Siti punya skill nawar.',
        dialog: { speaker: 'Pedagang', ar: 'خَلاَص، أَرْبَعِين، آخِر سِعْر', latin: 'khalas, arba\'in, akhir si\'r', id: '"Oke, 40, harga terakhir."' },
        vocab: { ar: 'آخِر سِعْر', latin: 'akhir si\'r', id: 'Harga terakhir / final price' },
      },
      {
        type: 'narrative',
        text: 'Siti puas tapi mau coba sekali lagi. 5 Riyal lagi turun nih.',
        dialog: { speaker: 'Siti', ar: 'خَمْسَة وَثَلاَثِين؟ أَنَا ضَيْفَة', latin: 'khamsa wa thalathin? ana dhayfa', id: '"35? Saya kan tamu."' },
      },
      {
        type: 'narrative',
        text: 'Pedagang tertawa kecil — dia respect Siti yang pakai trik "tamu".',
        dialog: { speaker: 'Pedagang', ar: 'خَلاَص، خُذِي بِخَمْسَة وَثَلاَثِين، وَأَنْتِ ضَيْفَتِي', latin: 'khalas, khudhi bi khamsa wa thalathin, wa anti dhayfati', id: '"Oke, ambil 35, kamu tamuku."' },
        vocab: { ar: 'ضَيْف / ضَيْفَة', latin: 'dhayf / dhayfa', id: 'Tamu (laki / wanita)' },
      },
      {
        type: 'narrative',
        text: 'Deal! Siti dapat 1 kilo kurma Ajwa dengan harga 35 Riyal. Dia merasa bangga — pertama kali nawar di pasar Saudi dan berhasil.',
      },
    ],
    endQuiz: [
      { q: 'Apa arti بِكَمْ الْكِيلُو؟', choices: ['Berapa kilonya?', 'Berapa per kilo?', 'Mau ambil berapa kilo?', 'Kilo apa?'], correctIdx: 1 },
      { q: 'Untuk minta diskon, kita bilang...', choices: ['Khalas!', 'Wallah ghali, rakhkhis', 'Yallah bi kilo', 'Shukran jiddan'], correctIdx: 1 },
      { q: 'Kata "ضَيْف" artinya...', choices: ['Pedagang', 'Tamu', 'Pelanggan', 'Pembeli'], correctIdx: 1 },
      { q: 'آخِر سِعْر = ?', choices: ['Harga awal', 'Harga rata-rata', 'Harga terakhir', 'Harga grosir'], correctIdx: 2 },
      { q: 'Kurma Madinah yang gelap & terkenal namanya...', choices: ['Sukkari', 'Khalas', 'Ajwa', 'Mejdool'], correctIdx: 2 },
      { q: 'Apa makna طَازِج?', choices: ['Mahal', 'Murah', 'Fresh/segar', 'Kering'], correctIdx: 2 },
    ],
  },

  // ===========================================================================
  // STORY 3 — HARD: Sahabat Nabi - Bilal bin Rabah
  // ===========================================================================
  {
    id: 'sahabat-bilal',
    title: 'Sahabat Bilal bin Rabah',
    subtitle: 'Kisah muadzin pertama Islam',
    emoji: '🌟',
    color: '#c9a961',
    bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    difficulty: 'Sulit',
    estimatedMinutes: 10,
    xpReward: 120,
    description: 'Kisah perjuangan Bilal — budak Habsyi yang kemudian jadi muadzin Rasulullah.',
    pages: [
      {
        type: 'narrative',
        text: 'Di Makkah pada zaman jahiliyah, hidup seorang budak Habsyi (Ethiopia) bernama Bilal bin Rabah. Tubuhnya tinggi, kulitnya hitam, dan hatinya bersih.',
        vocab: { ar: 'صَحَابِي', latin: 'shahabi', id: 'Sahabat (Nabi)' },
      },
      {
        type: 'narrative',
        text: 'Bilal adalah milik Umayyah bin Khalaf, salah satu pembesar Quraisy yang sangat menentang Nabi Muhammad ﷺ. Hidup Bilal penuh penderitaan sebagai budak.',
        vocab: { ar: 'عَبْد', latin: '\'abd', id: 'Hamba / Budak' },
      },
      {
        type: 'narrative',
        text: 'Suatu hari, Bilal mendengar tentang Nabi Muhammad yang mengajarkan satu Tuhan saja. Hatinya tertarik. Dia diam-diam belajar dan akhirnya masuk Islam.',
        vocab: { ar: 'تَوْحِيد', latin: 'tawhid', id: 'Tauhid / Mengesakan Allah' },
      },
      {
        type: 'narrative',
        text: 'Umayyah marah besar saat tahu Bilal beriman. Dia menyiksa Bilal di gurun panas Makkah, menindihnya dengan batu besar di dada di bawah terik matahari.',
        dialog: { speaker: 'Umayyah', ar: 'كُفْرُ بِمُحَمَّد!', latin: 'kufru bi-Muhammad!', id: '"Kafirlah pada Muhammad!"' },
      },
      {
        type: 'narrative',
        text: 'Tapi Bilal hanya berkata satu kata, berulang-ulang, dengan suara lemah tapi keimanan yang kuat.',
        dialog: { speaker: 'Bilal', ar: 'أَحَد، أَحَد', latin: 'ahad, ahad', id: '"Satu (Allah), satu."' },
        vocab: { ar: 'أَحَد', latin: 'ahad', id: 'Esa / Satu (sifat Allah)' },
      },
      {
        type: 'narrative',
        text: 'Abu Bakr Ash-Shiddiq mendengar penderitaan Bilal. Dia membeli Bilal dari Umayyah dengan harga mahal lalu memerdekakannya. Bilal sekarang manusia bebas.',
        vocab: { ar: 'حُرّ', latin: 'hurr', id: 'Merdeka / Bebas' },
      },
      {
        type: 'narrative',
        text: 'Bertahun-tahun kemudian, kaum muslimin hijrah ke Madinah. Nabi Muhammad ﷺ memerintahkan adzan dipanggil untuk shalat. Tapi siapa yang akan jadi muadzin?',
        vocab: { ar: 'أَذَان', latin: 'adzan', id: 'Adzan (panggilan shalat)' },
      },
      {
        type: 'narrative',
        text: 'Nabi memilih Bilal karena suaranya yang merdu dan keimanannya yang teruji. Bilal — bekas budak — menjadi muadzin resmi Rasulullah.',
        dialog: { speaker: 'Bilal', ar: 'اللَّهُ أَكْبَر، اللَّهُ أَكْبَر', latin: 'allahu akbar, allahu akbar', id: '"Allah Maha Besar, Allah Maha Besar."' },
        vocab: { ar: 'مُؤَذِّن', latin: 'mu\'adzdzin', id: 'Muadzin (pengumandang adzan)' },
      },
      {
        type: 'narrative',
        text: 'Pada hari Fathu Makkah (pembebasan Makkah), Nabi memerintahkan Bilal naik ke atap Ka\'bah dan mengumandangkan adzan. Saat itu seorang Habsyi hitam berdiri di tempat yang paling mulia di dunia.',
        vocab: { ar: 'فَتْح مَكَّة', latin: 'fath makka', id: 'Pembebasan Makkah' },
      },
      {
        type: 'narrative',
        text: 'Kisah Bilal mengajarkan: dalam Islam, kemuliaan bukan dari warna kulit, suku, atau status — tapi dari ketakwaan kepada Allah ﷻ.',
        dialog: { speaker: 'Al-Quran', ar: 'إِنَّ أَكْرَمَكُمْ عِنْدَ اللَّهِ أَتْقَاكُمْ', latin: 'inna akramakum \'inda allahi atqakum', id: '"Sesungguhnya yang paling mulia di sisi Allah adalah yang paling bertakwa." (QS. Al-Hujurat: 13)' },
      },
    ],
    endQuiz: [
      { q: 'Bilal bin Rabah berasal dari...', choices: ['Madinah', 'Habsyah (Ethiopia)', 'Yaman', 'Mesir'], correctIdx: 1 },
      { q: 'Apa arti أَحَد?', choices: ['Pertama', 'Hari Ahad', 'Esa/Satu', 'Berbeda'], correctIdx: 2 },
      { q: 'Yang membebaskan Bilal dari perbudakan adalah...', choices: ['Umayyah bin Khalaf', 'Abu Bakr Ash-Shiddiq', 'Umar bin Khattab', 'Utsman bin Affan'], correctIdx: 1 },
      { q: 'Apa profesi Bilal setelah hijrah ke Madinah?', choices: ['Pedagang', 'Tentara', 'Muadzin', 'Imam shalat'], correctIdx: 2 },
      { q: 'كَلِمَة "حُرّ" mempunyai arti...', choices: ['Budak', 'Tuan', 'Merdeka', 'Tahanan'], correctIdx: 2 },
      { q: 'فَتْح مَكَّة merujuk pada peristiwa...', choices: ['Hijrah ke Madinah', 'Perang Badar', 'Pembebasan Makkah', 'Haji Wada\''], correctIdx: 2 },
      { q: 'Menurut Al-Hujurat: 13, kemuliaan manusia diukur dari...', choices: ['Suku', 'Warna kulit', 'Harta', 'Ketakwaan'], correctIdx: 3 },
    ],
  },
];

export function getCerita(id) {
  return CERITA_STORIES.find((c) => c.id === id);
}
