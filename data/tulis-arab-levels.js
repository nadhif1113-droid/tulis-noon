// data/tulis-arab-levels.js
// Game "Tulis Arab" — 5 phase × 3 level = 15 level total.
// Phase 1 (Mengenal Huruf): Lv 1-3 FREE, fully seeded.
// Phase 2-5 (Cara Baca, Menulis Kata, Menulis Kalimat, Menulis Paragraf): PREMIUM (locked).

/**
 * Distractor pool — huruf hijaiyah lengkap untuk random pick distractors.
 * Dipakai kalau level item ga punya custom distractors.
 */
const HIJAIYAH_ALL = ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'];

/**
 * Helper: bikin placeholder level untuk Phase 2-5 yang masih coming soon.
 */
function placeholderLevel(level, title, blurb) {
  return {
    level,
    title,
    description: blurb,
    mode: 'tap-letter',
    xpReward: 100 + (level - 4) * 10,
    comingSoon: true,
    items: [],
  };
}

export const TULIS_ARAB_PHASES = [
  // ===================================================================
  // PHASE 1 — MENGENAL HURUF (FREE)
  // ===================================================================
  {
    id: 'mengenal-huruf',
    number: 1,
    title: 'Mengenal Huruf',
    description: 'Kenalan dengan 28 huruf hijaiyah dari nol. Tap huruf yang sesuai bunyinya — gampang.',
    emoji: '📖',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
    isFree: true,
    levels: [
      {
        level: 1,
        title: 'Huruf Hijaiyah Dasar',
        description: 'Mulai dari yang paling sering muncul: alif, ba, ta, mim, dst. Tap huruf yang sesuai.',
        mode: 'tap-letter',
        xpReward: 50,
        items: [
          { latin: 'alif', arabic: 'ا', distractors: ['ل', 'و', 'ي', 'ك', 'ر'] },
          { latin: 'ba',   arabic: 'ب', distractors: ['ت', 'ث', 'ن', 'ي', 'ج'] },
          { latin: 'ta',   arabic: 'ت', distractors: ['ث', 'ب', 'ن', 'ي', 'ك'] },
          { latin: 'jim',  arabic: 'ج', distractors: ['ح', 'خ', 'ع', 'غ', 'م'] },
          { latin: 'dal',  arabic: 'د', distractors: ['ذ', 'ر', 'ز', 'و', 'ل'] },
          { latin: 'ra',   arabic: 'ر', distractors: ['ز', 'و', 'د', 'ل', 'ا'] },
          { latin: 'sin',  arabic: 'س', distractors: ['ش', 'ص', 'ض', 'ث', 'ت'] },
          { latin: 'mim',  arabic: 'م', distractors: ['ن', 'ل', 'ك', 'ي', 'ه'] },
          { latin: 'nun',  arabic: 'ن', distractors: ['ت', 'ث', 'ب', 'ي', 'م'] },
          { latin: 'ya',   arabic: 'ي', distractors: ['ب', 'ت', 'ن', 'ل', 'ا'] },
        ],
      },
      {
        level: 2,
        title: 'Huruf Mirip',
        description: 'Bedain huruf yang gampang ketukar: ب ت ث, ج ح خ, د ذ, ر ز. Tap yang benar.',
        mode: 'tap-letter',
        xpReward: 75,
        items: [
          { latin: 'ba (1 titik bawah)',  arabic: 'ب', distractors: ['ت', 'ث', 'ن', 'ي'] },
          { latin: 'tsa (3 titik atas)',  arabic: 'ث', distractors: ['ب', 'ت', 'ن', 'ي'] },
          { latin: 'jim (titik bawah)',   arabic: 'ج', distractors: ['ح', 'خ', 'ع', 'غ'] },
          { latin: 'kha (titik atas)',    arabic: 'خ', distractors: ['ح', 'ج', 'ع', 'غ'] },
          { latin: 'dzal (pakai titik)',  arabic: 'ذ', distractors: ['د', 'ر', 'ز', 'و'] },
          { latin: 'za (pakai titik)',    arabic: 'ز', distractors: ['ر', 'د', 'ذ', 'و'] },
          { latin: 'shad (tebal)',        arabic: 'ص', distractors: ['ض', 'س', 'ش', 'ث'] },
          { latin: 'dhad (tebal + titik)', arabic: 'ض', distractors: ['ص', 'س', 'ش', 'ط'] },
          { latin: 'ain (tanpa titik)',   arabic: 'ع', distractors: ['غ', 'ح', 'ج', 'خ'] },
          { latin: 'ghain (pakai titik)', arabic: 'غ', distractors: ['ع', 'ح', 'ج', 'خ'] },
        ],
      },
      {
        level: 3,
        title: 'Harakat Dasar',
        description: 'Belajar baca tanda baca: fatha (a), kasra (i), dhamma (u), sukun (mati). Pas mau baca Quran ini wajib.',
        mode: 'tap-letter',
        xpReward: 100,
        items: [
          { latin: 'ba + fatha (ba)',   arabic: 'بَ', distractors: ['بِ', 'بُ', 'بْ', 'بّ'] },
          { latin: 'ba + kasra (bi)',   arabic: 'بِ', distractors: ['بَ', 'بُ', 'بْ', 'بّ'] },
          { latin: 'ba + dhamma (bu)',  arabic: 'بُ', distractors: ['بَ', 'بِ', 'بْ', 'بّ'] },
          { latin: 'ba + sukun (b mati)', arabic: 'بْ', distractors: ['بَ', 'بِ', 'بُ', 'بّ'] },
          { latin: 'ta + fatha (ta)',   arabic: 'تَ', distractors: ['تِ', 'تُ', 'تْ', 'بَ'] },
          { latin: 'mim + sukun (m mati)', arabic: 'مْ', distractors: ['مَ', 'مِ', 'مُ', 'مّ'] },
          { latin: 'lam + tasydid (ll)', arabic: 'لّ', distractors: ['لَ', 'لِ', 'لْ', 'لُ'] },
          { latin: 'nun + fatha (na)',  arabic: 'نَ', distractors: ['نِ', 'نُ', 'نْ', 'تَ'] },
          { latin: 'ra + dhamma (ru)',  arabic: 'رُ', distractors: ['رَ', 'رِ', 'رْ', 'زُ'] },
          { latin: 'sin + fatha (sa)',  arabic: 'سَ', distractors: ['سِ', 'سُ', 'سْ', 'شَ'] },
        ],
      },
    ],
  },
  // Phase 2-5 (placeholders Level 4-15) di-remove sementara — belum ada konten beneran.
  // Akan ditambah saat konten authoring siap. Sekarang user fokus di Phase 1 yang lengkap.
];

/**
 * Helper: get phase by id
 */
export function getTulisArabPhase(id) {
  return TULIS_ARAB_PHASES.find((p) => p.id === id);
}

/**
 * Helper: bikin grid pilihan untuk tap-letter mode.
 * Gabungin correct answer + 5 distractor, shuffle, return 6 opsi.
 */
export function buildLetterChoices(item) {
  const distractors = item.distractors || [];
  const choices = [item.arabic, ...distractors.slice(0, 5)];
  // Fisher-Yates shuffle
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices;
}
