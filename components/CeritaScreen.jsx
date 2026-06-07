// components/CeritaScreen.jsx
// Cerita Interaktif — narrative learning dgn vocab Arab embedded + final quiz.
// 3 view: list (pilih cerita), reader (baca page-by-page), quiz (akhir cerita).

'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Home, Volume2, Sparkles, Star, ChevronRight, BookOpen, RefreshCw, Check, X } from 'lucide-react';
import { CERITA_STORIES } from '@/data/cerita-stories';
import { speakArabic as ttsSpeakArabic } from '@/lib/tts';

export default function CeritaScreen({ lives = 10, onNoLives, onBack, onHome, onComplete }) {
  const [view, setView] = useState('list'); // list | reader | quiz | result
  const [selectedStory, setSelectedStory] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  const handleSelectStory = (story) => {
    if (lives <= 0) {
      if (onNoLives) onNoLives();
      return;
    }
    setSelectedStory(story);
    setView('reader');
  };

  const handleReaderDone = () => {
    setView('quiz');
  };

  const handleQuizComplete = ({ score, totalQuestions }) => {
    const correctRatio = totalQuestions > 0 ? score / totalQuestions : 0;
    const xpEarned = Math.round(correctRatio * selectedStory.xpReward);
    const isPerfect = score === totalQuestions;
    setQuizResult({ score, totalQuestions, xpEarned, isPerfect });
    setView('result');
    if (onComplete) {
      onComplete({
        earned: xpEarned, score, totalQuestions, correctRatio,
        contentId: `cerita-${selectedStory.id}`,
      });
    }
  };

  if (view === 'reader' && selectedStory) {
    return <ReaderView story={selectedStory} onBack={() => setView('list')} onDone={handleReaderDone} />;
  }

  if (view === 'quiz' && selectedStory) {
    return <QuizView story={selectedStory} onBack={() => setView('reader')} onComplete={handleQuizComplete} />;
  }

  if (view === 'result' && quizResult && selectedStory) {
    return (
      <ResultView
        story={selectedStory}
        result={quizResult}
        lives={lives}
        onRetry={() => {
          if (lives <= 0) {
            if (onNoLives) onNoLives();
            return;
          }
          setView('quiz');
        }}
        onBack={() => setView('list')}
      />
    );
  }

  return <ListView lives={lives} onBack={onBack} onHome={onHome} onSelect={handleSelectStory} />;
}

