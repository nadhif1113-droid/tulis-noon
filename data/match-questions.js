// data/match-questions.js
// Question pool untuk Match Arena game (quick race vs bot).
// Setiap soal punya prompt (Latin) dan correct (Arabic) + 5 distractors.
// Random pick 5 soal dari pool tiap match untuk variety.

export const MATCH_QUESTIONS = [
  // Huruf hijaiyah dasar
  { prompt: 'alif',  correct: 'ا', distractors: ['ل', 'و', 'ي', 'ك', 'ب'] },
  { prompt: 'ba',    correct: 'ب', distractors: ['ت', 'ث', 'ن', 'ي', 'ج'] },
  { prompt: 'ta',    correct: 'ت', distractors: ['ث', 'ب', 'ن', 'ي', 'ك'] },
  { prompt: 'jim',   correct: 'ج', distractors: ['ح', 'خ', 'ع', 'غ', 'م'] },
  { prompt: 'ha',    correct: 'ح', distractors: ['ج', 'خ', 'ع', 'م', 'ن'] },
  { prompt: 'dal',   correct: 'د', distractors: ['ذ', 'ر', 'ز', 'و', 'ل'] },
  { prompt: 'ra',    correct: 'ر', distractors: ['ز', 'و', 'د', 'ل', 'ا'] },
  { prompt: 'sin',   correct: 'س', distractors: ['ش', 'ص', 'ض', 'ث', 'ت'] },
  { prompt: 'shad',  correct: 'ص', distractors: ['ض', 'س', 'ش', 'ث', 'ز'] },
  { prompt: 'mim',   correct: 'م', distractors: ['ن', 'ل', 'ك', 'ي', 'ه'] },
  { prompt: 'nun',   correct: 'ن', distractors: ['ت', 'ث', 'ب', 'ي', 'م'] },
  { prompt: 'lam',   correct: 'ل', distractors: ['ا', 'ك', 'م', 'ن', 'ي'] },
  { prompt: 'kaf',   correct: 'ك', distractors: ['ل', 'م', 'ن', 'ي', 'ه'] },
  { prompt: 'ya',    correct: 'ي', distractors: ['ب', 'ت', 'ن', 'ل', 'ا'] },
  { prompt: 'qaf',   correct: 'ق', distractors: ['ف', 'ك', 'غ', 'ع', 'ن'] },

  // Vocab pendek (kata umum)
  { prompt: 'rumah (bayt)',         correct: 'بَيْت', distractors: ['بَنْت', 'بِنْت', 'بَيْع', 'بَاب', 'بَتْ'] },
  { prompt: 'kitab/buku',           correct: 'كِتَاب', distractors: ['كَاتِب', 'مَكْتَب', 'كَتَب', 'كُتُب', 'كَلْب'] },
  { prompt: 'air',                  correct: 'مَاء', distractors: ['مَال', 'نَار', 'حَجَر', 'هَوَاء', 'مَاضِي'] },
  { prompt: 'masjid',               correct: 'مَسْجِد', distractors: ['مَكْتَب', 'مَدْرَسَة', 'مَدِينَة', 'مَحَل', 'مَجْلِس'] },
  { prompt: 'kurma',                correct: 'تَمْر', distractors: ['تَفَّاح', 'تَجْرِبَة', 'تَمْرِين', 'تَنْزِيل', 'تُفَّاح'] },
  { prompt: 'salam',                correct: 'سَلَام', distractors: ['سَلَامَة', 'سَالِم', 'كَلَام', 'حَلَال', 'كَلِمَة'] },

  // Angka 1-10
  { prompt: 'satu (wahid)',         correct: 'وَاحِد', distractors: ['وَالِد', 'وَاجِب', 'وَحْدَة', 'وَجْه', 'وَلَد'] },
  { prompt: 'dua (itsnan)',         correct: 'اثْنَان', distractors: ['ثَلَاث', 'أَرْبَع', 'سِتَّة', 'ثَمَان', 'إِثْنَيْن'] },
  { prompt: 'tiga (tsalatsah)',     correct: 'ثَلَاثَة', distractors: ['أَرْبَعَة', 'خَمْسَة', 'اثْنَان', 'تِسْعَة', 'ثَمَانِيَة'] },
  { prompt: 'lima (khamsah)',       correct: 'خَمْسَة', distractors: ['سِتَّة', 'سَبْعَة', 'أَرْبَعَة', 'ثَمَانِيَة', 'خَلَاص'] },
  { prompt: 'sepuluh (asyrah)',     correct: 'عَشَرَة', distractors: ['عَشْر', 'عِشْرِين', 'ثَلَاثِين', 'أَلْف', 'مِئَة'] },

  // Vocab pasar/sehari-hari
  { prompt: 'berapa (kam)',         correct: 'كَم', distractors: ['كِم', 'كُم', 'لِم', 'هَل', 'مَن'] },
  { prompt: 'mahal (ghali)',        correct: 'غَالِي', distractors: ['عَالِي', 'غَلَط', 'قَلِيل', 'كَثِير', 'رَخِيص'] },
  { prompt: 'murah (rakhis)',       correct: 'رَخِيص', distractors: ['غَالِي', 'كَبِير', 'صَغِير', 'جَدِيد', 'قَدِيم'] },
  { prompt: 'terima kasih (shukran)', correct: 'شُكْرًا', distractors: ['شَهْر', 'سَلَام', 'سُكَّر', 'شُكْر', 'شَكْل'] },

  // Tempat (umrah-friendly)
  { prompt: 'Mekkah',               correct: 'مَكَّة', distractors: ['مَدِينَة', 'مِنَى', 'عَرَفَة', 'مَرْوَة', 'مَسْجِد'] },
  { prompt: 'Madinah',              correct: 'المَدِينَة', distractors: ['مَكَّة', 'مَدْرَسَة', 'مَدِيرَة', 'مَسْجِد', 'مَرْوَة'] },
];

/**
 * Generate 1 match round: pick N random unique questions.
 * Returns array of { prompt, correct, choices (shuffled 6) }
 */
export function generateMatchRound(count = 5) {
  // Shuffle question pool, take first N
  const shuffled = [...MATCH_QUESTIONS].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, count);
  return picked.map((q) => {
    // Combine correct + 5 distractors, shuffle
    const allChoices = [q.correct, ...q.distractors.slice(0, 5)];
    for (let i = allChoices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allChoices[i], allChoices[j]] = [allChoices[j], allChoices[i]];
    }
    return { prompt: q.prompt, correct: q.correct, choices: allChoices };
  });
}
