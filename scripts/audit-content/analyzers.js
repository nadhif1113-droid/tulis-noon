// scripts/audit-content/analyzers.js
// Quality analyzers — duplicate detection, distractor reuse, position bias, harakat consistency

const { quizKey, arabKey, semanticKey, normalizeArabic, normalizeText, harakatRatio } = require('./normalize');

// ============================================================================
// DUPLICATE DETECTION
// ============================================================================

function detectExactDuplicates(allItems) {
  const byKey = {};
  for (const it of allItems) {
    const k = quizKey(it.arabic, it.indo);
    if (k === '::') continue;
    byKey[k] = byKey[k] || [];
    byKey[k].push(it);
  }
  return Object.entries(byKey)
    .filter(([k, items]) => items.length > 1)
    .map(([k, items]) => ({ key: k, items, count: items.length }))
    .sort((a, b) => b.count - a.count);
}

function detectVocabOverlap(allItems) {
  // Vocab Arab sama di multiple source
  const byArab = {};
  for (const it of allItems) {
    const k = arabKey(it.arabic);
    if (!k) continue;
    byArab[k] = byArab[k] || [];
    byArab[k].push(it);
  }
  return Object.entries(byArab)
    .filter(([k, items]) => {
      const sources = new Set(items.map((i) => i.source));
      return sources.size > 1;
    })
    .map(([k, items]) => ({
      arab: k,
      items,
      sourceCount: new Set(items.map((i) => i.source)).size,
      sources: [...new Set(items.map((i) => i.source))],
    }))
    .sort((a, b) => b.sourceCount - a.sourceCount);
}

function detectIntraSectionDup(allItems) {
  // Vocab Arab sama dalam source yang sama, lebih dari 1×
  const bySrcArab = {};
  for (const it of allItems) {
    const k = `${it.source}::${arabKey(it.arabic)}`;
    if (k.endsWith('::')) continue;
    bySrcArab[k] = bySrcArab[k] || [];
    bySrcArab[k].push(it);
  }
  return Object.entries(bySrcArab)
    .filter(([k, items]) => items.length > 1)
    .map(([k, items]) => ({
      source: items[0].source,
      arab: arabKey(items[0].arabic),
      items,
      count: items.length,
    }))
    .sort((a, b) => b.count - a.count);
}

function detectTranslationMismatch(allItems) {
  // Vocab Arab sama tapi terjemahan Indonesia BERBEDA
  const byArab = {};
  for (const it of allItems) {
    const k = arabKey(it.arabic);
    if (!k || !it.indo) continue;
    byArab[k] = byArab[k] || [];
    byArab[k].push(it);
  }
  return Object.entries(byArab)
    .filter(([k, items]) => {
      const translations = new Set(items.map((i) => normalizeText(i.indo)));
      return translations.size > 1 && items.length > 1;
    })
    .map(([k, items]) => ({
      arab: k,
      items,
      translations: [...new Set(items.map((i) => i.indo))],
    }))
    .sort((a, b) => b.items.length - a.items.length);
}

function detectSemanticSimilar(allItems) {
  // Frasa beda tapi semantic key sama (intent serupa)
  const bySemantic = {};
  for (const it of allItems) {
    const k = semanticKey(it.arabic);
    if (!k) continue;
    bySemantic[k] = bySemantic[k] || [];
    bySemantic[k].push(it);
  }
  return Object.entries(bySemantic)
    .filter(([k, items]) => {
      const exactKeys = new Set(items.map((i) => normalizeArabic(i.arabic)));
      // Semantic match tapi exact text BEDA = possibly semantic dup
      return exactKeys.size > 1 && items.length > 1;
    })
    .map(([k, items]) => ({
      semanticKey: k,
      items,
      variants: [...new Set(items.map((i) => i.arabic))],
    }))
    .sort((a, b) => b.items.length - a.items.length);
}

// ============================================================================
// QUALITY CHECKS
// ============================================================================

function detectDistractorReuse(allItems) {
  // Distractor (pilihan salah) yang dipakai >5× lintas soal
  const distractorCount = {};
  for (const it of allItems) {
    const distractors = it.distractors || (it.options ? it.options.filter((_, idx) => idx !== it.correctIdx) : []);
    distractors.forEach((d) => {
      const k = arabKey(d) || normalizeText(d);
      if (!k) return;
      distractorCount[k] = distractorCount[k] || { count: 0, items: [], original: d };
      distractorCount[k].count++;
      distractorCount[k].items.push(it);
    });
  }
  return Object.entries(distractorCount)
    .filter(([k, v]) => v.count >= 5)
    .map(([k, v]) => ({ distractor: v.original, count: v.count, items: v.items }))
    .sort((a, b) => b.count - a.count);
}

