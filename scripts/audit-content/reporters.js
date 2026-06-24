// scripts/audit-content/reporters.js
// Multi-format reporters: Markdown, CSV, JSON, HTML dashboard

const fs = require('fs');
const path = require('path');

// ============================================================================
// MARKDOWN REPORT
// ============================================================================

function renderMarkdown(audit) {
  const lines = [];
  const ln = (s) => lines.push(s);

  const { allItems, stats, exactDups, vocabOverlap, intraSection,
          translationMismatch, semanticSimilar, distractorReuse,
          positionBias, harakatInconsistency, orphanVocab, missingLatin, runDate } = audit;

  ln('# 🔍 Audit Konten Tulis Noon — Comprehensive');
  ln('');
  ln(`Tanggal: **${runDate}**`);
  ln(`Total items diaudit: **${allItems.length.toLocaleString('id-ID')}**`);
  ln('');
  ln('## 📊 Statistik Per Source');
  ln('');
  ln('| Source | Items | % dari total |');
  ln('|---|---:|---:|');
  for (const [src, count] of Object.entries(stats.bySource).sort((a, b) => b[1] - a[1])) {
    const pct = ((count / stats.total) * 100).toFixed(1);
    ln(`| ${src} | ${count.toLocaleString('id-ID')} | ${pct}% |`);
  }
  ln('');
  ln('## 🏷️ Per Type Item');
  ln('');
  ln('| Type | Count |');
  ln('|---|---:|');
  for (const [type, count] of Object.entries(stats.byType).sort((a, b) => b[1] - a[1])) {
    ln(`| \`${type}\` | ${count.toLocaleString('id-ID')} |`);
  }
  ln('');
  ln('## 🎯 Ringkasan Temuan');
  ln('');
  ln('| Kategori | Jumlah | Severity |');
  ln('|---|---:|---|');
  ln(`| Exact duplicate (Arab+Indo persis sama) | ${exactDups.length} | 🔴 Tinggi |`);
  ln(`| Intra-section duplikat | ${intraSection.length} | 🔴 Tinggi (lazy authoring) |`);
  ln(`| Translation mismatch | ${translationMismatch.length} | 🟠 Sedang |`);
  ln(`| Vocab overlap cross-section | ${vocabOverlap.length} | 🟡 Rendah (mostly OK) |`);
  ln(`| Semantic similar (beda teks, sama maksud) | ${semanticSimilar.length} | 🟡 Review |`);
  ln(`| Distractor reuse (>5×) | ${distractorReuse.length} | 🟠 Sedang |`);
  ln(`| Position bias (correct answer terbias) | ${positionBias.length} sources | 🟠 Sedang |`);
  ln(`| Harakat inconsistency (<30%) | ${harakatInconsistency.length} | 🟠 Sedang |`);
  ln(`| Orphan vocab (Tebak/Match tanpa konteks lesson) | ${orphanVocab.length} | 🟡 Rendah |`);
  ln(`| Missing transliterasi Latin | ${missingLatin.length} | 🟢 Cosmetic |`);
  ln('');
  ln('---');
  ln('');

  // ============ SECTION 1: EXACT DUPLICATES ============
  ln('## 🚨 1. Exact Duplicates');
  ln('');
  ln('Soal/vocab yang Arab DAN Indonesia-nya sama persis di multiple file. **Wajib fix** — user akan ngerasa "kok sama lagi".');
  ln('');
  if (exactDups.length === 0) {
    ln('_(Tidak ada exact duplicate.)_');
  } else {
    ln(`Total: **${exactDups.length}** duplicate keys`);
    ln('');
    exactDups.slice(0, 30).forEach((d, idx) => {
      ln(`### ${idx + 1}. \`${d.items[0].arabic}\` — _${d.items[0].indo}_`);
      ln('');
      ln(`Muncul **${d.count}×** di:`);
      d.items.forEach((it) => ln(`- **${it.source}** → \`${it.location}\` (${it.type})`));
      ln('');
    });
    if (exactDups.length > 30) ln(`_(... ${exactDups.length - 30} lebih — lihat audit-exact-duplicates.csv)_`);
  }
  ln('');
  ln('---');
  ln('');

  // ============ SECTION 2: INTRA-SECTION DUP ============
  ln('## 🔂 2. Intra-Section Duplikat');
  ln('');
  ln('Vocab/frasa sama muncul lebih dari 1× di FILE/SOURCE yang sama. **Biasanya bug authoring — copy-paste**.');
  ln('');
  if (intraSection.length === 0) {
    ln('_(Tidak ada intra-section duplikat.)_');
  } else {
    ln(`Total: **${intraSection.length}** cases`);
    ln('');
    intraSection.slice(0, 30).forEach((d, idx) => {
      ln(`### ${idx + 1}. [${d.source}] \`${d.arab}\` (${d.count}×)`);
      d.items.forEach((it) => ln(`- \`${it.location}\` — _${it.indo}_`));
      ln('');
    });
    if (intraSection.length > 30) ln(`_(... ${intraSection.length - 30} lebih)_`);
  }
  ln('');
  ln('---');
  ln('');

  // ============ SECTION 3: TRANSLATION MISMATCH ============
  ln('## 🌐 3. Translation Mismatch');
  ln('');
  ln('Vocab Arab sama, tapi terjemahan Indo BEDA di file beda. Bikin user bingung.');
  ln('');
  if (translationMismatch.length === 0) {
    ln('_(Tidak ada mismatch.)_');
  } else {
    ln(`Total: **${translationMismatch.length}**`);
    ln('');
    translationMismatch.slice(0, 30).forEach((t, idx) => {
      ln(`### ${idx + 1}. \`${t.arab}\``);
      ln('');
      ln('Terjemahan berbeda:');
      t.translations.forEach((tr) => ln(`- "${tr}"`));
      ln('');
      ln('Lokasi:');
      t.items.forEach((it) => ln(`- **${it.source}** → \`${it.location}\` → "${it.indo}"`));
      ln('');
    });
    if (translationMismatch.length > 30) ln(`_(... ${translationMismatch.length - 30} lebih)_`);
  }
  ln('');
  ln('---');
  ln('');

  // ============ SECTION 4: VOCAB OVERLAP ============
  ln('## 📚 4. Vocab Overlap Cross-Section');
  ln('');
  ln('Vocab muncul di multiple section. **Mostly intentional** (spaced repetition).');
  ln('');
  ln('Filter: vocab yang muncul di ≥3 source.');
  ln('');
  const heavyOverlap = vocabOverlap.filter((v) => v.sourceCount >= 3);
  if (heavyOverlap.length === 0) {
    ln('_(Tidak ada vocab di 3+ source.)_');
  } else {
    ln('| Arab | # source | Sources |');
    ln('|---|---:|---|');
    heavyOverlap.slice(0, 50).forEach((v) => {
      ln(`| \`${v.arab}\` | ${v.sourceCount} | ${v.sources.join(', ')} |`);
    });
    if (heavyOverlap.length > 50) ln(`| _(... ${heavyOverlap.length - 50} lebih)_ | | |`);
  }
  ln('');
  ln('---');
  ln('');

  // ============ SECTION 5: SEMANTIC SIMILAR ============
  ln('## 🧠 5. Semantic Similar (beda teks, mungkin sama maksud)');
  ln('');
  ln('Setelah strip kata tanya umum, sisa teks Arab sama. Bisa redundant.');
  ln('');
  if (semanticSimilar.length === 0) {
    ln('_(Tidak ada semantic similar.)_');
  } else {
    ln(`Total: **${semanticSimilar.length}**`);
    ln('');
    semanticSimilar.slice(0, 20).forEach((s, idx) => {
      ln(`### ${idx + 1}. Semantic key: \`${s.semanticKey}\``);
      ln('');
      ln('Variant Arab:');
      s.variants.forEach((v) => ln(`- \`${v}\``));
      ln('');
      ln('Lokasi:');
      s.items.forEach((it) => ln(`- **${it.source}** → \`${it.location}\` — "${it.indo}"`));
      ln('');
    });
    if (semanticSimilar.length > 20) ln(`_(... ${semanticSimilar.length - 20} lebih)_`);
  }
  ln('');
  ln('---');
  ln('');

  // ============ SECTION 6: DISTRACTOR REUSE ============
  ln('## 🎲 6. Distractor Reuse');
  ln('');
  ln('Distractor (pilihan salah) dipakai ≥5×. Bikin pattern predictable.');
  ln('');
  if (distractorReuse.length === 0) {
    ln('_(Tidak ada distractor over-reused.)_');
  } else {
    ln('| Distractor | Count | Top sources |');
    ln('|---|---:|---|');
    distractorReuse.slice(0, 30).forEach((d) => {
      const topSrcs = [...new Set(d.items.map((i) => i.source))].slice(0, 4).join(', ');
      ln(`| \`${d.distractor}\` | ${d.count} | ${topSrcs} |`);
    });
    if (distractorReuse.length > 30) ln(`| _(... ${distractorReuse.length - 30} lebih)_ | | |`);
  }
  ln('');
  ln('---');
  ln('');

  // ============ SECTION 7: POSITION BIAS ============
  ln('## 🎯 7. Position Bias (correct answer pattern)');
  ln('');
  ln('Distribusi posisi jawaban benar per source. Kalau biased, user bisa "cheat by pattern".');
  ln('');
  if (positionBias.length === 0) {
    ln('_(Tidak ada bias signifikan.)_');
  } else {
    positionBias.forEach((b) => {
      ln(`### ${b.source} (${b.total} kuis)`);
      ln('');
      ln('| Posisi (index) | Count | Ratio |');
      ln('|---:|---:|---:|');
      Object.entries(b.positions).sort((a, b) => Number(a[0]) - Number(b[0])).forEach(([pos, count]) => {
        ln(`| ${pos} | ${count} | ${((count / b.total) * 100).toFixed(1)}% |`);
      });
      ln('');
    });
  }
  ln('');
  ln('---');
  ln('');

  // ============ SECTION 8: HARAKAT INCONSISTENCY ============
  ln('## 🔣 8. Harakat Inconsistency');
  ln('');
  ln('Item dengan harakat ratio rendah (<30%). User Indonesia butuh harakat lengkap untuk baca.');
  ln('');
  if (harakatInconsistency.length === 0) {
    ln('_(Semua item harakat-nya cukup.)_');
  } else {
    ln(`Total: **${harakatInconsistency.length}** items`);
    ln('');
    ln('| Source | Lokasi | Arab | Ratio harakat |');
    ln('|---|---|---|---:|');
    harakatInconsistency.slice(0, 50).forEach((h) => {
      const arSnip = h.arabic.length > 40 ? h.arabic.slice(0, 40) + '...' : h.arabic;
      ln(`| ${h.source} | \`${h.location}\` | ${arSnip} | ${(h.harakatRatio * 100).toFixed(0)}% |`);
    });
    if (harakatInconsistency.length > 50) ln(`| _(... ${harakatInconsistency.length - 50} lebih)_ | | | |`);
  }
  ln('');
  ln('---');
  ln('');

  // ============ SECTION 9: ORPHAN VOCAB ============
  ln('## 🪦 9. Orphan Vocab (Tebak Gambar tanpa konteks)');
  ln('');
  ln('Vocab di Tebak Gambar / Match yang tidak pernah muncul di Lesson / Cerita manapun. User belajar tanpa konteks.');
  ln('');
  if (orphanVocab.length === 0) {
    ln('_(Semua vocab punya konteks di lesson.)_');
  } else {
    ln(`Total: **${orphanVocab.length}** orphan items`);
    ln('');
    ln('| Source | Arab | Indo |');
    ln('|---|---|---|');
    orphanVocab.slice(0, 30).forEach((o) => {
      ln(`| ${o.source} | \`${o.arabic}\` | ${o.indo} |`);
    });
    if (orphanVocab.length > 30) ln(`| _(... ${orphanVocab.length - 30} lebih)_ | | |`);
  }
  ln('');
  ln('---');
  ln('');

  // ============ SECTION 10: MISSING LATIN ============
  ln('## 🆎 10. Missing Latin Transliterasi');
  ln('');
  ln('Item yang gak punya Latin. Bikin UX inconsistent (sebagian punya, sebagian gak).');
  ln('');
  if (missingLatin.length === 0) {
    ln('_(Semua item punya Latin.)_');
  } else {
    ln(`Total: **${missingLatin.length}** items`);
    ln('');
    const grouped = {};
    for (const m of missingLatin) {
      grouped[m.source] = (grouped[m.source] || 0) + 1;
    }
    ln('| Source | Missing |');
    ln('|---|---:|');
    Object.entries(grouped).sort((a, b) => b[1] - a[1]).forEach(([src, n]) => ln(`| ${src} | ${n} |`));
  }
  ln('');
  ln('---');
  ln('');

  ln('## 💡 Rekomendasi Aksi');
  ln('');
  ln('1. **Fix intra-section dup dulu** — paling lazy, paling kentara.');
  ln('2. **Resolve translation mismatch** — pilih 1 terjemahan canonical per vocab.');
  ln('3. **Cek position bias** — kalau >70% jawaban di posisi B, randomize.');
  ln('4. **Lengkapi harakat** — untuk item yang kurang.');
  ln('5. **Tambah Latin** di item yang missing (kalau bukan exempt type).');
  ln('6. **Embrace cross-section overlap** sebagai spaced repetition — gak perlu di-fix.');
  ln('7. **Orphan vocab**: bikin lesson tambahan yang cover vocab Tebak Gambar yang belum diajar.');

  return lines.join('\n');
}

