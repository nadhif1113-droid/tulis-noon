// lib/hafalan-method.js
// Helper utilities untuk Hafalan Quran v2.
// Audio source: EveryAyah.com (Mishary Rashid Alafasy 64kbps, gratis).
// Voice recognition: Web Speech API ar-SA (browser-dependent).

// =============================================================================
// CONSTANTS
// =============================================================================
export const MAX_AYAT_PER_CHUNK = 5;       // metode finish max 5 ayat per session
export const REQUIRED_LISTEN_COUNT = 3;    // user harus dengar min 3x per ayat
export const QARI = 'Alafasy_64kbps';      // suara syekh default
export const VOICE_MATCH_THRESHOLD = 0.55; // 55% similarity = anggap benar

// =============================================================================
// AUDIO URL GENERATOR
// =============================================================================

/**
 * Generate URL audio MP3 per ayat dari EveryAyah.
 * Format: https://everyayah.com/data/{qari}/{paddedSura}{paddedAyah}.mp3
 *  - paddedSura: 3 digit (001-114)
 *  - paddedAyah: 3 digit (001-...)
 *
 * Example: An-Naas ayat 1 → https://everyayah.com/data/Alafasy_64kbps/114001.mp3
 */
export function getAyatAudioUrl(suratNumber, ayatNumber, qari = QARI) {
  const ps = String(suratNumber).padStart(3, '0');
  const pa = String(ayatNumber).padStart(3, '0');
  return `https://everyayah.com/data/${qari}/${ps}${pa}.mp3`;
}

// =============================================================================
// CHUNK SPLITTING — 5 ayat max per session
// =============================================================================

/**
 * Smart chunking — atur ukuran chunk supaya gak ada sisa nanggung.
 *
 * Rules:
 *  - ≤ 8 ayat   → 1 chunk full surat (gak dipotong, biar lengkap)
 *  - 9-10 ayat  → 2 chunks balanced (5+4 atau 5+5)
 *  - 11-15 ayat → distribute rata (mis. 11 → 4+4+3)
 *  - > 10 ayat  → bonus "Recap Final" chunk dgn full surat di akhir
 *
 * Contoh:
 *  - 6 ayat  → [chunk(1-6, full)]
 *  - 7 ayat  → [chunk(1-7, full)]
 *  - 9 ayat  → [chunk(1-5), chunk(6-9)]
 *  - 11 ayat → [chunk(1-4), chunk(5-8), chunk(9-11), RECAP(1-11)]
 *  - 20 ayat → [chunk(1-5), chunk(6-10), chunk(11-15), chunk(16-20), RECAP(1-20)]
 *
 * Tiap chunk punya metadata:
 *  - startAyat, endAyat, ayat: array of ayat objects
 *  - isFullSurat: true kalau chunk ini cover seluruh surat
 *  - isFinalRecap: true kalau chunk ini adalah recap akhir (untuk surat panjang)
 */
export function splitIntoChunks(ayatArray, maxSize = MAX_AYAT_PER_CHUNK) {
  const total = ayatArray.length;
  if (total === 0) return [];

  // Rule 1: ≤ 8 ayat → 1 chunk full surat
  if (total <= 8) {
    return [{
      startAyat: 1,
      endAyat: total,
      ayat: ayatArray,
      isFullSurat: true,
      isFinalRecap: false,
    }];
  }

  // Rule 2: > 8 ayat → bagi rata, target max 5 per chunk
  const numChunks = Math.ceil(total / maxSize);
  const baseSize = Math.floor(total / numChunks);
  const remainder = total % numChunks;

  const chunks = [];
  let idx = 0;
  for (let i = 0; i < numChunks; i++) {
    // Distribute remainder: first `remainder` chunks dapat +1 ayat extra
    const size = baseSize + (i < remainder ? 1 : 0);
    chunks.push({
      startAyat: idx + 1,
      endAyat: idx + size,
      ayat: ayatArray.slice(idx, idx + size),
      isFullSurat: false,
      isFinalRecap: false,
    });
    idx += size;
  }

  // Rule 3: > 10 ayat → tambah Recap Final (full surat sebagai ujian akhir)
  if (total > 10) {
    chunks.push({
      startAyat: 1,
      endAyat: total,
      ayat: ayatArray,
      isFullSurat: true,
      isFinalRecap: true,
    });
  }

  return chunks;
}