function detectPositionBias(allItems) {
  // Per source, correct answer position distribution
  const bySource = {};
  for (const it of allItems) {
    if (it.type !== 'quiz-mc' && it.type !== 'mc') continue;
    if (typeof it.correctIdx !== 'number' || !Array.isArray(it.options) || it.options.length < 2) continue;
    bySource[it.source] = bySource[it.source] || { total: 0, positions: {} };
    bySource[it.source].total++;
    bySource[it.source].positions[it.correctIdx] = (bySource[it.source].positions[it.correctIdx] || 0) + 1;
  }
  return Object.entries(bySource)
    .filter(([k, v]) => v.total >= 5)
    .map(([k, v]) => {
      const expected = 1 / Object.keys(v.positions).length;
      const biased = Object.entries(v.positions).filter(([pos, count]) => {
        const ratio = count / v.total;
        return Math.abs(ratio - expected) > 0.2; // 20% deviasi
      });
      return {
        source: k,
        total: v.total,
        positions: v.positions,
        biased: biased.length > 0,
        biasedDetails: biased.map(([pos, count]) => ({ pos: Number(pos), count, ratio: count / v.total })),
      };
    })
    .filter((b) => b.biased);
}

function detectHarakatInconsistency(allItems) {
  // Item dengan harakat ratio rendah (<0.3) — kurang harakat
  const lowHarakat = [];
  for (const it of allItems) {
    if (!it.arabic || it.type === 'tap-letter') continue;
    const ratio = harakatRatio(it.arabic);
    // Skip kalau cuma satu karakter (e.g. tap-letter)
    if (it.arabic.replace(/\s/g, '').length < 3) continue;
    if (ratio < 0.3) {
      lowHarakat.push({
        ...it,
        harakatRatio: ratio,
      });
    }
  }
  return lowHarakat.sort((a, b) => a.harakatRatio - b.harakatRatio);
}

function detectOrphanVocab(allItems) {
  // Vocab di Tebak Gambar / Match yang gak muncul di Lesson/Cerita manapun
  // = user belajar vocab tanpa konteks dialog
  const taughtArab = new Set();
  for (const it of allItems) {
    if (it.source.startsWith('Lesson') || it.source === 'Cerita' || it.source === 'Perkenalan Diri' || it.source === 'Roleplay') {
      const k = arabKey(it.arabic);
      if (k) taughtArab.add(k);
    }
  }
  const orphans = [];
  for (const it of allItems) {
    if (it.source !== 'Tebak Gambar' && it.source !== 'Match') continue;
    const k = arabKey(it.arabic);
    if (k && !taughtArab.has(k)) {
      orphans.push(it);
    }
  }
  return orphans;
}

function detectMissingLatin(allItems) {
  // Item yang tidak punya transliterasi Latin (inconsistent UX)
  return allItems.filter((it) => {
    if (it.type === 'tap-letter' || it.type === 'ayat') return false; // exempt
    if (!it.arabic || it.arabic.length < 3) return false;
    return !it.latin || it.latin.trim().length === 0;
  });
}

// ============================================================================
// STATS
// ============================================================================

function computeStats(allItems) {
  const stats = {
    total: allItems.length,
    bySource: {},
    byType: {},
    arabPresent: 0,
    latinPresent: 0,
    indoPresent: 0,
  };
  for (const it of allItems) {
    stats.bySource[it.source] = (stats.bySource[it.source] || 0) + 1;
    stats.byType[it.type] = (stats.byType[it.type] || 0) + 1;
    if (it.arabic) stats.arabPresent++;
    if (it.latin) stats.latinPresent++;
    if (it.indo) stats.indoPresent++;
  }
  return stats;
}

// ============================================================================
// EXPORT
// ============================================================================

module.exports = {
  detectExactDuplicates,
  detectVocabOverlap,
  detectIntraSectionDup,
  detectTranslationMismatch,
  detectSemanticSimilar,
  detectDistractorReuse,
  detectPositionBias,
  detectHarakatInconsistency,
  detectOrphanVocab,
  detectMissingLatin,
  computeStats,
};
