// scripts/audit-content/loaders.js
// Load + extract items dari semua data sources.
// Setiap loader return array { source, location, type, arabic, indo, latin, raw }

const path = require('path');

// ============================================================================
// EXTRACTORS — satu function per source
// ============================================================================

function extractTebakGambar(mod) {
  const out = [];
  const levels = mod.TEBAK_GAMBAR_LEVELS || [];
  levels.forEach((lvl) => {
    (lvl.items || []).forEach((item) => {
      out.push({
        source: 'Tebak Gambar',
        location: `${lvl.id}/${item.latin}`,
        type: 'vocab',
        arabic: item.arabic,
        indo: item.id,
        latin: item.latin,
        distractors: item.distractors || [],
        note: item.note,
        raw: item,
      });
    });
  });
  return out;
}

function extractCerita(mod) {
  const out = [];
  const stories = mod.CERITA_STORIES || [];
  stories.forEach((story) => {
    // Vocab dari pages (narrative & dialogue)
    (story.pages || []).forEach((page, pi) => {
      if (page.vocab) {
        out.push({
          source: 'Cerita',
          location: `${story.id}/page${pi}/vocab`,
          type: 'vocab',
          arabic: page.vocab.ar,
          indo: page.vocab.id,
          latin: page.vocab.latin,
          raw: page.vocab,
        });
      }
      // Dialog: bisa single object atau array
      const dialogs = Array.isArray(page.dialog) ? page.dialog : (page.dialog ? [page.dialog] : []);
      const lines = Array.isArray(page.lines) ? page.lines : [];
      [...dialogs, ...lines].forEach((line, li) => {
        if (line && line.ar) {
          out.push({
            source: 'Cerita',
            location: `${story.id}/page${pi}/line${li}`,
            type: 'dialog',
            arabic: line.ar,
            indo: line.id || line.indo,
            latin: line.latin,
            speaker: line.speaker,
            raw: line,
          });
        }
      });
    });
    // End quiz
    (story.endQuiz || story.quiz || []).forEach((q, qi) => {
      const correctIdx = q.correctIdx ?? q.correct ?? 0;
      out.push({
        source: 'Cerita',
        location: `${story.id}/endQuiz#${qi}`,
        type: 'quiz-mc',
        arabic: q.ar || (Array.isArray(q.choices) ? q.choices[correctIdx] : ''),
        indo: q.q || q.question || '',
        latin: q.latin || '',
        options: q.choices || q.options || [],
        correctIdx,
        raw: q,
      });
    });
  });
  return out;
}

function extractPerkenalan(mod) {
  const out = [];
  const list = mod.PERKENALAN_MATERI || [];
  list.forEach((m) => {
    // Vocab
    (m.vocab || []).forEach((v) => {
      out.push({
        source: 'Perkenalan Diri',
        location: `${m.id}/vocab`,
        type: 'vocab',
        arabic: v.ar || v.arabic,
        indo: v.id || v.indonesia,
        latin: v.latin,
        raw: v,
      });
    });
    // Quiz
    (m.quiz || []).forEach((q, qi) => {
      const correctIdx = q.correct ?? q.correctIdx ?? 0;
      const options = q.options || [];
      out.push({
        source: 'Perkenalan Diri',
        location: `${m.id}/quiz#${qi}`,
        type: 'quiz-mc',
        arabic: q.ar || q.arabic || (options[correctIdx] && /[؀-ۿ]/.test(options[correctIdx]) ? options[correctIdx] : ''),
        indo: q.q || q.question || (options[correctIdx] && !/[؀-ۿ]/.test(options[correctIdx]) ? options[correctIdx] : ''),
        latin: q.latin,
        options,
        correctIdx,
        raw: q,
      });
    });
  });
  return out;
}

