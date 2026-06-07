// components/NahwuShorfScreen.jsx
// Generic screen untuk jalur belajar Nahwu (sintaksis) & Shorf (morfologi).
// Satu komponen, dua mode — tergantung prop pathId.
//
// Flow: list → reader (scrollable teori + sections + Quran example) → quiz → result.
// Free vs Mahir: 3 pelajaran awal gratis, sisanya buka kalau isPremium=true.

'use client';

import { useState } from 'react';
import { ArrowLeft, Home, ChevronRight, ChevronLeft, BookOpen, Sparkles, Check, X, Lock, Award, RotateCcw } from 'lucide-react';
import { NAHWU_LESSONS } from '@/data/learning-nahwu';
import { SHORF_LESSONS } from '@/data/learning-shorf';
import { speakArabic } from '@/lib/tts';

const PATH_META = {
  nahwu: {
    title: 'Nahwu',
    subtitle: 'Sintaksis & I\'rab',
    desc: 'Belajar struktur kalimat bahasa Arab Fasiha — fondasi untuk paham tafsir & kitab kuning.',
    emoji: '🧮',
    color: '#0a4d3c',
    gradient: 'linear-gradient(135deg, #0a4d3c 0%, #1a6b56 100%)',
    lessons: NAHWU_LESSONS,
  },
  shorf: {
    title: 'Shorf',
    subtitle: 'Morfologi & Tasrif',
    desc: 'Belajar perubahan bentuk kata — kunci membaca Qur\'an dan derivasi kata.',
    emoji: '🌿',
    color: '#7a3d2a',
    gradient: 'linear-gradient(135deg, #7a3d2a 0%, #a05536 100%)',
    lessons: SHORF_LESSONS,
  },
};

