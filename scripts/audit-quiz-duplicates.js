// scripts/audit-quiz-duplicates.js
//
// Audit semua kuis & soal di seluruh app untuk deteksi:
//   1. Soal duplikat persis (Arab + Indo sama) di file beda
//   2. Vocab/frasa yang diuji multiple kali (mungkin intentional spaced repetition,
//      atau mungkin lazy copy-paste)
//   3. Intra-file duplikat (dalam 1 file ada soal sama)
//
// Run: node scripts/audit-quiz-duplicates.js [--verbose]
//
// Output:
//   - Console summary (count per source, collision count)
//   - audit-quiz-report.md di workspace root

const fs = require('fs');
const path = require('path');
const sucrase = require('sucrase');
const Module = require('module');

const ROOT = path.join(__dirname, '..');
const VERBOSE = process.argv.includes('--verbose');

// Patch @/ alias supaya bisa require data files
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith('@/')) {
    return origResolve.call(this, path.join(ROOT, request.slice(2)), ...rest);
  }
  return origResolve.call(this, request, ...rest);
};

// Sucrase transform on require for JSX/ES modules
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
// NORMALIZATION
// ============================================================================

// Strip harakat (tanwin, fatha, kasra, dhamma, sukun, shaddah, dst)
// Range Unicode harakat: U+064B–U+065F, U+0670, U+06D6–U+06ED
function stripHarakat(s) {
  return String(s || '').replace(/[ً-ٰٟۖ-ۭ]/g, '');
}

function normalizeArabic(s) {
  return stripHarakat(s).trim()
    .replace(/[ـ]/g, '') // tatweel
    .replace(/\s+/g, ' ')
    .replace(/[؟?!.,،]/g, '');
}

function normalizeText(s) {
  return String(s || '').trim().toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?!.,]/g, '');
}

// Canonical key untuk deteksi duplikat
function quizKey(arabic, indo) {
  const arab = normalizeArabic(arabic);
  const id = normalizeText(indo);
  return `${arab}::${id}`;
}

// ============================================================================
// LOAD DATA SOURCES
// ============================================================================

const sources = [];

function tryLoad(label, relPath) {
  try {
    const mod = require(path.join(ROOT, relPath));
    sources.push({ label, file: relPath, mod });
    return mod;
  } catch (e) {
    console.warn(`  ⚠️ skip ${relPath}: ${e.message.split('\n')[0]}`);
    return null;
  }
}

console.log('📂 Loading data sources...');
tryLoad('Tebak Gambar',      'data/tebak-gambar-levels.js');
tryLoad('Cerita',            'data/cerita-stories.js');
tryLoad('Perkenalan Diri',   'data/perkenalan-diri-materi.js');
tryLoad('Lesson Umrah',      'data/learning-umrah.js');
tryLoad('Lesson Profesional','data/learning-profesional.js');
tryLoad('Lesson Pelajar',    'data/learning-pelajar.js');
tryLoad('Nahwu',             'data/learning-nahwu.js');
tryLoad('Shorf',             'data/learning-shorf.js');
tryLoad('Tulis Arab',        'data/tulis-arab-levels.js');
tryLoad('Challenge',         'data/challenge-levels.js');
tryLoad('Match',             'data/match-questions.js');
tryLoad('Ngomong',           'data/ngomong-materi.js');
console.log(`✓ Loaded ${sources.length} sources\n`);

// ============================================================================
// EXTRACT QUIZ ITEMS
// ============================================================================

// Format soal yang diekstrak: { source, location, type, arabic, indo, latin, raw }
const allItems = [];

function pushItem(source, location, type, arabic, indo, latin, raw) {
  if (!arabic && !indo) return;
  allItems.push({
    source, location, type,
    arabic: arabic || '',
    indo: indo || '',
    latin: latin || '',
    key: quizKey(arabic, indo),
    raw,
  });
}

function extractTebakGambar(mod) {
  const levels = mod.TEBAK_GAMBAR_LEVELS || [];
  levels.forEach((lvl) => {
    (lvl.items || []).forEach((item) => {
      pushItem('Tebak Gambar', `${lvl.id} / ${item.latin}`, 'vocab',
        item.arabic, item.id, item.latin, item);
    });
  });
}

function extractCerita(mod) {
  const stories = mod.CERITA_STORIES || mod.STORIES || mod.default || [];
  if (!Array.isArray(stories)) return;
  stories.forEach((story) => {
    (story.quiz || []).forEach((q, qi) => {
      const correctIdx = q.correctIdx ?? q.correct ?? 0;
      const ar = q.ar || (q.choices?.[correctIdx]) || '';
      const indo = q.q || q.question || '';
      pushItem('Cerita', `${story.id || story.title} / quiz#${qi}`, 'quiz-mc',
        ar, indo, q.latin || '', q);
    });
    (story.vocab || []).forEach((v) => {
      pushItem('Cerita', `${story.id || story.title} / vocab`, 'vocab',
        v.ar || v.arabic, v.id || v.meaning, v.latin || '', v);
    });
  });
}

