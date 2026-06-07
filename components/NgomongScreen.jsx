// components/NgomongScreen.jsx
// Game #6 "Belajar Ngomong" — latihan produksi suara.
// Level KATA: dengar contoh → rekam → cek pengucapan.
// Level KALIMAT: susun kata jadi kalimat benar → dengar contoh → rekam → cek.
// 3 soal gratis/materi, sesi lanjutan 5 koin.

'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Home, Volume2, Mic, Check, X, Lock, ChevronRight, Coins, RotateCcw } from 'lucide-react';
import { NGOMONG_FREE_ITEMS, NGOMONG_SESSION_COST, NGOMONG_LEVELS, getNgomongMateriByLevel } from '@/data/ngomong-materi';
import { speakArabic } from '@/lib/tts';
import { compareArabicSpeech, isSpeechRecognitionSupported } from '@/lib/hafalan-method';

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Hindari kebetulan urutannya sama persis
  if (a.length > 1 && a.every((v, i) => v === arr[i])) { [a[0], a[1]] = [a[1], a[0]]; }
  return a;
}

export default function NgomongScreen({ coins = 0, unlocked = [], isPremium = false, onUnlockMateri, onBack, onHome, onComplete, onUpgrade }) {
  const [activeLevel, setActiveLevel] = useState('kata');
  const [activeMateri, setActiveMateri] = useState(null);
  const materiList = getNgomongMateriByLevel(activeLevel);

  if (activeMateri) {
    return (
      <MateriSession
        materi={activeMateri}
        isUnlocked={isPremium || unlocked.includes(activeMateri.id)}
        coins={coins}
        onUnlock={onUnlockMateri}
        onUpgrade={onUpgrade}
        onExit={() => setActiveMateri(null)}
        onFinish={(earned) => { onComplete?.(earned); setActiveMateri(null); }}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{ height: '100%' }}>
      <div className="flex items-center gap-3 px-5 py-3 sticky top-0 z-10" style={{ background: '#faf6ee', borderBottom: '1px solid rgba(10,77,60,0.08)' }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={17} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: '#8b6b3d' }}>Game · Latihan Bicara</p>
          <h1 className="text-lg font-bold" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>Belajar Ngomong</h1>
        </div>
        <button onClick={onHome} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <Home size={16} style={{ color: '#0a4d3c' }} />
        </button>
      </div>

      <div className="px-5 py-4">
        {/* Tangga level — bisa di-tap (kecuali yg coming soon) */}
        <div className="flex gap-2 mb-4">
          {NGOMONG_LEVELS.map((lv) => {
            const isActive = lv.id === activeLevel && !lv.comingSoon;
            return (
              <button key={lv.id} disabled={lv.comingSoon} onClick={() => { if (!lv.comingSoon) setActiveLevel(lv.id); }}
                className="flex-1 rounded-2xl p-2.5 text-center relative active:scale-95 transition-transform"
                style={{
                  background: lv.comingSoon ? 'rgba(10,77,60,0.04)' : (isActive ? 'white' : 'rgba(255,255,255,0.5)'),
                  border: lv.comingSoon ? '1px dashed rgba(10,77,60,0.18)' : (isActive ? '1.5px solid rgba(201,169,97,0.6)' : '1px solid rgba(10,77,60,0.1)'),
                }}>
                {lv.comingSoon && <span className="absolute top-1 right-1 text-[7px] uppercase tracking-wide px-1 py-0.5 rounded-full font-bold" style={{ background: 'rgba(201,169,97,0.2)', color: '#a05536' }}>Soon</span>}
                <div className="text-xl mb-0.5">{lv.emoji}</div>
                <p className="text-[11px] font-semibold leading-tight" style={{ color: lv.comingSoon ? '#8b6b3d' : (isActive ? '#0a4d3c' : '#8b6b3d') }}>{lv.label}</p>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
          <p className="text-sm font-bold text-white mb-1">{activeLevel === 'kalimat' ? 'Susun lalu ucapkan 🧩' : 'Latih lidahmu bicara Arab 🗣️'}</p>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {activeLevel === 'kalimat'
              ? 'Rangkai kata-kata jadi kalimat yang benar, lalu dengar contohnya dan rekam suaramu. Mulai dari kalimat sehari-hari yang ringan.'
              : 'Dengar contoh pengucapannya, lalu rekam suaramu. Sistem bakal cek apakah ucapanmu sudah pas. Mulai dari nama barang yang kamu lihat tiap hari.'}
          </p>
        </div>

        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Pilih Materi</p>
        <div className="space-y-2.5">
          {materiList.map((m) => {
            const isUnlocked = isPremium || unlocked.includes(m.id);
            return (
              <button key={m.id} onClick={() => setActiveMateri(m)} className="w-full flex items-center gap-3 rounded-2xl p-3.5 text-left active:scale-[0.98] transition-transform" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.1)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: 'rgba(201,169,97,0.12)' }}>{m.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: '#0a4d3c' }}>{m.title}</p>
                  <p className="text-xs" style={{ color: '#8b6b3d' }}>{m.desc} · {m.items.length} {activeLevel === 'kalimat' ? 'kalimat' : 'kata'}</p>
                </div>
                {isUnlocked ? (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ background: 'rgba(22,163,74,0.12)', color: '#16a34a' }}>Penuh</span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>{NGOMONG_FREE_ITEMS} gratis</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SESI MATERI — kata (langsung ucap) atau kalimat (susun → ucap)
// ============================================================================
function MateriSession({ materi, isUnlocked, coins, onUnlock, onUpgrade, onExit, onFinish, onHome }) {
  const items = materi.items;
  const isKalimat = materi.level === 'kalimat';
  const isCerita = materi.level === 'cerita';
  const hasArrange = isKalimat || isCerita; // level yg pakai fase susun dulu
  const unitLabel = isCerita ? 'cerita' : isKalimat ? 'kalimat' : 'kata';
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState(hasArrange ? 'arrange' : 'speak'); // arrange → speak
  const [recognized, setRecognized] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [correct, setCorrect] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  // Arrange state
  const [shuffled, setShuffled] = useState([]); // [{tok, i}]
  const [built, setBuilt] = useState([]); // indices into shuffled
  const [arrangeResult, setArrangeResult] = useState(null); // null | true | false
  const recRef = useRef(null);
  const transcriptRef = useRef('');

  const supported = isSpeechRecognitionSupported();
  const freeLimit = NGOMONG_FREE_ITEMS;
  const showPaywall = !isUnlocked && idx >= freeLimit;
  const isDone = idx >= items.length;
  const current = items[idx];

  // Reset per kata/kalimat
  useEffect(() => {
    if (isDone || showPaywall || !current) return;
    if (hasArrange) {
      setPhase('arrange');
      const units = isCerita
        ? current.sentences.map((s) => ({ key: s.ar, display: s.ar, sub: s.id }))
        : current.tokens.map((tok) => ({ key: tok, display: tok, sub: null }));
      setShuffled(shuffle(units).map((u, i) => ({ ...u, i })));
      setBuilt([]);
      setArrangeResult(null);
    } else {
      setPhase('speak');
    }
    setRecognized(null);
    setInterim('');
    transcriptRef.current = '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, showPaywall, isDone]);

  // Speech recognition — cuma pas fase ucapkan
  useEffect(() => {
    if (!supported || typeof window === 'undefined' || isDone || showPaywall || phase !== 'speak') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'ar-SA';
    rec.maxAlternatives = 1;
    rec.onresult = (event) => {
      let finalChunk = '';
      let inter = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalChunk += res[0].transcript + ' ';
        else inter += res[0].transcript;
      }
      if (finalChunk) transcriptRef.current += finalChunk;
      setInterim((transcriptRef.current + inter).trim());
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => {
      setIsListening(false);
      const full = transcriptRef.current.trim();
      if (full && current) {
        const result = compareArabicSpeech(full, current.ar);
        setRecognized({ transcript: full, ...result });
      }
    };
    recRef.current = rec;
    return () => { try { rec.stop(); } catch (e) {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, phase, supported, showPaywall, isDone]);

  const playExample = () => {
    if (!current) return;
    speakArabic(current.ar, { rate: 0.8, onStart: () => setSpeaking(true), onEnd: () => setSpeaking(false), onError: () => setSpeaking(false) });
  };

  const toggleRecord = () => {
    if (!recRef.current) return;
    if (isListening) {
      try { recRef.current.stop(); } catch (e) {}
    } else {
      setRecognized(null);
      setInterim('');
      transcriptRef.current = '';
      setIsListening(true);
      try { recRef.current.start(); } catch (e) { setIsListening(false); }
    }
  };

  // Arrange handlers
  const addToken = (sIdx) => { if (!built.includes(sIdx)) setBuilt((b) => [...b, sIdx]); setArrangeResult(null); };
  const removeToken = (sIdx) => { setBuilt((b) => b.filter((x) => x !== sIdx)); setArrangeResult(null); };
  const correctKeys = isCerita ? current?.sentences?.map((s) => s.ar) || [] : current?.tokens || [];
  const checkArrange = () => {
    const builtKeys = built.map((i) => shuffled[i].key);
    const ok = builtKeys.length === correctKeys.length && builtKeys.every((t, i) => t === correctKeys[i]);
    setArrangeResult(ok);
  };

  const goNext = () => {
    if (recognized?.isMatch) setCorrect((c) => c + 1);
    setIdx((i) => i + 1);
  };

  const handleUnlock = async () => {
    if (coins < NGOMONG_SESSION_COST || unlocking) return;
    setUnlocking(true);
    await onUnlock?.(materi.id);
    setUnlocking(false);
  };

  // ---- SELESAI ----
  if (isDone) {
    const total = isUnlocked ? items.length : Math.min(freeLimit, items.length);
    const earned = correct * 5;
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center" style={{ height: '100%' }}>
        <div className="text-6xl mb-3">{correct >= total ? '🎉' : '✨'}</div>
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>Sesi selesai!</h2>
        <p className="text-sm mb-1" style={{ color: '#3d2817' }}>Pengucapan benar: <b>{correct}/{total}</b></p>
        <p className="text-sm mb-6" style={{ color: '#c9a961', fontWeight: 700 }}>+{earned} XP</p>
        <button onClick={() => onFinish?.(earned)} className="w-full max-w-xs py-3.5 rounded-2xl text-white font-bold mb-2" style={{ background: '#0a4d3c' }}>Selesai</button>
        <button onClick={onExit} className="w-full max-w-xs py-3 rounded-2xl font-semibold" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>Pilih materi lain</button>
      </div>
    );
  }

  // ---- PAYWALL ----
  if (showPaywall) {
    const remaining = items.length - freeLimit;
    const enough = coins >= NGOMONG_SESSION_COST;
    const unit = unitLabel;
    return (
      <div className="flex-1 flex flex-col" style={{ height: '100%' }}>
        <SessionHeader title={materi.title} onExit={onExit} onHome={onHome} />
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(201,169,97,0.15)' }}>
            <Lock size={28} style={{ color: '#c9a961' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>Sesi lanjutan</h2>
          <p className="text-sm mb-1" style={{ color: '#3d2817' }}>Masih ada <b>{remaining} {unit}</b> lagi yang lebih seru di materi ini.</p>
          <p className="text-xs mb-5" style={{ color: '#8b6b3d' }}>Buka sesi penuh dengan {NGOMONG_SESSION_COST} koin.</p>
          {enough ? (
            <button onClick={handleUnlock} disabled={unlocking} className="w-full max-w-xs py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 mb-2 disabled:opacity-50" style={{ background: '#0a4d3c' }}>
              <Coins size={17} /> {unlocking ? 'Membuka...' : `Buka (${NGOMONG_SESSION_COST} koin)`}
            </button>
          ) : (
            <>
              <p className="text-xs mb-2" style={{ color: '#c0392b' }}>Koinmu kurang (punya {coins}, butuh {NGOMONG_SESSION_COST}).</p>
              <button onClick={() => onUpgrade?.()} className="w-full max-w-xs py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 mb-2" style={{ background: '#c9a961' }}>
                <Coins size={17} /> Top up koin
              </button>
            </>
          )}
          <button onClick={() => setIdx(items.length)} className="w-full max-w-xs py-3 rounded-2xl font-semibold" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>Cukup, lihat hasil</button>
        </div>
      </div>
    );
  }

  const progressTotal = isUnlocked ? items.length : Math.min(freeLimit, items.length);

  // ---- FASE SUSUN (kalimat & cerita) ----
  if (hasArrange && phase === 'arrange') {
    const arrangeBtns = (
      arrangeResult ? (
        <button onClick={() => setPhase('speak')} className="w-full max-w-xs py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-1.5" style={{ background: '#16a34a' }}>
          {isCerita ? 'Lanjut: narasikan' : 'Lanjut: ucapkan'} <ChevronRight size={16} />
        </button>
      ) : (
        <div className="flex items-center gap-2 w-full max-w-xs">
          {built.length > 0 && (
            <button onClick={() => { setBuilt([]); setArrangeResult(null); }} className="flex-1 py-3 rounded-2xl font-semibold flex items-center justify-center gap-1.5" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
              <RotateCcw size={15} /> Reset
            </button>
          )}
          <button onClick={checkArrange} disabled={built.length !== correctKeys.length} className="flex-1 py-3 rounded-2xl text-white font-bold disabled:opacity-40" style={{ background: '#0a4d3c' }}>Cek susunan</button>
        </div>
      )
    );
    const errBox = arrangeResult === false && (
      <div className="w-full max-w-xs rounded-xl p-2.5 mb-3 flex items-center justify-center gap-2" style={{ background: 'rgba(192,57,43,0.07)' }}>
        <X size={15} style={{ color: '#c0392b' }} />
        <p className="text-xs font-semibold" style={{ color: '#c0392b' }}>Urutannya belum tepat, coba lagi</p>
      </div>
    );

    // CERITA: urutkan kartu kalimat (vertikal, bernomor)
    if (isCerita) {
      const borderColor = arrangeResult === false ? '1.5px solid #c0392b' : (arrangeResult ? '1.5px solid #16a34a' : '1.5px dashed rgba(10,77,60,0.2)');
      return (
        <div className="flex-1 flex flex-col overflow-y-auto" style={{ height: '100%' }}>
          <SessionHeader title={materi.title} onExit={onExit} onHome={onHome} />
          <ProgressBar idx={idx} total={progressTotal} correct={correct} unit="cerita" />
          <div className="px-5 py-4">
            <p className="text-xs mb-1" style={{ color: '#8b6b3d' }}>Urutkan jadi cerita yang runtut:</p>
            <p className="text-sm font-bold mb-3" style={{ color: '#0a4d3c' }}>{current.title}</p>

            {/* Susunan cerita (bernomor) */}
            <div className="rounded-2xl p-2 mb-3" style={{ background: 'white', border: borderColor }}>
              {built.length === 0 ? (
                <p className="text-xs text-center py-4" style={{ color: '#b8a888' }}>Tap kalimat di bawah, urutkan dari atas</p>
              ) : built.map((sIdx, order) => (
                <button key={sIdx} onClick={() => removeToken(sIdx)} className="w-full flex items-center gap-2 p-2.5 rounded-xl mb-1 text-right" style={{ background: 'rgba(10,77,60,0.06)' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: '#0a4d3c', color: 'white' }}>{order + 1}</span>
                  <div className="flex-1">
                    <p className="text-base" dir="rtl" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c' }}>{shuffled[sIdx].display}</p>
                    <p className="text-[11px]" style={{ color: '#8b6b3d' }}>{shuffled[sIdx].sub}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Bank kalimat */}
            <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: '#8b6b3d' }}>Pilihan kalimat</p>
            <div className="space-y-1.5 mb-4">
              {shuffled.map((s, sIdx) => {
                const used = built.includes(sIdx);
                if (used) return null;
                return (
                  <button key={sIdx} onClick={() => addToken(sIdx)} className="w-full p-2.5 rounded-xl text-right" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.12)' }}>
                    <p className="text-base" dir="rtl" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c' }}>{s.display}</p>
                    <p className="text-[11px]" style={{ color: '#8b6b3d' }}>{s.sub}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col items-center">
              {errBox}
              {arrangeBtns}
            </div>
          </div>
        </div>
      );
    }

    // KALIMAT: susun chip kata (wrap)
    const builtTokens = built.map((i) => shuffled[i].display);
    return (
      <div className="flex-1 flex flex-col" style={{ height: '100%' }}>
        <SessionHeader title={materi.title} onExit={onExit} onHome={onHome} />
        <ProgressBar idx={idx} total={progressTotal} correct={correct} unit="kalimat" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-xs mb-1" style={{ color: '#8b6b3d' }}>Susun jadi kalimat Arab yang benar:</p>
          <p className="text-base font-semibold mb-5" style={{ color: '#0a4d3c' }}>"{current.id}"</p>

          <div className="w-full min-h-[64px] rounded-2xl p-3 mb-4 flex flex-wrap gap-2 items-center justify-center" dir="rtl" style={{ background: 'white', border: arrangeResult === false ? '1.5px solid #c0392b' : (arrangeResult ? '1.5px solid #16a34a' : '1.5px dashed rgba(10,77,60,0.2)') }}>
            {builtTokens.length === 0 ? (
              <span className="text-xs" dir="ltr" style={{ color: '#b8a888' }}>Tap kata di bawah untuk menyusun</span>
            ) : built.map((sIdx) => (
              <button key={sIdx} onClick={() => removeToken(sIdx)} className="px-3 py-1.5 rounded-xl text-lg" style={{ fontFamily: 'Amiri, serif', background: 'rgba(10,77,60,0.1)', color: '#0a4d3c' }}>{shuffled[sIdx].display}</button>
            ))}
          </div>

          <div className="w-full flex flex-wrap gap-2 items-center justify-center mb-5" dir="rtl">
            {shuffled.map((s, sIdx) => {
              const used = built.includes(sIdx);
              return (
                <button key={sIdx} disabled={used} onClick={() => addToken(sIdx)} className="px-3.5 py-2 rounded-xl text-xl transition-opacity" style={{ fontFamily: 'Amiri, serif', background: used ? 'rgba(10,77,60,0.04)' : 'white', color: used ? '#cdc4b4' : '#0a4d3c', border: '1px solid rgba(10,77,60,0.12)', opacity: used ? 0.4 : 1 }}>{s.display}</button>
              );
            })}
          </div>

          {errBox}
          {arrangeBtns}
        </div>
      </div>
    );
  }

  // ---- FASE UCAPKAN (kata & kalimat) ----
  return (
    <div className="flex-1 flex flex-col" style={{ height: '100%' }}>
      <SessionHeader title={materi.title} onExit={onExit} onHome={onHome} />
      <ProgressBar idx={idx} total={progressTotal} correct={correct} unit={unitLabel} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center overflow-y-auto py-4">
        {!hasArrange && <div className="text-6xl mb-3">{current.emoji}</div>}
        <p className="text-xs mb-3" style={{ color: '#8b6b3d' }}>{isCerita ? 'Narasikan ceritamu:' : 'Ucapkan dalam bahasa Arab:'}</p>
        <p className={isCerita ? 'text-2xl mb-2 leading-loose' : isKalimat ? 'text-3xl mb-2 leading-relaxed' : 'text-5xl mb-1'} dir="rtl" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c' }}>{current.ar}</p>
        <p className="text-sm italic mb-1" style={{ color: '#a87f47' }}>{current.latin}</p>
        <p className="text-sm mb-5" style={{ color: '#3d2817' }}>"{current.id}"</p>

        <button onClick={playExample} className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold mb-5" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
          <Volume2 size={17} className={speaking ? 'animate-pulse' : ''} /> Dengar contoh
        </button>

        {recognized && (
          <div className="w-full max-w-xs rounded-2xl p-3 mb-4" style={{ background: recognized.isMatch ? 'rgba(22,163,74,0.08)' : 'rgba(192,57,43,0.07)' }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              {recognized.isMatch ? <Check size={18} style={{ color: '#16a34a' }} /> : <X size={18} style={{ color: '#c0392b' }} />}
              <p className="font-bold text-sm" style={{ color: recognized.isMatch ? '#16a34a' : '#c0392b' }}>
                {recognized.isMatch ? 'Mantap, pengucapanmu pas!' : 'Belum pas, coba lagi'}
              </p>
            </div>
            <p className="text-xs" dir="rtl" style={{ fontFamily: 'Amiri, serif', color: '#3d2817' }}>Terdengar: {recognized.transcript}</p>
          </div>
        )}
        {isListening && interim && (
          <p className="text-sm mb-3" dir="rtl" style={{ fontFamily: 'Amiri, serif', color: '#8b6b3d' }}>{interim}</p>
        )}

        {supported ? (
          <>
            <button onClick={toggleRecord} className="w-20 h-20 rounded-full flex items-center justify-center mb-3 transition-transform active:scale-95" style={{ background: isListening ? '#c0392b' : '#0a4d3c', boxShadow: isListening ? '0 0 0 6px rgba(192,57,43,0.15)' : '0 4px 14px -4px rgba(10,77,60,0.5)' }}>
              <Mic size={30} color="white" className={isListening ? 'animate-pulse' : ''} />
            </button>
            <p className="text-[11px] mb-4" style={{ color: '#8b6b3d' }}>{isListening ? 'Sedang merekam... tap untuk berhenti' : 'Tap mik lalu ucapkan'}</p>
          </>
        ) : (
          <p className="text-xs mb-4 px-4" style={{ color: '#8b6b3d' }}>Browsermu belum mendukung rekam suara. Dengar contoh & tirukan, lalu lanjut.</p>
        )}

        <div className="flex items-center gap-2 w-full max-w-xs">
          {recognized && !recognized.isMatch && supported && (
            <button onClick={toggleRecord} className="flex-1 py-3 rounded-2xl font-semibold flex items-center justify-center gap-1.5" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
              <RotateCcw size={15} /> Ulangi
            </button>
          )}
          <button onClick={goNext} className="flex-1 py-3 rounded-2xl text-white font-bold flex items-center justify-center gap-1.5" style={{ background: recognized?.isMatch ? '#16a34a' : '#0a4d3c' }}>
            {idx + 1 >= progressTotal ? 'Selesai' : 'Lanjut'} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ idx, total, correct, unit }) {
  return (
    <div className="px-5 pt-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[11px]" style={{ color: '#8b6b3d' }}>{unit === 'kalimat' ? 'Kalimat' : 'Kata'} {idx + 1} dari {total}</p>
        <p className="text-[11px]" style={{ color: '#16a34a' }}>{correct} benar</p>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(10,77,60,0.08)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${(idx / total) * 100}%`, background: '#0a4d3c' }} />
      </div>
    </div>
  );
}

function SessionHeader({ title, onExit, onHome }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid rgba(10,77,60,0.08)' }}>
      <button onClick={onExit} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
        <ArrowLeft size={17} style={{ color: '#0a4d3c' }} />
      </button>
      <p className="flex-1 font-semibold text-sm truncate" style={{ color: '#0a4d3c' }}>{title}</p>
      <button onClick={onHome} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
        <Home size={16} style={{ color: '#0a4d3c' }} />
      </button>
    </div>
  );
}
