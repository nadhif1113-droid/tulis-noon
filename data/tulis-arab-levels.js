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

  // ===================================================================
  // PHASE 2 — CARA BACA (PREMIUM)
  // ===================================================================
  {
    id: 'cara-baca',
    number: 2,
    title: 'Cara Baca',
    description: 'Belajar baca suku kata, mad (panjang/pendek), tasydid (huruf ganda).',
    emoji: '🔊',
    color: '#c9a961',
    bgGradient: 'linear-gradient(135deg, #c9a961, #d4b876)',
    isFree: false,
    levels: [
      placeholderLevel(4, 'Suku Kata Sederhana', 'Gabungin huruf + harakat jadi suku kata yang bisa dibaca: ba+ta = بَتَ.'),
      placeholderLevel(5, 'Bunyi Mad', 'Belajar baca panjang (mad) vs pendek. Contoh: قَا vs قَ.'),
      placeholderLevel(6, 'Tasydid & Sukun', 'Huruf ganda (tasydid) dan huruf mati (sukun). Penting buat baca Quran.'),
    ],
  },

  // ===================================================================
  // PHASE 3 — MENULIS KATA (PREMIUM)
  // ===================================================================
  {
    id: 'menulis-kata',
    number: 3,
    title: 'Menulis Kata',
    description: 'Susun huruf-huruf jadi kata yang bermakna. Mulai dari kata pendek sampai vocab pasar & umrah.',
    emoji: '✍️',
    color: '#a05536',
    bgGradient: 'linear-gradient(135deg, #a05536, #c46a3f)',
    isFree: false,
    levels: [
      placeholderLevel(7, 'Kata 2-3 Huruf', 'Susun kata pendek: كَتَبَ (menulis), قَرَأَ (membaca).'),
      placeholderLevel(8, 'Vocab Pasar', 'Kosakata belanja: kurma (تَمْر), harga (سِعْر), beli (شِرَاء).'),
      placeholderLevel(9, 'Vocab Umrah', 'Kosakata ibadah: masjid (مَسْجِد), tawaf (طَوَاف), sa\'i (سَعْي).'),
    ],
  },

  // ===================================================================
  // PHASE 4 — MENULIS KALIMAT (PREMIUM)
  // ===================================================================
  {
    id: 'menulis-kalimat',
    number: 4,
    title: 'Menulis Kalimat',
    description: 'Susun kalimat utuh. Pertanyaan, pernyataan, sapaan, doa harian.',
    emoji: '📝',
    color: '#7a3d2a',
    bgGradient: 'linear-gradient(135deg, #7a3d2a, #8b4a2a)',
    isFree: false,
    levels: [
      placeholderLevel(10, 'Kalimat Tanya', 'Bikin pertanyaan: "Berapa harganya?", "Di mana masjid?".'),
      placeholderLevel(11, 'Kalimat Pernyataan', 'Bikin pernyataan: "Saya mau ini", "Ini bagus".'),
      placeholderLevel(12, 'Sapaan & Doa', 'Sapaan & doa harian: salam, alhamdulillah, doa makan.'),
    ],
  },

  // ===================================================================
  // PHASE 5 — MENULIS PARAGRAF (PREMIUM)
  // ===================================================================
  {
    id: 'menulis-paragraf',
    number: 5,
    title: 'Menulis Paragraf',
    description: 'Final boss. Susun paragraf utuh: cerita, doa panjang, konversasi nyata.',
    emoji: '📜',
    color: '#0a4d3c',
    bgGradient: 'linear-gradient(135deg, #0a4d3c, #2e8869)',
    isFree: false,
    levels: [
      placeholderLevel(13, 'Cerita Pendek', 'Tulis paragraf cerita 2-3 kalimat tentang aktivitas harian.'),
      placeholderLevel(14, 'Doa Harian', 'Tulis paragraf doa harian: bangun tidur, sebelum makan, dst.'),
      placeholderLevel(15, 'Konversasi Real (Final)', 'Gabungin semua skill. Tulis percakapan utuh di pasar / masjid / café.'),
    ],
  },
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