// =============================================================================
// ARABIC TEXT NORMALIZATION (untuk voice match)
// =============================================================================

/**
 * Normalize Arabic text untuk fuzzy compare.
 * - Hapus harakat (fatha, kasra, dhamma, sukun, syaddah, tanwin)
 * - Normalize hamza variants (إ أ آ → ا)
 * - Normalize ta marbuta (ة → ه)
 * - Hapus tatweel (ـ) dan spasi extra
 */
export function normalizeArabic(text = '') {
  return text
    // Hapus harakat & tashkeel (Unicode U+064B - U+065F, U+0670, U+0640)
    .replace(/[ً-ٰٟـۖ-ۭ]/g, '')
    // Normalize alif variants
    .replace(/[إأآٱ]/g, 'ا')
    // Normalize ya with hamza
    .replace(/[ئ]/g, 'ي')
    // Normalize waw with hamza
    .replace(/[ؤ]/g, 'و')
    // Ta marbuta → ha (untuk fuzzy match)
    .replace(/ة/g, 'ه')
    // Hapus tanda baca
    .replace(/[،؛؟!.,;?]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// =============================================================================
// VOICE MATCH — compare user speech dgn target ayat
// =============================================================================

/**
 * Jaccard similarity berdasarkan kata-kata.
 * Returns 0-1 (1 = identik).
 */
function jaccardSimilarity(arrA, arrB) {
  if (arrA.length === 0 && arrB.length === 0) return 1;
  const setA = new Set(arrA);
  const setB = new Set(arrB);
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...arrA, ...arrB]).size;
  return union > 0 ? intersection / union : 0;
}

/**
 * Levenshtein-like word similarity — handle word order yang sedikit beda.
 */
function wordSetSimilarity(textA, textB) {
  const wordsA = textA.split(' ').filter((w) => w.length > 0);
  const wordsB = textB.split(' ').filter((w) => w.length > 0);
  return jaccardSimilarity(wordsA, wordsB);
}

/**
 * Compare spoken text dengan expected ayat.
 * Returns { similarity, isMatch, normalizedSpoken, normalizedExpected }
 */
export function compareArabicSpeech(spoken, expected, threshold = VOICE_MATCH_THRESHOLD) {
  const normSpoken = normalizeArabic(spoken);
  const normExpected = normalizeArabic(expected);
  const similarity = wordSetSimilarity(normSpoken, normExpected);
  return {
    similarity,
    isMatch: similarity >= threshold,
    normalizedSpoken: normSpoken,
    normalizedExpected: normExpected,
  };
}

// =============================================================================
// VOICE RECOGNITION SUPPORT CHECK
// =============================================================================

/**
 * Cek apakah browser support Web Speech API SpeechRecognition.
 * iOS Safari support webkitSpeechRecognition dari iOS 14.5+, tapi terbatas.
 */
export function isSpeechRecognitionSupported() {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// =============================================================================
// STAGE LABELS — display info
// =============================================================================

export const STAGES = [
  { id: 1, key: 'listen-each', label: 'Mendengarkan', emoji: '🎧', desc: 'Dengarkan tiap ayat minimal 3x' },
  { id: 2, key: 'listen-full', label: 'Dengar Penuh', emoji: '📻', desc: 'Dengarkan rangkaian semua ayat utuh' },
  { id: 3, key: 'recite-each', label: 'Baca per Ayat', emoji: '🎤', desc: 'Bacakan setiap ayat — sistem cek bacaan' },
  { id: 4, key: 'recite-full-shown', label: 'Baca Utuh', emoji: '📖', desc: 'Bacakan semua sekaligus, teks masih kelihatan' },
  { id: 5, key: 'recite-full-memory', label: 'Hafalan Penuh', emoji: '🌟', desc: 'Bacakan dari hafalan — teks hilang' },
];

export function getStage(id) {
  return STAGES.find((s) => s.id === id) || STAGES[0];
}

/**
 * Reward XP per chunk selesai (semua 5 stage tuntas).
 */
export const CHUNK_COMPLETION_REWARD = { xp: 75, coins: 2 };
