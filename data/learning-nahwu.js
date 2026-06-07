// data/learning-nahwu.js
// Pelajaran Nahwu (نحو) — sintaksis bahasa Arab klasik.
// 8 pelajaran fondasi: 3 gratis untuk preview, 5 sisanya Mahir.
//
// Tiap pelajaran:
//   - theory: penjelasan + sections (judul + body + examples) + Quran example
//   - quiz: 4-5 pilihan ganda dgn penjelasan jawaban benar
//   - xpReward: hadiah XP saat selesai quiz

export const NAHWU_LESSONS = [
  // ============ PELAJARAN 1 (FREE) ============
  {
    id: 'nahwu-1-pembagian-kata',
    order: 1,
    isFree: true,
    title: 'Pembagian Kata',
    subtitle: 'Isim, Fi\'il, dan Harf',
    emoji: '🔤',
    duration: '6 menit',
    color: '#0a4d3c',
    xpReward: 25,
    theory: {
      intro: 'Setiap kata dalam bahasa Arab pasti masuk ke salah satu dari 3 kategori: Isim (kata benda), Fi\'il (kata kerja), atau Harf (kata penghubung/partikel). Memahami pembagian ini adalah pintu masuk semua pelajaran Nahwu selanjutnya.',
      sections: [
        {
          title: 'Isim (الْاِسْمُ) — Kata Benda',
          body: 'Isim adalah kata yang menunjukkan sesuatu (orang, benda, tempat, sifat, makna abstrak) tanpa terkait waktu. Ciri-cirinya: bisa di-tanwin, bisa kemasukan alif-lam (الـ), dan biasanya didahului huruf jar.',
          examples: [
            { ar: 'كِتَابٌ', latin: 'kitaab', id: 'sebuah buku' },
            { ar: 'مَسْجِدٌ', latin: 'masjid', id: 'masjid' },
            { ar: 'جَمِيلٌ', latin: 'jamiil', id: 'indah' },
            { ar: 'مُحَمَّدٌ', latin: 'Muhammad', id: 'Muhammad (nama)' },
          ],
        },
        {
          title: 'Fi\'il (الْفِعْلُ) — Kata Kerja',
          body: 'Fi\'il adalah kata yang menunjukkan perbuatan dan terikat oleh waktu. Ada 3 macam: Fi\'il Madhi (lampau), Mudhori\' (sedang/akan), dan Amr (perintah).',
          examples: [
            { ar: 'كَتَبَ', latin: 'kataba', id: 'dia (lk) telah menulis' },
            { ar: 'يَكْتُبُ', latin: 'yaktubu', id: 'dia (lk) sedang/akan menulis' },
            { ar: 'اُكْتُبْ', latin: 'uktub', id: 'tulislah!' },
          ],
        },
        {
          title: 'Harf (الْحَرْفُ) — Partikel',
          body: 'Harf adalah kata yang tidak punya makna sendiri kecuali jika digabung dgn kata lain. Termasuk huruf jar, athaf, nida\', dan lainnya.',
          examples: [
            { ar: 'فِي', latin: 'fii', id: 'di dalam' },
            { ar: 'مِنْ', latin: 'min', id: 'dari' },
            { ar: 'وَ', latin: 'wa', id: 'dan' },
            { ar: 'يَا', latin: 'yaa', id: 'wahai (untuk memanggil)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
        latin: 'bismillaahir-rahmaanir-rahiim',
        surah: 'Al-Fatihah',
        ayatNum: 1,
        analysis: [
          { word: 'بِ', type: 'Harf', note: 'huruf jar' },
          { word: 'اسْمِ', type: 'Isim', note: 'kata benda — majrur karena huruf jar' },
          { word: 'اللَّهِ', type: 'Isim', note: 'lafdzul jalalah' },
          { word: 'الرَّحْمَنِ', type: 'Isim', note: 'sifat Allah' },
          { word: 'الرَّحِيمِ', type: 'Isim', note: 'sifat Allah' },
        ],
        explanation: 'Lihat: ayat pertama Al-Fatihah cuma terdiri dari 1 Harf (بِ) dan 4 Isim. Tidak ada Fi\'il di sini — itulah jumlah ismiyyah.',
      },
    },
    quiz: [
      {
        q: 'Manakah dari kata berikut yang termasuk Fi\'il?',
        options: ['كِتَابٌ', 'ذَهَبَ', 'فِي', 'مَسْجِدٌ'],
        correct: 1,
        explanation: 'ذَهَبَ (telah pergi) adalah Fi\'il Madhi karena menunjukkan perbuatan di masa lalu.',
      },
      {
        q: 'Kata مِنْ (min — dari) termasuk kategori?',
        options: ['Isim', 'Fi\'il', 'Harf', 'Mashdar'],
        correct: 2,
        explanation: 'مِنْ adalah huruf jar — termasuk kategori Harf karena tidak punya makna sendiri kecuali bersambung dgn kata lain.',
      },
      {
        q: 'Ciri-ciri utama Isim adalah...',
        options: ['Terikat waktu', 'Bisa kemasukan alif-lam (الـ)', 'Tidak bisa di-tanwin', 'Selalu di akhir kalimat'],
        correct: 1,
        explanation: 'Salah satu tanda Isim: bisa kemasukan alif-lam (الكِتَابُ) dan bisa di-tanwin (كِتَابٌ).',
      },
      {
        q: 'يَكْتُبُ termasuk fi\'il jenis apa?',
        options: ['Madhi', 'Mudhori\'', 'Amr', 'Mashdar'],
        correct: 1,
        explanation: 'يَكْتُبُ menunjukkan perbuatan yang sedang/akan terjadi — itu Fi\'il Mudhori\'.',
      },
    ],
  },

  // ============ PELAJARAN 2 (FREE) ============
  {
    id: 'nahwu-2-irab-dasar',
    order: 2,
    isFree: true,
    title: 'I\'rab Dasar',
    subtitle: 'Rofa\', Nashob, Jar, Jazm',
    emoji: '📐',
    duration: '7 menit',
    color: '#0a4d3c',
    xpReward: 30,
    theory: {
      intro: 'I\'rab adalah perubahan akhir kata berdasarkan posisi gramatikalnya dalam kalimat. Dalam bahasa Arab, harakat akhir kata berubah-ubah — bukan asal, melainkan menunjukkan fungsi kata itu (subjek, objek, dll). Ada 4 keadaan i\'rab utama.',
      sections: [
        {
          title: 'Rofa\' (رَفْعٌ) — Tanda: Dhommah',
          body: 'Posisi rofa\' biasanya untuk subjek (mubtada\', khobar, fa\'il). Tanda asli rofa\' adalah dhommah (ُ atau ٌ).',
          examples: [
            { ar: 'الْمُسْلِمُ مُجْتَهِدٌ', latin: 'al-muslimu mujtahidun', id: 'Muslim itu rajin (kedua kata rofa\')' },
            { ar: 'جَاءَ زَيْدٌ', latin: 'jaa\'a Zaidun', id: 'Zaid telah datang (Zaid = fa\'il, rofa\')' },
          ],
        },
        {
          title: 'Nashob (نَصْبٌ) — Tanda: Fathah',
          body: 'Posisi nashob biasanya untuk objek (maf\'ul bih), serta isim setelah inna & saudaranya. Tanda asli nashob adalah fathah (َ atau ً).',
          examples: [
            { ar: 'قَرَأْتُ الْكِتَابَ', latin: 'qara\'tul-kitaaba', id: 'Aku membaca buku itu (buku = maf\'ul, nashob)' },
            { ar: 'إِنَّ اللهَ غَفُورٌ', latin: 'innallaha ghafuur', id: 'Sungguh Allah Maha Pengampun' },
          ],
        },
        {
          title: 'Jar (جَرٌّ) — Tanda: Kasroh',
          body: 'Posisi jar khusus untuk Isim yang didahului huruf jar atau jadi mudhof ilaih. Tanda asli jar adalah kasroh (ِ atau ٍ).',
          examples: [
            { ar: 'فِي الْمَسْجِدِ', latin: 'fil-masjidi', id: 'di dalam masjid (masjid = majrur)' },
            { ar: 'كِتَابُ الطَّالِبِ', latin: 'kitaabuth-thaalibi', id: 'buku murid (murid = mudhof ilaih)' },
          ],
        },
        {
          title: 'Jazm (جَزْمٌ) — Tanda: Sukun',
          body: 'Posisi jazm khusus untuk Fi\'il Mudhori\' yang didahului huruf jazm (لَمْ، لاَ النَّاهِيَة، dll). Tanda asli jazm adalah sukun (ْ).',
          examples: [
            { ar: 'لَمْ يَكْتُبْ', latin: 'lam yaktub', id: 'dia belum menulis (yaktub = majzum)' },
            { ar: 'لاَ تَأْكُلْ', latin: 'laa ta\'kul', id: 'jangan makan! (ta\'kul = majzum)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        latin: 'lam yalid wa lam yuulad',
        surah: 'Al-Ikhlas',
        ayatNum: 3,
        analysis: [
          { word: 'لَمْ', type: 'Harf', note: 'huruf jazm' },
          { word: 'يَلِدْ', type: 'Fi\'il Mudhori\'', note: 'majzum (sukun di akhir)' },
          { word: 'وَ', type: 'Harf', note: 'wawu athaf' },
          { word: 'لَمْ', type: 'Harf', note: 'huruf jazm lagi' },
          { word: 'يُولَدْ', type: 'Fi\'il Mudhori\'', note: 'majzum (sukun di akhir)' },
        ],
        explanation: 'Perhatikan akhir يَلِدْ dan يُولَدْ — keduanya sukun (jazm) karena didahului لَمْ. Inilah contoh nyata i\'rab jazm dalam Al-Qur\'an.',
      },
    },
    quiz: [
      {
        q: 'Tanda asli i\'rab Rofa\' adalah...',
        options: ['Fathah', 'Kasroh', 'Dhommah', 'Sukun'],
        correct: 2,
        explanation: 'Rofa\' tandanya dhommah (ُ). Fa\'il dan mubtada\' biasanya rofa\'.',
      },
      {
        q: 'Pada kalimat قَرَأْتُ الْكِتَابَ، kata الْكِتَابَ ber-i\'rab apa?',
        options: ['Rofa\'', 'Nashob', 'Jar', 'Jazm'],
        correct: 1,
        explanation: 'الْكِتَابَ adalah maf\'ul bih (objek), maka di-nashob dgn tanda fathah di akhir.',
      },
      {
        q: 'Setelah huruf jar (مِنْ، فِي، عَلَى...), Isim ber-i\'rab apa?',
        options: ['Rofa\'', 'Nashob', 'Jar', 'Jazm'],
        correct: 2,
        explanation: 'Isim yang didahului huruf jar selalu majrur (jar), tandanya kasroh.',
      },
      {
        q: 'Apa fungsi huruf لَمْ?',
        options: ['Menge-rofa\' fi\'il', 'Menge-nashob isim', 'Menge-jazm fi\'il mudhori\'', 'Menge-jar isim'],
        correct: 2,
        explanation: 'لَمْ adalah huruf jazm — menyebabkan fi\'il mudhori\' setelahnya majzum (akhirnya sukun).',
      },
    ],
  },

  // ============ PELAJARAN 3 (FREE) ============
  {
    id: 'nahwu-3-mubtada-khobar',
    order: 3,
    isFree: true,
    title: 'Jumlah Ismiyyah',
    subtitle: 'Mubtada\' & Khobar',
    emoji: '🧱',
    duration: '6 menit',
    color: '#0a4d3c',
    xpReward: 30,
    theory: {
      intro: 'Jumlah Ismiyyah adalah kalimat yang dimulai dengan Isim. Strukturnya terdiri dari 2 unsur utama: Mubtada\' (subjek) dan Khobar (predikat). Keduanya selalu ber-i\'rab Rofa\'.',
      sections: [
        {
          title: 'Mubtada\' (الْمُبْتَدَأُ) — Pokok',
          body: 'Mubtada\' adalah isim yang menjadi subjek di awal kalimat. Biasanya berupa isim ma\'rifat (definitif) — punya alif-lam, nama orang, atau dhomir.',
          examples: [
            { ar: 'الطَّالِبُ مُجْتَهِدٌ', latin: 'ath-thaalibu mujtahidun', id: 'Murid itu rajin' },
            { ar: 'مُحَمَّدٌ رَسُولُ اللهِ', latin: 'Muhammadur Rasuulullah', id: 'Muhammad adalah utusan Allah' },
          ],
        },
        {
          title: 'Khobar (الْخَبَرُ) — Penjelasan',
          body: 'Khobar adalah isim/kata yang melengkapi mubtada\'. Khobar bisa mufrad (1 kata), jumlah (kalimat), atau syibhul jumlah (huruf jar + isim).',
          examples: [
            { ar: 'الْبَيْتُ كَبِيرٌ', latin: 'al-baitu kabiir', id: 'Rumah itu besar (khobar mufrad)' },
            { ar: 'زَيْدٌ فِي الْمَسْجِدِ', latin: 'Zaidun fil-masjid', id: 'Zaid di masjid (khobar syibhul jumlah)' },
            { ar: 'الْأُسْتَاذُ يَشْرَحُ الدَّرْسَ', latin: 'al-ustaadzu yasyrahud-dars', id: 'Ustadz menjelaskan pelajaran (khobar jumlah fi\'liyyah)' },
          ],
        },
        {
          title: 'Kunci: Keduanya Rofa\'',
          body: 'Baik mubtada\' maupun khobar mufrad SELALU ber-i\'rab rofa\' (akhirnya dhommah/tanwin dhom). Mubtada\' dan khobar juga harus sesuai dalam mufrad/mutsanna/jamak dan mudzakkar/mu\'annats.',
          examples: [
            { ar: 'الطَّالِبَانِ مُجْتَهِدَانِ', latin: 'ath-thaalibaani mujtahidaani', id: 'Dua murid itu rajin (mutsanna)' },
            { ar: 'الْمُسْلِمَاتُ صَالِحَاتٌ', latin: 'al-muslimaatu shaalihaat', id: 'Wanita-wanita muslim itu shalihah' },
          ],
        },
      ],
      quranExample: {
        ayat: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
        latin: 'Allaahu nuurus-samaawaati wal-ardh',
        surah: 'An-Nur',
        ayatNum: 35,
        analysis: [
          { word: 'اللَّهُ', type: 'Mubtada\'', note: 'rofa\' dgn dhommah' },
          { word: 'نُورُ', type: 'Khobar', note: 'rofa\' dgn dhommah; mudhof' },
          { word: 'السَّمَاوَاتِ', type: 'Mudhof ilaih', note: 'majrur dgn kasroh' },
          { word: 'وَ', type: 'Harf athaf', note: '' },
          { word: 'الْأَرْضِ', type: 'Ma\'thuf', note: 'mengikuti i\'rab mudhof ilaih' },
        ],
        explanation: 'Bentuk klasik jumlah ismiyyah: Mubtada\' (اللَّهُ) + Khobar (نُورُ). Keduanya rofa\'. Khobar di sini berupa idhofah (نُورُ السَّمَاوَاتِ).',
      },
    },
    quiz: [
      {
        q: 'Pada kalimat الْبَيْتُ كَبِيرٌ، mana yang mubtada\'?',
        options: ['الْبَيْتُ', 'كَبِيرٌ', 'Keduanya', 'Tidak ada'],
        correct: 0,
        explanation: 'الْبَيْتُ adalah mubtada\' (subjek di awal), كَبِيرٌ adalah khobar (menjelaskan mubtada\').',
      },
      {
        q: 'Mubtada\' dan khobar mufrad ber-i\'rab...',
        options: ['Nashob', 'Jar', 'Rofa\'', 'Jazm'],
        correct: 2,
        explanation: 'Mubtada\' dan khobar selalu rofa\' — tandanya dhommah di akhir.',
      },
      {
        q: 'Pada kalimat زَيْدٌ فِي الْمَسْجِدِ، khobar-nya berupa...',
        options: ['Isim mufrad', 'Jumlah fi\'liyyah', 'Syibhul jumlah (huruf jar + isim)', 'Tidak ada khobar'],
        correct: 2,
        explanation: 'فِي الْمَسْجِدِ adalah syibhul jumlah (huruf jar + isim) yang berfungsi sebagai khobar.',
      },
      {
        q: 'Yang BUKAN bentuk khobar adalah...',
        options: ['Isim mufrad', 'Jumlah fi\'liyyah', 'Syibhul jumlah', 'Huruf jar sendiri'],
        correct: 3,
        explanation: 'Huruf jar tidak bisa berdiri sendiri sbg khobar — harus bersama isim setelahnya (jadi syibhul jumlah).',
      },
    ],
  },

  // ============ PELAJARAN 4 (PREMIUM) ============
  {
    id: 'nahwu-4-fiil-fail',
    order: 4,
    isFree: false,
    title: 'Jumlah Fi\'liyyah',
    subtitle: 'Fi\'il & Fa\'il',
    emoji: '🎯',
    duration: '7 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Jumlah Fi\'liyyah adalah kalimat yang dimulai dengan Fi\'il. Strukturnya: Fi\'il + Fa\'il (subjek/pelaku). Fa\'il selalu ber-i\'rab Rofa\'.',
      sections: [
        {
          title: 'Fa\'il (الْفَاعِلُ) — Pelaku',
          body: 'Fa\'il adalah Isim yang melakukan perbuatan dalam fi\'il. Posisinya tepat setelah fi\'il, dan selalu ber-i\'rab rofa\'.',
          examples: [
            { ar: 'كَتَبَ زَيْدٌ', latin: 'kataba Zaidun', id: 'Zaid telah menulis (Zaid = fa\'il, rofa\')' },
            { ar: 'جَاءَ الْأُسْتَاذُ', latin: 'jaa\'al-ustaadzu', id: 'Ustadz telah datang' },
          ],
        },
        {
          title: 'Fa\'il bisa berupa Dhomir',
          body: 'Kadang fa\'il tidak tertulis eksplisit, tapi tersembunyi dalam bentuk dhomir (kata ganti). Misal: kataba = "dia (lk) telah menulis" — fa\'il-nya dhomir mustatir (هُوَ).',
          examples: [
            { ar: 'كَتَبَ الدَّرْسَ', latin: 'katabad-dars', id: 'dia menulis pelajaran (fa\'il = dhomir هُوَ tersembunyi)' },
            { ar: 'كَتَبْتُ الدَّرْسَ', latin: 'katabtud-dars', id: 'aku menulis pelajaran (تُ = fa\'il)' },
          ],
        },
        {
          title: 'Fi\'il mengikuti jenis Fa\'il',
          body: 'Kalau fa\'il mu\'annats (perempuan), fi\'il madhi diberi tambahan ت (تَ di akhir): كَتَبَتْ. Kalau mudzakkar (laki-laki): كَتَبَ.',
          examples: [
            { ar: 'كَتَبَتْ فَاطِمَةُ', latin: 'katabat Faathimah', id: 'Fatimah telah menulis' },
            { ar: 'ذَهَبَتْ مَرْيَمُ', latin: 'dzahabat Maryam', id: 'Maryam telah pergi' },
          ],
        },
      ],
      quranExample: {
        ayat: 'قَالَ رَبُّكَ لِلْمَلَائِكَةِ',
        latin: 'qaala rabbuka lil-malaa\'ikati',
        surah: 'Al-Baqarah',
        ayatNum: 30,
        analysis: [
          { word: 'قَالَ', type: 'Fi\'il Madhi', note: 'telah berfirman' },
          { word: 'رَبُّ', type: 'Fa\'il', note: 'rofa\' dgn dhommah; mudhof' },
          { word: 'كَ', type: 'Mudhof ilaih', note: 'dhomir mukhotob "kamu"' },
          { word: 'لِ', type: 'Harf jar', note: 'untuk' },
          { word: 'الْمَلَائِكَةِ', type: 'Majrur', note: 'kasroh karena huruf jar' },
        ],
        explanation: 'قَالَ adalah fi\'il, رَبُّكَ adalah fa\'il (rofa\'). Inilah struktur jumlah fi\'liyyah yang klasik.',
      },
    },
    quiz: [
      {
        q: 'Fa\'il selalu ber-i\'rab...',
        options: ['Nashob', 'Jar', 'Rofa\'', 'Jazm'],
        correct: 2,
        explanation: 'Fa\'il (pelaku) selalu rofa\' — tandanya dhommah di akhir.',
      },
      {
        q: 'Pada كَتَبَتْ فَاطِمَةُ، mana fa\'il-nya?',
        options: ['كَتَبَتْ', 'فَاطِمَةُ', 'ت di akhir kata pertama', 'Keduanya'],
        correct: 1,
        explanation: 'Fa\'il adalah فَاطِمَةُ. Huruf ت di akhir كَتَبَتْ hanya tanda bahwa fa\'il-nya mu\'annats (perempuan).',
      },
      {
        q: 'Kenapa fi\'il jadi كَتَبَتْ bukan كَتَبَ?',
        options: ['Karena fa\'il jamak', 'Karena fa\'il mu\'annats', 'Karena fi\'il madhi', 'Karena ada idhofah'],
        correct: 1,
        explanation: 'Huruf ت ditambah di akhir fi\'il madhi kalau fa\'il-nya mu\'annats (perempuan).',
      },
      {
        q: 'Pada كَتَبْتُ، fa\'il-nya adalah...',
        options: ['Tidak ada', 'Dhomir تُ (aku)', 'Kata setelahnya', 'Fi\'il itu sendiri'],
        correct: 1,
        explanation: 'تُ di akhir adalah dhomir muttashil yang menjadi fa\'il, artinya "aku".',
      },
    ],
  },

  // ============ PELAJARAN 5 (PREMIUM) ============
  {
    id: 'nahwu-5-maful-bih',
    order: 5,
    isFree: false,
    title: 'Maf\'ul Bih',
    subtitle: 'Objek dari perbuatan',
    emoji: '🎁',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 30,
    theory: {
      intro: 'Maf\'ul Bih (الْمَفْعُولُ بِهِ) adalah Isim yang menjadi sasaran/objek dari perbuatan fi\'il. Maf\'ul bih SELALU ber-i\'rab nashob (fathah).',
      sections: [
        {
          title: 'Posisi: setelah Fa\'il',
          body: 'Urutan dasar jumlah fi\'liyyah lengkap adalah: Fi\'il + Fa\'il + Maf\'ul bih.',
          examples: [
            { ar: 'قَرَأَ زَيْدٌ الْكِتَابَ', latin: 'qara\'a Zaidunil-kitaaba', id: 'Zaid membaca buku' },
            { ar: 'شَرِبَ الطِّفْلُ الْحَلِيبَ', latin: 'syaribath-thiflul-haliib', id: 'Anak itu minum susu' },
          ],
        },
        {
          title: 'Tanda Nashob: Fathah',
          body: 'Maf\'ul bih dikenal dari harakat akhirnya yang fathah (َ) atau tanwin nashob (ً).',
          examples: [
            { ar: 'أَكَلَ الطَّعَامَ', latin: 'akalath-tha\'aam', id: 'dia memakan makanan' },
            { ar: 'رَأَى أَسَدًا', latin: 'ra\'aa asadan', id: 'dia melihat seekor singa' },
          ],
        },
        {
          title: 'Bisa berupa Dhomir',
          body: 'Maf\'ul bih juga bisa berupa dhomir muttashil yang melekat di akhir fi\'il.',
          examples: [
            { ar: 'ضَرَبَهُ', latin: 'dharabahu', id: 'dia memukulnya (هُ = maf\'ul)' },
            { ar: 'أَكَلْتُهُ', latin: 'akaltuhu', id: 'aku memakannya (هُ = maf\'ul)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        latin: 'iyyaaka na\'budu wa iyyaaka nasta\'iin',
        surah: 'Al-Fatihah',
        ayatNum: 5,
        analysis: [
          { word: 'إِيَّاكَ', type: 'Maf\'ul bih', note: 'nashob; didahulukan untuk penekanan' },
          { word: 'نَعْبُدُ', type: 'Fi\'il Mudhori\'', note: 'kami menyembah; fa\'il dhomir نَ' },
          { word: 'وَ', type: 'Harf athaf', note: '' },
          { word: 'إِيَّاكَ', type: 'Maf\'ul bih', note: 'nashob; didahulukan lagi' },
          { word: 'نَسْتَعِينُ', type: 'Fi\'il Mudhori\'', note: 'kami minta tolong' },
        ],
        explanation: 'Normalnya: نَعْبُدُ إِيَّاكَ (kami menyembah-Mu). Tapi maf\'ul didahulukan جaya: إِيَّاكَ نَعْبُدُ — artinya "hanya kepada-Mu kami menyembah". Ini contoh maf\'ul bih yang menempati posisi awal kalimat.',
      },
    },
    quiz: [
      {
        q: 'Maf\'ul bih ber-i\'rab apa?',
        options: ['Rofa\'', 'Nashob', 'Jar', 'Jazm'],
        correct: 1,
        explanation: 'Maf\'ul bih (objek) selalu nashob dgn tanda fathah.',
      },
      {
        q: 'Pada قَرَأَ زَيْدٌ الْكِتَابَ، mana maf\'ul bih-nya?',
        options: ['قَرَأَ', 'زَيْدٌ', 'الْكِتَابَ', 'Tidak ada'],
        correct: 2,
        explanation: 'الْكِتَابَ adalah maf\'ul bih (buku yang dibaca) — akhirnya fathah karena nashob.',
      },
      {
        q: 'Urutan dasar jumlah fi\'liyyah lengkap adalah...',
        options: ['Fa\'il + Fi\'il + Maf\'ul', 'Fi\'il + Maf\'ul + Fa\'il', 'Fi\'il + Fa\'il + Maf\'ul bih', 'Maf\'ul + Fa\'il + Fi\'il'],
        correct: 2,
        explanation: 'Urutan klasik: Fi\'il dulu, lalu Fa\'il (pelaku), kemudian Maf\'ul bih (objek).',
      },
      {
        q: 'Pada ضَرَبَهُ، huruf ه di akhir berfungsi sebagai...',
        options: ['Fa\'il', 'Maf\'ul bih', 'Mudhof ilaih', 'Tidak ada fungsi'],
        correct: 1,
        explanation: 'هُ adalah dhomir muttashil yang menjadi maf\'ul bih, artinya "dia (objek)".',
      },
    ],
  },

  // ============ PELAJARAN 6 (PREMIUM) ============
  {
    id: 'nahwu-6-idhofah',
    order: 6,
    isFree: false,
    title: 'Idhofah',
    subtitle: 'Sandaran kata',
    emoji: '🔗',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 30,
    theory: {
      intro: 'Idhofah (الْإِضَافَةُ) adalah gabungan 2 isim di mana isim pertama (mudhof) bersandar pada isim kedua (mudhof ilaih). Hubungannya: kepemilikan, asal, jenis, dan lainnya.',
      sections: [
        {
          title: 'Mudhof (الْمُضَافُ)',
          body: 'Mudhof adalah isim pertama yang bersandar. Cirinya: TIDAK boleh ada alif-lam dan TIDAK ber-tanwin.',
          examples: [
            { ar: 'كِتَابُ الطَّالِبِ', latin: 'kitaabuth-thaalibi', id: 'buku murid (kitaabu = mudhof)' },
            { ar: 'بَابُ الْبَيْتِ', latin: 'baabul-baiti', id: 'pintu rumah' },
          ],
        },
        {
          title: 'Mudhof Ilaih (الْمُضَافُ إِلَيْهِ)',
          body: 'Mudhof ilaih adalah isim kedua tempat mudhof bersandar. SELALU ber-i\'rab Jar (kasroh).',
          examples: [
            { ar: 'بَيْتُ زَيْدٍ', latin: 'baitu Zaidin', id: 'rumah Zaid (Zaid = mudhof ilaih, majrur)' },
            { ar: 'كِتَابُ اللهِ', latin: 'kitaabullaahi', id: 'Kitab Allah' },
          ],
        },
        {
          title: 'I\'rab Mudhof mengikuti fungsi',
          body: 'I\'rab mudhof mengikuti posisinya dalam kalimat (bisa rofa\', nashob, atau jar). Tapi mudhof ilaih selalu majrur (kasroh).',
          examples: [
            { ar: 'جَاءَ رَسُولُ اللهِ', latin: 'jaa\'a Rasuulullah', id: 'Rasulullah datang (Rasuul rofa\' karena fa\'il)' },
            { ar: 'قَرَأْتُ كِتَابَ زَيْدٍ', latin: 'qara\'tu kitaaba Zaidin', id: 'aku membaca bukunya Zaid (kitaab nashob, Zaid jar)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        latin: 'al-hamdu lillaahi rabbil-\'aalamiin',
        surah: 'Al-Fatihah',
        ayatNum: 2,
        analysis: [
          { word: 'الْحَمْدُ', type: 'Mubtada\'', note: 'rofa\' dgn dhommah' },
          { word: 'لِ', type: 'Harf jar', note: '' },
          { word: 'اللَّهِ', type: 'Majrur', note: 'kasroh karena huruf jar (juga sbg khobar)' },
          { word: 'رَبِّ', type: 'Mudhof', note: 'badal/sifat dari lafdz Allah; majrur ikut' },
          { word: 'الْعَالَمِينَ', type: 'Mudhof ilaih', note: 'majrur dgn ya (jamak mudzakkar salim)' },
        ],
        explanation: 'رَبِّ الْعَالَمِينَ adalah idhofah klasik: رَبِّ = mudhof (tidak ber-tanwin & tidak ada alif-lam), الْعَالَمِينَ = mudhof ilaih (majrur). Artinya: "Tuhan semesta alam".',
      },
    },
    quiz: [
      {
        q: 'Mudhof ilaih selalu ber-i\'rab...',
        options: ['Rofa\'', 'Nashob', 'Jar', 'Bebas'],
        correct: 2,
        explanation: 'Mudhof ilaih selalu majrur (jar) dgn tanda kasroh di akhir.',
      },
      {
        q: 'Ciri mudhof adalah...',
        options: ['Punya alif-lam', 'Ber-tanwin', 'Tidak ber-tanwin & tidak ada alif-lam', 'Selalu rofa\''],
        correct: 2,
        explanation: 'Mudhof TIDAK boleh ada alif-lam dan TIDAK ber-tanwin — itu cirinya.',
      },
      {
        q: 'Pada كِتَابُ زَيْدٍ، mudhof-nya adalah...',
        options: ['كِتَابُ', 'زَيْدٍ', 'Keduanya', 'Tidak ada'],
        correct: 0,
        explanation: 'كِتَابُ adalah mudhof (isim yang bersandar). زَيْدٍ adalah mudhof ilaih (tempat sandarannya, majrur).',
      },
      {
        q: 'Pada رَسُولُ اللهِ, kenapa اللهِ majrur?',
        options: ['Karena ada huruf jar', 'Karena mudhof ilaih', 'Karena fa\'il', 'Karena maf\'ul bih'],
        correct: 1,
        explanation: 'اللهِ adalah mudhof ilaih dari رَسُولُ, sehingga majrur dgn kasroh.',
      },
    ],
  },

  // ============ PELAJARAN 7 (PREMIUM) ============
  {
    id: 'nahwu-7-naat-manut',
    order: 7,
    isFree: false,
    title: 'Na\'at & Man\'ut',
    subtitle: 'Sifat & yang disifati',
    emoji: '✨',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 30,
    theory: {
      intro: 'Na\'at (النَّعْتُ) atau sifat adalah Isim yang menjelaskan sifat dari Isim sebelumnya (Man\'ut). Na\'at SELALU mengikuti man\'ut dalam 4 hal: i\'rab, jenis, jumlah, dan ma\'rifat/nakirah.',
      sections: [
        {
          title: 'Aturan kesesuaian',
          body: 'Na\'at harus sama dgn man\'ut dalam: (1) i\'rab — rofa\', nashob, jar; (2) jenis — mudzakkar/mu\'annats; (3) jumlah — mufrad/mutsanna/jamak; (4) ma\'rifat/nakirah.',
          examples: [
            { ar: 'الطَّالِبُ الْمُجْتَهِدُ', latin: 'ath-thaalibul-mujtahid', id: 'murid yang rajin (keduanya ma\'rifat, rofa\', mufrad, mudzakkar)' },
            { ar: 'الطَّالِبَةُ الْمُجْتَهِدَةُ', latin: 'ath-thaalibatul-mujtahidah', id: 'murid perempuan yang rajin (keduanya mu\'annats)' },
          ],
        },
        {
          title: 'Mutsanna & Jamak juga ikut',
          body: 'Kalau man\'ut mutsanna (2), na\'at-nya juga mutsanna. Kalau jamak, na\'at juga jamak.',
          examples: [
            { ar: 'الطَّالِبَانِ الْمُجْتَهِدَانِ', latin: 'ath-thaalibaanil-mujtahidaan', id: 'dua murid yang rajin (mutsanna)' },
            { ar: 'الطُّلَّابُ الْمُجْتَهِدُونَ', latin: 'ath-thullaabul-mujtahiduun', id: 'murid-murid yang rajin (jamak mudzakkar salim)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ',
        latin: 'shiraathal-ladziina an\'amta \'alaihim',
        surah: 'Al-Fatihah',
        ayatNum: 7,
        analysis: [
          { word: 'صِرَاطَ', type: 'Maf\'ul/badal', note: 'nashob; jalan' },
          { word: 'الَّذِينَ', type: 'Na\'at', note: 'isim maushul; sifat dari صِرَاطَ' },
          { word: 'أَنْعَمْتَ', type: 'Fi\'il Madhi', note: 'Engkau beri nikmat' },
          { word: 'عَلَيْ', type: 'Harf jar', note: '' },
          { word: 'هِمْ', type: 'Dhomir', note: 'majrur' },
        ],
        explanation: 'Di ayat ini, الَّذِينَ adalah na\'at (sifat) dari صِرَاطَ. Jalan yang seperti apa? Yaitu jalan ORANG-ORANG YANG telah Engkau beri nikmat.',
      },
    },
    quiz: [
      {
        q: 'Na\'at harus sama dgn man\'ut dalam berapa hal?',
        options: ['2', '3', '4', '5'],
        correct: 2,
        explanation: 'Na\'at mengikuti man\'ut dalam 4 hal: i\'rab, jenis, jumlah, dan ma\'rifat/nakirah.',
      },
      {
        q: 'Pada الطَّالِبُ الْمُجْتَهِدُ، mana na\'at-nya?',
        options: ['الطَّالِبُ', 'الْمُجْتَهِدُ', 'Keduanya', 'Tidak ada'],
        correct: 1,
        explanation: 'الْمُجْتَهِدُ adalah na\'at (sifat). الطَّالِبُ adalah man\'ut (yang disifati).',
      },
      {
        q: 'Kalau man\'ut nashob, na\'at-nya...',
        options: ['Rofa\'', 'Nashob juga', 'Jar', 'Bebas'],
        correct: 1,
        explanation: 'Na\'at mengikuti i\'rab man\'ut. Kalau man\'ut nashob, na\'at juga nashob.',
      },
      {
        q: 'Kombinasi mana yang SALAH?',
        options: ['الطَّالِبُ الْمُجْتَهِدُ', 'طَالِبٌ مُجْتَهِدٌ', 'الطَّالِبُ مُجْتَهِدٌ', 'الطَّالِبَةُ الْمُجْتَهِدَةُ'],
        correct: 2,
        explanation: 'الطَّالِبُ مُجْتَهِدٌ tidak cocok karena man\'ut ma\'rifat tapi na\'at nakirah. Harus sama: keduanya ma\'rifat atau keduanya nakirah.',
      },
    ],
  },

  // ============ PELAJARAN 8 (PREMIUM) ============
  {
    id: 'nahwu-8-praktek-irab-ayat',
    order: 8,
    isFree: false,
    title: 'Praktek I\'rab Ayat',
    subtitle: 'Latihan i\'rab ayat-ayat pendek',
    emoji: '🎓',
    duration: '8 menit',
    color: '#a05536',
    xpReward: 50,
    theory: {
      intro: 'Saatnya menggabungkan semua pelajaran sebelumnya. Mari latih i\'rab ayat-ayat pendek Al-Qur\'an — fondasi yang sama untuk membaca tafsir & kitab kuning nanti.',
      sections: [
        {
          title: 'Contoh 1: Surat Al-Ikhlas ayat 1',
          body: 'قُلْ هُوَ اللَّهُ أَحَدٌ — "Katakanlah: Dia-lah Allah Yang Esa". Mari urai i\'rab-nya:',
          examples: [
            { ar: 'قُلْ', latin: 'qul', id: 'Fi\'il amr (perintah), fa\'il dhomir mustatir أَنْتَ' },
            { ar: 'هُوَ', latin: 'huwa', id: 'Dhomir munfashil, mubtada\' (rofa\')' },
            { ar: 'اللَّهُ', latin: 'Allahu', id: 'Khobar mubtada\' (rofa\') ATAU mubtada\' kedua' },
            { ar: 'أَحَدٌ', latin: 'ahad', id: 'Khobar terakhir (rofa\')' },
          ],
        },
        {
          title: 'Contoh 2: Surat An-Nas ayat 1',
          body: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ — "Katakanlah: Aku berlindung kepada Tuhan manusia".',
          examples: [
            { ar: 'قُلْ', latin: 'qul', id: 'Fi\'il amr' },
            { ar: 'أَعُوذُ', latin: 'a\'uudzu', id: 'Fi\'il mudhori\' (rofa\'), fa\'il dhomir أَنَا' },
            { ar: 'بِ', latin: 'bi-', id: 'Harf jar' },
            { ar: 'رَبِّ', latin: 'rabbi', id: 'Majrur (kasroh) sbg mudhof' },
            { ar: 'النَّاسِ', latin: 'an-naas', id: 'Mudhof ilaih (majrur)' },
          ],
        },
        {
          title: 'Tips i\'rab',
          body: '(1) Mulai dari mengenali jenis kata: isim/fi\'il/harf. (2) Tentukan apakah jumlah ismiyyah atau fi\'liyyah. (3) Cari mubtada\'-khobar atau fi\'il-fa\'il-maf\'ul. (4) Perhatikan huruf jar, idhofah, na\'at. (5) Konfirmasi dgn harakat akhir yang sesuai i\'rab.',
          examples: [],
        },
      ],
      quranExample: {
        ayat: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
        latin: 'inna ma\'al-\'usri yusran',
        surah: 'Al-Insyirah',
        ayatNum: 6,
        analysis: [
          { word: 'إِنَّ', type: 'Harf', note: 'huruf taukid; menge-nashob isim' },
          { word: 'مَعَ', type: 'Zhorof', note: 'isim zhorof, mansub; jadi khobar muqaddam' },
          { word: 'الْعُسْرِ', type: 'Mudhof ilaih', note: 'majrur dgn kasroh' },
          { word: 'يُسْرًا', type: 'Isim inna', note: 'mansub (mu\'akhor)' },
        ],
        explanation: 'Susunan klasik: إِنَّ + khobar (مَعَ الْعُسْرِ) + isim إِنَّ (يُسْرًا). Artinya: "Sesungguhnya bersama kesulitan ada kemudahan". Khobar didahulukan untuk penekanan.',
      },
    },
    quiz: [
      {
        q: 'Pada قُلْ هُوَ اللَّهُ أَحَدٌ, kata قُلْ adalah...',
        options: ['Fi\'il Madhi', 'Fi\'il Mudhori\'', 'Fi\'il Amr', 'Isim Fi\'il'],
        correct: 2,
        explanation: 'قُلْ adalah fi\'il amr (perintah), artinya "katakanlah!".',
      },
      {
        q: 'Pada بِرَبِّ النَّاسِ, kata النَّاسِ majrur karena...',
        options: ['Huruf jar بِ', 'Mudhof ilaih dari رَبِّ', 'Na\'at', 'Maf\'ul bih'],
        correct: 1,
        explanation: 'النَّاسِ adalah mudhof ilaih dari رَبِّ, sehingga majrur. Huruf jar بِ langsung mempengaruhi رَبِّ saja.',
      },
      {
        q: 'Pada إِنَّ اللَّهَ غَفُورٌ, kata اللَّهَ ber-i\'rab apa?',
        options: ['Rofa\'', 'Nashob', 'Jar', 'Jazm'],
        correct: 1,
        explanation: 'إِنَّ menge-nashob isim setelahnya. اللَّهَ adalah isim إِنَّ, di-nashob dgn fathah.',
      },
      {
        q: 'Setelah mempelajari Nahwu dasar, manfaat utamanya adalah...',
        options: ['Hafal kosakata', 'Bisa baca tanpa harakat', 'Memahami struktur ayat & teks Arab klasik', 'Lancar berbicara cepat'],
        correct: 2,
        explanation: 'Nahwu menguasai struktur kalimat — pintu untuk baca tafsir, kitab kuning, dan memahami nuansa ayat Al-Qur\'an.',
      },
    ],
  },
  ,
  // ============ PELAJARAN 9 (PREMIUM) ============
  {
    id: 'nahwu-9-kaana-akhowatuha',
    order: 9,
    isFree: false,
    title: 'Kaana wa Akhowatuha',
    subtitle: 'Saudara-saudara kaana — menge-rofa\' mubtada\' & menge-nashob khobar',
    emoji: '🌗',
    duration: '7 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Kaana (كَانَ) dan saudara-saudaranya adalah kelompok fi\'il yang masuk ke jumlah ismiyyah (mubtada\' + khobar). Efeknya: mubtada\' menjadi "isim kaana" (tetap rofa\'), dan khobar menjadi "khobar kaana" (di-NASHOB).',
      sections: [
        {
          title: 'Saudara-saudara Kaana',
          body: 'Selain كَانَ (telah/menjadi), ada: صَارَ (menjadi), أَصْبَحَ (di pagi hari), أَمْسَى (di sore hari), أَضْحَى (di waktu dhuha), ظَلَّ (sepanjang siang), بَاتَ (sepanjang malam), لَيْسَ (bukan). Semua bekerja sama.',
          examples: [
            { ar: 'كَانَ الْجَوُّ بَارِدًا', latin: 'kaanal-jawwu baaridan', id: 'Cuaca telah dingin (الجوّ rofa\' isim كان, باردًا nashob khobar كان)' },
            { ar: 'لَيْسَ الْكِتَابُ جَدِيدًا', latin: 'laisal-kitaabu jadiidan', id: 'Buku itu bukan baru (khobar nashob)' },
          ],
        },
        {
          title: 'Cara Mengenali',
          body: 'Cari fi\'il dari kelompok kaana di awal kalimat. Setelahnya: kata pertama = isim كان (rofa\'), kata kedua = khobar كان (nashob).',
          examples: [
            { ar: 'أَصْبَحَ الطَّالِبُ مُجْتَهِدًا', latin: 'ashbahath-thaalibu mujtahidan', id: 'Siswa itu menjadi rajin (di pagi hari)' },
            { ar: 'صَارَ التِّلْمِيذُ عَالِمًا', latin: 'shaarat-tilmiidzu \'aaliman', id: 'Murid itu menjadi orang berilmu' },
          ],
        },
        {
          title: 'Beda dgn Fi\'il Biasa',
          body: 'Bedanya كَانَ dgn fi\'il biasa: كَانَ TIDAK butuh fa\'il aktif — strukturnya tetap mubtada\'+khobar, hanya saja khobar-nya jadi nashob. Sementara fi\'il biasa butuh fa\'il dan bisa punya maf\'ul bih.',
          examples: [
            { ar: 'قَرَأَ زَيْدٌ الْكِتَابَ', latin: 'qara\'a Zaidunil-kitaab', id: 'Zaid membaca buku (fi\'il + fa\'il + maf\'ul)' },
            { ar: 'كَانَ زَيْدٌ قَارِئًا', latin: 'kaana Zaidun qaari\'an', id: 'Zaid adalah seorang pembaca (kaana + isim + khobar)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'وَكَانَ اللَّهُ غَفُورًا رَحِيمًا',
        latin: 'wa kaanallahu ghafuuran rahiimaa',
        surah: 'An-Nisa',
        ayatNum: 96,
        analysis: [
          { word: 'وَ', type: 'Harf athaf', note: '' },
          { word: 'كَانَ', type: 'Fi\'il Madhi naqis', note: 'salah satu saudara kaana' },
          { word: 'اللَّهُ', type: 'Isim كَانَ', note: 'rofa\' dgn dhommah' },
          { word: 'غَفُورًا', type: 'Khobar كَانَ', note: 'nashob dgn fathah/tanwin' },
          { word: 'رَحِيمًا', type: 'Khobar tsani', note: 'nashob, athaf' },
        ],
        explanation: 'Klasik: كَانَ + Allah (rofa\') + ghafuuran (nashob) + rahiiman (nashob). Lihat tanwin fathah di غَفُورًا dan رَحِيمًا — itulah tanda nashob untuk khobar كَانَ.',
      },
    },
    quiz: [
      {
        q: 'Pada كَانَ الْجَوُّ بَارِدًا, kata الْجَوُّ adalah...',
        options: ['Mubtada\'', 'Isim كَانَ', 'Khobar كَانَ', 'Fa\'il'],
        correct: 1,
        explanation: 'الْجَوُّ adalah isim كَانَ — tetap rofa\' (dhommah). Posisinya seperti mubtada\' tapi karena dimasuki كَانَ, jadi isim كان.',
      },
      {
        q: 'Khobar كَانَ ber-i\'rab...',
        options: ['Rofa\'', 'Nashob', 'Jar', 'Jazm'],
        correct: 1,
        explanation: 'Khobar كَانَ selalu nashob — itulah ciri kaana wa akhowatuha.',
      },
      {
        q: 'Manakah yang BUKAN saudara كَانَ?',
        options: ['صَارَ', 'أَصْبَحَ', 'إِنَّ', 'لَيْسَ'],
        correct: 2,
        explanation: 'إِنَّ adalah saudara-saudara INNA (kelompok berbeda) — menge-nashob ISIM, bukan khobar.',
      },
      {
        q: 'Pada لَيْسَ زَيْدٌ مُسَافِرًا, mana khobar لَيْسَ?',
        options: ['لَيْسَ', 'زَيْدٌ', 'مُسَافِرًا', 'Tidak ada'],
        correct: 2,
        explanation: 'مُسَافِرًا adalah khobar لَيْسَ, di-nashob dgn fathah/tanwin.',
      },
    ],
  },

  // ============ PELAJARAN 10 (PREMIUM) ============
  {
    id: 'nahwu-10-inna-akhowatuha',
    order: 10,
    isFree: false,
    title: 'Inna wa Akhowatuha',
    subtitle: 'Saudara-saudara inna — menge-nashob isim & menge-rofa\' khobar',
    emoji: '⚡',
    duration: '7 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Inna (إِنَّ) dan saudara-saudaranya adalah huruf yang masuk ke jumlah ismiyyah. Efeknya KEBALIKAN كَانَ: mubtada\' jadi "isim inna" (di-NASHOB), khobar jadi "khobar inna" (tetap rofa\').',
      sections: [
        {
          title: 'Saudara-saudara Inna',
          body: 'Yang termasuk: إِنَّ (sungguh), أَنَّ (bahwasanya), كَأَنَّ (seolah-olah), لَكِنَّ (tetapi), لَيْتَ (semoga/andai), لَعَلَّ (mudah-mudahan).',
          examples: [
            { ar: 'إِنَّ اللَّهَ غَفُورٌ', latin: 'innallaaha ghafuur', id: 'Sungguh Allah Maha Pengampun (الله nashob isim inna, غفور rofa\' khobar)' },
            { ar: 'لَيْتَ الشَّبَابَ يَعُودُ', latin: 'laitasy-syabaaba ya\'uud', id: 'Andai masa muda kembali' },
          ],
        },
        {
          title: 'Cara Mengenali',
          body: 'إِنَّ dan saudaranya selalu di awal kalimat. Kata setelahnya = isim إِنَّ (nashob — tandanya fathah). Kata terakhir = khobar إِنَّ (rofa\').',
          examples: [
            { ar: 'إِنَّ الْعِلْمَ نُورٌ', latin: 'innal-\'ilma nuurun', id: 'Sungguh ilmu adalah cahaya' },
            { ar: 'كَأَنَّ الْقَمَرَ لُؤْلُؤٌ', latin: 'ka\'annal-qamara lu\'lu\'un', id: 'Seakan-akan bulan itu mutiara' },
          ],
        },
        {
          title: 'Beda Inna & Anna',
          body: 'إِنَّ dipakai di awal kalimat atau setelah "qaala" (berkata). أَنَّ dipakai di tengah kalimat sbg masdar muawwal.',
          examples: [
            { ar: 'قَالَ إِنِّي عَبْدُ اللَّهِ', latin: 'qaala innii \'abdullah', id: 'Dia berkata: "Sungguh aku hamba Allah"' },
            { ar: 'عَلِمْتُ أَنَّكَ صَادِقٌ', latin: '\'alimtu annaka shaadiqun', id: 'Aku tahu bahwa kamu jujur' },
          ],
        },
      ],
      quranExample: {
        ayat: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
        latin: 'inna ma\'al-\'usri yusran',
        surah: 'Al-Insyirah',
        ayatNum: 6,
        analysis: [
          { word: 'إِنَّ', type: 'Harf taukid', note: 'menge-nashob isim, rofa\' khobar' },
          { word: 'مَعَ', type: 'Khobar إِنَّ muqaddam', note: 'zhorof, secara hukum rofa\'' },
          { word: 'الْعُسْرِ', type: 'Mudhof ilaih', note: 'majrur' },
          { word: 'يُسْرًا', type: 'Isim إِنَّ muakhor', note: 'nashob dgn fathah/tanwin' },
        ],
        explanation: 'يُسْرًا adalah isim إِنَّ — nashob (tanwin fathah). Khobar (مَعَ الْعُسْرِ) didahulukan untuk penekanan. Inilah uslub klasik yang sering di Qur\'an.',
      },
    },
    quiz: [
      {
        q: 'Isim إِنَّ ber-i\'rab...',
        options: ['Rofa\'', 'Nashob', 'Jar', 'Jazm'],
        correct: 1,
        explanation: 'إِنَّ menge-nashob isim setelahnya (mubtada\' jadi isim inna nashob).',
      },
      {
        q: 'Pada إِنَّ اللَّهَ غَفُورٌ, kata غَفُورٌ adalah...',
        options: ['Isim إِنَّ', 'Khobar إِنَّ', 'Fa\'il', 'Maf\'ul'],
        correct: 1,
        explanation: 'غَفُورٌ adalah khobar إِنَّ — tetap rofa\' (dhommah/tanwin dhom).',
      },
      {
        q: 'Manakah yang merupakan saudara إِنَّ?',
        options: ['كَانَ', 'لَيْتَ', 'صَارَ', 'أَصْبَحَ'],
        correct: 1,
        explanation: 'لَيْتَ (andai/semoga) adalah saudara إِنَّ. Yang lain adalah saudara كَانَ.',
      },
      {
        q: 'Efek إِنَّ ke khobar adalah...',
        options: ['Menge-nashob', 'Tetap rofa\'', 'Menge-jar', 'Menge-jazm'],
        correct: 1,
        explanation: 'Khobar إِنَّ tetap rofa\' — yang berubah cuma mubtada\' jadi isim inna nashob.',
      },
    ],
  },

  // ============ PELAJARAN 11 (PREMIUM) ============
  {
    id: 'nahwu-11-hal',
    order: 11,
    isFree: false,
    title: 'Hal',
    subtitle: 'Keterangan keadaan pelaku/objek',
    emoji: '🌬️',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Hal (الْحَالُ) adalah isim yang menjelaskan KEADAAN dari fa\'il (pelaku) atau maf\'ul (objek) saat perbuatan terjadi. Selalu nashob dan biasanya nakirah.',
      sections: [
        {
          title: 'Hal Mufrad',
          body: 'Bisa berupa satu kata sifat (isim mufrad) — di-nashob untuk menerangkan keadaan.',
          examples: [
            { ar: 'جَاءَ زَيْدٌ رَاكِبًا', latin: 'jaa\'a Zaidun raakiban', id: 'Zaid datang dalam keadaan naik (kendaraan)' },
            { ar: 'قَرَأْتُ الْكِتَابَ مَفْتُوحًا', latin: 'qara\'tul-kitaaba maftuuhan', id: 'Aku baca buku dalam keadaan terbuka' },
          ],
        },
        {
          title: 'Hal Jumlah',
          body: 'Bisa juga berupa kalimat (jumlah ismiyyah atau fi\'liyyah) yang dimulai dgn "wawu hal" (وَ).',
          examples: [
            { ar: 'جَاءَ زَيْدٌ وَهُوَ يَضْحَكُ', latin: 'jaa\'a Zaidun wa huwa yadhhak', id: 'Zaid datang sambil tertawa' },
            { ar: 'دَخَلَ الطَّالِبُ وَالْكِتَابُ بِيَدِهِ', latin: 'dakhalath-thaalibu wal-kitaabu biyadih', id: 'Murid masuk sambil buku di tangannya' },
          ],
        },
        {
          title: 'Sahibul Hal',
          body: 'Sahibul hal (pemilik keadaan) adalah orang/benda yang sedang di-deskripsikan. Bisa fa\'il atau maf\'ul. Hal dan sahibul hal harus cocok jenis & jumlahnya.',
          examples: [
            { ar: 'رَأَيْتُ الطَّالِبَةَ ذَاهِبَةً', latin: 'ra\'aitut-thaalibata dzaahibah', id: 'Aku melihat siswi itu sedang pergi (hal mu\'annats karena sahibul hal-nya pr)' },
            { ar: 'جَاءَ الطُّلَّابُ ضَاحِكِينَ', latin: 'jaa\'ath-thullaabu dhaahikiin', id: 'Para murid datang dalam keadaan tertawa (jamak)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'وَلَا تَمْشِ فِي الْأَرْضِ مَرَحًا',
        latin: 'wa laa tamsyi fil-ardhi marahaa',
        surah: 'Al-Isra',
        ayatNum: 37,
        analysis: [
          { word: 'وَ', type: 'Harf athaf', note: '' },
          { word: 'لَا', type: 'Harf nahi', note: 'jangan' },
          { word: 'تَمْشِ', type: 'Fi\'il Mudhori\'', note: 'majzum karena لا nahi' },
          { word: 'فِي الْأَرْضِ', type: 'Jar majrur', note: 'di muka bumi' },
          { word: 'مَرَحًا', type: 'Hal', note: 'nashob dgn fathah; menerangkan keadaan' },
        ],
        explanation: 'مَرَحًا (sombong/angkuh) adalah HAL yang menerangkan keadaan pelaku saat berjalan. "Janganlah engkau berjalan di bumi dalam keadaan sombong". Tanda nashob: fathah.',
      },
    },
    quiz: [
      {
        q: 'Hal ber-i\'rab...',
        options: ['Rofa\'', 'Nashob', 'Jar', 'Jazm'],
        correct: 1,
        explanation: 'Hal selalu nashob — tandanya fathah.',
      },
      {
        q: 'Pada جَاءَ زَيْدٌ رَاكِبًا, kata رَاكِبًا adalah...',
        options: ['Fa\'il', 'Maf\'ul', 'Hal', 'Khobar'],
        correct: 2,
        explanation: 'رَاكِبًا adalah hal — menerangkan keadaan Zaid (sahibul hal) saat datang.',
      },
      {
        q: 'Hal biasanya berupa isim...',
        options: ['Ma\'rifat', 'Nakirah', 'Mudhof', 'Tertanwin tanpa harakat'],
        correct: 1,
        explanation: 'Hal biasanya nakirah (tidak ada alif-lam). Sahibul hal yang ma\'rifat.',
      },
      {
        q: 'Pada جَاءَ زَيْدٌ وَهُوَ يَضْحَكُ, mana hal-nya?',
        options: ['زَيْدٌ', 'وَهُوَ يَضْحَكُ', 'يَضْحَكُ saja', 'هُوَ saja'],
        correct: 1,
        explanation: 'وَهُوَ يَضْحَكُ adalah hal jumlah ismiyyah yang dimulai dgn wawu hal. Artinya: "sambil tertawa".',
      },
    ],
  },

  // ============ PELAJARAN 12 (PREMIUM) ============
  {
    id: 'nahwu-12-naib-fail',
    order: 12,
    isFree: false,
    title: 'Naib al-Fa\'il',
    subtitle: 'Kalimat pasif (mabni majhul)',
    emoji: '🔄',
    duration: '7 menit',
    color: '#a05536',
    xpReward: 40,
    theory: {
      intro: 'Naib al-Fa\'il (نَائِبُ الْفَاعِلِ) adalah isim yang menggantikan posisi fa\'il dalam kalimat pasif. Saat fi\'il di-pasifkan (mabni majhul), fa\'il dibuang, dan maf\'ul bih naik posisi jadi naib al-fa\'il — i\'rab-nya jadi rofa\'.',
      sections: [
        {
          title: 'Cara Mem-Pasifkan Fi\'il',
          body: 'Fi\'il MADHI mabni majhul: dhommah huruf pertama + kasroh huruf sebelum akhir. Misal: كَتَبَ → كُتِبَ (ditulis).',
          examples: [
            { ar: 'ضَرَبَ → ضُرِبَ', latin: 'dharaba → dhuriba', id: 'memukul → dipukul' },
            { ar: 'فَتَحَ → فُتِحَ', latin: 'fataha → futiha', id: 'membuka → dibuka' },
            { ar: 'قَرَأَ → قُرِئَ', latin: 'qara\'a → quri\'a', id: 'membaca → dibaca' },
          ],
        },
        {
          title: 'Fi\'il Mudhori\' Majhul',
          body: 'Fi\'il MUDHORI\' mabni majhul: dhommah huruf mudhoro\'ah + fathah huruf sebelum akhir. Misal: يَكْتُبُ → يُكْتَبُ (sedang ditulis).',
          examples: [
            { ar: 'يَفْعَلُ → يُفْعَلُ', latin: 'yaf\'alu → yuf\'alu', id: 'sedang dilakukan' },
            { ar: 'يَقْرَأُ → يُقْرَأُ', latin: 'yaqra\'u → yuqra\'u', id: 'sedang dibaca' },
          ],
        },
        {
          title: 'Naib al-Fa\'il = Rofa\'',
          body: 'Setelah fi\'il majhul, isim setelahnya adalah naib al-fa\'il — ber-i\'rab rofa\' (sama seperti fa\'il aktif).',
          examples: [
            { ar: 'كُتِبَ الدَّرْسُ', latin: 'kutibad-darsu', id: 'Pelajaran telah ditulis (الدرسُ rofa\' sbg naib al-fa\'il)' },
            { ar: 'يُقْرَأُ الْقُرْآنُ', latin: 'yuqra\'ul-Qur\'aan', id: 'Al-Qur\'an sedang dibaca' },
          ],
        },
      ],
      quranExample: {
        ayat: 'وَإِذَا قُرِئَ الْقُرْآنُ فَاسْتَمِعُوا لَهُ',
        latin: 'wa idzaa quri\'al-Qur\'aanu fastami\'uu lah',
        surah: 'Al-A\'raf',
        ayatNum: 204,
        analysis: [
          { word: 'وَإِذَا', type: 'Harf syarat', note: 'apabila' },
          { word: 'قُرِئَ', type: 'Fi\'il Madhi Majhul', note: 'dibacakan; pola فُعِلَ' },
          { word: 'الْقُرْآنُ', type: 'Naib al-Fa\'il', note: 'rofa\' dgn dhommah' },
          { word: 'فَ', type: 'Harf jawab', note: 'maka' },
          { word: 'اسْتَمِعُوا', type: 'Fi\'il Amr', note: 'dengarkanlah (jamak)' },
        ],
        explanation: 'قُرِئَ adalah fi\'il madhi mabni majhul (dibacakan). الْقُرْآنُ adalah naib al-fa\'il — rofa\' (dhommah). "Apabila DIBACAKAN Al-Qur\'an, dengarkanlah".',
      },
    },
    quiz: [
      {
        q: 'Naib al-Fa\'il ber-i\'rab...',
        options: ['Rofa\'', 'Nashob', 'Jar', 'Jazm'],
        correct: 0,
        explanation: 'Naib al-fa\'il menggantikan posisi fa\'il, jadi rofa\' (dhommah).',
      },
      {
        q: 'Bentuk majhul dari كَتَبَ adalah...',
        options: ['كَاتِبٌ', 'كُتِبَ', 'مَكْتُوبٌ', 'كِتَابٌ'],
        correct: 1,
        explanation: 'كُتِبَ — pola fi\'il madhi majhul: dhommah huruf pertama + kasroh sebelum akhir.',
      },
      {
        q: 'Pada يُقْرَأُ الْقُرْآنُ, kata الْقُرْآنُ adalah...',
        options: ['Fa\'il', 'Maf\'ul', 'Naib al-Fa\'il', 'Hal'],
        correct: 2,
        explanation: 'يُقْرَأُ adalah fi\'il mudhori\' majhul. الْقُرْآنُ menggantikan fa\'il — naib al-fa\'il, rofa\'.',
      },
      {
        q: 'Pola fi\'il mudhori\' majhul adalah...',
        options: ['يَفْعُلُ', 'يُفْعَلُ', 'فُعِلَ', 'مَفْعُولٌ'],
        correct: 1,
        explanation: 'Mudhori\' majhul: dhommah huruf mudhoro\'ah + fathah sebelum akhir. يَكْتُبُ → يُكْتَبُ.',
      },
    ],
  },
  ,
  // ============ PELAJARAN 13 (PREMIUM) ============
  {
    id: 'nahwu-13-maful-mutlaq',
    order: 13,
    isFree: false,
    title: 'Maf\'ul Mutlaq',
    subtitle: 'Penekanan kata kerja dgn mashdar',
    emoji: '✊',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Maf\'ul Mutlaq (الْمَفْعُولُ الْمُطْلَقُ) adalah mashdar yang muncul setelah fi\'il-nya — fungsinya untuk MENEGASKAN, MENJELASKAN JENIS, atau MENGHITUNG JUMLAH perbuatan. Selalu nashob.',
      sections: [
        {
          title: 'Untuk Menegaskan (Taukid)',
          body: 'Mashdar dari fi\'il diulang untuk menekankan. Pola: fi\'il + mashdar-nya sebagai maf\'ul mutlaq.',
          examples: [
            { ar: 'ضَرَبَ زَيْدٌ ضَرْبًا', latin: 'dharaba Zaidun dharban', id: 'Zaid memukul dengan keras-kerasnya' },
            { ar: 'ذَكَرْتُ الْأَمْرَ ذِكْرًا', latin: 'dzakartul-amra dzikran', id: 'Aku menyebut perkara itu sungguh-sungguh' },
          ],
        },
        {
          title: 'Untuk Menjelaskan Jenis (Naw\')',
          body: 'Mashdar diberi tambahan sifat untuk menunjukkan BAGAIMANA perbuatan dilakukan.',
          examples: [
            { ar: 'ضَرَبْتُهُ ضَرْبًا شَدِيدًا', latin: 'dharabtuhu dharban syadiidan', id: 'Aku memukulnya dengan pukulan keras' },
            { ar: 'سَارَ السَّيْرَ الْجَمِيلَ', latin: 'saaras-sairal-jamiil', id: 'Dia berjalan dgn jalan yang indah' },
          ],
        },
        {
          title: 'Untuk Menghitung (\'Adad)',
          body: 'Mashdar muncul dgn angka untuk menunjukkan BERAPA KALI perbuatan terjadi.',
          examples: [
            { ar: 'ضَرَبْتُهُ ضَرْبَتَيْنِ', latin: 'dharabtuhu dharbataini', id: 'Aku memukulnya dua kali' },
            { ar: 'سَبَّحْتُ ثَلاَثَ تَسْبِيحَاتٍ', latin: 'sabbahtu tsalaata tasbiihaat', id: 'Aku bertasbih tiga kali' },
          ],
        },
      ],
      quranExample: {
        ayat: 'وَكَلَّمَ اللَّهُ مُوسَى تَكْلِيمًا',
        latin: 'wa kallamallahu Muusaa takliimaa',
        surah: 'An-Nisa',
        ayatNum: 164,
        analysis: [
          { word: 'وَ', type: 'Harf athaf', note: '' },
          { word: 'كَلَّمَ', type: 'Fi\'il Madhi', note: 'berbicara; wazan فَعَّلَ' },
          { word: 'اللَّهُ', type: 'Fa\'il', note: 'rofa\' dgn dhommah' },
          { word: 'مُوسَى', type: 'Maf\'ul bih', note: 'nashob dgn fathah muqaddarah' },
          { word: 'تَكْلِيمًا', type: 'Maf\'ul Mutlaq', note: 'mashdar dari كَلَّمَ; nashob — penegasan' },
        ],
        explanation: 'تَكْلِيمًا adalah mashdar dari كَلَّمَ yang berfungsi sebagai maf\'ul mutlaq. Artinya: "Allah BENAR-BENAR berbicara kepada Musa secara langsung". Penegasan untuk membantah keraguan bahwa Allah hanya berbicara melalui perantara.',
      },
    },
    quiz: [
      {
        q: 'Maf\'ul Mutlaq selalu berupa...',
        options: ['Fi\'il', 'Mashdar', 'Isim fa\'il', 'Huruf jar'],
        correct: 1,
        explanation: 'Maf\'ul mutlaq selalu mashdar dari fi\'il yang menyertainya.',
      },
      {
        q: 'I\'rab maf\'ul mutlaq adalah...',
        options: ['Rofa\'', 'Nashob', 'Jar', 'Jazm'],
        correct: 1,
        explanation: 'Maf\'ul mutlaq selalu nashob — tandanya fathah/tanwin fathah.',
      },
      {
        q: 'Pada ضَرَبْتُهُ ضَرْبَتَيْنِ, maf\'ul mutlaq berfungsi untuk...',
        options: ['Menegaskan', 'Menjelaskan jenis', 'Menghitung jumlah', 'Tidak ada fungsi'],
        correct: 2,
        explanation: 'ضَرْبَتَيْنِ artinya "dua kali pukulan" — menunjukkan JUMLAH (\'adad). Mutsanna dari ضَرْبَةٌ.',
      },
      {
        q: 'تَسْبِيحًا dalam فَسَبِّحْهُ تَسْبِيحًا adalah...',
        options: ['Fa\'il', 'Maf\'ul bih', 'Maf\'ul Mutlaq', 'Hal'],
        correct: 2,
        explanation: 'تَسْبِيحًا adalah mashdar dari سَبَّحَ — di sini fungsinya sebagai maf\'ul mutlaq untuk taukid: "bertasbih-lah dgn sungguh-sungguh".',
      },
    ],
  },

  // ============ PELAJARAN 14 (PREMIUM) ============
  {
    id: 'nahwu-14-zhorof',
    order: 14,
    isFree: false,
    title: 'Zhorof Zaman & Makan',
    subtitle: 'Keterangan waktu & tempat',
    emoji: '🕰️',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Zhorof (الظَّرْفُ) adalah isim yang menunjukkan WAKTU (zhorof zaman) atau TEMPAT (zhorof makan) terjadinya perbuatan. Secara teknis disebut juga Maf\'ul Fiih — selalu nashob.',
      sections: [
        {
          title: 'Zhorof Zaman (Waktu)',
          body: 'Menjawab "kapan?". Contoh kata: يَوْمَ، لَيْلَةَ، صَبَاحَ، مَسَاءَ، قَبْلَ، بَعْدَ، حِينَ، الآنَ.',
          examples: [
            { ar: 'صَلَّى الْعِشَاءَ لَيْلًا', latin: 'shallal-\'isyaa\'a lailan', id: 'Dia salat Isya pada malam hari' },
            { ar: 'سَأَزُورُكَ غَدًا', latin: 'sa\'azuuruka ghadan', id: 'Aku akan mengunjungimu besok' },
            { ar: 'قَرَأْتُ الْكِتَابَ صَبَاحَ الْجُمْعَةِ', latin: 'qara\'tul-kitaaba shabaahal-jumu\'ah', id: 'Aku baca buku Jumat pagi' },
          ],
        },
        {
          title: 'Zhorof Makan (Tempat)',
          body: 'Menjawab "di mana?". Contoh: أَمَامَ (di depan), وَرَاءَ (di belakang), فَوْقَ (di atas), تَحْتَ (di bawah), عِنْدَ (di sisi), حَوْلَ (sekitar).',
          examples: [
            { ar: 'جَلَسْتُ أَمَامَ الْأُسْتَاذِ', latin: 'jalastu amaamal-ustaadz', id: 'Aku duduk di depan ustadz' },
            { ar: 'الْكِتَابُ فَوْقَ الْمَكْتَبِ', latin: 'al-kitaabu fauqal-maktab', id: 'Buku di atas meja' },
          ],
        },
        {
          title: 'Beda Zhorof & Jar-Majrur',
          body: 'Zhorof TANPA huruf jar — langsung nashob. Sementara كلمة dgn huruf jar (فِي، عَلَى، عِنْدَ pakai في) jadi jar-majrur. Banyak yang keliru.',
          examples: [
            { ar: 'جَلَسْتُ أَمَامَ', latin: 'jalastu amaama', id: 'Aku duduk DI DEPAN (zhorof — nashob)' },
            { ar: 'جَلَسْتُ فِي الْبَيْتِ', latin: 'jalastu fil-bait', id: 'Aku duduk DI rumah (jar-majrur)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'فَاذْكُرُوا اللَّهَ كَذِكْرِكُمْ آبَاءَكُمْ أَوْ أَشَدَّ ذِكْرًا',
        latin: 'fadzkurullaaha kadzikrikum aabaa\'akum au asyadda dzikran',
        surah: 'Al-Baqarah',
        ayatNum: 200,
        analysis: [
          { word: 'فَاذْكُرُوا', type: 'Fi\'il Amr', note: 'maka ingatlah' },
          { word: 'اللَّهَ', type: 'Maf\'ul bih', note: 'nashob' },
          { word: 'كَذِكْرِكُمْ', type: 'Jar majrur', note: 'seperti pengingatan kalian' },
          { word: 'آبَاءَكُمْ', type: 'Maf\'ul bih dari mashdar', note: 'nashob' },
          { word: 'أَشَدَّ', type: 'Hal/Zhorof', note: 'lebih kuat lagi' },
          { word: 'ذِكْرًا', type: 'Tamyiz/Maf\'ul Mutlaq', note: 'nashob' },
        ],
        explanation: 'Ayat ini gabungan banyak konsep yang sudah kita pelajari — termasuk pemakaian zhorof seperti أَشَدَّ. Sebagai ulangan: perhatikan i\'rab tiap kata.',
      },
    },
    quiz: [
      {
        q: 'Zhorof selalu ber-i\'rab...',
        options: ['Rofa\'', 'Nashob', 'Jar', 'Jazm'],
        correct: 1,
        explanation: 'Zhorof zaman dan makan keduanya selalu nashob.',
      },
      {
        q: 'فَوْقَ termasuk zhorof apa?',
        options: ['Zaman', 'Makan', 'Hal', 'Tamyiz'],
        correct: 1,
        explanation: 'فَوْقَ (di atas) menunjukkan TEMPAT — zhorof makan.',
      },
      {
        q: 'Pada سَأَزُورُكَ غَدًا, kata غَدًا adalah...',
        options: ['Maf\'ul bih', 'Hal', 'Zhorof Zaman', 'Mubtada\''],
        correct: 2,
        explanation: 'غَدًا (besok) menunjukkan WAKTU — zhorof zaman, nashob.',
      },
      {
        q: 'Apa beda أَمَامَ dgn فِي?',
        options: ['Sama saja', 'أَمَامَ zhorof (langsung nashob); فِي huruf jar', 'فِي zhorof; أَمَامَ huruf jar', 'Keduanya huruf jar'],
        correct: 1,
        explanation: 'أَمَامَ adalah zhorof (isim yg menunjukkan tempat — nashob langsung). فِي adalah huruf jar yang membuat isim setelahnya majrur.',
      },
    ],
  },

  // ============ PELAJARAN 15 (PREMIUM) ============
  {
    id: 'nahwu-15-munada',
    order: 15,
    isFree: false,
    title: 'Munada',
    subtitle: 'Panggilan dengan يَا',
    emoji: '📣',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 30,
    theory: {
      intro: 'Munada (الْمُنَادَى) adalah isim yang dipanggil — biasanya didahului huruf nida\' (yang paling sering: يَا). Hukum i\'rab-nya tergantung jenis isim: ada yang mansub, ada yang dibinasakan dgn dhommah.',
      sections: [
        {
          title: 'Munada Mufrad Ma\'rifat — Dibinasakan dgn Dhommah',
          body: 'Kalau munada-nya nama orang atau isim mufrad ma\'rifat, dibinasakan (mabni) dgn dhommah. Tidak ada tanwin.',
          examples: [
            { ar: 'يَا زَيْدُ', latin: 'yaa Zaidu', id: 'Wahai Zaid!' },
            { ar: 'يَا مُحَمَّدُ', latin: 'yaa Muhammadu', id: 'Wahai Muhammad!' },
            { ar: 'يَا اللَّهُ', latin: 'yaa Allaahu', id: 'Wahai Allah!' },
          ],
        },
        {
          title: 'Munada Mudhof — Nashob',
          body: 'Kalau munada-nya mudhof (idhofah), maka di-NASHOB.',
          examples: [
            { ar: 'يَا عَبْدَ اللَّهِ', latin: 'yaa \'abdallaah', id: 'Wahai hamba Allah! (nashob)' },
            { ar: 'يَا رَسُولَ اللَّهِ', latin: 'yaa rasuulallaah', id: 'Wahai Rasul Allah!' },
          ],
        },
        {
          title: 'Munada Nakirah & Syabihul Mudhof — Nashob',
          body: 'Kalau munada-nya nakirah (umum) atau nakirah yang menyerupai mudhof, juga nashob.',
          examples: [
            { ar: 'يَا رَجُلًا', latin: 'yaa rajulan', id: 'Wahai seorang lelaki! (memanggil umum)' },
            { ar: 'يَا حَافِظًا كَلَامَ اللَّهِ', latin: 'yaa haafizhan kalaamallaah', id: 'Wahai penghafal Kalam Allah!' },
          ],
        },
      ],
      quranExample: {
        ayat: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ',
        latin: 'yaa ayyuhal-ladziina aamanut-taqullaah',
        surah: 'Al-Maidah',
        ayatNum: 35,
        analysis: [
          { word: 'يَا', type: 'Harf nida\'', note: 'untuk panggilan' },
          { word: 'أَيُّ', type: 'Munada', note: 'dibinasakan dgn dhommah' },
          { word: 'هَا', type: 'Harf tanbih', note: 'penambah peringatan' },
          { word: 'الَّذِينَ آمَنُوا', type: 'Sifat munada', note: 'orang-orang yang beriman' },
          { word: 'اتَّقُوا', type: 'Fi\'il Amr', note: 'bertakwalah' },
        ],
        explanation: 'يَا أَيُّهَا adalah formula panggilan klasik yg sangat sering di Qur\'an. أَيُّ adalah munada mufrad — dibinasakan dgn dhommah. Diperkuat dgn هَا (penegasan: "kalian yang beriman, perhatikanlah!").',
      },
    },
    quiz: [
      {
        q: 'Munada mufrad ma\'rifat seperti يَا زَيْدُ ber-i\'rab...',
        options: ['Rofa\' dgn dhommah', 'Mabni atas dhommah (tanpa tanwin)', 'Nashob dgn fathah', 'Jar dgn kasroh'],
        correct: 1,
        explanation: 'Munada nama orang dibinasakan (mabni) atas dhommah — tidak punya tanwin, tidak berubah i\'rab-nya.',
      },
      {
        q: 'Pada يَا عَبْدَ اللَّهِ, kata عَبْدَ ber-i\'rab apa?',
        options: ['Mabni dhommah', 'Mansub (nashob)', 'Majrur', 'Marfu\''],
        correct: 1,
        explanation: 'عَبْدَ adalah mudhof — kalau munada-nya mudhof, di-nashob dgn fathah.',
      },
      {
        q: 'Huruf nida\' yang paling sering dipakai adalah...',
        options: ['فِي', 'يَا', 'إِنَّ', 'هَلْ'],
        correct: 1,
        explanation: 'يَا adalah huruf nida\' paling umum. Yang lain: أَيَا، هَيَا (jauh), أَيْ (dekat).',
      },
      {
        q: 'Apa peran هَا dalam يَا أَيُّهَا?',
        options: ['Mudhof ilaih', 'Harf tanbih (penegasan/peringatan)', 'Maf\'ul', 'Dhomir'],
        correct: 1,
        explanation: 'هَا di sini adalah harf tanbih — memperingatkan / menarik perhatian pendengar.',
      },
    ],
  },

  // ============ PELAJARAN 16 (PREMIUM) ============
  {
    id: 'nahwu-16-isim-maushul',
    order: 16,
    isFree: false,
    title: 'Isim Maushul',
    subtitle: 'Kata sambung الذي، التي، ما، من',
    emoji: '🔗',
    duration: '7 menit',
    color: '#a05536',
    xpReward: 40,
    theory: {
      intro: 'Isim Maushul (الْاِسْمُ الْمَوْصُولُ) adalah kata yang menghubungkan dgn kalimat berikutnya (silah). Mirip "yang" / "siapa" / "apa" dlm bahasa Indonesia. Mabni — tidak berubah harakat akhirnya.',
      sections: [
        {
          title: 'Isim Maushul Khusus',
          body: 'Berdasarkan jenis & jumlah: الَّذِي (lk mufrad), الَّتِي (pr mufrad), اللَّذَانِ (lk mutsanna), اللَّتَانِ (pr mutsanna), الَّذِينَ (lk jamak), اللَّاتِي / اللَّوَاتِي (pr jamak).',
          examples: [
            { ar: 'الطَّالِبُ الَّذِي يَدْرُسُ', latin: 'ath-thaalibul-ladzii yadrus', id: 'Murid yang sedang belajar' },
            { ar: 'الطَّالِبَةُ الَّتِي قَرَأَتْ', latin: 'ath-thaalibatul-latii qara\'at', id: 'Siswi yang membaca' },
            { ar: 'الْمُسْلِمُونَ الَّذِينَ آمَنُوا', latin: 'al-muslimuunal-ladziina aamanuu', id: 'Muslim yang beriman' },
          ],
        },
        {
          title: 'Silah al-Maushul',
          body: 'Setiap isim maushul WAJIB diikuti silah — kalimat lengkap (bisa jumlah ismiyyah, fi\'liyyah, atau syibhul jumlah) yang mengandung dhomir kembali (\'aaid) ke maushul.',
          examples: [
            { ar: 'الْكِتَابُ الَّذِي اشْتَرَيْتُهُ', latin: 'al-kitaabul-ladziisytaraituh', id: 'Buku yang aku beli (هُ kembali ke kitaab)' },
            { ar: 'الْأَمْرُ الَّذِي تَحَدَّثْنَا عَنْهُ', latin: 'al-amrul-ladzii tahaddatsnaa \'anh', id: 'Perkara yang kita bicarakan tentangnya' },
          ],
        },
        {
          title: 'Isim Maushul Umum: مَا & مَنْ',
          body: 'مَنْ untuk yang BERAKAL (siapa). مَا untuk yang TIDAK BERAKAL (apa). Mabni — tidak berubah.',
          examples: [
            { ar: 'مَنْ يَجْتَهِدْ يَنْجَحْ', latin: 'man yajtahid yanjah', id: 'Siapa yang bersungguh-sungguh, dia akan sukses' },
            { ar: 'لِلَّهِ مَا فِي السَّمَاوَاتِ', latin: 'lillaahi maa fis-samaawaat', id: 'Milik Allah apa yang ada di langit' },
          ],
        },
      ],
      quranExample: {
        ayat: 'الْحَمْدُ لِلَّهِ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ',
        latin: 'al-hamdu lillaahil-ladzii khalaqas-samaawaati wal-ardh',
        surah: 'Al-An\'am',
        ayatNum: 1,
        analysis: [
          { word: 'الْحَمْدُ', type: 'Mubtada\'', note: 'rofa\'' },
          { word: 'لِلَّهِ', type: 'Khobar (jar-majrur)', note: 'untuk Allah' },
          { word: 'الَّذِي', type: 'Isim Maushul', note: 'na\'at dari lafdz Allah; mabni' },
          { word: 'خَلَقَ', type: 'Silah (Fi\'il)', note: 'menciptakan; fa\'il dhomir هُوَ kembali ke الَّذِي' },
          { word: 'السَّمَاوَاتِ', type: 'Maf\'ul bih', note: 'nashob dgn kasroh (jamak mu\'annats salim)' },
        ],
        explanation: 'الَّذِي خَلَقَ — isim maushul + silah-nya. خَلَقَ adalah silah, dgn dhomir mustatir (هُوَ) sbg fa\'il yang kembali ke الَّذِي. Pola ini SANGAT sering di Qur\'an untuk menyifati Allah.',
      },
    },
    quiz: [
      {
        q: 'Isim maushul untuk pelaku perempuan tunggal adalah...',
        options: ['الَّذِي', 'الَّتِي', 'الَّذِينَ', 'مَنْ'],
        correct: 1,
        explanation: 'الَّتِي untuk perempuan mufrad. الَّذِي untuk laki-laki mufrad.',
      },
      {
        q: 'Setelah isim maushul WAJIB ada...',
        options: ['Huruf jar', 'Silah (kalimat lengkap dgn dhomir kembali)', 'Mashdar', 'Maf\'ul'],
        correct: 1,
        explanation: 'Setelah isim maushul harus ada silah — kalimat yang melengkapi maknanya, mengandung dhomir kembali ke maushul.',
      },
      {
        q: 'Kapan dipakai مَنْ vs مَا?',
        options: ['Sama saja', 'مَنْ untuk berakal, مَا untuk tidak berakal', 'مَا untuk pertanyaan saja', 'مَنْ hanya untuk Allah'],
        correct: 1,
        explanation: 'مَنْ untuk berakal (manusia, malaikat, jin). مَا untuk tidak berakal (benda, hewan, abstrak).',
      },
      {
        q: 'Pada الْكِتَابُ الَّذِي اشْتَرَيْتُهُ, dhomir هُ kembali ke...',
        options: ['الَّذِي', 'الْكِتَابُ', 'تُ', 'Tidak ada'],
        correct: 1,
        explanation: 'هُ adalah dhomir \'aaid (kembali) ke الْكِتَابُ — buku yang aku beli IT.',
      },
    ],
  },
  ,
  // ============ PELAJARAN 17 (PREMIUM) ============
  {
    id: 'nahwu-17-tamyiz',
    order: 17,
    isFree: false,
    title: 'Tamyiz',
    subtitle: 'Spesifikasi & penjelas',
    emoji: '🎯',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Tamyiz (التَّمْيِيزُ) adalah isim nakirah yang muncul setelah kata yang umum/samar untuk MENJELASKAN. Mirip "dalam hal apa?" Selalu nashob.',
      sections: [
        {
          title: 'Tamyiz Bilangan',
          body: 'Setelah bilangan tertentu (11-99), kata yang dihitung jadi tamyiz nashob mufrad.',
          examples: [
            { ar: 'عِشْرُونَ طَالِبًا', latin: '\'isyruuna thaaliban', id: 'dua puluh murid (طَالِبًا nashob tamyiz)' },
            { ar: 'تِسْعَةٌ وَتِسْعُونَ كِتَابًا', latin: 'tis\'atun wa tis\'uuna kitaaban', id: 'sembilan puluh sembilan buku' },
          ],
        },
        {
          title: 'Tamyiz Penjelas Kalimat',
          body: 'Untuk menjelaskan kekaburan dalam kalimat. Misal: "lebih besar" — DALAM HAL apa? Tamyiz menjawab.',
          examples: [
            { ar: 'هُوَ أَكْبَرُ مِنْكَ سِنًّا', latin: 'huwa akbaru minka sinnan', id: 'Dia lebih besar darimu dalam hal usia (سِنًّا nashob tamyiz)' },
            { ar: 'فَجَّرْنَا الْأَرْضَ عُيُونًا', latin: 'fajjarnal-ardha \'uyuunan', id: 'Kami pancarkan bumi (dgn) mata-air-mata-air' },
          ],
        },
        {
          title: 'Tamyiz Mashdar',
          body: 'Setelah mashdar atau angka mashdar untuk specifikasi.',
          examples: [
            { ar: 'لِي مِثْلُهُ كِتَابًا', latin: 'lii mitsluhu kitaaban', id: 'Aku punya semisalnya berupa buku' },
            { ar: 'طَابَ زَيْدٌ نَفْسًا', latin: 'thaaba Zaidun nafsan', id: 'Zaid baik dalam hal jiwa' },
          ],
        },
      ],
      quranExample: {
        ayat: 'وَاشْتَعَلَ الرَّأْسُ شَيْبًا',
        latin: 'wasy-ta\'alar-ra\'su syaiba',
        surah: 'Maryam',
        ayatNum: 4,
        analysis: [
          { word: 'وَ', type: 'Harf athaf', note: '' },
          { word: 'اشْتَعَلَ', type: 'Fi\'il Madhi', note: 'menyala/memutih; wazan افْتَعَلَ' },
          { word: 'الرَّأْسُ', type: 'Fa\'il', note: 'rofa\' dgn dhommah; kepala' },
          { word: 'شَيْبًا', type: 'Tamyiz', note: 'nashob dgn fathah/tanwin; uban' },
        ],
        explanation: 'شَيْبًا adalah tamyiz — kepala memutih DALAM HAL apa? UBAN. Doa Nabi Zakaria: "Dan kepalaku telah memutih (oleh) uban". Konstruksi yang sangat indah secara sastra.',
      },
    },
    quiz: [
      {
        q: 'Tamyiz ber-i\'rab...',
        options: ['Rofa\'', 'Nashob', 'Jar', 'Jazm'],
        correct: 1,
        explanation: 'Tamyiz selalu nashob — tandanya fathah/tanwin fathah.',
      },
      {
        q: 'Pada عِشْرُونَ طَالِبًا, kata طَالِبًا adalah...',
        options: ['Maf\'ul', 'Hal', 'Tamyiz', 'Mubtada\''],
        correct: 2,
        explanation: 'Setelah bilangan 11-99, yang dihitung jadi tamyiz nashob mufrad.',
      },
      {
        q: 'Tamyiz biasanya berupa isim...',
        options: ['Ma\'rifat', 'Nakirah', 'Mudhof', 'Berupa fi\'il'],
        correct: 1,
        explanation: 'Tamyiz hampir selalu nakirah (tidak ada alif-lam).',
      },
      {
        q: 'Fungsi utama tamyiz adalah...',
        options: ['Menggantikan fa\'il', 'Menjelaskan/spesifikasi sesuatu yang samar', 'Menyebut waktu', 'Memanggil orang'],
        correct: 1,
        explanation: 'Tamyiz menjawab "dalam hal apa?" — menjelaskan dimensi atau spesifikasi yang sebelumnya samar.',
      },
    ],
  },

  // ============ PELAJARAN 18 (PREMIUM) ============
  {
    id: 'nahwu-18-mustasna',
    order: 18,
    isFree: false,
    title: 'Mustasna',
    subtitle: 'Pengecualian dgn إِلَّا',
    emoji: '➖',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Mustasna (الْمُسْتَثْنَى) adalah isim yang dikecualikan setelah huruf istitsna\' (paling sering: إِلَّا). I\'rab-nya tergantung apakah kalimat positif/negatif dan apakah mustasna minhu disebutkan atau tidak.',
      sections: [
        {
          title: 'Kalimat Positif Lengkap — Mustasna Nashob',
          body: 'Kalau kalimatnya positif (mujab) dan mustasna minhu disebutkan, mustasna WAJIB nashob.',
          examples: [
            { ar: 'جَاءَ الطُّلَّابُ إِلَّا زَيْدًا', latin: 'jaa\'ath-thullaabu illaa Zaidan', id: 'Murid-murid datang kecuali Zaid (Zaid nashob)' },
            { ar: 'قَرَأْتُ الْكُتُبَ إِلَّا وَاحِدًا', latin: 'qara\'tul-kutuba illaa waahidan', id: 'Aku baca buku-buku kecuali satu' },
          ],
        },
        {
          title: 'Kalimat Negatif — Mustasna Mengikuti Mustasna Minhu',
          body: 'Kalau kalimatnya negatif (manfi) dan mustasna minhu disebutkan, mustasna boleh mengikuti i\'rab mustasna minhu (badal) atau nashob.',
          examples: [
            { ar: 'مَا جَاءَ أَحَدٌ إِلَّا زَيْدٌ', latin: 'maa jaa\'a ahadun illaa Zaidun', id: 'Tidak datang seorangpun kecuali Zaid (Zaid rofa\' ikut أَحَدٌ)' },
          ],
        },
        {
          title: 'Mustasna Minhu Tidak Disebutkan — Sesuai Kebutuhan',
          body: 'Kalau mustasna minhu tidak ada, mustasna ber-i\'rab sesuai kebutuhan kalimat. Sering disebut "istitsna\' mufarragh".',
          examples: [
            { ar: 'مَا جَاءَ إِلَّا زَيْدٌ', latin: 'maa jaa\'a illaa Zaidun', id: 'Tidak ada yang datang kecuali Zaid (Zaid jadi fa\'il, rofa\')' },
            { ar: 'مَا قَرَأْتُ إِلَّا الْكِتَابَ', latin: 'maa qara\'tu illal-kitaab', id: 'Aku tidak baca kecuali buku (buku jadi maf\'ul, nashob)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'لَا إِلَهَ إِلَّا اللَّهُ',
        latin: 'laa ilaaha illallaah',
        surah: 'Muhammad',
        ayatNum: 19,
        analysis: [
          { word: 'لَا', type: 'Harf nafi jinsi', note: 'tidak ada sama sekali' },
          { word: 'إِلَهَ', type: 'Isim لَا', note: 'mansub atas fathah; "tuhan"' },
          { word: 'إِلَّا', type: 'Harf istitsna\'', note: 'kecuali' },
          { word: 'اللَّهُ', type: 'Mustasna / Badal', note: 'rofa\' ikut khobar لَا yg mahdzuf' },
        ],
        explanation: 'Kalimat tauhid paling masyhur. Pola: لَا + isim لَا + إِلَّا + mustasna. اللَّهُ rofa\' karena mengikuti badal dari khobar لَا yang mahdzuf (disembunyikan). "Tidak ada tuhan KECUALI Allah".',
      },
    },
    quiz: [
      {
        q: 'Pada جَاءَ الطُّلَّابُ إِلَّا زَيْدًا, kenapa زَيْدًا nashob?',
        options: ['Karena kalimat negatif', 'Karena maf\'ul bih', 'Karena mustasna di kalimat positif lengkap', 'Karena tamyiz'],
        correct: 2,
        explanation: 'Di kalimat positif (mujab) dgn mustasna minhu disebutkan, mustasna WAJIB nashob.',
      },
      {
        q: 'Huruf istitsna\' yang paling umum adalah...',
        options: ['فِي', 'إِلَّا', 'إِنَّ', 'لَيْتَ'],
        correct: 1,
        explanation: 'إِلَّا (kecuali) adalah huruf istitsna\' paling sering dipakai.',
      },
      {
        q: 'Pada مَا جَاءَ إِلَّا زَيْدٌ, kata زَيْدٌ ber-i\'rab apa?',
        options: ['Rofa\' (jadi fa\'il)', 'Nashob mustasna', 'Jar', 'Mabni'],
        correct: 0,
        explanation: 'Karena ini istitsna\' mufarragh (tanpa mustasna minhu), زَيْدٌ jadi fa\'il dari جَاءَ — rofa\'.',
      },
      {
        q: 'Pada لَا إِلَهَ إِلَّا اللَّهُ, kenapa اللَّهُ rofa\' bukan nashob?',
        options: ['Karena fa\'il', 'Karena badal/mengikuti khobar yg mahdzuf', 'Karena selalu rofa\'', 'Salah harakat'],
        correct: 1,
        explanation: 'اللَّهُ adalah badal dari khobar لَا yang disembunyikan (mahdzuf). Mengikuti i\'rab-nya yang rofa\'.',
      },
    ],
  },

  // ============ PELAJARAN 19 (PREMIUM) ============
  {
    id: 'nahwu-19-asma-isyarah',
    order: 19,
    isFree: false,
    title: 'Asma\' al-Isyarah',
    subtitle: 'Kata tunjuk هَذَا، تِلْكَ، أُولَئِكَ',
    emoji: '👉',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 30,
    theory: {
      intro: 'Asma\' al-Isyarah (أَسْمَاءُ الْإِشَارَةِ) adalah kata-kata tunjuk: "ini", "itu", "ini kedua-duanya", dst. Semuanya MABNI (harakatnya tidak berubah). Sangat sering di Qur\'an.',
      sections: [
        {
          title: 'Untuk yang Dekat',
          body: 'هَذَا (lk mufrad), هَذِهِ (pr mufrad), هَذَانِ (lk mutsanna), هَاتَانِ (pr mutsanna), هَؤُلَاءِ (jamak — lk & pr berakal).',
          examples: [
            { ar: 'هَذَا كِتَابٌ', latin: 'haadzaa kitaab', id: 'Ini adalah buku' },
            { ar: 'هَذِهِ مَدْرَسَةٌ', latin: 'haadzihi madrasah', id: 'Ini adalah sekolah (pr)' },
            { ar: 'هَؤُلَاءِ طُلَّابٌ', latin: 'haa\'ulaa\'i thullaab', id: 'Mereka ini adalah para murid' },
          ],
        },
        {
          title: 'Untuk yang Jauh',
          body: 'ذَلِكَ (lk mufrad), تِلْكَ (pr mufrad), أُولَئِكَ (jamak). Ada tambahan ل yang menunjukkan jauh.',
          examples: [
            { ar: 'ذَلِكَ الْكِتَابُ', latin: 'dzaalikal-kitaab', id: 'Itu (yang jauh) adalah buku itu' },
            { ar: 'تِلْكَ الْجَنَّةُ', latin: 'tilkal-jannah', id: 'Itu adalah surga' },
            { ar: 'أُولَئِكَ الْمُؤْمِنُونَ', latin: 'ulaa\'ikal-mu\'minuun', id: 'Mereka itulah orang-orang beriman' },
          ],
        },
        {
          title: 'I\'rab Isim Isyarah',
          body: 'Isim isyarah MABNI — tidak berubah harakat akhirnya. Tapi posisi-nya dalam kalimat bisa rofa\'/nashob/jar (mahallan).',
          examples: [
            { ar: 'هَذَا مُحَمَّدٌ', latin: 'haadzaa Muhammad', id: 'Ini Muhammad (هذا mahallan rofa\' sbg mubtada\')' },
            { ar: 'أَكْرَمْتُ هَذَا الطَّالِبَ', latin: 'akramtu haadzath-thaalib', id: 'Aku memuliakan murid ini (هذا mahallan nashob)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'ذَلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ',
        latin: 'dzaalikal-kitaabu laa raiba fiih',
        surah: 'Al-Baqarah',
        ayatNum: 2,
        analysis: [
          { word: 'ذَلِكَ', type: 'Isim Isyarah', note: 'mabni; mubtada\'' },
          { word: 'الْكِتَابُ', type: 'Khobar / Badal', note: 'rofa\' dgn dhommah' },
          { word: 'لَا', type: 'Harf nafi jinsi', note: '' },
          { word: 'رَيْبَ', type: 'Isim لَا', note: 'mabni atas fathah' },
          { word: 'فِيهِ', type: 'Khobar لَا (jar-majrur)', note: 'di dalamnya' },
        ],
        explanation: 'Ayat kedua Al-Baqarah pakai ذَلِكَ — kata tunjuk untuk yang JAUH. Mengapa "jauh"? Para mufassir: menunjukkan KEMULIAAN — Kitab ini begitu agung sampai seakan jauh, tinggi tidak terjangkau. Sastra yang indah.',
      },
    },
    quiz: [
      {
        q: 'هَذَا dipakai untuk menunjukkan...',
        options: ['Yang jauh, lk, mufrad', 'Yang dekat, lk, mufrad', 'Yang dekat, pr, mufrad', 'Jamak'],
        correct: 1,
        explanation: 'هَذَا = "ini" — untuk laki-laki tunggal yang dekat.',
      },
      {
        q: 'تِلْكَ artinya...',
        options: ['Itu (lk jauh)', 'Itu (pr jauh)', 'Ini (lk)', 'Ini (pr)'],
        correct: 1,
        explanation: 'تِلْكَ = "itu" untuk PEREMPUAN tunggal yang JAUH. ذَلِكَ untuk lk.',
      },
      {
        q: 'Apa beda هَؤُلَاءِ dgn أُولَئِكَ?',
        options: ['Sama saja', 'هَؤُلَاءِ untuk dekat, أُولَئِكَ untuk jauh', 'هَؤُلَاءِ jamak pr saja', 'أُولَئِكَ tidak dipakai'],
        correct: 1,
        explanation: 'Keduanya jamak (untuk yang berakal), tapi هَؤُلَاءِ = ini (dekat), أُولَئِكَ = itu (jauh).',
      },
      {
        q: 'Isim isyarah secara umum...',
        options: ['Mu\'rab (berubah harakat)', 'Mabni (tidak berubah harakat)', 'Selalu rofa\'', 'Selalu nashob'],
        correct: 1,
        explanation: 'Isim isyarah adalah MABNI — harakat akhirnya tidak berubah. Tapi posisi mahalli-nya bisa rofa\'/nashob/jar.',
      },
    ],
  },

  // ============ PELAJARAN 20 (PREMIUM) ============
  {
    id: 'nahwu-20-adad',
    order: 20,
    isFree: false,
    title: 'Adad & Ma\'dud',
    subtitle: 'Bilangan dan yang dihitung',
    emoji: '🔢',
    duration: '7 menit',
    color: '#a05536',
    xpReward: 40,
    theory: {
      intro: 'Adad (الْعَدَدُ) adalah bilangan, Ma\'dud (الْمَعْدُودُ) adalah yang dihitung. Aturannya unik: kadang bilangan dan ma\'dud satu jenis, kadang berkebalikan jenis. Penting agar bisa hitung & sebut waktu dlm bahasa Arab.',
      sections: [
        {
          title: 'Bilangan 1 & 2: Sesuai Ma\'dud',
          body: 'وَاحِدٌ (1) dan اثْنَانِ (2) MENGIKUTI jenis ma\'dud (lk/pr). Posisinya biasanya SETELAH ma\'dud sebagai sifat.',
          examples: [
            { ar: 'كِتَابٌ وَاحِدٌ', latin: 'kitaabun waahid', id: '1 buku (lk)' },
            { ar: 'طَالِبَةٌ وَاحِدَةٌ', latin: 'thaalibatun waahidah', id: '1 siswi (pr)' },
            { ar: 'كِتَابَانِ اثْنَانِ', latin: 'kitaabaani-tsnaan', id: '2 buku (mutsanna)' },
          ],
        },
        {
          title: 'Bilangan 3-10: Berbeda Jenis dgn Ma\'dud',
          body: 'Bilangan 3-10 KEBALIKAN jenisnya dgn ma\'dud (mukholaf). Ma\'dud jamak majrur sbg mudhof ilaih.',
          examples: [
            { ar: 'ثَلَاثَةُ كُتُبٍ', latin: 'tsalaatsatu kutub', id: '3 buku (ثَلَاثَةُ pr karena كُتُب lk)' },
            { ar: 'ثَلَاثُ طَالِبَاتٍ', latin: 'tsalaatsu thaalibaat', id: '3 siswi (ثَلَاثُ lk karena طَالِبَات pr)' },
            { ar: 'خَمْسَةُ أَيَّامٍ', latin: 'khamsatu ayyaam', id: '5 hari (أَيَّامٍ jamak majrur)' },
          ],
        },
        {
          title: 'Bilangan 11-99: Tamyiz Nashob Mufrad',
          body: 'Setelah bilangan 11-99, ma\'dud (tamyiz) mufrad dan NASHOB. Bilangan 11-12 ikut jenis ma\'dud; 13-19 mukholaf.',
          examples: [
            { ar: 'إِحْدَى عَشْرَةَ سَاعَةً', latin: 'ihdaa \'asyrata saa\'ah', id: '11 jam (ساعة mufrad nashob)' },
            { ar: 'عِشْرُونَ طَالِبًا', latin: '\'isyruuna thaaliban', id: '20 murid (طَالِبًا nashob)' },
            { ar: 'تِسْعَةٌ وَتِسْعُونَ كِتَابًا', latin: 'tis\'atun wa tis\'uuna kitaaban', id: '99 buku' },
          ],
        },
      ],
      quranExample: {
        ayat: 'إِنَّ عِدَّةَ الشُّهُورِ عِنْدَ اللَّهِ اثْنَا عَشَرَ شَهْرًا',
        latin: 'inna \'iddatasy-syuhuuri \'indallaahi-tsnaa \'asyara syahran',
        surah: 'At-Taubah',
        ayatNum: 36,
        analysis: [
          { word: 'إِنَّ', type: 'Harf taukid', note: 'sesungguhnya' },
          { word: 'عِدَّةَ', type: 'Isim إِنَّ', note: 'nashob; jumlah/bilangan' },
          { word: 'الشُّهُورِ', type: 'Mudhof ilaih', note: 'majrur; bulan-bulan' },
          { word: 'اثْنَا عَشَرَ', type: 'Khobar إِنَّ', note: 'bilangan 12 — mabni' },
          { word: 'شَهْرًا', type: 'Tamyiz', note: 'nashob; bulan (mufrad)' },
        ],
        explanation: 'اثْنَا عَشَرَ شَهْرًا — bilangan 12 + tamyiz mufrad nashob (شَهْرًا). Inilah aturan klasik adad 11-99. Kata شَهْر (bulan) mufrad bukan jamak karena polanya begitu.',
      },
    },
    quiz: [
      {
        q: 'Bilangan 3-10 SECARA JENIS dgn ma\'dud-nya...',
        options: ['Selalu sama', 'Berkebalikan (mukholaf)', 'Bebas', 'Tidak terkait'],
        correct: 1,
        explanation: 'Bilangan 3-10 punya aturan unik: jenis bilangan KEBALIKAN dari jenis ma\'dud (mukholaf).',
      },
      {
        q: 'Bagaimana mengatakan "3 siswi" dalam bahasa Arab?',
        options: ['ثَلَاثَةُ طَالِبَاتٍ', 'ثَلَاثُ طَالِبَاتٍ', 'ثَلَاثَةُ طَالِبَةٍ', 'ثَلَاثٌ طَالِبَةٌ'],
        correct: 1,
        explanation: 'ثَلَاثُ (tanpa ة) karena ma\'dud-nya pr — kebalikan. طَالِبَاتٍ jamak majrur sbg mudhof ilaih.',
      },
      {
        q: 'Setelah bilangan 11-99, ma\'dud-nya berupa...',
        options: ['Jamak rofa\'', 'Jamak majrur', 'Mufrad nashob (tamyiz)', 'Mufrad rofa\''],
        correct: 2,
        explanation: 'Setelah 11-99, ma\'dud jadi tamyiz: MUFRAD dan NASHOB.',
      },
      {
        q: 'Bilangan 1 dan 2 jenisnya...',
        options: ['Mukholaf ma\'dud', 'Sama dgn ma\'dud', 'Bebas', 'Selalu lk'],
        correct: 1,
        explanation: '1 (وَاحِدٌ/وَاحِدَةٌ) dan 2 (اثْنَانِ/اثْنَتَانِ) MENGIKUTI jenis ma\'dud — sebagai sifat.',
      },
    ],
  },
  ,
  // ============ PELAJARAN 21 (PREMIUM) ============
  {
    id: 'nahwu-21-athaf',
    order: 21,
    isFree: false,
    title: 'Athaf & Huruf Athaf',
    subtitle: 'Penyambung kalimat: و، ف، ثُمَّ، أَوْ',
    emoji: '🪢',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Athaf (الْعَطْفُ) adalah menyambung 2 kata/kalimat dengan huruf athaf. Ma\'thuf (yang disambung) MENGIKUTI i\'rab ma\'thuf alaih (yang sebelumnya). Sangat sering dipakai untuk merangkai daftar atau urutan.',
      sections: [
        {
          title: 'Huruf Athaf Utama',
          body: 'و (dan — sekedar gabung), ف (lalu — urutan langsung), ثُمَّ (kemudian — urutan dgn jeda), أَوْ (atau), أَمْ (atau — dlm pertanyaan), بَلْ (bahkan), لَكِنْ (tetapi), لاَ (bukan).',
          examples: [
            { ar: 'جَاءَ زَيْدٌ وَعَمْرٌو', latin: 'jaa\'a Zaidun wa \'Amrun', id: 'Zaid dan Amr datang' },
            { ar: 'دَخَلَ زَيْدٌ فَعَمْرٌو', latin: 'dakhala Zaidun fa-\'Amrun', id: 'Zaid masuk lalu Amr (urutan langsung)' },
            { ar: 'أَكَلَ ثُمَّ شَرِبَ', latin: 'akala tsumma syariba', id: 'Dia makan kemudian minum (jeda)' },
          ],
        },
        {
          title: 'Aturan I\'rab Ma\'thuf',
          body: 'Ma\'thuf MENGIKUTI i\'rab ma\'thuf alaih. Kalau rofa\' → rofa\'. Nashob → nashob. Jar → jar.',
          examples: [
            { ar: 'رَأَيْتُ زَيْدًا وَعَمْرًا', latin: 'ra\'aitu Zaidan wa \'Amran', id: 'Aku melihat Zaid dan Amr (keduanya nashob)' },
            { ar: 'مَرَرْتُ بِزَيْدٍ وَعَمْرٍو', latin: 'marartu biZaidin wa \'Amrin', id: 'Aku lewati Zaid dan Amr (keduanya majrur)' },
          ],
        },
        {
          title: 'Beda و، ف، ثُمَّ',
          body: 'Bedakan: و = sekedar gabung tanpa urutan. ف = urutan langsung tanpa jeda. ثُمَّ = urutan dgn jeda waktu.',
          examples: [
            { ar: 'جَاءَ زَيْدٌ وَعَمْرٌو', latin: '', id: 'Zaid dan Amr datang (bisa bersamaan)' },
            { ar: 'جَاءَ زَيْدٌ فَعَمْرٌو', latin: '', id: 'Zaid datang lalu LANGSUNG Amr' },
            { ar: 'جَاءَ زَيْدٌ ثُمَّ عَمْرٌو', latin: '', id: 'Zaid datang KEMUDIAN (jeda) Amr' },
          ],
        },
      ],
      quranExample: {
        ayat: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ الرَّحْمَنِ الرَّحِيمِ مَالِكِ يَوْمِ الدِّينِ',
        latin: 'al-hamdu lillaahi rabbil-\'aalamiin ar-rahmaanir-rahiim maaliki yaumid-diin',
        surah: 'Al-Fatihah',
        ayatNum: '2-4',
        analysis: [
          { word: 'لِلَّهِ', type: 'Jar-majrur', note: 'untuk Allah' },
          { word: 'رَبِّ', type: 'Badal/Na\'at', note: 'majrur ikut Allah' },
          { word: 'الرَّحْمَنِ', type: 'Na\'at', note: 'majrur (athaf bayan)' },
          { word: 'الرَّحِيمِ', type: 'Na\'at', note: 'majrur' },
          { word: 'مَالِكِ', type: 'Na\'at', note: 'majrur' },
        ],
        explanation: 'Meskipun tanpa حرف عطف (و) tertulis, beberapa kata di sini merupakan sifat berturut-turut (sebagian ulama anggap athaf bayan). Semua majrur — mengikuti i\'rab kata pertama. Inilah kaidah dasar: ma\'thuf ikut ma\'thuf alaih.',
      },
    },
    quiz: [
      {
        q: 'Apa beda ف dgn ثُمَّ?',
        options: ['Sama saja', 'ف = urutan langsung; ثُمَّ = urutan dgn jeda', 'ثُمَّ untuk pertanyaan', 'ف untuk negatif'],
        correct: 1,
        explanation: 'ف menunjukkan urutan langsung (langsung setelah). ثُمَّ menunjukkan urutan dgn jeda waktu.',
      },
      {
        q: 'Ma\'thuf MENGIKUTI i\'rab...',
        options: ['Mubtada\'', 'Ma\'thuf alaih (yang sebelumnya)', 'Fa\'il', 'Sembarang'],
        correct: 1,
        explanation: 'Ma\'thuf selalu mengikuti i\'rab ma\'thuf alaih (kata yang ada sebelum huruf athaf).',
      },
      {
        q: 'Pada رَأَيْتُ زَيْدًا وَعَمْرًا, kenapa عَمْرًا nashob?',
        options: ['Karena fa\'il', 'Karena maf\'ul langsung', 'Karena athaf ke زَيْدًا (yg juga nashob sbg maf\'ul)', 'Salah harakat'],
        correct: 2,
        explanation: 'عَمْرًا nashob karena athaf ke زَيْدًا. زَيْدًا nashob sbg maf\'ul bih. Ma\'thuf ikut.',
      },
      {
        q: 'أَوْ artinya...',
        options: ['Dan', 'Atau', 'Lalu', 'Tetapi'],
        correct: 1,
        explanation: 'أَوْ = atau. Untuk pilihan. Mis. خُذْ كِتَابًا أَوْ قَلَمًا = ambil buku atau pena.',
      },
    ],
  },

  // ============ PELAJARAN 22 (PREMIUM) ============
  {
    id: 'nahwu-22-badal',
    order: 22,
    isFree: false,
    title: 'Badal',
    subtitle: 'Pengganti dari kata sebelumnya',
    emoji: '🔁',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Badal (الْبَدَلُ) adalah isim yang MENGGANTIKAN posisi isim sebelumnya (mubdal minhu) — biasanya untuk menjelaskan/spesifikasi lebih lanjut. I\'rab badal sama dgn mubdal minhu.',
      sections: [
        {
          title: 'Badal Kullun min Kullin (Total)',
          body: 'Badal menggantikan SEPENUHNYA mubdal minhu. Mubdal minhu hanya pengantar.',
          examples: [
            { ar: 'جَاءَ أَخُوكَ مُحَمَّدٌ', latin: 'jaa\'a akhuuka Muhammad', id: 'Saudaramu Muhammad datang (Muhammad badal dari أَخُو)' },
            { ar: 'الْخَلِيفَةُ عُمَرُ عَادِلٌ', latin: 'al-khaliifatu \'Umaru \'aadil', id: 'Khalifah Umar itu adil' },
          ],
        },
        {
          title: 'Badal Ba\'dh min Kull (Sebagian)',
          body: 'Badal menggantikan SEBAGIAN saja dari mubdal minhu. Biasanya dgn dhomir kembali.',
          examples: [
            { ar: 'أَكَلْتُ الرَّغِيفَ ثُلُثَهُ', latin: 'akaltur-raghiifa tsulutsahu', id: 'Aku makan roti itu sepertiganya (ثُلُثَهُ badal dari الرَّغِيفَ)' },
            { ar: 'رَأَيْتُ الْقَوْمَ نِصْفَهُمْ', latin: 'ra\'aitul-qauma nishfahum', id: 'Aku melihat kaum itu setengahnya' },
          ],
        },
        {
          title: 'Badal Isytimal (Cakupan)',
          body: 'Badal yang mencakup SIFAT dari mubdal minhu (bukan keseluruhan, bukan sebagian fisik).',
          examples: [
            { ar: 'أَعْجَبَنِي زَيْدٌ عِلْمُهُ', latin: 'a\'jabanii Zaidun \'ilmuh', id: 'Aku kagum dgn Zaid, ilmunya (عِلْمُهُ badal isytimal)' },
            { ar: 'سُلِبَ زَيْدٌ ثَوْبُهُ', latin: 'suliba Zaidun tsaubuh', id: 'Zaid dirampok, bajunya' },
          ],
        },
      ],
      quranExample: {
        ayat: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ',
        latin: 'ihdinash-shiraathal-mustaqiim shiraathal-ladziina an\'amta \'alaihim',
        surah: 'Al-Fatihah',
        ayatNum: '6-7',
        analysis: [
          { word: 'اهْدِنَا', type: 'Fi\'il Amr', note: 'tunjukilah kami' },
          { word: 'الصِّرَاطَ', type: 'Maf\'ul bih', note: 'nashob; jalan' },
          { word: 'الْمُسْتَقِيمَ', type: 'Na\'at', note: 'nashob; yang lurus' },
          { word: 'صِرَاطَ', type: 'Badal', note: 'nashob ikut الصِّرَاطَ; mengulang/spesifikasi' },
          { word: 'الَّذِينَ', type: 'Mudhof ilaih', note: 'maushul' },
        ],
        explanation: 'صِرَاطَ kedua adalah BADAL dari الصِّرَاطَ pertama — keduanya nashob. Mengapa diulang? Untuk menegaskan & spesifikasi: "jalan yang lurus, YAITU jalan orang-orang yang Engkau beri nikmat".',
      },
    },
    quiz: [
      {
        q: 'I\'rab badal mengikuti...',
        options: ['Khobar', 'Fi\'il', 'Mubdal minhu (yang digantikan)', 'Selalu nashob'],
        correct: 2,
        explanation: 'Badal selalu mengikuti i\'rab mubdal minhu. Kalau mubdal minhu rofa\' → badal rofa\'.',
      },
      {
        q: 'Pada جَاءَ أَخُوكَ مُحَمَّدٌ, kata مُحَمَّدٌ adalah...',
        options: ['Fa\'il', 'Maf\'ul', 'Badal (kullun min kullin)', 'Hal'],
        correct: 2,
        explanation: 'مُحَمَّدٌ menggantikan أَخُوكَ sepenuhnya — badal kullun min kullin. Sama rofa\'.',
      },
      {
        q: 'Apa beda badal dgn na\'at?',
        options: ['Sama saja', 'Badal menggantikan; na\'at hanya mensifati', 'Na\'at lebih panjang', 'Badal nashob'],
        correct: 1,
        explanation: 'Badal: hubungannya substitusi (yang dimaksud sebenarnya). Na\'at: hubungannya sifat (memodifikasi).',
      },
      {
        q: 'Jenis badal ada berapa macam?',
        options: ['1', '2', '3', '4'],
        correct: 2,
        explanation: '3 macam: (1) Badal kullun min kullin — total, (2) Ba\'dh min kullin — sebagian, (3) Isytimal — cakupan sifat.',
      },
    ],
  },

  // ============ PELAJARAN 23 (PREMIUM) ============
  {
    id: 'nahwu-23-dhomir',
    order: 23,
    isFree: false,
    title: 'Dhomir Munfashil & Muttashil',
    subtitle: 'Kata ganti yang terpisah & yang melekat',
    emoji: '👤',
    duration: '7 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Dhomir (الضَّمِيرُ) adalah kata ganti. Ada 2 jenis: MUNFASHIL (terpisah, berdiri sendiri) dan MUTTASHIL (melekat di akhir kata). Semua dhomir MABNI.',
      sections: [
        {
          title: 'Dhomir Munfashil — Terpisah, Sbg Mubtada\'/Khobar',
          body: 'Dhomir munfashil: أَنَا، نَحْنُ، أَنْتَ، أَنْتِ، أَنْتُمْ، أَنْتُنَّ، هُوَ، هِيَ، هُمَا، هُمْ، هُنَّ. Berdiri sendiri, biasanya jadi mubtada\' atau khobar.',
          examples: [
            { ar: 'أَنَا مُسْلِمٌ', latin: 'anaa muslim', id: 'Aku seorang muslim (أَنَا mubtada\')' },
            { ar: 'هِيَ طَالِبَةٌ', latin: 'hiya thaalibah', id: 'Dia (pr) seorang siswi' },
            { ar: 'هُمْ مُؤْمِنُونَ', latin: 'hum mu\'minuun', id: 'Mereka orang-orang beriman' },
          ],
        },
        {
          title: 'Dhomir Muttashil — Melekat di Akhir Kata',
          body: 'Dhomir muttashil: ـِي، ـكَ، ـكِ، ـكُمْ، ـكُنَّ، ـهُ، ـهَا، ـهُمْ، ـهُنَّ، ـنَا. Menempel di akhir isim, fi\'il, atau harf. Fungsinya: fa\'il, maf\'ul, mudhof ilaih, atau majrur.',
          examples: [
            { ar: 'كِتَابِي', latin: 'kitaabii', id: 'bukuKU (ـِي mudhof ilaih)' },
            { ar: 'رَأَيْتُهُ', latin: 'ra\'aituhu', id: 'aku melihatNYA (هُ maf\'ul; تُ fa\'il)' },
            { ar: 'لَكُمْ', latin: 'lakum', id: 'untuk kalian (كُمْ majrur)' },
          ],
        },
        {
          title: 'I\'rab Dhomir',
          body: 'Semua dhomir MABNI (harakat akhirnya tidak berubah). Tapi posisinya secara mahalli bisa rofa\'/nashob/jar tergantung peran dalam kalimat.',
          examples: [
            { ar: 'هُوَ كَاتِبٌ', latin: 'huwa kaatib', id: 'هُوَ mabni atas fathah, mahallan rofa\' sbg mubtada\'' },
            { ar: 'إِنَّهُ كَاتِبٌ', latin: 'innahu kaatib', id: 'هُ mabni atas dhommah, mahallan nashob sbg isim إِنَّ' },
          ],
        },
      ],
      quranExample: {
        ayat: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        latin: 'iyyaaka na\'budu wa iyyaaka nasta\'iin',
        surah: 'Al-Fatihah',
        ayatNum: 5,
        analysis: [
          { word: 'إِيَّا', type: 'Dhomir Munfashil', note: 'untuk maf\'ul; "engkau" — mahallan nashob' },
          { word: 'كَ', type: 'Dhomir Muttashil', note: 'menempel ke إِيَّا; mabni' },
          { word: 'نَعْبُدُ', type: 'Fi\'il Mudhori\'', note: 'fa\'il = dhomir mustatir نَحْنُ' },
          { word: 'نَسْتَعِينُ', type: 'Fi\'il Mudhori\'', note: 'kami minta tolong; nasta\'iin' },
        ],
        explanation: 'إِيَّاكَ adalah dhomir munfashil khusus untuk MAF\'UL (jarang). Biasanya maf\'ul pakai dhomir muttashil (نَعْبُدُكَ). Tapi di sini didahulukan إِيَّاكَ untuk PENEKANAN: "hanya kepada-Mu". Inilah keindahan sintaksis Qur\'an.',
      },
    },
    quiz: [
      {
        q: 'Beda utama dhomir munfashil & muttashil adalah...',
        options: ['Sama saja', 'Munfashil berdiri sendiri; muttashil melekat di akhir kata', 'Muttashil hanya lk', 'Munfashil hanya untuk Qur\'an'],
        correct: 1,
        explanation: 'Munfashil: terpisah, berdiri sendiri (أَنَا، هُوَ). Muttashil: melekat di akhir kata (كِتَابُهُ، رَأَيْتُهُ).',
      },
      {
        q: 'Semua dhomir secara i\'rab adalah...',
        options: ['Mu\'rab', 'Mabni', 'Selalu rofa\'', 'Selalu nashob'],
        correct: 1,
        explanation: 'Semua dhomir mabni — harakatnya tidak berubah. Tapi posisi-nya mahallan bisa rofa\'/nashob/jar.',
      },
      {
        q: 'Pada كِتَابُهُ, peran هُ adalah...',
        options: ['Fa\'il', 'Maf\'ul', 'Mudhof ilaih', 'Mubtada\''],
        correct: 2,
        explanation: 'هُ menempel di akhir isim — perannya mudhof ilaih (mahallan jar). كِتَابُهُ = "bukunya".',
      },
      {
        q: 'إِيَّاكَ dipakai sebagai...',
        options: ['Mubtada\'', 'Fa\'il', 'Maf\'ul (dhomir munfashil khusus maf\'ul)', 'Khobar'],
        correct: 2,
        explanation: 'إِيَّاكَ adalah dhomir munfashil khusus untuk MAF\'UL ketika ingin didahulukan untuk penekanan.',
      },
    ],
  },

  // ============ PELAJARAN 24 (PREMIUM) ============
  {
    id: 'nahwu-24-asma-khamsah',
    order: 24,
    isFree: false,
    title: 'Asma\' al-Khamsah',
    subtitle: '5 isim khusus dgn i\'rab unik',
    emoji: '✋',
    duration: '6 menit',
    color: '#a05536',
    xpReward: 35,
    theory: {
      intro: 'Asma\' al-Khamsah (الْأَسْمَاءُ الْخَمْسَةُ) adalah 5 isim yang punya I\'RAB UNIK: rofa\' dgn و, nashob dgn ا, jar dgn ي. Berbeda dari isim biasa.',
      sections: [
        {
          title: '5 Isim Tersebut',
          body: 'أَبٌ (ayah), أَخٌ (saudara lk), حَمٌ (mertua), فُو (mulut), ذُو (yang mempunyai).',
          examples: [
            { ar: 'أَبٌ - أَبُو - أَبَا - أَبِي', latin: 'ab → abuu/abaa/abii', id: 'ayah dgn 3 i\'rab' },
            { ar: 'أَخٌ - أَخُو - أَخَا - أَخِي', latin: 'akh → akhuu/akhaa/akhii', id: 'saudara' },
            { ar: 'ذُو - ذَا - ذِي', latin: 'dzuu - dzaa - dzii', id: 'yang punya' },
          ],
        },
        {
          title: 'Syarat Pemakaian',
          body: 'Aturan unik berlaku HANYA kalau: (1) Mufrad (tidak mutsanna/jamak), (2) Mukabbar (bukan tashghir), (3) Jadi MUDHOF (kecuali ke ya\' mutakallim).',
          examples: [
            { ar: 'جَاءَ أَبُو زَيْدٍ', latin: 'jaa\'a abuu Zaid', id: 'Ayah Zaid datang (أَبُو rofa\' dgn و)' },
            { ar: 'رَأَيْتُ أَبَا زَيْدٍ', latin: 'ra\'aitu abaa Zaid', id: 'Aku melihat ayah Zaid (أَبَا nashob dgn ا)' },
            { ar: 'مَرَرْتُ بِأَبِي زَيْدٍ', latin: 'marartu bi\'abii Zaid', id: 'Aku lewati ayah Zaid (أَبِي jar dgn ي)' },
          ],
        },
        {
          title: 'Catatan: ذُو khusus',
          body: 'ذُو tidak bisa berdiri sendiri — wajib mudhof ke isim. Artinya: "yang mempunyai..." atau "pemilik...".',
          examples: [
            { ar: 'ذُو عِلْمٍ', latin: 'dzuu \'ilm', id: 'pemilik ilmu / yang berilmu' },
            { ar: 'ذَا مَالٍ', latin: 'dzaa maal', id: 'pemilik harta (nashob)' },
            { ar: 'ذِي عِلْمٍ', latin: 'dzii \'ilm', id: 'pemilik ilmu (jar)' },
          ],
        },
      ],
      quranExample: {
        ayat: 'وَأَخُو عَادٍ إِذْ أَنْذَرَ قَوْمَهُ',
        latin: 'wa akhuu \'aadin idz andzara qaumahu',
        surah: 'Al-Ahqaf',
        ayatNum: 21,
        analysis: [
          { word: 'وَأَخُو', type: 'Asma\' al-Khamsah', note: 'rofa\' dgn WAU (bukan dhommah); mudhof' },
          { word: 'عَادٍ', type: 'Mudhof ilaih', note: 'majrur; Bani \'Ad' },
          { word: 'إِذْ', type: 'Zhorof', note: 'ketika' },
          { word: 'أَنْذَرَ', type: 'Fi\'il Madhi', note: 'memperingatkan' },
          { word: 'قَوْمَهُ', type: 'Maf\'ul + dhomir', note: 'kaumnya' },
        ],
        explanation: 'أَخُو عَادٍ — saudara kaum \'Ad (yaitu Nabi Hud). Lihat: أَخُو rofa\' dgn WAU, bukan dhommah biasa. Itu i\'rab khas asma\' al-khamsah karena: mufrad + mudhof + mukabbar.',
      },
    },
    quiz: [
      {
        q: 'Berapa jumlah asma\' al-khamsah?',
        options: ['3', '5', '7', '10'],
        correct: 1,
        explanation: '5 isim: أَبٌ، أَخٌ، حَمٌ، فُو، ذُو.',
      },
      {
        q: 'Saat rofa\', asma\' al-khamsah ditandai dgn...',
        options: ['Dhommah', 'Wau', 'Alif', 'Ya'],
        correct: 1,
        explanation: 'Rofa\' = wau (و). أَبُو، أَخُو، حَمُو، فُو، ذُو.',
      },
      {
        q: 'Pada رَأَيْتُ أَبَا زَيْدٍ, kenapa أَبَا?',
        options: ['Rofa\' dgn و', 'Nashob dgn ا', 'Jar dgn ي', 'Salah harakat'],
        correct: 1,
        explanation: 'أَبَا nashob (sbg maf\'ul) ditandai dgn ALIF — bukan fathah biasa. Itu aturan asma\' al-khamsah.',
      },
      {
        q: 'ذُو punya keunikan apa?',
        options: ['Tidak ada keunikan', 'Wajib jadi mudhof — tidak bisa berdiri sendiri', 'Selalu rofa\'', 'Tidak di Qur\'an'],
        correct: 1,
        explanation: 'ذُو wajib mudhof (digabung dgn isim lain). Artinya: "yang mempunyai...". Mis. ذُو عِلْمٍ = pemilik ilmu.',
      },
    ],
  },
];

// Helper
export function getNahwuLesson(id) {
  return NAHWU_LESSONS.find((l) => l.id === id) || null;
}
