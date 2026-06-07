// data/tebak-gambar-levels.js
// 10 kategori × 20 item = 200 vocab visual quiz.
//
// Dual-mode image:
//   - image: emoji (fallback, untuk visual cepat tanpa asset)
//   - imageUrl: URL gambar AI-generated (DALL-E 3 → Firebase Storage).
//     Disimpan terpisah di `tebak-gambar-urls.json` (auto-merged saat load).
//     Selama URL belum ada, frontend pakai emoji.

import { TEBAK_GAMBAR_URLS } from './tebak-gambar-urls.js';

// Jumlah soal per ronde — sampling 10 random dari 20 item kategori.
// Setiap kali main beda, replayable & nggak overwhelming.
export const QUESTIONS_PER_ROUND = 10;

export function getTebakGambarLevel(id) {
  return TEBAK_GAMBAR_LEVELS.find((l) => l.id === id) || null;
}

// Generate questions: sample `count` items random, shuffle choice order.
export function generateQuestions(levelId, count = QUESTIONS_PER_ROUND) {
  const level = getTebakGambarLevel(levelId);
  if (!level) return [];
  const items = [...level.items].sort(() => Math.random() - 0.5).slice(0, count);
  return items.map((item) => {
    const choices = [item.arabic, ...item.distractors];
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return { ...item, choices };
  });
}

