// data/learning-umrah.js
// Path UMRAH — 15 modul untuk jamaah/wisatawan ke Saudi.
// Target: 1500 kosakata. Bahasa Arab baku (Fusha modern), praktis & sopan.
//
// Setiap modul: vocab list + 6-10 percakapan (situational dialogue).
// Format dialog: { speaker, ar, latin, indo } — speaker bisa 'A'/'B' atau role spesifik (Petugas/Anda/dll).

export const LEARNING_UMRAH = [
  // ============================================================
  // PERCAKAPAN DASAR & KEDATANGAN (Modul 1-4)
  // ============================================================
  {
    id: 'bandara-imigrasi',
    pathId: 'umrah',
    order: 1,
    title: 'Di Bandara & Imigrasi',
    arabic: 'في المطار والجوازات',
    emoji: '✈️',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    description: 'Pemeriksaan paspor, visa umrah, pengambilan bagasi, bea cukai.',
    estimatedMinutes: 8,
    xpReward: 80,
    vocab: [
      { ar: 'جَوَاز السَّفَر', latin: 'jawaaz as-safar', id: 'Paspor' },
      { ar: 'التَّأْشِيرَة', latin: 'at-ta\'syiirah', id: 'Visa' },
      { ar: 'العُمْرَة', latin: 'al-\'umrah', id: 'Umrah' },
      { ar: 'الحَقِيبَة', latin: 'al-haqiibah', id: 'Tas / koper' },
      { ar: 'الجَمَارِك', latin: 'al-jamaarik', id: 'Bea cukai' },
      { ar: 'مَوْظَّف الجَوَازَات', latin: 'muwazhzhaf al-jawaazaat', id: 'Petugas imigrasi' },
      { ar: 'بِطَاقَة الوُصُول', latin: 'bithaaqat al-wushuul', id: 'Kartu kedatangan' },
      { ar: 'مُدَّة الإِقَامَة', latin: 'muddat al-iqaamah', id: 'Lama tinggal' },
      { ar: 'البَصْمَة', latin: 'al-bashmah', id: 'Sidik jari' },
      { ar: 'الصُّورَة', latin: 'ash-shuurah', id: 'Foto' },
      { ar: 'مَمْنُوع', latin: 'mamnuu\'', id: 'Dilarang' },
      { ar: 'مَسْمُوح', latin: 'masmuuh', id: 'Diperbolehkan' },
    ],
    conversations: [
      {
        id: 'c1',
        title: 'Menyerahkan Paspor',
        situation: 'Antri di counter imigrasi',
        dialog: [
          { speaker: 'Petugas', ar: 'السَّلَامُ عَلَيْكُمْ. جَوَاز سَفَرِكَ مِنْ فَضْلِكَ.', latin: 'as-salaamu \'alaykum. jawaaz safarika min fadhlik.', id: 'Assalamu alaikum. Paspor Anda silakan.' },
          { speaker: 'Anda', ar: 'وَعَلَيْكُمُ السَّلَامُ. تَفَضَّلْ.', latin: 'wa \'alaykumus-salaam. tafadhdhal.', id: 'Wa alaikum salam. Silakan.' },
          { speaker: 'Petugas', ar: 'هَلْ هَذِهِ تَأْشِيرَة عُمْرَة؟', latin: 'hal hadhihi ta\'syiirat \'umrah?', id: 'Ini visa umrah?' },
          { speaker: 'Anda', ar: 'نَعَمْ، تَأْشِيرَة عُمْرَة.', latin: 'na\'am, ta\'syiirat \'umrah.', id: 'Iya, visa umrah.' },
        ],
      },
      {
        id: 'c2',
        title: 'Tanya Tujuan Kedatangan',
        situation: 'Petugas tanya tujuan kunjungan',
        dialog: [
          { speaker: 'Petugas', ar: 'مَا الغَرَض مِنْ زِيَارَتِكَ؟', latin: 'maa al-gharadh min ziyaaratika?', id: 'Apa tujuan kunjungan Anda?' },
          { speaker: 'Anda', ar: 'جِئْتُ لِأَدَاء العُمْرَة.', latin: 'ji\'tu li-adaa\'i al-\'umrah.', id: 'Saya datang untuk melaksanakan umrah.' },
          { speaker: 'Petugas', ar: 'كَمْ مُدَّة إِقَامَتِكَ؟', latin: 'kam muddat iqaamatika?', id: 'Berapa lama Anda akan tinggal?' },
          { speaker: 'Anda', ar: 'عَشَرَة أَيَّام إِنْ شَاءَ اللَّه.', latin: '\'asyrah ayyaam in syaa\'allah.', id: '10 hari insya Allah.' },
        ],
      },
      {
        id: 'c3',
        title: 'Sidik Jari & Foto',
        situation: 'Proses biometrik di counter',
        dialog: [
          { speaker: 'Petugas', ar: 'ضَعْ أَصَابِعَكَ هُنَا لِلْبَصْمَة.', latin: 'dha\' ashaabi\'aka hunaa lil-bashmah.', id: 'Letakkan jari Anda di sini untuk sidik jari.' },
          { speaker: 'Anda', ar: 'حَاضِر.', latin: 'haadhir.', id: 'Siap.' },
          { speaker: 'Petugas', ar: 'انْظُرْ إِلَى الكَامِيرَا مِنْ فَضْلِكَ.', latin: 'unzhur ilaa al-kaamiraa min fadhlik.', id: 'Lihat ke kamera silakan.' },
          { speaker: 'Anda', ar: 'هَكَذَا؟', latin: 'haakadzaa?', id: 'Seperti ini?' },
          { speaker: 'Petugas', ar: 'نَعَمْ، شُكْرًا. كُلّ شَيْء جَاهِز.', latin: 'na\'am, syukran. kullu syay\'in jaahiz.', id: 'Iya, terima kasih. Semua sudah siap.' },
        ],
      },
      {
        id: 'c4',
        title: 'Mencari Bagasi',
        situation: 'Di area pengambilan bagasi',
        dialog: [
          { speaker: 'Anda', ar: 'عَفْوًا، أَيْنَ اسْتِلَام الحَقَائِب لِرِحْلَة جَاكَرْتَا؟', latin: '\'afwan, ayna istilaam al-haqaa\'ib li-rihlah Jaakartaa?', id: 'Permisi, di mana pengambilan bagasi untuk penerbangan dari Jakarta?' },
          { speaker: 'Petugas', ar: 'الحِزَام رَقْم خَمْسَة، عَلَى اليَمِين.', latin: 'al-hizaam raqm khamsah, \'alaa al-yamiin.', id: 'Belt nomor 5, di sebelah kanan.' },
          { speaker: 'Anda', ar: 'شُكْرًا جَزِيلًا.', latin: 'syukran jaziilan.', id: 'Terima kasih banyak.' },
        ],
      },
      {
        id: 'c5',
        title: 'Bagasi Hilang / Belum Keluar',
        situation: 'Koper belum muncul di belt',
        dialog: [
          { speaker: 'Anda', ar: 'حَقِيبَتِي لَمْ تَصِل بَعْد.', latin: 'haqiibatii lam tashil ba\'d.', id: 'Bagasi saya belum sampai.' },
          { speaker: 'Petugas', ar: 'مَا رَقْم رِحْلَتِك؟', latin: 'maa raqm rihlatik?', id: 'Nomor penerbangan Anda berapa?' },
          { speaker: 'Anda', ar: 'رِحْلَة سَعُودِيَّة رَقْم 825.', latin: 'rihlat sa\'uudiyyah raqm tsamaani-mi\'ah wa khamsah wa \'isyriin.', id: 'Saudia 825.' },
          { speaker: 'Petugas', ar: 'تَفَضَّل اِمْلَأ هَذِهِ الاِسْتِمَارَة.', latin: 'tafadhdhal imla\' hadhihi al-istimaarah.', id: 'Silakan isi formulir ini.' },
        ],
      },
      {
        id: 'c6',
        title: 'Di Bea Cukai',
        situation: 'Pemeriksaan barang bawaan',
        dialog: [
          { speaker: 'Petugas', ar: 'هَلْ لَدَيْكَ شَيْء لِلتَّصْرِيح؟', latin: 'hal ladayka syay\' lit-tashriih?', id: 'Ada barang untuk dideklarasikan?' },
          { speaker: 'Anda', ar: 'لَا، فَقَط مَلَابِس وَأَدَوَات شَخْصِيَّة.', latin: 'laa, faqath malaabis wa adawaat syakhshiyyah.', id: 'Tidak, hanya pakaian dan barang pribadi.' },
          { speaker: 'Petugas', ar: 'هَلْ تَحْمِل أَدْوِيَة؟', latin: 'hal tahmil adwiyah?', id: 'Apa Anda bawa obat-obatan?' },
          { speaker: 'Anda', ar: 'نَعَمْ، أَدْوِيَة شَخْصِيَّة فَقَط مَع وَصْفَة طَبِيب.', latin: 'na\'am, adwiyah syakhshiyyah faqath ma\'a washfah thabiib.', id: 'Iya, obat pribadi saja dengan resep dokter.' },
          { speaker: 'Petugas', ar: 'تَفَضَّل، رِحْلَة سَعِيدَة.', latin: 'tafadhdhal, rihlah sa\'iidah.', id: 'Silakan, semoga perjalanan menyenangkan.' },
        ],
      },
      {
        id: 'c7',
        title: 'Tanya Lokasi ATM/Money Changer',
        situation: 'Setelah keluar dari area imigrasi',
        dialog: [
          { speaker: 'Anda', ar: 'عَفْوًا، أَيْنَ صَرَّاف آلِي؟', latin: '\'afwan, ayna sharraaf aalii?', id: 'Permisi, di mana ATM?' },
          { speaker: 'Petugas', ar: 'فِي الصَّالَة الرَّئِيسِيَّة، بِجَانِب المَطْعَم.', latin: 'fii ash-shaalah ar-ra\'iisiyyah, bi-jaanib al-math\'am.', id: 'Di hall utama, sebelah restoran.' },
          { speaker: 'Anda', ar: 'وَأَيْنَ مَكْتَب تَحْوِيل العُمْلَة؟', latin: 'wa ayna maktab tahwiil al-\'umlah?', id: 'Dan di mana money changer?' },
          { speaker: 'Petugas', ar: 'بِجَانِب الصَّرَّاف الآلِي مُبَاشَرَة.', latin: 'bi-jaanib ash-sharraaf al-aalii mubaasyarah.', id: 'Tepat di sebelah ATM.' },
        ],
      },
      {
        id: 'c8',
        title: 'Salam Perpisahan ke Petugas',
        situation: 'Setelah proses imigrasi selesai',
        dialog: [
          { speaker: 'Petugas', ar: 'مَرْحَبًا بِكَ فِي المَمْلَكَة العَرَبِيَّة السُّعُودِيَّة.', latin: 'marhaban bika fii al-mamlakah al-\'arabiyyah as-su\'uudiyyah.', id: 'Selamat datang di Kerajaan Arab Saudi.' },
          { speaker: 'Anda', ar: 'شُكْرًا جَزِيلًا. تَقَبَّل اللَّه مِنَّا وَمِنْكُم.', latin: 'syukran jaziilan. taqabbalallaah minnaa wa minkum.', id: 'Terima kasih banyak. Semoga Allah menerima dari kami dan kalian.' },
          { speaker: 'Petugas', ar: 'آمِين. أَتَمَنَّى لَكَ عُمْرَة مَقْبُولَة.', latin: 'aamiin. atamannaa laka \'umrah maqbuulah.', id: 'Amin. Semoga umrah Anda mabrurah.' },
        ],
      },
    ],
  },

  {
    id: 'transportasi-hotel',
    pathId: 'umrah',
    order: 2,
    title: 'Transportasi dari Bandara ke Hotel',
    arabic: 'النقل من المطار إلى الفندق',
    emoji: '🚖',
    color: '#a05536',
    bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
    description: 'Naik taksi, bus Saptco, atau kereta cepat Haramain.',
    estimatedMinutes: 7,
    xpReward: 75,
    vocab: [
      { ar: 'سَيَّارَة الأُجْرَة', latin: 'sayyaarat al-ujrah', id: 'Taksi' },
      { ar: 'الحَافِلَة', latin: 'al-haafilah', id: 'Bus' },
      { ar: 'قِطَار الحَرَمَيْن', latin: 'qithaar al-haramayn', id: 'Kereta Haramain' },
      { ar: 'المَحَطَّة', latin: 'al-mahaththah', id: 'Stasiun' },
      { ar: 'مَوْقِف', latin: 'mawqif', id: 'Halte / parkir' },
      { ar: 'الفُنْدُق', latin: 'al-funduq', id: 'Hotel' },
      { ar: 'الأُجْرَة', latin: 'al-ujrah', id: 'Tarif / ongkos' },
      { ar: 'العَدَّاد', latin: 'al-\'addaad', id: 'Argometer' },
      { ar: 'بَعِيد', latin: 'ba\'iid', id: 'Jauh' },
      { ar: 'قَرِيب', latin: 'qariib', id: 'Dekat' },
      { ar: 'مُبَاشَرَة', latin: 'mubaasyarah', id: 'Langsung' },
      { ar: 'الطَّرِيق', latin: 'ath-thariiq', id: 'Jalan' },
    ],
    conversations: [
      {
        id: 'c1',
        title: 'Memanggil Taksi',
        situation: 'Di antrian taksi bandara',
        dialog: [
          { speaker: 'Anda', ar: 'السَّلَامُ عَلَيْكُمْ، تَاكْسِي؟', latin: 'as-salaamu \'alaykum, taksii?', id: 'Assalamu alaikum, taksi?' },
          { speaker: 'Sopir', ar: 'وَعَلَيْكُمُ السَّلَامُ. إِلَى أَيْن؟', latin: 'wa \'alaykumus-salaam. ilaa ayn?', id: 'Wa alaikum salam. Mau ke mana?' },
          { speaker: 'Anda', ar: 'إِلَى فُنْدُق هِيلْتُون، قَرِيب مِنَ الحَرَم.', latin: 'ilaa funduq Hilton, qariib min al-haram.', id: 'Ke Hotel Hilton, dekat Masjidil Haram.' },
        ],
      },
      {
        id: 'c2',
        title: 'Negosiasi Tarif',
        situation: 'Taksi tanpa argo',
        dialog: [
          { speaker: 'Anda', ar: 'كَمْ الأُجْرَة إِلَى الفُنْدُق؟', latin: 'kam al-ujrah ilaa al-funduq?', id: 'Berapa tarif sampai hotel?' },
          { speaker: 'Sopir', ar: 'مِائَة وَخَمْسُونَ رِيَالًا.', latin: 'mi\'ah wa khamsuuna riyaalan.', id: '150 riyal.' },
          { speaker: 'Anda', ar: 'غَالٍ، مَا رَأْيُكَ بِمِائَة رِيَال؟', latin: 'ghaalin, maa ra\'yuka bi-mi\'ah riyaal?', id: 'Mahal. Bagaimana kalau 100 riyal?' },
          { speaker: 'Sopir', ar: 'طَيِّب، مِائَة وَعِشْرُونَ.', latin: 'thayyib, mi\'ah wa \'isyruun.', id: 'Baik, 120 saja.' },
          { speaker: 'Anda', ar: 'اِتَّفَقْنَا.', latin: 'ittafaqnaa.', id: 'Setuju.' },
        ],
      },
      {
        id: 'c3',
        title: 'Minta Pakai Argometer',
        situation: 'Pastikan tarif resmi',
        dialog: [
          { speaker: 'Anda', ar: 'مِنْ فَضْلِكَ، شَغِّل العَدَّاد.', latin: 'min fadhlik, syaghghil al-\'addaad.', id: 'Tolong nyalakan argometer.' },
          { speaker: 'Sopir', ar: 'حَاضِر، العَدَّاد يَعْمَل.', latin: 'haadhir, al-\'addaad ya\'mal.', id: 'Siap, argometer jalan.' },
          { speaker: 'Anda', ar: 'كَمْ تَقْرِيبًا الأُجْرَة؟', latin: 'kam taqriiban al-ujrah?', id: 'Kira-kira berapa tarifnya?' },
          { speaker: 'Sopir', ar: 'حَوَالَي ثَمَانِين رِيَالًا.', latin: 'hawaalay tsamaaniin riyaalan.', id: 'Sekitar 80 riyal.' },
        ],
      },
      {
        id: 'c4',
        title: 'Naik Kereta Haramain',
        situation: 'Tanya tiket di stasiun',
        dialog: [
          { speaker: 'Anda', ar: 'عَفْوًا، أَيْنَ مَكْتَب التَّذَاكِر؟', latin: '\'afwan, ayna maktab at-tadzaakir?', id: 'Permisi, di mana loket tiket?' },
          { speaker: 'Petugas', ar: 'هُنَاك، عَلَى اليَمِين.', latin: 'hunaaka, \'alaa al-yamiin.', id: 'Di sana, sebelah kanan.' },
          { speaker: 'Anda', ar: 'أُرِيد تَذْكِرَة إِلَى المَدِينَة المُنَوَّرَة.', latin: 'uriid tadzkirah ilaa al-madiinah al-munawwarah.', id: 'Saya mau tiket ke Madinah.' },
          { speaker: 'Petugas', ar: 'دَرَجَة سِيَاحِيَّة أَوْ أُولَى؟', latin: 'darajah siyaahiyyah aw uulaa?', id: 'Kelas ekonomi atau kelas 1?' },
          { speaker: 'Anda', ar: 'سِيَاحِيَّة مِنْ فَضْلِكَ.', latin: 'siyaahiyyah min fadhlik.', id: 'Ekonomi saja.' },
        ],
      },
      {
        id: 'c5',
        title: 'Naik Bus Saptco',
        situation: 'Cari halte / nomor bus',
        dialog: [
          { speaker: 'Anda', ar: 'مَا رَقْم الحَافِلَة إِلَى الحَرَم؟', latin: 'maa raqm al-haafilah ilaa al-haram?', id: 'Bus nomor berapa ke Masjidil Haram?' },
          { speaker: 'Petugas', ar: 'رَقْم سَبْعَة، تَنْطَلِق كُلّ نِصْف سَاعَة.', latin: 'raqm sab\'ah, tanthaliq kulla nishf saa\'ah.', id: 'Nomor 7, berangkat setiap 30 menit.' },
          { speaker: 'Anda', ar: 'كَمْ ثَمَن التَّذْكِرَة؟', latin: 'kam tsaman at-tadzkirah?', id: 'Berapa harga tiketnya?' },
          { speaker: 'Petugas', ar: 'عَشَرَة رِيَال.', latin: '\'asyrah riyaal.', id: '10 riyal.' },
        ],
      },
      {
        id: 'c6',
        title: 'Tanya Estimasi Waktu',
        situation: 'Di dalam taksi',
        dialog: [
          { speaker: 'Anda', ar: 'كَمْ تَسْتَغْرِق الرِّحْلَة؟', latin: 'kam tastaghriq ar-rihlah?', id: 'Berapa lama perjalanan?' },
          { speaker: 'Sopir', ar: 'حَوَالَي خَمْس وَأَرْبَعِين دَقِيقَة.', latin: 'hawaalay khams wa arba\'iin daqiiqah.', id: 'Sekitar 45 menit.' },
          { speaker: 'Anda', ar: 'هَلْ الطَّرِيق مُزْدَحِم الآن؟', latin: 'hal ath-thariiq muzdaham al-aan?', id: 'Apakah jalanan macet sekarang?' },
          { speaker: 'Sopir', ar: 'قَلِيلًا، لَكِنَّ سَنَصِل فِي الوَقْت.', latin: 'qaliilan, laakinna sanashil fii al-waqt.', id: 'Sedikit, tapi kita akan tiba tepat waktu.' },
        ],
      },
      {
        id: 'c7',
        title: 'Sampai Hotel & Bayar',
        situation: 'Turun dari taksi',
        dialog: [
          { speaker: 'Sopir', ar: 'وَصَلْنَا، هَذَا فُنْدُقُكَ.', latin: 'washalnaa, hadhaa funduquka.', id: 'Sudah sampai, ini hotel Anda.' },
          { speaker: 'Anda', ar: 'الحَمْدُ لِلَّه. تَفَضَّل الأُجْرَة.', latin: 'al-hamdu lillaah. tafadhdhal al-ujrah.', id: 'Alhamdulillah. Ini ongkosnya.' },
          { speaker: 'Sopir', ar: 'شُكْرًا، الحَقَائِب فِي الصُّنْدُوق.', latin: 'syukran, al-haqaa\'ib fii ash-shunduuq.', id: 'Terima kasih, bagasi di bagasi mobil.' },
          { speaker: 'Anda', ar: 'جَزَاكَ اللَّه خَيْرًا.', latin: 'jazaakallaahu khairan.', id: 'Semoga Allah membalas kebaikan Anda.' },
        ],
      },
    ],
  },

  // Modul 3-15: structure dasar — content full conversations akan di-expand bertahap.
  // Untuk awal, kita kasih vocab + 2-3 percakapan dasar tiap modul biar user gak nemu modul kosong.
  {
    id: 'check-in-hotel',
    pathId: 'umrah',
    order: 3,
    title: 'Check-in & Check-out Hotel',
    arabic: 'تسجيل الدخول والخروج من الفندق',
    emoji: '🏨',
    color: '#c9a961',
    bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    description: 'Reservasi kamar, fasilitas, minta tambahan handuk/air zamzam.',
    estimatedMinutes: 6,
    xpReward: 70,
    vocab: [
      { ar: 'الحَجْز', latin: 'al-hajz', id: 'Reservasi' },
      { ar: 'الغُرْفَة', latin: 'al-ghurfah', id: 'Kamar' },
      { ar: 'المِفْتَاح', latin: 'al-miftaah', id: 'Kunci' },
      { ar: 'الإِفْطَار', latin: 'al-ifthaar', id: 'Sarapan' },
      { ar: 'المِنْشَفَة', latin: 'al-minsyafah', id: 'Handuk' },
      { ar: 'مَاء زَمْزَم', latin: 'maa\' zamzam', id: 'Air zamzam' },
      { ar: 'الوَايْفَاي', latin: 'al-waayfaay', id: 'WiFi' },
      { ar: 'الاسْتِقْبَال', latin: 'al-istiqbaal', id: 'Resepsionis' },
      { ar: 'الطَّابِق', latin: 'ath-thaabiq', id: 'Lantai' },
      { ar: 'إِطْلَالَة', latin: 'ithlaalah', id: 'View / pemandangan' },
    ],
    conversations: [
      {
        id: 'c1',
        title: 'Check-in dengan Reservasi',
        situation: 'Di resepsionis',
        dialog: [
          { speaker: 'Anda', ar: 'السَّلَامُ عَلَيْكُمْ، لَدَيَّ حَجْز بِاسْم أَحْمَد.', latin: 'as-salaamu \'alaykum, ladayya hajz bismi Ahmad.', id: 'Assalamu alaikum, saya punya reservasi atas nama Ahmad.' },
          { speaker: 'Resepsionis', ar: 'أَهْلًا وَسَهْلًا. جَوَاز السَّفَر مِنْ فَضْلِكَ.', latin: 'ahlan wa sahlan. jawaaz as-safar min fadhlik.', id: 'Selamat datang. Paspor silakan.' },
          { speaker: 'Anda', ar: 'تَفَضَّل.', latin: 'tafadhdhal.', id: 'Silakan.' },
          { speaker: 'Resepsionis', ar: 'غُرْفَتُكَ رَقْم 502، الطَّابِق الخَامِس.', latin: 'ghurfatuka raqm khamsumi\'ah wa itsnayn, ath-thaabiq al-khaamis.', id: 'Kamar Anda 502, lantai 5.' },
        ],
      },
      {
        id: 'c2',
        title: 'Minta Kamar dengan View Haram',
        situation: 'Saat memilih kamar',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ يُمْكِن غُرْفَة بِإِطْلَالَة عَلَى الحَرَم؟', latin: 'hal yumkin ghurfah bi-ithlaalah \'alaa al-haram?', id: 'Bisa kamar dengan view Masjidil Haram?' },
          { speaker: 'Resepsionis', ar: 'نَعَم، لَكِن السِّعْر أَعْلَى بِخَمْسِين رِيَال.', latin: 'na\'am, laakin as-si\'r a\'laa bi-khamsiin riyaal.', id: 'Iya, tapi tambah 50 riyal.' },
          { speaker: 'Anda', ar: 'لَا بَأْس، سَأَخُذُهَا.', latin: 'laa ba\'s, sa-aakhudzuhaa.', id: 'Tidak apa-apa, saya ambil.' },
        ],
      },
      {
        id: 'c3',
        title: 'Tanya Sarapan & WiFi',
        situation: 'Konfirmasi fasilitas',
        dialog: [
          { speaker: 'Anda', ar: 'مَتَى الإِفْطَار؟', latin: 'mataa al-ifthaar?', id: 'Kapan sarapan?' },
          { speaker: 'Resepsionis', ar: 'مِنَ السَّابِعَة إِلَى العَاشِرَة صَبَاحًا.', latin: 'min as-saabi\'ah ilaa al-\'aasyirah shabaahan.', id: 'Dari jam 7 sampai 10 pagi.' },
          { speaker: 'Anda', ar: 'وَكَلِمَة سِرّ الوَايْفَاي؟', latin: 'wa kalimat sirr al-waayfaay?', id: 'Dan password WiFi-nya?' },
          { speaker: 'Resepsionis', ar: 'مَكْتُوبَة عَلَى بِطَاقَة المِفْتَاح.', latin: 'maktuubah \'alaa bithaaqat al-miftaah.', id: 'Tertulis di kartu kunci.' },
        ],
      },
      {
        id: 'c4',
        title: 'Minta Handuk & Air Zamzam',
        situation: 'Telepon ke housekeeping',
        dialog: [
          { speaker: 'Anda', ar: 'مِنْ فَضْلِكَ، أَحْتَاج مَنَاشِف إِضَافِيَّة.', latin: 'min fadhlik, ahtaaj manaasyif idhaafiyyah.', id: 'Tolong, saya perlu handuk tambahan.' },
          { speaker: 'Petugas', ar: 'كَمْ مِنْشَفَة؟', latin: 'kam minsyafah?', id: 'Berapa handuk?' },
          { speaker: 'Anda', ar: 'اِثْنَتَيْن، وَزُجَاجَتَيْن مَاء زَمْزَم لَوْ سَمَحْت.', latin: 'itsnatayn, wa zujaajatayn maa\' zamzam law samahta.', id: 'Dua, dan dua botol air zamzam kalau boleh.' },
          { speaker: 'Petugas', ar: 'سَأُرْسِلُهَا حَالًا.', latin: 'sa-ursiluhaa haalan.', id: 'Akan saya kirim segera.' },
        ],
      },
      {
        id: 'c5',
        title: 'Check-out',
        situation: 'Pagi terakhir, mau keluar',
        dialog: [
          { speaker: 'Anda', ar: 'أُرِيد المُغَادَرَة الآن.', latin: 'uriid al-mughaadarah al-aan.', id: 'Saya mau check-out sekarang.' },
          { speaker: 'Resepsionis', ar: 'لَحْظَة، سَأُحَضِّر الفَاتُورَة.', latin: 'lahzhah, sa-uhadhdhir al-faatuurah.', id: 'Sebentar, saya siapkan tagihan.' },
          { speaker: 'Anda', ar: 'هَلْ يُمْكِن تَرْك الحَقَائِب هُنَا؟', latin: 'hal yumkin tark al-haqaa\'ib hunaa?', id: 'Bisa saya titip koper di sini?' },
          { speaker: 'Resepsionis', ar: 'بِالطَّبْع، حَتَّى مَتَى؟', latin: 'bith-thab\', hattaa mataa?', id: 'Tentu, sampai kapan?' },
          { speaker: 'Anda', ar: 'حَتَّى المَسَاء، رِحْلَتِي اللَّيْلَة.', latin: 'hattaa al-masaa\', rihlatii al-laylah.', id: 'Sampai sore, penerbangan saya malam ini.' },
        ],
      },
      {
        id: 'c6',
        title: 'Komplain AC / Air Panas',
        situation: 'Masalah teknis di kamar',
        dialog: [
          { speaker: 'Anda', ar: 'المُكَيِّف لَا يَعْمَل فِي غُرْفَتِي.', latin: 'al-mukayyif laa ya\'mal fii ghurfatii.', id: 'AC di kamar saya tidak jalan.' },
          { speaker: 'Resepsionis', ar: 'مَا رَقْم الغُرْفَة؟', latin: 'maa raqm al-ghurfah?', id: 'Nomor kamar Anda?' },
          { speaker: 'Anda', ar: '502، وَالمَاء السَّاخِن لَا يَعْمَل أَيْضًا.', latin: 'khamsumi\'ah wa itsnayn, wa al-maa\' as-saakhin laa ya\'mal aydhan.', id: '502, dan air panas juga tidak jalan.' },
          { speaker: 'Resepsionis', ar: 'سَأُرْسِل الفَنِّيّ خِلَال خَمْس دَقَائِق.', latin: 'sa-ursil al-fanniyy khilaal khams daqaa\'iq.', id: 'Saya kirim teknisi dalam 5 menit.' },
        ],
      },
    ],
  },

  // ============================================================
  // STUB MODULES (Modul 4-15) — vocab + sample percakapan
  // Akan di-expand bertahap di commit berikutnya.
  // ============================================================
  ...stubModule(4, 'arah-lokasi', 'Bertanya Arah & Lokasi', 'السؤال عن الاتجاهات', '🗺️', '#7a3d2a',
    'Menuju Masjidil Haram, Masjid Nabawi, hotel, atau landmark terdekat.',
    [
      { ar: 'أَيْنَ', latin: 'ayna', id: 'Di mana' },
      { ar: 'الطَّرِيق', latin: 'ath-thariiq', id: 'Jalan' },
      { ar: 'يَمِين', latin: 'yamiin', id: 'Kanan' },
      { ar: 'يَسَار', latin: 'yasaar', id: 'Kiri' },
      { ar: 'مُسْتَقِيم', latin: 'mustaqiim', id: 'Lurus' },
      { ar: 'قَرِيب', latin: 'qariib', id: 'Dekat' },
      { ar: 'بَعِيد', latin: 'ba\'iid', id: 'Jauh' },
    ]),
  ...stubModule(5, 'miqat-ihram', 'Di Miqat & Persiapan Ihram', 'في الميقات والإحرام', '🕋', '#0a4d3c',
    'Tempat miqat, niat, dan tata cara ihram.',
    [
      { ar: 'المِيقَات', latin: 'al-miiqaat', id: 'Miqat (tempat niat)' },
      { ar: 'الإِحْرَام', latin: 'al-ihraam', id: 'Ihram' },
      { ar: 'النِّيَّة', latin: 'an-niyyah', id: 'Niat' },
      { ar: 'لَبَّيْكَ اللَّهُمَّ', latin: 'labbaykallaahumma', id: 'Aku penuhi panggilan-Mu ya Allah' },
      { ar: 'مَلَابِس الإِحْرَام', latin: 'malaabis al-ihraam', id: 'Pakaian ihram' },
    ]),
  ...stubModule(6, 'masjidil-haram', 'Di Masjidil Haram', 'في المسجد الحرام', '🕋', '#0a4d3c',
    'Bertanya pintu masuk (Bab), Hajar Aswad, tempat sa\'i, tahalul.',
    [
      { ar: 'بَاب', latin: 'baab', id: 'Pintu' },
      { ar: 'الحَجَر الأَسْوَد', latin: 'al-hajar al-aswad', id: 'Hajar Aswad' },
      { ar: 'الكَعْبَة', latin: 'al-ka\'bah', id: 'Ka\'bah' },
      { ar: 'الطَّوَاف', latin: 'ath-thawaaf', id: 'Tawaf' },
      { ar: 'السَّعْي', latin: 'as-sa\'y', id: 'Sa\'i' },
      { ar: 'الصَّفَا', latin: 'ash-shafaa', id: 'Shafa' },
      { ar: 'المَرْوَة', latin: 'al-marwah', id: 'Marwah' },
      { ar: 'التَّحَلُّل', latin: 'at-tahalul', id: 'Tahalul' },
    ]),
  ...stubModule(7, 'masjid-nabawi-raudhah', 'Di Masjid Nabawi & Raudhah', 'في المسجد النبوي والروضة', '🕌', '#0a4d3c',
    'Antrian Raudhah, ziarah makam Rasulullah, jadwal pintu wanita.',
    [
      { ar: 'الرَّوْضَة', latin: 'ar-rawdhah', id: 'Raudhah' },
      { ar: 'القَبْر', latin: 'al-qabr', id: 'Makam' },
      { ar: 'بَاب النِّسَاء', latin: 'baab an-nisaa\'', id: 'Pintu wanita' },
      { ar: 'الصَّفّ', latin: 'ash-shaff', id: 'Antrian / shaf' },
      { ar: 'مَوْعِد', latin: 'maw\'id', id: 'Jadwal' },
    ]),
  ...stubModule(8, 'askar-mutawif', 'Bertanya ke Petugas (Askar/Mutawif)', 'السؤال إلى العسكر والمطوف', '👮‍♂️', '#8b6b3d',
    'Meminta bantuan, bertanya aturan, kehilangan rombongan.',
    [
      { ar: 'العَسْكَرِيّ', latin: 'al-\'askariyy', id: 'Askar (petugas keamanan)' },
      { ar: 'المُطَوِّف', latin: 'al-muthawwif', id: 'Mutawif (pemandu)' },
      { ar: 'مُسَاعَدَة', latin: 'musaa\'adah', id: 'Bantuan' },
      { ar: 'المَجْمُوعَة', latin: 'al-majmuu\'ah', id: 'Rombongan' },
      { ar: 'ضَائِع', latin: 'dhaa\'i\'', id: 'Tersesat' },
    ]),
  ...stubModule(9, 'restoran-makanan', 'Di Restoran & Memesan Makanan', 'في المطعم وطلب الطعام', '🍽️', '#a05536',
    'Pesan makanan Arab/Indonesia, halal, alergi, minta tagihan.',
    [
      { ar: 'المَطْعَم', latin: 'al-math\'am', id: 'Restoran' },
      { ar: 'القَائِمَة', latin: 'al-qaa\'imah', id: 'Menu' },
      { ar: 'حَلَال', latin: 'halaal', id: 'Halal' },
      { ar: 'حَسَّاسِيَّة', latin: 'hassaasiyyah', id: 'Alergi' },
      { ar: 'الفَاتُورَة', latin: 'al-faatuurah', id: 'Tagihan' },
      { ar: 'مَاء', latin: 'maa\'', id: 'Air' },
      { ar: 'شَاي', latin: 'syaay', id: 'Teh' },
      { ar: 'قَهْوَة', latin: 'qahwah', id: 'Kopi' },
    ]),
  ...stubModule(10, 'pasar-belanja', 'Belanja di Pasar & Toko Oleh-oleh', 'التسوق في السوق', '🛍️', '#c9a961',
    'Tawar-menawar kurma, sajadah, parfum, abaya di Bin Dawood/pasar.',
    [
      { ar: 'كَمْ السِّعْر', latin: 'kam as-si\'r', id: 'Berapa harganya' },
      { ar: 'غَالٍ', latin: 'ghaalin', id: 'Mahal' },
      { ar: 'رَخِيص', latin: 'rakhiish', id: 'Murah' },
      { ar: 'خَصْم', latin: 'khashm', id: 'Diskon' },
      { ar: 'التَّمْر', latin: 'at-tamr', id: 'Kurma' },
      { ar: 'سَجَّادَة الصَّلَاة', latin: 'sajjaadat ash-shalaah', id: 'Sajadah' },
      { ar: 'عِطْر', latin: '\'ithr', id: 'Parfum' },
      { ar: 'عَبَايَة', latin: '\'abaayah', id: 'Abaya' },
    ]),
  ...stubModule(11, 'apotek-kesehatan', 'Di Apotek & Kondisi Kesehatan', 'في الصيدلية والصحة', '💊', '#7a3d2a',
    'Beli obat flu, demam, masker, plester, vitamin.',
    [
      { ar: 'الصَّيْدَلِيَّة', latin: 'ash-shaydaliyyah', id: 'Apotek' },
      { ar: 'دَوَاء', latin: 'dawaa\'', id: 'Obat' },
      { ar: 'حُمَّى', latin: 'hummaa', id: 'Demam' },
      { ar: 'زُكَام', latin: 'zukaam', id: 'Flu' },
      { ar: 'صُدَاع', latin: 'shudaa\'', id: 'Sakit kepala' },
      { ar: 'كَمَّامَة', latin: 'kammaamah', id: 'Masker' },
      { ar: 'لَاصِق طِبِّيّ', latin: 'laashiq thibbiyy', id: 'Plester' },
    ]),
  ...stubModule(12, 'money-changer', 'Menukar Uang & ATM', 'صرف العملة', '💱', '#c9a961',
    'Money changer, kurs riyal, tarik tunai.',
    [
      { ar: 'صَرَّاف آلِي', latin: 'sharraaf aalii', id: 'ATM' },
      { ar: 'تَحْوِيل العُمْلَة', latin: 'tahwiil al-\'umlah', id: 'Tukar uang' },
      { ar: 'سِعْر الصَّرْف', latin: 'si\'r ash-sharf', id: 'Kurs' },
      { ar: 'الرِّيَال', latin: 'ar-riyaal', id: 'Riyal' },
      { ar: 'الرُّوبِيَّة', latin: 'ar-ruubiyyah', id: 'Rupiah' },
      { ar: 'العُمُولَة', latin: 'al-\'umuulah', id: 'Komisi/biaya' },
    ]),
  ...stubModule(13, 'tersesat-hilang', 'Tersesat atau Kehilangan Barang', 'الضياع وفقدان الأمتعة', '🆘', '#a05536',
    'Lapor ke petugas, mencari rombongan, kehilangan paspor/HP.',
    [
      { ar: 'فَقَدْتُ', latin: 'faqadtu', id: 'Saya kehilangan' },
      { ar: 'الجَوَال', latin: 'al-jawwaal', id: 'HP / handphone' },
      { ar: 'المَحْفَظَة', latin: 'al-mahfazhah', id: 'Dompet' },
      { ar: 'الشُّرْطَة', latin: 'asy-syurthah', id: 'Polisi' },
      { ar: 'بَلَاغ', latin: 'balaagh', id: 'Laporan' },
    ]),
  ...stubModule(14, 'ziarah-historis', 'Ziarah ke Tempat Bersejarah', 'زيارة المواقع التاريخية', '🏛️', '#8b6b3d',
    'Jabal Nur, Jabal Rahmah, Masjid Quba, Jabal Uhud, kebun kurma.',
    [
      { ar: 'جَبَل النُّور', latin: 'jabal an-nuur', id: 'Jabal Nur' },
      { ar: 'جَبَل الرَّحْمَة', latin: 'jabal ar-rahmah', id: 'Jabal Rahmah' },
      { ar: 'مَسْجِد قُبَاء', latin: 'masjid qubaa\'', id: 'Masjid Quba' },
      { ar: 'جَبَل أُحُد', latin: 'jabal uhud', id: 'Jabal Uhud' },
      { ar: 'مَزْرَعَة', latin: 'mazra\'ah', id: 'Kebun / ladang' },
    ]),
  ...stubModule(15, 'sosial-salam', 'Berinteraksi Sosial & Salam', 'التفاعل الاجتماعي', '🤝', '#0a4d3c',
    'Sapaan, ucapan terima kasih, doa singkat, basa-basi dengan jamaah dari negara lain.',
    [
      { ar: 'كَيْفَ حَالُك', latin: 'kayfa haaluk', id: 'Apa kabar' },
      { ar: 'الحَمْدُ لِلَّه', latin: 'al-hamdu lillaah', id: 'Alhamdulillah' },
      { ar: 'مِنْ أَيْنَ أَنْتَ', latin: 'min ayna anta', id: 'Dari mana asalmu' },
      { ar: 'تَقَبَّل اللَّه', latin: 'taqabbalallaah', id: 'Semoga Allah menerima' },
      { ar: 'إِلَى اللِّقَاء', latin: 'ilaa al-liqaa\'', id: 'Sampai jumpa' },
    ]),
];

