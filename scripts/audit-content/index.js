#!/usr/bin/env node
// scripts/audit-content/index.js
// Comprehensive content audit — 5 tiers (loaders + analyzers + reporters + diff)
//
// Usage:
//   node scripts/audit-content [--verbose] [--diff] [--no-csv] [--no-html]
//
// Output:
//   audit-content/
//     ├── report.md              Markdown report (human readable)
//     ├── dashboard.html         Interactive HTML
//     ├── full.json              All findings structured
//     ├── snapshot.json          For diff comparison
//     ├── csv/
//     │   ├── exact-duplicates.csv
//     │   ├── intra-section.csv
//     │   ├── translation-mismatch.csv
//     │   └── vocab-overlap.csv
//     └── previous-snapshot.json (after first run, used for diff)

const fs = require('fs');
const path = require('path');
const sucrase = require('sucrase');
const Module = require('module');

const ROOT = path.resolve(__dirname, '../..');
const OUTPUT_DIR = path.join(ROOT, 'audit-content');
const SNAPSHOT_PATH = path.join(OUTPUT_DIR, 'snapshot.json');
const PREVIOUS_SNAPSHOT_PATH = path.join(OUTPUT_DIR, 'previous-snapshot.json');

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const DIFF_MODE = args.includes('--diff');
const NO_CSV = args.includes('--no-csv');
const NO_HTML = args.includes('--no-html');

// ============================================================================
// SETUP MODULE RESOLUTION + SUCRASE TRANSFORM
// ============================================================================

const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith('@/')) {
    return origResolve.call(this, path.join(ROOT, request.slice(2)), ...rest);
  }
  return origResolve.call(this, request, ...rest);
};

const origCompile = Module.prototype._compile;
Module.prototype._compile = function (code, filename) {
  if ((filename.endsWith('.js') || filename.endsWith('.jsx')) &&
      (filename.includes('/data/') || filename.includes('/lib/'))) {
    try {
      code = sucrase.transform(code, { transforms: ['imports', 'jsx'] }).code;
    } catch (e) { /* fall through */ }
  }
  return origCompile.call(this, code, filename);
};

// ============================================================================
// IMPORT MODULES
// ============================================================================

const { loadAllSources } = require('./loaders');
const {
  detectExactDuplicates, detectVocabOverlap, detectIntraSectionDup,
  detectTranslationMismatch, detectSemanticSimilar, detectDistractorReuse,
  detectPositionBias, detectHarakatInconsistency, detectOrphanVocab,
  detectMissingLatin, computeStats,
} = require('./analyzers');
const {
  renderMarkdown, exactDupsCSV, intraSectionCSV, translationCSV,
  vocabOverlapCSV, fullJSON, htmlDashboard, generateDiff,
} = require('./reporters');

// ============================================================================
// MAIN RUN
// ============================================================================

console.log('🔍 Audit Konten Tulis Noon — Comprehensive\n');

console.log('📂 Loading sources...');
const { allItems, sourceStats } = loadAllSources(ROOT);
console.log(`✓ Loaded ${allItems.length} items from ${Object.keys(sourceStats).length} sources\n`);

console.log('🔬 Running analyzers...');
const stats = computeStats(allItems);
console.log(`  ✓ Stats computed`);

const exactDups = detectExactDuplicates(allItems);
console.log(`  ✓ Exact duplicates: ${exactDups.length}`);

const vocabOverlap = detectVocabOverlap(allItems);
console.log(`  ✓ Vocab overlap cross-section: ${vocabOverlap.length} unique`);

const intraSection = detectIntraSectionDup(allItems);
console.log(`  ✓ Intra-section duplikat: ${intraSection.length}`);

const translationMismatch = detectTranslationMismatch(allItems);
console.log(`  ✓ Translation mismatch: ${translationMismatch.length}`);

const semanticSimilar = detectSemanticSimilar(allItems);
console.log(`  ✓ Semantic similar: ${semanticSimilar.length}`);

const distractorReuse = detectDistractorReuse(allItems);
console.log(`  ✓ Distractor reuse: ${distractorReuse.length}`);

const positionBias = detectPositionBias(allItems);
console.log(`  ✓ Position bias: ${positionBias.length} biased sources`);

const harakatInconsistency = detectHarakatInconsistency(allItems);
console.log(`  ✓ Harakat inconsistency: ${harakatInconsistency.length}`);

const orphanVocab = detectOrphanVocab(allItems);
console.log(`  ✓ Orphan vocab: ${orphanVocab.length}`);

const missingLatin = detectMissingLatin(allItems);
console.log(`  ✓ Missing Latin: ${missingLatin.length}`);

const audit = {
  runDate: new Date().toISOString().slice(0, 10),
  runTime: new Date().toISOString(),
  allItems,
  stats,
  exactDups,
  vocabOverlap,
  intraSection,
  translationMismatch,
  semanticSimilar,
  distractorReuse,
  positionBias,
  harakatInconsistency,
  orphanVocab,
  missingLatin,
};