function extractPerkenalan(mod) {
  const list = mod.PERKENALAN_MATERI || mod.MATERI || Object.values(mod)[0] || [];
  if (!Array.isArray(list)) return;
  list.forEach((m) => {
    (m.quiz || []).forEach((q, qi) => {
      const ar = q.ar || q.arabic || q.question || '';
      const correctIdx = q.correct ?? q.correctIdx ?? 0;
      const indo = q.options?.[correctIdx] || q.id || q.indonesia || '';
      pushItem('Perkenalan Diri', `${m.id} / quiz#${qi}`, 'quiz-mc',
        ar, indo, q.latin || '', q);
    });
    (m.vocab || []).forEach((v) => {
      pushItem('Perkenalan Diri', `${m.id} / vocab`, 'vocab',
        v.ar || v.arabic, v.id || v.indonesia, v.latin || '', v);
    });
  });
}

function extractLesson(label, mod) {
  // Find first array property
  const arr = Object.values(mod).find((v) => Array.isArray(v)) || [];
  arr.forEach((modul) => {
    // Vocab di modul
    (modul.vocab || []).forEach((v) => {
      pushItem(label, `${modul.id} / vocab`, 'vocab',
        v.ar || v.arabic, v.id || v.indonesia, v.latin || '', v);
    });
    // Conversations — ekstrak frasa Arab
    (modul.conversations || []).forEach((conv, ci) => {
      (conv.lines || []).forEach((line, li) => {
        if (line.ar && line.id) {
          pushItem(label, `${modul.id} / conv${ci}.line${li}`, 'phrase',
            line.ar, line.id, line.latin || '', line);
        }
      });
    });
    // Quiz embedded
    (modul.quiz || []).forEach((q, qi) => {
      const ar = q.ar || q.question || '';
      const correctIdx = q.correct ?? q.correctIdx ?? 0;
      const indo = q.options?.[correctIdx] || q.id || '';
      pushItem(label, `${modul.id} / quiz#${qi}`, 'quiz-mc',
        ar, indo, q.latin || '', q);
    });
  });
}

function extractNahwuShorf(label, mod) {
  const arr = Object.values(mod).find((v) => Array.isArray(v)) || [];
  arr.forEach((lesson) => {
    (lesson.quiz || []).forEach((q, qi) => {
      const ar = q.ar || q.question || '';
      const correctIdx = q.correct ?? q.correctIdx ?? 0;
      const indo = q.options?.[correctIdx] || q.id || q.explanation || '';
      pushItem(label, `${lesson.id} / quiz#${qi}`, 'quiz-mc',
        ar, indo, q.latin || '', q);
    });
    (lesson.examples || []).forEach((ex, ei) => {
      pushItem(label, `${lesson.id} / example#${ei}`, 'example',
        ex.ar || ex.arabic, ex.id || ex.indonesia, ex.latin || '', ex);
    });
  });
}

function extractTulisArab(mod) {
  const phases = mod.TULIS_ARAB_PHASES || [];
  phases.forEach((phase) => {
    (phase.levels || []).forEach((lvl) => {
      (lvl.items || []).forEach((item) => {
        pushItem('Tulis Arab', `${phase.id}-L${lvl.level} / ${item.latin}`, 'tap-letter',
          item.arabic, item.latin, item.latin, item);
      });
    });
  });
}

function extractChallenge(mod) {
  const arr = Object.values(mod).find((v) => Array.isArray(v)) || [];
  arr.forEach((scenario) => {
    (scenario.levels || []).forEach((lvl) => {
      (lvl.questions || []).forEach((q, qi) => {
        const ar = q.ar || '';
        const correctIdx = q.correct ?? 0;
        const indo = q.options?.[correctIdx] || '';
        pushItem('Challenge', `${scenario.id}/L${lvl.level}/q${qi}`, q.type || 'mc',
          ar, indo, q.latin || '', q);
      });
    });
  });
}

function extractMatch(mod) {
  const arr = Object.values(mod).find((v) => Array.isArray(v)) || [];
  arr.forEach((pack, pi) => {
    (pack.questions || pack.pairs || []).forEach((q, qi) => {
      pushItem('Match', `pack#${pi}/q${qi}`, 'match',
        q.ar || q.arabic, q.id || q.indonesia, q.latin || '', q);
    });
  });
}

