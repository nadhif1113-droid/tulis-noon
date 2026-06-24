// scripts/audit-content/normalize.js
// Text normalization utilities

// Strip harakat (semua tanda baca Arab)
// Range Unicode harakat: U+064B–U+065F, U+0670, U+06D6–U+06ED
function stripHarakat(s) {
  return String(s || '').replace(/[ً-ٰٟۖ-ۭ]/g, '');
}

// Strip tatweel + extra spaces
function stripTatweel(s) {
  return String(s || '').replace(/ـ/g, '');
}

// Normalize Arabic untuk fuzzy compare (strip harakat + tatweel + punctuation)
function normalizeArabic(s) {
  return stripTatweel(stripHarakat(s)).trim()
    .replace(/\s+/g, ' ')
    .replace(/[؟?!.,،;:"'`]/g, '')
    .toLowerCase();
}

// Normalize Indonesian/English
function normalizeText(s) {
  return String(s || '').trim().toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?!.,;:"'`()]/g, '')
    .replace(/[-_/]/g, ' ');
}

// Canonical key untuk duplicate detection
function quizKey(arabic, indo) {
  return `${normalizeArabic(arabic)}::${normalizeText(indo)}`;
}

// Arab-only key (untuk vocab overlap detection)
function arabKey(arabic) {
  return normalizeArabic(arabic);
}

// Semantic-ish key — strip prefix kata tanya (mungkin sama maksud)
// "kam as-si'r" dan "ma as-si'r" — beda kata tanya, maksud sama tentang harga
function semanticKey(arabic) {
  let s = normalizeArabic(arabic);
  // Strip kata tanya umum di depan
  s = s.replace(/^(ما|من|متى|اين|كيف|كم|لماذا|هل)\s+/, '');
  return s.trim();
}

// Count harakat di sebuah string — untuk detect inconsistency
function countHarakat(s) {
  const matches = String(s || '').match(/[ً-ٰٟۖ-ۭ]/g);
  return matches ? matches.length : 0;
}

// Ratio harakat per character — high ratio = berharakat lengkap
function harakatRatio(s) {
  if (!s) return 0;
  const stripped = stripHarakat(s).replace(/\s/g, '');
  if (stripped.length === 0) return 0;
  return countHarakat(s) / stripped.length;
}

module.exports = {
  stripHarakat,
  stripTatweel,
  normalizeArabic,
  normalizeText,
  quizKey,
  arabKey,
  semanticKey,
  countHarakat,
  harakatRatio,
};
