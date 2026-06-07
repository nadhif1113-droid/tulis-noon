// data/learning-shorf.js
// Pelajaran Shorf (صرف) — morfologi bahasa Arab klasik.
// 6 pelajaran fondasi: 3 gratis + 3 Mahir.
// Struktur sama dgn learning-nahwu.js.

export const SHORF_LESSONS = [
  // ============ PELAJARAN 1 (FREE) ============
  {
    id: 'shorf-1-madhi-mudhori-amr',
    order: 1,
    isFree: true,
    title: 'Madhi, Mudhori\', Amr',
    subtitle: 'Tiga bentuk waktu Fi\'il',
    emoji: '⏰',
    duration: '6 menit',
    color: '#0a4d3c',
    xpReward: 25,
    theory: {
      intro: 'Setiap fi\'il dalam bahasa Arab punya 3 bentuk waktu: Madhi (lampau), Mudhori\' (sedang/akan datang), dan Amr (perintah). Memahami perubahan ketiganya adalah dasar semua tashrif (perubahan bentuk kata) di shorf.',
      sections: [
        {
          title: 'Fi\'il Madhi (الْمَاضِي) — Lampau',
          body: 'Menunjukkan perbuatan yang sudah lewat. Biasanya berakhiran fathah. Tidak punya huruf mudhoro\'ah di depan.',
          examples: [
            { ar: 'كَتَبَ', latin: 'kataba', id: 'dia telah menulis' },
            { ar: 'قَرَأَ', latin: 'qara\'a', id: 'dia telah membaca' },
            { ar: 'ذَهَبَ', latin: 'dzahaba', id: 'dia telah pergi' },
          ],
        },
        {
          title: 'Fi\'il Mudhori\' (الْمُضَارِعُ) — Sedang/Akan',
          body: 'Menunjukkan perbuatan yang sedang atau akan terjadi. Selalu diawali salah satu huruf mudhoro\'ah: أ، ن، ي، ت (singkatan: أَنَيْتُ).',
          examples: [
            { ar: 'يَكْتُبُ', latin: 'yaktubu', id: 'dia (lk) sedang/akan menulis' },
            { ar: 'تَكْتُبُ', latin: 'taktubu', id: 'dia (pr) / kamu (lk) menulis' },
            { ar: 'أَكْتُبُ', latin: 'aktubu', id: 'aku menulis' },
            { ar: 'نَكْتُبُ', latin: 'naktubu', id: 'kami menulis' },
          ],
        },
        {
          title: 'Fi\'il Amr (الْأَمْرُ) — Perintah',
          body: 'Menunjukkan perintah. Dibuat dari fi\'il mudhori\' dgn cara: buang huruf mudhoro\'ah, tambah hamzah washol di depan kalau perlu, dan akhirnya jadi sukun.',
          examples: [
            { ar: 'اُكْتُبْ', latin: 'uktub', id: 'tulislah! (lk)' },
            { ar: 'اِقْرَأْ', latin: 'iqra\'', id: 'bacalah!' },
            { ar: 'اِذْهَبْ', latin: 'idzhab', id: 'pergilah!' },
          ],
        },
      ],
      quranExample: {
        ayat: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
        latin: 'iqra\' bismi rabbikal-ladzii khalaq',
        surah: 'Al-\'Alaq',
        ayatNum: 1,
        analysis: [
          { word: 'اقْرَأْ', type: 'Fi\'il Amr', note: 'perintah: "bacalah!"' },
          { word: 'بِ', type: 'Harf jar', note: 'dengan' },
          { word: 'اسْمِ', type: 'Majrur', note: 'mudhof, majrur dgn kasroh' },
          { word: 'رَبِّ', type: 'Mudhof ilaih', note: 'majrur, mudhof juga' },
          { word: 'الَّذِي خَلَقَ', type: 'Na\'at', note: 'na\'at; خَلَقَ = fi\'il madhi' },
        ],
        explanation: 'Ayat pertama yang turun ke Nabi Muhammad ﷺ: "Bacalah!" — اقْرَأْ adalah fi\'il amr (perintah). Lihat juga خَلَقَ di akhir — itu fi\'il madhi.',
      },
    },
    quiz: [
      {
        q: 'يَذْهَبُ termasuk fi\'il jenis apa?',
        options: ['Madhi', 'Mudhori\'', 'Amr', 'Mashdar'],
        correct: 1,
        explanation: 'يَذْهَبُ diawali huruf ي (mudhoro\'ah) — itu ciri fi\'il Mudhori\'.',
      },
      {
        q: 'Huruf-huruf Mudhoro\'ah disingkat dengan...',
        options: ['أَكْتُبُ', 'أَنَيْتُ', 'يَفْعَلُ', 'كَتَبَ'],
        correct: 1,
        explanation: 'Huruf Mudhoro\'ah ada 4: أ، ن، ي، ت — disingkat "أَنَيْتُ".',
      },
      {
        q: 'Bentuk amr dari يَكْتُبُ adalah...',
        options: ['كَتَبَ', 'اُكْتُبْ', 'يَكْتُبُ', 'كَاتِبٌ'],
        correct: 1,
        explanation: 'اُكْتُبْ — dibuat dari mudhori\' يَكْتُبُ dgn membuang ي, ganti hamzah washol, akhir jadi sukun.',
      },
      {
        q: 'كَتَبْتُ artinya...',
        options: ['Dia menulis', 'Aku telah menulis', 'Kamu menulis', 'Tulislah!'],
        correct: 1,
        explanation: 'كَتَبْتُ = madhi + dhomir تُ (aku). Artinya: "Aku telah menulis".',
      },
    ],
  },

  // ============ PELAJARAN 2 (FREE) ============
  {
    id: 'shorf-2-tashrif-lughowi',
    order: 2,
    isFree: true,
    title: 'Tashrif Lughowi',
    subtitle: 'Perubahan menurut pelaku',
    emoji: '👥',
    duration: '7 menit',
    color: '#0a4d3c',
    xpReward: 30,
    theory: {
      intro: 'Tashrif Lughowi adalah perubahan bentuk fi\'il sesuai dgn pelaku (dhomir). Satu fi\'il bisa berubah ke 14 bentuk berbeda. Ini fondasi paling penting untuk baca dan mengarang dalam bahasa Arab.',
      sections: [
        {
          title: 'Tashrif Lughowi Fi\'il Madhi — كَتَبَ',
          body: 'Mari kita lihat perubahan fi\'il madhi كَتَبَ (telah menulis) untuk semua orang. 14 bentuk total.',
          examples: [
            { ar: 'كَتَبَ', latin: 'kataba', id: 'dia (lk) — هُوَ' },
            { ar: 'كَتَبَا', latin: 'katabaa', id: 'mereka berdua (lk) — هُمَا' },
            { ar: 'كَتَبُوا', latin: 'katabuu', id: 'mereka (lk, jamak) — هُمْ' },
            { ar: 'كَتَبَتْ', latin: 'katabat', id: 'dia (pr) — هِيَ' },
            { ar: 'كَتَبَتَا', latin: 'katabataa', id: 'mereka berdua (pr) — هُمَا' },
            { ar: 'كَتَبْنَ', latin: 'katabna', id: 'mereka (pr, jamak) — هُنَّ' },
          ],
        },
        {
          title: 'Untuk Mukhotob (lawan bicara)',
          body: 'Lanjutan tashrif untuk lawan bicara (kamu).',
          examples: [
            { ar: 'كَتَبْتَ', latin: 'katabta', id: 'kamu (lk) — أَنْتَ' },
            { ar: 'كَتَبْتُمَا', latin: 'katabtumaa', id: 'kalian berdua — أَنْتُمَا' },
            { ar: 'كَتَبْتُمْ', latin: 'katabtum', id: 'kalian (lk, jamak) — أَنْتُمْ' },
            { ar: 'كَتَبْتِ', latin: 'katabti', id: 'kamu (pr) — أَنْتِ' },
            { ar: 'كَتَبْتُنَّ', latin: 'katabtunna', id: 'kalian (pr, jamak) — أَنْتُنَّ' },
          ],
        },
        {
          title: 'Untuk Mutakallim (pembicara)',
          body: 'Tashrif untuk pembicara — paling sering dipakai sehari-hari.',
          examples: [
            { ar: 'كَتَبْتُ', latin: 'katabtu', id: 'aku — أَنَا' },
            { ar: 'كَتَبْنَا', latin: 'katabnaa', id: 'kami — نَحْنُ' },
          ],
        },
      ],
      quranExample: {
        ayat: 'إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
        latin: 'innaa anzalnaahu fii lailatil-qadr',
        surah: 'Al-Qadr',
        ayatNum: 1,
        analysis: [
          { word: 'إِنَّا', type: 'إِنَّ + dhomir', note: 'sungguh kami' },
          { word: 'أَنْزَلْنَا', type: 'Fi\'il Madhi', note: 'kami telah turunkan; نَا = dhomir mutakallim jamak' },
          { word: 'هُ', type: 'Dhomir muttashil', note: 'maf\'ul bih; "nya" (Al-Qur\'an)' },
          { word: 'فِي', type: 'Harf jar', note: 'di dalam' },
          { word: 'لَيْلَةِ', type: 'Majrur', note: 'mudhof; majrur dgn kasroh' },
          { word: 'الْقَدْرِ', type: 'Mudhof ilaih', note: 'majrur' },
        ],
        explanation: 'أَنْزَلْنَا = أَنْزَلَ + نَا. نَا adalah dhomir mutakallim jamak (kami). Inilah contoh tashrif lughowi madhi di Al-Qur\'an: "Sungguh KAMI telah menurunkannya".',
      },
    },
    quiz: [
      {
        q: 'كَتَبَتْ artinya...',
        options: ['Aku menulis', 'Dia (pr) menulis', 'Mereka menulis', 'Tulislah'],
        correct: 1,
        explanation: 'كَتَبَتْ = madhi + ت = "Dia perempuan telah menulis".',
      },
      {
        q: 'Dhomir untuk "kami" disambungkan dgn fi\'il madhi jadi...',
        options: ['تُ', 'نَا', 'تُمْ', 'وْا'],
        correct: 1,
        explanation: 'نَا adalah dhomir mutakallim jamak. كَتَبْنَا = "kami telah menulis".',
      },
      {
        q: 'كَتَبْتُمْ artinya...',
        options: ['Mereka menulis', 'Kalian (lk) telah menulis', 'Kami menulis', 'Aku menulis'],
        correct: 1,
        explanation: 'تُمْ = dhomir mukhotob jamak mudzakkar. كَتَبْتُمْ = "kalian (lk) telah menulis".',
      },
      {
        q: 'Total bentuk dalam tashrif lughowi fi\'il madhi ada...',
        options: ['7', '10', '12', '14'],
        correct: 3,
        explanation: '14 bentuk: 6 ghoib (dia/mereka) + 6 mukhotob (kamu/kalian) + 2 mutakallim (aku/kami).',
      },
    ],
  },

  // ============ PELAJARAN 3 (FREE) ============
  {
    id: 'shorf-3-wazan-dasar',
    order: 3,
    isFree: true,
    title: 'Wazan Dasar',
    subtitle: 'Pola fi\'il tsulatsi mujarrad',
    emoji: '⚖️',
    duration: '7 menit',
    color: '#0a4d3c',
    xpReward: 30,
    theory: {
      intro: 'Wazan (وَزْنٌ) adalah pola atau timbangan kata. Bahasa Arab punya pola tetap untuk setiap kata kerja 3 huruf (tsulatsi mujarrad). Ada 6 wazan utama — dilihat dari harakat \'ain fi\'il di madhi dan mudhori\'.',
      sections: [
        {
          title: 'Wazan 1: فَعَلَ - يَفْعُلُ',
          body: '\'Ain fi\'il madhi fathah, mudhori\' dhommah. Wazan ini sering dipakai.',
          examples: [
            { ar: 'كَتَبَ - يَكْتُبُ', latin: 'kataba - yaktubu', id: 'menulis' },
            { ar: 'نَصَرَ - يَنْصُرُ', latin: 'nashara - yanshuru', id: 'menolong' },
          ],
        },
        {
          title: 'Wazan 2: فَعَلَ - يَفْعِلُ',
          body: '\'Ain fi\'il madhi fathah, mudhori\' kasroh.',
          examples: [
            { ar: 'جَلَسَ - يَجْلِسُ', latin: 'jalasa - yajlisu', id: 'duduk' },
            { ar: 'ضَرَبَ - يَضْرِبُ', latin: 'dharaba - yadhribu', id: 'memukul' },
          ],
        },
        {
          title: 'Wazan 3: فَعَلَ - يَفْعَلُ',
          body: '\'Ain fi\'il madhi fathah, mudhori\' fathah. Biasanya \'ain atau lam fi\'il-nya huruf halq (ا، ه، ع، ح، غ، خ).',
          examples: [
            { ar: 'فَتَحَ - يَفْتَحُ', latin: 'fataha - yaftahu', id: 'membuka' },
            { ar: 'ذَهَبَ - يَذْهَبُ', latin: 'dzahaba - yadzhabu', id: 'pergi' },
          ],
        },
        {
          title: 'Wazan 4-6',
          body: 'فَعِلَ - يَفْعَلُ (mengetahui), فَعِلَ - يَفْعِلُ (mewarisi), فَعُلَ - يَفْعُلُ (mulia). Pelajari dari kamus — karena tidak ada aturan baku.',
          examples: [
            { ar: 'عَلِمَ - يَعْلَمُ', latin: '\'alima - ya\'lamu', id: 'mengetahui' },
            { ar: 'حَسُنَ - يَحْسُنُ', latin: 'hasuna - yahsunu', id: 'menjadi baik' },
          ],
        },
      ],
      quranExample: {
        ayat: 'الَّذِي عَلَّمَ بِالْقَلَمِ',
        latin: 'al-ladzii \'allama bil-qalami',
        surah: 'Al-\'Alaq',
        ayatNum: 4,
        analysis: [
          { word: 'الَّذِي', type: 'Isim maushul', note: 'na\'at' },
          { word: 'عَلَّمَ', type: 'Fi\'il Madhi', note: 'mengajarkan; wazan فَعَّلَ (ruba\'i)' },
          { word: 'بِ', type: 'Harf jar', note: 'dengan' },
          { word: 'الْقَلَمِ', type: 'Majrur', note: 'pena, alat menulis' },
        ],
        explanation: 'عَلَّمَ (mengajarkan) berasal dari عَلِمَ (mengetahui — wazan فَعِلَ). Saat ditambah huruf jadi عَلَّمَ — itu wazan turunan فَعَّلَ artinya "menjadikan tahu" / mengajarkan.',
      },
    },
    quiz: [
      {
        q: 'كَتَبَ - يَكْتُبُ termasuk wazan...',
        options: ['فَعَلَ - يَفْعُلُ', 'فَعَلَ - يَفْعِلُ', 'فَعِلَ - يَفْعَلُ', 'فَعُلَ - يَفْعُلُ'],
        correct: 0,
        explanation: 'كَتَبَ \'ain-nya fathah, يَكْتُبُ \'ain-nya dhommah — wazan فَعَلَ - يَفْعُلُ.',
      },
      {
        q: 'Mudhori\' dari عَلِمَ adalah...',
        options: ['يَعْلِمُ', 'يَعْلُمُ', 'يَعْلَمُ', 'يَعَلَمُ'],
        correct: 2,
        explanation: 'عَلِمَ (madhi: \'ain kasroh) → يَعْلَمُ (mudhori\': \'ain fathah). Wazan فَعِلَ - يَفْعَلُ.',
      },
      {
        q: 'Untuk tahu wazan suatu fi\'il, yang dilihat adalah...',
        options: ['Awal fi\'il', 'Harakat \'ain fi\'il di madhi dan mudhori\'', 'Akhir fi\'il', 'Mashdar-nya'],
        correct: 1,
        explanation: 'Wazan ditentukan dari harakat \'ain fi\'il (huruf kedua) di madhi dan mudhori\'.',
      },
      {
        q: 'فَتَحَ - يَفْتَحُ termasuk wazan dgn \'ain mudhori\'...',
        options: ['Dhommah', 'Fathah', 'Kasroh', 'Sukun'],
        correct: 1,
        explanation: 'يَفْتَحُ \'ain-nya fathah (تَ). Wazan فَعَلَ - يَفْعَلُ — biasanya karena ada huruf halq.',
      },
    ],
  },

  // ============ PELAJARAN 4 (PREMIUM) ============
  {
    id: 'shorf-4-isim-fail-maful',
    order: 4,
    isFree: false,
    title: 'Isim Fa\'il & Isim Maf\'ul',
    subtitle: 'Pelaku & yang dikenai perbuatan',
    emoji: '🔄',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Dari setiap fi\'il bisa dibentuk Isim Fa\'il (pelaku) dan Isim Maf\'ul (yang dikenai perbuatan). Keduanya kata sifat yang sangat sering muncul di Qur\'an dan kitab.',
      sections: [
        {
          title: 'Isim Fa\'il (اسْمُ الْفَاعِلِ)',
          body: 'Menunjukkan pelaku. Pola dari tsulatsi mujarrad: فَاعِلٌ.',
          examples: [
            { ar: 'كَاتِبٌ', latin: 'kaatib', id: 'penulis (dari كَتَبَ)' },
            { ar: 'قَارِئٌ', latin: 'qaari\'', id: 'pembaca (dari قَرَأَ)' },
            { ar: 'ذَاهِبٌ', latin: 'dzaahib', id: 'yang pergi (dari ذَهَبَ)' },
          ],
        },
        {
          title: 'Isim Maf\'ul (اسْمُ الْمَفْعُولِ)',
          body: 'Menunjukkan yang dikenai perbuatan. Pola dari tsulatsi mujarrad: مَفْعُولٌ.',
          examples: [
            { ar: 'مَكْتُوبٌ', latin: 'maktuub', id: 'yang ditulis' },
            { ar: 'مَقْرُوءٌ', latin: 'maqruu\'', id: 'yang dibaca' },
            { ar: 'مَفْتُوحٌ', latin: 'maftuuh', id: 'yang dibuka' },
          ],
        },
        {
          title: 'Perbedaan kunci',
          body: 'Isim fa\'il = pelaku (yang melakukan). Isim maf\'ul = yang dikenai. كَاتِبٌ = penulis, مَكْتُوبٌ = (sesuatu) yang ditulis.',
          examples: [
            { ar: 'الْكَاتِبُ مَاهِرٌ', latin: 'al-kaatibu maahir', id: 'penulis itu ahli' },
            { ar: 'الْكِتَابُ مَكْتُوبٌ بِالْعَرَبِيَّةِ', latin: 'al-kitaabu maktuubun bil-\'arabiyyah', id: 'buku itu ditulis dgn bahasa Arab' },
          ],
        },
      ],
      quranExample: {
        ayat: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ',
        latin: 'yaa ayyuhal-ladziina aamanut-taqullah',
        surah: 'Al-Hujurat',
        ayatNum: 1,
        analysis: [
          { word: 'يَا أَيُّهَا', type: 'Nida\'', note: 'panggilan: "wahai"' },
          { word: 'الَّذِينَ', type: 'Isim maushul', note: 'orang-orang yang' },
          { word: 'آمَنُوا', type: 'Fi\'il Madhi', note: 'jamak: "mereka beriman"' },
          { word: 'اتَّقُوا', type: 'Fi\'il Amr', note: '"bertakwalah" — bentuk jamak' },
          { word: 'اللَّهَ', type: 'Maf\'ul bih', note: 'mansub' },
        ],
        explanation: 'Frasa الْمُؤْمِنُونَ (orang-orang beriman) adalah ISIM FA\'IL dari آمَنَ (beriman). Polanya: مُفْعِلُونَ (jamak dari مُؤْمِنٌ).',
      },
    },
    quiz: [
      {
        q: 'Isim fa\'il dari ضَرَبَ adalah...',
        options: ['ضَرْبٌ', 'ضَارِبٌ', 'مَضْرُوبٌ', 'يَضْرِبُ'],
        correct: 1,
        explanation: 'Isim fa\'il dari tsulatsi pola فَاعِلٌ. ضَرَبَ → ضَارِبٌ (pemukul).',
      },
      {
        q: 'مَفْتُوحٌ artinya...',
        options: ['Yang membuka', 'Pembuka', 'Yang dibuka', 'Akan dibuka'],
        correct: 2,
        explanation: 'مَفْتُوحٌ adalah isim maf\'ul dari فَتَحَ — artinya "yang dibuka".',
      },
      {
        q: 'كَاتِبٌ dan مَكْتُوبٌ keduanya dari...',
        options: ['Fi\'il berbeda', 'Fi\'il yang sama: كَتَبَ', 'Mashdar', 'Wazan berbeda'],
        correct: 1,
        explanation: 'Keduanya dari satu akar كَتَبَ. كَاتِبٌ = penulis (fa\'il), مَكْتُوبٌ = yang ditulis (maf\'ul).',
      },
      {
        q: 'Pola isim maf\'ul untuk tsulatsi mujarrad adalah...',
        options: ['فَاعِلٌ', 'مَفْعُولٌ', 'فَعَلٌ', 'مَفْعَلٌ'],
        correct: 1,
        explanation: 'مَفْعُولٌ — pola standar isim maf\'ul dari fi\'il 3 huruf.',
      },
    ],
  },

  // ============ PELAJARAN 5 (PREMIUM) ============
  {
    id: 'shorf-5-mashdar',
    order: 5,
    isFree: false,
    title: 'Mashdar',
    subtitle: 'Kata dasar / kata benda dari fi\'il',
    emoji: '🌱',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 30,
    theory: {
      intro: 'Mashdar (الْمَصْدَرُ) adalah kata dasar — kata benda yang menunjukkan makna perbuatan tanpa terkait waktu. Setiap fi\'il punya mashdar. Mashdar tsulatsi mujarrad tidak ada pola tetap — harus dihafal dari kamus.',
      sections: [
        {
          title: 'Contoh Mashdar Umum',
          body: 'Mashdar dari fi\'il 3 huruf bervariasi polanya.',
          examples: [
            { ar: 'كَتَبَ → كِتَابَةً', latin: 'kataba → kitaabatan', id: 'menulis → penulisan/tulisan' },
            { ar: 'قَرَأَ → قِرَاءَةً', latin: 'qara\'a → qiraa\'atan', id: 'membaca → bacaan' },
            { ar: 'عَلِمَ → عِلْمًا', latin: '\'alima → \'ilman', id: 'mengetahui → ilmu' },
            { ar: 'فَتَحَ → فَتْحًا', latin: 'fataha → fathan', id: 'membuka → pembukaan' },
          ],
        },
        {
          title: 'Mashdar Fi\'il Ruba\'i (4 huruf)',
          body: 'Untuk fi\'il 4 huruf (mazid), mashdar-nya punya pola yang lebih teratur.',
          examples: [
            { ar: 'أَنْزَلَ → إِنْزَالًا', latin: 'anzala → inzaalan', id: 'menurunkan → penurunan' },
            { ar: 'عَلَّمَ → تَعْلِيمًا', latin: '\'allama → ta\'liiman', id: 'mengajarkan → pengajaran' },
            { ar: 'سَلَّمَ → تَسْلِيمًا', latin: 'sallama → tasliiman', id: 'menyerahkan → penyerahan' },
          ],
        },
        {
          title: 'Fungsi Mashdar',
          body: 'Mashdar sering dipakai sbg subjek/objek dalam kalimat, atau sebagai maf\'ul mutlaq (penekanan dari fi\'il).',
          examples: [
            { ar: 'الْعِلْمُ نُورٌ', latin: 'al-\'ilmu nuur', id: 'Ilmu adalah cahaya (\'ilm = mashdar sbg mubtada\')' },
            { ar: 'سَلَّمَ تَسْلِيمًا', latin: 'sallama tasliiman', id: 'menyerahkan diri dgn benar-benar (maf\'ul mutlaq)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'وَسَلِّمُوا تَسْلِيمًا',
        latin: 'wa sallimuu tasliimaa',
        surah: 'Al-Ahzab',
        ayatNum: 56,
        analysis: [
          { word: 'وَ', type: 'Harf athaf', note: '' },
          { word: 'سَلِّمُوا', type: 'Fi\'il Amr', note: 'jamak: "ucapkan salam" (kpd Nabi)' },
          { word: 'تَسْلِيمًا', type: 'Maf\'ul Mutlaq', note: 'mashdar dari سَلَّمَ; mansub' },
        ],
        explanation: 'تَسْلِيمًا adalah mashdar dari سَلَّمَ. Di sini berfungsi sbg MAF\'UL MUTLAQ — penekanan: "berilah salam dgn sungguh-sungguh / dgn sebenar-benar penghormatan".',
      },
    },
    quiz: [
      {
        q: 'Mashdar dari عَلِمَ adalah...',
        options: ['عَالِمٌ', 'مَعْلُومٌ', 'عِلْمٌ', 'يَعْلَمُ'],
        correct: 2,
        explanation: 'عِلْمٌ (ilmu) adalah mashdar dari عَلِمَ.',
      },
      {
        q: 'Apa beda mashdar dgn fi\'il?',
        options: ['Mashdar terikat waktu', 'Mashdar = kata kerja', 'Mashdar = kata benda tanpa terikat waktu', 'Tidak ada beda'],
        correct: 2,
        explanation: 'Mashdar adalah ISIM yang menunjukkan makna perbuatan TANPA terikat waktu. Fi\'il selalu terikat waktu (madhi/mudhori\'/amr).',
      },
      {
        q: 'تَسْلِيمًا di ayat di atas adalah mashdar dari...',
        options: ['سَلِمَ', 'سَلَّمَ', 'سَالَمَ', 'تَسَلَّمَ'],
        correct: 1,
        explanation: 'تَسْلِيم adalah mashdar dari سَلَّمَ (wazan فَعَّلَ → mashdar تَفْعِيلٌ).',
      },
      {
        q: 'Mashdar tsulatsi mujarrad polanya...',
        options: ['Selalu فِعَالَةً', 'Selalu فَعْلٌ', 'Tidak baku — harus dihafal', 'Selalu فُعُولٌ'],
        correct: 2,
        explanation: 'Tsulatsi mujarrad tidak punya pola mashdar yang baku — harus dihafal dari kamus.',
      },
    ],
  },

  // ============ PELAJARAN 6 (PREMIUM) ============
  {
    id: 'shorf-6-praktek-tasrif',
    order: 6,
    isFree: false,
    title: 'Praktek Tasrif',
    subtitle: 'Latihan tashrif kata-kata Qur\'ani',
    emoji: '🎓',
    duration: '8 menit',
    color: '#a05536',
    xpReward: 50,
    theory: {
      intro: 'Mari gabungkan semua pelajaran shorf dgn melatih tashrif kata-kata yang sering muncul di Al-Qur\'an. Tujuan: kamu bisa kenali bentuk apa pun dari satu akar kata.',
      sections: [
        {
          title: 'Akar كَتَبَ — Penulisan',
          body: 'Dari satu akar كَتَبَ kita bisa derivasi banyak kata.',
          examples: [
            { ar: 'كَتَبَ', latin: 'kataba', id: 'fi\'il madhi: telah menulis' },
            { ar: 'يَكْتُبُ', latin: 'yaktubu', id: 'fi\'il mudhori\': sedang menulis' },
            { ar: 'اُكْتُبْ', latin: 'uktub', id: 'fi\'il amr: tulislah' },
            { ar: 'كَاتِبٌ', latin: 'kaatib', id: 'isim fa\'il: penulis' },
            { ar: 'مَكْتُوبٌ', latin: 'maktuub', id: 'isim maf\'ul: yang ditulis' },
            { ar: 'كِتَابَةٌ', latin: 'kitaabah', id: 'mashdar: penulisan' },
            { ar: 'كِتَابٌ', latin: 'kitaab', id: 'isim: buku (dari akar yg sama)' },
          ],
        },
        {
          title: 'Akar عَلِمَ — Ilmu',
          body: 'Akar lain yang sangat sering di Al-Qur\'an.',
          examples: [
            { ar: 'عَلِمَ', latin: '\'alima', id: 'fi\'il madhi: mengetahui' },
            { ar: 'يَعْلَمُ', latin: 'ya\'lamu', id: 'mudhori\': sedang tahu' },
            { ar: 'عَالِمٌ', latin: '\'aalim', id: 'isim fa\'il: yang berilmu' },
            { ar: 'مَعْلُومٌ', latin: 'ma\'luum', id: 'isim maf\'ul: yang diketahui' },
            { ar: 'عِلْمٌ', latin: '\'ilm', id: 'mashdar: ilmu' },
            { ar: 'عَلَّمَ', latin: '\'allama', id: 'wazan فَعَّلَ: mengajarkan' },
            { ar: 'مُعَلِّمٌ', latin: 'mu\'allim', id: 'isim fa\'il dari عَلَّمَ: guru' },
          ],
        },
        {
          title: 'Tips Praktek',
          body: 'Ambil 1 akar 3 huruf — coba tashrif sendiri ke madhi, mudhori\', amr, isim fa\'il, isim maf\'ul, mashdar. Itu cara terbaik nempel. Akar yang baik dilatih: قَرَأَ، ذَهَبَ، فَهِمَ، شَرِبَ، عَمِلَ.',
          examples: [],
        },
      ],
      quranExample: {
        ayat: 'الرَّحْمَنُ عَلَّمَ الْقُرْآنَ',
        latin: 'ar-Rahmaanu \'allamal-Qur\'aan',
        surah: 'Ar-Rahman',
        ayatNum: 1,
        analysis: [
          { word: 'الرَّحْمَنُ', type: 'Mubtada\'', note: 'rofa\' dgn dhommah' },
          { word: 'عَلَّمَ', type: 'Fi\'il Madhi', note: 'wazan فَعَّلَ; mengajarkan; jadi khobar dlm jumlah fi\'liyyah' },
          { word: 'الْقُرْآنَ', type: 'Maf\'ul bih', note: 'mansub dgn fathah' },
        ],
        explanation: 'عَلَّمَ (mengajarkan) dari akar عَلِمَ + tambah huruf jadi wazan فَعَّلَ. Bedanya: عَلِمَ = "mengetahui", عَلَّمَ = "mengajarkan" (membuat orang lain tahu). Inilah kekuatan shorf — satu akar, banyak makna.',
      },
    },
    quiz: [
      {
        q: 'Dari akar فَهِمَ, isim fa\'il-nya adalah...',
        options: ['مَفْهُومٌ', 'فَاهِمٌ', 'فَهْمٌ', 'يَفْهَمُ'],
        correct: 1,
        explanation: 'Pola isim fa\'il فَاعِلٌ. فَهِمَ → فَاهِمٌ (yang paham).',
      },
      {
        q: 'مُعَلِّمٌ dan عَالِمٌ keduanya isim fa\'il, tapi dari fi\'il yang...',
        options: ['Sama', 'Akar sama tapi wazan beda', 'Akar berbeda', 'Salah satu mashdar'],
        correct: 1,
        explanation: 'Akar sama: ع-ل-م. عَالِمٌ dari عَلِمَ (tsulatsi). مُعَلِّمٌ dari عَلَّمَ (wazan فَعَّلَ = mengajarkan).',
      },
      {
        q: 'كَاتِبٌ dan مَكْتُوبٌ menunjukkan...',
        options: ['Sama-sama pelaku', 'Pelaku & yang dikenai', 'Mashdar & isim alat', 'Madhi & mudhori\''],
        correct: 1,
        explanation: 'كَاتِبٌ = pelaku (penulis). مَكْتُوبٌ = yang dikenai perbuatan (yang ditulis).',
      },
      {
        q: 'Tujuan utama belajar shorf adalah...',
        options: ['Menghafal banyak kata', 'Memahami akar & turunan kata untuk bisa baca teks Arab apapun', 'Mempercepat bicara', 'Membaca tanpa harakat saja'],
        correct: 1,
        explanation: 'Shorf membuka kemampuan: dari 1 akar 3 huruf, kamu bisa kenali dan derive ratusan turunan kata di Qur\'an dan kitab kuning.',
      },
    ],
  },
];

export function getShorfLesson(id) {
  return SHORF_LESSONS.find((l) => l.id === id) || null;
}