function extractNgomong(mod) {
  const arr = Object.values(mod).find((v) => Array.isArray(v)) || [];
  arr.forEach((level) => {
    (level.items || []).forEach((item, i) => {
      pushItem('Ngomong', `${level.id}/item${i}`, 'speak',
        item.ar || item.arabic, item.id || item.indonesia, item.latin || '', item);
    });
  });
}

// Run extractors
for (const s of sources) {
  if (s.label === 'Tebak Gambar') extractTebakGambar(s.mod);
  else if (s.label === 'Cerita') extractCerita(s.mod);
  else if (s.label === 'Perkenalan Diri') extractPerkenalan(s.mod);
  else if (s.label.startsWith('Lesson')) extractLesson(s.label, s.mod);
  else if (s.label === 'Nahwu' || s.label === 'Shorf') extractNahwuShorf(s.label, s.mod);
  else if (s.label === 'Tulis Arab') extractTulisArab(s.mod);
  else if (s.label === 'Challenge') extractChallenge(s.mod);
  else if (s.label === 'Match') extractMatch(s.mod);
  else if (s.label === 'Ngomong') extractNgomong(s.mod);
}

// ============================================================================
// ANALYSIS
// ============================================================================

console.log(`📊 Total items extracted: ${allItems.length}\n`);

// Count per source
const bySource = {};
for (const it of allItems) {
  bySource[it.source] = (bySource[it.source] || 0) + 1;
}
console.log('Per source:');
for (const [k, v] of Object.entries(bySource)) {
  console.log(`  ${k.padEnd(25)} ${String(v).padStart(5)} items`);
}

// Group by canonical key (Arab+Indo)
const byKey = {};
for (const it of allItems) {
  if (!it.key || it.key === '::') continue;
  byKey[it.key] = byKey[it.key] || [];
  byKey[it.key].push(it);
}

const duplicateKeys = Object.entries(byKey).filter(([k, items]) => items.length > 1);
console.log(`\n🔁 Duplicate keys (same Arab+Indo appears >1×): ${duplicateKeys.length}`);

// Group by Arab only (vocab overlap across features)
const byArab = {};
for (const it of allItems) {
  const arab = normalizeArabic(it.arabic);
  if (!arab) continue;
  byArab[arab] = byArab[arab] || [];
  byArab[arab].push(it);
}
const arabOverlap = Object.entries(byArab).filter(([k, items]) => {
  const sources = new Set(items.map((i) => i.source));
  return sources.size > 1;
});
console.log(`📚 Vocab Arab muncul di >1 source: ${arabOverlap.length} unique words`);

// CATEGORIZE collisions
const exactDups = []; // same arab AND same indo
const crossSection = []; // same arab, multiple sections (vocab overlap — bisa intentional)
const intraSection = []; // same arab, same section, multiple times

for (const [key, items] of duplicateKeys) {
  exactDups.push({ key, items });
}

for (const [arab, items] of arabOverlap) {
  const sources = new Set(items.map((i) => i.source));
  if (sources.size > 1) {
    crossSection.push({ arab, items, sourceCount: sources.size });
  }
}

for (const [arab, items] of Object.entries(byArab)) {
  if (items.length < 2) continue;
  const bySrc = {};
  items.forEach((i) => { bySrc[i.source] = (bySrc[i.source] || 0) + 1; });
  for (const [src, count] of Object.entries(bySrc)) {
    if (count > 1) {
      intraSection.push({ arab, source: src, count, items: items.filter((i) => i.source === src) });
    }
  }
}

// ============================================================================
// GENERATE REPORT
// ============================================================================

const lines = [];
const ln = (s) => lines.push(s);

ln('# Audit Duplikat Kuis — Tulis Noon');
ln('');
ln(`Tanggal: ${new Date().toISOString().slice(0, 10)}`);
ln(`Total items diaudit: **${allItems.length}**`);
ln('');
ln('## Ringkasan per sumber');
ln('');
ln('| Sumber | Jumlah item |');
ln('|---|---:|');
for (const [k, v] of Object.entries(bySource).sort((a, b) => b[1] - a[1])) {
  ln(`| ${k} | ${v} |`);
}
ln('');
ln('## Kategori Duplikat');
ln('');
ln(`| Tipe | Jumlah |`);
ln(`|---|---:|`);
ln(`| Exact duplicate (Arab + Indo sama persis) | ${exactDups.length} |`);
ln(`| Vocab overlap cross-section (Arab sama, source beda) | ${crossSection.length} unique words |`);
ln(`| Intra-section duplikat (file sama, item sama berulang) | ${intraSection.length} cases |`);
ln('');

