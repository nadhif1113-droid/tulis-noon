// components/MatchArenaScreen.jsx
// Match Arena dgn smart matchmaking — 10 bot personas (Lv 1-10) progressive.
// Flow: lobby (pick mode) → reveal (opponent intro) → playing → result.
// User baru auto-pair bot mudah, naik tier setelah 3+ match.
// Bisa juga lawan user real (random pick dari Firestore).

'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Home, Star, Trophy, RefreshCw, X, Sparkles, Users, Bot, Shuffle, Lock } from 'lucide-react';
import {
  BOTS,
  TIER_CONFIG,
  pickBotForUser,
  pickBotForMatchLevel,
  getMatchLevelForXp,
  MATCH_LEVELS,
  canMatchHuman,
  userToOpponent,
  simulateBotAnswer,
  calculateScore,
  determineMatchOutcome,
  ROUNDS_PER_MATCH,
  ROUND_TIMEOUT_MS,
} from '@/lib/match-system';
import { generateMatchRound } from '@/data/match-questions';

export default function MatchArenaScreen({
  lives = 10,
  matchesPlayed = 0,
  xp = 0,
  winStreak = 0,
  currentUserId,
  userName,
  onNoLives,
  onBack,
  onHome,
  onComplete,
}) {
  const [view, setView] = useState('lobby'); // lobby | reveal | playing | result
  const [opponent, setOpponent] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pick bot opponent — sesuai level XP pemain + win-streak (adaptif)
  const handlePickBot = () => {
    if (lives <= 0) {
      if (onNoLives) onNoLives();
      return;
    }
    const { bot } = pickBotForMatchLevel(xp, winStreak);
    setOpponent({ ...bot, isHuman: false });
    setView('reveal');
  };

  // Pick random real user from Firestore as opponent
  const handlePickHuman = async () => {
    if (lives <= 0) {
      if (onNoLives) onNoLives();
      return;
    }
    if (!canMatchHuman(matchesPlayed)) return;
    setLoading(true);
    try {
      const { firestore } = await import('@/lib/firebase');
      const { collection, query, getDocs, limit, orderBy } = await import('firebase/firestore');
      // Ambil 20 user random by recent activity, filter current user
      const q = query(collection(firestore, 'users'), orderBy('lastActivity', 'desc'), limit(20));
      const snap = await getDocs(q);
      const candidates = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((u) => u.id !== currentUserId);

      if (candidates.length === 0) {
        // Fallback: pick bot kalau ga ada user lain
        const { bot } = pickBotForMatchLevel(xp, winStreak);
        setOpponent({ ...bot, isHuman: false });
      } else {
        const picked = candidates[Math.floor(Math.random() * candidates.length)];
        setOpponent(userToOpponent(picked));
      }
      setView('reveal');
    } catch (e) {
      console.error('Human matchmaking error:', e);
      // Fallback: bot
      const bot = pickBotForUser(matchesPlayed);
      setOpponent({ ...bot, isHuman: false });
      setView('reveal');
    } finally {
      setLoading(false);
    }
  };

  // Re-roll opponent
  const handleReroll = () => {
    if (opponent?.isHuman) {
      handlePickHuman();
    } else {
      handlePickBot();
    }
  };

  const onPlayComplete = (result) => {
    setMatchResult(result);
    setView('result');
    if (onComplete) {
      onComplete({
        earned: result.xpEarned,
        coinEarned: result.coinEarned,
        result: result.result,
        userScore: result.userScore,
        botScore: result.botScore,
        opponentName: opponent?.name,
        opponentLevel: opponent?.level,
        isHuman: opponent?.isHuman || false,
      });
    }
  };

  if (view === 'lobby') {
    return <LobbyView lives={lives} matchesPlayed={matchesPlayed} xp={xp} winStreak={winStreak} loading={loading} onBack={onBack} onHome={onHome} onPickBot={handlePickBot} onPickHuman={handlePickHuman} />;
  }

  if (view === 'reveal' && opponent) {
    return <RevealView opponent={opponent} userName={userName} onStart={() => setView('playing')} onReroll={handleReroll} onBack={() => setView('lobby')} />;
  }

  if (view === 'playing' && opponent) {
    return <PlayingView opponent={opponent} userName={userName} onComplete={onPlayComplete} onQuit={() => setView('lobby')} />;
  }

  if (view === 'result' && matchResult && opponent) {
    return (
      <ResultView
        result={matchResult}
        opponent={opponent}
        lives={lives}
        onRematch={() => {
          if (lives <= 0) { if (onNoLives) onNoLives(); return; }
          setView('playing');
        }}
        onNewOpponent={() => setView('lobby')}
        onBack={onBack}
      />
    );
  }

  return null;
}