// Helper: bikin stub modul (vocab + 2 placeholder conversations)
function stubModule(order, id, title, arabic, emoji, color, description, vocab) {
  return [{
    id,
    pathId: 'umrah',
    order,
    title,
    arabic,
    emoji,
    color,
    bgGradient: `linear-gradient(135deg, ${color}, ${lighten(color)})`,
    description,
    estimatedMinutes: 5,
    xpReward: 60,
    isStub: true, // flag: konten masih basic, akan di-expand
    vocab,
    conversations: [
      {
        id: 'c1',
        title: 'Pembuka',
        situation: 'Sapaan umum',
        dialog: [
          { speaker: 'A', ar: 'السَّلَامُ عَلَيْكُمْ', latin: 'as-salaamu \'alaykum', id: 'Assalamu alaikum' },
          { speaker: 'B', ar: 'وَعَلَيْكُمُ السَّلَامُ وَرَحْمَة اللَّه', latin: 'wa \'alaykumus-salaam wa rahmatullaah', id: 'Wa alaikum salam wa rahmatullah' },
        ],
      },
    ],
  }];
}

function lighten(hex) {
  // Simple lighten: assume hex is #rrggbb
  const r = Math.min(255, parseInt(hex.slice(1,3), 16) + 30);
  const g = Math.min(255, parseInt(hex.slice(3,5), 16) + 30);
  const b = Math.min(255, parseInt(hex.slice(5,7), 16) + 30);
  return '#' + [r,g,b].map(n => n.toString(16).padStart(2,'0')).join('');
}
