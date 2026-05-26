// data/tebak-gambar-levels.js
// 5 kategori × 10 item = 50 vocab visual quiz.
// Pakai emoji sebagai placeholder gambar (cheap, scalable, no asset hosting).
// Bisa di-upgrade ke real photos kalau punya asset.

export const TEBAK_GAMBAR_LEVELS = [
  {
    id: 'makanan',
    title: 'Makanan & Buah',
    description: 'Vocab makanan & minuman sehari-hari',
    emoji: '🍎',
    color: '#a05536',
    bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
    xpReward: 50,
    items: [
      { image: '🍞', arabic: 'خُبْز',     latin: 'khubz',      id: 'Roti',         distractors: ['تَمْر', 'مَاء', 'لَبَن'] },
      { image: '🌰', arabic: 'تَمْر',     latin: 'tamr',       id: 'Kurma',        distractors: ['زَبِيب', 'تِين', 'لَوْز'] },
      { image: '🥛', arabic: 'لَبَن',     latin: 'laban',      id: 'Susu',         distractors: ['عَصِير', 'مَاء', 'قَهْوَة'] },
      { image: '💧', arabic: 'مَاء',      latin: 'maa\'',      id: 'Air',          distractors: ['شَاي', 'حَلِيب', 'عَسَل'] },
      { image: '☕', arabic: 'قَهْوَة',   latin: 'qahwa',      id: 'Kopi',         distractors: ['شَاي', 'مَاء', 'عَصِير'] },
      { image: '🍵', arabic: 'شَاي',      latin: 'shay',       id: 'Teh',          distractors: ['قَهْوَة', 'مَاء', 'حَلِيب'] },
      { image: '🍎', arabic: 'تُفَّاح',   latin: 'tuffah',     id: 'Apel',         distractors: ['بُرْتُقَال', 'مَوْز', 'عِنَب'] },
      { image: '🍊', arabic: 'بُرْتُقَال', latin: 'burtuqal',  id: 'Jeruk',        distractors: ['تُفَّاح', 'لَيْمُون', 'مَوْز'] },
      { image: '🍌', arabic: 'مَوْز',     latin: 'mawz',       id: 'Pisang',       distractors: ['تُفَّاح', 'عِنَب', 'فَرَاوْلَة'] },
      { image: '🍇', arabic: 'عِنَب',     latin: '\'inab',     id: 'Anggur',       distractors: ['تُفَّاح', 'تِين', 'فَرَاوْلَة'] },
    ],
  },
  {
    id: 'tempat',
    title: 'Tempat & Bangunan',
    description: 'Lokasi & tempat penting saat di Saudi',
    emoji: '🕌',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    xpReward: 60,
    items: [
      { image: '🕋', arabic: 'الْكَعْبَة',  latin: 'al-ka\'ba',   id: 'Ka\'bah',        distractors: ['الْمَدِينَة', 'مَكَّة', 'مِنَى'] },
      { image: '🕌', arabic: 'مَسْجِد',     latin: 'masjid',      id: 'Masjid',         distractors: ['مَدْرَسَة', 'مَطْعَم', 'فُنْدُق'] },
      { image: '🏨', arabic: 'فُنْدُق',     latin: 'funduq',      id: 'Hotel',          distractors: ['بَيْت', 'مَسْجِد', 'سُوق'] },
      { image: '🏪', arabic: 'سُوق',        latin: 'suq',         id: 'Pasar',          distractors: ['مَطْعَم', 'مَدْرَسَة', 'فُنْدُق'] },
      { image: '🍽️', arabic: 'مَطْعَم',     latin: 'mat\'am',     id: 'Restoran',       distractors: ['فُنْدُق', 'مَكْتَبَة', 'مُسْتَشْفَى'] },
      { image: '🏥', arabic: 'مُسْتَشْفَى',  latin: 'mustashfa',   id: 'Rumah Sakit',    distractors: ['مَدْرَسَة', 'مَطَار', 'بَنْك'] },
      { image: '✈️', arabic: 'مَطَار',      latin: 'matar',       id: 'Bandara',        distractors: ['مَحَطَّة', 'مَرْفَأ', 'سَاحَة'] },
      { image: '🏠', arabic: 'بَيْت',       latin: 'bayt',        id: 'Rumah',          distractors: ['بَنْت', 'بَاب', 'كَلْب'] },
      { image: '🏫', arabic: 'مَدْرَسَة',   latin: 'madrasa',     id: 'Sekolah',        distractors: ['جَامِعَة', 'مَكْتَبَة', 'مُسْتَشْفَى'] },
      { image: '🏛️', arabic: 'الْمَدِينَة', latin: 'al-madina',   id: 'Kota Madinah',   distractors: ['مَكَّة', 'الرِّيَاض', 'جَدَّة'] },
    ],
  },
  {
    id: 'hewan-alam',
    title: 'Hewan & Alam',
    description: 'Binatang & elemen alam',
    emoji: '🐪',
    color: '#c9a961',
    bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    xpReward: 55,
    items: [
      { image: '🐪', arabic: 'جَمَل',     latin: 'jamal',      id: 'Unta',         distractors: ['حِصَان', 'بَقَرَة', 'غَنَم'] },
      { image: '🐑', arabic: 'غَنَم',     latin: 'ghanam',     id: 'Domba',        distractors: ['مَاعِز', 'بَقَرَة', 'جَمَل'] },
      { image: '🐎', arabic: 'حِصَان',    latin: 'hisan',      id: 'Kuda',         distractors: ['حِمَار', 'جَمَل', 'بَقَرَة'] },
      { image: '🐈', arabic: 'قِطَّة',     latin: 'qittah',     id: 'Kucing',       distractors: ['كَلْب', 'فَأْر', 'أَرْنَب'] },
      { image: '🐦', arabic: 'طَائِر',    latin: 'taa\'ir',    id: 'Burung',       distractors: ['نَحْلَة', 'فَرَاشَة', 'سَمَك'] },
      { image: '🐟', arabic: 'سَمَك',     latin: 'samak',      id: 'Ikan',         distractors: ['طَائِر', 'دَجَاج', 'لَحْم'] },
      { image: '☀️', arabic: 'شَمْس',     latin: 'shams',      id: 'Matahari',     distractors: ['قَمَر', 'نَجْم', 'سَحَاب'] },
      { image: '🌙', arabic: 'قَمَر',     latin: 'qamar',      id: 'Bulan',        distractors: ['شَمْس', 'نَجْم', 'سَمَاء'] },
      { image: '⭐', arabic: 'نَجْم',     latin: 'najm',       id: 'Bintang',      distractors: ['قَمَر', 'شَمْس', 'سَحَاب'] },
      { image: '🏜️', arabic: 'صَحْرَاء',  latin: 'sahra\'',    id: 'Padang Pasir', distractors: ['جَبَل', 'بَحْر', 'وَادِي'] },
    ],
  },
  {
    id: 'benda',
    title: 'Benda Sehari-hari',
    description: 'Barang & alat yang sering dipakai',
    emoji: '📿',
    color: '#7a3d2a',
    bgGradient: 'linear-gradient(135deg, #7a3d2a, #8b4a2a)',
    xpReward: 55,
    items: [
      { image: '📖', arabic: 'كِتَاب',    latin: 'kitab',      id: 'Buku',         distractors: ['قَلَم', 'وَرَقَة', 'دَفْتَر'] },
      { image: '✏️', arabic: 'قَلَم',     latin: 'qalam',      id: 'Pena',         distractors: ['كِتَاب', 'وَرَقَة', 'مِسْطَرَة'] },
      { image: '📱', arabic: 'جَوَّال',   latin: 'jawwal',     id: 'HP',           distractors: ['حَاسُوب', 'سَاعَة', 'مِفْتَاح'] },
      { image: '💻', arabic: 'حَاسُوب',   latin: 'hasub',      id: 'Komputer',     distractors: ['جَوَّال', 'تِلْفِزْيُون', 'رَادِيُو'] },
      { image: '🔑', arabic: 'مِفْتَاح',  latin: 'miftah',     id: 'Kunci',        distractors: ['قُفْل', 'بَاب', 'سَاعَة'] },
      { image: '🚪', arabic: 'بَاب',      latin: 'bab',        id: 'Pintu',        distractors: ['نَافِذَة', 'حَائِط', 'سَقْف'] },
      { image: '🪑', arabic: 'كُرْسِي',   latin: 'kursi',      id: 'Kursi',        distractors: ['طَاوِلَة', 'سَرِير', 'خِزَانَة'] },
      { image: '🕰️', arabic: 'سَاعَة',   latin: 'sa\'a',      id: 'Jam',          distractors: ['مِفْتَاح', 'جَوَّال', 'قَلَم'] },
      { image: '💰', arabic: 'مَال',      latin: 'mal',        id: 'Uang',         distractors: ['كَنْز', 'ذَهَب', 'فِضَّة'] },
      { image: '📿', arabic: 'مِسْبَحَة', latin: 'misbahah',   id: 'Tasbih',       distractors: ['سَجَّادَة', 'كِتَاب', 'مِفْتَاح'] },
    ],
  },
  {
    id: 'pakaian-umrah',
    title: 'Pakaian & Umrah',
    description: 'Pakaian umrah & aksesoris ibadah',
    emoji: '🧕',
    color: '#8b6b3d',
    bgGradient: 'linear-gradient(135deg, #8b6b3d, #a87f47)',
    xpReward: 60,
    items: [
      { image: '🧕', arabic: 'حِجَاب',     latin: 'hijab',       id: 'Jilbab',         distractors: ['قَمِيص', 'ثَوْب', 'إِزَار'] },
      { image: '👔', arabic: 'قَمِيص',     latin: 'qamis',       id: 'Baju',           distractors: ['ثَوْب', 'حِجَاب', 'سِرْوَال'] },
      { image: '🧣', arabic: 'إِحْرَام',   latin: 'ihram',       id: 'Kain Ihram',     distractors: ['ثَوْب', 'حِجَاب', 'عِمَامَة'] },
      { image: '👞', arabic: 'حِذَاء',     latin: 'hidha\'',     id: 'Sepatu',         distractors: ['شُرَّاب', 'صَنْدَل', 'حِزَام'] },
      { image: '🧦', arabic: 'شُرَّاب',    latin: 'shurrab',     id: 'Kaos Kaki',      distractors: ['حِذَاء', 'حِزَام', 'قُبَّعَة'] },
      { image: '🎩', arabic: 'قُبَّعَة',   latin: 'qubba\'a',    id: 'Topi',           distractors: ['عِمَامَة', 'إِحْرَام', 'حِجَاب'] },
      { image: '💎', arabic: 'سَجَّادَة',  latin: 'sajjadah',    id: 'Sajadah',        distractors: ['مِسْبَحَة', 'مُصْحَف', 'إِبْرِيق'] },
      { image: '📗', arabic: 'مُصْحَف',    latin: 'mushaf',      id: 'Mushaf Quran',   distractors: ['كِتَاب', 'دُعَاء', 'حَدِيث'] },
      { image: '🤲', arabic: 'دُعَاء',     latin: 'du\'a',       id: 'Doa',            distractors: ['ذِكْر', 'تَسْبِيح', 'صَلَاة'] },
      { image: '🕋', arabic: 'طَوَاف',     latin: 'tawaf',       id: 'Tawaf',          distractors: ['سَعْي', 'وُقُوف', 'مَبِيت'] },
    ],
  },
];

export function getTebakGambarLevel(id) {
  return TEBAK_GAMBAR_LEVELS.find((l) => l.id === id);
}

/**
 * Generate question round — pick N random items, shuffle choices.
 */
export function generateQuestions(levelId, count = 10) {
  const level = getTebakGambarLevel(levelId);
  if (!level) return [];
  // Shuffle items, take all (or count if more items)
  const items = [...level.items].sort(() => Math.random() - 0.5).slice(0, count);
  return items.map((item) => {
    const choices = [item.arabic, ...item.distractors];
    // Fisher-Yates shuffle
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return { ...item, choices };
  });
}
