// data/learning-profesional.js
// Path PROFESIONAL & BISNIS — 20 modul untuk pekerja/profesional di dunia Arab.
// Target: 2500 kosakata. Bahasa Fusha modern + business idioms.
// Pricing: 5 modul awal FREE, 6-20 = 20 koin per modul.

export const LEARNING_PROFESIONAL = [
  {
    id: 'taaruf-kerja',
    pathId: 'profesi',
    order: 1,
    title: 'Perkenalan Diri (Kerja)',
    arabic: 'التعارف في بيئة العمل',
    emoji: '🤝',
    color: '#8b6b3d',
    bgGradient: 'linear-gradient(135deg, #8b6b3d, #a5814f)',
    description: 'Nama, jabatan, perusahaan, departemen, pengalaman.',
    estimatedMinutes: 6,
    xpReward: 65,
    vocab: [
      { ar: 'المَنْصِب', latin: 'al-manshib', id: 'Jabatan' },
      { ar: 'الشَّرِكَة', latin: 'asy-syarikah', id: 'Perusahaan' },
      { ar: 'القِسْم', latin: 'al-qism', id: 'Departemen' },
      { ar: 'الخِبْرَة', latin: 'al-khibrah', id: 'Pengalaman' },
      { ar: 'مُوَظَّف', latin: 'muwazhzhaf', id: 'Pegawai' },
      { ar: 'مُدِير', latin: 'mudiir', id: 'Manajer' },
      { ar: 'الرَّئِيس التَّنْفِيذِيّ', latin: 'ar-ra\'iis at-tanfiidziyy', id: 'CEO' },
      { ar: 'زَمِيل', latin: 'zamiil', id: 'Kolega' },
      { ar: 'سَنَوَات الخِبْرَة', latin: 'sanawaat al-khibrah', id: 'Tahun pengalaman' },
      { ar: 'الفَرْع', latin: 'al-far\'', id: 'Cabang' },
    ],
    conversations: [
      {
        id: 'c1',
        title: 'Perkenalan dengan Kolega Baru',
        situation: 'Hari pertama kerja',
        dialog: [
          { speaker: 'Anda', ar: 'السَّلَامُ عَلَيْكُمْ، أَنَا أَحْمَد، مُوَظَّف جَدِيد.', latin: 'as-salaamu \'alaykum, anaa Ahmad, muwazhzhaf jadiid.', id: 'Assalamu alaikum, saya Ahmad, karyawan baru.' },
          { speaker: 'Kolega', ar: 'وَعَلَيْكُمُ السَّلَامُ، مَرْحَبًا. مَا مَنْصِبُك؟', latin: 'wa \'alaykumus-salaam, marhaban. maa manshibuk?', id: 'Wa alaikum salam, halo. Jabatanmu apa?' },
          { speaker: 'Anda', ar: 'مُحَلِّل بَيَانَات فِي قِسْم التَّسْوِيق.', latin: 'muhallil bayaanaat fii qism at-taswiiq.', id: 'Data analyst di departemen marketing.' },
          { speaker: 'Kolega', ar: 'مُرَحَّب بِكَ فِي الفَرِيق.', latin: 'murahhab bika fii al-fariiq.', id: 'Selamat datang di tim.' },
        ],
      },
      {
        id: 'c2',
        title: 'Tanya Pengalaman Kerja',
        situation: 'Ngobrol santai',
        dialog: [
          { speaker: 'A', ar: 'كَمْ سَنَوَات خِبْرَتُك؟', latin: 'kam sanawaat khibratuk?', id: 'Berapa tahun pengalamanmu?' },
          { speaker: 'B', ar: 'خَمْس سَنَوَات فِي مَجَال التَّسْوِيق.', latin: 'khams sanawaat fii majaal at-taswiiq.', id: '5 tahun di bidang marketing.' },
          { speaker: 'A', ar: 'فِي أَيّ شَرِكَة كُنْتَ سَابِقًا؟', latin: 'fii ayy syarikah kunta saabiqan?', id: 'Sebelumnya di perusahaan apa?' },
          { speaker: 'B', ar: 'فِي شَرِكَة عَالَمِيَّة فِي دُبَيّ.', latin: 'fii syarikah \'aalamiyyah fii Dubayy.', id: 'Di perusahaan internasional di Dubai.' },
        ],
      },
      {
        id: 'c3',
        title: 'Perkenalkan Diri ke Atasan',
        situation: 'Ketemu CEO',
        dialog: [
          { speaker: 'Anda', ar: 'تَشَرَّفْتُ بِلِقَائِك يَا سَيِّدِي.', latin: 'tasyarraftu bi-liqaa\'ik yaa sayyidii.', id: 'Senang berkenalan, Pak.' },
          { speaker: 'CEO', ar: 'الشَّرَف لِي. مَتَى اِنْضَمَمْتَ إِلَيْنَا؟', latin: 'asy-syaraf lii. mataa indhamamta ilaynaa?', id: 'Kehormatan untuk saya. Kapan Anda gabung?' },
          { speaker: 'Anda', ar: 'هَذَا أُسْبُوعِي الأَوَّل.', latin: 'hadhaa usbuu\'ii al-awwal.', id: 'Minggu pertama saya.' },
          { speaker: 'CEO', ar: 'أَتَمَنَّى لَكَ التَّوْفِيق.', latin: 'atamannaa laka at-tawfiiq.', id: 'Semoga sukses.' },
        ],
      },
      {
        id: 'c4',
        title: 'Tukeran Kartu Nama',
        situation: 'Networking event',
        dialog: [
          { speaker: 'Anda', ar: 'تَفَضَّل بِطَاقَتِي.', latin: 'tafadhdhal bithaaqatii.', id: 'Silakan, kartu saya.' },
          { speaker: 'Lawan', ar: 'شُكْرًا، خُذ بِطَاقَتِي.', latin: 'syukran, khudz bithaaqatii.', id: 'Terima kasih, ini kartu saya.' },
          { speaker: 'Anda', ar: 'مَا مَجَال شَرِكَتِك؟', latin: 'maa majaal syarikatik?', id: 'Bidang perusahaanmu apa?' },
          { speaker: 'Lawan', ar: 'تِكْنُولُوجِيَا المَعْلُومَات.', latin: 'tiknuluujiyaa al-ma\'luumaat.', id: 'Teknologi informasi.' },
        ],
      },
      {
        id: 'c5',
        title: 'Tanya Departemen',
        situation: 'Cari ruang departemen',
        dialog: [
          { speaker: 'Anda', ar: 'أَيْنَ قِسْم المَوَارِد البَشَرِيَّة؟', latin: 'ayna qism al-mawaarid al-basyariyyah?', id: 'Di mana HRD?' },
          { speaker: 'Resepsionis', ar: 'الطَّابِق الثَّانِي، عَلَى اليَمِين.', latin: 'ath-thaabiq ats-tsaanii, \'alaa al-yamiin.', id: 'Lantai 2, sebelah kanan.' },
        ],
      },
      {
        id: 'c6',
        title: 'Pamit Setelah Meeting',
        situation: 'Akhir networking',
        dialog: [
          { speaker: 'Anda', ar: 'سَعِدْتُ بِلِقَائِك، نَتَوَاصَل قَرِيبًا.', latin: 'sa\'idtu bi-liqaa\'ik, natawaashal qariiban.', id: 'Senang ketemu, kita komunikasi nanti.' },
          { speaker: 'Lawan', ar: 'بِكُلّ تَأْكِيد، فِي أَمَان اللَّه.', latin: 'bi-kulli ta\'kiid, fii amaanillaah.', id: 'Pasti, sampai jumpa.' },
        ],
      },
    ],
  },
  {
    id: 'kartu-networking',
    pathId: 'profesi',
    order: 2,
    title: 'Tukar Kartu Nama & Networking',
    arabic: 'تبادل بطاقات العمل والتواصل المهني',
    emoji: '💼',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    description: 'Kontak profesional, LinkedIn, pertemuan bisnis, konferensi.',
    estimatedMinutes: 5,
    xpReward: 60,
    vocab: [
      { ar: 'بِطَاقَة العَمَل', latin: 'bithaaqat al-\'amal', id: 'Kartu nama' },
      { ar: 'التَّوَاصُل', latin: 'at-tawaashul', id: 'Komunikasi' },
      { ar: 'مُؤْتَمَر', latin: 'mu\'tamar', id: 'Konferensi' },
      { ar: 'لِينْكِد إِن', latin: 'LinkedIn', id: 'LinkedIn' },
      { ar: 'مَعْرِض', latin: 'ma\'ridh', id: 'Pameran/expo' },
      { ar: 'فُرْصَة', latin: 'furshah', id: 'Kesempatan' },
      { ar: 'شَرَاكَة', latin: 'syaraakah', id: 'Kemitraan' },
      { ar: 'البَرِيد الإِلِكْتْرُونِيّ', latin: 'al-bariid al-iliktruuniyy', id: 'Email' },
      { ar: 'مُتَابَعَة', latin: 'mutaaba\'ah', id: 'Follow-up' },
    ],
    conversations: [
      {
        id: 'c1',
        title: 'Di Konferensi',
        situation: 'Coffee break',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ هَذِهِ أَوَّل مَرَّة لَك فِي المُؤْتَمَر؟', latin: 'hal hadhihi awwal marrah lak fii al-mu\'tamar?', id: 'Pertama kali ke konferensi?' },
          { speaker: 'Peserta', ar: 'نَعَم، وَأَنْتَ؟', latin: 'na\'am, wa anta?', id: 'Iya, dan Anda?' },
          { speaker: 'Anda', ar: 'الثَّالِثَة. تَفَضَّل بِطَاقَتِي.', latin: 'ats-tsaalitsah. tafadhdhal bithaaqatii.', id: 'Ketiga kali. Ini kartu saya.' },
        ],
      },
      {
        id: 'c2',
        title: 'Tambah di LinkedIn',
        situation: 'Setelah ngobrol',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ يُمْكِنُنَا التَّوَاصُل عَبْر لِينْكِد إِن؟', latin: 'hal yumkinunaa at-tawaashul \'abra LinkedIn?', id: 'Bisa konek di LinkedIn?' },
          { speaker: 'Lawan', ar: 'بِالطَّبْع، أَرْسِل لِي طَلَب.', latin: 'bith-thab\', arsil lii thalab.', id: 'Tentu, kirim saya invite.' },
        ],
      },
      {
        id: 'c3',
        title: 'Diskusi Peluang Bisnis',
        situation: 'Coffee meeting',
        dialog: [
          { speaker: 'Anda', ar: 'أَرَى فُرْصَة شَرَاكَة بَيْن شَرِكَتَيْنَا.', latin: 'araa furshah syaraakah bayna syarikataynaa.', id: 'Saya lihat peluang partnership.' },
          { speaker: 'Lawan', ar: 'مُهِمّ، حَدِّثْنِي أَكْثَر.', latin: 'muhimm, haddditsnii aktsar.', id: 'Menarik, ceritakan lebih lanjut.' },
        ],
      },
      {
        id: 'c4',
        title: 'Janjian Follow-Up',
        situation: 'Akhir percakapan',
        dialog: [
          { speaker: 'Anda', ar: 'سَأُرْسِل لَكَ بَرِيدًا الأُسْبُوع القَادِم.', latin: 'sa-ursil laka bariidan al-usbuu\' al-qaadim.', id: 'Saya kirim email minggu depan.' },
          { speaker: 'Lawan', ar: 'مُمْتَاز، فِي اِنْتِظَار رِسَالَتِك.', latin: 'mumtaaz, fii intizhaar risaalatik.', id: 'Bagus, saya tunggu emailmu.' },
        ],
      },
      {
        id: 'c5',
        title: 'Di Pameran Industri',
        situation: 'Booth perusahaan',
        dialog: [
          { speaker: 'Anda', ar: 'مَا مُنْتَجَات شَرِكَتِكُمْ؟', latin: 'maa muntajaat syarikatikum?', id: 'Produk perusahaan Anda apa?' },
          { speaker: 'Marketing', ar: 'حُلُول بَرْمَجِيَّة لِلشَّرِكَات.', latin: 'huluul barmajiyyah lisy-syarikaat.', id: 'Solusi software untuk perusahaan.' },
          { speaker: 'Anda', ar: 'هَلْ يُمْكِن تَرْتِيب عَرْض تَوْضِيحِيّ؟', latin: 'hal yumkin tartiib \'ardh tawdhiihiyy?', id: 'Bisa atur demo?' },
        ],
      },
      {
        id: 'c6',
        title: 'Networking Casual',
        situation: 'After-event',
        dialog: [
          { speaker: 'Anda', ar: 'مَا انْطِبَاعُك عَنْ المُؤْتَمَر؟', latin: 'maa inthibaa\'uk \'an al-mu\'tamar?', id: 'Bagaimana kesanmu tentang konferensi?' },
          { speaker: 'Lawan', ar: 'مُفِيد جِدًّا، خُصُوصًا الجَلْسَة الأَخِيرَة.', latin: 'mufiid jiddan, khushuushan al-jalsah al-akhiirah.', id: 'Sangat bermanfaat, terutama sesi terakhir.' },
        ],
      },
    ],
  },
  {
    id: 'wawancara-kerja',
    pathId: 'profesi',
    order: 3,
    title: 'Wawancara Kerja',
    arabic: 'مقابلة العمل',
    emoji: '🎯',
    color: '#a05536',
    bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
    description: 'CV, kualifikasi, pengalaman, gaji, pertanyaan HRD.',
    estimatedMinutes: 7,
    xpReward: 75,
    vocab: [
      { ar: 'المُقَابَلَة', latin: 'al-muqaabalah', id: 'Wawancara' },
      { ar: 'السِّيرَة الذَّاتِيَّة', latin: 'as-siirah adz-dzaatiyyah', id: 'CV' },
      { ar: 'المُؤَهِّلَات', latin: 'al-mu\'ahhilaat', id: 'Kualifikasi' },
      { ar: 'الرَّاتِب', latin: 'ar-raatib', id: 'Gaji' },
      { ar: 'المَزَايَا', latin: 'al-mazaayaa', id: 'Tunjangan' },
      { ar: 'الإِجَازَة', latin: 'al-ijaazah', id: 'Cuti' },
      { ar: 'فَتْرَة التَّجْرِبَة', latin: 'fatrat at-tajribah', id: 'Masa probation' },
      { ar: 'المُسَمَّى الوَظِيفِيّ', latin: 'al-musammaa al-wazhiifiyy', id: 'Job title' },
      { ar: 'العَمَل عَنْ بُعْد', latin: 'al-\'amal \'an bu\'d', id: 'WFH' },
      { ar: 'نِقَاط القُوَّة', latin: 'niqaath al-quwwah', id: 'Kelebihan/strength' },
    ],
    conversations: [
      {
        id: 'c1',
        title: 'Sambutan Awal',
        situation: 'Mulai interview',
        dialog: [
          { speaker: 'HRD', ar: 'تَفَضَّل بِالجُلُوس، شُكْرًا لِحُضُورِك.', latin: 'tafadhdhal bil-juluus, syukran li-hudhuurik.', id: 'Silakan duduk, terima kasih sudah datang.' },
          { speaker: 'Anda', ar: 'العَفْو، الشُّكْر لَكُمْ عَلَى الفُرْصَة.', latin: 'al-\'afw, asy-syukr lakum \'alaa al-furshah.', id: 'Sama-sama, terima kasih atas kesempatannya.' },
        ],
      },
      {
        id: 'c2',
        title: 'Cerita tentang Diri',
        situation: 'Pertanyaan klasik',
        dialog: [
          { speaker: 'HRD', ar: 'حَدِّثْنَا عَنْ نَفْسِك.', latin: 'hadditsnaa \'an nafsik.', id: 'Ceritakan tentang diri Anda.' },
          { speaker: 'Anda', ar: 'أَنَا مُهَنْدِس بَرْمَجِيَّات، خِبْرَة 7 سَنَوَات.', latin: 'anaa muhandis barmajiyyaat, khibrah sab\' sanawaat.', id: 'Saya software engineer, pengalaman 7 tahun.' },
          { speaker: 'HRD', ar: 'فِي أَيّ مَجَال تَخَصُّصُك؟', latin: 'fii ayy majaal takhashshushuk?', id: 'Spesialisasinya bidang apa?' },
          { speaker: 'Anda', ar: 'تَطْوِير تَطْبِيقَات الهَاتِف.', latin: 'tathwiir tathbiiqaat al-haatif.', id: 'Mobile app development.' },
        ],
      },
      {
        id: 'c3',
        title: 'Tanya Kelebihan & Kekurangan',
        situation: 'Pertanyaan klasik',
        dialog: [
          { speaker: 'HRD', ar: 'مَا نِقَاط قُوَّتِك؟', latin: 'maa niqaath quwwatik?', id: 'Apa kelebihan Anda?' },
          { speaker: 'Anda', ar: 'أَنَا مُنَظَّم وَأَعْمَل تَحْت ضَغْط.', latin: 'anaa munazhzham wa a\'mal tahta dhaght.', id: 'Saya terorganisir dan tahan tekanan.' },
          { speaker: 'HRD', ar: 'وَنِقَاط الضَّعْف؟', latin: 'wa niqaath adh-dha\'f?', id: 'Kekurangannya?' },
          { speaker: 'Anda', ar: 'أَحْيَانًا أَتَقَن بِشَكْل مُبَالِغ.', latin: 'ahyaanan ataqan bi-syakl mubaaligh.', id: 'Kadang perfeksionis berlebihan.' },
        ],
      },
      {
        id: 'c4',
        title: 'Negosiasi Gaji',
        situation: 'Pertanyaan ekspektasi gaji',
        dialog: [
          { speaker: 'HRD', ar: 'مَا الرَّاتِب المُتَوَقَّع؟', latin: 'maa ar-raatib al-mutawaqqa\'?', id: 'Gaji harapan Anda?' },
          { speaker: 'Anda', ar: 'بِنَاء عَلَى خِبْرَتِي، 15 أَلْف رِيَال.', latin: 'binaa\' \'alaa khibratii, khamsah \'asyar alf riyaal.', id: 'Berdasarkan pengalaman, 15.000 riyal.' },
          { speaker: 'HRD', ar: 'هَلْ المَزَايَا تَشْمَل التَّأْمِين؟', latin: 'hal al-mazaayaa tasymal at-ta\'miin?', id: 'Tunjangan termasuk asuransi?' },
          { speaker: 'Anda', ar: 'نَعَم، وَكَذَلِكَ بَدَل السَّكَن.', latin: 'na\'am, wa kadzaalika badal as-sakan.', id: 'Iya, plus tunjangan housing.' },
        ],
      },
      {
        id: 'c5',
        title: 'Tanya tentang Perusahaan',
        situation: 'Q&A dari kandidat',
        dialog: [
          { speaker: 'Anda', ar: 'مَا ثَقَافَة شَرِكَتِكُم؟', latin: 'maa tsaqaafat syarikatikum?', id: 'Bagaimana budaya perusahaan?' },
          { speaker: 'HRD', ar: 'نَعْتَمِد العَمَل الجَمَاعِيّ وَالاِبْتِكَار.', latin: 'na\'tamid al-\'amal al-jamaa\'iyy wal-ibtikaar.', id: 'Kita fokus teamwork dan inovasi.' },
          { speaker: 'Anda', ar: 'هَلْ تَدْعَمُون التَّدْرِيب المُسْتَمِرّ؟', latin: 'hal tad\'amuun at-tadriib al-mustamirr?', id: 'Apakah ada continuous learning?' },
          { speaker: 'HRD', ar: 'نَعَم، مِيزَانِيَّة سَنَوِيَّة لِلتَّعَلُّم.', latin: 'na\'am, miizaaniyyah sanawiyyah lit-ta\'allum.', id: 'Iya, budget tahunan untuk training.' },
        ],
      },
      {
        id: 'c6',
        title: 'Tanya WFH/WFO',
        situation: 'Cek work arrangement',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ تَسْمَحُون بِالعَمَل عَنْ بُعْد؟', latin: 'hal tasmahuun bil-\'amal \'an bu\'d?', id: 'Apakah WFH diizinkan?' },
          { speaker: 'HRD', ar: 'نَعَم، يَوْمَيْن فِي الأُسْبُوع.', latin: 'na\'am, yawmayn fii al-usbuu\'.', id: 'Iya, 2 hari per minggu.' },
        ],
      },
      {
        id: 'c7',
        title: 'Penutup Wawancara',
        situation: 'End of interview',
        dialog: [
          { speaker: 'HRD', ar: 'سَنَتَوَاصَل خِلَال أُسْبُوع.', latin: 'sa-natawaashal khilaal usbuu\'.', id: 'Kami akan hubungi dalam seminggu.' },
          { speaker: 'Anda', ar: 'شُكْرًا لِوَقْتِك، فِي اِنْتِظَار رَدِّك.', latin: 'syukran li-waqtik, fii intizhaar raddik.', id: 'Terima kasih waktunya, saya tunggu kabarnya.' },
        ],
      },
    ],
  },
  {
    id: 'hari-pertama',
    pathId: 'profesi',
    order: 4,
    title: 'Hari Pertama Kerja',
    arabic: 'اليوم الأول في العمل',
    emoji: '🏢',
    color: '#7a3d2a',
    bgGradient: 'linear-gradient(135deg, #7a3d2a, #a05536)',
    description: 'Orientasi, pengenalan tim, fasilitas, peraturan, jam kerja.',
    estimatedMinutes: 6,
    xpReward: 60,
    vocab: [
      { ar: 'التَّوْجِيه', latin: 'at-tawjiih', id: 'Orientasi' },
      { ar: 'الفَرِيق', latin: 'al-fariiq', id: 'Tim' },
      { ar: 'الدَّوَام', latin: 'ad-dawaam', id: 'Jam kerja' },
      { ar: 'البَطَاقَة الذَّكِيَّة', latin: 'al-bithaaqah adz-dzakiyyah', id: 'ID card / akses' },
      { ar: 'سِيَاسَة الشَّرِكَة', latin: 'siyaasat asy-syarikah', id: 'Kebijakan perusahaan' },
      { ar: 'سُلَّم الإِدَارَة', latin: 'sullam al-idaarah', id: 'Hirarki' },
      { ar: 'الإِعْدَادَات', latin: 'al-i\'daadaat', id: 'Setup awal' },
      { ar: 'صَدِيق العَمَل', latin: 'shadiiq al-\'amal', id: 'Buddy / mentor' },
    ],
    conversations: [
      {
        id: 'c1',
        title: 'Sampai Pertama Kali',
        situation: 'Resepsionis',
        dialog: [
          { speaker: 'Anda', ar: 'صَبَاح الخَيْر، أَنَا مُوَظَّف جَدِيد، اِسْمِي أَحْمَد.', latin: 'shabaah al-khair, anaa muwazhzhaf jadiid, ismii Ahmad.', id: 'Selamat pagi, saya karyawan baru, Ahmad.' },
          { speaker: 'Resepsionis', ar: 'مَرْحَبًا، الدُّكْتُور مُحَمَّد فِي اِنْتِظَارِك.', latin: 'marhaban, ad-duktuur Muhammad fii intizhaarik.', id: 'Selamat datang, Pak Muhammad menunggu Anda.' },
        ],
      },
      {
        id: 'c2',
        title: 'Pengenalan Tim',
        situation: 'Atasan kenalin tim',
        dialog: [
          { speaker: 'Manajer', ar: 'هَذَا فَرِيقُك، تَعَرَّف عَلَيْهِم.', latin: 'hadhaa fariiquk, ta\'arraf \'alayhim.', id: 'Ini timmu, silakan kenalan.' },
          { speaker: 'Anda', ar: 'سَعِيد بِالاِنْضِمَام إِلَى الفَرِيق.', latin: 'sa\'iid bil-indhimaam ilaa al-fariiq.', id: 'Senang bergabung dengan tim.' },
          { speaker: 'Manajer', ar: 'سَارَة سَتَكُون صَدِيقَة عَمَلِك الأُسْبُوع الأَوَّل.', latin: 'Saarah sa-takuun shadiiqah \'amalik al-usbuu\' al-awwal.', id: 'Sarah akan jadi buddy minggu pertama.' },
        ],
      },
      {
        id: 'c3',
        title: 'Setup ID Card & Akses',
        situation: 'Di IT/Security',
        dialog: [
          { speaker: 'Anda', ar: 'أُرِيد البَطَاقَة الذَّكِيَّة وَكَلِمَة المُرُور.', latin: 'uriid al-bithaaqah adz-dzakiyyah wa kalimat al-muruur.', id: 'Saya butuh ID card dan password.' },
          { speaker: 'IT', ar: 'تَفَضَّل، البَطَاقَة، وَالمُرُور سَيَصِل لِبَرِيدِك.', latin: 'tafadhdhal, al-bithaaqah, wal-muruur sa-yashil li-bariidik.', id: 'Ini kartunya, password akan dikirim ke email.' },
        ],
      },
      {
        id: 'c4',
        title: 'Tanya Jam Kerja',
        situation: 'Klarifikasi schedule',
        dialog: [
          { speaker: 'Anda', ar: 'مَا مَوَاعِيد الدَّوَام؟', latin: 'maa mawaa\'iid ad-dawaam?', id: 'Jam kerja kapan?' },
          { speaker: 'HR', ar: 'مِنَ الثَّامِنَة صَبَاحًا إِلَى الرَّابِعَة عَصْرًا.', latin: 'min ats-tsaaminah shabaahan ilaa ar-raabi\'ah \'ashran.', id: 'Dari jam 8 pagi sampai jam 4 sore.' },
          { speaker: 'Anda', ar: 'وَالاِسْتِرَاحَة؟', latin: 'wal-istiraahah?', id: 'Istirahatnya?' },
          { speaker: 'HR', ar: 'سَاعَة لِلغَدَاء، وَرُبْع سَاعَة لِلصَّلَاة.', latin: 'saa\'ah lil-ghadaa\', wa rub\' saa\'ah lish-shalaah.', id: '1 jam makan siang, 15 menit shalat.' },
        ],
      },
      {
        id: 'c5',
        title: 'Tour Kantor',
        situation: 'Lihat-lihat fasilitas',
        dialog: [
          { speaker: 'Buddy', ar: 'تَعَال أُرِيك المَكَاتِب وَالمُصَلَّى.', latin: 'ta\'aal uriika al-makaatib wal-mushallaa.', id: 'Mari saya tunjukkan kantor & mushola.' },
          { speaker: 'Anda', ar: 'أَيْنَ المَطْبَخ؟', latin: 'ayna al-mathbakh?', id: 'Dapur (pantry) di mana?' },
          { speaker: 'Buddy', ar: 'فِي نِهَايَة المَمَرّ.', latin: 'fii nihaayat al-mamarr.', id: 'Di ujung koridor.' },
        ],
      },
      {
        id: 'c6',
        title: 'Tanya Sistem & Tools',
        situation: 'Pakai komputer',
        dialog: [
          { speaker: 'Anda', ar: 'كَيْفَ أَدْخُل عَلَى نِظَام الشَّرِكَة؟', latin: 'kayfa adkhul \'alaa nizhaam asy-syarikah?', id: 'Cara login ke sistem perusahaan?' },
          { speaker: 'IT', ar: 'اِسْتَخْدِم بَرِيدُك وَكَلِمَة المُرُور المُؤَقَّتَة.', latin: 'istakhdim bariiduk wa kalimat al-muruur al-mu\'aqqatah.', id: 'Pakai email dan password sementara.' },
        ],
      },
    ],
  },
  {
    id: 'komunikasi-kantor',
    pathId: 'profesi',
    order: 5,
    title: 'Komunikasi Kantor Harian',
    arabic: 'الاتصالات المكتبية اليومية',
    emoji: '💬',
    color: '#c9a961',
    bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    description: 'Sapaan pagi, tanya kabar pekerjaan, basa-basi profesional.',
    estimatedMinutes: 5,
    xpReward: 55,
    vocab: [
      { ar: 'كَيْفَ يَسِير العَمَل', latin: 'kayfa yasiir al-\'amal', id: 'Pekerjaan lancar?' },
      { ar: 'مَشْغُول', latin: 'masyghuul', id: 'Sibuk' },
      { ar: 'مُتَفَرِّغ', latin: 'mutafarrigh', id: 'Luang' },
      { ar: 'اِجْتِمَاع', latin: 'ijtimaa\'', id: 'Rapat' },
      { ar: 'مَوْعِد', latin: 'maw\'id', id: 'Janji' },
      { ar: 'الاِسْتِرَاحَة', latin: 'al-istiraahah', id: 'Istirahat' },
      { ar: 'القَهْوَة', latin: 'al-qahwah', id: 'Kopi' },
      { ar: 'الغَدَاء', latin: 'al-ghadaa\'', id: 'Makan siang' },
    ],
    conversations: [
      {
        id: 'c1',
        title: 'Sapa Pagi',
        situation: 'Masuk kantor',
        dialog: [
          { speaker: 'Anda', ar: 'صَبَاح الخَيْر يَا فَرِيق.', latin: 'shabaah al-khair yaa fariiq.', id: 'Selamat pagi tim.' },
          { speaker: 'Kolega', ar: 'صَبَاح النُّور، كَيْفَ حَالُك؟', latin: 'shabaah an-nuur, kayfa haaluk?', id: 'Selamat pagi, apa kabar?' },
          { speaker: 'Anda', ar: 'بِخَيْر، الحَمْدُ لِلَّه.', latin: 'bi-khair, al-hamdu lillaah.', id: 'Baik, alhamdulillah.' },
        ],
      },
      {
        id: 'c2',
        title: 'Tanya Pekerjaan',
        situation: 'Cek progress kolega',
        dialog: [
          { speaker: 'Anda', ar: 'كَيْفَ يَسِير المَشْرُوع الجَدِيد؟', latin: 'kayfa yasiir al-masyruu\' al-jadiid?', id: 'Project baru lancar?' },
          { speaker: 'Kolega', ar: 'بِشَكْل جَيِّد، نَنْهِي المَرْحَلَة الأُولَى.', latin: 'bi-syakl jayyid, nanhii al-marhalah al-uulaa.', id: 'Lancar, kita selesaikan tahap 1.' },
        ],
      },
      {
        id: 'c3',
        title: 'Ajak Coffee Break',
        situation: 'Pagi yang lambat',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ تُرِيد قَهْوَة؟', latin: 'hal turiid qahwah?', id: 'Mau kopi?' },
          { speaker: 'Kolega', ar: 'بِكُلّ تَأْكِيد، شُكْرًا.', latin: 'bi-kulli ta\'kiid, syukran.', id: 'Pasti, terima kasih.' },
        ],
      },
      {
        id: 'c4',
        title: 'Cek Apakah Sibuk',
        situation: 'Mau diskusi cepat',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ أَنْتَ مُتَفَرِّغ لِخَمْس دَقَائِق؟', latin: 'hal anta mutafarrigh li-khams daqaa\'iq?', id: 'Luang 5 menit?' },
          { speaker: 'Kolega', ar: 'الآن مَشْغُول قَلِيلًا، بَعْد سَاعَة؟', latin: 'al-aan masyghuul qaliilan, ba\'da saa\'ah?', id: 'Sekarang agak sibuk, 1 jam lagi?' },
          { speaker: 'Anda', ar: 'لَا مُشْكِلَة.', latin: 'laa musykilah.', id: 'Tidak masalah.' },
        ],
      },
      {
        id: 'c5',
        title: 'Ajak Makan Siang',
        situation: 'Mendekati jam makan',
        dialog: [
          { speaker: 'Anda', ar: 'مَا رَأْيُك بِالغَدَاء مَعًا؟', latin: 'maa ra\'yuk bil-ghadaa\' ma\'an?', id: 'Makan siang bareng?' },
          { speaker: 'Kolega', ar: 'فِكْرَة جَيِّدَة، أَيْن؟', latin: 'fikrah jayyidah, ayn?', id: 'Ide bagus, di mana?' },
          { speaker: 'Anda', ar: 'فِي المَطْعَم اللُّبْنَانِيّ القَرِيب.', latin: 'fii al-math\'am al-lubnaaniyy al-qariib.', id: 'Restoran Lebanon yang dekat.' },
        ],
      },
      {
        id: 'c6',
        title: 'Pamit Pulang',
        situation: 'Akhir hari',
        dialog: [
          { speaker: 'Anda', ar: 'أَنْصَرِف، إِلَى الغَد.', latin: 'anshariff, ilaa al-ghad.', id: 'Saya pulang, sampai besok.' },
          { speaker: 'Kolega', ar: 'فِي أَمَان اللَّه، اِسْتَرِح.', latin: 'fii amaanillaah, istarih.', id: 'Sampai jumpa, istirahat ya.' },
        ],
      },
    ],
  },
];