// ============================================================================
// CSV REPORTS
// ============================================================================

function csvEscape(s) {
  if (s == null) return '';
  const str = String(s);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function exactDupsCSV(exactDups) {
  const rows = ['arabic,indo,count,sources,locations'];
  for (const d of exactDups) {
    const ex = d.items[0];
    rows.push([
      csvEscape(ex.arabic),
      csvEscape(ex.indo),
      d.count,
      csvEscape(d.items.map((i) => i.source).join(' | ')),
      csvEscape(d.items.map((i) => i.location).join(' | ')),
    ].join(','));
  }
  return rows.join('\n');
}

function intraSectionCSV(intra) {
  const rows = ['source,arabic,count,locations'];
  for (const d of intra) {
    rows.push([
      csvEscape(d.source),
      csvEscape(d.arab),
      d.count,
      csvEscape(d.items.map((i) => `${i.location} (${i.indo})`).join(' | ')),
    ].join(','));
  }
  return rows.join('\n');
}

function translationCSV(mismatches) {
  const rows = ['arabic,translations,locations'];
  for (const m of mismatches) {
    rows.push([
      csvEscape(m.arab),
      csvEscape(m.translations.join(' | ')),
      csvEscape(m.items.map((i) => `${i.source}/${i.location}: ${i.indo}`).join(' | ')),
    ].join(','));
  }
  return rows.join('\n');
}

function vocabOverlapCSV(overlap) {
  const rows = ['arabic,source_count,sources,sample_indo'];
  for (const v of overlap) {
    const indos = [...new Set(v.items.map((i) => i.indo).filter(Boolean))].slice(0, 3);
    rows.push([
      csvEscape(v.arab),
      v.sourceCount,
      csvEscape(v.sources.join(' | ')),
      csvEscape(indos.join(' | ')),
    ].join(','));
  }
  return rows.join('\n');
}

// ============================================================================
// JSON OUTPUT (full structured)
// ============================================================================

function fullJSON(audit) {
  return JSON.stringify({
    runDate: audit.runDate,
    stats: audit.stats,
    findings: {
      exactDuplicates: audit.exactDups,
      vocabOverlap: audit.vocabOverlap.slice(0, 100),
      intraSection: audit.intraSection,
      translationMismatch: audit.translationMismatch,
      semanticSimilar: audit.semanticSimilar.slice(0, 50),
      distractorReuse: audit.distractorReuse.slice(0, 50),
      positionBias: audit.positionBias,
      harakatInconsistency: audit.harakatInconsistency.slice(0, 200),
      orphanVocab: audit.orphanVocab.slice(0, 200),
      missingLatin: audit.missingLatin.slice(0, 200),
    },
  }, null, 2);
}

// ============================================================================
// HTML DASHBOARD
// ============================================================================

function htmlDashboard(audit) {
  const { stats, exactDups, vocabOverlap, intraSection, translationMismatch,
          semanticSimilar, distractorReuse, positionBias, harakatInconsistency,
          orphanVocab, missingLatin, runDate } = audit;

  const summaryCards = [
    { label: 'Total items', value: stats.total.toLocaleString('id-ID'), color: '#0a4d3c' },
    { label: 'Exact dup', value: exactDups.length, color: '#a02020' },
    { label: 'Intra-section dup', value: intraSection.length, color: '#a02020' },
    { label: 'Translation mismatch', value: translationMismatch.length, color: '#d97706' },
    { label: 'Vocab overlap', value: vocabOverlap.length, color: '#0a4d3c' },
    { label: 'Semantic similar', value: semanticSimilar.length, color: '#d97706' },
    { label: 'Distractor reuse', value: distractorReuse.length, color: '#d97706' },
    { label: 'Harakat low', value: harakatInconsistency.length, color: '#d97706' },
    { label: 'Orphan vocab', value: orphanVocab.length, color: '#8b6b3d' },
    { label: 'Missing Latin', value: missingLatin.length, color: '#8b6b3d' },
  ];

  const sourceRows = Object.entries(stats.bySource).sort((a, b) => b[1] - a[1]).map(([src, n]) =>
    `<tr><td>${src}</td><td style="text-align:right">${n.toLocaleString('id-ID')}</td><td style="text-align:right">${((n / stats.total) * 100).toFixed(1)}%</td></tr>`
  ).join('');

  const intraRows = intraSection.slice(0, 100).map((d) =>
    `<tr><td>${escapeHtml(d.source)}</td><td dir="rtl" style="font-family: Amiri, serif; font-size: 18px">${escapeHtml(d.arab)}</td><td>${d.count}</td><td>${escapeHtml(d.items.map((i) => i.location).join(' • '))}</td></tr>`
  ).join('');

  const exactRows = exactDups.slice(0, 100).map((d) => {
    const ex = d.items[0];
    return `<tr><td dir="rtl" style="font-family: Amiri, serif; font-size: 18px">${escapeHtml(ex.arabic)}</td><td>${escapeHtml(ex.indo)}</td><td>${d.count}</td><td>${escapeHtml(d.items.map((i) => `${i.source}/${i.location}`).join(' • '))}</td></tr>`;
  }).join('');

  return `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<title>Audit Konten — Tulis Noon</title>
<style>
  body { font-family: -apple-system, Segoe UI, sans-serif; max-width: 1200px; margin: 24px auto; padding: 0 24px; background: #faf6ee; color: #1a1a1a; }
  h1 { color: #0a4d3c; font-family: serif; font-weight: 700; }
  h2 { color: #0a4d3c; border-bottom: 2px solid #c9a961; padding-bottom: 4px; margin-top: 36px; }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin: 16px 0; }
  .card { background: white; border-radius: 12px; padding: 16px; border: 1px solid rgba(10,77,60,0.1); }
  .card .label { font-size: 11px; color: #8b6b3d; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .card .value { font-size: 26px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; margin: 12px 0; font-size: 13px; }
  th { background: #0a4d3c; color: white; text-align: left; padding: 8px 12px; font-weight: 500; }
  td { padding: 8px 12px; border-top: 1px solid #f0eadd; }
  tr:hover td { background: #faf6ee; }
  .meta { color: #8b6b3d; font-size: 12px; margin-bottom: 24px; }
  details { background: white; padding: 12px 16px; border-radius: 12px; margin: 8px 0; border: 1px solid rgba(10,77,60,0.08); }
  summary { cursor: pointer; font-weight: 500; }
</style>
</head><body>
<h1>🔍 Audit Konten Tulis Noon</h1>
<p class="meta">Generated: ${runDate} • Total items: ${stats.total.toLocaleString('id-ID')}</p>

<h2>📊 Summary</h2>
<div class="cards">
${summaryCards.map((c) => `<div class="card"><div class="label">${c.label}</div><div class="value" style="color:${c.color}">${c.value}</div></div>`).join('\n')}
</div>

<h2>📁 Per Source</h2>
<table><thead><tr><th>Source</th><th style="text-align:right">Items</th><th style="text-align:right">% of total</th></tr></thead><tbody>${sourceRows}</tbody></table>

<h2>🔂 Intra-Section Duplikat (top 100)</h2>
<table><thead><tr><th>Source</th><th>Arab</th><th>Count</th><th>Lokasi</th></tr></thead><tbody>${intraRows || '<tr><td colspan="4">No data</td></tr>'}</tbody></table>

<h2>🚨 Exact Duplikat (top 100)</h2>
<table><thead><tr><th>Arab</th><th>Indo</th><th>Count</th><th>Lokasi</th></tr></thead><tbody>${exactRows || '<tr><td colspan="4">No data</td></tr>'}</tbody></table>

<h2>💡 Aksi Rekomendasi</h2>
<ol>
<li><strong>Fix intra-section duplikat dulu</strong> — paling kentara user.</li>
<li><strong>Resolve translation mismatch</strong> — pilih canonical translation per vocab.</li>
<li><strong>Cek position bias</strong> di kuis MC.</li>
<li><strong>Lengkapi harakat</strong> untuk item yang kurang.</li>
<li><strong>Embrace cross-section overlap</strong> sebagai spaced repetition.</li>
</ol>

<p style="margin-top:48px; color:#8b6b3d; font-size:11px; text-align:center;">
Generated by scripts/audit-content/ • <a href="audit-content-report.md" style="color:#0a4d3c">Full markdown report</a>
</p>
</body></html>`;
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ============================================================================
// DIFF MODE
// ============================================================================

function generateDiff(currentAudit, previousAuditPath) {
  if (!fs.existsSync(previousAuditPath)) {
    return { hasPrevious: false, message: 'No previous audit found.' };
  }
  const prev = JSON.parse(fs.readFileSync(previousAuditPath, 'utf8'));

  const curExact = new Set(currentAudit.exactDups.map((d) => d.key));
  const prevExact = new Set((prev.findings.exactDuplicates || []).map((d) => d.key));

  const fixed = [...prevExact].filter((k) => !curExact.has(k));
  const added = [...curExact].filter((k) => !prevExact.has(k));

  return {
    hasPrevious: true,
    previousDate: prev.runDate,
    exactDupsBefore: prevExact.size,
    exactDupsAfter: curExact.size,
    fixedKeys: fixed,
    addedKeys: added,
    netChange: curExact.size - prevExact.size,
  };
}

// ============================================================================
// EXPORT
// ============================================================================

module.exports = {
  renderMarkdown,
  exactDupsCSV,
  intraSectionCSV,
  translationCSV,
  vocabOverlapCSV,
  fullJSON,
  htmlDashboard,
  generateDiff,
};