function extractLesson(label, mod) {
  const out = [];
  const arr = Object.values(mod).find((v) => Array.isArray(v)) || [];
  arr.forEach((modul) => {
    // Vocab
    (modul.vocab || []).forEach((v) => {
      out.push({
        source: label,
        location: `${modul.id}/vocab`,
        type: 'vocab',
        arabic: v.ar || v.arabic,
        indo: v.id || v.indonesia,
        latin: v.latin,
        raw: v,
      });
    });
    // Conversation lines — penting untuk audit cross-source
    (modul.conversations || []).forEach((conv, ci) => {
      (conv.lines || conv.dialog || []).forEach((line, li) => {
        if (line.ar || line.arabic) {
          out.push({
            source: label,
            location: `${modul.id}/conv${ci}/line${li}`,
            type: 'dialog',
            arabic: line.ar || line.arabic,
            indo: line.id || line.indonesia,
            latin: line.latin,
            speaker: line.speaker,
            raw: line,
          });
        }
      });
    });
    // Quiz
    (modul.quiz || []).forEach((q, qi) => {
      const correctIdx = q.correct ?? q.correctIdx ?? 0;
      out.push({
        source: label,
        location: `${modul.id}/quiz#${qi}`,
        type: 'quiz-mc',
        arabic: q.ar || q.question,
        indo: q.id || (Array.isArray(q.options) ? q.options[correctIdx] : ''),
        latin: q.latin,
        options: q.options || [],
        correctIdx,
        raw: q,
      });
    });
  });
  return out;
}

function extractNahwuShorf(label, mod) {
  const out = [];
  const arr = Object.values(mod).find((v) => Array.isArray(v)) || [];
  arr.forEach((lesson) => {
    // Quiz
    (lesson.quiz || []).forEach((q, qi) => {
      const correctIdx = q.correct ?? q.correctIdx ?? 0;
      out.push({
        source: label,
        location: `${lesson.id}/quiz#${qi}`,
        type: 'quiz-mc',
        arabic: q.ar || q.question,
        indo: q.id || q.explanation || (Array.isArray(q.options) ? q.options[correctIdx] : ''),
        latin: q.latin,
        options: q.options || [],
        correctIdx,
        raw: q,
      });
    });
    // Examples
    (lesson.examples || []).forEach((ex, ei) => {
      out.push({
        source: label,
        location: `${lesson.id}/example#${ei}`,
        type: 'example',
        arabic: ex.ar || ex.arabic,
        indo: ex.id || ex.indonesia,
        latin: ex.latin,
        raw: ex,
      });
    });
  });
  return out;
}

function extractTulisArab(mod) {
  const out = [];
  const phases = mod.TULIS_ARAB_PHASES || [];
  phases.forEach((phase) => {
    (phase.levels || []).forEach((lvl) => {
      (lvl.items || []).forEach((item) => {
        out.push({
          source: 'Tulis Arab',
          location: `${phase.id}/L${lvl.level}/${item.latin}`,
          type: 'tap-letter',
          arabic: item.arabic,
          indo: item.latin, // pakai latin sebagai "meaning" untuk Tulis Arab
          latin: item.latin,
          distractors: item.distractors || [],
          raw: item,
        });
      });
    });
  });
  return out;
}

function extractChallenge(mod) {
  const out = [];
  const arr = Object.values(mod).find((v) => Array.isArray(v)) || [];
  arr.forEach((scenario) => {
    (scenario.levels || []).forEach((lvl) => {
      (lvl.questions || []).forEach((q, qi) => {
        const correctIdx = q.correct ?? 0;
        out.push({
          source: 'Challenge',
          location: `${scenario.id}/L${lvl.level}/q${qi}`,
          type: q.type || 'mc',
          arabic: q.ar,
          indo: Array.isArray(q.options) ? q.options[correctIdx] : '',
          latin: q.latin,
          options: q.options || [],
          correctIdx,
          raw: q,
        });
      });
    });
  });
  return out;
}

function extractMatch(mod) {
  const out = [];
  const arr = mod.MATCH_QUESTIONS || [];
  arr.forEach((q, qi) => {
    out.push({
      source: 'Match',
      location: `level${q.level}/q${qi}/${q.prompt || ''}`,
      type: 'match',
      arabic: q.correct,
      indo: q.prompt,
      latin: q.prompt,
      distractors: q.distractors || [],
      raw: q,
    });
  });
  return out;
}