// ============================================================================
// LOBBY VIEW — pick mode: Bot or Human
// ============================================================================
function LobbyView({ lives, matchesPlayed, xp = 0, winStreak = 0, loading, onBack, onHome, onPickBot, onPickHuman }) {
  const humanUnlocked = canMatchHuman(matchesPlayed);
  const matchesNeeded = Math.max(0, 3 - matchesPlayed);
  const myLevel = getMatchLevelForXp(xp);
  const bumped = winStreak >= 2;
  const expectedTier = `${myLevel.emoji} ${myLevel.label}${bumped ? ' → naik (menang beruntun!)' : ''}`;

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
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Match Arena</p>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>
            Pilih Lawan
          </h2>
        </div>
      </div>

      {/* Hero card */}
      <div className="rounded-3xl p-5 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #a05536, #c46a3f)' }}>
        <div className="absolute -right-6 -top-4 text-7xl opacity-15">⚔️</div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-80 mb-1 font-bold">Adu Cepat & Tepat</p>
        <h3 className="text-xl text-white mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
          Race 5 ronde
        </h3>
        <p className="text-sm text-white opacity-95 leading-relaxed mb-2">
          Sistem otomatis cariin lawan sesuai levelmu. Makin sering main, makin nantang lawannya.
        </p>
        <div className="flex items-center gap-1.5 text-xs text-white opacity-95">
          <Trophy size={12} />
          <span>{matchesPlayed} match dimainkan · Tier saat ini: {expectedTier}</span>
        </div>
      </div>

      {/* Strip 4 level — highlight level pemain saat ini */}
      <div className="rounded-2xl p-3 mb-3" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold" style={{ color: '#0a4d3c' }}>4 Level Match (ikut XP-mu)</p>
          {winStreak >= 1 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(224,122,63,0.15)', color: '#a05536' }}>
              🔥 Menang {winStreak}x beruntun
            </span>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {MATCH_LEVELS.map((l) => {
            const active = l.idx === myLevel.idx;
            return (
              <div key={l.id} className="rounded-xl p-2 text-center" style={{ background: active ? l.bgGradient : 'rgba(10,77,60,0.04)', border: active ? 'none' : '1px solid rgba(10,77,60,0.06)' }}>
                <div className="text-base leading-none mb-1">{l.emoji}</div>
                <p className="text-[10px] font-bold leading-tight" style={{ color: active ? '#fff' : '#8b6b3d' }}>{l.label}</p>
              </div>
            );
          })}
        </div>
        {bumped && (
          <p className="text-[10px] mt-2 text-center" style={{ color: '#a05536' }}>Lawan dinaikkan 1 level karena kamu menang 2x beruntun 💪</p>
        )}
      </div>

      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Pilih Mode Lawan</p>

      {/* Mode 1: Lawan Bot (auto-pick) */}
      <button
        onClick={onPickBot}
        disabled={loading}
        className="w-full p-4 rounded-2xl text-left flex items-center gap-3 mb-3 transition-transform active:scale-[0.98] disabled:opacity-50"
        style={{ background: 'white', border: '2px solid #0a4d3c' }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
          🤖
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-base leading-tight" style={{ color: '#0a4d3c' }}>Lawan Robot</p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(10,77,60,0.1)', color: '#0a4d3c' }}>
              REKOMENDASI
            </span>
          </div>
          <p className="text-xs leading-snug mb-1" style={{ color: '#666' }}>
            Sistem otomatis pilih robot sesuai pengalamanmu. Selalu siap dimainkan.
          </p>
          <p className="text-[11px]" style={{ color: '#c9a961' }}>
            Akan dapat lawan: <strong>{expectedTier}</strong>
          </p>
        </div>
        <ArrowRight size={18} style={{ color: '#0a4d3c' }} className="flex-shrink-0" />
      </button>

      {/* Mode 2: Lawan User (unlock after 3 match) */}
      <button
        onClick={onPickHuman}
        disabled={!humanUnlocked || loading}
        className="w-full p-4 rounded-2xl text-left flex items-center gap-3 mb-3 transition-transform active:scale-[0.98] disabled:active:scale-100"
        style={{
          background: 'white',
          border: humanUnlocked ? '1.5px solid rgba(10,77,60,0.12)' : '1.5px dashed rgba(139,107,61,0.3)',
          opacity: humanUnlocked ? 1 : 0.7,
        }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 relative" style={{ background: humanUnlocked ? 'linear-gradient(135deg, #c9a961, #d4b876)' : 'rgba(139,107,61,0.15)' }}>
          {humanUnlocked ? '👥' : <Lock size={20} color="#8b6b3d" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-base leading-tight" style={{ color: humanUnlocked ? '#0a4d3c' : '#8b6b3d' }}>Lawan User Asli</p>
            {!humanUnlocked && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(201,169,97,0.2)', color: '#8b6b3d' }}>
                TERKUNCI
              </span>
            )}
          </div>
          <p className="text-xs leading-snug" style={{ color: '#666' }}>
            {humanUnlocked
              ? 'Random user dari komunitas, kompete dgn stats mereka.'
              : `Main ${matchesNeeded} match lagi vs robot buat unlock fitur ini.`}
          </p>
        </div>
        {humanUnlocked && <ArrowRight size={18} style={{ color: '#c9a961' }} className="flex-shrink-0" />}
      </button>

      {/* Bot ladder preview */}
      <div className="rounded-2xl p-3 mt-2" style={{ background: 'rgba(201,169,97,0.08)', border: '1px dashed #c9a961' }}>
        <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>10 Tingkat Robot</p>
        <div className="grid grid-cols-5 gap-1 mb-1">
          {BOTS.map((b) => (
            <div key={b.id} className="text-center">
              <div className="text-lg" title={`${b.name} · Lv ${b.level}`}>{b.avatar}</div>
              <p className="text-[9px] font-semibold" style={{ color: TIER_CONFIG[b.tier].color }}>{b.level}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] leading-relaxed" style={{ color: '#8b6b3d' }}>
          Hasan (mudah) → Hassan (sulit). Sistem otomatis naikin level sesuai jam terbangmu.
        </p>
      </div>

      {/* Lives indicator */}
      <div className="mt-4">
        {lives <= 0 ? (
          <div className="rounded-2xl p-3" style={{ background: 'rgba(160,85,54,0.12)', border: '1px solid rgba(160,85,54,0.25)' }}>
            <p className="text-xs leading-relaxed text-center" style={{ color: '#a05536' }}>
              ❤️ Nyawa habis — beli pakai koin atau tunggu refresh
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5 text-xs" style={{ color: '#8b6b3d' }}>
            <span>❤️</span>
            <span>{lives}/10 nyawa · 1 match kalah = -1 nyawa</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// REVEAL VIEW — opponent intro card before play
// ============================================================================
function RevealView({ opponent, userName, onStart, onReroll, onBack }) {
  const tier = TIER_CONFIG[opponent.tier] || TIER_CONFIG.medium;
  return (
    <div className="flex-1 flex flex-col px-5 py-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Lawan ditemukan</p>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>
            {opponent.isHuman ? 'Kompete dengan' : 'Tantangan dari'}
          </h2>
        </div>
      </div>

      {/* Opponent card */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 blur-3xl opacity-50" style={{ background: tier.color, borderRadius: '50%' }} />
          <div className="relative w-32 h-32 rounded-3xl flex items-center justify-center text-7xl" style={{ background: tier.bgGradient, boxShadow: `0 20px 40px -10px ${tier.color}80` }}>
            {opponent.avatar}
          </div>
          {opponent.isHuman && (
            <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center text-base" style={{ background: '#c9a961', border: '3px solid #faf6ee' }}>
              👤
            </div>
          )}
        </div>

        <p className="text-[10px] tracking-[0.3em] uppercase mb-1 font-bold" style={{ color: tier.color }}>
          {opponent.isHuman ? 'User Asli' : `Robot · ${tier.label}`}
        </p>
        <h3 className="text-3xl mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
          {opponent.name}
        </h3>
        <p className="text-sm mb-4 italic" style={{ color: '#8b6b3d' }}>
          {opponent.subtitle}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 w-full max-w-xs mb-6">
          <div className="rounded-xl p-2.5 text-center" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: '#8b6b3d' }}>Level</p>
            <p className="text-xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: tier.color }}>{opponent.level}</p>
          </div>
          <div className="rounded-xl p-2.5 text-center" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: '#8b6b3d' }}>Akurasi</p>
            <p className="text-xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: tier.color }}>{Math.round(opponent.accuracy * 100)}%</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2"
          style={{ background: tier.bgGradient, boxShadow: `0 10px 24px -8px ${tier.color}80` }}
        >
          Mulai Match <ArrowRight size={18} />
        </button>
        <button
          onClick={onReroll}
          className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
          style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}
        >
          <Shuffle size={14} /> Cari lawan lain
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// PLAYING VIEW — gameplay 5 ronde race
// ============================================================================
function PlayingView({ opponent, userName, onComplete, onQuit }) {
  const [questions] = useState(() => generateMatchRound(ROUNDS_PER_MATCH, opponent?.matchLevel?.qLevel || 1));
  const [round, setRound] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [userAnswered, setUserAnswered] = useState(null);
  const [botAnswered, setBotAnswered] = useState(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIMEOUT_MS / 1000);
  const startTimeRef = useRef(Date.now());
  const botTimeoutRef = useRef(null);
  const roundTimeoutRef = useRef(null);
  const tier = TIER_CONFIG[opponent.tier] || TIER_CONFIG.medium;
  const current = questions[round];

  useEffect(() => {
    if (round >= questions.length) return;
    startTimeRef.current = Date.now();
    setUserAnswered(null);
    setBotAnswered(null);
    setTimeLeft(Math.floor(ROUND_TIMEOUT_MS / 1000));

    const botSim = simulateBotAnswer(opponent);
    botTimeoutRef.current = setTimeout(() => {
      setBotAnswered({ isCorrect: botSim.isCorrect, ms: botSim.delayMs });
      if (botSim.isCorrect) {
        const botRoundScore = calculateScore(true, botSim.delayMs, ROUND_TIMEOUT_MS);
        setBotScore((s) => s + botRoundScore);
      }
    }, botSim.delayMs);

    roundTimeoutRef.current = setTimeout(() => {
      advanceRound();
    }, ROUND_TIMEOUT_MS);

    return () => {
      clearTimeout(botTimeoutRef.current);
      clearTimeout(roundTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  useEffect(() => {
    if (userAnswered) return;
    const interval = setInterval(() => setTimeLeft((t) => Math.max(0, t - 0.1)), 100);
    return () => clearInterval(interval);
  }, [round, userAnswered]);

  const advanceRound = () => {
    clearTimeout(botTimeoutRef.current);
    clearTimeout(roundTimeoutRef.current);
    if (round + 1 >= questions.length) {
      const outcome = determineMatchOutcome(userScore, botScore, opponent);
      onComplete({ ...outcome, userScore, botScore });
    } else {
      setRound((r) => r + 1);
    }
  };

  const handleUserTap = (letter) => {
    if (userAnswered) return;
    const ms = Date.now() - startTimeRef.current;
    const isCorrect = letter === current.correct;
    setUserAnswered({ letter, ms, isCorrect });
    if (isCorrect) {
      const score = calculateScore(true, ms, ROUND_TIMEOUT_MS);
      setUserScore((s) => s + score);
    }
    setTimeout(advanceRound, 1200);
  };

  if (!current) return null;
  const timePercent = (timeLeft / (ROUND_TIMEOUT_MS / 1000)) * 100;

  return (
    <div className="flex-1 flex flex-col px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onQuit} className="text-xs font-semibold flex items-center gap-1" style={{ color: '#8b6b3d' }}>
          <X size={14} /> Keluar
        </button>
        <p className="text-xs tracking-widest uppercase font-bold" style={{ color: tier.color }}>
          Ronde {round + 1}/{questions.length}
        </p>
        <span className="text-xs font-semibold flex items-center gap-1" style={{ color: '#0a4d3c' }}>
          vs {opponent.avatar} {opponent.name}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-2xl p-3 text-center" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}>
          <p className="text-[10px] tracking-widest uppercase font-bold mb-0.5" style={{ color: '#0a4d3c' }}>Kamu</p>
          <p className="text-2xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>{userScore}</p>
          <p className="text-[10px]" style={{ color: '#8b6b3d' }}>{userName || 'You'}</p>
        </div>
        <div className="rounded-2xl p-3 text-center" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}>
          <p className="text-[10px] tracking-widest uppercase font-bold mb-0.5" style={{ color: tier.color }}>{opponent.avatar}</p>
          <p className="text-2xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: tier.color }}>{botScore}</p>
          <p className="text-[10px]" style={{ color: '#8b6b3d' }}>{opponent.name}</p>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(10,77,60,0.1)' }}>
        <div className="h-full transition-all" style={{ width: `${timePercent}%`, background: timePercent > 50 ? tier.color : timePercent > 25 ? '#c9a961' : '#a05536' }} />
      </div>

      <p className="text-xs tracking-widest uppercase mb-2 text-center" style={{ color: '#8b6b3d' }}>Tap huruf untuk</p>
      <div className="rounded-3xl p-5 mb-3 text-center" style={{ background: 'white', boxShadow: '0 10px 30px -10px rgba(10,77,60,0.15)' }}>
        <p className="text-xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: tier.color }}>{current.prompt}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-2 text-xs" style={{ color: '#8b6b3d' }}>
        {botAnswered ? (
          <span className={botAnswered.isCorrect ? 'font-semibold' : ''} style={{ color: botAnswered.isCorrect ? '#0a4d3c' : '#a05536' }}>
            {opponent.avatar} {opponent.name}: {botAnswered.isCorrect ? '✓ benar!' : '✗ salah'}
          </span>
        ) : (
          <span className="italic">{opponent.avatar} {opponent.name} lagi mikir...</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {current.choices.map((letter, i) => {
          let bg = 'white', border = 'rgba(10,77,60,0.12)';
          if (userAnswered) {
            if (letter === current.correct) { bg = 'rgba(10,77,60,0.1)'; border = '#0a4d3c'; }
            else if (letter === userAnswered.letter) { bg = 'rgba(160,85,54,0.15)'; border = '#a05536'; }
          }
          return (
            <button
              key={i}
              onClick={() => handleUserTap(letter)}
              disabled={!!userAnswered}
              className="aspect-square rounded-2xl flex items-center justify-center transition-all active:scale-95 disabled:active:scale-100"
              style={{ background: bg, border: `2px solid ${border}`, fontFamily: 'Amiri, serif', fontSize: '34px', color: tier.color }}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {userAnswered && (
        <div className="mt-3 text-center">
          {userAnswered.isCorrect ? (
            <p className="text-sm font-bold" style={{ color: '#0a4d3c' }}>✓ Benar! +{calculateScore(true, userAnswered.ms, ROUND_TIMEOUT_MS)} skor</p>
          ) : (
            <p className="text-sm font-bold" style={{ color: '#a05536' }}>
              ✗ Salah. Yang benar: <span style={{ fontFamily: 'Amiri, serif', fontSize: '18px' }}>{current.correct}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// RESULT VIEW — outcome + rewards
// ============================================================================
function ResultView({ result, opponent, lives, onRematch, onNewOpponent, onBack }) {
  const isWin = result.result === 'win';
  const isLose = result.result === 'lose';
  const noLives = lives <= 0;
  const tier = TIER_CONFIG[opponent.tier] || TIER_CONFIG.medium;

  const config = isWin
    ? { label: 'MENANG!', emoji: '🏆', color: '#c9a961', gradient: 'linear-gradient(135deg, #d4b876, #c9a961)' }
    : isLose
    ? { label: 'KALAH', emoji: '🔥', color: '#a05536', gradient: 'linear-gradient(135deg, #a05536, #7a3d2a)' }
    : { label: 'SERI', emoji: '🤝', color: '#8b6b3d', gradient: 'linear-gradient(135deg, #8b6b3d, #a87f47)' };

  return (
    <div className="flex-1 flex flex-col px-5 py-6 items-center justify-center text-center">
      <div className="relative mb-4">
        <div className="absolute inset-0 blur-3xl opacity-50" style={{ background: config.color, borderRadius: '50%' }} />
        <div className="relative w-28 h-28 rounded-full flex items-center justify-center text-5xl" style={{ background: config.gradient, boxShadow: `0 20px 40px -10px ${config.color}80` }}>
          {config.emoji}
        </div>
      </div>

      <p className="text-[11px] tracking-[0.3em] uppercase mb-2 font-bold" style={{ color: config.color }}>{config.label}</p>
      <h2 className="text-2xl mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
        vs {opponent.avatar} {opponent.name}
      </h2>
      <p className="text-xs mb-4" style={{ color: '#8b6b3d' }}>
        Level {opponent.level} · {opponent.subtitle}
      </p>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <p className="text-4xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>{result.userScore}</p>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: '#8b6b3d' }}>Kamu</p>
        </div>
        <span className="text-2xl" style={{ color: '#8b6b3d' }}>vs</span>
        <div className="text-center">
          <p className="text-4xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: tier.color }}>{result.botScore}</p>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: '#8b6b3d' }}>Lawan</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: `${config.color}20`, border: `1.5px solid ${config.color}` }}>
          <Star size={14} style={{ color: config.color }} fill={config.color} />
          <span className="text-sm font-bold" style={{ color: config.color }}>+{result.xpEarned} XP</span>
        </div>
        {result.coinEarned > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(201,169,97,0.2)', border: '1.5px solid #c9a961' }}>
            <span style={{ fontSize: '14px' }}>🪙</span>
            <span className="text-sm font-bold" style={{ color: '#8b6b3d' }}>+{result.coinEarned}</span>
          </div>
        )}
      </div>

      <p className="text-sm max-w-xs mb-4" style={{ color: '#3d2817' }}>{result.message}</p>

      {isLose && (
        <div className="flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full text-xs" style={{ background: noLives ? 'rgba(160,85,54,0.15)' : 'rgba(198,69,69,0.12)' }}>
          <span>❤️</span>
          <span className="font-semibold" style={{ color: noLives ? '#a05536' : '#c64545' }}>-1 Nyawa · sisa {lives}/10</span>
        </div>
      )}

      <div className="w-full max-w-xs space-y-2">
        <button
          onClick={onRematch}
          className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-white"
          style={{ background: noLives ? '#8b6b3d' : config.gradient, opacity: noLives ? 0.7 : 1 }}
        >
          {noLives ? <>❤️ Nyawa habis — beli atau tunggu</> : <><RefreshCw size={16} /> Rematch</>}
        </button>
        <button onClick={onNewOpponent} className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
          <Shuffle size={14} /> Cari lawan baru
        </button>
        <button onClick={onBack} className="w-full py-3 rounded-2xl text-sm font-semibold" style={{ background: 'rgba(10,77,60,0.06)', color: '#8b6b3d' }}>
          Kembali ke Sosial
        </button>
      </div>
    </div>
  );
}