// ============================================================================
// DIFF MODE (compare with previous snapshot)
// ============================================================================

let diffResult = null;
if (DIFF_MODE || fs.existsSync(SNAPSHOT_PATH)) {
  diffResult = generateDiff(audit, SNAPSHOT_PATH);
}

// ============================================================================
// WRITE OUTPUTS
// ============================================================================

console.log('\n📝 Writing outputs...');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Markdown report
const mdPath = path.join(OUTPUT_DIR, 'report.md');
fs.writeFileSync(mdPath, renderMarkdown(audit));
console.log(`  ✓ ${path.relative(ROOT, mdPath)}`);

// JSON full
const jsonPath = path.join(OUTPUT_DIR, 'full.json');
fs.writeFileSync(jsonPath, fullJSON(audit));
console.log(`  ✓ ${path.relative(ROOT, jsonPath)}`);

// Snapshot (untuk diff next time) — minimal data
const snapshot = {
  runDate: audit.runDate,
  runTime: audit.runTime,
  stats: audit.stats,
  findings: {
    exactDuplicates: exactDups.map((d) => ({ key: d.key, count: d.count })),
    intraSection: intraSection.map((d) => ({ source: d.source, arab: d.arab, count: d.count })),
  },
};
// Sebelum overwrite snapshot, simpan yang lama untuk diff
if (fs.existsSync(SNAPSHOT_PATH)) {
  fs.copyFileSync(SNAPSHOT_PATH, PREVIOUS_SNAPSHOT_PATH);
}
fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2));
console.log(`  ✓ ${path.relative(ROOT, SNAPSHOT_PATH)}`);

// CSV outputs
if (!NO_CSV) {
  const csvDir = path.join(OUTPUT_DIR, 'csv');
  if (!fs.existsSync(csvDir)) fs.mkdirSync(csvDir);
  fs.writeFileSync(path.join(csvDir, 'exact-duplicates.csv'), exactDupsCSV(exactDups));
  fs.writeFileSync(path.join(csvDir, 'intra-section.csv'), intraSectionCSV(intraSection));
  fs.writeFileSync(path.join(csvDir, 'translation-mismatch.csv'), translationCSV(translationMismatch));
  fs.writeFileSync(path.join(csvDir, 'vocab-overlap.csv'), vocabOverlapCSV(vocabOverlap));
  console.log(`  ✓ ${path.relative(ROOT, csvDir)}/ (4 files)`);
}

// HTML dashboard
if (!NO_HTML) {
  const htmlPath = path.join(OUTPUT_DIR, 'dashboard.html');
  fs.writeFileSync(htmlPath, htmlDashboard(audit));
  console.log(`  ✓ ${path.relative(ROOT, htmlPath)}`);
}

// ============================================================================
// CONSOLE SUMMARY
// ============================================================================

console.log('\n' + '═'.repeat(60));
console.log('AUDIT SUMMARY');
console.log('═'.repeat(60));
console.log(`Total items:              ${stats.total.toLocaleString('id-ID')}`);
console.log(`Sources loaded:           ${Object.keys(stats.bySource).length}`);
console.log('');
console.log('FINDINGS:');
console.log(`  🔴 Exact duplicates:        ${exactDups.length}`);
console.log(`  🔴 Intra-section dup:       ${intraSection.length}`);
console.log(`  🟠 Translation mismatch:    ${translationMismatch.length}`);
console.log(`  🟠 Distractor reuse:        ${distractorReuse.length}`);
console.log(`  🟠 Position bias:           ${positionBias.length} sources`);
console.log(`  🟠 Harakat inconsistency:   ${harakatInconsistency.length}`);
console.log(`  🟡 Vocab overlap:           ${vocabOverlap.length} unique words`);
console.log(`  🟡 Semantic similar:        ${semanticSimilar.length}`);
console.log(`  🟡 Orphan vocab:            ${orphanVocab.length}`);
console.log(`  🟢 Missing Latin:           ${missingLatin.length}`);

if (diffResult && diffResult.hasPrevious) {
  console.log('\n' + '─'.repeat(60));
  console.log('DIFF vs PREVIOUS RUN');
  console.log('─'.repeat(60));
  console.log(`Previous run:             ${diffResult.previousDate}`);
  console.log(`Exact dup before:         ${diffResult.exactDupsBefore}`);
  console.log(`Exact dup after:          ${diffResult.exactDupsAfter}`);
  console.log(`Fixed:                    ${diffResult.fixedKeys.length}`);
  console.log(`Newly added:              ${diffResult.addedKeys.length}`);
  console.log(`Net change:               ${diffResult.netChange > 0 ? '+' : ''}${diffResult.netChange}`);
}

console.log('\n' + '═'.repeat(60));
console.log(`📁 Output directory: ${path.relative(ROOT, OUTPUT_DIR)}/`);
console.log('═'.repeat(60));
console.log('\nOpen dashboard:  open audit-content/dashboard.html');
console.log('Read report:     open audit-content/report.md');
console.log('CSV for Excel:   ls audit-content/csv/');