// ============================================================================
// LIST VIEW — daftar cerita
// ============================================================================
function ListView({ lives, onBack, onHome, onSelect }) {
  return (
    <div className="flex-1 flex flex-col px-5 py-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <button onClick={onHome || onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <Home size={17} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Cerita</p>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>
            Cerita Interaktif
          </h2>
        </div>
      </div>

      {/* Hero */}
      <div className="rounded-3xl p-5 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #8b6b3d, #a87f47)' }}>
        <div className="absolute -right-6 -top-4 text-7xl opacity-15">📖</div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-80 mb-1 font-bold">Belajar lewat cerita</p>
        <h3 className="text-xl text-white mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
          Vocab Arab jadi alami
        </h3>
        <p className="text-sm text-white opacity-95 leading-relaxed">
          Baca cerita pendek, dapet vocab Arab di tengah narasi, lalu uji pemahaman dengan quiz singkat di akhir.
        </p>
      </div>

      {/* Grouped by difficulty level */}
      {(() => {
        const levels = [
          { key: 'Mudah', label: 'Level Mudah', emoji: '🌱', desc: 'Cerita pendek, vocab basic — buat pemula' },
          { key: 'Sedang', label: 'Level Sedang', emoji: '🌿', desc: 'Dialog & situasi nyata di perjalanan' },
          { key: 'Lanjut', label: 'Level Lanjut', emoji: '🌳', desc: 'Sejarah Islam & sahabat — vocab lebih kaya' },
        ];
        return levels.map((lvl) => {
          const stories = CERITA_STORIES.filter((s) => s.difficulty === lvl.key);
          if (stories.length === 0) return null;
          return (
            <div key={lvl.key} className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{lvl.emoji}</span>
                  <p className="text-sm font-bold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>
                    {lvl.label}
                  </p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(10,77,60,0.1)', color: '#0a4d3c' }}>
                    {stories.length} cerita
                  </span>
                </div>
              </div>
              <p className="text-[11px] mb-3" style={{ color: '#8b6b3d', fontStyle: 'italic' }}>{lvl.desc}</p>
              <div className="space-y-3">
                {stories.map((story) => (
                  <button
                    key={story.id}
                    onClick={() => onSelect(story)}
                    className="w-full p-4 rounded-2xl text-left flex items-start gap-3 transition-transform active:scale-[0.98]"
                    style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ background: story.bgGradient }}
                    >
                      {story.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-base leading-tight" style={{ color: story.color }}>{story.title}</p>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${story.color}15`, color: story.color }}>
                          {story.difficulty}
                        </span>
                      </div>
                      <p className="text-xs leading-snug mb-1" style={{ color: '#8b6b3d', fontStyle: 'italic' }}>{story.subtitle}</p>
                      <p className="text-[11px] leading-snug mb-1.5" style={{ color: '#666' }}>{story.description}</p>
                      <div className="flex items-center gap-3 text-[10px]">
                        <span style={{ color: '#c9a961' }}>⭐ +{story.xpReward} XP</span>
                        <span style={{ color: '#8b6b3d' }}>⏱ {story.estimatedMinutes} menit</span>
                        <span style={{ color: '#8b6b3d' }}>{story.pages.length} halaman</span>
                      </div>
                    </div>
                    <ChevronRight size={18} style={{ color: '#c9a961' }} className="flex-shrink-0 self-center" />
                  </button>
                ))}
              </div>
            </div>
          );
        });
      })()}

      <div className="rounded-2xl p-3 mt-4" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
        <p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: '#c9a961' }}>Akan datang</p>
        <p className="text-xs leading-relaxed" style={{ color: '#8b6b3d' }}>
          Cerita baru ditambahin tiap update. Konten dikembangkan dengan AI + verifikasi manual untuk kualitas bahasa.
        </p>
      </div>

      {lives <= 0 && (
        <div className="rounded-2xl p-3 mt-3" style={{ background: 'rgba(160,85,54,0.12)' }}>
          <p className="text-xs text-center" style={{ color: '#a05536' }}>❤️ Nyawa habis — beli atau tunggu refresh</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// READER VIEW — baca page-by-page dgn vocab + audio
// ============================================================================
function ReaderView({ story, onBack, onDone }) {
  const [pageIdx, setPageIdx] = useState(0);
  const audioRef = useRef(null);
  const page = story.pages[pageIdx];
  const isLastPage = pageIdx === story.pages.length - 1;

  // TTS untuk Arabic vocab/dialog — server-side (Google Cloud TTS) + fallback Web Speech.
  const speakArabic = (text) => {
    ttsSpeakArabic(text, { rate: 0.8 });
  };

  const next = () => {
    if (isLastPage) {
      onDone();
    } else {
      setPageIdx(pageIdx + 1);
    }
  };

  const prev = () => {
    if (pageIdx > 0) setPageIdx(pageIdx - 1);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header dgn progress */}
      <div className="px-5 pt-5 pb-3" style={{ background: 'linear-gradient(180deg, #faf6ee 0%, rgba(250,246,238,0.95) 100%)' }}>
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="text-xs font-semibold flex items-center gap-1" style={{ color: '#8b6b3d' }}>
            <ArrowLeft size={14} /> Keluar
          </button>
          <p className="text-xs tracking-widest uppercase font-bold" style={{ color: story.color }}>
            {story.emoji} {story.title}
          </p>
          <span className="text-[10px] font-semibold" style={{ color: '#8b6b3d' }}>
            {pageIdx + 1}/{story.pages.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
          <div className="h-full transition-all" style={{ width: `${((pageIdx + 1) / story.pages.length) * 100}%`, background: story.color }} />
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {/* Narrative text */}
        <p className="text-base leading-relaxed mb-4" style={{ color: '#3d2817' }}>
          {page.text}
        </p>

        {/* Dialog (kalau ada) */}
        {page.dialog && (
          <div className="rounded-2xl p-4 mb-4" style={{ background: 'white', border: `2px solid ${story.color}25` }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: story.color }}>
                {page.dialog.speaker} berkata:
              </p>
              <button onClick={() => speakArabic(page.dialog.ar)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${story.color}15` }}>
                <Volume2 size={14} style={{ color: story.color }} />
              </button>
            </div>
            <p className="text-xl leading-relaxed mb-1" style={{ fontFamily: 'Amiri, serif', color: story.color, direction: 'rtl', textAlign: 'right' }}>
              {page.dialog.ar}
            </p>
            <p className="text-xs italic mb-1" style={{ color: '#a87f47' }}>
              {page.dialog.latin}
            </p>
            <p className="text-xs" style={{ color: '#3d2817' }}>
              {page.dialog.id}
            </p>
          </div>
        )}

        {/* Vocab card (kalau ada) */}
        {page.vocab && (
          <div className="rounded-2xl p-4 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(201,169,97,0.15), rgba(212,184,118,0.1))', border: '1.5px solid #c9a961' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1" style={{ color: '#c9a961' }}>
                <Sparkles size={11} /> Vocab Baru
              </p>
              <button onClick={() => speakArabic(page.vocab.ar)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,169,97,0.25)' }}>
                <Volume2 size={14} style={{ color: '#8b6b3d' }} />
              </button>
            </div>
            <p className="text-3xl leading-tight mb-1" style={{ fontFamily: 'Amiri, serif', color: '#8b6b3d', direction: 'rtl', textAlign: 'right' }}>
              {page.vocab.ar}
            </p>
            <p className="text-xs italic mb-1" style={{ color: '#a87f47' }}>
              {page.vocab.latin}
            </p>
            <p className="text-sm font-semibold" style={{ color: '#3d2817' }}>
              {page.vocab.id}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-5 py-3 flex items-center gap-2" style={{ background: 'white', borderTop: '1px solid rgba(10,77,60,0.08)' }}>
        <button
          onClick={prev}
          disabled={pageIdx === 0}
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 disabled:opacity-30"
          style={{ background: 'rgba(10,77,60,0.08)' }}
        >
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <button
          onClick={next}
          className="flex-1 py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2"
          style={{ background: story.bgGradient }}
        >
          {isLastPage ? (
            <>Lanjut ke Quiz <Sparkles size={16} /></>
          ) : (
            <>Lanjut <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// QUIZ VIEW — final comprehension quiz
// ============================================================================
function QuizView({ story, onBack, onComplete }) {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const questions = story.endQuiz;
  const current = questions[qIdx];

  const handleTap = (choiceIdx) => {
    if (selected !== null) return;
    setSelected(choiceIdx);
    if (choiceIdx === current.correctIdx) setScore((s) => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (qIdx === questions.length - 1) {
        onComplete({ score: score + (choiceIdx === current.correctIdx ? 1 : 0), totalQuestions: questions.length });
      } else {
        setQIdx(qIdx + 1);
      }
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col px-5 py-5">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={16} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.1)' }}>
          <div className="h-full transition-all" style={{ width: `${((qIdx + 1) / questions.length) * 100}%`, background: story.color }} />
        </div>
        <span className="text-xs font-semibold" style={{ color: story.color }}>{qIdx + 1}/{questions.length}</span>
      </div>

      <p className="text-xs tracking-widest uppercase mb-2 text-center" style={{ color: '#8b6b3d' }}>Quiz Pemahaman</p>
      <div className="rounded-3xl p-5 mb-4" style={{ background: 'white', boxShadow: '0 10px 30px -10px rgba(10,77,60,0.15)' }}>
        <p className="text-base font-semibold leading-relaxed text-center" style={{ color: '#0a4d3c' }}>
          {current.q}
        </p>
      </div>

      <div className="space-y-2">
        {current.choices.map((choice, i) => {
          let bg = 'white';
          let border = 'rgba(10,77,60,0.12)';
          if (selected !== null) {
            if (i === current.correctIdx) { bg = 'rgba(10,77,60,0.1)'; border = '#0a4d3c'; }
            else if (i === selected) { bg = 'rgba(160,85,54,0.15)'; border = '#a05536'; }
          }
          return (
            <button
              key={i}
              onClick={() => handleTap(i)}
              disabled={selected !== null}
              className="w-full p-4 rounded-2xl text-left transition-all active:scale-95 disabled:active:scale-100"
              style={{ background: bg, border: `2px solid ${border}`, color: '#1a1a1a' }}
            >
              <p className="text-sm font-medium">
                {String.fromCharCode(65 + i)}. {choice}
              </p>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-center mt-4" style={{ color: '#8b6b3d' }}>
        Skor sementara: <span className="font-bold" style={{ color: story.color }}>{score}/{questions.length}</span>
      </p>
    </div>
  );
}

// ============================================================================
// RESULT VIEW
// ============================================================================
function ResultView({ story, result, lives, onRetry, onBack }) {
  const { score, totalQuestions, xpEarned, isPerfect } = result;
  const isPartial = score > 0 && !isPerfect;
  const noLives = lives <= 0;
  const tier = isPerfect
    ? { label: 'MUMTAAZ!', emoji: '🏆', color: '#c9a961', gradient: 'linear-gradient(135deg, #d4b876, #c9a961)' }
    : isPartial
    ? { label: 'COBA LAGI', emoji: '🔥', color: '#a05536', gradient: 'linear-gradient(135deg, #a05536, #7a3d2a)' }
    : { label: 'BELUM BERHASIL', emoji: '🌱', color: '#8b6b3d', gradient: 'linear-gradient(135deg, #8b6b3d, #6b4f2a)' };

  return (
    <div className="flex-1 flex flex-col px-5 py-6 items-center text-center overflow-y-auto">
      <div className="relative mb-4 mt-2">
        <div className="absolute inset-0 blur-3xl opacity-50" style={{ background: tier.color, borderRadius: '50%' }} />
        <div className="relative w-28 h-28 rounded-full flex items-center justify-center text-5xl" style={{ background: tier.gradient, boxShadow: `0 20px 40px -10px ${tier.color}80` }}>
          {tier.emoji}
        </div>
      </div>

      <p className="text-[11px] tracking-[0.3em] uppercase mb-2 font-bold" style={{ color: tier.color }}>{tier.label}</p>
      <h2 className="text-xl mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
        {story.title}
      </h2>
      <p className="text-xs mb-3" style={{ color: '#8b6b3d' }}>{story.emoji} {story.subtitle}</p>

      <div className="flex items-baseline gap-2 mb-2">
        <p className="text-5xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: tier.color }}>{score}</p>
        <p className="text-base" style={{ color: '#8b6b3d' }}>/{totalQuestions}</p>
      </div>

      <div className="flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full" style={{ background: `${tier.color}20`, border: `1.5px solid ${tier.color}` }}>
        <Star size={14} style={{ color: tier.color }} fill={tier.color} />
        <span className="text-sm font-bold" style={{ color: tier.color }}>+{xpEarned} XP</span>
      </div>

      {!isPerfect && (
        <div className="flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full text-xs" style={{ background: 'rgba(198,69,69,0.12)' }}>
          <span>❤️</span>
          <span className="font-semibold" style={{ color: noLives ? '#a05536' : '#c64545' }}>-1 Nyawa · sisa {lives}/10</span>
        </div>
      )}

      <div className="w-full max-w-xs space-y-2 mt-2 pb-4">
        {!isPerfect && (
          <button
            onClick={onRetry}
            className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-white"
            style={{ background: noLives ? '#8b6b3d' : tier.gradient, opacity: noLives ? 0.7 : 1 }}
          >
            {noLives ? <>❤️ Nyawa habis</> : <><RefreshCw size={16} /> Ulangi Quiz</>}
          </button>
        )}
        <button onClick={onBack} className="w-full py-3 rounded-2xl text-sm font-semibold" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
          Kembali ke Daftar Cerita
        </button>
      </div>
    </div>
  );
}
