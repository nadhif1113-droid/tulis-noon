// data/islamic-content.js
// Islamic content database for Tulis Noon Prayer Reminder System
// Source: Sahih hadits, Al-Quran, tradisi Islam

export const islamicContent = {
  
  // ============================================
  // HADIS PILIHAN (20 hadis)
  // ============================================
  hadis: [
    {
      id: 'h001',
      text: "Sholat adalah tiang agama. Barangsiapa menegakkannya, sungguh ia telah menegakkan agama.",
      source: "HR. Baihaqi",
      category: "sholat",
      language: "id"
    },
    {
      id: 'h002',
      text: "Perbuatan yang paling dicintai Allah adalah sholat tepat pada waktunya.",
      source: "HR. Bukhari dan Muslim",
      category: "sholat",
      language: "id"
    },
    {
      id: 'h003',
      text: "Sesungguhnya yang membedakan antara seorang muslim dengan kekafiran adalah meninggalkan sholat.",
      source: "HR. Muslim",
      category: "sholat",
      language: "id"
    },
    {
      id: 'h004',
      text: "Sholat lima waktu seperti sungai yang mengalir di depan rumah salah seorang dari kalian, ia mandi di sungai itu lima kali setiap hari.",
      source: "HR. Bukhari dan Muslim",
      category: "sholat",
      language: "id"
    },
    {
      id: 'h005',
      text: "Barangsiapa yang menjaga sholat lima waktu, maka sholat itu akan menjadi cahaya, bukti, dan keselamatan baginya pada hari kiamat.",
      source: "HR. Ahmad",
      category: "sholat",
      language: "id"
    },
    {
      id: 'h006',
      text: "Sholat Subuh berjamaah lebih baik daripada dunia dan seisinya.",
      source: "HR. Muslim",
      category: "subuh",
      language: "id"
    },
    {
      id: 'h007',
      text: "Dua rakaat sebelum Subuh lebih baik daripada dunia dan seisinya.",
      source: "HR. Muslim",
      category: "subuh",
      language: "id"
    },
    {
      id: 'h008',
      text: "Barangsiapa sholat Subuh berjamaah, maka ia berada dalam tanggungan Allah.",
      source: "HR. Muslim",
      category: "subuh",
      language: "id"
    },
    {
      id: 'h009',
      text: "Sholat Dzuhur adalah sholat pertengahan yang Allah perintahkan untuk dijaga.",
      source: "HR. Tirmidzi",
      category: "dzuhur",
      language: "id"
    },
    {
      id: 'h010',
      text: "Barangsiapa kehilangan sholat Ashar, seakan-akan ia kehilangan keluarga dan hartanya.",
      source: "HR. Bukhari dan Muslim",
      category: "ashar",
      language: "id"
    },
    {
      id: 'h011',
      text: "Bersegeralah menunaikan sholat Maghrib sebelum terbitnya bintang.",
      source: "HR. Abu Dawud",
      category: "maghrib",
      language: "id"
    },
    {
      id: 'h012',
      text: "Sholat Isya berjamaah seperti sholat setengah malam.",
      source: "HR. Muslim",
      category: "isya",
      language: "id"
    },
    {
      id: 'h013',
      text: "Barangsiapa membaca Ayat Kursi setelah sholat fardhu, tidak ada yang menghalanginya masuk surga kecuali kematian.",
      source: "HR. Nasai",
      category: "dzikir",
      language: "id"
    },
    {
      id: 'h014',
      text: "Doa adalah inti ibadah.",
      source: "HR. Tirmidzi",
      category: "doa",
      language: "id"
    },
    {
      id: 'h015',
      text: "Sesungguhnya Allah mencintai orang yang berdoa dengan sungguh-sungguh kepada-Nya.",
      source: "HR. Tirmidzi",
      category: "doa",
      language: "id"
    },
    {
      id: 'h016',
      text: "Barangsiapa membaca surat Al-Mulk setiap malam, ia akan terjaga dari siksa kubur.",
      source: "HR. Tirmidzi",
      category: "quran",
      language: "id"
    },
    {
      id: 'h017',
      text: "Orang yang membaca Al-Quran dengan tartil akan bersama malaikat yang mulia.",
      source: "HR. Bukhari",
      category: "quran",
      language: "id"
    },
    {
      id: 'h018',
      text: "Bahasa Arab adalah bahasa Al-Quran. Mencintai bahasa Arab adalah bagian dari mencintai Islam.",
      source: "Hadis riwayat",
      category: "bahasa",
      language: "id"
    },
    {
      id: 'h019',
      text: "Pelajarilah bahasa Arab, karena ia adalah bagian dari agamamu.",
      source: "HR. Ibnu Abi Syaibah",
      category: "bahasa",
      language: "id"
    },
    {
      id: 'h020',
      text: "Sebaik-baik kalian adalah yang belajar Al-Quran dan mengajarkannya.",
      source: "HR. Bukhari",
      category: "quran",
      language: "id"
    }
  ],

  // ============================================
  // DOA SETELAH SHOLAT (5 untuk setiap waktu)
  // ============================================
  doa: {
    fajr: [
      {
        id: 'd-fajr-001',
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا",
        latin: "Allahumma inni as'aluka 'ilman nafi'an wa rizqan thayyiban wa 'amalan mutaqabbalan",
        indonesian: "Ya Allah, aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima.",
        source: "HR. Ahmad, Ibnu Majah",
        bestTime: "Setelah Subuh"
      },
      {
        id: 'd-fajr-002',
        arabic: "اللَّهُمَّ بَارِكْ لَنَا فِي صَبَاحِنَا",
        latin: "Allahumma barik lana fi shabahina",
        indonesian: "Ya Allah, berkahilah pagi kami.",
        source: "Doa harian",
        bestTime: "Setelah Subuh"
      },
      {
        id: 'd-fajr-003',
        arabic: "اللَّهُمَّ اجْعَلْنِي مِنَ الذَّاكِرِينَ وَالشَّاكِرِينَ",
        latin: "Allahumma ij'alni minadz dzakirina wash shakirin",
        indonesian: "Ya Allah, jadikanlah aku termasuk orang-orang yang berdzikir dan bersyukur.",
        source: "Doa pilihan",
        bestTime: "Setelah Subuh"
      },
      {
        id: 'd-fajr-004',
        arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ",
        latin: "Bismillahi tawakkaltu 'alallah",
        indonesian: "Dengan nama Allah, aku bertawakal kepada Allah.",
        source: "HR. Tirmidzi",
        bestTime: "Pagi hari"
      },
      {
        id: 'd-fajr-005',
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
        latin: "Rabbana atina fid dunya hasanah wa fil akhirati hasanah",
        indonesian: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat.",
        source: "QS. Al-Baqarah: 201",
        bestTime: "Kapan saja"
      }
    ],
    dhuhr: [
      {
        id: 'd-dhuhr-001',
        arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
        latin: "Allahumma a'inni 'ala dzikrika wa syukrika wa husni 'ibadatik",
        indonesian: "Ya Allah, bantulah aku untuk berdzikir, bersyukur, dan beribadah dengan baik kepada-Mu.",
        source: "HR. Abu Dawud, Nasai",
        bestTime: "Setelah sholat"
      },
      {
        id: 'd-dhuhr-002',
        arabic: "اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا",
        latin: "Allahumma ati nafsi taqwaha wa zakkiha anta khairu man zakkaha",
        indonesian: "Ya Allah, berikanlah ketakwaan kepada jiwaku dan sucikanlah ia, Engkau-lah sebaik-baik penyuci.",
        source: "HR. Muslim",
        bestTime: "Setelah sholat"
      },
      {
        id: 'd-dhuhr-003',
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
        latin: "Allahumma inni as'alukal huda wat tuqa wal 'afafa wal ghina",
        indonesian: "Ya Allah, aku memohon kepada-Mu petunjuk, ketakwaan, kesucian diri, dan kekayaan hati.",
        source: "HR. Muslim",
        bestTime: "Setelah sholat"
      },
      {
        id: 'd-dhuhr-004',
        arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا",
        latin: "Allahumma barik lana fima razaqtana",
        indonesian: "Ya Allah, berkahilah kami dalam rezeki yang Engkau berikan.",
        source: "Doa harian",
        bestTime: "Setelah sholat"
      },
      {
        id: 'd-dhuhr-005',
        arabic: "اللَّهُمَّ يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
        latin: "Allahumma ya muqallibal qulubi tsabbit qalbi 'ala dinik",
        indonesian: "Ya Allah, wahai Yang membolak-balikkan hati, teguhkanlah hatiku di atas agama-Mu.",
        source: "HR. Tirmidzi",
        bestTime: "Kapan saja"
      }
    ],
    asr: [
      {
        id: 'd-asr-001',
        arabic: "اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ",
        latin: "Allahumma ajirni minan nar",
        indonesian: "Ya Allah, selamatkanlah aku dari api neraka.",
        source: "HR. Abu Dawud",
        bestTime: "Setelah Ashar"
      },
      {
        id: 'd-asr-002',
        arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا",
        latin: "Allahumma la sahla illa ma ja'altahu sahla",
        indonesian: "Ya Allah, tidak ada kemudahan kecuali yang Engkau jadikan mudah.",
        source: "HR. Ibnu Hibban",
        bestTime: "Saat kesulitan"
      },
      {
        id: 'd-asr-003',
        arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ",
        latin: "Hasbiyallahu la ilaha illa huwa 'alaihi tawakkaltu",
        indonesian: "Cukup Allah bagiku, tidak ada Tuhan selain Dia, kepada-Nya aku bertawakal.",
        source: "QS. At-Taubah: 129",
        bestTime: "Sore hari"
      },
      {
        id: 'd-asr-004',
        arabic: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي وَوَسِّعْ لِي فِي دَارِي وَبَارِكْ لِي فِي رِزْقِي",
        latin: "Allahumma ighfir li dzanbi wa wassi' li fi dari wa barik li fi rizqi",
        indonesian: "Ya Allah, ampunilah dosaku, lapangkanlah rumahku, dan berkahilah rezekiku.",
        source: "HR. Tirmidzi",
        bestTime: "Setelah sholat"
      },
      {
        id: 'd-asr-005',
        arabic: "رَبِّ زِدْنِي عِلْمًا",
        latin: "Rabbi zidni 'ilma",
        indonesian: "Ya Tuhanku, tambahkanlah kepadaku ilmu.",
        source: "QS. Thaha: 114",
        bestTime: "Sebelum belajar"
      }
    ],
    maghrib: [
      {
        id: 'd-maghrib-001',
        arabic: "اللَّهُمَّ بَارِكْ لَنَا فِي مَسَائِنَا",
        latin: "Allahumma barik lana fi masa'ina",
        indonesian: "Ya Allah, berkahilah sore kami.",
        source: "Doa harian",
        bestTime: "Setelah Maghrib"
      },
      {
        id: 'd-maghrib-002',
        arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        latin: "A'udzu bi kalimatillahit tammati min syarri ma khalaq",
        indonesian: "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan apa yang diciptakan-Nya.",
        source: "HR. Muslim",
        bestTime: "Sore hari"
      },
      {
        id: 'd-maghrib-003',
        arabic: "اللَّهُمَّ هَذَا إِقْبَالُ لَيْلِكَ وَإِدْبَارُ نَهَارِكَ",
        latin: "Allahumma hadza iqbalu lailika wa idbaru naharik",
        indonesian: "Ya Allah, ini adalah datangnya malam-Mu dan perginya siang-Mu.",
        source: "HR. Tirmidzi",
        bestTime: "Setelah Maghrib"
      },
      {
        id: 'd-maghrib-004',
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ وَالْهَرَمِ",
        latin: "Allahumma inni a'udzu bika minal kasali wal harami",
        indonesian: "Ya Allah, aku berlindung kepada-Mu dari sifat malas dan pikun.",
        source: "HR. Bukhari",
        bestTime: "Setelah sholat"
      },
      {
        id: 'd-maghrib-005',
        arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
        latin: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
        indonesian: "Ya Allah, Engkau Maha Pengampun dan menyukai pemberian maaf, maka maafkanlah aku.",
        source: "HR. Tirmidzi",
        bestTime: "Kapan saja"
      }
    ],
    isha: [
      {
        id: 'd-isha-001',
        arabic: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
        latin: "Allahumma bismika amutu wa ahya",
        indonesian: "Ya Allah, dengan nama-Mu aku mati dan hidup.",
        source: "HR. Bukhari",
        bestTime: "Sebelum tidur"
      },
      {
        id: 'd-isha-002',
        arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        latin: "Allahumma qini 'adzabaka yauma tab'atsu 'ibadak",
        indonesian: "Ya Allah, peliharalah aku dari azab-Mu pada hari Engkau membangkitkan hamba-hamba-Mu.",
        source: "HR. Muslim",
        bestTime: "Sebelum tidur"
      },
      {
        id: 'd-isha-003',
        arabic: "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ وَوَجَّهْتُ وَجْهِي إِلَيْكَ",
        latin: "Allahumma aslamtu nafsi ilaika wa wajjahtu wajhi ilaik",
        indonesian: "Ya Allah, aku serahkan diriku kepada-Mu dan kuhadapkan wajahku kepada-Mu.",
        source: "HR. Bukhari, Muslim",
        bestTime: "Sebelum tidur"
      },
      {
        id: 'd-isha-004',
        arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",
        latin: "Subhanallah, walhamdulillah, wa la ilaha illallah, wallahu akbar",
        indonesian: "Maha Suci Allah, segala puji bagi Allah, tiada Tuhan selain Allah, dan Allah Maha Besar.",
        source: "HR. Bukhari",
        bestTime: "Setelah sholat"
      },
      {
        id: 'd-isha-005',
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ",
        latin: "Allahumma inni a'udzu bika min 'adzabil qabri",
        indonesian: "Ya Allah, aku berlindung kepada-Mu dari azab kubur.",
        source: "HR. Bukhari",
        bestTime: "Setelah sholat"
      }
    ]
  },

  // ============================================
  // TIPS ISLAMI HARIAN (30+ tips)
  // ============================================
  tips: [
    {
      id: 't001',
      text: "Mulai hari dengan basmallah - 'Bismillahirrahmanirrahim'. Hari Anda akan diberkahi.",
      category: "doa",
      language: "id"
    },
    {
      id: 't002',
      text: "Tahajud di sepertiga malam terakhir adalah waktu mustajab untuk berdoa.",
      category: "ibadah",
      language: "id"
    },
    {
      id: 't003',
      text: "Sedekah sekecil apapun bisa menjadi penolak bala. Mulailah dari yang sederhana.",
      category: "sedekah",
      language: "id"
    },
    {
      id: 't004',
      text: "Bahasa Arab adalah kunci memahami Al-Quran. Setiap kata yang Anda pelajari adalah investasi akhirat.",
      category: "ilmu",
      language: "id"
    },
    {
      id: 't005',
      text: "Salam 'Assalamu'alaikum' bukan sekadar sapaan, tapi doa keselamatan untuk saudara muslim.",
      category: "adab",
      language: "id"
    },
    {
      id: 't006',
      text: "Membaca Al-Fatihah dengan tartil dan memahami artinya lebih utama dari membaca banyak ayat tanpa pemahaman.",
      category: "quran",
      language: "id"
    },
    {
      id: 't007',
      text: "Senyum kepada saudara muslim adalah sedekah. Dimulai dari yang paling mudah!",
      category: "akhlak",
      language: "id"
    },
    {
      id: 't008',
      text: "Berbuat baik kepada orang tua adalah pintu surga yang paling utama.",
      category: "akhlak",
      language: "id"
    },
    {
      id: 't009',
      text: "Sebelum tidur, baca Ayat Kursi. Anda akan dijaga sepanjang malam oleh malaikat.",
      category: "dzikir",
      language: "id"
    },
    {
      id: 't010',
      text: "Sholat Dhuha 2 rakaat seperti sedekah untuk seluruh persendian tubuh Anda.",
      category: "ibadah",
      language: "id"
    },
    {
      id: 't011',
      text: "Istighfar 100x sehari membuka pintu rezeki dan menghapus dosa.",
      category: "dzikir",
      language: "id"
    },
    {
      id: 't012',
      text: "Belajar bahasa Arab adalah ibadah. Setiap detik yang Anda habiskan adalah pahala.",
      category: "ilmu",
      language: "id"
    },
    {
      id: 't013',
      text: "Saat masuk masjid, dahulukan kaki kanan. Saat keluar, dahulukan kaki kiri.",
      category: "adab",
      language: "id"
    },
    {
      id: 't014',
      text: "Doa orang yang berpuasa tidak akan ditolak. Manfaatkan waktu sebelum berbuka.",
      category: "puasa",
      language: "id"
    },
    {
      id: 't015',
      text: "Sholawat 10x setelah Subuh dan Maghrib mendatangkan syafaat di hari kiamat.",
      category: "dzikir",
      language: "id"
    },
    {
      id: 't016',
      text: "Membantu sesama muslim adalah ibadah yang besar. Mulailah dari lingkungan sekitar.",
      category: "akhlak",
      language: "id"
    },
    {
      id: 't017',
      text: "Hari Jumat adalah hari raya mingguan muslim. Perbanyak amalan: sholawat, baca Al-Kahfi, dan dzikir.",
      category: "ibadah",
      language: "id"
    },
    {
      id: 't018',
      text: "Lapar di siang hari saat puasa, kenyangkan diri dengan dzikir dan baca Al-Quran.",
      category: "puasa",
      language: "id"
    },
    {
      id: 't019',
      text: "Berdoa untuk saudara muslim tanpa sepengetahuannya adalah doa yang paling cepat dikabulkan.",
      category: "doa",
      language: "id"
    },
    {
      id: 't020',
      text: "Sebelum tidur, muhasabah diri. Hitung dosa dan kebaikan hari ini, lalu berdoa untuk perbaikan.",
      category: "akhlak",
      language: "id"
    },
    {
      id: 't021',
      text: "Mengajarkan satu ayat Al-Quran lebih baik daripada dunia dan seisinya.",
      category: "ilmu",
      language: "id"
    },
    {
      id: 't022',
      text: "Saat sedih, banyak istighfar. Saat senang, banyak alhamdulillah. Saat lupa, banyak subhanallah.",
      category: "dzikir",
      language: "id"
    },
    {
      id: 't023',
      text: "Wudhu yang sempurna mengangkat derajat dan menghapus dosa-dosa kecil.",
      category: "ibadah",
      language: "id"
    },
    {
      id: 't024',
      text: "Berbicara baik atau diam. Lidah adalah anggota tubuh yang paling banyak masuk neraka.",
      category: "akhlak",
      language: "id"
    },
    {
      id: 't025',
      text: "Pelajari nama-nama Allah (Asmaul Husna). Memahami sifat Allah menambah cinta kepada-Nya.",
      category: "ilmu",
      language: "id"
    },
    {
      id: 't026',
      text: "Jangan tinggalkan sholat Jamaah. Pahalanya 27x lipat dari sholat sendiri.",
      category: "ibadah",
      language: "id"
    },
    {
      id: 't027',
      text: "Saat menyebut nama Nabi Muhammad, ucapkan 'Shalallahu 'alaihi wasallam'. Setiap sholawat dibalas 10x.",
      category: "dzikir",
      language: "id"
    },
    {
      id: 't028',
      text: "Saat melihat orang yang lebih tua, hormati. Saat melihat yang lebih muda, sayangi.",
      category: "akhlak",
      language: "id"
    },
    {
      id: 't029',
      text: "Bahasa Arab adalah bahasa surga. Mulai pelajari hari ini, sekecil apapun.",
      category: "ilmu",
      language: "id"
    },
    {
      id: 't030',
      text: "Sabar dan sholat adalah dua senjata muslim. Saat masalah datang, dua hal ini menjadi penolong.",
      category: "akhlak",
      language: "id"
    }
  ],

  // ============================================
  // QUOTES MOTIVASI BAHASA ARAB
  // ============================================
  arabicQuotes: [
    {
      id: 'q001',
      arabic: "اطْلُبُوا الْعِلْمَ مِنَ الْمَهْدِ إِلَى اللَّحْدِ",
      latin: "Uthlubul 'ilma minal mahdi ilal lahdi",
      indonesian: "Tuntutlah ilmu dari buaian hingga liang lahat.",
      source: "Hadis populer"
    },
    {
      id: 'q002',
      arabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
      latin: "Khairun nasi anfa'uhum lin nas",
      indonesian: "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.",
      source: "HR. Ahmad"
    },
    {
      id: 'q003',
      arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
      latin: "Innamal a'malu binniyat",
      indonesian: "Sesungguhnya amalan itu tergantung niatnya.",
      source: "HR. Bukhari"
    },
    {
      id: 'q004',
      arabic: "مَنْ جَدَّ وَجَدَ",
      latin: "Man jadda wajada",
      indonesian: "Barangsiapa bersungguh-sungguh, pasti akan berhasil.",
      source: "Pepatah Arab"
    },
    {
      id: 'q005',
      arabic: "الْوَقْتُ كَالسَّيْفِ إِنْ لَمْ تَقْطَعْهُ قَطَعَكَ",
      latin: "Al-waqtu kas saif, in lam taqtha'hu qatha'aka",
      indonesian: "Waktu bagaikan pedang. Jika kamu tidak memotongnya, ia akan memotongmu.",
      source: "Pepatah Arab"
    },
    {
      id: 'q006',
      arabic: "الْعِلْمُ نُورٌ",
      latin: "Al-'ilmu nurun",
      indonesian: "Ilmu adalah cahaya.",
      source: "Pepatah Arab"
    },
    {
      id: 'q007',
      arabic: "لَا إِكْرَاهَ فِي الدِّينِ",
      latin: "La ikraha fid din",
      indonesian: "Tidak ada paksaan dalam agama.",
      source: "QS. Al-Baqarah: 256"
    },
    {
      id: 'q008',
      arabic: "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
      latin: "Wa man yatawakkal 'alallahi fa huwa hasbuh",
      indonesian: "Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkannya.",
      source: "QS. At-Talaq: 3"
    }
  ]
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get random Hadis
 * @returns {Object} Random hadis
 */
export function getRandomHadis() {
  const hadis = islamicContent.hadis;
  return hadis[Math.floor(Math.random() * hadis.length)];
}

/**
 * Get random doa for specific prayer time
 * @param {string} prayerTime - fajr|dhuhr|asr|maghrib|isha
 * @returns {Object} Random doa
 */
export function getRandomDoa(prayerTime) {
  const doas = islamicContent.doa[prayerTime.toLowerCase()];
  if (!doas) return null;
  return doas[Math.floor(Math.random() * doas.length)];
}

/**
 * Get random Islamic tip
 * @returns {Object} Random tip
 */
export function getRandomTip() {
  const tips = islamicContent.tips;
  return tips[Math.floor(Math.random() * tips.length)];
}

/**
 * Get random Arabic quote
 * @returns {Object} Random Arabic quote with translation
 */
export function getRandomArabicQuote() {
  const quotes = islamicContent.arabicQuotes;
  return quotes[Math.floor(Math.random() * quotes.length)];
}

/**
 * Get notification content for prayer time
 * @param {string} prayerTime - Prayer time
 * @returns {Object} Complete notification content
 */
export function getNotificationContent(prayerTime) {
  return {
    hadis: getRandomHadis(),
    doa: getRandomDoa(prayerTime),
    tip: getRandomTip(),
    arabicQuote: getRandomArabicQuote()
  };
}

export default islamicContent;
