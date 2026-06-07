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
];

// Helper
export function getNahwuLesson(id) {
  return NAHWU_LESSONS.find((l) => l.id === id) || null;
}
