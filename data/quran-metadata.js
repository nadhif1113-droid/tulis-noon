// data/quran-metadata.js
// Metadata 114 surat Al-Quran. Hardcoded sekitar 50 KB.
// Content lengkap (ayat-by-ayat) di-fetch on-demand dari AlQuran.cloud API.
// Field per surat: number, name, arName, meaning, totalAyat, juz, revelation, description.

export const QURAN_SURAT = [
  { number: 1,   name: 'Al-Fatihah',     arName: 'الْفَاتِحَة',    meaning: 'Pembukaan',          totalAyat: 7,   juz: [1],    revelation: 'Makkiyah', description: 'Doa pembuka — induk Al-Quran' },
  { number: 2,   name: 'Al-Baqarah',     arName: 'الْبَقَرَة',     meaning: 'Sapi Betina',        totalAyat: 286, juz: [1,2,3],revelation: 'Madaniyah', description: 'Surat terpanjang — hukum, kisah, doa' },
  { number: 3,   name: 'Ali-Imran',      arName: 'آلِ عِمْرَان',   meaning: 'Keluarga Imran',     totalAyat: 200, juz: [3,4],  revelation: 'Madaniyah', description: 'Kisah keluarga Imran & Maryam' },
  { number: 4,   name: 'An-Nisa',        arName: 'النِّسَاء',      meaning: 'Wanita',             totalAyat: 176, juz: [4,5,6],revelation: 'Madaniyah', description: 'Hukum keluarga, waris, kedudukan wanita' },
  { number: 5,   name: 'Al-Maidah',      arName: 'الْمَائِدَة',    meaning: 'Hidangan',           totalAyat: 120, juz: [6,7],  revelation: 'Madaniyah', description: 'Halal-haram, perjanjian Allah' },
  { number: 6,   name: 'Al-Anam',        arName: 'الْأَنْعَام',    meaning: 'Binatang Ternak',    totalAyat: 165, juz: [7,8],  revelation: 'Makkiyah', description: 'Pokok-pokok tauhid & kenabian' },
  { number: 7,   name: 'Al-Araf',        arName: 'الْأَعْرَاف',    meaning: 'Tempat Tertinggi',   totalAyat: 206, juz: [8,9],  revelation: 'Makkiyah', description: 'Kisah para nabi & dialog akhirat' },
  { number: 8,   name: 'Al-Anfal',       arName: 'الْأَنْفَال',    meaning: 'Rampasan Perang',    totalAyat: 75,  juz: [9,10], revelation: 'Madaniyah', description: 'Hukum perang & pembagian ghanimah' },
  { number: 9,   name: 'At-Taubah',      arName: 'التَّوْبَة',     meaning: 'Pengampunan',        totalAyat: 129, juz: [10,11],revelation: 'Madaniyah', description: 'Tanpa Bismillah — tentang munafik' },
  { number: 10,  name: 'Yunus',          arName: 'يُونُس',         meaning: 'Nabi Yunus',         totalAyat: 109, juz: [11],   revelation: 'Makkiyah', description: 'Tauhid, kerasulan, kisah Nabi Yunus' },
  { number: 11,  name: 'Hud',            arName: 'هُود',           meaning: 'Nabi Hud',           totalAyat: 123, juz: [11,12],revelation: 'Makkiyah', description: 'Kisah para nabi sebelum Muhammad' },
  { number: 12,  name: 'Yusuf',          arName: 'يُوسُف',         meaning: 'Nabi Yusuf',         totalAyat: 111, juz: [12,13],revelation: 'Makkiyah', description: 'Kisah lengkap Nabi Yusuf — "ahsanul qasas"' },
  { number: 13,  name: 'Ar-Rad',         arName: 'الرَّعْد',       meaning: 'Guruh',              totalAyat: 43,  juz: [13],   revelation: 'Madaniyah', description: 'Tanda kekuasaan Allah di alam' },
  { number: 14,  name: 'Ibrahim',        arName: 'إِبْرَاهِيم',    meaning: 'Nabi Ibrahim',       totalAyat: 52,  juz: [13],   revelation: 'Makkiyah', description: 'Doa Ibrahim & kemuliaan tauhid' },
  { number: 15,  name: 'Al-Hijr',        arName: 'الْحِجْر',       meaning: 'Pegunungan Hijr',    totalAyat: 99,  juz: [14],   revelation: 'Makkiyah', description: 'Kisah kaum Tsamud & nabi Luth' },
  { number: 16,  name: 'An-Nahl',        arName: 'النَّحْل',       meaning: 'Lebah',              totalAyat: 128, juz: [14],   revelation: 'Makkiyah', description: 'Nikmat Allah & dakwah dengan hikmah' },
  { number: 17,  name: 'Al-Isra',        arName: 'الْإِسْرَاء',    meaning: 'Perjalanan Malam',   totalAyat: 111, juz: [15],   revelation: 'Makkiyah', description: 'Isra Miraj & 10 wasiat utama' },
  { number: 18,  name: 'Al-Kahf',        arName: 'الْكَهْف',       meaning: 'Gua',                totalAyat: 110, juz: [15,16],revelation: 'Makkiyah', description: 'Ashabul Kahfi, Dzulqarnain, Khidir' },
  { number: 19,  name: 'Maryam',         arName: 'مَرْيَم',        meaning: 'Maryam',             totalAyat: 98,  juz: [16],   revelation: 'Makkiyah', description: 'Kelahiran Nabi Isa & Yahya' },
  { number: 20,  name: 'Ta-Ha',          arName: 'طٰهٰ',           meaning: 'Ta Ha',              totalAyat: 135, juz: [16],   revelation: 'Makkiyah', description: 'Kisah lengkap Musa & Firaun' },
  { number: 21,  name: 'Al-Anbiya',      arName: 'الْأَنْبِيَاء',  meaning: 'Para Nabi',          totalAyat: 112, juz: [17],   revelation: 'Makkiyah', description: 'Kisah 16 nabi & rahmat semesta' },
  { number: 22,  name: 'Al-Hajj',        arName: 'الْحَجّ',        meaning: 'Haji',               totalAyat: 78,  juz: [17],   revelation: 'Campuran', description: 'Manasik haji & hari kiamat' },
  { number: 23,  name: 'Al-Muminun',     arName: 'الْمُؤْمِنُون',  meaning: 'Orang Beriman',      totalAyat: 118, juz: [18],   revelation: 'Makkiyah', description: 'Ciri orang mukmin yang beruntung' },
  { number: 24,  name: 'An-Nur',         arName: 'النُّور',        meaning: 'Cahaya',             totalAyat: 64,  juz: [18],   revelation: 'Madaniyah', description: 'Adab pergaulan & hukum zina' },
  { number: 25,  name: 'Al-Furqan',      arName: 'الْفُرْقَان',    meaning: 'Pembeda',            totalAyat: 77,  juz: [18,19],revelation: 'Makkiyah', description: 'Al-Quran sebagai pembeda haq & batil' },
  { number: 26,  name: 'Asy-Syuara',     arName: 'الشُّعَرَاء',    meaning: 'Para Penyair',       totalAyat: 227, juz: [19],   revelation: 'Makkiyah', description: 'Kisah 8 nabi & dakwah mereka' },
  { number: 27,  name: 'An-Naml',        arName: 'النَّمْل',       meaning: 'Semut',              totalAyat: 93,  juz: [19,20],revelation: 'Makkiyah', description: 'Kisah Sulaiman & ratu Bilqis' },
  { number: 28,  name: 'Al-Qasas',       arName: 'الْقَصَص',       meaning: 'Cerita-cerita',      totalAyat: 88,  juz: [20],   revelation: 'Makkiyah', description: 'Kisah lengkap Musa, Qarun, Firaun' },
  { number: 29,  name: 'Al-Ankabut',     arName: 'الْعَنْكَبُوت',  meaning: 'Laba-laba',          totalAyat: 69,  juz: [20,21],revelation: 'Makkiyah', description: 'Ujian iman & kerapuhan musuh Allah' },
  { number: 30,  name: 'Ar-Rum',         arName: 'الرُّوم',        meaning: 'Bangsa Romawi',      totalAyat: 60,  juz: [21],   revelation: 'Makkiyah', description: 'Prediksi kemenangan Romawi & ayat-ayat kosmis' },
  { number: 31,  name: 'Luqman',         arName: 'لُقْمَان',       meaning: 'Luqman',             totalAyat: 34,  juz: [21],   revelation: 'Makkiyah', description: 'Nasihat Luqman pada putranya' },
  { number: 32,  name: 'As-Sajdah',      arName: 'السَّجْدَة',     meaning: 'Sujud',              totalAyat: 30,  juz: [21],   revelation: 'Makkiyah', description: 'Penciptaan & hari akhir' },
  { number: 33,  name: 'Al-Ahzab',       arName: 'الْأَحْزَاب',    meaning: 'Golongan Bersekutu', totalAyat: 73,  juz: [21,22],revelation: 'Madaniyah', description: 'Perang Khandaq & adab keluarga Nabi' },
  { number: 34,  name: 'Saba',           arName: 'سَبَأ',          meaning: 'Bangsa Saba',        totalAyat: 54,  juz: [22],   revelation: 'Makkiyah', description: 'Kerajaan Saba & Sulaiman' },
  { number: 35,  name: 'Fatir',          arName: 'فَاطِر',         meaning: 'Pencipta',           totalAyat: 45,  juz: [22],   revelation: 'Makkiyah', description: 'Allah pencipta segalanya' },
  { number: 36,  name: 'Ya-Sin',         arName: 'يٰسٓ',           meaning: 'Ya Sin',             totalAyat: 83,  juz: [22,23],revelation: 'Makkiyah', description: 'Jantung Al-Quran — kebangkitan' },
  { number: 37,  name: 'As-Saffat',      arName: 'الصَّافَّات',    meaning: 'Yang Bershaf',       totalAyat: 182, juz: [23],   revelation: 'Makkiyah', description: 'Kisah para nabi & malaikat' },
  { number: 38,  name: 'Sad',            arName: 'صٓ',             meaning: 'Shad',               totalAyat: 88,  juz: [23],   revelation: 'Makkiyah', description: 'Kisah Daud, Sulaiman, Ayyub' },
  { number: 39,  name: 'Az-Zumar',       arName: 'الزُّمَر',       meaning: 'Rombongan',          totalAyat: 75,  juz: [23,24],revelation: 'Makkiyah', description: 'Tauhid murni & ampunan Allah' },
  { number: 40,  name: 'Ghafir',         arName: 'غَافِر',         meaning: 'Yang Mengampuni',    totalAyat: 85,  juz: [24],   revelation: 'Makkiyah', description: 'Mukmin di kalangan keluarga Firaun' },
  { number: 41,  name: 'Fussilat',       arName: 'فُصِّلَت',       meaning: 'Yang Dijelaskan',    totalAyat: 54,  juz: [24,25],revelation: 'Makkiyah', description: 'Penciptaan langit & bumi 6 hari' },
  { number: 42,  name: 'Asy-Syura',      arName: 'الشُّورَى',      meaning: 'Musyawarah',         totalAyat: 53,  juz: [25],   revelation: 'Makkiyah', description: 'Prinsip musyawarah & wahyu' },
  { number: 43,  name: 'Az-Zukhruf',     arName: 'الزُّخْرُف',     meaning: 'Perhiasan',          totalAyat: 89,  juz: [25],   revelation: 'Makkiyah', description: 'Kemegahan dunia & kebahagiaan akhirat' },
  { number: 44,  name: 'Ad-Dukhan',      arName: 'الدُّخَان',      meaning: 'Asap',               totalAyat: 59,  juz: [25],   revelation: 'Makkiyah', description: 'Tanda kiamat & Lailatul Qadr' },
  { number: 45,  name: 'Al-Jasiyah',     arName: 'الْجَاثِيَة',    meaning: 'Yang Berlutut',      totalAyat: 37,  juz: [25],   revelation: 'Makkiyah', description: 'Hari kiamat & nikmat Allah' },
  { number: 46,  name: 'Al-Ahqaf',       arName: 'الْأَحْقَاف',    meaning: 'Bukit Pasir',        totalAyat: 35,  juz: [26],   revelation: 'Makkiyah', description: 'Kaum Ad & dakwah orang tua' },
  { number: 47,  name: 'Muhammad',       arName: 'مُحَمَّد',       meaning: 'Nabi Muhammad',      totalAyat: 38,  juz: [26],   revelation: 'Madaniyah', description: 'Perintah jihad & ciri munafik' },
  { number: 48,  name: 'Al-Fath',        arName: 'الْفَتْح',       meaning: 'Kemenangan',         totalAyat: 29,  juz: [26],   revelation: 'Madaniyah', description: 'Perjanjian Hudaibiyah — fathun mubin' },
  { number: 49,  name: 'Al-Hujurat',     arName: 'الْحُجُرَات',    meaning: 'Kamar-kamar',        totalAyat: 18,  juz: [26],   revelation: 'Madaniyah', description: 'Adab bermasyarakat & ukhuwah' },
  { number: 50,  name: 'Qaf',            arName: 'قٓ',             meaning: 'Qaf',                totalAyat: 45,  juz: [26],   revelation: 'Makkiyah', description: 'Kebangkitan dan hari pengadilan' },
  { number: 51,  name: 'Az-Zariyat',     arName: 'الذَّارِيَات',   meaning: 'Yang Menerbangkan',  totalAyat: 60,  juz: [26,27],revelation: 'Makkiyah', description: 'Tanda kekuasaan Allah & rezeki' },
  { number: 52,  name: 'At-Tur',         arName: 'الطُّور',        meaning: 'Bukit Tursina',      totalAyat: 49,  juz: [27],   revelation: 'Makkiyah', description: 'Sumpah dengan bukit Tursina' },
  { number: 53,  name: 'An-Najm',        arName: 'النَّجْم',       meaning: 'Bintang',            totalAyat: 62,  juz: [27],   revelation: 'Makkiyah', description: 'Wahyu kepada Nabi via Jibril' },
  { number: 54,  name: 'Al-Qamar',       arName: 'الْقَمَر',       meaning: 'Bulan',              totalAyat: 55,  juz: [27],   revelation: 'Makkiyah', description: 'Mukjizat terbelahnya bulan' },
  { number: 55,  name: 'Ar-Rahman',      arName: 'الرَّحْمَٰن',    meaning: 'Maha Pengasih',      totalAyat: 78,  juz: [27],   revelation: 'Madaniyah', description: 'Pengantin Al-Quran — nikmat Allah' },
  { number: 56,  name: 'Al-Waqiah',      arName: 'الْوَاقِعَة',    meaning: 'Hari Kiamat',        totalAyat: 96,  juz: [27],   revelation: 'Makkiyah', description: '3 golongan manusia di akhirat' },
  { number: 57,  name: 'Al-Hadid',       arName: 'الْحَدِيد',      meaning: 'Besi',               totalAyat: 29,  juz: [27],   revelation: 'Madaniyah', description: 'Infaq & cahaya iman' },
  { number: 58,  name: 'Al-Mujadilah',   arName: 'الْمُجَادَلَة',  meaning: 'Yang Mengajukan Gugatan', totalAyat: 22, juz: [28], revelation: 'Madaniyah', description: 'Hukum zhihar & adab majelis' },
  { number: 59,  name: 'Al-Hasyr',       arName: 'الْحَشْر',       meaning: 'Pengusiran',         totalAyat: 24,  juz: [28],   revelation: 'Madaniyah', description: 'Pengusiran Bani Nadhir & nama Allah' },
  { number: 60,  name: 'Al-Mumtahanah',  arName: 'الْمُمْتَحَنَة', meaning: 'Wanita Yang Diuji',  totalAyat: 13,  juz: [28],   revelation: 'Madaniyah', description: 'Ujian iman para wanita muhajirah' },
  { number: 61,  name: 'As-Saff',        arName: 'الصَّفّ',        meaning: 'Barisan',            totalAyat: 14,  juz: [28],   revelation: 'Madaniyah', description: 'Berjihad dengan barisan kokoh' },
  { number: 62,  name: 'Al-Jumuah',      arName: 'الْجُمُعَة',     meaning: 'Hari Jumat',         totalAyat: 11,  juz: [28],   revelation: 'Madaniyah', description: 'Adab shalat Jumat' },
  { number: 63,  name: 'Al-Munafiqun',   arName: 'الْمُنَافِقُون', meaning: 'Orang Munafik',      totalAyat: 11,  juz: [28],   revelation: 'Madaniyah', description: 'Ciri-ciri orang munafik' },
  { number: 64,  name: 'At-Taghabun',    arName: 'التَّغَابُن',    meaning: 'Hari Penampakan',    totalAyat: 18,  juz: [28],   revelation: 'Madaniyah', description: 'Hari Kiamat — kerugian & keuntungan' },
  { number: 65,  name: 'At-Talaq',       arName: 'الطَّلَاق',      meaning: 'Talak',              totalAyat: 12,  juz: [28],   revelation: 'Madaniyah', description: 'Hukum talak & iddah' },
  { number: 66,  name: 'At-Tahrim',      arName: 'التَّحْرِيم',    meaning: 'Pengharaman',        totalAyat: 12,  juz: [28],   revelation: 'Madaniyah', description: 'Adab dalam rumah tangga Nabi' },
  { number: 67,  name: 'Al-Mulk',        arName: 'الْمُلْك',       meaning: 'Kerajaan',           totalAyat: 30,  juz: [29],   revelation: 'Makkiyah', description: 'Pelindung dari siksa kubur — dibaca tiap malam' },
  { number: 68,  name: 'Al-Qalam',       arName: 'الْقَلَم',       meaning: 'Pena',               totalAyat: 52,  juz: [29],   revelation: 'Makkiyah', description: 'Mukjizat pena & akhlak Nabi' },
  { number: 69,  name: 'Al-Haqqah',      arName: 'الْحَاقَّة',     meaning: 'Hari Kepastian',     totalAyat: 52,  juz: [29],   revelation: 'Makkiyah', description: 'Tafsir hari kiamat' },
  { number: 70,  name: 'Al-Maarij',      arName: 'الْمَعَارِج',    meaning: 'Tempat Naik',        totalAyat: 44,  juz: [29],   revelation: 'Makkiyah', description: 'Sifat sabar & kualitas mukmin' },
  { number: 71,  name: 'Nuh',            arName: 'نُوح',           meaning: 'Nabi Nuh',           totalAyat: 28,  juz: [29],   revelation: 'Makkiyah', description: 'Dakwah Nuh 950 tahun & banjir' },
  { number: 72,  name: 'Al-Jinn',        arName: 'الْجِنّ',        meaning: 'Jin',                totalAyat: 28,  juz: [29],   revelation: 'Makkiyah', description: 'Kisah jin mendengar Al-Quran' },
  { number: 73,  name: 'Al-Muzzammil',   arName: 'الْمُزَّمِّل',   meaning: 'Yang Berselimut',    totalAyat: 20,  juz: [29],   revelation: 'Makkiyah', description: 'Perintah qiyamullail' },
  { number: 74,  name: 'Al-Muddassir',   arName: 'الْمُدَّثِّر',   meaning: 'Yang Berkemul',      totalAyat: 56,  juz: [29],   revelation: 'Makkiyah', description: 'Perintah dakwah & peringatan' },
  { number: 75,  name: 'Al-Qiyamah',     arName: 'الْقِيَامَة',    meaning: 'Hari Kiamat',        totalAyat: 40,  juz: [29],   revelation: 'Makkiyah', description: 'Kebangkitan & hisab' },
  { number: 76,  name: 'Al-Insan',       arName: 'الْإِنْسَان',    meaning: 'Manusia',            totalAyat: 31,  juz: [29],   revelation: 'Madaniyah', description: 'Pahala orang shaleh di surga' },
  { number: 77,  name: 'Al-Mursalat',    arName: 'الْمُرْسَلَات',  meaning: 'Yang Diutus',        totalAyat: 50,  juz: [29],   revelation: 'Makkiyah', description: 'Hari Pengadilan — wailul yawmaidzin' },

  // Juz 30 — Juz Amma (paling sering dihafal)
  { number: 78,  name: 'An-Naba',        arName: 'النَّبَأ',       meaning: 'Berita Besar',       totalAyat: 40,  juz: [30],   revelation: 'Makkiyah', description: 'Berita besar tentang kiamat' },
  { number: 79,  name: 'An-Naziat',      arName: 'النَّازِعَات',   meaning: 'Yang Mencabut',      totalAyat: 46,  juz: [30],   revelation: 'Makkiyah', description: 'Malaikat pencabut nyawa' },
  { number: 80,  name: 'Abasa',          arName: 'عَبَسَ',         meaning: 'Ia Bermuka Masam',   totalAyat: 42,  juz: [30],   revelation: 'Makkiyah', description: 'Teguran kepada Nabi & dakwah inklusif' },
  { number: 81,  name: 'At-Takwir',      arName: 'التَّكْوِير',    meaning: 'Penggulungan',       totalAyat: 29,  juz: [30],   revelation: 'Makkiyah', description: 'Tanda-tanda kiamat besar' },
  { number: 82,  name: 'Al-Infitar',     arName: 'الْانْفِطَار',   meaning: 'Yang Terbelah',      totalAyat: 19,  juz: [30],   revelation: 'Makkiyah', description: 'Pencatatan amal & kiamat' },
  { number: 83,  name: 'Al-Mutaffifin',  arName: 'الْمُطَفِّفِين', meaning: 'Orang Curang',       totalAyat: 36,  juz: [30],   revelation: 'Makkiyah', description: 'Larangan curang dalam timbangan' },
  { number: 84,  name: 'Al-Insyiqaq',    arName: 'الْانْشِقَاق',   meaning: 'Yang Terbelah',      totalAyat: 25,  juz: [30],   revelation: 'Makkiyah', description: 'Langit terbelah pada hari kiamat' },
  { number: 85,  name: 'Al-Buruj',       arName: 'الْبُرُوج',      meaning: 'Gugusan Bintang',    totalAyat: 22,  juz: [30],   revelation: 'Makkiyah', description: 'Kisah Ashabul Ukhdud' },
  { number: 86,  name: 'At-Tariq',       arName: 'الطَّارِق',      meaning: 'Yang Datang Malam',  totalAyat: 17,  juz: [30],   revelation: 'Makkiyah', description: 'Bintang yang berkilau & penciptaan' },
  { number: 87,  name: 'Al-Ala',         arName: 'الْأَعْلَىٰ',    meaning: 'Yang Maha Tinggi',   totalAyat: 19,  juz: [30],   revelation: 'Makkiyah', description: 'Tasbih kepada Allah & nasihat' },
  { number: 88,  name: 'Al-Ghasyiyah',   arName: 'الْغَاشِيَة',    meaning: 'Yang Datang Membungkus', totalAyat: 26, juz: [30], revelation: 'Makkiyah', description: 'Hari kiamat & ahli surga-neraka' },
  { number: 89,  name: 'Al-Fajr',        arName: 'الْفَجْر',       meaning: 'Fajar',              totalAyat: 30,  juz: [30],   revelation: 'Makkiyah', description: 'Sumpah waktu fajar & kaum yang dibinasakan' },
  { number: 90,  name: 'Al-Balad',       arName: 'الْبَلَد',       meaning: 'Negeri (Mekkah)',    totalAyat: 20,  juz: [30],   revelation: 'Makkiyah', description: 'Negeri Mekkah & jalan terjal kebajikan' },
  { number: 91,  name: 'Asy-Syams',      arName: 'الشَّمْس',       meaning: 'Matahari',           totalAyat: 15,  juz: [30],   revelation: 'Makkiyah', description: 'Sumpah matahari & jiwa yang suci' },
  { number: 92,  name: 'Al-Lail',        arName: 'اللَّيْل',       meaning: 'Malam',              totalAyat: 21,  juz: [30],   revelation: 'Makkiyah', description: 'Dua jalan manusia — beruntung atau celaka' },
  { number: 93,  name: 'Ad-Duha',        arName: 'الضُّحَىٰ',      meaning: 'Waktu Dhuha',        totalAyat: 11,  juz: [30],   revelation: 'Makkiyah', description: 'Allah tidak meninggalkan Nabi-Nya' },
  { number: 94,  name: 'Asy-Syarh',      arName: 'الشَّرْح',       meaning: 'Melapangkan',        totalAyat: 8,   juz: [30],   revelation: 'Makkiyah', description: 'Lapangnya dada Nabi & kemudahan setelah kesulitan' },
  { number: 95,  name: 'At-Tin',         arName: 'التِّين',        meaning: 'Buah Tin',           totalAyat: 8,   juz: [30],   revelation: 'Makkiyah', description: 'Penciptaan manusia sebaik-baik bentuk' },
  { number: 96,  name: 'Al-Alaq',        arName: 'الْعَلَق',       meaning: 'Segumpal Darah',     totalAyat: 19,  juz: [30],   revelation: 'Makkiyah', description: 'Wahyu pertama — "Iqra"' },
  { number: 97,  name: 'Al-Qadr',        arName: 'الْقَدْر',       meaning: 'Kemuliaan',          totalAyat: 5,   juz: [30],   revelation: 'Makkiyah', description: 'Lailatul Qadr lebih baik dari 1000 bulan' },
  { number: 98,  name: 'Al-Bayyinah',    arName: 'الْبَيِّنَة',    meaning: 'Bukti Nyata',        totalAyat: 8,   juz: [30],   revelation: 'Madaniyah', description: 'Ahli kitab & hujah Rasulullah' },
  { number: 99,  name: 'Az-Zalzalah',    arName: 'الزَّلْزَلَة',   meaning: 'Goncangan',          totalAyat: 8,   juz: [30],   revelation: 'Madaniyah', description: 'Goncangan bumi & amal dzarrah' },
  { number: 100, name: 'Al-Adiyat',      arName: 'الْعَادِيَات',   meaning: 'Kuda Perang',        totalAyat: 11,  juz: [30],   revelation: 'Makkiyah', description: 'Sumpah kuda perang yang berlari' },
  { number: 101, name: 'Al-Qariah',      arName: 'الْقَارِعَة',    meaning: 'Hari Kiamat',        totalAyat: 11,  juz: [30],   revelation: 'Makkiyah', description: 'Goncangan dahsyat hari kiamat' },
  { number: 102, name: 'At-Takasur',     arName: 'التَّكَاثُر',    meaning: 'Bermegah-megahan',   totalAyat: 8,   juz: [30],   revelation: 'Makkiyah', description: 'Bahaya saling berbangga harta' },
  { number: 103, name: 'Al-Asr',         arName: 'الْعَصْر',       meaning: 'Masa',               totalAyat: 3,   juz: [30],   revelation: 'Makkiyah', description: 'Rugi & rumus selamat — iman, amal, sabar' },
  { number: 104, name: 'Al-Humazah',     arName: 'الْهُمَزَة',     meaning: 'Pengumpat',          totalAyat: 9,   juz: [30],   revelation: 'Makkiyah', description: 'Ancaman bagi pengumpat & pencela' },
  { number: 105, name: 'Al-Fil',         arName: 'الْفِيل',        meaning: 'Gajah',              totalAyat: 5,   juz: [30],   revelation: 'Makkiyah', description: 'Kisah pasukan gajah Abrahah' },
  { number: 106, name: 'Quraisy',        arName: 'قُرَيْش',        meaning: 'Suku Quraisy',       totalAyat: 4,   juz: [30],   revelation: 'Makkiyah', description: 'Nikmat Allah kepada suku Quraisy' },
  { number: 107, name: 'Al-Maun',        arName: 'الْمَاعُون',     meaning: 'Barang Berguna',     totalAyat: 7,   juz: [30],   revelation: 'Makkiyah', description: 'Pendusta agama' },
  { number: 108, name: 'Al-Kautsar',     arName: 'الْكَوْثَر',     meaning: 'Nikmat Berlimpah',   totalAyat: 3,   juz: [30],   revelation: 'Makkiyah', description: 'Surat terpendek — telaga Kautsar' },
  { number: 109, name: 'Al-Kafirun',     arName: 'الْكَافِرُون',   meaning: 'Orang Kafir',        totalAyat: 6,   juz: [30],   revelation: 'Makkiyah', description: 'Penegasan tauhid murni' },
  { number: 110, name: 'An-Nasr',        arName: 'النَّصْر',       meaning: 'Pertolongan',        totalAyat: 3,   juz: [30],   revelation: 'Madaniyah', description: 'Kabar kemenangan & banyaknya manusia masuk Islam' },
  { number: 111, name: 'Al-Lahab',       arName: 'الْمَسَد',       meaning: 'Gejolak Api',        totalAyat: 5,   juz: [30],   revelation: 'Makkiyah', description: 'Tentang Abu Lahab paman Nabi' },
  { number: 112, name: 'Al-Ikhlas',      arName: 'الْإِخْلَاص',    meaning: 'Memurnikan Tauhid',  totalAyat: 4,   juz: [30],   revelation: 'Makkiyah', description: '1/3 Al-Quran — pengakuan tauhid' },
  { number: 113, name: 'Al-Falaq',       arName: 'الْفَلَق',       meaning: 'Waktu Subuh',        totalAyat: 5,   juz: [30],   revelation: 'Makkiyah', description: 'Doa perlindungan dari kejahatan' },
  { number: 114, name: 'An-Naas',        arName: 'النَّاس',        meaning: 'Manusia',            totalAyat: 6,   juz: [30],   revelation: 'Makkiyah', description: 'Doa perlindungan dari was-was syaitan' },
];

/**
 * Get surat metadata by number (1-114).
 */
export function getSuratMetadata(number) {
  return QURAN_SURAT.find((s) => s.number === number);
}

/**
 * Group surat by juz (untuk display di list view).
 * Returns Map { juzNumber: [surat...] }
 */
export function groupByJuz() {
  const groups = new Map();
  for (let j = 1; j <= 30; j++) groups.set(j, []);
  QURAN_SURAT.forEach((s) => {
    s.juz.forEach((j) => {
      if (groups.has(j)) groups.get(j).push(s);
    });
  });
  return groups;
}

/**
 * Total ayat across all 114 surat (untuk progress display).
 */
export const TOTAL_AYAT = QURAN_SURAT.reduce((acc, s) => acc + s.totalAyat, 0);
// Verified: 6236 (well-known Quran ayat count)
