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
  ,
  // ============ PELAJARAN 7 (PREMIUM) ============
  {
    id: 'shorf-7-tsulatsi-mazid',
    order: 7,
    isFree: false,
    title: 'Fi\'il Tsulatsi Mazid',
    subtitle: 'Fi\'il 3 huruf dgn tambahan huruf',
    emoji: '➕',
    duration: '7 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Fi\'il Tsulatsi Mazid (الثُّلَاثِيُّ الْمَزِيدُ) adalah fi\'il 3 huruf yang ditambah 1-3 huruf di awal/tengah/akhir. Penambahan huruf mengubah makna dasar fi\'il. Sangat penting karena banyak kata Qur\'an pakai wazan ini.',
      sections: [
        {
          title: 'Mazid Tambah 1 Huruf — 3 Wazan',
          body: 'أَفْعَلَ (penyebaban), فَعَّلَ (intensif/penyebaban), فَاعَلَ (timbal-balik).',
          examples: [
            { ar: 'أَكْرَمَ', latin: 'akrama', id: 'memuliakan (dari كَرُمَ — mulia)' },
            { ar: 'عَلَّمَ', latin: '\'allama', id: 'mengajarkan (dari عَلِمَ — tahu)' },
            { ar: 'قَاتَلَ', latin: 'qaatala', id: 'saling memerangi (dari قَتَلَ — membunuh)' },
          ],
        },
        {
          title: 'Mazid Tambah 2 Huruf — Wazan Umum',
          body: 'انْفَعَلَ (pasif/refleksif), افْتَعَلَ (refleksif/usaha), تَفَعَّلَ (taawwun), تَفَاعَلَ (saling).',
          examples: [
            { ar: 'انْكَسَرَ', latin: 'inkasara', id: 'pecah (refleksif dari كَسَرَ)' },
            { ar: 'اجْتَمَعَ', latin: 'ijtama\'a', id: 'berkumpul (dari جَمَعَ)' },
            { ar: 'تَعَلَّمَ', latin: 'ta\'allama', id: 'belajar (taawwun dari عَلِمَ)' },
          ],
        },
        {
          title: 'Mazid Tambah 3 Huruf — Wazan Istif\'al',
          body: 'اسْتَفْعَلَ — biasanya untuk MEMINTA atau menganggap. Sangat sering muncul.',
          examples: [
            { ar: 'اسْتَغْفَرَ', latin: 'istaghfara', id: 'meminta ampun (dari غَفَرَ — mengampuni)' },
            { ar: 'اسْتَخْرَجَ', latin: 'istakhraja', id: 'mengeluarkan (dari خَرَجَ — keluar)' },
            { ar: 'اسْتَعَانَ', latin: 'ista\'aana', id: 'meminta tolong (dari عَانَ)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        latin: 'iyyaaka na\'budu wa iyyaaka nasta\'iin',
        surah: 'Al-Fatihah',
        ayatNum: 5,
        analysis: [
          { word: 'إِيَّاكَ', type: 'Maf\'ul bih', note: 'nashob; didahulukan' },
          { word: 'نَعْبُدُ', type: 'Fi\'il Tsulatsi Mujarrad', note: 'menyembah; wazan فَعَلَ' },
          { word: 'وَ', type: 'Harf athaf', note: '' },
          { word: 'نَسْتَعِينُ', type: 'Fi\'il Tsulatsi Mazid', note: 'minta tolong; wazan اسْتَفْعَلَ' },
        ],
        explanation: 'نَسْتَعِينُ = اسْتَعَانَ → tambah ن untuk "kami". Wazan اسْتَفْعَلَ artinya MEMINTA — "minta tolong/pertolongan". Bedakan dgn نَعْبُدُ (tsulatsi mujarrad biasa).',
      },
    },
    quiz: [
      {
        q: 'اسْتَغْفَرَ artinya...',
        options: ['Mengampuni', 'Meminta ampun', 'Diampuni', 'Pengampun'],
        correct: 1,
        explanation: 'Wazan اسْتَفْعَلَ menunjukkan PERMINTAAN. اسْتَغْفَرَ = meminta ampunan, bukan mengampuni.',
      },
      {
        q: 'Wazan فَعَّلَ biasanya menunjukkan makna...',
        options: ['Saling', 'Pasif', 'Penyebaban/intensif', 'Permintaan'],
        correct: 2,
        explanation: 'فَعَّلَ sering untuk penyebaban atau intensifikasi. عَلِمَ (tahu) → عَلَّمَ (membuat tahu = mengajar).',
      },
      {
        q: 'Manakah dari berikut adalah wazan tsulatsi mazid?',
        options: ['كَتَبَ', 'يَكْتُبُ', 'اسْتَكْتَبَ', 'كِتَابٌ'],
        correct: 2,
        explanation: 'اسْتَكْتَبَ adalah tsulatsi mazid (wazan اسْتَفْعَلَ) — minta untuk ditulis. كَتَبَ tsulatsi mujarrad biasa.',
      },
      {
        q: 'تَعَلَّمَ adalah wazan...',
        options: ['فَعَّلَ', 'تَفَعَّلَ', 'تَفَاعَلَ', 'اسْتَفْعَلَ'],
        correct: 1,
        explanation: 'تَعَلَّمَ pakai wazan تَفَعَّلَ — artinya: belajar (taawwun, mengusahakan). Beda dgn عَلَّمَ (فَعَّلَ — mengajar).',
      },
    ],
  },

  // ============ PELAJARAN 8 (PREMIUM) ============
  {
    id: 'shorf-8-wazan-mazid-detail',
    order: 8,
    isFree: false,
    title: 'Wazan Mazid Detail',
    subtitle: 'Makna khusus tiap wazan tambahan',
    emoji: '🎼',
    duration: '7 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Tiap wazan mazid punya makna khas. Memahami makna wazan = membuka rahasia derivasi kata Arab. Inilah yang membedakan paham bahasa Arab tingkat dasar dgn tingkat lanjut.',
      sections: [
        {
          title: 'أَفْعَلَ — Penyebaban (Membuat Jadi)',
          body: 'Pola: a-f-\'a-la. Membuat orang lain melakukan / membuat sesuatu jadi.',
          examples: [
            { ar: 'كَرُمَ → أَكْرَمَ', latin: 'karuma → akrama', id: 'mulia → memuliakan (membuat jadi mulia)' },
            { ar: 'دَخَلَ → أَدْخَلَ', latin: 'dakhala → adkhala', id: 'masuk → memasukkan' },
            { ar: 'خَرَجَ → أَخْرَجَ', latin: 'kharaja → akhraja', id: 'keluar → mengeluarkan' },
          ],
        },
        {
          title: 'تَفَعَّلَ — Mengusahakan Diri',
          body: 'Pola: ta-fa-\'\'a-la. Berusaha melakukan/memperoleh sifat itu pada diri sendiri (taawwun).',
          examples: [
            { ar: 'عَلِمَ → تَعَلَّمَ', latin: '\'alima → ta\'allama', id: 'tahu → belajar (usaha jadi tahu)' },
            { ar: 'صَبَرَ → تَصَبَّرَ', latin: 'shabara → tashabbara', id: 'sabar → memaksakan diri sabar' },
            { ar: 'كَبُرَ → تَكَبَّرَ', latin: 'kabura → takabbara', id: 'besar → sombong (membuat diri terlihat besar)' },
          ],
        },
        {
          title: 'تَفَاعَلَ — Saling',
          body: 'Pola: ta-faa-\'a-la. Saling melakukan (2 pihak atau lebih).',
          examples: [
            { ar: 'كَتَبَ → تَكَاتَبَ', latin: 'kataba → takaataba', id: 'menulis → saling berkirim surat' },
            { ar: 'قَتَلَ → تَقَاتَلَ', latin: 'qatala → taqaatala', id: 'membunuh → saling memerangi' },
            { ar: 'عَاوَنَ → تَعَاوَنَ', latin: '\'aawana → ta\'aawana', id: 'menolong → saling tolong-menolong' },
          ],
        },
      ],
      quranExample: {
        ayat: 'وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَى',
        latin: 'wa ta\'aawanuu \'alal-birri wat-taqwaa',
        surah: 'Al-Maidah',
        ayatNum: 2,
        analysis: [
          { word: 'وَ', type: 'Harf athaf', note: '' },
          { word: 'تَعَاوَنُوا', type: 'Fi\'il Amr (jamak)', note: 'wazan تَفَاعَلَ — saling tolong' },
          { word: 'عَلَى', type: 'Harf jar', note: 'di atas/dalam' },
          { word: 'الْبِرِّ', type: 'Majrur', note: 'kebajikan' },
          { word: 'وَالتَّقْوَى', type: 'Athaf', note: 'ketakwaan' },
        ],
        explanation: 'تَعَاوَنُوا dari wazan تَفَاعَلَ — makna "saling". "Tolong-menolong-lah kalian dalam kebajikan dan takwa". Kalau hanya تَعَاوَنَ saja: "saling menolong" (bukan satu pihak menolong yang lain).',
      },
    },
    quiz: [
      {
        q: 'Wazan أَفْعَلَ biasanya menunjukkan makna...',
        options: ['Saling', 'Penyebaban', 'Pasif', 'Permintaan'],
        correct: 1,
        explanation: 'أَفْعَلَ = penyebaban (membuat jadi). دَخَلَ (masuk) → أَدْخَلَ (memasukkan).',
      },
      {
        q: 'تَقَاتَلَ artinya...',
        options: ['Membunuh', 'Saling memerangi', 'Dibunuh', 'Pembunuh'],
        correct: 1,
        explanation: 'Wazan تَفَاعَلَ = saling. قَتَلَ (membunuh) → تَقَاتَلَ (saling memerangi).',
      },
      {
        q: 'تَعَلَّمَ menggunakan wazan...',
        options: ['أَفْعَلَ', 'تَفَعَّلَ', 'تَفَاعَلَ', 'فَعَّلَ'],
        correct: 1,
        explanation: 'تَعَلَّمَ pakai wazan تَفَعَّلَ — pola ta-fa-\'\'a-la. Makna: berusaha jadi (tahu).',
      },
      {
        q: 'Apa makna khas wazan تَفَاعَلَ?',
        options: ['Pasif', 'Penyebaban', 'Saling (timbal balik)', 'Permintaan'],
        correct: 2,
        explanation: 'تَفَاعَلَ = saling. Biasanya pelakunya jamak/dua pihak.',
      },
    ],
  },

  // ============ PELAJARAN 9 (PREMIUM) ============
  {
    id: 'shorf-9-fiil-mutal',
    order: 9,
    isFree: false,
    title: 'Fi\'il Mu\'tal',
    subtitle: 'Fi\'il dengan huruf illah (و، ي، ا)',
    emoji: '〰️',
    duration: '7 menit',
    color: '#a05536',
    xpReward: 40,
    theory: {
      intro: 'Fi\'il Mu\'tal (الْفِعْلُ الْمُعْتَلُّ) adalah fi\'il yang salah satu huruf asalnya berupa huruf illah (و، ي، ا). Saat di-tashrif, huruf illah sering berubah/hilang sesuai aturan i\'lal. Ini bagian tersulit shorf — tapi paling banyak muncul.',
      sections: [
        {
          title: 'Mu\'tal Mitsal (و/ي di Awal)',
          body: 'Huruf illah berada di posisi fa\' (huruf pertama). Contoh: وَعَدَ، وَجَدَ، يَئِسَ.',
          examples: [
            { ar: 'وَعَدَ - يَعِدُ', latin: 'wa\'ada - ya\'idu', id: 'berjanji (و hilang di mudhori\')' },
            { ar: 'وَصَلَ - يَصِلُ', latin: 'washala - yashilu', id: 'sampai/tiba' },
          ],
        },
        {
          title: 'Mu\'tal Ajwaf (و/ي di Tengah)',
          body: 'Huruf illah di posisi \'ain (huruf kedua). Contoh: قَالَ (asalnya قَوَلَ), بَاعَ (asalnya بَيَعَ).',
          examples: [
            { ar: 'قَالَ - يَقُولُ', latin: 'qaala - yaquulu', id: 'berkata (asal: قَوَلَ - يَقْوُلُ → قَالَ - يَقُولُ)' },
            { ar: 'بَاعَ - يَبِيعُ', latin: 'baa\'a - yabii\'u', id: 'menjual (asal: بَيَعَ)' },
            { ar: 'صَامَ - يَصُومُ', latin: 'shaama - yashuumu', id: 'berpuasa' },
          ],
        },
        {
          title: 'Mu\'tal Naqis (و/ي di Akhir)',
          body: 'Huruf illah di posisi lam (huruf ketiga). Contoh: دَعَا، رَمَى، نَسِيَ.',
          examples: [
            { ar: 'دَعَا - يَدْعُو', latin: 'da\'aa - yad\'uu', id: 'memanggil/berdoa' },
            { ar: 'رَمَى - يَرْمِي', latin: 'ramaa - yarmii', id: 'melempar' },
            { ar: 'نَسِيَ - يَنْسَى', latin: 'nasiya - yansaa', id: 'lupa' },
          ],
        },
      ],
      quranExample: {
        ayat: 'وَمَا رَمَيْتَ إِذْ رَمَيْتَ وَلَكِنَّ اللَّهَ رَمَى',
        latin: 'wa maa ramaita idz ramaita walaakinnallaha ramaa',
        surah: 'Al-Anfal',
        ayatNum: 17,
        analysis: [
          { word: 'وَمَا', type: 'Harf nafi', note: 'dan tidaklah' },
          { word: 'رَمَيْتَ', type: 'Fi\'il Madhi Naqis', note: 'engkau melempar; ya berubah karena tashrif' },
          { word: 'إِذْ', type: 'Zhorof', note: 'ketika' },
          { word: 'رَمَيْتَ', type: 'Fi\'il Madhi Naqis', note: 'engkau melempar (lagi)' },
          { word: 'رَمَى', type: 'Fi\'il Madhi Naqis', note: 'huruf illah ya jadi alif di akhir' },
        ],
        explanation: 'رَمَى adalah fi\'il mu\'tal naqis — akhirnya alif (dari asal ya). Saat di-tashrif ke تَ (kamu): jadi رَمَيْتَ — ya muncul kembali. Inilah aturan i\'lal — huruf illah berubah-ubah sesuai posisi.',
      },
    },
    quiz: [
      {
        q: 'قَالَ termasuk fi\'il mu\'tal jenis apa?',
        options: ['Mitsal', 'Ajwaf', 'Naqis', 'Salim'],
        correct: 1,
        explanation: 'قَالَ asal-nya قَوَلَ — huruf illah و di tengah (ain fi\'il). Itu mu\'tal AJWAF.',
      },
      {
        q: 'Mu\'tal mitsal artinya huruf illah berada di...',
        options: ['Awal (fa\' fi\'il)', 'Tengah (\'ain fi\'il)', 'Akhir (lam fi\'il)', 'Bebas'],
        correct: 0,
        explanation: 'Mu\'tal mitsal = huruf illah di posisi fa\' (awal). Contoh: وَعَدَ، وَجَدَ.',
      },
      {
        q: 'دَعَا - يَدْعُو termasuk mu\'tal...',
        options: ['Mitsal', 'Ajwaf', 'Naqis', 'Lafif'],
        correct: 2,
        explanation: 'Huruf illah و di akhir (lam fi\'il). Itu mu\'tal NAQIS.',
      },
      {
        q: 'Kenapa fi\'il mu\'tal harus dipelajari khusus?',
        options: ['Tidak penting', 'Karena huruf illah-nya berubah-ubah saat di-tashrif', 'Karena hanya ada di syair', 'Karena tidak ada di Qur\'an'],
        correct: 1,
        explanation: 'Huruf illah mengikuti aturan i\'lal — bisa berubah jadi alif/ya/wau atau hilang. Banyak kata Qur\'an mu\'tal (قَالَ، رَأَى، أَتَى dll).',
      },
    ],
  },

  // ============ PELAJARAN 10 (PREMIUM) ============
  {
    id: 'shorf-10-isim-alat-zaman-makan',
    order: 10,
    isFree: false,
    title: 'Isim Alat, Zaman & Makan',
    subtitle: 'Kata alat, waktu, dan tempat',
    emoji: '🛠️',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Selain isim fa\'il dan maf\'ul, dari satu akar fi\'il bisa lahir 3 jenis isim turunan: Isim Alat (alat), Isim Zaman (waktu kejadian), dan Isim Makan (tempat kejadian). Polanya hampir mirip — yang membedakan konteks.',
      sections: [
        {
          title: 'Isim Alat (اسْمُ الْآلَةِ)',
          body: 'Kata benda yang menunjukkan ALAT untuk perbuatan. Pola: مِفْعَلٌ، مِفْعَلَةٌ، مِفْعَالٌ.',
          examples: [
            { ar: 'فَتَحَ → مِفْتَاحٌ', latin: 'fataha → miftaah', id: 'membuka → kunci (alat membuka)' },
            { ar: 'قَصَّ → مِقَصٌّ', latin: 'qashsha → miqashsh', id: 'memotong → gunting' },
            { ar: 'كَنَسَ → مِكْنَسَةٌ', latin: 'kanasa → miknasah', id: 'menyapu → sapu' },
          ],
        },
        {
          title: 'Isim Makan (اسْمُ الْمَكَانِ)',
          body: 'Kata benda yang menunjukkan TEMPAT terjadinya perbuatan. Pola umum: مَفْعَلٌ، مَفْعِلٌ.',
          examples: [
            { ar: 'كَتَبَ → مَكْتَبٌ', latin: 'kataba → maktab', id: 'menulis → meja/kantor (tempat menulis)' },
            { ar: 'سَجَدَ → مَسْجِدٌ', latin: 'sajada → masjid', id: 'sujud → masjid (tempat sujud)' },
            { ar: 'دَرَسَ → مَدْرَسَةٌ', latin: 'darasa → madrasah', id: 'belajar → sekolah (tempat belajar)' },
          ],
        },
        {
          title: 'Isim Zaman (اسْمُ الزَّمَانِ)',
          body: 'Kata benda yang menunjukkan WAKTU terjadinya perbuatan. Pola sama dgn isim makan: مَفْعَلٌ atau مَفْعِلٌ — konteks menentukan.',
          examples: [
            { ar: 'وَلَدَ → مَوْلِدٌ', latin: 'walada → maulid', id: 'melahirkan → waktu kelahiran (Maulid Nabi)' },
            { ar: 'غَرَبَ → مَغْرِبٌ', latin: 'gharaba → maghrib', id: 'terbenam → waktu terbenam (Maghrib)' },
            { ar: 'طَلَعَ → مَطْلَعٌ', latin: 'thala\'a → mathla\'', id: 'terbit → waktu terbit' },
          ],
        },
      ],
      quranExample: {
        ayat: 'سُبْحَانَ الَّذِي أَسْرَى بِعَبْدِهِ لَيْلًا مِنَ الْمَسْجِدِ الْحَرَامِ',
        latin: 'subhaanal-ladzii asraa bi\'abdihi lailan minal-masjidil-haraam',
        surah: 'Al-Isra',
        ayatNum: 1,
        analysis: [
          { word: 'سُبْحَانَ', type: 'Mashdar', note: 'Maha Suci; mansub' },
          { word: 'الَّذِي', type: 'Isim maushul', note: 'mudhof ilaih' },
          { word: 'أَسْرَى', type: 'Fi\'il Madhi', note: 'memperjalankan di malam hari' },
          { word: 'الْمَسْجِدِ', type: 'Isim Makan', note: 'majrur; tempat sujud (مَسْجِد = isim makan dari سَجَدَ)' },
          { word: 'الْحَرَامِ', type: 'Na\'at', note: 'mengikuti majrur' },
        ],
        explanation: 'الْمَسْجِدِ الْحَرَامِ — مَسْجِد adalah isim makan dari سَجَدَ (sujud), artinya "tempat sujud". Wazan مَفْعِلٌ. Banyak nama tempat di Qur\'an pakai pola ini.',
      },
    },
    quiz: [
      {
        q: 'مِفْتَاحٌ adalah isim apa?',
        options: ['Isim Fa\'il', 'Isim Maf\'ul', 'Isim Alat', 'Isim Makan'],
        correct: 2,
        explanation: 'مِفْتَاحٌ pakai wazan مِفْعَالٌ — isim alat (alat untuk membuka = kunci).',
      },
      {
        q: 'مَدْرَسَةٌ artinya...',
        options: ['Yang mengajar', 'Belajar', 'Tempat belajar (sekolah)', 'Alat belajar'],
        correct: 2,
        explanation: 'مَدْرَسَةٌ adalah isim makan dari دَرَسَ — tempat untuk belajar = sekolah.',
      },
      {
        q: 'Pola مِفْعَلٌ، مِفْعَلَةٌ menunjukkan isim apa?',
        options: ['Fa\'il', 'Maf\'ul', 'Alat', 'Mashdar'],
        correct: 2,
        explanation: 'Pola mi-f-\'a-l adalah pola standar isim ALAT.',
      },
      {
        q: 'مَغْرِبٌ adalah isim apa dari akar غَرَبَ?',
        options: ['Isim Fa\'il', 'Isim Maf\'ul', 'Isim Alat', 'Isim Zaman'],
        correct: 3,
        explanation: 'مَغْرِبٌ = waktu terbenamnya matahari → isim zaman.',
      },
    ],
  },
  ,
  // ============ PELAJARAN 11 (PREMIUM) ============
  {
    id: 'shorf-11-jamak-taksir',
    order: 11,
    isFree: false,
    title: 'Jamak Taksir',
    subtitle: 'Bentuk jamak yg merubah pola kata',
    emoji: '🌾',
    duration: '7 menit',
    color: '#a05536',
    xpReward: 40,
    theory: {
      intro: 'Jamak Taksir (جَمْعُ التَّكْسِيرِ) adalah bentuk jamak yang MENGUBAH POLA kata asalnya — bukan sekadar menambah huruf. Berbeda dgn jamak mudzakkar salim (-ūn) dan mu\'annats salim (-āt) yang teratur. Jamak taksir punya banyak pola.',
      sections: [
        {
          title: 'Pola Umum 1: أَفْعَال & أَفْعُل',
          body: 'Sering untuk kata-kata mufrad bersuku kata pendek.',
          examples: [
            { ar: 'قَلَمٌ → أَقْلَامٌ', latin: 'qalam → aqlaam', id: 'pena → pena-pena' },
            { ar: 'يَوْمٌ → أَيَّامٌ', latin: 'yaum → ayyaam', id: 'hari → hari-hari' },
            { ar: 'نَهْرٌ → أَنْهَارٌ', latin: 'nahr → anhaar', id: 'sungai → sungai-sungai' },
          ],
        },
        {
          title: 'Pola Umum 2: فُعُل & فِعَال & فِعَل',
          body: 'Tiga pola yang sangat sering.',
          examples: [
            { ar: 'كِتَابٌ → كُتُبٌ', latin: 'kitaab → kutub', id: 'buku → buku-buku' },
            { ar: 'جَبَلٌ → جِبَالٌ', latin: 'jabal → jibaal', id: 'gunung → gunung-gunung' },
            { ar: 'قِطْعَةٌ → قِطَعٌ', latin: 'qith\'ah → qitha\'', id: 'potongan → potongan-potongan' },
          ],
        },
        {
          title: 'Pola Lanjut: مَفَاعِل، فَوَاعِل، فَعَائِل، فُعَلَاء',
          body: 'Untuk kata-kata yang lebih kompleks.',
          examples: [
            { ar: 'مَسْجِدٌ → مَسَاجِدُ', latin: 'masjid → masaajid', id: 'masjid → masjid-masjid' },
            { ar: 'عَالِمٌ → عُلَمَاءُ', latin: '\'aalim → \'ulamaa\'', id: 'orang berilmu → ulama' },
            { ar: 'مَدِينَةٌ → مَدَائِنُ', latin: 'madiinah → madaa\'in', id: 'kota → kota-kota' },
          ],
        },
      ],
      quranExample: {
        ayat: 'فَاسْأَلُوا أَهْلَ الذِّكْرِ إِنْ كُنْتُمْ لَا تَعْلَمُونَ',
        latin: 'fas\'aluu ahladz-dzikri in kuntum laa ta\'lamuun',
        surah: 'An-Nahl',
        ayatNum: 43,
        analysis: [
          { word: 'فَاسْأَلُوا', type: 'Fi\'il Amr jamak', note: 'maka bertanyalah' },
          { word: 'أَهْلَ', type: 'Maf\'ul bih', note: 'mansub; mudhof' },
          { word: 'الذِّكْرِ', type: 'Mudhof ilaih', note: 'majrur' },
          { word: 'إِنْ كُنْتُمْ', type: 'Syarat', note: 'jika kalian' },
          { word: 'لَا تَعْلَمُونَ', type: 'Jawab syarat', note: 'tidak mengetahui' },
        ],
        explanation: 'أَهْلَ adalah mufrad. Jamak-nya: أَهَالٍ atau أَهَالِي (jamak taksir pola فَعَالٍ). Memahami jamak taksir penting agar kita kenali kata yang sama di berbagai bentuknya.',
      },
    },
    quiz: [
      {
        q: 'Apa beda jamak taksir dgn jamak salim?',
        options: ['Sama saja', 'Jamak taksir mengubah pola kata, jamak salim hanya menambah akhiran teratur', 'Jamak taksir hanya untuk perempuan', 'Jamak salim hanya 3 huruf'],
        correct: 1,
        explanation: 'Jamak taksir mengubah pola dasar kata (mis. كِتَاب → كُتُب). Jamak salim hanya menambah ون/ين atau ات di akhir.',
      },
      {
        q: 'Jamak taksir dari قَلَم adalah...',
        options: ['قَلَمَانِ', 'قَلَمَاتٌ', 'أَقْلَامٌ', 'قَالَمُونَ'],
        correct: 2,
        explanation: 'قَلَمٌ → أَقْلَامٌ (pola أَفْعَال). Pena-pena.',
      },
      {
        q: 'مَسَاجِدُ adalah jamak taksir dari...',
        options: ['سَجَدَ', 'مُسَاجِدٌ', 'مَسْجِدٌ', 'مَسْجُودٌ'],
        correct: 2,
        explanation: 'مَسْجِدٌ → مَسَاجِدُ — pola مَفَاعِل. Tempat-tempat sujud.',
      },
      {
        q: 'Kenapa harus belajar jamak taksir?',
        options: ['Tidak penting', 'Karena polanya bervariasi & tidak bisa ditebak — harus dihafal', 'Karena lebih indah', 'Karena ada di syair saja'],
        correct: 1,
        explanation: 'Jamak taksir bentuknya tidak bisa ditebak dari mufrad — harus dihafal pola per kata. Banyak kata Qur\'an pakai jamak taksir.',
      },
    ],
  },

  // ============ PELAJARAN 12 (PREMIUM) ============
  {
    id: 'shorf-12-isim-mansub',
    order: 12,
    isFree: false,
    title: 'Isim Mansub',
    subtitle: 'Kata dgn akhiran -iyy (penisbatan)',
    emoji: '🏷️',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 30,
    theory: {
      intro: 'Isim Mansub (الْاِسْمُ الْمَنْسُوبُ) adalah isim yang ditambah akhiran ـِيٌّ (ya\' bertasydid + dhommah) untuk menunjukkan PENISBATAN — asal, jenis, kepunyaan. Sangat sering dipakai untuk nama profesi, asal daerah, mazhab.',
      sections: [
        {
          title: 'Aturan Pembentukan',
          body: 'Tambah ـِيٌّ di akhir isim. Buang ta marbuta (ة) atau alif (ى) jika ada. Hasil: kata sifat yang menunjukkan "yang berhubungan dengan...".',
          examples: [
            { ar: 'مِصْرُ → مِصْرِيٌّ', latin: 'Mishru → Mishriyy', id: 'Mesir → orang Mesir' },
            { ar: 'مَدِينَةٌ → مَدَنِيٌّ', latin: 'madiinah → madaniyy', id: 'Madinah → orang Madinah' },
            { ar: 'الْيَوْمُ → الْيَوْمِيٌّ', latin: 'al-yaum → al-yaumiyy', id: 'hari → harian' },
          ],
        },
        {
          title: 'Untuk Profesi & Mazhab',
          body: 'Sangat sering untuk menyebutkan profesi (penjual sesuatu) atau pengikut mazhab.',
          examples: [
            { ar: 'صَيْدَلِيٌّ', latin: 'shaidaliyy', id: 'apoteker (dari صَيْدَلِيَّةٌ — apotek)' },
            { ar: 'شَافِعِيٌّ', latin: 'syaafi\'iyy', id: 'pengikut mazhab Syafi\'i' },
            { ar: 'حَنَفِيٌّ', latin: 'hanafiyy', id: 'pengikut mazhab Hanafi' },
          ],
        },
        {
          title: 'Beda Mufrad & Jamak',
          body: 'Mufrad: ـِيٌّ. Jamak mudzakkar salim: ـِيُّونَ. Banyak nama negara di Qur\'an pakai pola jamak ini.',
          examples: [
            { ar: 'مُسْلِمٌ → مُسْلِمُونَ', latin: 'muslim → muslimuun', id: 'muslim → kaum muslimin' },
            { ar: 'إِسْرَائِيلِيٌّ → إِسْرَائِيلِيُّونَ', latin: 'israa\'iiliyy → israa\'iiliyyuun', id: 'Israeli → orang-orang Israel' },
          ],
        },
      ],
      quranExample: {
        ayat: 'وَإِذْ قَالَ مُوسَى لِقَوْمِهِ يَا قَوْمِ',
        latin: 'wa idz qaala Muusaa liqaumihi yaa qaum',
        surah: 'Ash-Shaff',
        ayatNum: 5,
        analysis: [
          { word: 'وَإِذْ', type: 'Zhorof', note: 'dan ketika' },
          { word: 'قَالَ', type: 'Fi\'il Madhi', note: 'berkata' },
          { word: 'مُوسَى', type: 'Fa\'il', note: 'rofa\' dgn dhommah muqaddarah' },
          { word: 'لِقَوْمِهِ', type: 'Jar majrur', note: 'kepada kaumnya' },
          { word: 'يَا قَوْمِ', type: 'Munada', note: 'wahai kaum-ku!' },
        ],
        explanation: 'Konsep yg dekat: قَوْمٌ (kaum). Bentuk nisbat-nya: قَوْمِيٌّ (nasionalis / kebangsaan). Banyak ideologi modern (وَطَنِيٌّ "nasionalis", إِسْلَامِيٌّ "Islamis") pakai pola nisbat ini.',
      },
    },
    quiz: [
      {
        q: 'Cara membuat isim mansub adalah dgn menambahkan...',
        options: ['ـُونَ', 'ـَاتٌ', 'ـِيٌّ', 'ـَانِ'],
        correct: 2,
        explanation: 'Tambah ـِيٌّ (ya\' tasydid + dhommah) di akhir untuk membuat isim mansub.',
      },
      {
        q: 'مِصْرِيٌّ artinya...',
        options: ['Mesir', 'Penduduk Mesir / orang Mesir', 'Ke Mesir', 'Dari Mesir'],
        correct: 1,
        explanation: 'Akhiran -iyy menunjukkan penisbatan. مِصْرِيٌّ = "yang dinisbatkan ke Mesir" = orang Mesir.',
      },
      {
        q: 'Pembentukan nisbat dari مَدِينَةٌ adalah...',
        options: ['مَدِينَتِيٌّ', 'مَدَنِيٌّ', 'مَدِينَاتٌ', 'مَدَائِنُ'],
        correct: 1,
        explanation: 'مَدِينَةٌ → buang ة → tambah ـِيٌّ → مَدَنِيٌّ. Buang ta marbuta dulu.',
      },
      {
        q: 'Apa fungsi utama isim mansub?',
        options: ['Menyatakan jamak', 'Menyatakan asal/jenis/kepunyaan', 'Menyatakan negasi', 'Menyatakan perintah'],
        correct: 1,
        explanation: 'Isim mansub menunjukkan PENISBATAN — bisa asal daerah, profesi, mazhab, jenis, kepunyaan.',
      },
    ],
  },

  // ============ PELAJARAN 13 (PREMIUM) ============
  {
    id: 'shorf-13-mudzaaf-rubaai',
    order: 13,
    isFree: false,
    title: 'Mudza\'af & Ruba\'i',
    subtitle: 'Fi\'il berhuruf rangkap & berhuruf 4',
    emoji: '🎯',
    duration: '7 menit',
    color: '#a05536',
    xpReward: 40,
    theory: {
      intro: 'Selain tsulatsi (3 huruf), ada fi\'il jenis lain: Mudza\'af (huruf \'ain & lam sama — rangkap) dan Ruba\'i (4 huruf asli). Keduanya punya aturan tashrif khas.',
      sections: [
        {
          title: 'Fi\'il Mudza\'af',
          body: 'Fi\'il yang \'ain & lam-nya huruf yg sama, sehingga ditashdid. Contoh: مَدَّ (asalnya مَدَدَ), رَدَّ (asalnya رَدَدَ).',
          examples: [
            { ar: 'مَدَّ - يَمُدُّ', latin: 'madda - yamuddu', id: 'memanjangkan' },
            { ar: 'رَدَّ - يَرُدُّ', latin: 'radda - yaruddu', id: 'mengembalikan' },
            { ar: 'حَجَّ - يَحُجُّ', latin: 'hajja - yahujju', id: 'berhaji' },
          ],
        },
        {
          title: 'Aturan Tashrif Mudza\'af',
          body: 'Saat di-tashrif ke تَ (kamu/aku), tasydid PECAH menjadi 2 huruf. مَدَدْتُ, رَدَدْتُ — bukan مَدَّتُ, رَدَّتُ.',
          examples: [
            { ar: 'مَدَّ → مَدَدْتُ', latin: 'madda → madadtu', id: 'memanjangkan → aku panjangkan (tasydid pecah)' },
            { ar: 'حَجَّ → حَجَجْتُ', latin: 'hajja → hajajtu', id: 'berhaji → aku berhaji' },
          ],
        },
        {
          title: 'Fi\'il Ruba\'i (4 Huruf Asli)',
          body: 'Fi\'il yang 4 huruf asalnya tanpa tambahan. Wazan utama: فَعْلَلَ. Tashrif-nya seperti tsulatsi mazid فَعَّلَ.',
          examples: [
            { ar: 'دَحْرَجَ - يُدَحْرِجُ', latin: 'dahraja - yudahriju', id: 'menggelinding' },
            { ar: 'تَرْجَمَ - يُتَرْجِمُ', latin: 'tarjama - yutarjimu', id: 'menerjemahkan' },
            { ar: 'زَلْزَلَ - يُزَلْزِلُ', latin: 'zalzala - yuzalzilu', id: 'mengguncang' },
          ],
        },
      ],
      quranExample: {
        ayat: 'إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا',
        latin: 'idzaa zulzilatil-ardhu zilzaalahaa',
        surah: 'Az-Zalzalah',
        ayatNum: 1,
        analysis: [
          { word: 'إِذَا', type: 'Zhorof syarat', note: 'apabila' },
          { word: 'زُلْزِلَتِ', type: 'Fi\'il Madhi Majhul Ruba\'i', note: 'diguncangkan; wazan فُعْلِلَ' },
          { word: 'الْأَرْضُ', type: 'Naib al-Fa\'il', note: 'rofa\' dgn dhommah' },
          { word: 'زِلْزَالَ', type: 'Maf\'ul Mutlaq', note: 'mashdar dari زَلْزَلَ; nashob' },
          { word: 'هَا', type: 'Mudhof ilaih', note: 'majrur' },
        ],
        explanation: 'زَلْزَلَ adalah fi\'il ruba\'i (4 huruf: ز-ل-ز-ل). Bentuk majhul-nya زُلْزِلَ. Mashdar-nya زِلْزَال. Lihat: dari 1 akar ruba\'i bisa lahir verbal/passive/mashdar — sama seperti tsulatsi tapi ada 4 huruf asli.',
      },
    },
    quiz: [
      {
        q: 'Fi\'il mudza\'af punya ciri...',
        options: ['4 huruf asli', '\'ain & lam fi\'il sama (tasydid)', 'Huruf illah di akhir', 'Selalu mu\'tal'],
        correct: 1,
        explanation: 'Mudza\'af: \'ain & lam fi\'il sama hurufnya — sehingga ditasydid. مَدَّ asalnya مَدَدَ.',
      },
      {
        q: 'Tashrif مَدَّ ke "aku" jadi...',
        options: ['مَدَّتُ', 'مَدَدْتُ', 'مَدَّاتُ', 'مُدِدْتُ'],
        correct: 1,
        explanation: 'Tasydid pecah jadi 2 huruf saat ketemu dhomir mutaharrik (تُ): مَدَّ → مَدَدْتُ.',
      },
      {
        q: 'Wazan dasar fi\'il ruba\'i adalah...',
        options: ['فَعَلَ', 'فَعَّلَ', 'فَعْلَلَ', 'اسْتَفْعَلَ'],
        correct: 2,
        explanation: 'Ruba\'i mujarrad polanya فَعْلَلَ — 4 huruf asli tanpa tambahan. Contoh: دَحْرَجَ، تَرْجَمَ.',
      },
      {
        q: 'تَرْجَمَ artinya...',
        options: ['Membaca', 'Menulis', 'Menerjemahkan', 'Berkata'],
        correct: 2,
        explanation: 'تَرْجَمَ adalah fi\'il ruba\'i — menerjemahkan. Mudhori\': يُتَرْجِمُ.',
      },
    ],
  },
  ,
  // ============ PELAJARAN 14 (PREMIUM) ============
  {
    id: 'shorf-14-ism-tafdhil',
    order: 14,
    isFree: false,
    title: 'Ism al-Tafdhil',
    subtitle: 'Komparatif & superlatif (أَفْعَل)',
    emoji: '⭐',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Ism al-Tafdhil (اسْمُ التَّفْضِيلِ) adalah kata sifat untuk membandingkan: "lebih..." atau "paling...". Polanya: أَفْعَلُ. Dibentuk dari fi\'il tsulatsi mujarrad.',
      sections: [
        {
          title: 'Pola Dasar أَفْعَلُ',
          body: 'Mengambil 3 huruf akar fi\'il dan diberi hamzah di depan dgn pola أَفْعَلُ.',
          examples: [
            { ar: 'كَبُرَ → أَكْبَرُ', latin: 'kabura → akbar', id: 'besar → lebih besar / paling besar' },
            { ar: 'حَسُنَ → أَحْسَنُ', latin: 'hasuna → ahsan', id: 'baik → lebih baik' },
            { ar: 'عَلِمَ → أَعْلَمُ', latin: '\'alima → a\'lam', id: 'tahu → lebih tahu' },
          ],
        },
        {
          title: 'Untuk Komparatif: + مِنْ',
          body: 'Untuk arti "lebih dari", pakai pola: أَفْعَل + مِنْ + isim majrur.',
          examples: [
            { ar: 'زَيْدٌ أَكْبَرُ مِنْ عَمْرٍو', latin: 'Zaidun akbaru min \'Amrin', id: 'Zaid lebih besar daripada Amr' },
            { ar: 'الْعِلْمُ أَنْفَعُ مِنَ الْمَالِ', latin: 'al-\'ilmu anfa\'u minal-maal', id: 'Ilmu lebih bermanfaat dari harta' },
          ],
        },
        {
          title: 'Untuk Superlatif: + الـ atau Idhofah',
          body: 'Untuk arti "paling...", pakai alif-lam (الـ) ATAU sebagai mudhof.',
          examples: [
            { ar: 'هُوَ الْأَكْبَرُ', latin: 'huwal-akbar', id: 'Dia yang paling besar' },
            { ar: 'أَكْبَرُ الطُّلَّابِ', latin: 'akbarut-thullaab', id: 'Yang paling besar di antara para murid' },
            { ar: 'أَفْضَلُ النَّاسِ', latin: 'afdhalun-naas', id: 'Yang paling utama di antara manusia' },
          ],
        },
      ],
      quranExample: {
        ayat: 'إِنَّ أَكْرَمَكُمْ عِنْدَ اللَّهِ أَتْقَاكُمْ',
        latin: 'inna akramakum \'indallaahi atqaakum',
        surah: 'Al-Hujurat',
        ayatNum: 13,
        analysis: [
          { word: 'إِنَّ', type: 'Harf taukid', note: 'sesungguhnya' },
          { word: 'أَكْرَمَ', type: 'Ism Tafdhil', note: 'pola أَفْعَل dari كَرُمَ; isim إِنَّ nashob' },
          { word: 'كُمْ', type: 'Mudhof ilaih', note: 'kalian' },
          { word: 'عِنْدَ اللَّهِ', type: 'Zhorof + Mudhof ilaih', note: 'di sisi Allah' },
          { word: 'أَتْقَا', type: 'Ism Tafdhil', note: 'pola أَفْعَل dari تَقِيَ; khobar إِنَّ rofa\'' },
          { word: 'كُمْ', type: 'Mudhof ilaih', note: 'kalian' },
        ],
        explanation: 'Ayat indah dengan DUA isim tafdhil dalam satu kalimat: أَكْرَمَ (paling mulia) dan أَتْقَا (paling takwa). Pola: idhofah. "Sungguh YANG PALING MULIA di antara kalian di sisi Allah adalah YANG PALING TAKWA di antara kalian".',
      },
    },
    quiz: [
      {
        q: 'Pola dasar ism tafdhil adalah...',
        options: ['فَاعِلٌ', 'مَفْعُولٌ', 'أَفْعَلُ', 'مِفْعَالٌ'],
        correct: 2,
        explanation: 'Pola أَفْعَلُ — hamzah di depan + 3 huruf akar. أَكْبَرُ، أَحْسَنُ، أَعْلَمُ.',
      },
      {
        q: 'Untuk komparatif "lebih dari", pakai kata...',
        options: ['فِي', 'إِلَى', 'مِنْ', 'عَلَى'],
        correct: 2,
        explanation: 'مِنْ untuk komparatif. زَيْدٌ أَكْبَرُ مِنْ عَمْرٍو = Zaid lebih besar DARI Amr.',
      },
      {
        q: 'أَحْسَنُ النَّاسِ artinya...',
        options: ['Manusia yang baik', 'Lebih baik dari manusia', 'Manusia paling baik', 'Lawan manusia baik'],
        correct: 2,
        explanation: 'Idhofah dgn ism tafdhil → arti SUPERLATIF: "yang PALING BAIK di antara manusia".',
      },
      {
        q: 'Ism tafdhil dibuat dari fi\'il...',
        options: ['Mazid saja', 'Tsulatsi mujarrad', 'Ruba\'i', 'Sembarang'],
        correct: 1,
        explanation: 'Ism tafdhil dibuat dari fi\'il tsulatsi mujarrad (3 huruf). Untuk fi\'il mazid harus pakai kata bantu (أَشَدُّ، أَكْثَرُ + mashdar).',
      },
    ],
  },

  // ============ PELAJARAN 15 (PREMIUM) ============
  {
    id: 'shorf-15-jamak-salim',
    order: 15,
    isFree: false,
    title: 'Jamak Salim',
    subtitle: 'Jamak teratur lk & pr',
    emoji: '👥',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 30,
    theory: {
      intro: 'Berbeda dgn jamak taksir (pola berubah), Jamak Salim (الْجَمْعُ السَّالِمُ) adalah jamak yang DIBENTUK DGN MENAMBAH AKHIRAN tetap. Ada 2 jenis: Jamak Mudzakkar Salim (lk) dan Jamak Mu\'annats Salim (pr).',
      sections: [
        {
          title: 'Jamak Mudzakkar Salim (لك)',
          body: 'Untuk lk berakal. Akhiran: ـُونَ (rofa\') atau ـِينَ (nashob/jar). Wau & ya\' bertanwin nun.',
          examples: [
            { ar: 'مُسْلِمٌ → مُسْلِمُونَ', latin: 'muslim → muslimuun', id: 'muslim → para muslim (rofa\')' },
            { ar: 'مُؤْمِنٌ → مُؤْمِنِينَ', latin: 'mu\'min → mu\'miniin', id: 'mukmin → para mukmin (nashob/jar)' },
            { ar: 'مُجْتَهِدٌ → مُجْتَهِدُونَ', latin: 'mujtahid → mujtahiduun', id: 'yang rajin → orang-orang yang rajin' },
          ],
        },
        {
          title: 'Jamak Mu\'annats Salim (pr)',
          body: 'Untuk pr atau benda mati. Akhiran: ـَاتٌ. Hilangkan ta marbuta ة jika ada.',
          examples: [
            { ar: 'مُسْلِمَةٌ → مُسْلِمَاتٌ', latin: 'muslimah → muslimaat', id: 'muslimah → para muslimah' },
            { ar: 'طَالِبَةٌ → طَالِبَاتٌ', latin: 'thaalibah → thaalibaat', id: 'siswi → siswi-siswi' },
            { ar: 'سَاعَةٌ → سَاعَاتٌ', latin: 'saa\'ah → saa\'aat', id: 'jam → jam-jam' },
          ],
        },
        {
          title: 'I\'rab Jamak Salim',
          body: 'Jamak Mudzakkar Salim: rofa\' = و, nashob/jar = ي. Jamak Mu\'annats Salim: rofa\' = ـَاتٌ, nashob/jar = ـَاتٍ (kasroh, BUKAN fathah).',
          examples: [
            { ar: 'جَاءَ الْمُسْلِمُونَ', latin: 'jaa\'al-muslimuun', id: 'Para muslim datang (rofa\' dgn و)' },
            { ar: 'رَأَيْتُ الْمُسْلِمَاتِ', latin: 'ra\'aitul-muslimaat', id: 'Aku melihat para muslimah (nashob TAPI ـَاتِ kasroh)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'إِنَّ الْمُسْلِمِينَ وَالْمُسْلِمَاتِ وَالْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ',
        latin: 'innal-muslimiina wal-muslimaati wal-mu\'miniina wal-mu\'minaat',
        surah: 'Al-Ahzab',
        ayatNum: 35,
        analysis: [
          { word: 'إِنَّ', type: 'Harf taukid', note: '' },
          { word: 'الْمُسْلِمِينَ', type: 'Jamak Mudzakkar Salim', note: 'isim إِنَّ; nashob dgn ya' },
          { word: 'وَالْمُسْلِمَاتِ', type: 'Jamak Mu\'annats Salim', note: 'athaf; nashob dgn kasroh' },
          { word: 'وَالْمُؤْمِنِينَ', type: 'Jamak Mudzakkar Salim', note: 'athaf' },
          { word: 'وَالْمُؤْمِنَاتِ', type: 'Jamak Mu\'annats Salim', note: 'athaf' },
        ],
        explanation: 'Lihat: 4 jamak salim berturut-turut. الْمُسْلِمِينَ pakai ي (jamak mudzakkar salim nashob). الْمُسْلِمَاتِ pakai ـَاتِ kasroh (jamak mu\'annats salim — TIDAK fathah meskipun nashob).',
      },
    },
    quiz: [
      {
        q: 'Jamak Mudzakkar Salim untuk مُسْلِم saat rofa\' adalah...',
        options: ['مُسْلِمِينَ', 'مُسْلِمُونَ', 'مُسْلِمَاتٌ', 'مُسَالِمُ'],
        correct: 1,
        explanation: 'Rofa\' = ـُونَ. مُسْلِم → مُسْلِمُونَ.',
      },
      {
        q: 'Untuk pr/benda, akhiran jamak salim adalah...',
        options: ['ـُونَ', 'ـِينَ', 'ـَاتٌ', 'ـَانِ'],
        correct: 2,
        explanation: 'Jamak Mu\'annats Salim: tambah ـَاتٌ di akhir (setelah hilangkan ة kalau ada).',
      },
      {
        q: 'I\'rab nashob untuk jamak mu\'annats salim ditandai dgn...',
        options: ['Fathah', 'Kasroh (ـَاتِ)', 'Dhommah', 'Ya'],
        correct: 1,
        explanation: 'Anomali penting: jamak mu\'annats salim saat NASHOB pakai KASROH (ـَاتِ), bukan fathah seperti i\'rab nashob umumnya.',
      },
      {
        q: 'Apa beda mendasar Jamak Salim & Jamak Taksir?',
        options: ['Sama saja', 'Salim teratur (tambah akhiran), Taksir mengubah pola kata', 'Taksir lebih sopan', 'Salim hanya untuk Qur\'an'],
        correct: 1,
        explanation: 'Salim = teratur, tambah akhiran tetap. Taksir = mengubah pola dasar (kitab → kutub bukan kitabuun).',
      },
    ],
  },

  // ============ PELAJARAN 16 (PREMIUM) ============
  {
    id: 'shorf-16-tashrif-istilahi',
    order: 16,
    isFree: false,
    title: 'Tashrif Istilahi',
    subtitle: '6 langkah derivasi kata Arab',
    emoji: '🪜',
    duration: '8 menit',
    color: '#a05536',
    xpReward: 50,
    theory: {
      intro: 'Tashrif Istilahi (التَّصْرِيفُ الْاِصْطِلَاحِيُّ) adalah pengetahuan tentang turunan kata. Dari 1 akar fi\'il, kita derive 6 bentuk utama secara sistematis. Inilah "anak tangga" yang biasa dihafal santri pesantren.',
      sections: [
        {
          title: '6 Langkah Tashrif Istilahi',
          body: 'Urutan: (1) Madhi (2) Mudhori\' (3) Mashdar (4) Isim Fa\'il (5) Isim Maf\'ul (6) Fi\'il Amr & Nahyi. Untuk akar نَصَرَ:',
          examples: [
            { ar: 'نَصَرَ', latin: 'nashara', id: '1. Madhi: telah menolong' },
            { ar: 'يَنْصُرُ', latin: 'yanshuru', id: '2. Mudhori\': sedang menolong' },
            { ar: 'نَصْرًا', latin: 'nashran', id: '3. Mashdar: pertolongan' },
            { ar: 'نَاصِرٌ', latin: 'naashir', id: '4. Isim fa\'il: penolong' },
            { ar: 'مَنْصُورٌ', latin: 'manshuur', id: '5. Isim maf\'ul: yang ditolong' },
            { ar: 'اُنْصُرْ / لاَ تَنْصُرْ', latin: 'unshur / laa tanshur', id: '6. Amr & Nahyi: tolonglah / jangan tolong' },
          ],
        },
        {
          title: 'Tashrif Akar كَتَبَ',
          body: 'Penerapan ke akar populer كَتَبَ:',
          examples: [
            { ar: 'كَتَبَ → يَكْتُبُ → كِتَابَةً', latin: '', id: 'Madhi → Mudhori\' → Mashdar' },
            { ar: 'كَاتِبٌ → مَكْتُوبٌ', latin: '', id: 'Isim fa\'il → Isim maf\'ul' },
            { ar: 'اُكْتُبْ → لاَ تَكْتُبْ', latin: '', id: 'Amr → Nahyi' },
          ],
        },
        {
          title: 'Manfaat Praktis',
          body: 'Hafalkan 1 akar dgn semua 6 turunan + tashrif lughowi (14 bentuk pelaku). Itu cara santri pesantren bisa cepat baca kitab kuning — karena setiap kata yang ketemu, mereka langsung kenali akar & turunan-nya.',
          examples: [
            { ar: 'فَتَحَ', latin: 'akar: ف-ت-ح', id: 'Tashrif: فَتَحَ - يَفْتَحُ - فَتْحًا - فَاتِحٌ - مَفْتُوحٌ - اِفْتَحْ' },
          ],
        },
      ],
      quranExample: {
        ayat: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ',
        latin: 'idzaa jaa\'a nashrullaahi wal-fath',
        surah: 'An-Nashr',
        ayatNum: 1,
        analysis: [
          { word: 'إِذَا', type: 'Zhorof syarat', note: 'apabila' },
          { word: 'جَاءَ', type: 'Fi\'il Madhi', note: 'datang' },
          { word: 'نَصْرُ', type: 'Mashdar — Fa\'il', note: 'rofa\'; mashdar dari نَصَرَ' },
          { word: 'اللَّهِ', type: 'Mudhof ilaih', note: 'majrur' },
          { word: 'وَالْفَتْحُ', type: 'Mashdar — Athaf', note: 'rofa\'; mashdar dari فَتَحَ' },
        ],
        explanation: 'نَصْرُ dan الْفَتْحُ — keduanya MASHDAR (langkah 3 dari tashrif istilahi). نَصْر dari akar نَصَرَ. فَتْح dari akar فَتَحَ. Memahami tashrif istilahi membuka makna ayat lebih dalam: "Apabila datang PERTOLONGAN Allah dan KEMENANGAN".',
      },
    },
    quiz: [
      {
        q: 'Urutan 6 langkah tashrif istilahi adalah...',
        options: ['Madhi → Mudhori\' → Mashdar → Isim Fa\'il → Isim Maf\'ul → Amr/Nahyi', 'Mudhori\' → Madhi → Amr → Mashdar', 'Amr → Madhi → Mashdar', 'Tidak ada urutan baku'],
        correct: 0,
        explanation: 'Urutan baku tashrif istilahi: madhi → mudhori\' → mashdar → isim fa\'il → isim maf\'ul → amr/nahyi.',
      },
      {
        q: 'Langkah ke-4 tashrif istilahi adalah...',
        options: ['Mashdar', 'Isim Fa\'il', 'Isim Maf\'ul', 'Fi\'il Amr'],
        correct: 1,
        explanation: 'Langkah ke-4: ISIM FA\'IL (pelaku). Polanya فَاعِلٌ.',
      },
      {
        q: 'Dari akar نَصَرَ, isim maf\'ul-nya adalah...',
        options: ['نَاصِرٌ', 'مَنْصُورٌ', 'نَصْرٌ', 'يَنْصُرُ'],
        correct: 1,
        explanation: 'Pola isim maf\'ul مَفْعُولٌ. نَصَرَ → مَنْصُورٌ — yang ditolong.',
      },
      {
        q: 'Tujuan utama menguasai tashrif istilahi...',
        options: ['Hafal banyak kata', 'Dari 1 akar bisa kenali semua turunan saat baca teks', 'Hanya tradisi pesantren', 'Tidak penting'],
        correct: 1,
        explanation: 'Tashrif istilahi membekali: dari 1 akar 3 huruf, kamu bisa langsung kenali 6 turunan utama. Modal utama membaca kitab klasik.',
      },
    ],
  },
  ,
  // ============ PELAJARAN 17 (PREMIUM) ============
  {
    id: 'shorf-17-ilal-ibdal',
    order: 17,
    isFree: false,
    title: 'I\'lal & Ibdal',
    subtitle: 'Aturan perubahan huruf illah',
    emoji: '🔧',
    duration: '7 menit',
    color: '#a05536',
    xpReward: 40,
    theory: {
      intro: 'I\'lal (الْإِعْلَالُ) adalah aturan perubahan huruf illah (و، ي، ا) untuk memudahkan pengucapan. Ibdal (الْإِبْدَالُ) adalah penggantian huruf dgn huruf lain. Ini bagian paling teknis shorf — tapi membuka penjelasan kenapa banyak kata berbentuk seperti itu.',
      sections: [
        {
          title: 'I\'lal: Wau/Ya jadi Alif',
          body: 'Aturan paling umum: jika و atau ي ber-harakat dan sebelumnya fathah, maka berubah jadi ا.',
          examples: [
            { ar: 'قَوَلَ → قَالَ', latin: 'qawala → qaala', id: 'asal qawala (و fathah, sebelumnya fathah) → qaala' },
            { ar: 'بَيَعَ → بَاعَ', latin: 'baya\'a → baa\'a', id: 'asal baya\'a → baa\'a (ya jadi alif)' },
            { ar: 'صَيَمَ → صَامَ', latin: 'shayama → shaama', id: 'puasa' },
          ],
        },
        {
          title: 'I\'lal: Wau/Ya Hilang',
          body: 'Saat dua sukun bertemu (illah sukun + huruf sukun), huruf illah dibuang.',
          examples: [
            { ar: 'قُلْ', latin: 'qul', id: 'asal qawul → quwul → qul (و dibuang)' },
            { ar: 'قُمْ', latin: 'qum', id: 'asal qawum → qum' },
            { ar: 'بِعْ', latin: 'bi\'', id: 'asal biyi\' → bi\' (ي dibuang)' },
          ],
        },
        {
          title: 'Ibdal: Huruf Diganti Huruf Lain',
          body: 'Beberapa huruf bertukar untuk pengucapan yang lebih mudah. Contoh: ت → ط dlm افْتَعَلَ jika fa-nya huruf isti\'la (ص ض ط ظ).',
          examples: [
            { ar: 'اضْتَرَبَ → اضْطَرَبَ', latin: '', id: 'asal idhtaraba → idhtharaba (ت → ط)' },
            { ar: 'اصْتَلَحَ → اصْطَلَحَ', latin: '', id: 'ishtalaha → ishthalaha' },
          ],
        },
      ],
      quranExample: {
        ayat: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        latin: 'qul huwallaahu ahad',
        surah: 'Al-Ikhlas',
        ayatNum: 1,
        analysis: [
          { word: 'قُلْ', type: 'Fi\'il Amr Mu\'tal Ajwaf', note: 'asal qawul; setelah i\'lal: qul' },
          { word: 'هُوَ', type: 'Dhomir Munfashil', note: 'mubtada\'' },
          { word: 'اللَّهُ', type: 'Khobar', note: 'rofa\'' },
          { word: 'أَحَدٌ', type: 'Khobar ke-2 / Badal', note: 'rofa\' dgn tanwin' },
        ],
        explanation: 'قُلْ asalnya قَوَلَ (mu\'tal ajwaf). Saat amr: قُول → قُلْ (و dibuang karena bertemu sukun). Inilah hasil dari i\'lal — aturan klasik yang membuat قَالَ dan قُلْ kelihatan beda jauh padahal akarnya sama: ق-و-ل.',
      },
    },
    quiz: [
      {
        q: 'I\'lal terjadi pada huruf...',
        options: ['Semua huruf', 'Huruf illah (و، ي، ا)', 'Huruf isti\'la', 'Huruf jar'],
        correct: 1,
        explanation: 'I\'lal khusus huruf illah: و، ي، ا yang berubah/hilang sesuai aturan.',
      },
      {
        q: 'قَالَ asalnya...',
        options: ['قَلَ', 'قَوَلَ', 'قَيَلَ', 'قَلَا'],
        correct: 1,
        explanation: 'قَوَلَ → و berharakat sebelumnya fathah → ا. Jadi قَالَ.',
      },
      {
        q: 'قُلْ adalah hasil i\'lal dari...',
        options: ['قَوَلَ langsung', 'قُول (asal amr dari mudhori\' يَقُولُ)', 'قَالَ', 'قِيلَ'],
        correct: 1,
        explanation: 'Amr dari mudhori\' يَقُولُ → asal-nya قُول → و bertemu sukun → dibuang → قُلْ.',
      },
      {
        q: 'Mengapa penting belajar i\'lal?',
        options: ['Tidak penting', 'Membuka penjelasan kenapa kata-kata mu\'tal berbentuk seperti itu', 'Hanya untuk syair', 'Hafalan saja'],
        correct: 1,
        explanation: 'I\'lal menjelaskan KENAPA satu akar bisa terlihat berbeda di berbagai bentuk (قَالَ، قُلْ، قِيلَ). Tanpa i\'lal sulit memahami pola.',
      },
    ],
  },

  // ============ PELAJARAN 18 (PREMIUM) ============
  {
    id: 'shorf-18-mubaalaghah',
    order: 18,
    isFree: false,
    title: 'Asma\' al-Mubaalaghah',
    subtitle: 'Penekanan: fa\'\'aal, mif\'aal, fa\'uul',
    emoji: '🔊',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Asma\' al-Mubaalaghah (أَسْمَاءُ الْمُبَالَغَةِ) adalah pola isim fa\'il yang DIPERKUAT untuk menunjukkan sifat yg sangat kuat / sering dilakukan. 5 pola utama. Banyak nama Allah pakai pola ini.',
      sections: [
        {
          title: 'Pola 1: فَعَّالٌ (Sangat sering)',
          body: 'Menunjukkan SERING melakukan / sangat. Pola: f-\'a-\'\'a-l.',
          examples: [
            { ar: 'كَذَبَ → كَذَّابٌ', latin: 'kadzaba → kadzdzaab', id: 'berbohong → pendusta besar' },
            { ar: 'غَفَرَ → غَفَّارٌ', latin: 'ghafara → ghaffaar', id: 'mengampuni → Maha Pengampun' },
            { ar: 'رَزَقَ → رَزَّاقٌ', latin: 'razaqa → razzaaq', id: 'memberi rezeki → Maha Pemberi Rezeki' },
          ],
        },
        {
          title: 'Pola 2: فَعُولٌ (Sangat)',
          body: 'Menunjukkan SANGAT. Pola: f-\'a-uu-l.',
          examples: [
            { ar: 'شَكَرَ → شَكُورٌ', latin: 'syakara → syakuur', id: 'bersyukur → Maha Mensyukuri' },
            { ar: 'صَبَرَ → صَبُورٌ', latin: 'shabara → shabuur', id: 'sabar → Maha Penyabar' },
            { ar: 'غَفَرَ → غَفُورٌ', latin: 'ghafara → ghafuur', id: 'mengampuni → Maha Pengampun' },
          ],
        },
        {
          title: 'Pola 3-5: فَعِيلٌ، مِفْعَالٌ، فَعِلٌ',
          body: 'Pola lain yang juga berarti penekanan.',
          examples: [
            { ar: 'عَلِمَ → عَلِيمٌ', latin: '\'alima → \'aliim', id: 'tahu → Maha Mengetahui (pola fa\'iil)' },
            { ar: 'قَدَرَ → مِقْدَارٌ', latin: 'qadara → miqdaar', id: 'sangat mampu (mif\'aal)' },
            { ar: 'حَذِرَ → حَذِرٌ', latin: 'hadzira → hadzir', id: 'sangat berhati-hati (fa\'il)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ',
        latin: 'innallaaha ghafuurur-rahiim',
        surah: 'Al-Baqarah',
        ayatNum: 173,
        analysis: [
          { word: 'إِنَّ', type: 'Harf taukid', note: '' },
          { word: 'اللَّهَ', type: 'Isim إِنَّ', note: 'nashob' },
          { word: 'غَفُورٌ', type: 'Mubaalaghah فَعُولٌ', note: 'khobar; rofa\'' },
          { word: 'رَحِيمٌ', type: 'Mubaalaghah فَعِيلٌ', note: 'athaf; rofa\'' },
        ],
        explanation: 'غَفُورٌ (pola fa\'uul) dan رَحِيمٌ (pola fa\'iil) — DUA pola mubaalaghah berturut-turut. Bedakan dgn غَافِرٌ biasa (yang mengampuni) — غَفُورٌ artinya: Maha Pengampun, SANGAT mengampuni. Banyak nama Allah pakai pola ini.',
      },
    },
    quiz: [
      {
        q: 'غَفَّارٌ menunjukkan...',
        options: ['Yang mengampuni', 'Yang sering/banyak mengampuni (penekanan)', 'Yang diampuni', 'Pengampunan'],
        correct: 1,
        explanation: 'Pola فَعَّال menunjukkan PENEKANAN/SERING. غَفَّارٌ = Maha Pengampun yang sangat sering mengampuni.',
      },
      {
        q: 'صَبُورٌ menggunakan pola...',
        options: ['فَعَّال', 'فَعُول', 'فَعِيل', 'مِفْعَال'],
        correct: 1,
        explanation: 'صَبُورٌ pakai pola فَعُول (f-a-uu-l). Artinya: sangat sabar.',
      },
      {
        q: 'Beda كَاتِبٌ dgn كَتَّابٌ?',
        options: ['Sama saja', 'كَاتِبٌ = penulis biasa; كَتَّابٌ = sangat banyak menulis', 'كَتَّابٌ pasif', 'Tidak ada beda makna'],
        correct: 1,
        explanation: 'كَاتِبٌ = isim fa\'il biasa (penulis). كَتَّابٌ = mubaalaghah (sangat banyak menulis / penulis ulung).',
      },
      {
        q: 'Mengapa banyak nama Allah pakai pola mubaalaghah?',
        options: ['Kebetulan', 'Untuk menunjukkan kesempurnaan & ke-Mutlak-an sifat Allah', 'Hanya tradisi', 'Tidak signifikan'],
        correct: 1,
        explanation: 'Pola mubaalaghah menekankan KESEMPURNAAN sifat. غَفُورٌ = bukan sekedar mengampuni, tapi MAHA Pengampun secara mutlak.',
      },
    ],
  },

  // ============ PELAJARAN 19 (PREMIUM) ============
  {
    id: 'shorf-19-tashghir',
    order: 19,
    isFree: false,
    title: 'Isim Tashghir',
    subtitle: 'Diminutif: pengecilan kata',
    emoji: '🪴',
    duration: '5 menit',
    color: '#a05536',
    xpReward: 30,
    theory: {
      intro: 'Isim Tashghir (اسْمُ التَّصْغِيرِ) adalah perubahan isim untuk menunjukkan ARTI KECIL, sayang, atau merendahkan. Pola dasar: فُعَيْلٌ untuk 3 huruf, فُعَيْعِلٌ untuk 4 huruf.',
      sections: [
        {
          title: 'Pola فُعَيْلٌ — Untuk 3 Huruf',
          body: 'Huruf 1 di-dhommah, huruf 2 di-fathah, tambah ya\' sukun, lalu huruf 3.',
          examples: [
            { ar: 'رَجُلٌ → رُجَيْلٌ', latin: 'rajul → rujail', id: 'lelaki → lelaki kecil' },
            { ar: 'كَلْبٌ → كُلَيْبٌ', latin: 'kalb → kulaib', id: 'anjing → anjing kecil' },
            { ar: 'حَسَنٌ → حُسَيْنٌ', latin: 'hasan → husain', id: 'baik → Husain (anak baik)' },
          ],
        },
        {
          title: 'Makna Tashghir',
          body: '(1) Pengecilan fisik. (2) Penghinaan/meremehkan. (3) Kasih sayang. (4) Mendekatkan waktu/jarak.',
          examples: [
            { ar: 'بَيْتٌ → بُيَيْتٌ', latin: 'bait → buyait', id: 'rumah → rumah kecil (fisik)' },
            { ar: 'شَاعِرٌ → شُوَيْعِرٌ', latin: 'syaa\'ir → syuwai\'ir', id: 'penyair → penyair kelas rendah (penghinaan)' },
            { ar: 'وَلَدٌ → وُلَيْدٌ', latin: 'walad → wulaid', id: 'anak → anak kesayangan (kasih sayang)' },
            { ar: 'قَبْلَ → قُبَيْلَ', latin: 'qabla → qubail', id: 'sebelum → sebentar sebelum (mendekat)' },
          ],
        },
        {
          title: 'Nama-Nama Populer dari Tashghir',
          body: 'Banyak nama orang Arab ternyata bentuk tashghir.',
          examples: [
            { ar: 'حُسَيْنٌ', latin: 'Husain', id: 'tashghir dari حَسَن (baik)' },
            { ar: 'زُبَيْرٌ', latin: 'Zubair', id: 'tashghir dari زَبْر (kuat)' },
            { ar: 'عُمَيْرٌ', latin: 'Umair', id: 'tashghir dari عَمْر (umur)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'لَا يَدْخُلُ الْجَنَّةَ إِلَّا نَفْسٌ مُسْلِمَةٌ',
        latin: 'laa yadkhulul-jannata illaa nafsun muslimah',
        surah: 'Hadits',
        ayatNum: '-',
        analysis: [
          { word: 'لَا يَدْخُلُ', type: 'Nahyi (fi\'il majzum)', note: '' },
          { word: 'الْجَنَّةَ', type: 'Maf\'ul bih', note: 'nashob' },
          { word: 'إِلَّا', type: 'Harf istitsna\'', note: 'kecuali' },
          { word: 'نَفْسٌ', type: 'Naib fa\'il / mustasna', note: 'jiwa' },
          { word: 'مُسْلِمَةٌ', type: 'Na\'at', note: 'yang muslim' },
        ],
        explanation: 'Bonus: kata "Husain" (cucu Nabi) adalah TASHGHIR dari "Hasan". Hasan & Husain — kakak adik. Hasan = "yang baik", Husain = "yang baik sekali / yang kecil yang baik" (bentuk afektif). Pengetahuan tashghir membuka makna nama-nama yang sering kita dengar.',
      },
    },
    quiz: [
      {
        q: 'Pola dasar tashghir untuk 3 huruf adalah...',
        options: ['فَاعِلٌ', 'فُعَيْلٌ', 'مَفْعُولٌ', 'فَعَّالٌ'],
        correct: 1,
        explanation: 'Pola tashghir 3 huruf: فُعَيْلٌ — dhommah, fathah, ya\' sukun, huruf 3.',
      },
      {
        q: 'Tashghir dari رَجُل adalah...',
        options: ['رَاجِل', 'رُجَيْل', 'مَرْجُول', 'رَجُول'],
        correct: 1,
        explanation: 'رَجُل → رُجَيْل (lelaki kecil) — pola فُعَيْل.',
      },
      {
        q: 'Husain adalah tashghir dari...',
        options: ['Hassan', 'Hasan', 'Husnu', 'Husna'],
        correct: 1,
        explanation: 'حُسَيْن adalah tashghir dari حَسَن — pola fu\'ail. Diberikan untuk adik dari Hasan.',
      },
      {
        q: 'Tashghir TIDAK bisa berarti...',
        options: ['Pengecilan fisik', 'Kasih sayang', 'Pertanyaan', 'Mendekatkan jarak/waktu'],
        correct: 2,
        explanation: 'Tashghir untuk: pengecilan, penghinaan, kasih sayang, mendekatkan. BUKAN untuk pertanyaan.',
      },
    ],
  },
];

export function getShorfLesson(id) {
  return SHORF_LESSONS.find((l) => l.id === id) || null;
}
