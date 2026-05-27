// data/match-questions.js
// Question pool untuk Match Arena. Tiap soal punya prompt (Latin/Indo) + correct (Arab) + distractors.
// Sekarang BERLEVEL (1-4): makin tinggi level, makin sulit & materinya beda.
//   Level 1 (Permulaan): kenal huruf hijaiyah.
//   Level 2 (Mudah):     kosakata dasar + angka.
//   Level 3 (Menengah):  kosakata pasar/sehari-hari + tempat.
//   Level 4 (Mahir):     frasa & istilah islami yang lebih panjang.

export const MATCH_QUESTIONS = [
  // ===== LEVEL 1 — Huruf hijaiyah =====
  { level: 1, prompt: 'alif',  correct: 'ا', distractors: ['ل', 'و', 'ي', 'ك', 'ب'] },
  { level: 1, prompt: 'ba',    correct: 'ب', distractors: ['ت', 'ث', 'ن', 'ي', 'ج'] },
  { level: 1, prompt: 'ta',    correct: 'ت', distractors: ['ث', 'ب', 'ن', 'ي', 'ك'] },
  { level: 1, prompt: 'jim',   correct: 'ج', distractors: ['ح', 'خ', 'ع', 'غ', 'م'] },
  { level: 1, prompt: 'ha',    correct: 'ح', distractors: ['ج', 'خ', 'ع', 'م', 'ن'] },
  { level: 1, prompt: 'dal',   correct: 'د', distractors: ['ذ', 'ر', 'ز', 'و', 'ل'] },
  { level: 1, prompt: 'ra',    correct: 'ر', distractors: ['ز', 'و', 'د', 'ل', 'ا'] },
  { level: 1, prompt: 'sin',   correct: 'س', distractors: ['ش', 'ص', 'ض', 'ث', 'ت'] },
  { level: 1, prompt: 'shad',  correct: 'ص', distractors: ['ض', 'س', 'ش', 'ث', 'ز'] },
  { level: 1, prompt: 'mim',   correct: 'م', distractors: ['ن', 'ل', 'ك', 'ي', 'ه'] },
  { level: 1, prompt: 'nun',   correct: 'ن', distractors: ['ت', 'ث', 'ب', 'ي', 'م'] },
  { level: 1, prompt: 'lam',   correct: 'ل', distractors: ['ا', 'ك', 'م', 'ن', 'ي'] },
  { level: 1, prompt: 'kaf',   correct: 'ك', distractors: ['ل', 'م', 'ن', 'ي', 'ه'] },
  { level: 1, prompt: 'ya',    correct: 'ي', distractors: ['ب', 'ت', 'ن', 'ل', 'ا'] },
  { level: 1, prompt: 'qaf',   correct: 'ق', distractors: ['ف', 'ك', 'غ', 'ع', 'ن'] },

  // ===== LEVEL 2 — Kosakata dasar + angka =====
  { level: 2, prompt: 'rumah (bayt)',     correct: 'بَيْت', distractors: ['بَنْت', 'بِنْت', 'بَيْع', 'بَاب', 'بَتْ'] },
  { level: 2, prompt: 'kitab/buku',       correct: 'كِتَاب', distractors: ['كَاتِب', 'مَكْتَب', 'كَتَب', 'كُتُب', 'كَلْب'] },
  { level: 2, prompt: 'air',              correct: 'مَاء', distractors: ['مَال', 'نَار', 'حَجَر', 'هَوَاء', 'مَاضِي'] },
  { level: 2, prompt: 'masjid',           correct: 'مَسْجِد', distractors: ['مَكْتَب', 'مَدْرَسَة', 'مَدِينَة', 'مَحَل', 'مَجْلِس'] },
  { level: 2, prompt: 'kurma',            correct: 'تَمْر', distractors: ['تَفَّاح', 'تَجْرِبَة', 'تَمْرِين', 'تَنْزِيل', 'تُفَّاح'] },
  { level: 2, prompt: 'salam',            correct: 'سَلَام', distractors: ['سَلَامَة', 'سَالِم', 'كَلَام', 'حَلَال', 'كَلِمَة'] },
  { level: 2, prompt: 'satu (wahid)',     correct: 'وَاحِد', distractors: ['وَالِد', 'وَاجِب', 'وَحْدَة', 'وَجْه', 'وَلَد'] },
  { level: 2, prompt: 'dua (itsnan)',     correct: 'اثْنَان', distractors: ['ثَلَاث', 'أَرْبَع', 'سِتَّة', 'ثَمَان', 'إِثْنَيْن'] },
  { level: 2, prompt: 'tiga (tsalatsah)', correct: 'ثَلَاثَة', distractors: ['أَرْبَعَة', 'خَمْسَة', 'اثْنَان', 'تِسْعَة', 'ثَمَانِيَة'] },
  { level: 2, prompt: 'lima (khamsah)',   correct: 'خَمْسَة', distractors: ['سِتَّة', 'سَبْعَة', 'أَرْبَعَة', 'ثَمَانِيَة', 'خَلَاص'] },
  { level: 2, prompt: 'sepuluh (asyrah)', correct: 'عَشَرَة', distractors: ['عَشْر', 'عِشْرِين', 'ثَلَاثِين', 'أَلْف', 'مِئَة'] },

  // ===== LEVEL 3 — Pasar / sehari-hari + tempat =====
  { level: 3, prompt: 'berapa (kam)',          correct: 'كَم', distractors: ['كِم', 'كُم', 'لِم', 'هَل', 'مَن'] },
  { level: 3, prompt: 'mahal (ghali)',         correct: 'غَالِي', distractors: ['عَالِي', 'غَلَط', 'قَلِيل', 'كَثِير', 'رَخِيص'] },
  { level: 3, prompt: 'murah (rakhis)',        correct: 'رَخِيص', distractors: ['غَالِي', 'كَبِير', 'صَغِير', 'جَدِيد', 'قَدِيم'] },
  { level: 3, prompt: 'terima kasih (shukran)', correct: 'شُكْرًا', distractors: ['شَهْر', 'سَلَام', 'سُكَّر', 'شُكْر', 'شَكْل'] },
  { level: 3, prompt: 'Mekkah',                correct: 'مَكَّة', distractors: ['مَدِينَة', 'مِنَى', 'عَرَفَة', 'مَرْوَة', 'مَسْجِد'] },
  { level: 3, prompt: 'Madinah',               correct: 'المَدِينَة', distractors: ['مَكَّة', 'مَدْرَسَة', 'مَدِيرَة', 'مَسْجِد', 'مَرْوَة'] },
  { level: 3, prompt: 'kanan (yamin)',         correct: 'يَمِين', distractors: ['يَسَار', 'أَمَام', 'وَرَاء', 'فَوْق', 'تَحْت'] },
  { level: 3, prompt: 'kiri (yasar)',          correct: 'يَسَار', distractors: ['يَمِين', 'أَمَام', 'قَرِيب', 'بَعِيد', 'هُنَا'] },
  { level: 3, prompt: 'tolong (min fadlik)',   correct: 'مِن فَضْلِك', distractors: ['عَفْوًا', 'لَو سَمَحْت', 'بَعْدَ إِذْنِك', 'مَعْذِرَة', 'شُكْرًا'] },
  { level: 3, prompt: 'di mana (aina)',        correct: 'أَيْنَ', distractors: ['مَتَى', 'كَيْفَ', 'لِمَاذَا', 'مَن', 'مَاذَا'] },

  // ===== LEVEL 4 — Frasa & istilah islami =====
  { level: 4, prompt: 'Alhamdulillah (segala puji bagi Allah)', correct: 'الْحَمْدُ لِلَّه', distractors: ['سُبْحَانَ اللَّه', 'اللَّهُ أَكْبَر', 'بِسْمِ اللَّه', 'لَا إِلَهَ إِلَّا اللَّه', 'أَسْتَغْفِرُ اللَّه'] },
  { level: 4, prompt: 'Insya Allah (jika Allah berkehendak)',  correct: 'إِنْ شَاءَ اللَّه', distractors: ['مَا شَاءَ اللَّه', 'بَارَكَ اللَّه', 'جَزَاكَ اللَّه', 'تَوَكَّلْتُ عَلَى اللَّه', 'صَدَقَ اللَّه'] },
  { level: 4, prompt: 'Jazakallahu khairan (semoga Allah balas kebaikan)', correct: 'جَزَاكَ اللَّهُ خَيْرًا', distractors: ['بَارَكَ اللَّهُ فِيك', 'مَا شَاءَ اللَّه', 'إِنْ شَاءَ اللَّه', 'الْحَمْدُ لِلَّه', 'سُبْحَانَ اللَّه'] },
  { level: 4, prompt: 'Masya Allah (sungguh kehendak Allah)',  correct: 'مَا شَاءَ اللَّه', distractors: ['إِنْ شَاءَ اللَّه', 'سُبْحَانَ اللَّه', 'بَارَكَ اللَّه', 'اللَّهُ أَكْبَر', 'الْحَمْدُ لِلَّه'] },
  { level: 4, prompt: 'Astaghfirullah (aku mohon ampun Allah)', correct: 'أَسْتَغْفِرُ اللَّه', distractors: ['سُبْحَانَ اللَّه', 'الْحَمْدُ لِلَّه', 'اللَّهُ أَكْبَر', 'لَا حَوْلَ وَلَا قُوَّة', 'بِسْمِ اللَّه'] },
  { level: 4, prompt: 'Barakallahu fik (semoga Allah berkahi)', correct: 'بَارَكَ اللَّهُ فِيك', distractors: ['جَزَاكَ اللَّهُ خَيْرًا', 'مَا شَاءَ اللَّه', 'حَفِظَكَ اللَّه', 'رَحِمَكَ اللَّه', 'وَفَّقَكَ اللَّه'] },
  { level: 4, prompt: 'La hawla wala quwwata illa billah',     correct: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّه', distractors: ['لَا إِلَهَ إِلَّا اللَّه', 'سُبْحَانَ اللَّه وَبِحَمْدِه', 'أَسْتَغْفِرُ اللَّهَ الْعَظِيم', 'حَسْبُنَا اللَّه', 'تَوَكَّلْتُ عَلَى اللَّه'] },
];

/**
 * Generate 1 match round: pick N soal acak dari LEVEL tertentu.
 * @param {number} count - jumlah soal (default 5)
 * @param {number} level - 1..4 (default 1). Kalau soal di level itu < count, lengkapi dari level lebih rendah.
 */
export function generateMatchRound(count = 5, level = 1) {
  const lv = Math.max(1, Math.min(4, level || 1));
  let pool = MATCH_QUESTIONS.filter((q) => q.level === lv);
  // Kalau kurang dari count, tambahin dari level di bawahnya (biar selalu cukup).
  if (pool.length < count) {
    const fill = MATCH_QUESTIONS.filter((q) => q.level < lv);
    pool = [...pool, ...fill];
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, count);
  return picked.map((q) => {
    const allChoices = [q.correct, ...q.distractors.slice(0, 5)];
    for (let i = allChoices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allChoices[i], allChoices[j]] = [allChoices[j], allChoices[i]];
    }
    return { prompt: q.prompt, correct: q.correct, choices: allChoices };
  });
}
