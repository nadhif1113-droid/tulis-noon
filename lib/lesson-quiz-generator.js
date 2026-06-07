// lib/lesson-quiz-generator.js
// Auto-generate kuis dari data modul Umrah/Profesional/Pelajar.
// Input: module object dgn vocab[] + conversations[].dialog[]
// Output: array of question objects { type, q, options[], correct, explanation, ar?, id? }
//
// Hash-based "shuffle" deterministik per modul biar urutan soal konsisten
// kalau user buka ulang (gak random tiap kali).

// Seeded PRNG sederhana — Mulberry32. Cukup untuk shuffle deterministik.
function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return h >>> 0;
}

function shuffleWith(rng, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN(rng, arr, n) {
  return shuffleWith(rng, arr).slice(0, n);
}

function makeOptions(rng, correctValue, allValues, n = 4) {
  // ambil n-1 distraktor dari allValues yg berbeda dari correctValue
  const pool = allValues.filter((v) => v !== correctValue);
  const distractors = pickN(rng, pool, n - 1);
  const options = shuffleWith(rng, [correctValue, ...distractors]);
  return { options, correctIdx: options.indexOf(correctValue) };
}

/**
 * Generate kuis untuk satu modul.
 * @param {object} module — { id, vocab, conversations, ... }
 * @param {number} targetCount — jumlah soal yg di-target (default 7)
 * @returns {Array} list of question objects
 */
export function generateModuleQuiz(module, targetCount = 7) {
  if (!module) return [];
  const seed = hashStr(module.id || 'default');
  const rng = mulberry32(seed);

  const vocab = (module.vocab || []).filter((v) => v && v.ar && v.id);
  // Bahasa Indonesia di vocab juga sering tersembunyi di dialog — gabungkan
  // semua yg punya pasangan ar/id sebagai bank kemungkinan jawaban.
  const allArs = vocab.map((v) => v.ar);
  const allIds = vocab.map((v) => v.id);

  const questions = [];

  // === Soal Tipe A: Arab → Indonesia ===
  // 3 soal: tampilin Arab, user pilih artinya dlm Indonesia.
  const arToIdItems = pickN(rng, vocab, Math.min(3, vocab.length));
  for (const item of arToIdItems) {
    if (allIds.length < 2) continue;
    const { options, correctIdx } = makeOptions(rng, item.id, allIds, Math.min(4, allIds.length));
    questions.push({
      type: 'ar-to-id',
      q: 'Apa arti kata berikut?',
      prompt: item.ar,
      promptLatin: item.latin,
      options,
      correct: correctIdx,
      explanation: `${item.ar} (${item.latin || ''}) artinya: ${item.id}`,
      ttsText: item.ar,
    });
  }

  // === Soal Tipe B: Indonesia → Arab ===
  // 2 soal: tampilin Indonesia, user pilih Arabnya.
  const idToArItems = pickN(rng, vocab, Math.min(2, vocab.length));
  for (const item of idToArItems) {
    if (allArs.length < 2) continue;
    const { options, correctIdx } = makeOptions(rng, item.ar, allArs, Math.min(4, allArs.length));
    questions.push({
      type: 'id-to-ar',
      q: 'Bahasa Arab dari kata berikut adalah...',
      prompt: item.id,
      options,
      correct: correctIdx,
      explanation: `"${item.id}" dalam bahasa Arab: ${item.ar} (${item.latin || ''})`,
    });
  }

  // === Soal Tipe C: Audio (Arab TTS) → Indonesia ===
  // 1 soal: TTS Arab, user pilih artinya.
  const audioItems = pickN(rng, vocab.filter((v) => !arToIdItems.includes(v)), 1);
  for (const item of audioItems) {
    if (allIds.length < 2) continue;
    const { options, correctIdx } = makeOptions(rng, item.id, allIds, Math.min(4, allIds.length));
    questions.push({
      type: 'audio-to-id',
      q: 'Dengar audio berikut. Apa artinya?',
      prompt: '🔊 Tap untuk dengar',
      ttsText: item.ar,
      options,
      correct: correctIdx,
      explanation: `Yang kamu dengar: ${item.ar} — artinya: ${item.id}`,
    });
  }

  // === Soal Tipe D: Lengkapi Dialog ===
  // 1 soal: tampilin dialog dgn salah satu bubble dikosongin, user pilih
  // jawaban yang pas dari potongan dialog lain (di modul yang sama).
  const allDialogTurns = [];
  for (const conv of (module.conversations || [])) {
    for (const turn of (conv.dialog || [])) {
      if (turn && turn.ar && turn.id) allDialogTurns.push(turn);
    }
  }
  if (allDialogTurns.length >= 4) {
    const targetTurn = pickN(rng, allDialogTurns, 1)[0];
    // Cari konteks: dialog sebelum target dari conv yg sama (kalau ada)
    let contextLine = null;
    for (const conv of (module.conversations || [])) {
      const idx = (conv.dialog || []).indexOf(targetTurn);
      if (idx > 0) {
        const prev = conv.dialog[idx - 1];
        if (prev) contextLine = prev;
        break;
      }
    }
    const allDialogArs = allDialogTurns.map((t) => t.ar);
    const { options, correctIdx } = makeOptions(rng, targetTurn.ar, allDialogArs, Math.min(4, allDialogArs.length));
    questions.push({
      type: 'dialog-complete',
      q: contextLine
        ? `Lanjutan dialog yang tepat. Lawan bicara berkata: "${contextLine.id}" — kamu jawab...`
        : 'Pilih kalimat Arab yang tepat untuk situasi berikut:',
      prompt: targetTurn.id,
      options,
      correct: correctIdx,
      explanation: `Jawaban yang tepat: ${targetTurn.ar} (${targetTurn.latin || ''}) — ${targetTurn.id}`,
    });
  }

  // Batasi sesuai target
  return questions.slice(0, Math.max(3, targetCount));
}

/**
 * Hitung skor kelulusan: lulus kalau benar >= 70%.
 */
export function quizPassed(correctCount, totalCount, threshold = 0.7) {
  if (!totalCount) return false;
  return correctCount / totalCount >= threshold;
}

/**
 * Bonus XP untuk kuis: 10 XP base + 2 XP/soal kalau lulus.
 */
export function calcQuizBonusXp(correctCount, totalCount) {
  if (!quizPassed(correctCount, totalCount)) return 0;
  return 10 + correctCount * 2;
}