function extractNgomong(mod) {
  const out = [];
  const collections = [
    ['NGOMONG_MATERI', 'kata'],
    ['NGOMONG_KALIMAT', 'kalimat'],
    ['NGOMONG_CERITA', 'cerita'],
  ];
  for (const [field, level] of collections) {
    const arr = mod[field] || [];
    arr.forEach((materi) => {
      (materi.items || []).forEach((item, i) => {
        out.push({
          source: 'Ngomong',
          location: `${level}/${materi.id}/item${i}`,
          type: `ngomong-${level}`,
          arabic: item.ar || item.arabic,
          indo: item.id || item.indonesia,
          latin: item.latin,
          raw: item,
        });
      });
    });
  }
  return out;
}

function extractRoleplay(mod) {
  const out = [];
  const arr = mod.ROLEPLAY_SCENARIOS || [];
  arr.forEach((scenario) => {
    (scenario.helpfulVocab || []).forEach((v) => {
      out.push({
        source: 'Roleplay',
        location: `${scenario.id}/vocab`,
        type: 'vocab',
        arabic: v.ar || v.arabic,
        indo: v.id || v.indonesia,
        latin: v.latin,
        raw: v,
      });
    });
    // Starter message
    if (scenario.starterMessage) {
      const ar = scenario.starterMessage.ar || scenario.starterMessage.arabic;
      const indo = scenario.starterMessage.id || scenario.starterMessage.indonesia;
      if (ar) {
        out.push({
          source: 'Roleplay',
          location: `${scenario.id}/starter`,
          type: 'starter',
          arabic: ar,
          indo: indo,
          latin: scenario.starterMessage.latin,
          raw: scenario.starterMessage,
        });
      }
    }
  });
  return out;
}

function extractHafalan(mod) {
  const out = [];
  const arr = mod.HAFALAN_SURAT || [];
  arr.forEach((surat) => {
    (surat.ayat || []).forEach((ayat) => {
      out.push({
        source: 'Hafalan',
        location: `${surat.id}/ayat${ayat.num}`,
        type: 'ayat',
        arabic: ayat.ar,
        indo: ayat.id,
        latin: ayat.latin,
        raw: ayat,
      });
    });
  });
  return out;
}

// ============================================================================
// MAIN LOADER
// ============================================================================

const SOURCES = [
  ['Tebak Gambar',      'data/tebak-gambar-levels.js',  extractTebakGambar],
  ['Cerita',            'data/cerita-stories.js',       extractCerita],
  ['Perkenalan Diri',   'data/perkenalan-diri-materi.js', extractPerkenalan],
  ['Lesson Umrah',      'data/learning-umrah.js',       (m) => extractLesson('Lesson Umrah', m)],
  ['Lesson Profesional','data/learning-profesional.js', (m) => extractLesson('Lesson Profesional', m)],
  ['Lesson Pelajar',    'data/learning-pelajar.js',     (m) => extractLesson('Lesson Pelajar', m)],
  ['Nahwu',             'data/learning-nahwu.js',       (m) => extractNahwuShorf('Nahwu', m)],
  ['Shorf',             'data/learning-shorf.js',       (m) => extractNahwuShorf('Shorf', m)],
  ['Tulis Arab',        'data/tulis-arab-levels.js',    extractTulisArab],
  ['Challenge',         'data/challenge-levels.js',     extractChallenge],
  ['Match',             'data/match-questions.js',      extractMatch],
  ['Ngomong',           'data/ngomong-materi.js',       extractNgomong],
  ['Roleplay',          'data/roleplay-scenarios.js',   extractRoleplay],
  ['Hafalan',           'data/hafalan-surat.js',        extractHafalan],
];

function loadAllSources(rootDir) {
  const allItems = [];
  const sourceStats = {};

  for (const [label, relPath, extractor] of SOURCES) {
    try {
      const mod = require(path.join(rootDir, relPath));
      const items = extractor(mod);
      // Drop items kosong
      const valid = items.filter((it) => (it.arabic || it.indo));
      allItems.push(...valid);
      sourceStats[label] = valid.length;
    } catch (e) {
      console.warn(`  ⚠️ skip ${label}: ${e.message.split('\n')[0]}`);
      sourceStats[label] = 0;
    }
  }

  return { allItems, sourceStats };
}

module.exports = { loadAllSources, SOURCES };