export const TEBAK_GAMBAR_LEVELS = [
  // ============================================================
  // 1) MAKANAN & BUAH (20 item)
  // ============================================================
  {
    id: 'makanan',
    title: 'Makanan & Buah',
    description: 'Vocab makanan & minuman sehari-hari',
    emoji: '🍎',
    color: '#a05536',
    bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
    xpReward: 50,
    items: [
      { image: '🍞', imageUrl: null, arabic: 'خُبْز', latin: 'khubz', id: 'Roti', distractors: ['تَمْر', 'مَاء', 'لَبَن'] },
      { image: '🌰', imageUrl: null, arabic: 'تَمْر', latin: 'tamr', id: 'Kurma', distractors: ['زَبِيب', 'تِين', 'لَوْز'] },
      { image: '🥛', imageUrl: null, arabic: 'لَبَن', latin: 'laban', id: 'Susu', distractors: ['عَصِير', 'مَاء', 'قَهْوَة'] },
      { image: '💧', imageUrl: null, arabic: 'مَاء', latin: 'maa\'', id: 'Air', distractors: ['شَاي', 'حَلِيب', 'عَسَل'] },
      { image: '☕', imageUrl: null, arabic: 'قَهْوَة', latin: 'qahwa', id: 'Kopi', distractors: ['شَاي', 'مَاء', 'عَصِير'] },
      { image: '🍵', imageUrl: null, arabic: 'شَاي', latin: 'shay', id: 'Teh', distractors: ['قَهْوَة', 'مَاء', 'حَلِيب'] },
      { image: '🍎', imageUrl: null, arabic: 'تُفَّاح', latin: 'tuffah', id: 'Apel', distractors: ['بُرْتُقَال', 'مَوْز', 'عِنَب'] },
      { image: '🍊', imageUrl: null, arabic: 'بُرْتُقَال', latin: 'burtuqal', id: 'Jeruk', distractors: ['تُفَّاح', 'لَيْمُون', 'مَوْز'] },
      { image: '🍌', imageUrl: null, arabic: 'مَوْز', latin: 'mawz', id: 'Pisang', distractors: ['تُفَّاح', 'عِنَب', 'فَرَاوْلَة'] },
      { image: '🍇', imageUrl: null, arabic: 'عِنَب', latin: '\'inab', id: 'Anggur', distractors: ['تُفَّاح', 'تِين', 'فَرَاوْلَة'] },
      { image: '🍚', imageUrl: null, arabic: 'أَرُزّ', latin: 'aruzz', id: 'Nasi', distractors: ['خُبْز', 'مَكَرُونَة', 'بُرْغُل'] },
      { image: '🍗', imageUrl: null, arabic: 'دَجَاج', latin: 'dajaj', id: 'Ayam', distractors: ['لَحْم', 'سَمَك', 'بَطّ'] },
      { image: '🥩', imageUrl: null, arabic: 'لَحْم', latin: 'lahm', id: 'Daging', distractors: ['دَجَاج', 'سَمَك', 'كَبِد'] },
      { image: '🥚', imageUrl: null, arabic: 'بَيْض', latin: 'bayd', id: 'Telur', distractors: ['جُبْن', 'زُبْدَة', 'حَلِيب'] },
      { image: '🧀', imageUrl: null, arabic: 'جُبْن', latin: 'jubn', id: 'Keju', distractors: ['زُبْدَة', 'لَبَن', 'بَيْض'] },
      { image: '🍯', imageUrl: null, arabic: 'عَسَل', latin: '\'asal', id: 'Madu', distractors: ['سُكَّر', 'مُرَبَّى', 'دِبْس'] },
      { image: '🍰', imageUrl: null, arabic: 'كَعْك', latin: 'ka\'k', id: 'Kue', distractors: ['حَلْوَى', 'بِسْكُوِيت', 'بَقْلَاوَة'] },
      { image: '🥗', imageUrl: null, arabic: 'سَلَطَة', latin: 'salata', id: 'Salad', distractors: ['شُورْبَة', 'وَجْبَة', 'مَزَّة'] },
      { image: '🍲', imageUrl: null, arabic: 'شُورْبَة', latin: 'shurba', id: 'Sup', distractors: ['سَلَطَة', 'مَرَق', 'يَخْنَة'] },
      { image: '🍽️', imageUrl: null, arabic: 'طَعَام', latin: 'ta\'am', id: 'Makanan', distractors: ['شَرَاب', 'وَجْبَة', 'مَائِدَة'] },
    ],
  },

  // ============================================================
  // 2) TEMPAT & BANGUNAN (20)
  // ============================================================
  {
    id: 'tempat',
    title: 'Tempat & Bangunan',
    description: 'Lokasi & tempat penting saat di Saudi',
    emoji: '🕌',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    xpReward: 60,
    items: [
      { image: '🕋', imageUrl: null, arabic: 'الْكَعْبَة', latin: 'al-ka\'ba', id: 'Ka\'bah', distractors: ['الْمَدِينَة', 'مَكَّة', 'مِنَى'] },
      { image: '🕌', imageUrl: null, arabic: 'مَسْجِد', latin: 'masjid', id: 'Masjid', distractors: ['مَدْرَسَة', 'مَطْعَم', 'فُنْدُق'] },
      { image: '🏨', imageUrl: null, arabic: 'فُنْدُق', latin: 'funduq', id: 'Hotel', distractors: ['بَيْت', 'مَسْجِد', 'سُوق'] },
      { image: '🏪', imageUrl: null, arabic: 'سُوق', latin: 'suq', id: 'Pasar', distractors: ['مَطْعَم', 'مَدْرَسَة', 'فُنْدُق'] },
      { image: '🍽️', imageUrl: null, arabic: 'مَطْعَم', latin: 'mat\'am', id: 'Restoran', distractors: ['فُنْدُق', 'مَكْتَبَة', 'مُسْتَشْفَى'] },
      { image: '🏥', imageUrl: null, arabic: 'مُسْتَشْفَى', latin: 'mustashfa', id: 'Rumah Sakit', distractors: ['مَدْرَسَة', 'مَطَار', 'بَنْك'] },
      { image: '✈️', imageUrl: null, arabic: 'مَطَار', latin: 'matar', id: 'Bandara', distractors: ['مَحَطَّة', 'مَرْفَأ', 'سَاحَة'] },
      { image: '🏠', imageUrl: null, arabic: 'بَيْت', latin: 'bayt', id: 'Rumah', distractors: ['بَنْت', 'بَاب', 'كَلْب'] },
      { image: '🏫', imageUrl: null, arabic: 'مَدْرَسَة', latin: 'madrasa', id: 'Sekolah', distractors: ['جَامِعَة', 'مَكْتَبَة', 'مُسْتَشْفَى'] },
      { image: '🏛️', imageUrl: null, arabic: 'الْمَدِينَة', latin: 'al-madina', id: 'Kota Madinah', distractors: ['مَكَّة', 'الرِّيَاض', 'جَدَّة'] },
      { image: '🏦', imageUrl: null, arabic: 'بَنْك', latin: 'bank', id: 'Bank', distractors: ['مَطْعَم', 'فُنْدُق', 'مَكْتَب'] },
      { image: '⛲', imageUrl: null, arabic: 'نَافُورَة', latin: 'nafura', id: 'Air Mancur', distractors: ['بِئْر', 'حَمَّام', 'حَدِيقَة'] },
      { image: '🌳', imageUrl: null, arabic: 'حَدِيقَة', latin: 'hadiqa', id: 'Taman', distractors: ['غَابَة', 'شَارِع', 'بُسْتَان'] },
      { image: '🛣️', imageUrl: null, arabic: 'شَارِع', latin: 'shari\'', id: 'Jalan Raya', distractors: ['طَرِيق', 'جِسْر', 'حَارَة'] },
      { image: '🌉', imageUrl: null, arabic: 'جِسْر', latin: 'jisr', id: 'Jembatan', distractors: ['نَفَق', 'بَوَّابَة', 'بُرْج'] },
      { image: '🗼', imageUrl: null, arabic: 'بُرْج', latin: 'burj', id: 'Menara', distractors: ['قَلْعَة', 'قَصْر', 'مِئْذَنَة'] },
      { image: '🏰', imageUrl: null, arabic: 'قَصْر', latin: 'qasr', id: 'Istana', distractors: ['قَلْعَة', 'بَيْت', 'فُنْدُق'] },
      { image: '🏟️', imageUrl: null, arabic: 'مَلْعَب', latin: 'mal\'ab', id: 'Stadion', distractors: ['مَدْرَسَة', 'حَدِيقَة', 'سَاحَة'] },
      { image: '🏤', imageUrl: null, arabic: 'مَكْتَب الْبَرِيد', latin: 'maktab al-barid', id: 'Kantor Pos', distractors: ['بَنْك', 'مَكْتَبَة', 'مَطْعَم'] },
      { image: '⛺', imageUrl: null, arabic: 'خَيْمَة', latin: 'khayma', id: 'Tenda', distractors: ['بَيْت', 'قُبَّة', 'مَأْوَى'] },
    ],
  },

  // ============================================================
  // 3) HEWAN & ALAM (20)
  // ============================================================
  {
    id: 'hewan-alam',
    title: 'Hewan & Alam',
    description: 'Binatang & elemen alam',
    emoji: '🐪',
    color: '#c9a961',
    bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    xpReward: 55,
    items: [
      { image: '🐪', imageUrl: null, arabic: 'جَمَل', latin: 'jamal', id: 'Unta', distractors: ['حِصَان', 'بَقَرَة', 'غَنَم'] },
      { image: '🐑', imageUrl: null, arabic: 'غَنَم', latin: 'ghanam', id: 'Domba', distractors: ['مَاعِز', 'بَقَرَة', 'جَمَل'] },
      { image: '🐎', imageUrl: null, arabic: 'حِصَان', latin: 'hisan', id: 'Kuda', distractors: ['حِمَار', 'جَمَل', 'بَقَرَة'] },
      { image: '🐈', imageUrl: null, arabic: 'قِطَّة', latin: 'qittah', id: 'Kucing', distractors: ['كَلْب', 'فَأْر', 'أَرْنَب'] },
      { image: '🐦', imageUrl: null, arabic: 'طَائِر', latin: 'taa\'ir', id: 'Burung', distractors: ['نَحْلَة', 'فَرَاشَة', 'سَمَك'] },
      { image: '🐟', imageUrl: null, arabic: 'سَمَك', latin: 'samak', id: 'Ikan', distractors: ['طَائِر', 'دَجَاج', 'لَحْم'] },
      { image: '☀️', imageUrl: null, arabic: 'شَمْس', latin: 'shams', id: 'Matahari', distractors: ['قَمَر', 'نَجْم', 'سَحَاب'] },
      { image: '🌙', imageUrl: null, arabic: 'قَمَر', latin: 'qamar', id: 'Bulan', distractors: ['شَمْس', 'نَجْم', 'سَمَاء'] },
      { image: '⭐', imageUrl: null, arabic: 'نَجْم', latin: 'najm', id: 'Bintang', distractors: ['قَمَر', 'شَمْس', 'سَحَاب'] },
      { image: '🏜️', imageUrl: null, arabic: 'صَحْرَاء', latin: 'sahra\'', id: 'Padang Pasir', distractors: ['جَبَل', 'بَحْر', 'وَادِي'] },
      { image: '🐕', imageUrl: null, arabic: 'كَلْب', latin: 'kalb', id: 'Anjing', distractors: ['قِطَّة', 'أَسَد', 'ذِئْب'] },
      { image: '🦁', imageUrl: null, arabic: 'أَسَد', latin: 'asad', id: 'Singa', distractors: ['نَمِر', 'ذِئْب', 'دُبّ'] },
      { image: '🐘', imageUrl: null, arabic: 'فِيل', latin: 'fil', id: 'Gajah', distractors: ['جَمَل', 'حِصَان', 'وَحِيد الْقَرْن'] },
      { image: '🐝', imageUrl: null, arabic: 'نَحْلَة', latin: 'nahla', id: 'Lebah', distractors: ['فَرَاشَة', 'ذُبَابَة', 'نَمْلَة'] },
      { image: '🦋', imageUrl: null, arabic: 'فَرَاشَة', latin: 'farasha', id: 'Kupu-kupu', distractors: ['نَحْلَة', 'طَائِر', 'يَعْسُوب'] },
      { image: '🌳', imageUrl: null, arabic: 'شَجَرَة', latin: 'shajara', id: 'Pohon', distractors: ['زَهْرَة', 'وَرَقَة', 'غُصْن'] },
      { image: '🌹', imageUrl: null, arabic: 'وَرْدَة', latin: 'warda', id: 'Mawar', distractors: ['زَهْرَة', 'شَجَرَة', 'يَاسَمِين'] },
      { image: '⛰️', imageUrl: null, arabic: 'جَبَل', latin: 'jabal', id: 'Gunung', distractors: ['تَلّ', 'وَادِي', 'صَحْرَاء'] },
      { image: '🌊', imageUrl: null, arabic: 'بَحْر', latin: 'bahr', id: 'Laut', distractors: ['نَهْر', 'بُحَيْرَة', 'مُحِيط'] },
      { image: '🏞️', imageUrl: null, arabic: 'نَهْر', latin: 'nahr', id: 'Sungai', distractors: ['بَحْر', 'بُحَيْرَة', 'وَادِي'] },
    ],
  },

  // ============================================================
  // 4) BENDA SEHARI-HARI (20)
  // ============================================================
  {
    id: 'benda',
    title: 'Benda Sehari-hari',
    description: 'Barang & alat yang sering dipakai',
    emoji: '📿',
    color: '#7a3d2a',
    bgGradient: 'linear-gradient(135deg, #7a3d2a, #8b4a2a)',
    xpReward: 55,
    items: [
      { image: '📖', imageUrl: null, arabic: 'كِتَاب', latin: 'kitab', id: 'Buku', distractors: ['قَلَم', 'وَرَقَة', 'دَفْتَر'] },
      { image: '✏️', imageUrl: null, arabic: 'قَلَم', latin: 'qalam', id: 'Pena', distractors: ['كِتَاب', 'وَرَقَة', 'مِسْطَرَة'] },
      { image: '📱', imageUrl: null, arabic: 'هَاتِف', latin: 'hatif', id: 'Telepon', distractors: ['حَاسُوب', 'تِلْفَاز', 'كَامِيرَا'] },
      { image: '💻', imageUrl: null, arabic: 'حَاسُوب', latin: 'hasub', id: 'Komputer', distractors: ['هَاتِف', 'لَوْحَة', 'تِلْفَاز'] },
      { image: '🕰️', imageUrl: null, arabic: 'سَاعَة', latin: 'sa\'a', id: 'Jam', distractors: ['مِنَبِّه', 'تَقْوِيم', 'مِيزَان'] },
      { image: '🔑', imageUrl: null, arabic: 'مِفْتَاح', latin: 'miftah', id: 'Kunci', distractors: ['قُفْل', 'بَاب', 'حَقِيبَة'] },
      { image: '🎒', imageUrl: null, arabic: 'حَقِيبَة', latin: 'haqiba', id: 'Tas', distractors: ['كِيس', 'صُنْدُوق', 'حَافِظَة'] },
      { image: '💰', imageUrl: null, arabic: 'مَال', latin: 'mal', id: 'Uang', distractors: ['نُقُود', 'دَرَاهِم', 'كَنْز'] },
      { image: '👓', imageUrl: null, arabic: 'نَظَّارَة', latin: 'nazzara', id: 'Kacamata', distractors: ['عَدَسَة', 'مِجْهَر', 'مِرْآة'] },
      { image: '🪞', imageUrl: null, arabic: 'مِرْآة', latin: 'mir\'ah', id: 'Cermin', distractors: ['نَظَّارَة', 'لَوْحَة', 'صُورَة'] },
      { image: '🪑', imageUrl: null, arabic: 'كُرْسِيّ', latin: 'kursi', id: 'Kursi', distractors: ['طَاوِلَة', 'سَرِير', 'أَرِيكَة'] },
      { image: '🛏️', imageUrl: null, arabic: 'سَرِير', latin: 'sarir', id: 'Tempat Tidur', distractors: ['كُرْسِيّ', 'وِسَادَة', 'بِسَاط'] },
      { image: '🗄️', imageUrl: null, arabic: 'خِزَانَة', latin: 'khizana', id: 'Lemari', distractors: ['دُرْج', 'صُنْدُوق', 'رَفّ'] },
      { image: '🚪', imageUrl: null, arabic: 'بَاب', latin: 'bab', id: 'Pintu', distractors: ['نَافِذَة', 'جِدَار', 'سَقْف'] },
      { image: '🪟', imageUrl: null, arabic: 'نَافِذَة', latin: 'nafidha', id: 'Jendela', distractors: ['بَاب', 'جِدَار', 'سِتَارَة'] },
      { image: '💡', imageUrl: null, arabic: 'مِصْبَاح', latin: 'misbah', id: 'Lampu', distractors: ['شَمْعَة', 'كَهْرَبَاء', 'نُور'] },
      { image: '🍴', imageUrl: null, arabic: 'شَوْكَة', latin: 'shawka', id: 'Garpu', distractors: ['مِلْعَقَة', 'سِكِّين', 'صَحْن'] },
      { image: '🥄', imageUrl: null, arabic: 'مِلْعَقَة', latin: 'mil\'aqa', id: 'Sendok', distractors: ['شَوْكَة', 'سِكِّين', 'كُوب'] },
      { image: '🔪', imageUrl: null, arabic: 'سِكِّين', latin: 'sikkin', id: 'Pisau', distractors: ['شَوْكَة', 'مِقَصّ', 'مِنْشَار'] },
      { image: '🧴', imageUrl: null, arabic: 'صَابُون', latin: 'sabun', id: 'Sabun', distractors: ['شَامْبُو', 'عِطْر', 'مَعْجُون'] },
    ],
  },

  // ============================================================
  // 5) PAKAIAN & UMRAH (20)
  // ============================================================
  {
    id: 'pakaian-umrah',
    title: 'Pakaian & Umrah',
    description: 'Pakaian & atribut ibadah',
    emoji: '👳',
    color: '#8b6b3d',
    bgGradient: 'linear-gradient(135deg, #8b6b3d, #a08555)',
    xpReward: 60,
    items: [
      { image: '🧕', imageUrl: null, arabic: 'حِجَاب', latin: 'hijab', id: 'Hijab', distractors: ['نِقَاب', 'خِمَار', 'عَبَاءَة'] },
      { image: '👗', imageUrl: null, arabic: 'فُسْتَان', latin: 'fustan', id: 'Gaun', distractors: ['عَبَاءَة', 'تَنُّورَة', 'بَلُوزَة'] },
      { image: '🧥', imageUrl: null, arabic: 'مِعْطَف', latin: 'mi\'taf', id: 'Mantel', distractors: ['سُتْرَة', 'قَمِيص', 'بَنْطَلُون'] },
      { image: '👔', imageUrl: null, arabic: 'قَمِيص', latin: 'qamis', id: 'Kemeja', distractors: ['تِي شِيرت', 'بَلُوزَة', 'بَدْلَة'] },
      { image: '👖', imageUrl: null, arabic: 'بَنْطَلُون', latin: 'bantalun', id: 'Celana', distractors: ['تَنُّورَة', 'سَرَاوِيل', 'ثَوْب'] },
      { image: '👞', imageUrl: null, arabic: 'حِذَاء', latin: 'hidha\'', id: 'Sepatu', distractors: ['صَنْدَل', 'جُورَب', 'نَعْل'] },
      { image: '🧦', imageUrl: null, arabic: 'جَوْرَب', latin: 'jawrab', id: 'Kaus Kaki', distractors: ['حِذَاء', 'صَنْدَل', 'قُفَّاز'] },
      { image: '🧢', imageUrl: null, arabic: 'قُبَّعَة', latin: 'qubba\'a', id: 'Topi', distractors: ['عِمَامَة', 'طَاقِيَّة', 'حِجَاب'] },
      { image: '📿', imageUrl: null, arabic: 'سُبْحَة', latin: 'subha', id: 'Tasbih', distractors: ['سَجَّادَة', 'مُصْحَف', 'عِقْد'] },
      { image: '🕋', imageUrl: null, arabic: 'الْكَعْبَة', latin: 'al-ka\'ba', id: 'Ka\'bah', distractors: ['الْحَجَر الْأَسْوَد', 'الْمَسْجِد', 'الْحَرَم'] },
      { image: '🧎', imageUrl: null, arabic: 'سُجُود', latin: 'sujud', id: 'Sujud', distractors: ['رُكُوع', 'صَلَاة', 'تَكْبِير'] },
      { image: '🤲', imageUrl: null, arabic: 'دُعَاء', latin: 'du\'a', id: 'Doa', distractors: ['صَلَاة', 'ذِكْر', 'تَوْبَة'] },
      { image: '📖', imageUrl: null, arabic: 'مُصْحَف', latin: 'mushaf', id: 'Mushaf', distractors: ['قُرْآن', 'كِتَاب', 'تَفْسِير'] },
      { image: '🕌', imageUrl: null, arabic: 'مِئْذَنَة', latin: 'mi\'dhana', id: 'Menara Masjid', distractors: ['قُبَّة', 'مِحْرَاب', 'مِنْبَر'] },
      { image: '💧', imageUrl: null, arabic: 'وُضُوء', latin: 'wudu\'', id: 'Wudhu', distractors: ['غُسْل', 'تَيَمُّم', 'طَهَارَة'] },
      { image: '⏰', imageUrl: null, arabic: 'أَذَان', latin: 'adhan', id: 'Adzan', distractors: ['إِقَامَة', 'تَكْبِير', 'صَلَاة'] },
      { image: '🌒', imageUrl: null, arabic: 'هِلَال', latin: 'hilal', id: 'Bulan Sabit', distractors: ['قَمَر', 'بَدْر', 'نَجْم'] },
      { image: '🎁', imageUrl: null, arabic: 'هَدِيَّة', latin: 'hadiya', id: 'Hadiah', distractors: ['تِذْكَار', 'صَدَقَة', 'هِبَة'] },
      { image: '👰', imageUrl: null, arabic: 'عَرُوس', latin: '\'arus', id: 'Pengantin Pr', distractors: ['عَرِيس', 'زَوْجَة', 'بِنْت'] },
      { image: '🤵', imageUrl: null, arabic: 'عَرِيس', latin: '\'aris', id: 'Pengantin Lk', distractors: ['عَرُوس', 'زَوْج', 'وَلَد'] },
    ],
  },

  // ============================================================
  // 6) ANGGOTA TUBUH (20) — BARU
  // ============================================================
  {
    id: 'tubuh',
    title: 'Anggota Tubuh',
    description: 'Bagian tubuh manusia',
    emoji: '👤',
    color: '#a05536',
    bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
    xpReward: 55,
    items: [
      { image: '👁️', imageUrl: null, arabic: 'عَيْن', latin: '\'ayn', id: 'Mata', distractors: ['أُذُن', 'أَنْف', 'فَم'] },
      { image: '👂', imageUrl: null, arabic: 'أُذُن', latin: 'udhun', id: 'Telinga', distractors: ['عَيْن', 'أَنْف', 'وَجْه'] },
      { image: '👃', imageUrl: null, arabic: 'أَنْف', latin: 'anf', id: 'Hidung', distractors: ['أُذُن', 'فَم', 'وَجْه'] },
      { image: '👄', imageUrl: null, arabic: 'فَم', latin: 'fam', id: 'Mulut', distractors: ['أَنْف', 'لِسَان', 'شَفَة'] },
      { image: '🦷', imageUrl: null, arabic: 'سِنّ', latin: 'sinn', id: 'Gigi', distractors: ['لِسَان', 'شَفَة', 'فَكّ'] },
      { image: '👅', imageUrl: null, arabic: 'لِسَان', latin: 'lisan', id: 'Lidah', distractors: ['شَفَة', 'سِنّ', 'فَم'] },
      { image: '🧠', imageUrl: null, arabic: 'دِمَاغ', latin: 'dimagh', id: 'Otak', distractors: ['قَلْب', 'رِئَة', 'كَبِد'] },
      { image: '❤️', imageUrl: null, arabic: 'قَلْب', latin: 'qalb', id: 'Jantung', distractors: ['رِئَة', 'كَبِد', 'مَعِدَة'] },
      { image: '🫀', imageUrl: null, arabic: 'كَبِد', latin: 'kabid', id: 'Hati', distractors: ['قَلْب', 'كُلْيَة', 'مَعِدَة'] },
      { image: '✋', imageUrl: null, arabic: 'يَد', latin: 'yad', id: 'Tangan', distractors: ['ذِرَاع', 'إِصْبَع', 'كَفّ'] },
      { image: '👆', imageUrl: null, arabic: 'إِصْبَع', latin: 'isba\'', id: 'Jari', distractors: ['يَد', 'كَفّ', 'ظُفْر'] },
      { image: '🦵', imageUrl: null, arabic: 'رِجْل', latin: 'rijl', id: 'Kaki', distractors: ['قَدَم', 'سَاق', 'فَخْذ'] },
      { image: '🦶', imageUrl: null, arabic: 'قَدَم', latin: 'qadam', id: 'Telapak Kaki', distractors: ['رِجْل', 'سَاق', 'كَعْب'] },
      { image: '🦴', imageUrl: null, arabic: 'عَظْم', latin: '\'azm', id: 'Tulang', distractors: ['عَضَل', 'جِلْد', 'دَم'] },
      { image: '🩸', imageUrl: null, arabic: 'دَم', latin: 'dam', id: 'Darah', distractors: ['مَاء', 'عَرَق', 'دَمْع'] },
      { image: '💆', imageUrl: null, arabic: 'رَأْس', latin: 'ra\'s', id: 'Kepala', distractors: ['وَجْه', 'رَقَبَة', 'كَتِف'] },
      { image: '😀', imageUrl: null, arabic: 'وَجْه', latin: 'wajh', id: 'Wajah', distractors: ['رَأْس', 'بَشَرَة', 'خَدّ'] },
      { image: '💇', imageUrl: null, arabic: 'شَعْر', latin: 'sha\'r', id: 'Rambut', distractors: ['لِحْيَة', 'حَاجِب', 'رَمْش'] },
      { image: '🧔', imageUrl: null, arabic: 'لِحْيَة', latin: 'lihya', id: 'Jenggot', distractors: ['شَارِب', 'شَعْر', 'حَاجِب'] },
      { image: '🤲', imageUrl: null, arabic: 'كَفّ', latin: 'kaff', id: 'Telapak Tangan', distractors: ['يَد', 'إِصْبَع', 'ذِرَاع'] },
    ],
  },

  // ============================================================
  // 7) TRANSPORTASI (20) — BARU
  // ============================================================
  {
    id: 'transportasi',
    title: 'Transportasi',
    description: 'Kendaraan & alat transportasi',
    emoji: '🚗',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    xpReward: 55,
    items: [
      { image: '🚗', imageUrl: null, arabic: 'سَيَّارَة', latin: 'sayyara', id: 'Mobil', distractors: ['حَافِلَة', 'دَرَّاجَة', 'شَاحِنَة'] },
      { image: '🚌', imageUrl: null, arabic: 'حَافِلَة', latin: 'hafila', id: 'Bus', distractors: ['سَيَّارَة', 'قِطَار', 'شَاحِنَة'] },
      { image: '🚕', imageUrl: null, arabic: 'سَيَّارَة أُجْرَة', latin: 'sayyarat ujra', id: 'Taksi', distractors: ['حَافِلَة', 'دَرَّاجَة', 'سَيَّارَة'] },
      { image: '🚲', imageUrl: null, arabic: 'دَرَّاجَة', latin: 'darraja', id: 'Sepeda', distractors: ['دَرَّاجَة نَارِيَّة', 'سَيَّارَة', 'عَرَبَة'] },
      { image: '🏍️', imageUrl: null, arabic: 'دَرَّاجَة نَارِيَّة', latin: 'darraja nariyya', id: 'Motor', distractors: ['دَرَّاجَة', 'سَيَّارَة', 'حَافِلَة'] },
      { image: '🚂', imageUrl: null, arabic: 'قِطَار', latin: 'qitar', id: 'Kereta Api', distractors: ['حَافِلَة', 'مِتْرُو', 'تَرَام'] },
      { image: '🚇', imageUrl: null, arabic: 'مِتْرُو', latin: 'mitru', id: 'Kereta Bawah Tanah', distractors: ['قِطَار', 'حَافِلَة', 'تَرَام'] },
      { image: '✈️', imageUrl: null, arabic: 'طَائِرَة', latin: 'ta\'ira', id: 'Pesawat', distractors: ['مِرْوَحِيَّة', 'صَارُوخ', 'مَرْكَبَة فَضَائِيَّة'] },
      { image: '🚁', imageUrl: null, arabic: 'مِرْوَحِيَّة', latin: 'mirwahiyya', id: 'Helikopter', distractors: ['طَائِرَة', 'صَارُوخ', 'مِنْطَاد'] },
      { image: '🚢', imageUrl: null, arabic: 'سَفِينَة', latin: 'safina', id: 'Kapal', distractors: ['قَارِب', 'يَخْت', 'غَوَّاصَة'] },
      { image: '⛵', imageUrl: null, arabic: 'قَارِب', latin: 'qarib', id: 'Perahu', distractors: ['سَفِينَة', 'يَخْت', 'زَوْرَق'] },
      { image: '🚤', imageUrl: null, arabic: 'يَخْت', latin: 'yakht', id: 'Yacht', distractors: ['قَارِب', 'سَفِينَة', 'زَوْرَق'] },
      { image: '🚚', imageUrl: null, arabic: 'شَاحِنَة', latin: 'shahina', id: 'Truk', distractors: ['حَافِلَة', 'سَيَّارَة', 'عَرَبَة'] },
      { image: '🚓', imageUrl: null, arabic: 'سَيَّارَة شُرْطَة', latin: 'sayyarat shurta', id: 'Mobil Polisi', distractors: ['سَيَّارَة إِسْعَاف', 'سَيَّارَة إِطْفَاء', 'حَافِلَة'] },
      { image: '🚑', imageUrl: null, arabic: 'سَيَّارَة إِسْعَاف', latin: 'sayyarat is\'af', id: 'Ambulans', distractors: ['سَيَّارَة شُرْطَة', 'سَيَّارَة إِطْفَاء', 'سَيَّارَة'] },
      { image: '🚒', imageUrl: null, arabic: 'سَيَّارَة إِطْفَاء', latin: 'sayyarat itfa\'', id: 'Mobil Pemadam', distractors: ['سَيَّارَة إِسْعَاف', 'سَيَّارَة شُرْطَة', 'شَاحِنَة'] },
      { image: '🛴', imageUrl: null, arabic: 'سْكُوتَر', latin: 'skutar', id: 'Skuter', distractors: ['دَرَّاجَة', 'دَرَّاجَة نَارِيَّة', 'لَوْح تَزَلُّج'] },
      { image: '🐎', imageUrl: null, arabic: 'حِصَان', latin: 'hisan', id: 'Kuda (tunggangan)', distractors: ['جَمَل', 'حِمَار', 'بَغْل'] },
      { image: '🐪', imageUrl: null, arabic: 'جَمَل', latin: 'jamal', id: 'Unta (tunggangan)', distractors: ['حِصَان', 'حِمَار', 'فِيل'] },
      { image: '🚀', imageUrl: null, arabic: 'صَارُوخ', latin: 'sarukh', id: 'Roket', distractors: ['طَائِرَة', 'مِرْوَحِيَّة', 'مَرْكَبَة فَضَائِيَّة'] },
    ],
  },

  // ============================================================
  // 8) CUACA & WAKTU (20) — BARU
  // ============================================================
  {
    id: 'cuaca-waktu',
    title: 'Cuaca & Waktu',
    description: 'Cuaca, musim, dan satuan waktu',
    emoji: '🌤️',
    color: '#c9a961',
    bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    xpReward: 50,
    items: [
      { image: '☀️', imageUrl: null, arabic: 'مُشْمِس', latin: 'mushmis', id: 'Cerah', distractors: ['غَائِم', 'مُمْطِر', 'بَارِد'] },
      { image: '🌧️', imageUrl: null, arabic: 'مَطَر', latin: 'matar', id: 'Hujan', distractors: ['ثَلْج', 'بَرَد', 'ضَبَاب'] },
      { image: '❄️', imageUrl: null, arabic: 'ثَلْج', latin: 'thalj', id: 'Salju', distractors: ['مَطَر', 'بَرَد', 'صَقِيع'] },
      { image: '☁️', imageUrl: null, arabic: 'سَحَاب', latin: 'sahab', id: 'Awan', distractors: ['ضَبَاب', 'سَمَاء', 'مَطَر'] },
      { image: '🌫️', imageUrl: null, arabic: 'ضَبَاب', latin: 'dabab', id: 'Kabut', distractors: ['سَحَاب', 'دُخَان', 'رِيح'] },
      { image: '⚡', imageUrl: null, arabic: 'بَرْق', latin: 'barq', id: 'Kilat', distractors: ['رَعْد', 'مَطَر', 'عَاصِفَة'] },
      { image: '🌬️', imageUrl: null, arabic: 'رِيح', latin: 'rih', id: 'Angin', distractors: ['عَاصِفَة', 'هَوَاء', 'إِعْصَار'] },
      { image: '🌈', imageUrl: null, arabic: 'قَوْس قُزَح', latin: 'qaws quzah', id: 'Pelangi', distractors: ['شَمْس', 'سَمَاء', 'سَحَاب'] },
      { image: '🌡️', imageUrl: null, arabic: 'حَرَارَة', latin: 'harara', id: 'Suhu/Panas', distractors: ['بَرْد', 'رُطُوبَة', 'جَفَاف'] },
      { image: '🥶', imageUrl: null, arabic: 'بَارِد', latin: 'barid', id: 'Dingin', distractors: ['حَارّ', 'دَافِئ', 'مُعْتَدِل'] },
      { image: '🔥', imageUrl: null, arabic: 'حَارّ', latin: 'harr', id: 'Panas', distractors: ['بَارِد', 'دَافِئ', 'مُعْتَدِل'] },
      { image: '🌅', imageUrl: null, arabic: 'صَبَاح', latin: 'sabah', id: 'Pagi', distractors: ['مَسَاء', 'لَيْل', 'ظُهْر'] },
      { image: '🌇', imageUrl: null, arabic: 'مَسَاء', latin: 'masa\'', id: 'Sore', distractors: ['صَبَاح', 'لَيْل', 'فَجْر'] },
      { image: '🌃', imageUrl: null, arabic: 'لَيْل', latin: 'layl', id: 'Malam', distractors: ['نَهَار', 'فَجْر', 'مَسَاء'] },
      { image: '🌞', imageUrl: null, arabic: 'نَهَار', latin: 'nahar', id: 'Siang', distractors: ['لَيْل', 'مَسَاء', 'صَبَاح'] },
      { image: '📅', imageUrl: null, arabic: 'يَوْم', latin: 'yawm', id: 'Hari', distractors: ['شَهْر', 'سَنَة', 'أُسْبُوع'] },
      { image: '🗓️', imageUrl: null, arabic: 'أُسْبُوع', latin: 'usbu\'', id: 'Minggu', distractors: ['شَهْر', 'يَوْم', 'سَنَة'] },
      { image: '📆', imageUrl: null, arabic: 'شَهْر', latin: 'shahr', id: 'Bulan (waktu)', distractors: ['سَنَة', 'أُسْبُوع', 'يَوْم'] },
      { image: '🎉', imageUrl: null, arabic: 'سَنَة', latin: 'sana', id: 'Tahun', distractors: ['شَهْر', 'يَوْم', 'قَرْن'] },
      { image: '⏳', imageUrl: null, arabic: 'وَقْت', latin: 'waqt', id: 'Waktu', distractors: ['سَاعَة', 'دَقِيقَة', 'لَحْظَة'] },
    ],
  },

  // ============================================================
  // 9) PROFESI (20) — BARU
  // ============================================================
  {
    id: 'profesi',
    title: 'Profesi & Pekerjaan',
    description: 'Berbagai jenis pekerjaan',
    emoji: '💼',
    color: '#7a3d2a',
    bgGradient: 'linear-gradient(135deg, #7a3d2a, #8b4a2a)',
    xpReward: 55,
    items: [
      { image: '👨‍⚕️', imageUrl: null, arabic: 'طَبِيب', latin: 'tabib', id: 'Dokter', distractors: ['مُهَنْدِس', 'مُدَرِّس', 'صَيْدَلِيّ'] },
      { image: '👨‍🏫', imageUrl: null, arabic: 'مُدَرِّس', latin: 'mudarris', id: 'Guru', distractors: ['طَبِيب', 'مُحَامٍ', 'طَالِب'] },
      { image: '👨‍💻', imageUrl: null, arabic: 'مُبَرْمِج', latin: 'mubarmij', id: 'Programmer', distractors: ['مُهَنْدِس', 'مُحَاسِب', 'مُحَلِّل'] },
      { image: '👨‍🔧', imageUrl: null, arabic: 'مُهَنْدِس', latin: 'muhandis', id: 'Insinyur', distractors: ['طَبِيب', 'مِيكَانِيكِيّ', 'بَنَّاء'] },
      { image: '👨‍🍳', imageUrl: null, arabic: 'طَبَّاخ', latin: 'tabbakh', id: 'Koki', distractors: ['نَادِل', 'خَبَّاز', 'جَزَّار'] },
      { image: '👨‍🌾', imageUrl: null, arabic: 'فَلَّاح', latin: 'fallah', id: 'Petani', distractors: ['رَاعٍ', 'صَيَّاد', 'بُسْتَانِيّ'] },
      { image: '👮', imageUrl: null, arabic: 'شُرْطِيّ', latin: 'shurti', id: 'Polisi', distractors: ['جُنْدِيّ', 'حَارِس', 'إِطْفَائِيّ'] },
      { image: '👨‍🚒', imageUrl: null, arabic: 'إِطْفَائِيّ', latin: 'itfa\'i', id: 'Pemadam Kebakaran', distractors: ['شُرْطِيّ', 'جُنْدِيّ', 'مُسْعِف'] },
      { image: '🧑‍✈️', imageUrl: null, arabic: 'طَيَّار', latin: 'tayyar', id: 'Pilot', distractors: ['سَائِق', 'مَلَّاح', 'مُضِيف'] },
      { image: '👨‍🔬', imageUrl: null, arabic: 'عَالِم', latin: '\'alim', id: 'Ilmuwan', distractors: ['بَاحِث', 'فِيلْسُوف', 'مُهَنْدِس'] },
      { image: '👨‍🎨', imageUrl: null, arabic: 'فَنَّان', latin: 'fannan', id: 'Seniman', distractors: ['رَسَّام', 'نَحَّات', 'كَاتِب'] },
      { image: '👨‍🎤', imageUrl: null, arabic: 'مُغَنٍّ', latin: 'mughannin', id: 'Penyanyi', distractors: ['عَازِف', 'مُمَثِّل', 'رَاقِص'] },
      { image: '🧑‍⚖️', imageUrl: null, arabic: 'قَاضٍ', latin: 'qadhi', id: 'Hakim', distractors: ['مُحَامٍ', 'شُرْطِيّ', 'وَزِير'] },
      { image: '🧕', imageUrl: null, arabic: 'مُمَرِّضَة', latin: 'mumarrida', id: 'Perawat (Pr)', distractors: ['طَبِيبَة', 'مُدَرِّسَة', 'مُحَامِيَة'] },
      { image: '🛒', imageUrl: null, arabic: 'تَاجِر', latin: 'tajir', id: 'Pedagang', distractors: ['بَائِع', 'مُشْتَرٍ', 'صَاحِب مَتْجَر'] },
      { image: '✂️', imageUrl: null, arabic: 'حَلَّاق', latin: 'hallaq', id: 'Tukang Cukur', distractors: ['خَيَّاط', 'فَنَّان', 'مُصَفِّف'] },
      { image: '🚚', imageUrl: null, arabic: 'سَائِق', latin: 'sa\'iq', id: 'Sopir', distractors: ['طَيَّار', 'مَلَّاح', 'رَاكِب'] },
      { image: '🕌', imageUrl: null, arabic: 'إِمَام', latin: 'imam', id: 'Imam', distractors: ['خَطِيب', 'مُؤَذِّن', 'شَيْخ'] },
      { image: '📝', imageUrl: null, arabic: 'كَاتِب', latin: 'katib', id: 'Penulis', distractors: ['شَاعِر', 'صَحَفِيّ', 'مُحَرِّر'] },
      { image: '⚒️', imageUrl: null, arabic: 'نَجَّار', latin: 'najjar', id: 'Tukang Kayu', distractors: ['بَنَّاء', 'حَدَّاد', 'سَبَّاك'] },
    ],
  },

  // ============================================================
  // 10) OLAHRAGA & AKTIVITAS (20) — BARU
  // ============================================================
  {
    id: 'olahraga',
    title: 'Olahraga & Aktivitas',
    description: 'Olahraga & kegiatan harian',
    emoji: '⚽',
    color: '#8b6b3d',
    bgGradient: 'linear-gradient(135deg, #8b6b3d, #a08555)',
    xpReward: 55,
    items: [
      { image: '⚽', imageUrl: null, arabic: 'كُرَة الْقَدَم', latin: 'kurat al-qadam', id: 'Sepak Bola', distractors: ['كُرَة السَّلَّة', 'كُرَة الطَّائِرَة', 'كُرَة الْيَد'] },
      { image: '🏀', imageUrl: null, arabic: 'كُرَة السَّلَّة', latin: 'kurat as-salla', id: 'Bola Basket', distractors: ['كُرَة الْقَدَم', 'كُرَة الطَّائِرَة', 'تِنِس'] },
      { image: '🏐', imageUrl: null, arabic: 'كُرَة الطَّائِرَة', latin: 'kurat at-ta\'ira', id: 'Bola Voli', distractors: ['كُرَة السَّلَّة', 'كُرَة الْقَدَم', 'كُرَة الْمَاء'] },
      { image: '🎾', imageUrl: null, arabic: 'تِنِس', latin: 'tinis', id: 'Tenis', distractors: ['اسْكْوَاش', 'بَدْمِنْتُن', 'كُرَة الطَّاوِلَة'] },
      { image: '🏊', imageUrl: null, arabic: 'سِبَاحَة', latin: 'sibaha', id: 'Renang', distractors: ['غَوْص', 'تَجْدِيف', 'رُكُوب الْأَمْوَاج'] },
      { image: '🏃', imageUrl: null, arabic: 'جَرْي', latin: 'jary', id: 'Lari', distractors: ['مَشْي', 'قَفْز', 'رُكُوض'] },
      { image: '🚶', imageUrl: null, arabic: 'مَشْي', latin: 'mashy', id: 'Berjalan', distractors: ['جَرْي', 'رُكُوض', 'تَجَوُّل'] },
      { image: '🤸', imageUrl: null, arabic: 'جِمْبَاز', latin: 'jimbaz', id: 'Senam', distractors: ['يُوغَا', 'لِيَاقَة', 'رَقْص'] },
      { image: '🧘', imageUrl: null, arabic: 'يُوغَا', latin: 'yuga', id: 'Yoga', distractors: ['جِمْبَاز', 'تَأَمُّل', 'لِيَاقَة'] },
      { image: '🚴', imageUrl: null, arabic: 'رُكُوب الدَّرَّاجَة', latin: 'rukub ad-darraja', id: 'Bersepeda', distractors: ['جَرْي', 'سِبَاحَة', 'تَجْدِيف'] },
      { image: '🥊', imageUrl: null, arabic: 'مُلَاكَمَة', latin: 'mulakama', id: 'Tinju', distractors: ['كَارَاتِيه', 'مُصَارَعَة', 'تَايْكُوَانْدُو'] },
      { image: '🤺', imageUrl: null, arabic: 'مُبَارَزَة', latin: 'mubaraza', id: 'Anggar', distractors: ['كَارَاتِيه', 'جُودُو', 'مُصَارَعَة'] },
      { image: '🏇', imageUrl: null, arabic: 'سِبَاق الْخَيْل', latin: 'sibaq al-khayl', id: 'Pacuan Kuda', distractors: ['رُكُوب الْخَيْل', 'سِبَاق الْإِبِل', 'سِبَاق السَّيَّارَات'] },
      { image: '🏆', imageUrl: null, arabic: 'كَأْس', latin: 'ka\'s', id: 'Piala', distractors: ['مِيدَالِيَة', 'جَائِزَة', 'تَكْرِيم'] },
      { image: '🥇', imageUrl: null, arabic: 'مِيدَالِيَة', latin: 'midaliya', id: 'Medali', distractors: ['كَأْس', 'وِسَام', 'جَائِزَة'] },
      { image: '📚', imageUrl: null, arabic: 'قِرَاءَة', latin: 'qira\'a', id: 'Membaca', distractors: ['كِتَابَة', 'دِرَاسَة', 'بَحْث'] },
      { image: '✍️', imageUrl: null, arabic: 'كِتَابَة', latin: 'kitaba', id: 'Menulis', distractors: ['قِرَاءَة', 'رَسْم', 'طِبَاعَة'] },
      { image: '🎨', imageUrl: null, arabic: 'رَسْم', latin: 'rasm', id: 'Menggambar', distractors: ['كِتَابَة', 'تَلْوِين', 'نَحْت'] },
      { image: '🎵', imageUrl: null, arabic: 'مُوسِيقَى', latin: 'musiqa', id: 'Musik', distractors: ['غِنَاء', 'رَقْص', 'لَحْن'] },
      { image: '💤', imageUrl: null, arabic: 'نَوْم', latin: 'nawm', id: 'Tidur', distractors: ['رَاحَة', 'اسْتِيقَاظ', 'حُلْم'] },
    ],
  },
];

// Merge URL dari JSON ke items (runtime). Script generator nge-populate JSON.
// Format JSON: { "categoryId": { "arabicWord": "https://..." } }
TEBAK_GAMBAR_LEVELS.forEach((level) => {
  const urlMap = TEBAK_GAMBAR_URLS[level.id] || {};
  level.items.forEach((item) => {
    const url = urlMap[item.arabic];
    if (url) item.imageUrl = url;
  });
});
