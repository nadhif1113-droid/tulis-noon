// data/perkenalan-diri-materi.js
// 12 materi Perkenalan Diri (التعارف) — 4 FREE + 8 PREMIUM.
// Setiap materi: vocab Arab+latin+indo, dialog Q&A, quiz akhir 3-4 pertanyaan.
// Premium gating: per-materi 5 koin atau bundle lifetime 150 koin.

import { isPremiumUnlocked } from '@/lib/feature-flags';

export const PERKENALAN_MATERI_FREE_COUNT = 4;
export const PERKENALAN_MATERI_COST = 20; // koin per materi (= Rp 9.000 dgn baseline Rp 450/koin)
export const PERKENALAN_BUNDLE_COST = 150; // koin sekali bayar buka semua + future (= Rp 67.500)

export const PERKENALAN_MATERI = [
  // ============================================================
  // FREE (4 materi)
  // ============================================================
  {
    id: 'nama',
    order: 1,
    title: 'Menyebutkan Nama',
    subtitle: 'اسمي',
    emoji: '👤',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    isFree: true,
    estimatedMinutes: 3,
    xpReward: 40,
    description: 'Cara perkenalkan nama dalam bahasa Arab — formal & santai.',
    vocab: [
      { ar: 'اسْمِي', latin: 'ismi', id: 'Namaku' },
      { ar: 'مَا اسْمُكَ؟', latin: 'mā ismuka?', id: 'Siapa namamu? (ke laki)' },
      { ar: 'مَا اسْمُكِ؟', latin: 'mā ismuki?', id: 'Siapa namamu? (ke perempuan)' },
      { ar: 'تَشَرَّفْنَا', latin: 'tasyarrafnā', id: 'Senang berkenalan' },
      { ar: 'الْحَمْدُ لِلَّهِ', latin: 'alhamdulillāh', id: 'Segala puji bagi Allah' },
    ],
    dialog: [
      { speaker: 'A', ar: 'السَّلَامُ عَلَيْكُمْ، مَا اسْمُكَ؟', latin: 'as-salāmu ʿalaykum, mā ismuka?', id: 'Assalamu alaikum, siapa namamu?' },
      { speaker: 'B', ar: 'وَعَلَيْكُمُ السَّلَامُ، اسْمِي أَحْمَد', latin: 'wa ʿalaykumus-salām, ismi Ahmad', id: 'Wa alaikum salam, namaku Ahmad' },
      { speaker: 'A', ar: 'تَشَرَّفْنَا يَا أَحْمَد', latin: 'tasyarrafnā yā Ahmad', id: 'Senang berkenalan, Ahmad' },
      { speaker: 'B', ar: 'الْحَمْدُ لِلَّهِ، وَأَنْتَ؟', latin: 'alhamdulillāh, wa anta?', id: 'Alhamdulillah, dan kamu?' },
    ],
    quiz: [
      { q: 'Bagaimana cara bilang "namaku Ahmad"?', options: ['ismi Ahmad', 'anta Ahmad', 'huwa Ahmad'], correctIdx: 0 },
      { q: 'Apa arti "mā ismuka"?', options: ['Apa kabarmu?', 'Siapa namamu? (ke laki)', 'Dari mana asalmu?'], correctIdx: 1 },
      { q: 'Apa yang diucapkan setelah kenalan?', options: ['Tasyarrafnā', 'Maʿa s-salāmah', 'Shukran jazīlan'], correctIdx: 0 },
      { q: 'Cara tanya nama ke perempuan?', options: ['mā ismuka?', 'mā ismuki?', 'mā ismuhu?'], correctIdx: 1 },
    ],
  },
  {
    id: 'asal',
    order: 2,
    title: 'Dari Mana Asalmu',
    subtitle: 'من أين أنت',
    emoji: '🌍',
    color: '#a05536',
    bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
    isFree: true,
    estimatedMinutes: 3,
    xpReward: 40,
    description: 'Sebut asal negara/kota — penting buat ngobrol sama jamaah dunia.',
    vocab: [
      { ar: 'مِنْ أَيْنَ أَنْتَ؟', latin: 'min ayna anta?', id: 'Dari mana asalmu?' },
      { ar: 'أَنَا مِنْ إِنْدُونِيسِيَا', latin: 'anā min Indūnīsiyyā', id: 'Aku dari Indonesia' },
      { ar: 'أَنَا مِنْ جَاكَرْتَا', latin: 'anā min Jākartā', id: 'Aku dari Jakarta' },
      { ar: 'بَلَدِي', latin: 'baladī', id: 'Negaraku' },
      { ar: 'مَدِينَتِي', latin: 'madīnatī', id: 'Kotaku' },
    ],
    dialog: [
      { speaker: 'A', ar: 'مِنْ أَيْنَ أَنْتَ؟', latin: 'min ayna anta?', id: 'Dari mana asalmu?' },
      { speaker: 'B', ar: 'أَنَا مِنْ إِنْدُونِيسِيَا', latin: 'anā min Indūnīsiyyā', id: 'Aku dari Indonesia' },
      { speaker: 'A', ar: 'مِنْ أَيِّ مَدِينَة؟', latin: 'min ayyi madīnah?', id: 'Dari kota apa?' },
      { speaker: 'B', ar: 'مِنْ جَاكَرْتَا، عَاصِمَة بَلَدِي', latin: 'min Jākartā, ʿāṣimah baladī', id: 'Dari Jakarta, ibukota negaraku' },
    ],
    quiz: [
      { q: 'Bagaimana cara tanya asal seseorang?', options: ['mā ismuka?', 'min ayna anta?', 'kayfa ḥāluk?'], correctIdx: 1 },
      { q: 'Apa arti "anā min Indūnīsiyyā"?', options: ['Aku ke Indonesia', 'Aku dari Indonesia', 'Aku cinta Indonesia'], correctIdx: 1 },
      { q: 'Apa arti "madīnatī"?', options: ['Madinah', 'Kotaku', 'Negaraku'], correctIdx: 1 },
    ],
  },
  {
    id: 'umur',
    order: 3,
    title: 'Umur Saya',
    subtitle: 'عمري',
    emoji: '🎂',
    color: '#c9a961',
    bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    isFree: true,
    estimatedMinutes: 4,
    xpReward: 45,
    description: 'Sebut umur dengan angka Arab. Penting buat lengkapi profil.',
    vocab: [
      { ar: 'كَمْ عُمْرُكَ؟', latin: 'kam ʿumruka?', id: 'Berapa umurmu? (ke laki)' },
      { ar: 'عُمْرِي ثَلَاثُونَ سَنَة', latin: 'ʿumrī thalāthūna sanah', id: 'Umurku 30 tahun' },
      { ar: 'سَنَة', latin: 'sanah', id: 'Tahun' },
      { ar: 'عِشْرُونَ', latin: 'ʿisyrūn', id: '20' },
      { ar: 'ثَلَاثُونَ', latin: 'thalāthūn', id: '30' },
      { ar: 'أَرْبَعُونَ', latin: 'arbaʿūn', id: '40' },
    ],
    dialog: [
      { speaker: 'A', ar: 'كَمْ عُمْرُكَ؟', latin: 'kam ʿumruka?', id: 'Berapa umurmu?' },
      { speaker: 'B', ar: 'عُمْرِي خَمْسٌ وَثَلَاثُونَ سَنَة', latin: 'ʿumrī khamsun wa thalāthūna sanah', id: 'Umurku 35 tahun' },
      { speaker: 'A', ar: 'مَا شَاءَ الله، أَنْتَ شَابّ', latin: 'mā shā\'allah, anta syābb', id: 'Masya Allah, kamu masih muda' },
    ],
    quiz: [
      { q: 'Bagaimana cara tanya umur?', options: ['kam saʿah?', 'kam ʿumruka?', 'kam thaman?'], correctIdx: 1 },
      { q: 'Apa arti "thalāthūn"?', options: ['Tiga', 'Tigabelas', 'Tigapuluh'], correctIdx: 2 },
      { q: 'Apa arti "sanah"?', options: ['Bulan', 'Tahun', 'Hari'], correctIdx: 1 },
      { q: 'Cara bilang "umurku 40 tahun"?', options: ['ʿumrī arbaʿūna sanah', 'ʿumrī ʿisyrūna sanah', 'ʿumrī khamsūna sanah'], correctIdx: 0 },
    ],
  },
  {
    id: 'pekerjaan',
    order: 4,
    title: 'Pekerjaan Saya',
    subtitle: 'مهنتي',
    emoji: '💼',
    color: '#7a3d2a',
    bgGradient: 'linear-gradient(135deg, #7a3d2a, #a05536)',
    isFree: true,
    estimatedMinutes: 4,
    xpReward: 50,
    description: 'Sebut pekerjaan — guru, dokter, pedagang, dll.',
    vocab: [
      { ar: 'مَا مِهْنَتُكَ؟', latin: 'mā mihnatuka?', id: 'Apa pekerjaanmu?' },
      { ar: 'أَنَا مُدَرِّس', latin: 'anā mudarris', id: 'Aku guru' },
      { ar: 'أَنَا طَبِيب', latin: 'anā ṭabīb', id: 'Aku dokter' },
      { ar: 'أَنَا تَاجِر', latin: 'anā tājir', id: 'Aku pedagang' },
      { ar: 'أَنَا مُهَنْدِس', latin: 'anā muhandis', id: 'Aku insinyur' },
      { ar: 'أَنَا مُتَقَاعِد', latin: 'anā mutaqāʿid', id: 'Aku pensiunan' },
      { ar: 'أَعْمَلُ فِي', latin: 'aʿmalu fī', id: 'Aku bekerja di' },
    ],
    dialog: [
      { speaker: 'A', ar: 'مَا مِهْنَتُكَ؟', latin: 'mā mihnatuka?', id: 'Apa pekerjaanmu?' },
      { speaker: 'B', ar: 'أَنَا مُدَرِّس، أَعْمَلُ فِي مَدْرَسَة', latin: 'anā mudarris, aʿmalu fī madrasah', id: 'Aku guru, bekerja di sekolah' },
      { speaker: 'A', ar: 'مَا شَاءَ الله، مِهْنَة شَرِيفَة', latin: 'mā shā\'allah, mihnah syarīfah', id: 'Masya Allah, pekerjaan mulia' },
    ],
    quiz: [
      { q: 'Bagaimana cara tanya pekerjaan?', options: ['mā mihnatuka?', 'mā ʿumruka?', 'mā ismuka?'], correctIdx: 0 },
      { q: 'Apa arti "anā ṭabīb"?', options: ['Aku guru', 'Aku dokter', 'Aku pedagang'], correctIdx: 1 },
      { q: 'Apa arti "mutaqāʿid"?', options: ['Insinyur', 'Mahasiswa', 'Pensiunan'], correctIdx: 2 },
    ],
  },

  // ============================================================
  // PREMIUM (8 materi) — 5 koin per materi atau bundle 150 koin
  // ============================================================
  {
    id: 'keluarga',
    order: 5,
    title: 'Keluarga Saya',
    subtitle: 'عائلتي',
    emoji: '👨‍👩‍👧‍👦',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    isFree: false,
    estimatedMinutes: 5,
    xpReward: 60,
    description: 'Ceritakan keluarga — ayah, ibu, anak, saudara. Vocab kaya.',
    vocab: [
      { ar: 'عَائِلَتِي', latin: 'ʿā\'ilatī', id: 'Keluargaku' },
      { ar: 'أَبِي', latin: 'abī', id: 'Ayahku' },
      { ar: 'أُمِّي', latin: 'ummī', id: 'Ibuku' },
      { ar: 'زَوْجَتِي', latin: 'zawjatī', id: 'Istriku' },
      { ar: 'زَوْجِي', latin: 'zawjī', id: 'Suamiku' },
      { ar: 'أَوْلَادِي', latin: 'awlādī', id: 'Anak-anakku' },
      { ar: 'أَخِي', latin: 'akhī', id: 'Saudaraku (lk)' },
      { ar: 'أُخْتِي', latin: 'ukhtī', id: 'Saudariku (pr)' },
      { ar: 'كَمْ وَلَد عِنْدَكَ؟', latin: 'kam walad ʿindaka?', id: 'Berapa anakmu?' },
    ],
    dialog: [
      { speaker: 'A', ar: 'كَمْ وَلَد عِنْدَكَ؟', latin: 'kam walad ʿindaka?', id: 'Berapa anakmu?' },
      { speaker: 'B', ar: 'عِنْدِي ثَلَاثَة أَوْلَاد، وَلَدَانِ وَبِنْت', latin: 'ʿindī thalāthah awlād, waladāni wa bint', id: 'Aku punya 3 anak, 2 laki & 1 perempuan' },
      { speaker: 'A', ar: 'بَارَكَ الله فِيهِم', latin: 'bārakallāhu fīhim', id: 'Semoga Allah memberkahi mereka' },
      { speaker: 'B', ar: 'آمِين، شُكْرًا', latin: 'āmīn, syukran', id: 'Amin, terima kasih' },
    ],
    quiz: [
      { q: 'Apa arti "abī"?', options: ['Saudaraku', 'Ayahku', 'Anakku'], correctIdx: 1 },
      { q: 'Cara bilang "istriku"?', options: ['zawjī', 'zawjatī', 'ukhtī'], correctIdx: 1 },
      { q: 'Apa arti "awlādī"?', options: ['Saudaraku', 'Orangtuaku', 'Anak-anakku'], correctIdx: 2 },
      { q: 'Cara tanya jumlah anak?', options: ['kam walad ʿindaka?', 'kam ʿumruka?', 'min ayna anta?'], correctIdx: 0 },
    ],
  },
  {
    id: 'pendidikan',
    order: 6,
    title: 'Pendidikan',
    subtitle: 'تعليمي',
    emoji: '🎓',
    color: '#c9a961',
    bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    isFree: false,
    estimatedMinutes: 4,
    xpReward: 55,
    description: 'Cerita latar belakang pendidikan — sekolah, kampus, jurusan.',
    vocab: [
      { ar: 'دَرَسْتُ فِي', latin: 'darastu fī', id: 'Aku belajar di' },
      { ar: 'الْجَامِعَة', latin: 'al-jāmiʿah', id: 'Universitas' },
      { ar: 'الْمَدْرَسَة', latin: 'al-madrasah', id: 'Sekolah' },
      { ar: 'تَخَصُّصِي', latin: 'takhaṣṣuṣī', id: 'Jurusanku' },
      { ar: 'الطِّبّ', latin: 'aṭ-ṭibb', id: 'Kedokteran' },
      { ar: 'الْهَنْدَسَة', latin: 'al-handasah', id: 'Teknik' },
      { ar: 'الِاقْتِصَاد', latin: 'al-iqtiṣād', id: 'Ekonomi' },
      { ar: 'تَخَرَّجْتُ', latin: 'takharrajtu', id: 'Aku lulus' },
    ],
    dialog: [
      { speaker: 'A', ar: 'أَيْنَ دَرَسْتَ؟', latin: 'ayna darasta?', id: 'Di mana kamu belajar?' },
      { speaker: 'B', ar: 'دَرَسْتُ فِي جَامِعَة إِنْدُونِيسِيَا', latin: 'darastu fī jāmiʿah Indūnīsiyyā', id: 'Aku belajar di Universitas Indonesia' },
      { speaker: 'A', ar: 'مَا تَخَصُّصُكَ؟', latin: 'mā takhaṣṣuṣuka?', id: 'Apa jurusanmu?' },
      { speaker: 'B', ar: 'تَخَصُّصِي الْهَنْدَسَة', latin: 'takhaṣṣuṣī al-handasah', id: 'Jurusanku teknik' },
    ],
    quiz: [
      { q: 'Apa arti "al-jāmiʿah"?', options: ['Sekolah', 'Universitas', 'Masjid'], correctIdx: 1 },
      { q: 'Cara bilang "jurusanku kedokteran"?', options: ['takhaṣṣuṣī aṭ-ṭibb', 'takhaṣṣuṣī al-handasah', 'takhaṣṣuṣī al-iqtiṣād'], correctIdx: 0 },
      { q: 'Apa arti "takharrajtu"?', options: ['Aku masuk', 'Aku lulus', 'Aku belajar'], correctIdx: 1 },
    ],
  },
  {
    id: 'hobi',
    order: 7,
    title: 'Hobi & Minat',
    subtitle: 'هواياتي',
    emoji: '⚽',
    color: '#a05536',
    bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
    isFree: false,
    estimatedMinutes: 4,
    xpReward: 55,
    description: 'Sharing hobi — olahraga, baca, masak, traveling.',
    vocab: [
      { ar: 'هِوَايَتِي', latin: 'hiwāyatī', id: 'Hobiku' },
      { ar: 'أُحِبُّ', latin: 'uḥibbu', id: 'Aku suka' },
      { ar: 'الْقِرَاءَة', latin: 'al-qirā\'ah', id: 'Membaca' },
      { ar: 'الرِّيَاضَة', latin: 'ar-riyāḍah', id: 'Olahraga' },
      { ar: 'كُرَة الْقَدَم', latin: 'kurat al-qadam', id: 'Sepak bola' },
      { ar: 'السَّفَر', latin: 'as-safar', id: 'Bepergian' },
      { ar: 'الطَّبْخ', latin: 'aṭ-ṭabkh', id: 'Memasak' },
      { ar: 'فِي وَقْت الْفَرَاغ', latin: 'fī waqt al-farāgh', id: 'Di waktu luang' },
    ],
    dialog: [
      { speaker: 'A', ar: 'مَا هِوَايَتُكَ؟', latin: 'mā hiwāyatuka?', id: 'Apa hobimu?' },
      { speaker: 'B', ar: 'أُحِبُّ الْقِرَاءَة وَالسَّفَر', latin: 'uḥibbu al-qirā\'ah was-safar', id: 'Aku suka membaca & traveling' },
      { speaker: 'A', ar: 'وَأَنَا أُحِبُّ كُرَة الْقَدَم', latin: 'wa anā uḥibbu kurat al-qadam', id: 'Kalau aku suka sepak bola' },
      { speaker: 'B', ar: 'رِيَاضَة جَمِيلَة', latin: 'riyāḍah jamīlah', id: 'Olahraga yang indah' },
    ],
    quiz: [
      { q: 'Apa arti "uḥibbu"?', options: ['Aku punya', 'Aku suka', 'Aku perlu'], correctIdx: 1 },
      { q: 'Apa arti "as-safar"?', options: ['Memasak', 'Membaca', 'Bepergian'], correctIdx: 2 },
      { q: 'Cara bilang "hobiku sepak bola"?', options: ['hiwāyatī kurat al-qadam', 'hiwāyatī al-qirā\'ah', 'hiwāyatī aṭ-ṭabkh'], correctIdx: 0 },
    ],
  },
  {
    id: 'tujuan',
    order: 8,
    title: 'Tujuan Perjalanan',
    subtitle: 'هدف الرحلة',
    emoji: '🕋',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    isFree: false,
    estimatedMinutes: 5,
    xpReward: 65,
    description: 'Jelaskan tujuan kunjungan ke Saudi — umrah, haji, ziarah.',
    vocab: [
      { ar: 'جِئْتُ لِلْعُمْرَة', latin: 'ji\'tu lil-ʿumrah', id: 'Aku datang untuk umrah' },
      { ar: 'جِئْتُ لِلْحَجّ', latin: 'ji\'tu lil-ḥajj', id: 'Aku datang untuk haji' },
      { ar: 'لِلزِّيَارَة', latin: 'liz-ziyārah', id: 'Untuk ziarah' },
      { ar: 'هَذِهِ أَوَّل مَرَّة', latin: 'hāzihi awwal marrah', id: 'Ini pertama kali' },
      { ar: 'مَعَ عَائِلَتِي', latin: 'maʿa ʿā\'ilatī', id: 'Bersama keluargaku' },
      { ar: 'لِمُدَّة', latin: 'limuddah', id: 'Selama' },
      { ar: 'أُسْبُوع', latin: 'usbūʿ', id: 'Seminggu' },
      { ar: 'الْمَدِينَة الْمُنَوَّرَة', latin: 'al-madīnah al-munawwarah', id: 'Madinah Munawwarah' },
    ],
    dialog: [
      { speaker: 'A', ar: 'لِمَاذَا جِئْتَ إِلَى السُّعُودِيَّة؟', latin: 'limāzā ji\'ta ilas-suʿūdiyyah?', id: 'Kenapa kamu datang ke Saudi?' },
      { speaker: 'B', ar: 'جِئْتُ لِلْعُمْرَة مَعَ عَائِلَتِي', latin: 'ji\'tu lil-ʿumrah maʿa ʿā\'ilatī', id: 'Aku datang untuk umrah bersama keluarga' },
      { speaker: 'A', ar: 'تَقَبَّلَ الله مِنْكُم', latin: 'taqabbalallāhu minkum', id: 'Semoga Allah menerima ibadah kalian' },
      { speaker: 'B', ar: 'آمِين، وَمِنْكُم', latin: 'āmīn, wa minkum', id: 'Amin, dan dari kalian juga' },
    ],
    quiz: [
      { q: 'Cara bilang "aku datang untuk umrah"?', options: ['ji\'tu lil-ḥajj', 'ji\'tu lil-ʿumrah', 'ji\'tu liz-ziyārah'], correctIdx: 1 },
      { q: 'Apa arti "maʿa ʿā\'ilatī"?', options: ['Sendirian', 'Bersama keluargaku', 'Bersama teman'], correctIdx: 1 },
      { q: 'Bagaimana respons "taqabbalallāhu minkum"?', options: ['Shukran', 'Āmīn, wa minkum', 'Maʿa s-salāmah'], correctIdx: 1 },
      { q: 'Apa arti "usbūʿ"?', options: ['Hari', 'Minggu/seminggu', 'Bulan'], correctIdx: 1 },
    ],
  },
  {
    id: 'bahasa',
    order: 9,
    title: 'Bahasa yang Dikuasai',
    subtitle: 'اللغات',
    emoji: '🗣️',
    color: '#c9a961',
    bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    isFree: false,
    estimatedMinutes: 3,
    xpReward: 50,
    description: 'Sebut bahasa yang kamu kuasai + level kemahiran.',
    vocab: [
      { ar: 'أَتَكَلَّم', latin: 'atakallam', id: 'Aku bicara' },
      { ar: 'الْإِنْدُونِيسِيَّة', latin: 'al-Indūnīsiyyah', id: 'Bahasa Indonesia' },
      { ar: 'الْإِنْجِلِيزِيَّة', latin: 'al-Injilīziyyah', id: 'Bahasa Inggris' },
      { ar: 'الْعَرَبِيَّة', latin: 'al-ʿArabiyyah', id: 'Bahasa Arab' },
      { ar: 'قَلِيلًا', latin: 'qalīlan', id: 'Sedikit' },
      { ar: 'بِطَلَاقَة', latin: 'biṭalāqah', id: 'Lancar' },
      { ar: 'أَتَعَلَّم', latin: 'ataʿallam', id: 'Aku belajar' },
    ],
    dialog: [
      { speaker: 'A', ar: 'هَل تَتَكَلَّم الْعَرَبِيَّة؟', latin: 'hal tatakallam al-ʿArabiyyah?', id: 'Apa kamu bisa bahasa Arab?' },
      { speaker: 'B', ar: 'نَعَم، قَلِيلًا. أَتَعَلَّم الْآن', latin: 'naʿam, qalīlan. ataʿallam al-ān', id: 'Ya sedikit. Sedang belajar' },
      { speaker: 'A', ar: 'مَا شَاءَ الله، أَحْسَنْتَ', latin: 'mā shā\'allah, aḥsanta', id: 'Masya Allah, bagus' },
    ],
    quiz: [
      { q: 'Apa arti "atakallam"?', options: ['Aku belajar', 'Aku bicara', 'Aku dengar'], correctIdx: 1 },
      { q: 'Cara bilang "lancar"?', options: ['qalīlan', 'biṭalāqah', 'sariʿan'], correctIdx: 1 },
      { q: 'Cara bilang "aku sedang belajar"?', options: ['atakallam', 'ataʿallam', 'aktubu'], correctIdx: 1 },
    ],
  },
  {
    id: 'kontak',
    order: 10,
    title: 'Bertukar Kontak',
    subtitle: 'تبادل الأرقام',
    emoji: '📱',
    color: '#7a3d2a',
    bgGradient: 'linear-gradient(135deg, #7a3d2a, #a05536)',
    isFree: false,
    estimatedMinutes: 4,
    xpReward: 55,
    description: 'Tukeran nomor HP / WhatsApp sama jamaah baru.',
    vocab: [
      { ar: 'رَقْم هَاتِفِي', latin: 'raqm hātifī', id: 'Nomor HP-ku' },
      { ar: 'رَقْمُكَ كَمْ؟', latin: 'raqmuka kam?', id: 'Berapa nomormu?' },
      { ar: 'وَاتْسَاب', latin: 'wātsāb', id: 'WhatsApp' },
      { ar: 'سَأُرْسِل لَكَ', latin: 'sa-ursil laka', id: 'Aku akan kirim untukmu' },
      { ar: 'أَعْطِنِي رَقْمَكَ', latin: 'aʿṭinī raqmaka', id: 'Beri aku nomormu' },
      { ar: 'نَتَوَاصَل', latin: 'natawāṣal', id: 'Kita berkomunikasi' },
    ],
    dialog: [
      { speaker: 'A', ar: 'هَل عِنْدَكَ وَاتْسَاب؟', latin: 'hal ʿindaka wātsāb?', id: 'Punya WhatsApp?' },
      { speaker: 'B', ar: 'نَعَم، أَعْطِنِي رَقْمَكَ', latin: 'naʿam, aʿṭinī raqmaka', id: 'Iya, beri aku nomormu' },
      { speaker: 'A', ar: 'رَقْمِي: زِيرُو سَبْعَة...', latin: 'raqmī: zīrū sabʿah...', id: 'Nomorku: 07...' },
      { speaker: 'B', ar: 'سَأُرْسِل لَكَ رِسَالَة', latin: 'sa-ursil laka risālah', id: 'Aku akan kirim pesan' },
    ],
    quiz: [
      { q: 'Apa arti "raqm hātifī"?', options: ['Alamat rumahku', 'Nomor HP-ku', 'Email-ku'], correctIdx: 1 },
      { q: 'Cara bilang "aku akan kirim untukmu"?', options: ['sa-ursil laka', 'sa-āti laka', 'sa-aʿṭīka'], correctIdx: 0 },
      { q: 'Apa arti "natawāṣal"?', options: ['Kita bertemu', 'Kita berpisah', 'Kita berkomunikasi'], correctIdx: 2 },
    ],
  },
  {
    id: 'status',
    order: 11,
    title: 'Status Pernikahan',
    subtitle: 'الحالة الاجتماعية',
    emoji: '💍',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    isFree: false,
    estimatedMinutes: 4,
    xpReward: 55,
    description: 'Topik personal — single, menikah, jumlah anak.',
    vocab: [
      { ar: 'مُتَزَوِّج', latin: 'mutazawwij', id: 'Sudah menikah (lk)' },
      { ar: 'مُتَزَوِّجَة', latin: 'mutazawwijah', id: 'Sudah menikah (pr)' },
      { ar: 'أَعْزَب', latin: 'aʿzab', id: 'Belum menikah (lk)' },
      { ar: 'عَزْبَاء', latin: 'ʿazbā\'', id: 'Belum menikah (pr)' },
      { ar: 'هَل أَنْتَ مُتَزَوِّج؟', latin: 'hal anta mutazawwij?', id: 'Sudah menikah?' },
      { ar: 'مُنْذُ', latin: 'munzu', id: 'Sejak' },
      { ar: 'سَنَوَات', latin: 'sanawāt', id: 'Tahun-tahun' },
    ],
    dialog: [
      { speaker: 'A', ar: 'هَل أَنْتَ مُتَزَوِّج؟', latin: 'hal anta mutazawwij?', id: 'Sudah menikah?' },
      { speaker: 'B', ar: 'نَعَم، مُنْذُ عَشْر سَنَوَات', latin: 'naʿam, munzu ʿasyr sanawāt', id: 'Iya, sejak 10 tahun lalu' },
      { speaker: 'A', ar: 'بَارَكَ الله لَكُمَا', latin: 'bārakallāhu lakumā', id: 'Semoga Allah memberkahi kalian' },
    ],
    quiz: [
      { q: 'Apa arti "mutazawwij"?', options: ['Pensiunan', 'Sudah menikah (lk)', 'Mahasiswa'], correctIdx: 1 },
      { q: 'Cara bilang "belum menikah (laki)"?', options: ['aʿzab', 'mutazawwij', 'ʿazbā\''], correctIdx: 0 },
      { q: 'Apa arti "munzu ʿasyr sanawāt"?', options: ['Sejak 10 hari', 'Sejak 10 bulan', 'Sejak 10 tahun'], correctIdx: 2 },
    ],
  },
  {
    id: 'jamaah-haji',
    order: 12,
    title: 'Cerita Jamaah Haji',
    subtitle: 'حجاج بيت الله',
    emoji: '🕌',
    color: '#a05536',
    bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
    isFree: false,
    estimatedMinutes: 5,
    xpReward: 70,
    description: 'Cerita pengalaman haji/umrah — keberapa kali, perasaan, doa.',
    vocab: [
      { ar: 'لِأَوَّل مَرَّة', latin: 'li-awwal marrah', id: 'Untuk pertama kali' },
      { ar: 'الْمَرَّة الثَّانِيَة', latin: 'al-marrah ath-thāniyah', id: 'Kali kedua' },
      { ar: 'أَتَمَنَّى', latin: 'atamannā', id: 'Aku berharap' },
      { ar: 'حَجّ مَبْرُور', latin: 'ḥajj mabrūr', id: 'Haji mabrur' },
      { ar: 'الْحَرَم', latin: 'al-ḥaram', id: 'Tanah haram (Masjidil Haram)' },
      { ar: 'الرَّوْضَة', latin: 'ar-rawḍah', id: 'Raudhah (di Masjid Nabawi)' },
      { ar: 'دَعَوْتُ لَكَ', latin: 'daʿawtu laka', id: 'Aku doakan kamu' },
      { ar: 'سُبْحَانَ الله', latin: 'subḥānallāh', id: 'Maha suci Allah' },
    ],
    dialog: [
      { speaker: 'A', ar: 'هَل هَذِهِ أَوَّل مَرَّة لَكَ؟', latin: 'hal hāzihi awwal marrah laka?', id: 'Apa ini pertama kalimu?' },
      { speaker: 'B', ar: 'لَا، هَذِهِ الْمَرَّة الثَّالِثَة', latin: 'lā, hāzihi al-marrah ath-thālithah', id: 'Bukan, ini ketiga kalinya' },
      { speaker: 'A', ar: 'مَا شَاءَ الله! أَتَمَنَّى أَنْ أَعُود', latin: 'mā shā\'allah! atamannā an aʿūd', id: 'Masya Allah! Aku harap bisa kembali' },
      { speaker: 'B', ar: 'إِنْ شَاءَ الله، دَعَوْتُ لَكَ فِي الرَّوْضَة', latin: 'in shā\'allah, daʿawtu laka fīr-rawḍah', id: 'Insya Allah, aku doakan kamu di Raudhah' },
    ],
    quiz: [
      { q: 'Apa arti "li-awwal marrah"?', options: ['Untuk pertama kali', 'Sekali saja', 'Kapan-kapan'], correctIdx: 0 },
      { q: 'Apa arti "ḥajj mabrūr"?', options: ['Haji bersama', 'Haji mabrur (diterima)', 'Haji sendirian'], correctIdx: 1 },
      { q: 'Cara bilang "aku doakan kamu"?', options: ['daʿawtu laka', 'atamannā laka', 'shukran laka'], correctIdx: 0 },
      { q: 'Apa arti "ar-rawḍah"?', options: ['Pasar', 'Raudhah di Masjid Nabawi', 'Hotel'], correctIdx: 1 },
    ],
  },
];

// ============================================================
// Helper functions
// ============================================================

/**
 * Cek apakah materi free atau premium.
 */
export function isMateriFree(materi) {
  return !!materi?.isFree;
}

/**
 * Cek apakah materi sudah unlocked untuk user ini.
 * - Free: selalu unlocked
 * - Premium: unlocked kalau bundle dibeli ATAU materi spesifik di array unlocked
 */
export function isMateriUnlocked(materi, userProfile) {
  if (isMateriFree(materi)) return true;
  // Launch phase: global flag — semua materi unlocked
  if (isPremiumUnlocked(userProfile?.perkenalanBundleUnlocked)) return true;
  const unlockedArr = userProfile?.unlockedPerkenalanMateri || [];
  return unlockedArr.includes(materi.id);
}

/**
 * Hitung jumlah materi premium yang belum dibuka.
 */
export function countLockedPremiumMateri(userProfile) {
  if (userProfile?.perkenalanBundleUnlocked) return 0;
  const unlockedArr = userProfile?.unlockedPerkenalanMateri || [];
  return PERKENALAN_MATERI.filter(
    (m) => !m.isFree && !unlockedArr.includes(m.id)
  ).length;
}