export default function NahwuShorfScreen({ pathId = 'nahwu', userProfile, isPremium = false, onBack, onHome, onComplete, onUpgrade }) {
  const meta = PATH_META[pathId] || PATH_META.nahwu;
  const lessons = meta.lessons;

  const [view, setView] = useState('list'); // list | reader | quiz | result
  const [activeLesson, setActiveLesson] = useState(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const completedLessons = userProfile?.completedNahwuShorf?.[pathId] || [];

  const handleSelectLesson = (lesson) => {
    if (!lesson.isFree && !isPremium) {
      onUpgrade?.();
      return;
    }
    setActiveLesson(lesson);
    setView('reader');
    setQuizIdx(0);
    setQuizAnswers([]);
    setSelectedOption(null);
    setRevealed(false);
  };

  const handleStartQuiz = () => {
    setView('quiz');
    setQuizIdx(0);
    setQuizAnswers([]);
    setSelectedOption(null);
    setRevealed(false);
  };

  const handleSelectAnswer = (idx) => {
    if (revealed) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    const currentQuiz = activeLesson.quiz[quizIdx];
    const isCorrect = selectedOption === currentQuiz.correct;
    setQuizAnswers((prev) => [...prev, isCorrect]);
    setRevealed(true);
  };

  const handleNextQuestion = () => {
    if (quizIdx + 1 >= activeLesson.quiz.length) {
      setView('result');
    } else {
      setQuizIdx(quizIdx + 1);
      setSelectedOption(null);
      setRevealed(false);
    }
  };

  const handleFinish = () => {
    const correct = quizAnswers.filter(Boolean).length;
    const total = activeLesson.quiz.length;
    const xpEarned = Math.round((correct / total) * activeLesson.xpReward);
    onComplete?.({ earned: xpEarned, lessonId: activeLesson.id, pathId, score: correct, total });
    setView('list');
    setActiveLesson(null);
  };

  // ============ LIST VIEW ============
  if (view === 'list') {
    return (
      <div className="flex-1 overflow-y-auto" style={{ height: '100%' }}>
        <div className="flex items-center gap-3 px-5 py-3 sticky top-0 z-10" style={{ background: '#faf6ee', borderBottom: '1px solid rgba(10,77,60,0.08)' }}>
          <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <ArrowLeft size={17} style={{ color: meta.color }} />
          </button>
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: '#8b6b3d' }}>{meta.subtitle}</p>
            <h1 className="text-lg font-bold" style={{ fontFamily: 'Fraunces, serif', color: meta.color }}>{meta.title}</h1>
          </div>
          <button onClick={onHome} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <Home size={16} style={{ color: meta.color }} />
          </button>
        </div>

        <div className="px-5 py-4">
          {/* HERO */}
          <div className="rounded-3xl p-5 mb-4 relative overflow-hidden" style={{ background: meta.gradient }}>
            <div className="absolute -right-6 -top-4 text-7xl opacity-15">{meta.emoji}</div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-90 mb-1 font-bold">Pondasi Arab Fasiha</p>
            <h2 className="text-2xl text-white mb-2" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>{meta.title}</h2>
            <p className="text-sm text-white opacity-90 leading-relaxed">{meta.desc}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[11px] text-white opacity-80">{lessons.length} pelajaran</span>
              <span className="text-[11px] text-white opacity-80">•</span>
              <span className="text-[11px] text-white opacity-80">{completedLessons.length}/{lessons.length} selesai</span>
            </div>
          </div>

          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Daftar Pelajaran</p>
          <div className="space-y-2">
            {lessons.map((l) => {
              const isCompleted = completedLessons.includes(l.id);
              const isLocked = !l.isFree && !isPremium;
              return (
                <button
                  key={l.id}
                  onClick={() => handleSelectLesson(l)}
                  className="w-full text-left rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform"
                  style={{
                    background: 'white',
                    border: isCompleted ? '1.5px solid rgba(22,163,74,0.3)' : '1px solid rgba(10,77,60,0.1)',
                    opacity: isLocked ? 0.7 : 1,
                  }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: isLocked ? 'rgba(201,169,97,0.12)' : isCompleted ? 'rgba(22,163,74,0.1)' : `${l.color}15` }}>
                    {l.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold" style={{ color: '#8b6b3d' }}>#{l.order}</span>
                      {l.isFree ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(10,77,60,0.1)', color: meta.color }}>FREE</span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5" style={{ background: isPremium ? 'rgba(10,77,60,0.1)' : 'rgba(201,169,97,0.18)', color: isPremium ? meta.color : '#8b6b3d' }}>
                          {isPremium ? '✦ MAHIR' : <><Lock size={9} /> MAHIR</>}
                        </span>
                      )}
                      {isCompleted && <Check size={12} style={{ color: '#16a34a' }} />}
                    </div>
                    <p className="font-semibold text-sm leading-tight" style={{ color: meta.color }}>{l.title}</p>
                    <p className="text-xs" style={{ color: '#8b6b3d' }}>{l.subtitle} · {l.duration}</p>
                  </div>
                  {isLocked ? <Lock size={15} style={{ color: '#c9a961', flexShrink: 0 }} /> : <ChevronRight size={16} style={{ color: meta.color, flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>

          {!isPremium && (
            <div className="rounded-2xl p-4 mt-5" style={{ background: 'linear-gradient(135deg, rgba(201,169,97,0.1), rgba(201,169,97,0.05))', border: '1px dashed #c9a961' }}>
              <p className="text-sm font-bold mb-1" style={{ color: '#0a4d3c' }}>Ingin akses semua pelajaran?</p>
              <p className="text-xs mb-3" style={{ color: '#3d2817' }}>Upgrade ke <b>Tulis Noon Mahir</b> — buka semua {lessons.length} pelajaran {meta.title}, plus semua jalur lain.</p>
              <button onClick={onUpgrade} className="w-full py-2.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-1.5" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
                <Sparkles size={14} /> Lihat Paket Mahir
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============ READER VIEW ============
  if (view === 'reader' && activeLesson) {
    const t = activeLesson.theory;
    return (
      <div className="flex-1 overflow-y-auto" style={{ height: '100%' }}>
        <div className="flex items-center gap-3 px-5 py-3 sticky top-0 z-10" style={{ background: '#faf6ee', borderBottom: '1px solid rgba(10,77,60,0.08)' }}>
          <button onClick={() => setView('list')} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <ArrowLeft size={17} style={{ color: meta.color }} />
          </button>
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: '#8b6b3d' }}>Pelajaran #{activeLesson.order}</p>
            <h1 className="text-base font-bold leading-tight" style={{ fontFamily: 'Fraunces, serif', color: meta.color }}>{activeLesson.title}</h1>
          </div>
        </div>

        <div className="px-5 py-4">
          {/* Hero pelajaran */}
          <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: meta.gradient }}>
            <div className="text-5xl mb-2">{activeLesson.emoji}</div>
            <h2 className="text-xl text-white mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>{activeLesson.title}</h2>
            <p className="text-sm text-white opacity-90">{activeLesson.subtitle}</p>
          </div>

          {/* Intro */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.1)' }}>
            <p className="text-sm leading-relaxed" style={{ color: '#3d2817' }}>{t.intro}</p>
          </div>

          {/* Sections */}
          {t.sections.map((s, i) => (
            <div key={i} className="rounded-2xl p-4 mb-4" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.1)' }}>
              <h3 className="text-base font-bold mb-2" style={{ fontFamily: 'Fraunces, serif', color: meta.color }}>{s.title}</h3>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#3d2817' }}>{s.body}</p>
              {s.examples && s.examples.length > 0 && (
                <div className="space-y-2">
                  {s.examples.map((ex, j) => (
                    <div key={j} className="rounded-xl p-3" style={{ background: '#faf6ee', borderRight: `3px solid ${meta.color}` }}>
                      <div className="flex items-center gap-2 mb-1">
                        <button onClick={() => speakArabic(ex.ar, { rate: 0.75 })} className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${meta.color}15` }} aria-label="Dengar">
                          <span style={{ fontSize: 12, color: meta.color }}>▶</span>
                        </button>
                        <p className="text-lg flex-1" dir="rtl" style={{ fontFamily: 'Amiri, serif', color: meta.color, fontWeight: 600 }}>{ex.ar}</p>
                      </div>
                      <p className="text-xs italic mb-0.5" style={{ color: '#a87f47' }}>{ex.latin}</p>
                      <p className="text-xs" style={{ color: '#3d2817' }}>{ex.id}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Quran example */}
          {t.quranExample && (
            <div className="rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, #faf6ee, #fef6e1)', border: '1.5px solid #c9a961' }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} style={{ color: '#c9a961' }} />
                <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: '#8b6b3d' }}>Contoh dari Al-Qur'an</p>
              </div>
              <p className="text-[11px] mb-2" style={{ color: '#8b6b3d' }}>QS. {t.quranExample.surah} : {t.quranExample.ayatNum}</p>
              <button onClick={() => speakArabic(t.quranExample.ayat, { rate: 0.7 })} className="w-full text-center mb-2 p-2 rounded-lg active:bg-amber-50" aria-label="Dengar ayat">
                <p className="text-xl mb-1 leading-loose" dir="rtl" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c', fontWeight: 600 }}>{t.quranExample.ayat}</p>
                <p className="text-[11px] italic" style={{ color: '#a87f47' }}>{t.quranExample.latin}</p>
              </button>
              <div className="space-y-1 mb-3 pt-2" style={{ borderTop: '1px dashed rgba(201,169,97,0.4)' }}>
                <p className="text-[10px] uppercase tracking-wide font-bold mb-1.5" style={{ color: '#8b6b3d' }}>Analisis kata-per-kata</p>
                {t.quranExample.analysis.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <p className="w-24 text-right flex-shrink-0" dir="rtl" style={{ fontFamily: 'Amiri, serif', color: meta.color, fontWeight: 600 }}>{a.word}</p>
                    <span className="w-px h-3" style={{ background: 'rgba(10,77,60,0.2)' }}></span>
                    <p className="font-semibold flex-shrink-0" style={{ color: '#0a4d3c' }}>{a.type}</p>
                    {a.note && <p className="text-[11px] truncate" style={{ color: '#8b6b3d' }}>· {a.note}</p>}
                  </div>
                ))}
              </div>
              <p className="text-xs italic leading-relaxed" style={{ color: '#3d2817' }}>{t.quranExample.explanation}</p>
            </div>
          )}

          {/* CTA mulai quiz */}
          <button onClick={handleStartQuiz} className="w-full py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 mt-2" style={{ background: meta.gradient }}>
            <Award size={17} /> Lanjut ke Quiz ({activeLesson.quiz.length} soal)
          </button>
        </div>
      </div>
    );
  }

  // ============ QUIZ VIEW ============
  if (view === 'quiz' && activeLesson) {
    const current = activeLesson.quiz[quizIdx];
    const total = activeLesson.quiz.length;
    return (
      <div className="flex-1 flex flex-col" style={{ height: '100%' }}>
        <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid rgba(10,77,60,0.08)' }}>
          <button onClick={() => setView('reader')} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <ArrowLeft size={17} style={{ color: meta.color }} />
          </button>
          <div className="flex-1">
            <p className="text-[10px] tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Quiz · {activeLesson.title}</p>
            <p className="text-xs font-semibold" style={{ color: meta.color }}>Soal {quizIdx + 1} dari {total}</p>
          </div>
        </div>
        <div className="px-5 pt-3">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${((quizIdx + (revealed ? 1 : 0)) / total) * 100}%`, background: meta.color }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <p className="text-base font-semibold mb-5 leading-relaxed" style={{ color: '#1a1a1a' }}>{current.q}</p>

          <div className="space-y-2.5">
            {current.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrectOpt = i === current.correct;
              let bg = 'white';
              let border = '1.5px solid rgba(10,77,60,0.12)';
              let color = '#1a1a1a';
              if (revealed) {
                if (isCorrectOpt) {
                  bg = 'rgba(22,163,74,0.08)';
                  border = '1.5px solid #16a34a';
                  color = '#16a34a';
                } else if (isSelected) {
                  bg = 'rgba(192,57,43,0.07)';
                  border = '1.5px solid #c0392b';
                  color = '#c0392b';
                }
              } else if (isSelected) {
                bg = `${meta.color}10`;
                border = `1.5px solid ${meta.color}`;
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelectAnswer(i)}
                  disabled={revealed}
                  className="w-full text-left p-3.5 rounded-2xl transition-all flex items-center gap-3"
                  style={{ background: bg, border }}
                >
                  <span className="text-base flex-1" dir={/[؀-ۿ]/.test(opt) ? 'rtl' : 'ltr'} style={{ fontFamily: /[؀-ۿ]/.test(opt) ? 'Amiri, serif' : 'inherit', color, fontWeight: 600 }}>{opt}</span>
                  {revealed && isCorrectOpt && <Check size={18} style={{ color: '#16a34a' }} />}
                  {revealed && isSelected && !isCorrectOpt && <X size={18} style={{ color: '#c0392b' }} />}
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className="rounded-2xl p-3 mt-4" style={{ background: 'rgba(201,169,97,0.1)', borderLeft: '3px solid #c9a961' }}>
              <p className="text-xs leading-relaxed" style={{ color: '#3d2817' }}><b>Penjelasan:</b> {current.explanation}</p>
            </div>
          )}
        </div>

        <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(10,77,60,0.08)' }}>
          {!revealed ? (
            <button onClick={handleCheckAnswer} disabled={selectedOption === null} className="w-full py-3.5 rounded-2xl text-white font-bold disabled:opacity-40" style={{ background: meta.color }}>
              Cek Jawaban
            </button>
          ) : (
            <button onClick={handleNextQuestion} className="w-full py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-1.5" style={{ background: meta.color }}>
              {quizIdx + 1 >= total ? 'Lihat Hasil' : 'Lanjut'} <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ============ RESULT VIEW ============
  if (view === 'result' && activeLesson) {
    const correct = quizAnswers.filter(Boolean).length;
    const total = activeLesson.quiz.length;
    const percent = Math.round((correct / total) * 100);
    const xpEarned = Math.round((correct / total) * activeLesson.xpReward);
    const isPerfect = correct === total;
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-6 text-center" style={{ height: '100%' }}>
        <div className="text-7xl mb-3">{isPerfect ? '🏆' : percent >= 75 ? '🌟' : '📚'}</div>
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Fraunces, serif', color: meta.color }}>
          {isPerfect ? 'Sempurna!' : percent >= 75 ? 'Bagus banget!' : 'Tetap semangat!'}
        </h2>
        <p className="text-sm mb-5" style={{ color: '#8b6b3d' }}>{activeLesson.title}</p>

        <div className="w-full max-w-xs rounded-2xl p-5 mb-4" style={{ background: 'white', border: `1.5px solid ${meta.color}30` }}>
          <p className="text-4xl font-bold mb-1" style={{ color: meta.color, fontFamily: 'Fraunces, serif' }}>{correct}/{total}</p>
          <p className="text-xs mb-3" style={{ color: '#8b6b3d' }}>Skor quiz</p>
          <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <div className="h-full" style={{ width: `${percent}%`, background: meta.color }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: '#c9a961', fontFamily: 'Fraunces, serif' }}>+{xpEarned} XP</p>
        </div>

        <button onClick={handleFinish} className="w-full max-w-xs py-3.5 rounded-2xl text-white font-bold mb-2" style={{ background: meta.color }}>
          Selesai
        </button>
        {!isPerfect && (
          <button onClick={() => { setView('quiz'); setQuizIdx(0); setQuizAnswers([]); setSelectedOption(null); setRevealed(false); }} className="w-full max-w-xs py-3 rounded-2xl font-semibold flex items-center justify-center gap-1.5" style={{ background: 'rgba(10,77,60,0.08)', color: meta.color }}>
            <RotateCcw size={14} /> Ulangi Quiz
          </button>
        )}
      </div>
    );
  }

  return null;
}