ln('---');
ln('');
ln('## 🚨 Exact duplicates — soal sama persis muncul >1×');
ln('');
ln('Ini yang paling jelas masalahnya. User akan ngerasa "kok ini soal sama lagi".');
ln('');
if (exactDups.length === 0) {
  ln('_(Tidak ada exact duplicate.)_');
} else {
  exactDups.slice(0, 50).forEach((d, idx) => {
    const ex = d.items[0];
    ln(`### ${idx + 1}. \`${ex.arabic}\` — _${ex.indo}_`);
    ln('');
    ln(`Muncul ${d.items.length}× di:`);
    d.items.forEach((it) => ln(`- **${it.source}** → \`${it.location}\` (type: ${it.type})`));
    ln('');
  });
  if (exactDups.length > 50) {
    ln(`_(... ${exactDups.length - 50} lebih, lihat verbose mode)_`);
    ln('');
  }
}

ln('---');
ln('');
ln('## 📚 Cross-section vocab overlap');
ln('');
ln('Vocab/frasa Arab sama muncul di multiple section. **Sering kali INTENTIONAL** untuk');
ln('spaced repetition (vocab belajar di Tebak Gambar → ketemu lagi di Cerita).');
ln('Tapi kalau berlebihan (>4 source), mungkin kurang variasi.');
ln('');

const heavyOverlap = crossSection.filter((c) => c.sourceCount >= 3).sort((a, b) => b.sourceCount - a.sourceCount);
ln(`**Vocab di 3+ source berbeda**: ${heavyOverlap.length}`);
ln('');

if (heavyOverlap.length > 0) {
  ln('| Vocab (Arab) | Indonesia | # source | Sources |');
  ln('|---|---|---:|---|');
  heavyOverlap.slice(0, 30).forEach((o) => {
    const sourceNames = [...new Set(o.items.map((i) => i.source))].join(', ');
    const indos = [...new Set(o.items.map((i) => i.indo).filter(Boolean))].slice(0, 2).join(' / ');
    ln(`| \`${o.arab}\` | ${indos} | ${o.sourceCount} | ${sourceNames} |`);
  });
  if (heavyOverlap.length > 30) {
    ln(`| _(... ${heavyOverlap.length - 30} lebih)_ | | | |`);
  }
}

ln('');
ln('---');
ln('');
ln('## 🔂 Intra-section duplikat');
ln('');
ln('Dalam 1 file/section, item sama muncul lebih dari sekali. Ini biasanya');
ln('**bug authoring** — copy-paste tanpa edit. Wajib fix.');
ln('');

if (intraSection.length === 0) {
  ln('_(Tidak ada intra-section duplikat.)_');
} else {
  intraSection.slice(0, 30).forEach((d, idx) => {
    ln(`### ${idx + 1}. [${d.source}] \`${d.arab}\` (${d.count}×)`);
    d.items.forEach((it) => ln(`- \`${it.location}\` — _${it.indo}_`));
    ln('');
  });
  if (intraSection.length > 30) {
    ln(`_(... ${intraSection.length - 30} lebih)_`);
  }
}

ln('');
ln('---');
ln('');
ln('## 💡 Rekomendasi tindakan');
ln('');
ln('1. **Fix dulu exact duplicates** (paling kentara untuk user).');
ln('2. **Cek intra-section duplikat** — kemungkinan besar bug authoring, replace dengan vocab baru.');
ln('3. **Vocab overlap cross-section bisa di-EMBRACE** sebagai spaced repetition,');
ln('   asal disengaja. Kalau 5+ source pakai vocab yang sama, mungkin terlalu banyak.');
ln('4. **Convention**: vocab inti (e.g. السَّلَامُ عَلَيْكُمْ, الْحَمْدُ لِلَّه) WAJAR muncul di banyak tempat.');
ln('   Vocab niche (e.g. مَفْعُول مُطْلَق) seharusnya cukup di Nahwu saja.');
ln('');

// Write report
const reportPath = path.join(ROOT, 'audit-quiz-report.md');
fs.writeFileSync(reportPath, lines.join('\n'));
console.log(`\n📄 Report ditulis ke: ${reportPath}`);
console.log(`\n=== SUMMARY ===`);
console.log(`Total items:           ${allItems.length}`);
console.log(`Exact duplicates:      ${exactDups.length}`);
console.log(`Cross-section overlap: ${crossSection.length} unique vocab`);
console.log(`  (di 3+ source):      ${heavyOverlap.length}`);
console.log(`Intra-section dup:     ${intraSection.length}`);

if (VERBOSE && exactDups.length > 0) {
  console.log('\n=== EXACT DUPLICATES ===');
  exactDups.forEach((d, i) => {
    console.log(`${i+1}. "${d.items[0].arabic}" (${d.items.length}×)`);
    d.items.forEach((it) => console.log(`   - ${it.source} :: ${it.location}`));
  });
}