// Modul #6-#20 — FULL FLESHED dengan 6 percakapan masing-masing.
LEARNING_PROFESIONAL.push(
  {
    id: 'telepon-bisnis', pathId: 'profesi', order: 6,
    title: 'Menerima & Melakukan Telepon Bisnis',
    arabic: 'الرد على المكالمات الهاتفية',
    emoji: '📞', color: '#a05536', bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
    description: 'Sapaan telepon formal, sambungkan, tinggalkan pesan, telepon balik.',
    estimatedMinutes: 5, xpReward: 60,
    vocab: [
      { ar: 'الهَاتِف', latin: 'al-haatif', id: 'Telepon' },
      { ar: 'تَحْوِيل المُكَالَمَة', latin: 'tahwiil al-mukaalamah', id: 'Transfer panggilan' },
      { ar: 'تَرْك رِسَالَة', latin: 'tark risaalah', id: 'Tinggalkan pesan' },
      { ar: 'مَنْ يَتَكَلَّم', latin: 'man yatakallam', id: 'Siapa yang berbicara' },
      { ar: 'لَحْظَة مِنْ فَضْلِك', latin: 'lahzhah min fadhlik', id: 'Sebentar tolong' },
      { ar: 'مَشْغُول', latin: 'masyghuul', id: 'Sibuk' },
      { ar: 'سَأُعَاوِد الاِتِّصَال', latin: 'sa-u\'aawid al-ittishaal', id: 'Saya telepon balik' },
      { ar: 'حَوِّلْنِي مِنْ فَضْلِك', latin: 'hawwilnii min fadhlik', id: 'Sambungkan tolong' },
      { ar: 'المَوْضُوع', latin: 'al-mawdhuu\'', id: 'Topik / keperluan' },
    ],
    conversations: [
      {
        id: 'c1', title: 'Terima Telepon Resmi', situation: 'Telepon masuk',
        dialog: [
          { speaker: 'Anda', ar: 'شَرِكَة النُّور، صَبَاح الخَيْر، مَعَك أَحْمَد.', latin: 'syarikah an-nuur, shabaah al-khair, ma\'ak Ahmad.', id: 'Perusahaan Al-Nur, selamat pagi, dengan Ahmad.' },
          { speaker: 'Penelpon', ar: 'صَبَاح النُّور، أُرِيد التَّحَدُّث مَع المُدِير.', latin: 'shabaah an-nuur, uriid at-tahaddudz ma\'a al-mudiir.', id: 'Selamat pagi, saya mau bicara dengan manajer.' },
          { speaker: 'Anda', ar: 'لَحْظَة مِنْ فَضْلِك، سَأُحَوِّلُك.', latin: 'lahzhah min fadhlik, sa-uhawwiluk.', id: 'Sebentar tolong, saya sambungkan.' },
        ],
      },
      {
        id: 'c2', title: 'Atasan Sedang Sibuk', situation: 'Manajer dalam meeting',
        dialog: [
          { speaker: 'Penelpon', ar: 'هَلْ المُدِير مَوْجُود؟', latin: 'hal al-mudiir mawjuud?', id: 'Apakah manajer ada?' },
          { speaker: 'Anda', ar: 'هُوَ مَشْغُول فِي اِجْتِمَاع، هَلْ تُرِيد تَرْك رِسَالَة؟', latin: 'huwa masyghuul fii ijtimaa\', hal turiid tark risaalah?', id: 'Beliau sedang rapat, mau tinggalkan pesan?' },
          { speaker: 'Penelpon', ar: 'نَعَم، أَخْبِرُهُ أَنَّ خَالِد اِتَّصَل.', latin: 'na\'am, akhbiruhu anna Khaalid ittashal.', id: 'Iya, kabari beliau Khalid telepon.' },
          { speaker: 'Anda', ar: 'حَسَنًا، سَأَنْقُل الرِّسَالَة.', latin: 'hasanan, sa-anqul ar-risaalah.', id: 'Baik, akan saya sampaikan.' },
        ],
      },
      {
        id: 'c3', title: 'Melakukan Panggilan', situation: 'Telepon klien',
        dialog: [
          { speaker: 'Anda', ar: 'السَّلَامُ عَلَيْكُمْ، أَنَا أَحْمَد مِنْ شَرِكَة النُّور.', latin: 'as-salaamu \'alaykum, anaa Ahmad min syarikah an-nuur.', id: 'Assalamu alaikum, saya Ahmad dari Perusahaan Al-Nur.' },
          { speaker: 'Klien', ar: 'وَعَلَيْكُمُ السَّلَامُ، تَفَضَّل.', latin: 'wa \'alaykumus-salaam, tafadhdhal.', id: 'Wa alaikum salam, silakan.' },
          { speaker: 'Anda', ar: 'هَلْ لَدَيْك وَقْت لِمُنَاقَشَة العَرْض؟', latin: 'hal ladayk waqt li-munaaqasyat al-\'ardh?', id: 'Punya waktu bahas penawaran?' },
          { speaker: 'Klien', ar: 'نَعَم، تَفَضَّل.', latin: 'na\'am, tafadhdhal.', id: 'Iya, silakan.' },
        ],
      },
      {
        id: 'c4', title: 'Terima Pesan Voicemail', situation: 'Klien gak terima telpon',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ يُمْكِنِنِي تَرْك رِسَالَة صَوْتِيَّة؟', latin: 'hal yumkininii tark risaalah shawtiyyah?', id: 'Boleh saya tinggalkan voicemail?' },
          { speaker: 'Penjawab', ar: 'بِالطَّبْع، اِبْدَأ بَعْد الصَّفِير.', latin: 'bith-thab\', ibda\' ba\'da ash-shafiir.', id: 'Tentu, mulai setelah bunyi bip.' },
          { speaker: 'Anda', ar: 'مَرْحَبًا، أَنَا أَحْمَد، رِجَاء اِتِّصِل بِي عَلَى 050.', latin: 'marhaban, anaa Ahmad, rajaa\' ittashil bii \'alaa khamsiin.', id: 'Halo, saya Ahmad, tolong telepon balik ke 050.' },
        ],
      },
      {
        id: 'c5', title: 'Konfirmasi Janji Bertemu', situation: 'Atur appointment via telpon',
        dialog: [
          { speaker: 'Anda', ar: 'أُرِيد تَأْكِيد المَوْعِد الأَرْبِعَاء.', latin: 'uriid ta\'kiid al-maw\'id al-arbi\'aa\'.', id: 'Saya mau konfirmasi janji hari Rabu.' },
          { speaker: 'Sekretaris', ar: 'فِي السَّاعَة العَاشِرَة، صَحِيح؟', latin: 'fii as-saa\'ah al-\'aasyirah, shahiih?', id: 'Jam 10, betul?' },
          { speaker: 'Anda', ar: 'نَعَم، فِي مَكْتَب الإِدَارَة.', latin: 'na\'am, fii maktab al-idaarah.', id: 'Iya, di kantor manajemen.' },
          { speaker: 'Sekretaris', ar: 'مُؤَكَّد، فِي اِنْتِظَارِك.', latin: 'mu\'akkad, fii intizhaarik.', id: 'Dikonfirmasi, kami tunggu.' },
        ],
      },
      {
        id: 'c6', title: 'Telepon Salah Sambung', situation: 'Salah nomor',
        dialog: [
          { speaker: 'Penelpon', ar: 'هَل هَذَا قِسْم المَبِيعَات؟', latin: 'hal hadhaa qism al-mabii\'aat?', id: 'Apakah ini bagian penjualan?' },
          { speaker: 'Anda', ar: 'لَا، هَذَا قِسْم التَّسْوِيق. سَأُحَوِّلُك.', latin: 'laa, hadhaa qism at-taswiiq. sa-uhawwiluk.', id: 'Bukan, ini bagian marketing. Saya sambungkan.' },
          { speaker: 'Penelpon', ar: 'شُكْرًا لَك.', latin: 'syukran lak.', id: 'Terima kasih.' },
        ],
      },
    ],
  },
  {
    id: 'rapat-meeting', pathId: 'profesi', order: 7,
    title: 'Mengadakan Rapat', arabic: 'عقد الاجتماعات',
    emoji: '🗓️', color: '#0a4d3c', bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    description: 'Agenda, pembukaan rapat, notulen, penutupan, tindak lanjut.',
    estimatedMinutes: 6, xpReward: 65,
    vocab: [
      { ar: 'الاِجْتِمَاع', latin: 'al-ijtimaa\'', id: 'Rapat' },
      { ar: 'جَدْوَل الأَعْمَال', latin: 'jadwal al-a\'maal', id: 'Agenda' },
      { ar: 'مَحْضَر', latin: 'mahdhar', id: 'Notulen' },
      { ar: 'تَوْصِيَات', latin: 'tawshiyaat', id: 'Rekomendasi' },
      { ar: 'مُتَابَعَة', latin: 'mutaaba\'ah', id: 'Follow-up' },
      { ar: 'حُضُور', latin: 'hudhuur', id: 'Hadirin' },
      { ar: 'مَوْعِد القَادِم', latin: 'maw\'id al-qaadim', id: 'Pertemuan berikutnya' },
      { ar: 'بَنْد', latin: 'band', id: 'Item agenda' },
      { ar: 'نُقْطَة', latin: 'nuqthah', id: 'Poin' },
      { ar: 'تَأْجِيل', latin: 'ta\'jiil', id: 'Penundaan' },
    ],
    conversations: [
      {
        id: 'c1', title: 'Pembukaan Rapat', situation: 'Awal meeting',
        dialog: [
          { speaker: 'Ketua', ar: 'بِسْم اللَّه، نَبْدَأ الاِجْتِمَاع.', latin: 'bismillah, nabda\' al-ijtimaa\'.', id: 'Dengan nama Allah, kita mulai rapat.' },
          { speaker: 'Ketua', ar: 'لَدَيْنَا خَمْسَة بُنُود فِي جَدْوَل الأَعْمَال.', latin: 'ladaynaa khamsah bunuud fii jadwal al-a\'maal.', id: 'Kita punya 5 item dalam agenda.' },
          { speaker: 'Peserta', ar: 'هَلْ نَبْدَأ بِالنُّقْطَة الأُولَى؟', latin: 'hal nabda\' bin-nuqthah al-uulaa?', id: 'Mulai dari poin pertama?' },
          { speaker: 'Ketua', ar: 'تَمَام، تَفَضَّل أَحْمَد.', latin: 'tamaam, tafadhdhal Ahmad.', id: 'Baik, silakan Ahmad.' },
        ],
      },
      {
        id: 'c2', title: 'Bahas Update Project', situation: 'Item agenda 1',
        dialog: [
          { speaker: 'Anda', ar: 'مَشْرُوع التَّسْوِيق وَصَل إِلَى المَرْحَلَة 60%.', latin: 'masyruu\' at-taswiiq washal ilaa al-marhalah sittiin bil-mi\'ah.', id: 'Project marketing sudah di 60%.' },
          { speaker: 'Ketua', ar: 'مَا التَّحَدِّيَات الحَالِيَّة؟', latin: 'maa at-tahaddiyaat al-haaliyyah?', id: 'Apa tantangan saat ini?' },
          { speaker: 'Anda', ar: 'نَنْقُص فَرِيق التَّصْمِيم.', latin: 'nanqush fariiq at-tashmiim.', id: 'Kekurangan tim desain.' },
          { speaker: 'Ketua', ar: 'سَنُنَاقِش التَّوْظِيف لَاحِقًا.', latin: 'sa-nunaaqisy at-tawzhiif laahiqan.', id: 'Kita bahas rekrutmen nanti.' },
        ],
      },
      {
        id: 'c3', title: 'Bersuara Mendukung', situation: 'Setuju usulan',
        dialog: [
          { speaker: 'Peserta A', ar: 'أَقْتَرِح زِيَادَة المِيزَانِيَّة.', latin: 'aqtarih ziyaadat al-miizaaniyyah.', id: 'Saya usul tambah anggaran.' },
          { speaker: 'Anda', ar: 'أَنَا أَتَّفِق، الحَاجَة مُلِحَّة.', latin: 'anaa attafiq, al-haajah mulihhah.', id: 'Saya setuju, kebutuhan urgent.' },
          { speaker: 'Peserta B', ar: 'وَأَنَا أَيْضًا أُؤَيِّد.', latin: 'wa anaa aydhan u\'ayyid.', id: 'Saya juga mendukung.' },
        ],
      },
      {
        id: 'c4', title: 'Voting Keputusan', situation: 'Pemungutan suara',
        dialog: [
          { speaker: 'Ketua', ar: 'لِنُصَوِّت، مَنْ يُؤَيِّد الاِقْتِرَاح؟', latin: 'li-nushawwit, man yu\'ayyid al-iqtiraah?', id: 'Mari voting, siapa setuju?' },
          { speaker: 'Peserta', ar: 'أَنَا مَع.', latin: 'anaa ma\'.', id: 'Saya setuju.' },
          { speaker: 'Ketua', ar: 'الأَكْثَرِيَّة وَافَقَت، تَمَّت المُوَافَقَة.', latin: 'al-aktsariyyah waafaqat, tammat al-muwaafaqah.', id: 'Mayoritas setuju, disetujui.' },
        ],
      },
      {
        id: 'c5', title: 'Tindak Lanjut & Tugas', situation: 'Action items',
        dialog: [
          { speaker: 'Ketua', ar: 'مَنْ سَيَتَوَلَّى مُتَابَعَة المَشْرُوع؟', latin: 'man sa-yatawallaa mutaaba\'at al-masyruu\'?', id: 'Siapa yang follow-up project?' },
          { speaker: 'Anda', ar: 'أَنَا، سَأَرْفَع تَقْرِيرًا الأُسْبُوع القَادِم.', latin: 'anaa, sa-arfa\' taqriiran al-usbuu\' al-qaadim.', id: 'Saya, akan kirim laporan minggu depan.' },
          { speaker: 'Ketua', ar: 'مُمْتَاز، شُكْرًا.', latin: 'mumtaaz, syukran.', id: 'Bagus, terima kasih.' },
        ],
      },
      {
        id: 'c6', title: 'Penutupan Rapat', situation: 'Akhir meeting',
        dialog: [
          { speaker: 'Ketua', ar: 'هَلْ هُنَاك أَيّ نِقَاش آخَر؟', latin: 'hal hunaaka ayy niqaasy aakhar?', id: 'Ada diskusi lain?' },
          { speaker: 'Peserta', ar: 'لَا، شُكْرًا.', latin: 'laa, syukran.', id: 'Tidak, terima kasih.' },
          { speaker: 'Ketua', ar: 'إِذًا، نَخْتِم الاِجْتِمَاع. مَوْعِد القَادِم الأُسْبُوع القَادِم.', latin: 'idzan, nakhtim al-ijtimaa\'. maw\'id al-qaadim al-usbuu\' al-qaadim.', id: 'Maka, kita tutup. Pertemuan berikutnya minggu depan.' },
        ],
      },
    ],
  },
  {
    id: 'diskusi-pendapat', pathId: 'profesi', order: 8,
    title: 'Diskusi & Menyampaikan Pendapat', arabic: 'النقاش وإبداء الرأي',
    emoji: '💭', color: '#7a3d2a', bgGradient: 'linear-gradient(135deg, #7a3d2a, #a05536)',
    description: 'Setuju, tidak setuju, saran, kritik konstruktif, ambil keputusan.',
    estimatedMinutes: 5, xpReward: 60,
    vocab: [
      { ar: 'أَتَّفِق', latin: 'attafiq', id: 'Setuju' },
      { ar: 'لَا أَتَّفِق', latin: 'laa attafiq', id: 'Tidak setuju' },
      { ar: 'اِقْتِرَاح', latin: 'iqtiraah', id: 'Saran' },
      { ar: 'انْتِقَاد بَنَّاء', latin: 'intiqaad bannaa\'', id: 'Kritik konstruktif' },
      { ar: 'قَرَار', latin: 'qaraar', id: 'Keputusan' },
      { ar: 'تَصْوِيت', latin: 'tashwiit', id: 'Voting' },
      { ar: 'مِنْ وُجْهَة نَظَرِي', latin: 'min wujhat nazharii', id: 'Dari sudut pandang saya' },
      { ar: 'بِكُلّ احْتِرَام', latin: 'bi-kulli ihtiraam', id: 'Dengan segala hormat' },
    ],
    conversations: [
      {
        id: 'c1', title: 'Sampaikan Pendapat', situation: 'Diskusi tim',
        dialog: [
          { speaker: 'Anda', ar: 'مِنْ وُجْهَة نَظَرِي، يَجِب تَأْخِير الإِطْلَاق.', latin: 'min wujhat nazharii, yajib ta\'khiir al-ithlaaq.', id: 'Menurut saya, peluncuran harus ditunda.' },
          { speaker: 'Kolega', ar: 'لِمَاذَا؟', latin: 'limaadzaa?', id: 'Kenapa?' },
          { speaker: 'Anda', ar: 'لِأَنَّ المُنْتَج لَمْ يَكْتَمِل بَعْد.', latin: 'li-anna al-muntaj lam yaktamil ba\'d.', id: 'Karena produk belum sempurna.' },
        ],
      },
      {
        id: 'c2', title: 'Setuju dengan Argumen', situation: 'Mendukung kolega',
        dialog: [
          { speaker: 'Kolega', ar: 'يَجِب التَّرْكِيز عَلَى الجَوْدَة.', latin: 'yajib at-tarkiiz \'alaa al-jawdah.', id: 'Harus fokus ke kualitas.' },
          { speaker: 'Anda', ar: 'أَتَّفِق تَمَامًا، الجَوْدَة أَوْلَى.', latin: 'attafiq tamaaman, al-jawdah awlaa.', id: 'Setuju total, kualitas yang utama.' },
        ],
      },
      {
        id: 'c3', title: 'Tidak Setuju dengan Sopan', situation: 'Beda pendapat',
        dialog: [
          { speaker: 'Kolega', ar: 'يَجِب تَخْفِيض السِّعْر.', latin: 'yajib takhfiidh as-si\'r.', id: 'Harus turunkan harga.' },
          { speaker: 'Anda', ar: 'بِكُلّ احْتِرَام، لَا أَتَّفِق مَع هَذَا.', latin: 'bi-kulli ihtiraam, laa attafiq ma\'a hadhaa.', id: 'Dengan hormat, saya tidak setuju.' },
          { speaker: 'Anda', ar: 'تَخْفِيض السِّعْر سَيُؤَثِّر عَلَى الجَوْدَة.', latin: 'takhfiidh as-si\'r sa-yu\'atstsir \'alaa al-jawdah.', id: 'Turunin harga akan pengaruhi kualitas.' },
        ],
      },
      {
        id: 'c4', title: 'Memberi Saran', situation: 'Ajukan ide',
        dialog: [
          { speaker: 'Anda', ar: 'لَدَيَّ اِقْتِرَاح، مَا رَأْيُكُمْ؟', latin: 'ladayya iqtiraah, maa ra\'yukum?', id: 'Saya punya usulan, bagaimana?' },
          { speaker: 'Kolega', ar: 'تَفَضَّل.', latin: 'tafadhdhal.', id: 'Silakan.' },
          { speaker: 'Anda', ar: 'لِمَاذَا لَا نُجَرِّب حَمْلَة تَسْوِيق رَقْمِيَّة؟', latin: 'limaadzaa laa nujarrib hamlat taswiiq raqmiyyah?', id: 'Kenapa gak coba kampanye digital marketing?' },
          { speaker: 'Kolega', ar: 'فِكْرَة جَيِّدَة، لِنُنَاقِشْهَا.', latin: 'fikrah jayyidah, li-nunaaqisyhaa.', id: 'Ide bagus, mari bahas.' },
        ],
      },
      {
        id: 'c5', title: 'Kritik Konstruktif', situation: 'Feedback proyek',
        dialog: [
          { speaker: 'Anda', ar: 'العَرْض جَيِّد، لَكِنَّ هُنَاكَ نُقَاط لِلتَّحْسِين.', latin: 'al-\'ardh jayyid, laakinna hunaaka nuqaath lit-tahsiin.', id: 'Presentasi bagus, tapi ada poin yang perlu diperbaiki.' },
          { speaker: 'Kolega', ar: 'مَا هِيَ؟', latin: 'maa hiya?', id: 'Apa saja?' },
          { speaker: 'Anda', ar: 'الشَّرَائِح كَثِيرَة، يَجِب تَقْلِيلُهَا.', latin: 'asy-syaraa\'ih katsiirah, yajib taqliiluhaa.', id: 'Slide-nya banyak, perlu dikurangi.' },
          { speaker: 'Kolega', ar: 'شُكْرًا، سَأُعَدِّل.', latin: 'syukran, sa-u\'addil.', id: 'Terima kasih, akan saya revisi.' },
        ],
      },
      {
        id: 'c6', title: 'Mencapai Konsensus', situation: 'Voting akhir',
        dialog: [
          { speaker: 'Ketua', ar: 'هَلْ نَصِل إِلَى اتِّفَاق؟', latin: 'hal nashil ilaa ittifaaq?', id: 'Sudah sampai kesepakatan?' },
          { speaker: 'Anda', ar: 'نَعَم، نَخْتَار الخِيَار الثَّانِي.', latin: 'na\'am, nakhtaar al-khiyaar ats-tsaanii.', id: 'Iya, kita pilih opsi kedua.' },
          { speaker: 'Ketua', ar: 'تَمَّ، نَنْتَقِل لِلتَّنْفِيذ.', latin: 'tamma, nantaqil lit-tanfiidz.', id: 'Selesai, kita lanjut ke eksekusi.' },
        ],
      },
    ],
  },
  {
    id: 'presentasi', pathId: 'profesi', order: 9,
    title: 'Presentasi Bisnis', arabic: 'العروض التقديمية',
    emoji: '📊', color: '#c9a961', bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    description: 'Pembukaan, jelasin data/grafik, kesimpulan, sesi tanya jawab.',
    estimatedMinutes: 6, xpReward: 65,
    vocab: [
      { ar: 'العَرْض التَّقْدِيمِيّ', latin: 'al-\'ardh at-taqdiimiyy', id: 'Presentasi' },
      { ar: 'الشَّرَائِح', latin: 'asy-syaraa\'ih', id: 'Slides' },
      { ar: 'البَيَانَات', latin: 'al-bayaanaat', id: 'Data' },
      { ar: 'الرَّسْم البَيَانِيّ', latin: 'ar-rasm al-bayaaniyy', id: 'Grafik' },
      { ar: 'الخُلَاصَة', latin: 'al-khulaashah', id: 'Kesimpulan' },
      { ar: 'أَسْئِلَة', latin: 'as\'ilah', id: 'Pertanyaan' },
      { ar: 'النِّسْبَة المِئَوِيَّة', latin: 'an-nisbah al-mi\'awiyyah', id: 'Persentase' },
      { ar: 'النُّمُوّ', latin: 'an-numuww', id: 'Pertumbuhan' },
      { ar: 'الزِّيَادَة', latin: 'az-ziyaadah', id: 'Kenaikan' },
      { ar: 'الاِنْخِفَاض', latin: 'al-inkhifaadh', id: 'Penurunan' },
    ],
    conversations: [
      {
        id: 'c1', title: 'Membuka Presentasi', situation: 'Awal pitch',
        dialog: [
          { speaker: 'Anda', ar: 'صَبَاح الخَيْر، شُكْرًا لِحُضُورِكُمْ.', latin: 'shabaah al-khair, syukran li-hudhuurikum.', id: 'Selamat pagi, terima kasih sudah hadir.' },
          { speaker: 'Anda', ar: 'سَأَتَحَدَّث اليَوْم عَنْ نَتَائِج الرُّبْع الثَّالِث.', latin: 'sa-atahaddats al-yawm \'an nataa\'ij ar-rub\' ats-tsaalits.', id: 'Hari ini saya bahas hasil kuartal ketiga.' },
          { speaker: 'Anda', ar: 'العَرْض سَيَأْخُذ 20 دَقِيقَة.', latin: 'al-\'ardh sa-ya\'khudz \'isyriin daqiiqah.', id: 'Presentasi 20 menit.' },
        ],
      },
      {
        id: 'c2', title: 'Jelaskan Data', situation: 'Show angka penjualan',
        dialog: [
          { speaker: 'Anda', ar: 'هَذِهِ الشَّرِيحَة تُظْهِر المَبِيعَات.', latin: 'hadhihi asy-syariihah tuzhir al-mabii\'aat.', id: 'Slide ini menampilkan penjualan.' },
          { speaker: 'Anda', ar: 'كَمَا تَرَوْنَ، النُّمُوّ 25% مُقَارَنَة بِالعَام المَاضِي.', latin: 'kamaa tarawn, an-numuww khamsah wa \'isyriin bil-mi\'ah muqaaranatan bil-\'aam al-maadhii.', id: 'Seperti terlihat, growth 25% dibanding tahun lalu.' },
        ],
      },
      {
        id: 'c3', title: 'Jelaskan Grafik', situation: 'Bar chart',
        dialog: [
          { speaker: 'Anda', ar: 'هَذَا الرَّسْم البَيَانِيّ يُمَثِّل الأَدَاء الشَّهْرِيّ.', latin: 'hadhaa ar-rasm al-bayaaniyy yumaththil al-adaa\' asy-syahriyy.', id: 'Grafik ini wakil performance bulanan.' },
          { speaker: 'Anda', ar: 'الذُّرْوَة كَانَت فِي شَهْر مَايُو.', latin: 'adz-dzurwah kaanat fii syahr maayuu.', id: 'Puncaknya di bulan Mei.' },
          { speaker: 'Peserta', ar: 'مَا سَبَب الاِنْخِفَاض فِي يُولْيُو؟', latin: 'maa sabab al-inkhifaadh fii yuulyuu?', id: 'Penyebab turun di Juli apa?' },
        ],
      },
      {
        id: 'c4', title: 'Menjawab Pertanyaan Audience', situation: 'Q&A session',
        dialog: [
          { speaker: 'Anda', ar: 'سُؤَال مُمْتَاز، سَبَب الاِنْخِفَاض هُوَ المَوْسِم.', latin: 'su\'aal mumtaaz, sabab al-inkhifaadh huwa al-mawsim.', id: 'Pertanyaan bagus, penyebab turunnya musim.' },
          { speaker: 'Peserta', ar: 'كَيْفَ سَتَتَعَامَلُون مَع هَذَا؟', latin: 'kayfa sa-tata\'aamaluun ma\'a hadhaa?', id: 'Bagaimana akan ditangani?' },
          { speaker: 'Anda', ar: 'بِحَمْلَة تَسْوِيق مَوْسِمِيَّة.', latin: 'bi-hamlah taswiiq mawsimiyyah.', id: 'Dengan kampanye marketing seasonal.' },
        ],
      },
      {
        id: 'c5', title: 'Kesimpulan & Rekomendasi', situation: 'Penutup pitch',
        dialog: [
          { speaker: 'Anda', ar: 'إِذًا، الخُلَاصَة، نُمُوّ قَوِيّ مَع تَحَدِّيَات مَوْسِمِيَّة.', latin: 'idzan, al-khulaashah, numuww qawiyy ma\'a tahaddiyaat mawsimiyyah.', id: 'Jadi, kesimpulannya growth kuat dengan tantangan musiman.' },
          { speaker: 'Anda', ar: 'أَوْصِي بِزِيَادَة المِيزَانِيَّة لِلتَّسْوِيق.', latin: 'uushii bi-ziyaadat al-miizaaniyyah lit-taswiiq.', id: 'Saya rekomendasikan tambah budget marketing.' },
        ],
      },
      {
        id: 'c6', title: 'Penutup & Terima Kasih', situation: 'End of presentation',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ مِنْ أَسْئِلَة أُخْرَى؟', latin: 'hal min as\'ilah ukhraa?', id: 'Ada pertanyaan lain?' },
          { speaker: 'Peserta', ar: 'لَا، شُكْرًا، عَرْض جَيِّد.', latin: 'laa, syukran, \'ardh jayyid.', id: 'Tidak, terima kasih, presentasi bagus.' },
          { speaker: 'Anda', ar: 'شُكْرًا لَكُمْ عَلَى الإِصْغَاء.', latin: 'syukran lakum \'alaa al-ishghaa\'.', id: 'Terima kasih sudah mendengarkan.' },
        ],
      },
    ],
  },
  {
    id: 'email-bisnis', pathId: 'profesi', order: 10,
    title: 'Korespondensi Resmi & Email', arabic: 'المراسلات الرسمية والإيميل',
    emoji: '📧', color: '#8b6b3d', bgGradient: 'linear-gradient(135deg, #8b6b3d, #a5814f)',
    description: 'Surat resmi, pembuka, isi, penutup, lampiran, follow-up email.',
    estimatedMinutes: 5, xpReward: 60,
    vocab: [
      { ar: 'الخِطَاب الرَّسْمِيّ', latin: 'al-khithaab ar-rasmiyy', id: 'Surat resmi' },
      { ar: 'المُرْفَقَات', latin: 'al-murfaqaat', id: 'Lampiran' },
      { ar: 'تَحِيَّة طَيِّبَة', latin: 'tahiyyah thayyibah', id: 'Salam hangat' },
      { ar: 'خَاتِمَة', latin: 'khaatimah', id: 'Penutup' },
      { ar: 'بَرِيد إِلِكْتْرُونِيّ', latin: 'bariid iliktruuniyy', id: 'Email' },
      { ar: 'الجَوَاب', latin: 'al-jawaab', id: 'Balasan' },
      { ar: 'مَوْضُوع', latin: 'mawdhuu\'', id: 'Subjek' },
      { ar: 'لِلِاطِّلَاع', latin: 'lil-ittilaa\'', id: 'Untuk diketahui (FYI)' },
      { ar: 'عَاجِل', latin: '\'aajil', id: 'Urgent' },
    ],
    conversations: [
      {
        id: 'c1', title: 'Pertanyaan Format Email', situation: 'Belum yakin format',
        dialog: [
          { speaker: 'Anda', ar: 'كَيْفَ أَبْدَأ خِطَاب رَسْمِيّ؟', latin: 'kayfa abda\' khithaab rasmiyy?', id: 'Bagaimana awal surat resmi?' },
          { speaker: 'Senior', ar: 'بِـ "السَّيِّد المُحْتَرَم" أَوْ "السَّيِّدَة المُحْتَرَمَة".', latin: 'bi-"as-sayyid al-muhtaram" aw "as-sayyidah al-muhtaramah".', id: 'Dengan "Bapak/Ibu yang terhormat".' },
          { speaker: 'Anda', ar: 'وَالخَاتِمَة؟', latin: 'wal-khaatimah?', id: 'Penutupnya?' },
          { speaker: 'Senior', ar: '"وَتَفَضَّلُوا بِقَبُول فَائِق الاِحْتِرَام".', latin: '"wa tafadhdhaluu bi-qabuul faa\'iq al-ihtiraam".', id: '"Hormat saya".' },
        ],
      },
      {
        id: 'c2', title: 'Kirim Lampiran', situation: 'Email dengan attachment',
        dialog: [
          { speaker: 'Anda', ar: 'سَأُرْسِل لَكَ المُسْتَنَدَات بِالبَرِيد.', latin: 'sa-ursil laka al-mustanadaat bil-bariid.', id: 'Saya kirim dokumen via email.' },
          { speaker: 'Kolega', ar: 'هَلْ كُلّ المُرْفَقَات مَضْغُوطَة؟', latin: 'hal kullu al-murfaqaat madhghuuthah?', id: 'Semua lampiran di-zip?' },
          { speaker: 'Anda', ar: 'نَعَم، فِي مِلَفّ وَاحِد.', latin: 'na\'am, fii milaff waahid.', id: 'Iya, satu file.' },
        ],
      },
      {
        id: 'c3', title: 'Tanya Apakah Email Sudah Sampai', situation: 'Konfirmasi',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ وَصَلَك بَرِيدِي بِخُصُوص العَرْض؟', latin: 'hal washalak bariidii bi-khushuush al-\'ardh?', id: 'Sudah terima email tentang penawaran?' },
          { speaker: 'Klien', ar: 'لَا، دَعْنِي أَتَحَقَّق.', latin: 'laa, da\'nii atahaqqaq.', id: 'Belum, biar saya cek.' },
          { speaker: 'Klien', ar: 'وَجَدْتُه فِي البَرِيد المُزْعِج.', latin: 'wajadtuh fii al-bariid al-muz\'ij.', id: 'Saya nemu di spam.' },
        ],
      },
      {
        id: 'c4', title: 'Follow-up Email', situation: 'Reminder klien',
        dialog: [
          { speaker: 'Anda', ar: 'أَرْسَلتُ لَكُمْ خِطَابًا قَبْل أُسْبُوع.', latin: 'arsaltu lakum khithaaban qabla usbuu\'.', id: 'Saya kirim surat seminggu lalu.' },
          { speaker: 'Klien', ar: 'آسِف عَلَى التَّأَخُّر، سَأَرُدّ اليَوْم.', latin: 'aasif \'alaa at-ta\'akhkhur, sa-arudd al-yawm.', id: 'Maaf telat, akan saya balas hari ini.' },
        ],
      },
      {
        id: 'c5', title: 'Email Urgent', situation: 'Tag urgent',
        dialog: [
          { speaker: 'Anda', ar: 'أَرْسَلتُ بَرِيدًا عَاجِلًا، رِجَاء الرَّدّ.', latin: 'arsaltu bariidan \'aajilan, rajaa\' ar-radd.', id: 'Saya kirim email urgent, mohon dibalas.' },
          { speaker: 'Klien', ar: 'مَا الأَمْر؟', latin: 'maa al-amr?', id: 'Apa masalahnya?' },
          { speaker: 'Anda', ar: 'العَقْد يَنْتَهِي غَدًا.', latin: 'al-\'aqd yantahii ghadan.', id: 'Kontraknya habis besok.' },
        ],
      },
      {
        id: 'c6', title: 'CC & BCC Penjelasan', situation: 'Tanya etiket email',
        dialog: [
          { speaker: 'Junior', ar: 'هَلْ أَضَع المُدِير فِي نَسْخَة؟', latin: 'hal adha\' al-mudiir fii nuskhah?', id: 'Saya CC manajer?' },
          { speaker: 'Anda', ar: 'نَعَم، لِلِاطِّلَاع.', latin: 'na\'am, lil-ittilaa\'.', id: 'Iya, untuk diketahui.' },
          { speaker: 'Junior', ar: 'وَالعَمِيل فِي نَسْخَة مَخْفِيَّة؟', latin: 'wal-\'amiil fii nuskhah makhfiyyah?', id: 'Dan klien di BCC?' },
          { speaker: 'Anda', ar: 'لَا، يَجِب أَن يَكُون فِي نَسْخَة عَادِيَّة.', latin: 'laa, yajib an yakuun fii nuskhah \'aadiyyah.', id: 'Tidak, harus di CC normal.' },
        ],
      },
    ],
  },
  {
    id: 'jadwal-tugas', pathId: 'profesi', order: 11,
    title: 'Manajemen Tugas & Jadwal', arabic: 'إدارة المهام والمواعيد',
    emoji: '📋', color: '#0a4d3c', bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    description: 'Agenda harian, deadline, prioritas, reschedule, kalender kerja.',
    estimatedMinutes: 5, xpReward: 55,
    vocab: [
      { ar: 'المَهَامّ', latin: 'al-mahaamm', id: 'Tugas-tugas' },
      { ar: 'المَوْعِد النِّهَائِيّ', latin: 'al-maw\'id an-nihaa\'iyy', id: 'Deadline' },
      { ar: 'الأَوْلَوِيَّة', latin: 'al-awlawiyyah', id: 'Prioritas' },
      { ar: 'التَّقْوِيم', latin: 'at-taqwiim', id: 'Kalender' },
      { ar: 'إِعَادَة جَدْوَلَة', latin: 'i\'aadat jadwalah', id: 'Reschedule' },
      { ar: 'تَأْجِيل', latin: 'ta\'jiil', id: 'Penundaan' },
      { ar: 'مَنْجَز', latin: 'manjaz', id: 'Selesai/done' },
      { ar: 'قَيْد التَّنْفِيذ', latin: 'qayd at-tanfiidz', id: 'In progress' },
    ],
    conversations: [
      {
        id: 'c1', title: 'Rencana Hari Ini', situation: 'Briefing pagi',
        dialog: [
          { speaker: 'Manajer', ar: 'مَا مَهَامُّك اليَوْم؟', latin: 'maa mahaammuk al-yawm?', id: 'Apa tugasmu hari ini?' },
          { speaker: 'Anda', ar: 'لَدَيَّ اِجْتِمَاع، وَمُرَاجَعَة العَقْد، وَإِرْسَال التَّقْرِير.', latin: 'ladayya ijtimaa\', wa muraaja\'at al-\'aqd, wa irsaal at-taqriir.', id: 'Saya ada rapat, review kontrak, dan kirim laporan.' },
          { speaker: 'Manajer', ar: 'مَا الأَوْلَوِيَّة؟', latin: 'maa al-awlawiyyah?', id: 'Prioritasnya yang mana?' },
          { speaker: 'Anda', ar: 'الاِجْتِمَاع، ثُمَّ التَّقْرِير.', latin: 'al-ijtimaa\', tsumma at-taqriir.', id: 'Rapat dulu, baru laporan.' },
        ],
      },
      {
        id: 'c2', title: 'Tanya Deadline', situation: 'Pastikan timeline',
        dialog: [
          { speaker: 'Anda', ar: 'مَا المَوْعِد النِّهَائِيّ لِهَذِهِ المُهِمَّة؟', latin: 'maa al-maw\'id an-nihaa\'iyy li-hadhihi al-muhimmah?', id: 'Deadline tugas ini kapan?' },
          { speaker: 'Manajer', ar: 'الجُمُعَة فِي نِهَايَة اليَوْم.', latin: 'al-jumu\'ah fii nihaayat al-yawm.', id: 'Jumat akhir hari.' },
          { speaker: 'Anda', ar: 'يَكْفِي، سَأَنْتَهِي قَبْل ذَلِك.', latin: 'yakfii, sa-antahii qabla dzaalik.', id: 'Cukup, saya selesaikan sebelum itu.' },
        ],
      },
      {
        id: 'c3', title: 'Minta Perpanjangan', situation: 'Deadline mepet',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ يُمْكِن تَأْجِيل المَوْعِد لِيَوْمَيْن؟', latin: 'hal yumkin ta\'jiil al-maw\'id li-yawmayn?', id: 'Bisa tunda deadline 2 hari?' },
          { speaker: 'Manajer', ar: 'مَا السَّبَب؟', latin: 'maa as-sabab?', id: 'Sebabnya?' },
          { speaker: 'Anda', ar: 'البَيَانَات أَكْثَر مِنَ المُتَوَقَّع.', latin: 'al-bayaanaat aktsar min al-mutawaqqa\'.', id: 'Data lebih banyak dari perkiraan.' },
          { speaker: 'Manajer', ar: 'مُوَافَق، حَتَّى الاِثْنَيْن.', latin: 'muwaafaq, hattaa al-itsnayn.', id: 'OK, sampai Senin.' },
        ],
      },
      {
        id: 'c4', title: 'Reschedule Meeting', situation: 'Atur ulang janji',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ يُمْكِن إِعَادَة جَدْوَلَة الاِجْتِمَاع؟', latin: 'hal yumkin i\'aadat jadwalat al-ijtimaa\'?', id: 'Bisa reschedule rapatnya?' },
          { speaker: 'Klien', ar: 'مَتَى يُنَاسِبُك؟', latin: 'mataa yunaasibuk?', id: 'Kapan cocok untuk Anda?' },
          { speaker: 'Anda', ar: 'الخَمِيس فِي العَاشِرَة صَبَاحًا.', latin: 'al-khamiis fii al-\'aasyirah shabaahan.', id: 'Kamis jam 10 pagi.' },
          { speaker: 'Klien', ar: 'مَوْعِد جَدِيد مُؤَكَّد.', latin: 'maw\'id jadiid mu\'akkad.', id: 'Janji baru dikonfirmasi.' },
        ],
      },
      {
        id: 'c5', title: 'Update Status Tugas', situation: 'Lapor progress',
        dialog: [
          { speaker: 'Manajer', ar: 'مَا حَالَة المَشْرُوع؟', latin: 'maa haalat al-masyruu\'?', id: 'Status proyek bagaimana?' },
          { speaker: 'Anda', ar: 'قَيْد التَّنْفِيذ، 70%.', latin: 'qayd at-tanfiidz, sab\'iin bil-mi\'ah.', id: 'In progress, 70%.' },
          { speaker: 'Manajer', ar: 'مَتَى يَنْتَهِي؟', latin: 'mataa yantahii?', id: 'Kapan selesai?' },
          { speaker: 'Anda', ar: 'الأُسْبُوع القَادِم إِنْ شَاءَ اللَّه.', latin: 'al-usbuu\' al-qaadim in syaa\'allah.', id: 'Minggu depan insya Allah.' },
        ],
      },
      {
        id: 'c6', title: 'Tugas Selesai', situation: 'Marking done',
        dialog: [
          { speaker: 'Anda', ar: 'انْتَهَيْتُ مِنَ المُهِمَّة، تَفَضَّل.', latin: 'intahaytu min al-muhimmah, tafadhdhal.', id: 'Saya selesai tugasnya, silakan.' },
          { speaker: 'Manajer', ar: 'مُمْتَاز، شُكْرًا.', latin: 'mumtaaz, syukran.', id: 'Bagus, terima kasih.' },
        ],
      },
    ],
  },
  {
    id: 'cuti-izin', pathId: 'profesi', order: 12,
    title: 'Cuti & Izin Tidak Masuk', arabic: 'الإجازات والغياب',
    emoji: '🏖️', color: '#a05536', bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
    description: 'Cuti tahunan, cuti sakit, izin keluar, surat keterangan.',
    estimatedMinutes: 5, xpReward: 55,
    vocab: [
      { ar: 'إِجَازَة سَنَوِيَّة', latin: 'ijaazah sanawiyyah', id: 'Cuti tahunan' },
      { ar: 'إِجَازَة مَرَضِيَّة', latin: 'ijaazah maradhiyyah', id: 'Cuti sakit' },
      { ar: 'إِجَازَة وَضْع', latin: 'ijaazat wadh\'', id: 'Cuti melahirkan' },
      { ar: 'مُوَافَقَة', latin: 'muwaafaqah', id: 'Persetujuan' },
      { ar: 'تَقْرِير طِبِّيّ', latin: 'taqriir thibbiyy', id: 'Surat dokter' },
      { ar: 'رَصِيد الإِجَازَة', latin: 'rashiid al-ijaazah', id: 'Sisa cuti' },
      { ar: 'بَدَل', latin: 'badal', id: 'Pengganti / kompensasi' },
    ],
    conversations: [
      {
        id: 'c1', title: 'Ajukan Cuti Tahunan', situation: 'HR meeting',
        dialog: [
          { speaker: 'Anda', ar: 'أُرِيد طَلَب إِجَازَة سَنَوِيَّة.', latin: 'uriid thalab ijaazah sanawiyyah.', id: 'Saya mau ajukan cuti tahunan.' },
          { speaker: 'HR', ar: 'كَمْ يَوْم؟', latin: 'kam yawm?', id: 'Berapa hari?' },
          { speaker: 'Anda', ar: 'خَمْسَة أَيَّام، مِنَ الاِثْنَيْن.', latin: 'khamsah ayyaam, min al-itsnayn.', id: '5 hari, mulai Senin.' },
          { speaker: 'HR', ar: 'اِمْلَأ النَّمُوذَج وَأَرْسِلهُ لِلمُدِير.', latin: 'imla\' an-namuudzaj wa arsilhu lil-mudiir.', id: 'Isi formulir dan kirim ke manajer.' },
        ],
      },
      {
        id: 'c2', title: 'Sakit Mendadak', situation: 'Telepon kantor pagi',
        dialog: [
          { speaker: 'Anda', ar: 'لَا أَسْتَطِيع الحُضُور اليَوْم، أَنَا مَرِيض.', latin: 'laa astathii\' al-hudhuur al-yawm, anaa mariidh.', id: 'Saya gak bisa masuk hari ini, sakit.' },
          { speaker: 'Manajer', ar: 'سَلَامَتُك، اِسْتَرِح.', latin: 'salaamatuk, istarih.', id: 'Semoga sembuh, istirahat.' },
          { speaker: 'Anda', ar: 'سَأَجْلِب تَقْرِيرًا طِبِّيًّا غَدًا.', latin: 'sa-ajlib taqriiran thibbiyyan ghadan.', id: 'Saya bawa surat dokter besok.' },
        ],
      },
      {
        id: 'c3', title: 'Cek Sisa Cuti', situation: 'Hitung kuota',
        dialog: [
          { speaker: 'Anda', ar: 'مَا رَصِيد إِجَازَتِي هَذَا العَام؟', latin: 'maa rashiid ijaazatii hadhaa al-\'aam?', id: 'Sisa cuti saya tahun ini berapa?' },
          { speaker: 'HR', ar: '12 يَوْم.', latin: 'itsnaa \'asyar yawm.', id: '12 hari.' },
          { speaker: 'Anda', ar: 'هَلْ تُنْقَل لِلعَام القَادِم؟', latin: 'hal tunqal lil-\'aam al-qaadim?', id: 'Bisa carry-over ke tahun depan?' },
          { speaker: 'HR', ar: 'فَقَط 5 أَيَّام كَحَدّ أَقْصَى.', latin: 'faqath khamsah ayyaam ka-hadd aqshaa.', id: 'Maksimal 5 hari.' },
        ],
      },
      {
        id: 'c4', title: 'Izin Keluar Sebentar', situation: 'Urusan urgent',
        dialog: [
          { speaker: 'Anda', ar: 'أَسْتَأْذِنُك بِالخُرُوج لِسَاعَتَيْن.', latin: 'asta\'dzinuka bil-khuruuj li-saa\'atayn.', id: 'Saya minta izin keluar 2 jam.' },
          { speaker: 'Manajer', ar: 'لِمَاذَا؟', latin: 'limaadzaa?', id: 'Kenapa?' },
          { speaker: 'Anda', ar: 'لِمَوْعِد طَبِيب.', latin: 'li-maw\'id thabiib.', id: 'Janji dokter.' },
          { speaker: 'Manajer', ar: 'مُوَافَق، وَلَكِنّ أَكْمِل المَهَامّ.', latin: 'muwaafaq, walaakinna akmil al-mahaamm.', id: 'OK, tapi selesaikan tugasnya.' },
        ],
      },
      {
        id: 'c5', title: 'Cuti Lebaran/Hari Raya', situation: 'Cuti event',
        dialog: [
          { speaker: 'Anda', ar: 'أُرِيد إِجَازَة عِيد الفِطْر.', latin: 'uriid ijaazat \'iid al-fithr.', id: 'Saya mau cuti Idul Fitri.' },
          { speaker: 'HR', ar: 'الشَّرِكَة تُغْلَق 3 أَيَّام، إِجَازَة رَسْمِيَّة.', latin: 'asy-syarikah tughlaq tsalaatsah ayyaam, ijaazah rasmiyyah.', id: 'Perusahaan tutup 3 hari, libur resmi.' },
          { speaker: 'Anda', ar: 'هَلْ يُمْكِن إِضَافَة يَوْمَيْن؟', latin: 'hal yumkin idhaafat yawmayn?', id: 'Bisa tambah 2 hari?' },
          { speaker: 'HR', ar: 'مِنْ رَصِيدِك الشَّخْصِيّ.', latin: 'min rashiidik asy-syakhshiyy.', id: 'Dari kuota pribadi Anda.' },
        ],
      },
      {
        id: 'c6', title: 'Kerja Hari Libur', situation: 'Lembur weekend',
        dialog: [
          { speaker: 'Manajer', ar: 'هَلْ يُمْكِنُك العَمَل السَّبْت؟', latin: 'hal yumkinuk al-\'amal as-sabt?', id: 'Bisa kerja Sabtu?' },
          { speaker: 'Anda', ar: 'مُمْكِن، هَلْ بَدَل أَوْ يَوْم آخَر؟', latin: 'mumkin, hal badal aw yawm aakhar?', id: 'Bisa, dapat kompensasi atau libur lain?' },
          { speaker: 'Manajer', ar: 'يَوْم بَدَل فِي الأُسْبُوع التَّالِي.', latin: 'yawm badal fii al-usbuu\' at-taalii.', id: 'Libur pengganti minggu depan.' },
        ],
      },
    ],
  },
  {
    id: 'atasan-bawahan', pathId: 'profesi', order: 13,
    title: 'Berinteraksi dengan Atasan & Bawahan', arabic: 'التعامل مع الرئيس والمرؤوسين',
    emoji: '👔', color: '#7a3d2a', bgGradient: 'linear-gradient(135deg, #7a3d2a, #a05536)',
    description: 'Laporan kerja, instruksi, delegasi tugas, etika hierarki.',
    estimatedMinutes: 5, xpReward: 60,
    vocab: [
      { ar: 'الرَّئِيس', latin: 'ar-ra\'iis', id: 'Atasan' },
      { ar: 'المَرْؤُوس', latin: 'al-mar\'uus', id: 'Bawahan' },
      { ar: 'تَقْرِير', latin: 'taqriir', id: 'Laporan' },
      { ar: 'تَفْوِيض', latin: 'tafwiidh', id: 'Delegasi' },
      { ar: 'تَعْلِيمَات', latin: 'ta\'liimaat', id: 'Instruksi' },
      { ar: 'مُلَاحَظَات', latin: 'mulaahazhaat', id: 'Catatan / feedback' },
      { ar: 'ثِقَة', latin: 'tsiqah', id: 'Kepercayaan' },
    ],
    conversations: [
      {
        id: 'c1', title: 'Lapor Mingguan', situation: 'Weekly check-in',
        dialog: [
          { speaker: 'Anda', ar: 'تَقْرِير الأُسْبُوع، تَفَضَّل.', latin: 'taqriir al-usbuu\', tafadhdhal.', id: 'Laporan minggu ini, silakan.' },
          { speaker: 'Manajer', ar: 'كَيْفَ سَارَت الأُمُور؟', latin: 'kayfa saarat al-umuur?', id: 'Bagaimana berjalan?' },
          { speaker: 'Anda', ar: 'نَجَحنَا فِي اِسْتِكْمَال 3 مَشَارِيع.', latin: 'najahnaa fii istikmaal tsalaatsat masyaarii\'.', id: 'Berhasil selesaikan 3 proyek.' },
          { speaker: 'Manajer', ar: 'مُمْتَاز، اِسْتَمِرّ.', latin: 'mumtaaz, istamirr.', id: 'Bagus, lanjutkan.' },
        ],
      },
      {
        id: 'c2', title: 'Terima Instruksi', situation: 'Tugas baru',
        dialog: [
          { speaker: 'Manajer', ar: 'أُرِيدُك أَن تَتَوَلَّى المَشْرُوع الجَدِيد.', latin: 'uriiduka an tatawallaa al-masyruu\' al-jadiid.', id: 'Saya mau Anda handle proyek baru.' },
          { speaker: 'Anda', ar: 'حَاضِر، مَا التَّفَاصِيل؟', latin: 'haadhir, maa at-tafaashiil?', id: 'Siap, detailnya bagaimana?' },
          { speaker: 'Manajer', ar: 'سَأَرْسِل لَك المُسْتَنَدَات بِالبَرِيد.', latin: 'sa-arsil laka al-mustanadaat bil-bariid.', id: 'Saya kirim dokumennya via email.' },
        ],
      },
      {
        id: 'c3', title: 'Delegasi ke Tim', situation: 'Bagi tugas',
        dialog: [
          { speaker: 'Anda', ar: 'أُفَوِّض لَكَ مَهَمَّة جَمْع البَيَانَات.', latin: 'ufawwidh laka mahammah jam\' al-bayaanaat.', id: 'Saya delegasikan tugas kumpul data.' },
          { speaker: 'Junior', ar: 'حَاضِر، مَتَى المَوْعِد؟', latin: 'haadhir, mataa al-maw\'id?', id: 'Siap, deadline kapan?' },
          { speaker: 'Anda', ar: 'بَعْد ثَلَاثَة أَيَّام.', latin: 'ba\'da tsalaatsah ayyaam.', id: '3 hari lagi.' },
        ],
      },
      {
        id: 'c4', title: 'Diskusi Masalah dgn Atasan', situation: 'Eskalasi',
        dialog: [
          { speaker: 'Anda', ar: 'لَدَيَّ مُشْكِلَة، هَلْ لَكَ وَقْت؟', latin: 'ladayya musykilah, hal laka waqt?', id: 'Saya ada masalah, punya waktu?' },
          { speaker: 'Manajer', ar: 'تَفَضَّل، تَكَلَّم.', latin: 'tafadhdhal, takallam.', id: 'Silakan, bicara.' },
          { speaker: 'Anda', ar: 'العَمِيل غَيْر رَاضٍ عَنْ التَّسْلِيم.', latin: 'al-\'amiil ghayr raadhin \'an at-tasliim.', id: 'Klien gak puas dengan delivery.' },
          { speaker: 'Manajer', ar: 'سَنَدْرُس الحَلّ مَعًا.', latin: 'sa-nadrus al-hall ma\'an.', id: 'Kita cari solusi bareng.' },
        ],
      },
      {
        id: 'c5', title: 'Beri Feedback ke Bawahan', situation: 'Coaching',
        dialog: [
          { speaker: 'Anda', ar: 'أَدَاؤُك جَيِّد، وَلَكِنّ هُنَاك مَا يَحْتَاج تَحْسِين.', latin: 'adaa\'uk jayyid, walaakinna hunaak maa yahtaaj tahsiin.', id: 'Performance bagus, tapi ada yang perlu diperbaiki.' },
          { speaker: 'Junior', ar: 'مَا هُوَ؟', latin: 'maa huwa?', id: 'Apa itu?' },
          { speaker: 'Anda', ar: 'إِدَارَة الوَقْت.', latin: 'idaarat al-waqt.', id: 'Manajemen waktu.' },
          { speaker: 'Junior', ar: 'شُكْرًا، سَأَعْمَل عَلَى ذَلِك.', latin: 'syukran, sa-a\'mal \'alaa dzaalik.', id: 'Terima kasih, akan saya kerjakan.' },
        ],
      },
      {
        id: 'c6', title: 'Minta Bimbingan', situation: 'Mentoring',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ يُمْكِنُك تَوْجِيهِي فِي هَذِهِ المُهِمَّة؟', latin: 'hal yumkinuk tawjiihii fii hadhihi al-muhimmah?', id: 'Bisa bimbing saya di tugas ini?' },
          { speaker: 'Senior', ar: 'بِالطَّبْع، تَعَال إِلَى مَكْتَبِي.', latin: 'bith-thab\', ta\'aal ilaa maktabii.', id: 'Tentu, datang ke kantor saya.' },
        ],
      },
    ],
  },
  {
    id: 'kerja-tim', pathId: 'profesi', order: 14,
    title: 'Kerja Tim & Manajemen Fariq', arabic: 'العمل الجماعي وإدارة الفريق',
    emoji: '🤝', color: '#c9a961', bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    description: 'Pembagian tugas, kolaborasi, koordinasi antar-divisi, kepemimpinan.',
    estimatedMinutes: 5, xpReward: 60,
    vocab: [
      { ar: 'العَمَل الجَمَاعِيّ', latin: 'al-\'amal al-jamaa\'iyy', id: 'Kerja tim' },
      { ar: 'تَنْسِيق', latin: 'tansiiq', id: 'Koordinasi' },
      { ar: 'تَعَاوُن', latin: 'ta\'aawun', id: 'Kolaborasi' },
      { ar: 'القِيَادَة', latin: 'al-qiyaadah', id: 'Kepemimpinan' },
      { ar: 'تَوْزِيع المَهَامّ', latin: 'tawzii\' al-mahaamm', id: 'Pembagian tugas' },
      { ar: 'الأَدْوَار', latin: 'al-adwaar', id: 'Peran' },
      { ar: 'الاِتِّصَال الفَعَّال', latin: 'al-ittishaal al-fa\'\'aal', id: 'Komunikasi efektif' },
    ],
    conversations: [
      {
        id: 'c1', title: 'Briefing Tim', situation: 'Kickoff project',
        dialog: [
          { speaker: 'Anda', ar: 'فَرِيق، لَدَيْنَا مَشْرُوع جَدِيد.', latin: 'fariiq, ladaynaa masyruu\' jadiid.', id: 'Tim, kita ada proyek baru.' },
          { speaker: 'Anda', ar: 'سَأُوَزِّع الأَدْوَار.', latin: 'sa-uwazzi\' al-adwaar.', id: 'Saya akan bagi peran.' },
          { speaker: 'Tim', ar: 'مَتَى نَبْدَأ؟', latin: 'mataa nabda\'?', id: 'Kapan mulai?' },
          { speaker: 'Anda', ar: 'غَدًا الصَّبَاح.', latin: 'ghadan ash-shabaah.', id: 'Besok pagi.' },
        ],
      },
      {
        id: 'c2', title: 'Pembagian Tugas', situation: 'Allocate work',
        dialog: [
          { speaker: 'Anda', ar: 'أَحْمَد، أَنْتَ مَسْؤُول عَنْ التَّصْمِيم.', latin: 'Ahmad, anta mas\'uul \'an at-tashmiim.', id: 'Ahmad, kamu bertanggung jawab desain.' },
          { speaker: 'Ahmad', ar: 'حَاضِر.', latin: 'haadhir.', id: 'Siap.' },
          { speaker: 'Anda', ar: 'سَارَة، أَنْتِ مَسْؤُولَة عَنْ البَيَانَات.', latin: 'Saarah, anti mas\'uulah \'an al-bayaanaat.', id: 'Sarah, kamu data.' },
          { speaker: 'Sarah', ar: 'مَفْهُوم.', latin: 'mafhuum.', id: 'Paham.' },
        ],
      },
      {
        id: 'c3', title: 'Koordinasi Antar-Divisi', situation: 'Lintas departemen',
        dialog: [
          { speaker: 'Anda', ar: 'نَحْتَاج تَنْسِيق مَع قِسْم المَالِيَّة.', latin: 'nahtaaj tansiiq ma\'a qism al-maaliyyah.', id: 'Butuh koordinasi dengan finance.' },
          { speaker: 'Manajer', ar: 'سَأُرَتِّب اِجْتِمَاع.', latin: 'sa-urattib ijtimaa\'.', id: 'Saya atur rapat.' },
          { speaker: 'Anda', ar: 'مَا أَفْضَل وَقْت؟', latin: 'maa afdhal waqt?', id: 'Waktu terbaik kapan?' },
          { speaker: 'Manajer', ar: 'الثُّلَاثَاء عَصْرًا.', latin: 'ats-tsulaatsaa\' \'ashran.', id: 'Selasa sore.' },
        ],
      },
      {
        id: 'c4', title: 'Atasi Konflik Tim', situation: 'Mediasi',
        dialog: [
          { speaker: 'Anda', ar: 'هُنَاكَ خِلَاف بَيْنَكُمَا، لِنَحُلَّه.', latin: 'hunaaka khilaaf baynakumaa, li-nahullah.', id: 'Ada perselisihan kalian, mari kita selesaikan.' },
          { speaker: 'Pihak A', ar: 'لَيْس عِنْدِي مُشْكِلَة شَخْصِيَّة.', latin: 'laysa \'indii musykilah syakhshiyyah.', id: 'Saya gak punya masalah personal.' },
          { speaker: 'Anda', ar: 'تَكَلَّمَا بِاحْتِرَام، اِسْمَع كُلّ طَرَف.', latin: 'takallamaa bi-ihtiraam, isma\' kullu tharaf.', id: 'Bicara dengan hormat, dengar masing-masing pihak.' },
        ],
      },
      {
        id: 'c5', title: 'Apresiasi Tim', situation: 'After success',
        dialog: [
          { speaker: 'Anda', ar: 'أَحْسَنْتُمْ! العَمَل كَانَ مُمْتَازًا.', latin: 'ahsantum! al-\'amal kaana mumtaazan.', id: 'Mantap! Kerjaan kalian sangat bagus.' },
          { speaker: 'Tim', ar: 'شُكْرًا، الفَضْل لِلْفَرِيق كُلِّه.', latin: 'syukran, al-fadhl lil-fariiq kullih.', id: 'Terima kasih, semua berkat tim.' },
        ],
      },
      {
        id: 'c6', title: 'Sync Mingguan', situation: 'Weekly standup',
        dialog: [
          { speaker: 'Anda', ar: 'كَيْفَ تَقَدَّمَت المَهَامّ هَذَا الأُسْبُوع؟', latin: 'kayfa taqaddamat al-mahaamm hadhaa al-usbuu\'?', id: 'Tugas-tugas minggu ini gimana?' },
          { speaker: 'Tim', ar: 'أَنْجَزْنَا 80% مِنْ خُطَّتِنَا.', latin: 'anjaznaa tsamaaniin bil-mi\'ah min khuthathinaa.', id: 'Selesai 80% dari rencana.' },
          { speaker: 'Anda', ar: 'مَا العَوَائِق؟', latin: 'maa al-\'awaa\'iq?', id: 'Halangannya apa?' },
          { speaker: 'Tim', ar: 'نَنْقُص أَدَوَات تِقْنِيَّة.', latin: 'nanqush adawaat tiqniyyah.', id: 'Kurang tools teknis.' },
        ],
      },
    ],
  },
  {
    id: 'evaluasi-promosi', pathId: 'profesi', order: 15,
    title: 'Evaluasi Kinerja & Promosi', arabic: 'التقييم الوظيفي والترقية',
    emoji: '⭐', color: '#0a4d3c', bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    description: 'Review tahunan, KPI, kenaikan jabatan, kenaikan gaji, feedback.',
    estimatedMinutes: 6, xpReward: 65,
    vocab: [
      { ar: 'التَّقْيِيم', latin: 'at-taqyiim', id: 'Evaluasi' },
      { ar: 'التَّرْقِيَة', latin: 'at-tarqiyah', id: 'Promosi' },
      { ar: 'زِيَادَة الرَّاتِب', latin: 'ziyaadat ar-raatib', id: 'Kenaikan gaji' },
      { ar: 'الأَدَاء', latin: 'al-adaa\'', id: 'Performance' },
      { ar: 'مُلَاحَظَات', latin: 'mulaahazhaat', id: 'Feedback' },
      { ar: 'المُؤَشِّرَات', latin: 'al-mu\'asysyiraat', id: 'KPI/indikator' },
      { ar: 'الأَهْدَاف', latin: 'al-ahdaaf', id: 'Target' },
      { ar: 'المُكَافَأَة', latin: 'al-mukaafa\'ah', id: 'Bonus / reward' },
    ],
    conversations: [
      {
        id: 'c1', title: 'Mulai Review Tahunan', situation: 'Annual review meeting',
        dialog: [
          { speaker: 'Manajer', ar: 'اليَوْم نُقَيِّم أَدَاءَك السَّنَوِيّ.', latin: 'al-yawm nuqayyim adaa\'aka as-sanawiyy.', id: 'Hari ini kita review performance tahunan.' },
          { speaker: 'Anda', ar: 'حَاضِر، أَنَا مُسْتَعِدّ.', latin: 'haadhir, anaa musta\'idd.', id: 'Siap, saya siap.' },
        ],
      },
      {
        id: 'c2', title: 'Feedback Positif', situation: 'Kelebihan',
        dialog: [
          { speaker: 'Manajer', ar: 'حَقَّقْتَ كُلّ أَهْدَافِك.', latin: 'haqqaqta kulla ahdaafik.', id: 'Anda capai semua target.' },
          { speaker: 'Anda', ar: 'شُكْرًا، كَانَ بِجُهْد الفَرِيق.', latin: 'syukran, kaana bi-juhd al-fariiq.', id: 'Terima kasih, berkat usaha tim.' },
          { speaker: 'Manajer', ar: 'القِيَادَة وَالاِتِّصَال نِقَاط قُوَّتِك.', latin: 'al-qiyaadah wal-ittishaal niqaath quwwatik.', id: 'Leadership dan komunikasi adalah kelebihanmu.' },
        ],
      },
      {
        id: 'c3', title: 'Feedback Konstruktif', situation: 'Area improvement',
        dialog: [
          { speaker: 'Manajer', ar: 'هُنَاك مَجَال لِلتَّحْسِين فِي إِدَارَة الوَقْت.', latin: 'hunaaka majaal lit-tahsiin fii idaarat al-waqt.', id: 'Ada ruang improvement di time management.' },
          { speaker: 'Anda', ar: 'صَحِيح، سَأَعْمَل عَلَى ذَلِك.', latin: 'shahiih, sa-a\'mal \'alaa dzaalik.', id: 'Benar, akan saya kerjakan.' },
          { speaker: 'Manajer', ar: 'أَقْتَرِح دَوْرَة تَدْرِيبِيَّة.', latin: 'aqtarih dawrah tadriibiyyah.', id: 'Saya saran ikut training.' },
        ],
      },
      {
        id: 'c4', title: 'Tanya Promosi', situation: 'Career conversation',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ هُنَاك إِمْكَانِيَّة لِلتَّرْقِيَة؟', latin: 'hal hunaaka imkaaniyyah lit-tarqiyah?', id: 'Ada peluang promosi?' },
          { speaker: 'Manajer', ar: 'نَعَم، فِي الرُّبْع القَادِم.', latin: 'na\'am, fii ar-rub\' al-qaadim.', id: 'Iya, kuartal depan.' },
          { speaker: 'Anda', ar: 'مَا الشُّرُوط؟', latin: 'maa asy-syuruuth?', id: 'Apa syaratnya?' },
          { speaker: 'Manajer', ar: 'إِكْمَال مَشْرُوع كَبِير وَتَدْرِيب فَرِيق.', latin: 'ikmaal masyruu\' kabiir wa tadriib fariiq.', id: 'Selesaikan proyek besar dan training tim.' },
        ],
      },
      {
        id: 'c5', title: 'Negosiasi Gaji', situation: 'Salary adjustment',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ يُمْكِن مُنَاقَشَة زِيَادَة الرَّاتِب؟', latin: 'hal yumkin munaaqasyah ziyaadat ar-raatib?', id: 'Bisa bahas kenaikan gaji?' },
          { speaker: 'Manajer', ar: 'مَا تَوَقُّعُك؟', latin: 'maa tawaqqu\'uk?', id: 'Ekspektasimu?' },
          { speaker: 'Anda', ar: 'زِيَادَة 15% بِنَاء عَلَى الأَدَاء.', latin: 'ziyaadah khamsah \'asyar bil-mi\'ah binaa\' \'alaa al-adaa\'.', id: 'Naik 15% berdasarkan performance.' },
          { speaker: 'Manajer', ar: 'سَأَرْفَع طَلَبَك لِلإِدَارَة.', latin: 'sa-arfa\' thalabak lil-idaarah.', id: 'Saya ajukan ke manajemen.' },
        ],
      },
      {
        id: 'c6', title: 'Set Target Tahun Depan', situation: 'Goal setting',
        dialog: [
          { speaker: 'Manajer', ar: 'مَا أَهْدَافُك لِلْعَام القَادِم؟', latin: 'maa ahdaafuk lil-\'aam al-qaadim?', id: 'Targetmu tahun depan?' },
          { speaker: 'Anda', ar: 'زِيَادَة مَبِيعَات بِنِسْبَة 30%، وَقِيَادَة فَرِيق أَكْبَر.', latin: 'ziyaadat mabii\'aat bi-nisbah tsalaatsiin bil-mi\'ah, wa qiyaadat fariiq akbar.', id: 'Naikkan penjualan 30%, dan pimpin tim lebih besar.' },
          { speaker: 'Manajer', ar: 'هَدَف طَمُوح، لَدَيَّ ثِقَة فِيك.', latin: 'hadaf thamuuh, ladayya tsiqah fiika.', id: 'Target ambisius, saya percaya kamu.' },
        ],
      },
    ],
  },
  {
    id: 'negosiasi', pathId: 'profesi', order: 16,
    title: 'Negosiasi Bisnis', arabic: 'التفاوض التجاري',
    emoji: '🤝', color: '#8b6b3d', bgGradient: 'linear-gradient(135deg, #8b6b3d, #a5814f)',
    description: 'Penawaran, tawar-menawar, kontrak, syarat & ketentuan, kesepakatan.',
    estimatedMinutes: 6, xpReward: 65,
    vocab: [
      { ar: 'التَّفَاوُض', latin: 'at-tafaawudh', id: 'Negosiasi' },
      { ar: 'العَرْض', latin: 'al-\'ardh', id: 'Penawaran' },
      { ar: 'الشُّرُوط', latin: 'asy-syuruuth', id: 'Syarat' },
      { ar: 'اِتِّفَاق', latin: 'ittifaaq', id: 'Kesepakatan' },
      { ar: 'سِعْر الجُمْلَة', latin: 'si\'r al-jumlah', id: 'Harga grosir' },
      { ar: 'خَصْم', latin: 'khashm', id: 'Diskon' },
      { ar: 'حَدّ أَدْنَى', latin: 'hadd adnaa', id: 'Minimum' },
      { ar: 'حَدّ أَقْصَى', latin: 'hadd aqshaa', id: 'Maksimum' },
      { ar: 'الدُّفْعَة الأُولَى', latin: 'ad-duf\'ah al-uulaa', id: 'Down payment' },
    ],
    conversations: [
      {
        id: 'c1', title: 'Buka Negosiasi', situation: 'Awal meeting',
        dialog: [
          { speaker: 'Anda', ar: 'شُكْرًا لِفُرْصَة التَّفَاوُض.', latin: 'syukran li-furshah at-tafaawudh.', id: 'Terima kasih kesempatan negosiasi.' },
          { speaker: 'Klien', ar: 'العَفْو، نَتَطَلَّع إِلَى اتِّفَاق مُجْدٍ.', latin: 'al-\'afw, natathalla\' ilaa ittifaaq mujdin.', id: 'Sama-sama, kami harap kesepakatan bermanfaat.' },
        ],
      },
      {
        id: 'c2', title: 'Sampaikan Penawaran', situation: 'Initial offer',
        dialog: [
          { speaker: 'Anda', ar: 'عَرْضُنَا الأَوَّلِيّ هُوَ 100 أَلْف رِيَال.', latin: '\'ardhunaa al-awwaliyy huwa mi\'ah alf riyaal.', id: 'Penawaran awal kami 100 ribu riyal.' },
          { speaker: 'Klien', ar: 'مُرْتَفِع قَلِيلًا، هَلْ يُمْكِن التَّفَاوُض؟', latin: 'murtafi\' qaliilan, hal yumkin at-tafaawudh?', id: 'Agak tinggi, bisa nego?' },
          { speaker: 'Anda', ar: 'بِالطَّبْع، نَحْن مُنْفَتِحُون.', latin: 'bith-thab\', nahnu munfatihuun.', id: 'Tentu, kami fleksibel.' },
        ],
      },
      {
        id: 'c3', title: 'Counter-Offer', situation: 'Tawar balik',
        dialog: [
          { speaker: 'Klien', ar: 'مَا رَأْيُكُمْ بِـ 80 أَلْف؟', latin: 'maa ra\'yukum bi-tsamaaniin alf?', id: 'Bagaimana kalau 80 ribu?' },
          { speaker: 'Anda', ar: 'صَعْب جِدًّا، الحَدّ الأَدْنَى 90 أَلْف.', latin: 'sha\'b jiddan, al-hadd al-adnaa tis\'iin alf.', id: 'Sulit, minimum 90 ribu.' },
          { speaker: 'Klien', ar: 'مَا رَأْيُك بِـ 85 مَع دَفْعَة فَوْرِيَّة؟', latin: 'maa ra\'yuk bi-khamsah wa tsamaaniin ma\'a daf\'ah fawriyyah?', id: '85 dengan bayar langsung?' },
        ],
      },
      {
        id: 'c4', title: 'Sepakat Syarat Pembayaran', situation: 'Payment terms',
        dialog: [
          { speaker: 'Anda', ar: 'مُوَافَق، شَرِيطَة الدُّفْعَة الأُولَى 50%.', latin: 'muwaafaq, syariithat ad-duf\'ah al-uulaa khamsiin bil-mi\'ah.', id: 'Setuju, dengan syarat DP 50%.' },
          { speaker: 'Klien', ar: 'وَالبَاقِي عِنْد التَّسْلِيم؟', latin: 'wal-baaqii \'inda at-tasliim?', id: 'Sisanya saat delivery?' },
          { speaker: 'Anda', ar: 'بِالضَّبْط.', latin: 'bidh-dhabth.', id: 'Tepat sekali.' },
        ],
      },
      {
        id: 'c5', title: 'Diskon untuk Volume', situation: 'Bulk order',
        dialog: [
          { speaker: 'Klien', ar: 'إِذَا طَلَبنَا 1000 وَحْدَة، هَلْ هُنَاك خَصْم؟', latin: 'idzaa thalabnaa alf wahdah, hal hunaaka khashm?', id: 'Kalau order 1000 unit, ada diskon?' },
          { speaker: 'Anda', ar: 'نَعَم، 10% لِلكَمِّيَّات الكَبِيرَة.', latin: 'na\'am, \'asyrah bil-mi\'ah lil-kammiyyaat al-kabiirah.', id: 'Iya, 10% untuk volume besar.' },
        ],
      },
      {
        id: 'c6', title: 'Tutup Kesepakatan', situation: 'Closing deal',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ نَتَّفِق عَلَى الشُّرُوط؟', latin: 'hal nattafiq \'alaa asy-syuruuth?', id: 'Setuju dengan syarat?' },
          { speaker: 'Klien', ar: 'نَعَم، اِتَّفَقنَا.', latin: 'na\'am, ittafaqnaa.', id: 'Ya, sepakat.' },
          { speaker: 'Anda', ar: 'مُمْتَاز، سَنُرْسِل العَقْد لِلتَّوْقِيع.', latin: 'mumtaaz, sa-nursil al-\'aqd lit-tawqii\'.', id: 'Bagus, kami kirim kontrak untuk ditandatangani.' },
        ],
      },
    ],
  },
  {
    id: 'kontrak', pathId: 'profesi', order: 17,
    title: 'Kontrak & Perjanjian', arabic: 'العقود والاتفاقيات',
    emoji: '📜', color: '#a05536', bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
    description: 'Pasal-pasal, tanda tangan, hak/kewajiban, pemutusan kontrak.',
    estimatedMinutes: 6, xpReward: 65,
    vocab: [
      { ar: 'العَقْد', latin: 'al-\'aqd', id: 'Kontrak' },
      { ar: 'البُنُود', latin: 'al-bunuud', id: 'Pasal-pasal' },
      { ar: 'التَّوْقِيع', latin: 'at-tawqii\'', id: 'Tanda tangan' },
      { ar: 'الحُقُوق', latin: 'al-huquuq', id: 'Hak-hak' },
      { ar: 'الوَاجِبَات', latin: 'al-waajibaat', id: 'Kewajiban' },
      { ar: 'فَسْخ العَقْد', latin: 'faskh al-\'aqd', id: 'Pemutusan kontrak' },
      { ar: 'مُحَامٍ', latin: 'muhaamin', id: 'Pengacara' },
      { ar: 'سَرِيَّة', latin: 'sirriyyah', id: 'Kerahasiaan (NDA)' },
      { ar: 'مُدَّة العَقْد', latin: 'muddat al-\'aqd', id: 'Durasi kontrak' },
    ],
    conversations: [
      {
        id: 'c1', title: 'Review Kontrak Pertama', situation: 'Lihat draft',
        dialog: [
          { speaker: 'Anda', ar: 'دَعنِي أُرَاجِع البُنُود قَبْل التَّوْقِيع.', latin: 'da\'nii uraaji\' al-bunuud qabla at-tawqii\'.', id: 'Biar saya review pasalnya sebelum tanda tangan.' },
          { speaker: 'Klien', ar: 'بِالطَّبْع، خُذ وَقْتَك.', latin: 'bith-thab\', khudz waqtak.', id: 'Tentu, ambil waktumu.' },
        ],
      },
      {
        id: 'c2', title: 'Tanya Pasal Spesifik', situation: 'Clarification',
        dialog: [
          { speaker: 'Anda', ar: 'البَنْد 5 غَيْر وَاضِح، هَلْ يُمْكِن التَّوْضِيح؟', latin: 'al-band khamsah ghayr waadhih, hal yumkin at-tawdhiih?', id: 'Pasal 5 tidak jelas, bisa dijelaskan?' },
          { speaker: 'Klien', ar: 'يَتَعَلَّق بِالضَّمَان لِمُدَّة سَنَة.', latin: 'yata\'allaq bidh-dhamaan li-muddah sanah.', id: 'Soal garansi selama 1 tahun.' },
        ],
      },
      {
        id: 'c3', title: 'Negosiasi Pasal NDA', situation: 'Confidentiality',
        dialog: [
          { speaker: 'Anda', ar: 'نَحْتَاج بَنْد سَرِيَّة قَوِيّ.', latin: 'nahtaaj band sirriyyah qawiyy.', id: 'Kami butuh klausul NDA yang kuat.' },
          { speaker: 'Klien', ar: 'مُوَافَق، سَنُضِيف بَنْدًا لِحِمَايَة المَعْلُومَات.', latin: 'muwaafaq, sa-nudhiif bandan li-himaayat al-ma\'luumaat.', id: 'Setuju, kami tambah klausul lindungi informasi.' },
        ],
      },
      {
        id: 'c4', title: 'Konsultasi Pengacara', situation: 'Sebelum sign',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ يُمْكِن أَن يُرَاجِع المُحَامِي العَقْد؟', latin: 'hal yumkin an yuraaji\' al-muhaamii al-\'aqd?', id: 'Boleh pengacara saya review?' },
          { speaker: 'Klien', ar: 'بِالطَّبْع، حَقُّك القَانُونِيّ.', latin: 'bith-thab\', haqquk al-qaanuuniyy.', id: 'Tentu, itu hak hukum Anda.' },
        ],
      },
      {
        id: 'c5', title: 'Tanda Tangan Resmi', situation: 'Signing ceremony',
        dialog: [
          { speaker: 'Anda', ar: 'كُلّ شَيْء يَبْدُو جَيِّدًا، أَيْنَ أُوَقِّع؟', latin: 'kullu syay\'in yabduu jayyidan, ayna uwaqqi\'?', id: 'Semua kelihatan bagus, di mana tanda tangan?' },
          { speaker: 'Klien', ar: 'فِي الصَّفْحَة الأَخِيرَة، بِجَانِب الاِسْم.', latin: 'fii ash-shafhah al-akhiirah, bi-jaanib al-ism.', id: 'Halaman terakhir, sebelah nama.' },
          { speaker: 'Anda', ar: 'مَبْرُوك الشَّرَاكَة!', latin: 'mabruuk asy-syaraakah!', id: 'Selamat atas partnership-nya!' },
        ],
      },
      {
        id: 'c6', title: 'Pemutusan Kontrak', situation: 'Terminate contract',
        dialog: [
          { speaker: 'Anda', ar: 'نَحْتَاج إِلَى مُنَاقَشَة فَسْخ العَقْد.', latin: 'nahtaaj ilaa munaaqasyah faskh al-\'aqd.', id: 'Kami perlu bahas pemutusan kontrak.' },
          { speaker: 'Klien', ar: 'مَا الأَسْبَاب؟', latin: 'maa al-asbaab?', id: 'Alasannya apa?' },
          { speaker: 'Anda', ar: 'تَغْيِير اِسْتْرَاتِيجِيَّتُنَا الدَّاخِلِيَّة.', latin: 'taghyiir istraatiijiyyatunaa ad-daakhiliyyah.', id: 'Perubahan strategi internal kami.' },
          { speaker: 'Klien', ar: 'سَنَتَّبِع البَنْد 12 لِلفَسْخ.', latin: 'sa-nattabi\' al-band itsnaa \'asyar lil-faskh.', id: 'Kita ikuti pasal 12 untuk pemutusan.' },
        ],
      },
    ],
  },
  {
    id: 'keuangan', pathId: 'profesi', order: 18,
    title: 'Transaksi Keuangan & Akuntansi', arabic: 'المعاملات المالية والمحاسبة',
    emoji: '💰', color: '#c9a961', bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    description: 'Faktur, pembayaran, transfer bank, anggaran, laporan keuangan.',
    estimatedMinutes: 5, xpReward: 60,
    vocab: [
      { ar: 'الفَاتُورَة', latin: 'al-faatuurah', id: 'Faktur' },
      { ar: 'الدَّفْع', latin: 'ad-daf\'', id: 'Pembayaran' },
      { ar: 'التَّحْوِيل البَنْكِيّ', latin: 'at-tahwiil al-bankiyy', id: 'Transfer bank' },
      { ar: 'المِيزَانِيَّة', latin: 'al-miizaaniyyah', id: 'Anggaran' },
      { ar: 'التَّقْرِير المَالِيّ', latin: 'at-taqriir al-maaliyy', id: 'Laporan keuangan' },
      { ar: 'الإِيرَادَات', latin: 'al-iiraadaat', id: 'Pemasukan' },
      { ar: 'المَصْرُوفَات', latin: 'al-mashruufaat', id: 'Pengeluaran' },
      { ar: 'الرِّبْح', latin: 'ar-ribh', id: 'Keuntungan' },
      { ar: 'الضَّرِيبَة', latin: 'adh-dhariibah', id: 'Pajak' },
    ],
    conversations: [
      {
        id: 'c1', title: 'Kirim Faktur', situation: 'Tagih klien',
        dialog: [
          { speaker: 'Anda', ar: 'سَأُرْسِل الفَاتُورَة عَلَى البَرِيد.', latin: 'sa-ursil al-faatuurah \'alaa al-bariid.', id: 'Saya kirim faktur lewat email.' },
          { speaker: 'Klien', ar: 'مَا مَوْعِد الاِسْتِحْقَاق؟', latin: 'maa maw\'id al-istihqaaq?', id: 'Jatuh tempo kapan?' },
          { speaker: 'Anda', ar: '30 يَوْم مِنْ تَارِيخ الفَاتُورَة.', latin: 'tsalaatsiin yawm min taariikh al-faatuurah.', id: '30 hari dari tanggal faktur.' },
        ],
      },
      {
        id: 'c2', title: 'Transfer Bank', situation: 'Bayar via bank',
        dialog: [
          { speaker: 'Anda', ar: 'سَأَدْفَع بِتَحْوِيل بَنْكِيّ.', latin: 'sa-adfa\' bi-tahwiil bankiyy.', id: 'Saya bayar via transfer bank.' },
          { speaker: 'Klien', ar: 'هَذَا رَقْم الحِسَاب وَالآيْبَان.', latin: 'hadhaa raqm al-hisaab wal-aaybaan.', id: 'Ini nomor rekening dan IBAN.' },
        ],
      },
      {
        id: 'c3', title: 'Tanya Status Pembayaran', situation: 'Cek payment',
        dialog: [
          { speaker: 'Anda', ar: 'هَلْ وَصَل الدَّفْع؟', latin: 'hal washal ad-daf\'?', id: 'Pembayaran sudah masuk?' },
          { speaker: 'Akunting', ar: 'لَحْظَة، سَأَتَحَقَّق.', latin: 'lahzhah, sa-atahaqqaq.', id: 'Sebentar, biar saya cek.' },
          { speaker: 'Akunting', ar: 'نَعَم، وَصَل أَمْس.', latin: 'na\'am, washal ams.', id: 'Iya, masuk kemarin.' },
        ],
      },
      {
        id: 'c4', title: 'Bahas Anggaran', situation: 'Budget planning',
        dialog: [
          { speaker: 'Manajer', ar: 'كَيْفَ المِيزَانِيَّة لِهَذَا الرُّبْع؟', latin: 'kayfa al-miizaaniyyah li-hadhaa ar-rub\'?', id: 'Anggaran kuartal ini bagaimana?' },
          { speaker: 'Anda', ar: 'اِسْتَهلَكنَا 60% حَتَّى الآن.', latin: 'istahlaknaa sittiin bil-mi\'ah hattaa al-aan.', id: 'Sudah pakai 60% sampai sekarang.' },
          { speaker: 'Manajer', ar: 'يَجِب التَّحَكُّم بِالمَصْرُوفَات.', latin: 'yajib at-tahakkum bil-mashruufaat.', id: 'Harus kontrol pengeluaran.' },
        ],
      },
      {
        id: 'c5', title: 'Laporan Keuntungan', situation: 'P&L review',
        dialog: [
          { speaker: 'Anda', ar: 'الإِيرَادَات تَجَاوَزَت التَّوَقُّعَات.', latin: 'al-iiraadaat tajaawazat at-tawaqqu\'aat.', id: 'Pemasukan lampaui ekspektasi.' },
          { speaker: 'Manajer', ar: 'مَا نِسْبَة الرِّبْح؟', latin: 'maa nisbah ar-ribh?', id: 'Margin keuntungan berapa?' },
          { speaker: 'Anda', ar: '23%، أَفْضَل مِنَ العَام المَاضِي.', latin: 'tsalaatsah wa \'isyriin bil-mi\'ah, afdhal min al-\'aam al-maadhii.', id: '23%, lebih baik dari tahun lalu.' },
        ],
      },
      {
        id: 'c6', title: 'Tanya Pajak', situation: 'Tax consultation',
        dialog: [
          { speaker: 'Anda', ar: 'كَيْفَ نَحْسِب الضَّرِيبَة المُضَافَة؟', latin: 'kayfa nahsib adh-dhariibah al-mudhaafah?', id: 'Cara hitung PPN?' },
          { speaker: 'Akuntan', ar: '15% عَلَى الفَاتُورَة الإِجْمَالِيَّة.', latin: 'khamsah \'asyar bil-mi\'ah \'alaa al-faatuurah al-ijmaaliyyah.', id: '15% dari total faktur.' },
        ],
      },
    ],
  },
  {
    id: 'layanan-pelanggan', pathId: 'profesi', order: 19,
    title: 'Layanan Pelanggan', arabic: 'التعامل مع العملاء وخدمة الزبائن',
    emoji: '🎧', color: '#7a3d2a', bgGradient: 'linear-gradient(135deg, #7a3d2a, #a05536)',
    description: 'Sambut klien, tangani keluhan, beri solusi, follow-up.',
    estimatedMinutes: 5, xpReward: 60,
    vocab: [
      { ar: 'العَمِيل', latin: 'al-\'amiil', id: 'Klien' },
      { ar: 'الشَّكْوَى', latin: 'asy-syakwaa', id: 'Keluhan' },
      { ar: 'الحَلّ', latin: 'al-hall', id: 'Solusi' },
      { ar: 'المُتَابَعَة', latin: 'al-mutaaba\'ah', id: 'Follow-up' },
      { ar: 'رِضَا العَمِيل', latin: 'ridhaa al-\'amiil', id: 'Kepuasan pelanggan' },
      { ar: 'تَعْوِيض', latin: 'ta\'wiidh', id: 'Kompensasi' },
      { ar: 'اِعْتِذَار', latin: 'i\'tidzaar', id: 'Permintaan maaf' },
      { ar: 'نَحْن آسِفُون', latin: 'nahnu aasifuun', id: 'Kami mohon maaf' },
    ],
    conversations: [
      {
        id: 'c1', title: 'Sambut Klien', situation: 'Greeting di kantor',
        dialog: [
          { speaker: 'Anda', ar: 'أَهْلًا وَسَهْلًا، كَيْفَ يُمْكِنُنِي مُسَاعَدَتُك؟', latin: 'ahlan wa sahlan, kayfa yumkinunii musaa\'adatuk?', id: 'Selamat datang, ada yang bisa saya bantu?' },
          { speaker: 'Klien', ar: 'أَنَا هُنَا لِلاِسْتِفْسَار عَنْ خِدْمَاتِكُمْ.', latin: 'anaa hunaa lil-istifsaar \'an khidmaatikum.', id: 'Saya mau tanya tentang layanan.' },
          { speaker: 'Anda', ar: 'تَفَضَّل، اِجْلِس.', latin: 'tafadhdhal, ijlis.', id: 'Silakan, duduk.' },
        ],
      },
      {
        id: 'c2', title: 'Terima Keluhan', situation: 'Klien komplain',
        dialog: [
          { speaker: 'Klien', ar: 'لَدَيَّ شَكْوَى بِخُصُوص المُنْتَج.', latin: 'ladayya syakwaa bi-khushuush al-muntaj.', id: 'Saya komplain tentang produknya.' },
          { speaker: 'Anda', ar: 'نَحْن آسِفُون، أَخْبِرنِي التَّفَاصِيل.', latin: 'nahnu aasifuun, akhbirnii at-tafaashiil.', id: 'Kami mohon maaf, ceritakan detailnya.' },
          { speaker: 'Klien', ar: 'وَصَل تَالِف.', latin: 'washal taalif.', id: 'Sampainya rusak.' },
        ],
      },
      {
        id: 'c3', title: 'Tawarin Solusi', situation: 'Resolve issue',
        dialog: [
          { speaker: 'Anda', ar: 'سَنَسْتَبْدِلهُ مَجَّانًا.', latin: 'sa-nastabdiluhu majjaanan.', id: 'Akan kami ganti gratis.' },
          { speaker: 'Klien', ar: 'مَتَى أَسْتَلِم الجَدِيد؟', latin: 'mataa astalim al-jadiid?', id: 'Kapan saya terima yang baru?' },
          { speaker: 'Anda', ar: 'خِلَال 3 أَيَّام.', latin: 'khilaal tsalaatsah ayyaam.', id: 'Dalam 3 hari.' },
        ],
      },
      {
        id: 'c4', title: 'Klien Marah', situation: 'Handle marah',
        dialog: [
          { speaker: 'Klien', ar: 'أَنَا غَاضِب جِدًّا!', latin: 'anaa ghaadhib jiddan!', id: 'Saya sangat marah!' },
          { speaker: 'Anda', ar: 'أَتَفَهَّم تَمَامًا، وَأَعتَذِر.', latin: 'atafahham tamaaman, wa a\'tadzir.', id: 'Saya sangat paham, dan minta maaf.' },
          { speaker: 'Anda', ar: 'دَعنِي أَحُلّ هَذَا فَوْرًا.', latin: 'da\'nii ahull hadhaa fawran.', id: 'Biar saya selesaikan segera.' },
        ],
      },
      {
        id: 'c5', title: 'Tawarin Kompensasi', situation: 'Offer makeup',
        dialog: [
          { speaker: 'Anda', ar: 'سَنُقَدِّم لَك تَعْوِيضًا، خَصْم 20%.', latin: 'sa-nuqaddim laka ta\'wiidhan, khashm \'isyriin bil-mi\'ah.', id: 'Kami beri kompensasi, diskon 20%.' },
          { speaker: 'Klien', ar: 'شُكْرًا، هَذَا مَقْبُول.', latin: 'syukran, hadhaa maqbuul.', id: 'Terima kasih, itu OK.' },
        ],
      },
      {
        id: 'c6', title: 'Follow-up Setelah Resolusi', situation: 'Check satisfaction',
        dialog: [
          { speaker: 'Anda', ar: 'اِتَّصَلتُ لِأَطمَئِنّ عَلَى رِضَاكَ.', latin: 'ittashaltu li-athma\'inn \'alaa ridhaak.', id: 'Saya telepon mau pastikan kepuasanmu.' },
          { speaker: 'Klien', ar: 'كُلّ شَيْء عَلَى مَا يُرَام، شُكْرًا.', latin: 'kullu syay\'in \'alaa maa yuraam, syukran.', id: 'Semua OK, terima kasih.' },
          { speaker: 'Anda', ar: 'سَعِيدُون بِخِدْمَتِكُمْ.', latin: 'sa\'iiduun bi-khidmatikum.', id: 'Senang bisa melayani.' },
        ],
      },
    ],
  },
  {
    id: 'krisis-masalah', pathId: 'profesi', order: 20,
    title: 'Penyelesaian Masalah & Krisis Kerja', arabic: 'حل المشكلات والأزمات في العمل',
    emoji: '🚨', color: '#0a4d3c', bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    description: 'Konflik internal, krisis perusahaan, mediasi, manajemen risiko.',
    estimatedMinutes: 6, xpReward: 70,
    vocab: [
      { ar: 'الأَزْمَة', latin: 'al-azmah', id: 'Krisis' },
      { ar: 'النِّزَاع', latin: 'an-nizaa\'', id: 'Konflik' },
      { ar: 'الوَسَاطَة', latin: 'al-wasaathah', id: 'Mediasi' },
      { ar: 'إِدَارَة المَخَاطِر', latin: 'idaarat al-makhaathir', id: 'Manajemen risiko' },
      { ar: 'تَغْيِير سِيَاسَة', latin: 'taghyiir siyaasah', id: 'Perubahan kebijakan' },
      { ar: 'إِجْرَاء طَارِئ', latin: 'ijraa\' thaari\'', id: 'Tindakan darurat' },
      { ar: 'خُطَّة بَدِيلَة', latin: 'khuththah badiilah', id: 'Plan B' },
      { ar: 'تَخْفِيف الضَّرَر', latin: 'takhfiif adh-dharar', id: 'Mitigasi' },
    ],
    conversations: [
      {
        id: 'c1', title: 'Lapor Masalah Mendesak', situation: 'Urgent issue',
        dialog: [
          { speaker: 'Anda', ar: 'لَدَيْنَا مُشْكِلَة عَاجِلَة فِي السِّيرفَر.', latin: 'ladaynaa musykilah \'aajilah fii as-server.', id: 'Kami ada masalah urgent di server.' },
          { speaker: 'Manajer', ar: 'مَا مَدَى خُطُورَتُهَا؟', latin: 'maa madaa khuthuurahatuhaa?', id: 'Seberapa serius?' },
          { speaker: 'Anda', ar: 'النِّظَام مُتَوَقِّف، نَفقِد عُمَلَاء.', latin: 'an-nizhaam mutawaqqif, nafqid \'umalaa\'.', id: 'Sistem down, kami kehilangan klien.' },
        ],
      },
      {
        id: 'c2', title: 'Mediasi Konflik Tim', situation: 'Internal conflict',
        dialog: [
          { speaker: 'Anda', ar: 'لَاحَظتُ نِزَاعًا بَيْن المُوَظَّفَيْن.', latin: 'laahazhtu nizaa\'an bayna al-muwazhzhafayn.', id: 'Saya perhatikan ada konflik antar karyawan.' },
          { speaker: 'HR', ar: 'سَنَعمَل وَسَاطَة.', latin: 'sa-na\'mal wasaathah.', id: 'Kita lakukan mediasi.' },
          { speaker: 'Anda', ar: 'مَتَى؟', latin: 'mataa?', id: 'Kapan?' },
          { speaker: 'HR', ar: 'غَدًا الصَّبَاح.', latin: 'ghadan ash-shabaah.', id: 'Besok pagi.' },
        ],
      },
      {
        id: 'c3', title: 'Manajemen Risiko', situation: 'Risk assessment',
        dialog: [
          { speaker: 'Manajer', ar: 'مَا المَخَاطِر الرَّئِيسِيَّة فِي المَشْرُوع؟', latin: 'maa al-makhaathir ar-ra\'iisiyyah fii al-masyruu\'?', id: 'Apa risiko utama proyek?' },
          { speaker: 'Anda', ar: 'تَأَخُّر الإِمْدَادَات، وَنَقص الكَوَادِر.', latin: 'ta\'akhkhur al-imdaadaat, wa naqsh al-kawaadir.', id: 'Telat supply, dan kurang SDM.' },
          { speaker: 'Manajer', ar: 'مَا خُطَّة التَّخْفِيف؟', latin: 'maa khuththah at-takhfiif?', id: 'Plan mitigasinya apa?' },
        ],
      },
      {
        id: 'c4', title: 'Implementasi Plan B', situation: 'Backup plan',
        dialog: [
          { speaker: 'Anda', ar: 'يَجِب تَفْعِيل الخُطَّة البَدِيلَة.', latin: 'yajib taf\'iil al-khuththah al-badiilah.', id: 'Harus aktifin plan B.' },
          { speaker: 'Manajer', ar: 'مَا التَّفَاصِيل؟', latin: 'maa at-tafaashiil?', id: 'Detailnya?' },
          { speaker: 'Anda', ar: 'تَبْدِيل المُورِّد وَتَغْيِير الجَدْوَل.', latin: 'tabdiil al-muwarrid wa taghyiir al-jadwal.', id: 'Ganti supplier dan ubah jadwal.' },
          { speaker: 'Manajer', ar: 'وَافَقتُ، اِبْدَأ فَوْرًا.', latin: 'waafaqtu, ibda\' fawran.', id: 'Setuju, mulai sekarang.' },
        ],
      },
      {
        id: 'c5', title: 'Komunikasi Krisis ke Klien', situation: 'Transparency',
        dialog: [
          { speaker: 'Anda', ar: 'نَحْن آسِفُون عَلَى التَّأَخُّر.', latin: 'nahnu aasifuun \'alaa at-ta\'akhkhur.', id: 'Kami mohon maaf atas keterlambatan.' },
          { speaker: 'Klien', ar: 'مَا السَّبَب؟', latin: 'maa as-sabab?', id: 'Penyebabnya?' },
          { speaker: 'Anda', ar: 'مُشْكِلَة فِي الإِمْدَادَات، نَعْمَل عَلَى حَلّهَا.', latin: 'musykilah fii al-imdaadaat, na\'mal \'alaa hallihaa.', id: 'Masalah supply, sedang kami selesaikan.' },
          { speaker: 'Klien', ar: 'مَتَى التَّسْلِيم الجَدِيد؟', latin: 'mataa at-tasliim al-jadiid?', id: 'Delivery baru kapan?' },
          { speaker: 'Anda', ar: 'خِلَال أُسْبُوع كَحَدّ أَقْصَى.', latin: 'khilaal usbuu\' ka-hadd aqshaa.', id: 'Maksimal seminggu.' },
        ],
      },
      {
        id: 'c6', title: 'Pasca-Krisis Review', situation: 'Post-mortem',
        dialog: [
          { speaker: 'Manajer', ar: 'مَا الدُّرُوس المُسْتَفَادَة؟', latin: 'maa ad-duruus al-mustafaadah?', id: 'Pelajaran yang didapat apa?' },
          { speaker: 'Anda', ar: 'نَحْتَاج خُطَّة طَوَارِئ أَفْضَل.', latin: 'nahtaaj khuththah thawaari\' afdhal.', id: 'Butuh emergency plan lebih bagus.' },
          { speaker: 'Manajer', ar: 'سَنُعِدّ سِيَاسَة جَدِيدَة.', latin: 'sa-nu\'idd siyaasah jadiidah.', id: 'Akan kita buat kebijakan baru.' },
        ],
      },
    ],
  },
);
