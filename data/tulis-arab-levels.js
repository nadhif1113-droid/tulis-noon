// data/tulis-arab-levels.js
// Game "Tulis Arab" — 5 phase × 3 level = 15 level total.
// Phase 1 (Mengenal Huruf): Lv 1-3 FREE, fully seeded.
// Phase 2-5 (Cara Baca, Menulis Kata, Menulis Kalimat, Menulis Paragraf): PREMIUM (locked).

/**
 * Distractor pool — huruf hijaiyah lengkap untuk random pick distractors.
 * Dipakai kalau level item ga punya custom distractors.
 */
const HIJAIYAH_ALL = ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'];

/**
 * Helper: bikin placeholder level untuk Phase 2-5 yang masih coming soon.
 */
function placeholderLevel(level, title, blurb) {
  return {
    level,
    title,
    description: blurb,
    mode: 'tap-letter',
    xpReward: 100 + (level - 4) * 10,
    comingSoon: true,
    items: [],
  };
}

export const TULIS_ARAB_PHASES = [
  // ===================================================================
  // PHASE 1 — MENGENAL HURUF (FREE)
  // ===================================================================
  {
    id: 'mengenal-huruf',
    number: 1,
    title: 'Mengenal Huruf',
    description: 'Kenalan dengan 28 huruf hijaiyah dari nol. Tap huruf yang sesuai bunyinya — gampang.',
    emoji: '📖',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    isFree: true,
    levels: [
      {
        level: 1,
        title: 'Huruf Hijaiyah Dasar',
        description: 'Mulai dari yang paling sering muncul: alif, ba, ta, mim, dst. Tap huruf yang sesuai.',
        mode: 'tap-letter',
        xpReward: 50,
        items: [
          { latin: 'alif', arabic: 'ا', distractors: ['ل', 'و', 'ي', 'ك', 'ر'] },
          { latin: 'ba',   arabic: 'ب', distractors: ['ت', 'ث', 'ن', 'ي', 'ج'] },
          { latin: 'ta',   arabic: 'ت', distractors: ['ث', 'ب', 'ن', 'ي', 'ك'] },
          { latin: 'jim',  arabic: 'ج', distractors: ['ح', 'خ', 'ع', 'غ', 'م'] },
          { latin: 'dal',  arabic: 'د', distractors: ['ذ', 'ر', 'ز', 'و', 'ل'] },
          { latin: 'ra',   arabic: 'ر', distractors: ['ز', 'و', 'د', 'ل', 'ا'] },
          { latin: 'sin',  arabic: 'س', distractors: ['ش', 'ص', 'ض', 'ث', 'ت'] },
          { latin: 'mim',  arabic: 'م', distractors: ['ن', 'ل', 'ك', 'ي', 'ه'] },
          { latin: 'nun',  arabic: 'ن', distractors: ['ت', 'ث', 'ب', 'ي', 'م'] },
          { latin: 'ya',   arabic: 'ي', distractors: ['ب', 'ت', 'ن', 'ل', 'ا'] },
        ],
      },
      {
        level: 2,
        title: 'Huruf Mirip',
        description: 'Bedain huruf yang gampang ketukar: ب ت ث, ج ح خ, د ذ, ر ز. Tap yang benar.',
        mode: 'tap-letter',
        xpReward: 75,
        items: [
          { latin: 'ba (1 titik bawah)',  arabic: 'ب', distractors: ['ت', 'ث', 'ن', 'ي'] },
          { latin: 'tsa (3 titik atas)',  arabic: 'ث', distractors: ['ب', 'ت', 'ن', 'ي'] },
          { latin: 'jim (titik bawah)',   arabic: 'ج', distractors: ['ح', 'خ', 'ع', 'غ'] },
          { latin: 'kha (titik atas)',    arabic: 'خ', distractors: ['ح', 'ج', 'ع', 'غ'] },
          { latin: 'dzal (pakai titik)',  arabic: 'ذ', distractors: ['د', 'ر', 'ز', 'و'] },
          { latin: 'za (pakai titik)',    arabic: 'ز', distractors: ['ر', 'د', 'ذ', 'و'] },
          { latin: 'shad (tebal)',        arabic: 'ص', distractors: ['ض', 'س', 'ش', 'ث'] },
          { latin: 'dhad (tebal + titik)', arabic: 'ض', distractors: ['ص', 'س', 'ش', 'ط'] },
          { latin: 'ain (tanpa titik)',   arabic: 'ع', distractors: ['غ', 'ح', 'ج', 'خ'] },
          { latin: 'ghain (pakai titik)', arabic: 'غ', distractors: ['ع', 'ح', 'ج', 'خ'] },
        ],
      },
      {
        level: 3,
        title: 'Harakat Dasar',
        description: 'Belajar baca tanda baca: fatha (a), kasra (i), dhamma (u), sukun (mati). Pas mau baca Quran ini wajib.',
        mode: 'tap-letter',
        xpReward: 100,
        items: [
          { latin: 'ba + fatha (ba)',   arabic: 'بَ', distractors: ['بِ', 'بُ', 'بْ', 'بّ'] },
          { latin: 'ba + kasra (bi)',   arabic: 'بِ', distractors: ['بَ', 'بُ', 'بْ', 'بّ'] },
          { latin: 'ba + dhamma (bu)',  arabic: 'بُ', distractors: ['بَ', 'بِ', 'بْ', 'بّ'] },
          { latin: 'ba + sukun (b mati)', arabic: 'بْ', distractors: ['بَ', 'بِ', 'بُ', 'بّ'] },
          { latin: 'ta + fatha (ta)',   arabic: 'تَ', distractors: ['تِ', 'تُ', 'تْ', 'بَ'] },
          { latin: 'mim + sukun (m mati)', arabic: 'مْ', distractors: ['مَ', 'مِ', 'مُ', 'مّ'] },
          { latin: 'lam + tasydid (ll)', arabic: 'لّ', distractors: ['لَ', 'لِ', 'لْ', 'لُ'] },
          { latin: 'nun + fatha (na)',  arabic: 'نَ', distractors: ['نِ', 'نُ', 'نْ', 'تَ'] },
          { latin: 'ra + dhamma (ru)',  arabic: 'رُ', distractors: ['رَ', 'رِ', 'رْ', 'زُ'] },
          { latin: 'sin + fatha (sa)',  arabic: 'سَ', distractors: ['سِ', 'سُ', 'سْ', 'شَ'] },
        ],
      },
    ],
  },

  // ===================================================================
  // PHASE 2 — CARA BACA
  // ===================================================================
  {
    id: 'cara-baca',
    number: 2,
    title: 'Cara Baca',
    description: 'Belajar baca suku kata, mad (panjang/pendek), tasydid (huruf ganda).',
    emoji: '🔊',
    color: '#c9a961',
    bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    isFree: true,
    levels: [
      {
        level: 4,
        title: 'Suku Kata Sederhana',
        description: 'Gabung huruf + harakat jadi suku kata: ba+ta = بَتَ.',
        mode: 'tap-letter',
        xpReward: 100,
        items: [
          { latin: 'ba + ta = bata',   arabic: 'بَتَ', distractors: ['بَتِ', 'بَتُ', 'بِتَ', 'بُتَ'] },
          { latin: 'ka + ti = kati',   arabic: 'كَتِ', distractors: ['كَتَ', 'كِتَ', 'كَتُ', 'كُتِ'] },
          { latin: 'ma + ra = mara',   arabic: 'مَرَ', distractors: ['مَرِ', 'مِرَ', 'مَرُ', 'مُرَ'] },
          { latin: 'ja + lasa = jalasa', arabic: 'جَلَسَ', distractors: ['جَلِسَ', 'جَلَسِ', 'جِلَسَ', 'جَلُسَ'] },
          { latin: 'na + zhara = nazhara', arabic: 'نَظَرَ', distractors: ['نَظِرَ', 'نَظَرِ', 'نِظَرَ', 'نُظَرَ'] },
          { latin: 'sa + mi\'a = sami\'a', arabic: 'سَمِعَ', distractors: ['سَمَعَ', 'سِمِعَ', 'سُمِعَ', 'سَمِعُ'] },
          { latin: 'qa + ra\'a = qara\'a', arabic: 'قَرَأَ', distractors: ['قَرِأَ', 'قِرَأَ', 'قُرَأَ', 'قَرَؤُ'] },
          { latin: 'da + khala = dakhala', arabic: 'دَخَلَ', distractors: ['دَخِلَ', 'دِخَلَ', 'دَخَلِ', 'دُخَلَ'] },
        ],
      },
      {
        level: 5,
        title: 'Bunyi Mad (Panjang)',
        description: 'Bedakan baca panjang (mad) vs pendek. قَا vs قَ.',
        mode: 'tap-letter',
        xpReward: 110,
        items: [
          { latin: 'qaa (panjang) — alif setelah qaf',  arabic: 'قَا', distractors: ['قَ', 'قِي', 'قُو', 'قَى'] },
          { latin: 'baa (panjang) — alif setelah ba',   arabic: 'بَا', distractors: ['بَ', 'بِي', 'بُو', 'بَى'] },
          { latin: 'kii (panjang) — ya setelah kasrah', arabic: 'كِي', distractors: ['كِ', 'كَا', 'كُو', 'كَي'] },
          { latin: 'muu (panjang) — waw setelah dhamma', arabic: 'مُو', distractors: ['مُ', 'مَا', 'مِي', 'مَو'] },
          { latin: 'saa (panjang)',                     arabic: 'سَا', distractors: ['سَ', 'سَى', 'سَو', 'سَي'] },
          { latin: 'fii (panjang)',                     arabic: 'فِي', distractors: ['فِ', 'فَا', 'فُو', 'فَي'] },
          { latin: 'nuu (panjang)',                     arabic: 'نُو', distractors: ['نُ', 'نَا', 'نِي', 'نَو'] },
          { latin: 'haa Allah (panjang)',               arabic: 'هَا', distractors: ['هَ', 'هِي', 'هُو', 'هَى'] },
        ],
      },
      {
        level: 6,
        title: 'Tasydid & Sukun',
        description: 'Huruf ganda (tasydid) dan huruf mati (sukun). Penting buat baca Quran.',
        mode: 'tap-letter',
        xpReward: 120,
        items: [
          { latin: 'lam tasydid (ll) — di Allah',       arabic: 'لّ', distractors: ['لَ', 'لِ', 'لْ', 'لُ'] },
          { latin: 'mim sukun (m mati)',                arabic: 'مْ', distractors: ['مَ', 'مِ', 'مُ', 'مّ'] },
          { latin: 'nun tasydid (nn)',                  arabic: 'نّ', distractors: ['نَ', 'نِ', 'نْ', 'نُ'] },
          { latin: 'ba sukun (b mati) — di "lab"',      arabic: 'بْ', distractors: ['بَ', 'بِ', 'بُ', 'بّ'] },
          { latin: 'dal tasydid (dd)',                  arabic: 'دّ', distractors: ['دَ', 'دِ', 'دْ', 'دُ'] },
          { latin: 'ra sukun (r mati)',                 arabic: 'رْ', distractors: ['رَ', 'رِ', 'رُ', 'رّ'] },
          { latin: 'syin tasydid (sysy)',               arabic: 'شّ', distractors: ['شَ', 'شِ', 'شْ', 'شُ'] },
          { latin: 'kaf sukun (k mati) — di "lak"',     arabic: 'كْ', distractors: ['كَ', 'كِ', 'كُ', 'كّ'] },
        ],
      },
    ],
  },

  // ===================================================================
  // PHASE 3 — MENULIS KATA (vocab building)
  // ===================================================================
  {
    id: 'menulis-kata',
    number: 3,
    title: 'Menulis Kata',
    description: 'Susun huruf jadi kata bermakna. Kata pendek, vocab pasar & umrah.',
    emoji: '✍️',
    color: '#a05536',
    bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
    isFree: true,
    levels: [
      {
        level: 7,
        title: 'Kata Sehari-hari (3 huruf)',
        description: 'Susun kata pendek: ذَهَبَ (pergi), قَرَأَ (membaca).',
        mode: 'tap-letter',
        xpReward: 130,
        items: [
          { latin: 'kataba (menulis)',  arabic: 'كَتَبَ', distractors: ['كَتَبُ', 'كَتِبَ', 'كَتَبِ', 'قَتَبَ'] },
          { latin: 'qara\'a (membaca)', arabic: 'قَرَأَ', distractors: ['قَرَءَ', 'قَرَئَ', 'كَرَأَ', 'قَرَؤُ'] },
          { latin: 'dzahaba (pergi)',   arabic: 'ذَهَبَ', distractors: ['زَهَبَ', 'ذَهِبَ', 'ذَهَبُ', 'دَهَبَ'] },
          { latin: 'akala (makan)',     arabic: 'أَكَلَ', distractors: ['أَكِلَ', 'إِكَلَ', 'أَكَلُ', 'عَكَلَ'] },
          { latin: 'syariba (minum)',   arabic: 'شَرِبَ', distractors: ['شَرَبَ', 'سَرِبَ', 'شِرِبَ', 'شَرِبُ'] },
          { latin: 'jalasa (duduk)',    arabic: 'جَلَسَ', distractors: ['جَلِسَ', 'جَلَسُ', 'حَلَسَ', 'جَلَسِ'] },
          { latin: 'nama (tidur)',      arabic: 'نَامَ', distractors: ['نَمَ', 'نَامُ', 'نِامَ', 'تَامَ'] },
          { latin: 'qama (berdiri)',    arabic: 'قَامَ', distractors: ['قَمَ', 'قَامُ', 'كَامَ', 'قَوْمَ'] },
        ],
      },
      {
        level: 8,
        title: 'Vocab Pasar & Belanja',
        description: 'Kosakata belanja: kurma (تَمْر), harga (سِعْر), beli (شِرَاء).',
        mode: 'tap-letter',
        xpReward: 140,
        items: [
          { latin: 'tamr (kurma)',         arabic: 'تَمْر',    distractors: ['ثَمْر', 'تَمَر', 'تَمْز', 'طَمْر'] },
          { latin: 'si\'r (harga)',         arabic: 'سِعْر',    distractors: ['شِعْر', 'سَعْر', 'صِعْر', 'سِغْر'] },
          { latin: 'syiraa\' (beli)',        arabic: 'شِرَاء',   distractors: ['سِرَاء', 'شَرَاء', 'شِرَا', 'شِرَاع'] },
          { latin: 'mahall (toko)',        arabic: 'مَحَلّ',   distractors: ['مَحَل', 'مَحَلَّة', 'مَهَلّ', 'مَخَلّ'] },
          { latin: 'fuluus (uang)',        arabic: 'فُلُوس',   distractors: ['فِلُوس', 'فَلُوس', 'فُلُوص', 'فُلَوس'] },
          { latin: 'rakhiis (murah)',      arabic: 'رَخِيص',   distractors: ['رَكِيص', 'رَخِيس', 'رَخِيث', 'رَكِيث'] },
          { latin: 'ghaali (mahal)',       arabic: 'غَالِي',   distractors: ['عَالِي', 'غَالِ', 'غَالَى', 'قَالِي'] },
          { latin: 'kam (berapa)',         arabic: 'كَمْ',     distractors: ['كَمَ', 'قَمْ', 'كِمْ', 'كُمْ'] },
        ],
      },
      {
        level: 9,
        title: 'Vocab Umrah & Ibadah',
        description: 'Kosakata ibadah: masjid (مَسْجِد), tawaf (طَوَاف), sa\'i (سَعْي).',
        mode: 'tap-letter',
        xpReward: 150,
        items: [
          { latin: 'masjid (masjid)',     arabic: 'مَسْجِد', distractors: ['مَسْجَد', 'مَسْكِد', 'مَشْجِد', 'مَصْجِد'] },
          { latin: 'thawaaf (tawaf)',     arabic: 'طَوَاف',  distractors: ['تَوَاف', 'ضَوَاف', 'طَوَاب', 'طَوَأف'] },
          { latin: 'sa\'y (sa\'i)',        arabic: 'سَعْي',   distractors: ['سَعَي', 'سَئْي', 'صَعْي', 'سَعْى'] },
          { latin: 'ka\'bah (Ka\'bah)',    arabic: 'كَعْبَة',  distractors: ['كَعْبَه', 'قَعْبَة', 'كَأْبَة', 'كَعْبُة'] },
          { latin: 'hajj (haji)',         arabic: 'حَجّ',    distractors: ['حَج', 'هَجّ', 'حَجِّ', 'خَجّ'] },
          { latin: 'umrah (umrah)',       arabic: 'عُمْرَة', distractors: ['عَمْرَة', 'عُمْرَه', 'أُمْرَة', 'غُمْرَة'] },
          { latin: 'ihram (ihram)',       arabic: 'إِحْرَام', distractors: ['أِحْرَام', 'إِحْرَم', 'إِخْرَام', 'إِحْرَاب'] },
          { latin: 'shalaah (shalat)',    arabic: 'صَلَاة',  distractors: ['ثَلَاة', 'سَلَاة', 'صَلَه', 'صَلَأة'] },
        ],
      },
    ],
  },

  // ===================================================================
  // PHASE 4 — MENULIS KALIMAT (full sentences)
  // ===================================================================
  {
    id: 'menulis-kalimat',
    number: 4,
    title: 'Menulis Kalimat',
    description: 'Susun kalimat utuh: pertanyaan, pernyataan, sapaan & doa.',
    emoji: '📝',
    color: '#7a3d2a',
    bgGradient: 'linear-gradient(135deg, #7a3d2a, #8b4a2a)',
    isFree: true,
    levels: [
      {
        level: 10,
        title: 'Kalimat Tanya',
        description: 'Bikin pertanyaan: "Berapa harganya?", "Di mana masjid?".',
        mode: 'tap-letter',
        xpReward: 160,
        items: [
          { latin: 'Berapa harganya?',     arabic: 'كَمْ سِعْرُهُ؟',          distractors: ['كَمْ سِعْرُهَا؟', 'كَمْ يَوْمُهُ؟', 'مَا سِعْرُهُ؟', 'أَيْنَ سِعْرُهُ؟'] },
          { latin: 'Di mana masjid?',      arabic: 'أَيْنَ الْمَسْجِد؟',       distractors: ['أَيْنَ الْمَدْرَسَة؟', 'كَيْفَ الْمَسْجِد؟', 'مَتَى الْمَسْجِد؟', 'مَنْ الْمَسْجِد؟'] },
          { latin: 'Siapa namamu?',        arabic: 'مَا اسْمُكَ؟',            distractors: ['مَنْ اسْمُكَ؟', 'أَيْنَ اسْمُكَ؟', 'كَيْفَ اسْمُكَ؟', 'مَا اسْمُكِ؟'] },
          { latin: 'Apa kabar?',           arabic: 'كَيْفَ حَالُكَ؟',          distractors: ['كَيْفَ حَالُهُ؟', 'كَيْفَ حَالُكِ؟', 'مَاذَا حَالُكَ؟', 'أَيْنَ حَالُكَ؟'] },
          { latin: 'Dari mana asalmu?',    arabic: 'مِنْ أَيْنَ أَنْتَ؟',       distractors: ['إِلَى أَيْنَ أَنْتَ؟', 'مِنْ أَيْنَ أَنْتِ؟', 'مَا أَيْنَ أَنْتَ؟', 'مِنْ مَتَى أَنْتَ؟'] },
          { latin: 'Jam berapa sekarang?', arabic: 'كَمْ السَّاعَة الْآن؟',   distractors: ['أَيْنَ السَّاعَة؟', 'كَيْفَ السَّاعَة؟', 'مَا السَّاعَة الْآن؟', 'مَتَى السَّاعَة؟'] },
        ],
      },
      {
        level: 11,
        title: 'Kalimat Pernyataan',
        description: 'Bikin pernyataan: "Saya mau ini", "Ini bagus".',
        mode: 'tap-letter',
        xpReward: 170,
        items: [
          { latin: 'Saya mau ini',         arabic: 'أُرِيدُ هَذَا',          distractors: ['أُرِيدُ هَذِهِ', 'أُرِيدُكَ هَذَا', 'أَنَا هَذَا', 'أَحَبُّ هَذَا'] },
          { latin: 'Ini bagus',            arabic: 'هَذَا جَيِّد',           distractors: ['هَذِهِ جَيِّد', 'هَذَا قَبِيح', 'هَذَا كَبِير', 'هَذَا جَدِيد'] },
          { latin: 'Saya tidak mengerti',  arabic: 'لَا أَفْهَم',            distractors: ['لَا أَعْرِف', 'لَا أُرِيد', 'لَا أَسْمَع', 'لَا أَحَبّ'] },
          { latin: 'Terima kasih banyak',  arabic: 'شُكْرًا جَزِيلًا',        distractors: ['شُكْرًا كَثِيرًا', 'عَفْوًا جَزِيلًا', 'مَرْحَبًا جَزِيلًا', 'شُكْرًا قَلِيلًا'] },
          { latin: 'Saya senang',          arabic: 'أَنَا سَعِيد',           distractors: ['أَنْتَ سَعِيد', 'أَنَا حَزِين', 'أَنَا تَعْبَان', 'أَنَا جَدِيد'] },
          { latin: 'Maafkan saya',         arabic: 'آسِف',                 distractors: ['شُكْرًا', 'عَفْوًا', 'مَرْحَبًا', 'سَلَام'] },
        ],
      },
      {
        level: 12,
        title: 'Sapaan & Doa Harian',
        description: 'Sapaan & doa: salam, alhamdulillah, doa makan.',
        mode: 'tap-letter',
        xpReward: 180,
        items: [
          { latin: 'Assalamu\'alaikum',          arabic: 'السَّلَامُ عَلَيْكُمْ',       distractors: ['السَّلَامُ عَلَيْكِ', 'السَّلَامُ عَلَيْنَا', 'سَلَامٌ عَلَيْكُم', 'السَّلَامُ مَعَكُمْ'] },
          { latin: 'Wa\'alaikumussalam',         arabic: 'وَعَلَيْكُمُ السَّلَام',      distractors: ['عَلَيْكُمُ السَّلَام', 'وَأَنْتُمْ سَلَام', 'وَالسَّلَامُ مَعَك', 'وَعَلَيْكِ السَّلَام'] },
          { latin: 'Bismillah',                  arabic: 'بِسْمِ اللَّه',              distractors: ['بِسْمِكَ اللَّه', 'بِاللَّه', 'بَسْمَلَ اللَّه', 'بِسْمِ الرَّحْمَن'] },
          { latin: 'Alhamdulillah',              arabic: 'الْحَمْدُ لِلَّه',           distractors: ['الْحَمْدُ مِنَ اللَّه', 'حَمْدُ لِلَّه', 'الْحَمْدُ عَلَى اللَّه', 'الْحَمْدُ بِلَّه'] },
          { latin: 'Insya Allah',                arabic: 'إِنْ شَاءَ اللَّه',          distractors: ['إِذَا شَاءَ اللَّه', 'لَوْ شَاءَ اللَّه', 'إِنْ يَشَأ اللَّه', 'مَا شَاءَ اللَّه'] },
          { latin: 'Masya Allah',                arabic: 'مَا شَاءَ اللَّه',           distractors: ['مِمَّا شَاءَ اللَّه', 'مَا أَرَادَ اللَّه', 'مَا فَعَلَ اللَّه', 'مَا قَالَ اللَّه'] },
        ],
      },
    ],
  },

  // ===================================================================
  // PHASE 5 — MENULIS PARAGRAF (short paragraphs)
  // ===================================================================
  {
    id: 'menulis-paragraf',
    number: 5,
    title: 'Menulis Paragraf',
    description: 'Final boss. Susun paragraf utuh: cerita, doa panjang, konversasi nyata.',
    emoji: '📜',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #2e8869)',
    isFree: true,
    levels: [
      {
        level: 13,
        title: 'Cerita Pendek (2-3 kalimat)',
        description: 'Tulis paragraf cerita aktivitas harian.',
        mode: 'tap-letter',
        xpReward: 200,
        items: [
          {
            latin: 'Saya pergi ke masjid pagi ini',
            arabic: 'ذَهَبْتُ إِلَى الْمَسْجِدِ هَذَا الصَّبَاح',
            distractors: ['ذَهَبَ إِلَى الْمَسْجِدِ هَذَا الصَّبَاح', 'ذَهَبْتُ مِنَ الْمَسْجِدِ هَذَا الصَّبَاح', 'ذَهَبْتِ إِلَى الْمَسْجِدِ هَذَا الصَّبَاح'],
          },
          {
            latin: 'Saya makan kurma dan minum air zamzam',
            arabic: 'أَكَلْتُ تَمْرًا وَشَرِبْتُ مَاءَ زَمْزَم',
            distractors: ['أَكَلَ تَمْرًا وَشَرِبَ مَاءَ زَمْزَم', 'أَكَلْتُ تَمْرَ وَشَرِبْتُ مَاءَ زَمْزَم', 'أَكَلْتِ تَمْرًا وَشَرِبْتِ مَاءَ زَمْزَم'],
          },
          {
            latin: 'Setelah shalat saya tilawah Al-Quran',
            arabic: 'بَعْدَ الصَّلَاةِ قَرَأْتُ الْقُرْآن',
            distractors: ['قَبْلَ الصَّلَاةِ قَرَأْتُ الْقُرْآن', 'بَعْدَ الصَّلَاةِ قَرَأَ الْقُرْآن', 'بَعْدَ الصَّلَاةِ قَرَأْتِ الْقُرْآن'],
          },
          {
            latin: 'Saya bertemu teman di Masjidil Haram',
            arabic: 'قَابَلْتُ صَدِيقِي فِي الْمَسْجِدِ الْحَرَام',
            distractors: ['قَابَلَ صَدِيقَهُ فِي الْمَسْجِدِ الْحَرَام', 'قَابَلْتُ صَدِيقَكَ فِي الْمَسْجِدِ الْحَرَام', 'قَابَلْتُ صَدِيقِي فِي الْمَسْجِدِ النَّبَوِي'],
          },
          {
            latin: 'Hari ini saya bahagia sekali',
            arabic: 'الْيَوْمَ أَنَا سَعِيدٌ جِدًّا',
            distractors: ['الْيَوْمَ أَنْتَ سَعِيدٌ جِدًّا', 'أَمْسِ أَنَا سَعِيدٌ جِدًّا', 'الْيَوْمَ أَنَا حَزِينٌ جِدًّا'],
          },
        ],
      },
      {
        level: 14,
        title: 'Doa Harian',
        description: 'Tulis doa harian: bangun tidur, makan, sebelum tidur.',
        mode: 'tap-letter',
        xpReward: 220,
        items: [
          {
            latin: 'Doa bangun tidur',
            arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا',
            distractors: ['الْحَمْدُ لِلَّهِ الَّذِي خَلَقَنَا', 'الْحَمْدُ لِلَّهِ الَّذِي رَزَقَنَا', 'الْحَمْدُ لِلَّهِ الَّذِي أَمَاتَنَا'],
          },
          {
            latin: 'Doa sebelum makan',
            arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم',
            distractors: ['بِاللَّهِ الرَّحْمَنِ الرَّحِيم', 'بِسْمِ اللَّهِ الْعَظِيم', 'بِسْمِ الرَّحْمَنِ الرَّحِيم'],
          },
          {
            latin: 'Doa setelah makan',
            arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا',
            distractors: ['الْحَمْدُ لِلَّهِ الَّذِي سَقَانَا', 'الْحَمْدُ لِلَّهِ الَّذِي خَلَقَنَا', 'الْحَمْدُ لِلَّهِ الَّذِي رَزَقَنَا'],
          },
          {
            latin: 'Doa sebelum tidur',
            arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
            distractors: ['بِاسْمِكَ اللَّهُمَّ أَنَامُ وَأَسْتَيْقِظ', 'بِاسْمِكَ يَا رَبِّ أَمُوتُ وَأَحْيَا', 'اللَّهُمَّ أَمُوتُ وَأَحْيَا'],
          },
          {
            latin: 'Doa keluar rumah',
            arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّه',
            distractors: ['بِسْمِ اللَّهِ اسْتَعَنْتُ عَلَى اللَّه', 'بِاللَّهِ تَوَكَّلْتُ عَلَيْه', 'بِسْمِ اللَّهِ تَوَكَّلْتُ بِاللَّه'],
          },
        ],
      },
      {
        level: 15,
        title: 'Konversasi Real (Final)',
        description: 'Final. Susun percakapan utuh di pasar/masjid/café.',
        mode: 'tap-letter',
        xpReward: 250,
        items: [
          {
            latin: 'Penjual: "Selamat datang, mau beli apa?"',
            arabic: 'مَرْحَبًا، مَاذَا تُرِيدُ أَنْ تَشْتَرِيَ؟',
            distractors: ['مَرْحَبًا، مَاذَا تُرِيدُ أَنْ تَأْكُلَ؟', 'أَهْلًا، مَاذَا تُرِيدُ أَنْ تَشْتَرِيَ؟', 'مَرْحَبًا، مَاذَا تُرِيدِينَ أَنْ تَشْتَرِي؟'],
          },
          {
            latin: 'Anda: "Saya mau 1 kilo kurma ajwa"',
            arabic: 'أُرِيدُ كِيلُو وَاحِد مِنْ تَمْرِ الْعَجْوَة',
            distractors: ['أُرِيدُ كِيلُو وَاحِد مِنْ تَمْرِ الْخَلَاص', 'أُرِيدُ كِيلُوَيْن مِنْ تَمْرِ الْعَجْوَة', 'أَحَبُّ كِيلُو وَاحِد مِنْ تَمْرِ الْعَجْوَة'],
          },
          {
            latin: 'Penjual: "Harganya 50 riyal, silakan"',
            arabic: 'سِعْرُهُ خَمْسُونَ رِيَالًا، تَفَضَّل',
            distractors: ['سِعْرُهَا خَمْسُونَ رِيَالًا، تَفَضَّل', 'سِعْرُهُ خَمْسُونَ دِينَارًا، تَفَضَّل', 'سِعْرُهُ سِتُّونَ رِيَالًا، تَفَضَّل'],
          },
          {
            latin: 'Anda: "Boleh kurang? 40 riyal saja"',
            arabic: 'مُمْكِن أَقَلّ؟ أَرْبَعُونَ رِيَالًا فَقَطْ',
            distractors: ['مُمْكِن أَكْثَر؟ أَرْبَعُونَ رِيَالًا فَقَطْ', 'مُمْكِن أَقَلّ؟ خَمْسُونَ رِيَالًا فَقَطْ', 'مُمْكِن أَقَلّ؟ ثَلَاثُونَ رِيَالًا فَقَطْ'],
          },
          {
            latin: 'Anda: "Terima kasih, semoga Allah memberkahimu"',
            arabic: 'شُكْرًا، بَارَكَ اللَّهُ فِيك',
            distractors: ['شُكْرًا، بَارَكَ اللَّهُ فِيكِ', 'عَفْوًا، بَارَكَ اللَّهُ فِيك', 'شُكْرًا، رَحِمَكَ اللَّه'],
          },
        ],
      },
    ],
  },
];

/**
 * Helper: get phase by id
 */
export function getTulisArabPhase(id) {
  return TULIS_ARAB_PHASES.find((p) => p.id === id);
}

/**
 * Helper: bikin grid pilihan untuk tap-letter mode.
 * Gabungin correct answer + 5 distractor, shuffle, return 6 opsi.
 */
export function buildLetterChoices(item) {
  const distractors = item.distractors || [];
  const choices = [item.arabic, ...distractors.slice(0, 5)];
  // Fisher-Yates shuffle
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices;
}
