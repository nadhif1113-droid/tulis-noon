// components/MatchArenaScreen.jsx
// Match Arena game — quick race kompetitif lawan bot.
// Flow: lobby (pilih difficulty) → playing (5 ronde × 8 detik) → result.

'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Home, Star, Trophy, Zap, RefreshCw, Check, X, Sparkles } from 'lucide-react';
import { MATCH_DIFFICULTIES, simulateBotAnswer, calculateScore, determineMatchOutcome, ROUNDS_PER_MATCH, ROUND_TIMEOUT_MS, getDifficulty } from '@/lib/match-system';
import { generateMatchRound } from '@/data/match-questions';

export default function MatchArenaScreen({ lives = 10, userName, onNoLives, onBack, onHome, onComplete }) {
  const [view, setView] = useState('lobby'); // lobby | playing | result
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [matchResult, setMatchResult] = useState(null);

  const handleStart = (difficulty) => {
    // Gate dgn lives check
    if (lives <= 0) {
      if (onNoLives) onNoLives();
      return;
    }
    setSelectedDifficulty(difficulty);
    setView('playing');
  };

  const onPlayComplete = (result) => {
    setMatchResult(result);
    setView('result');
    // Award XP & koin via parent
    if (onComplete) {
      onComplete({
        earned: result.xpEarned,
        coinEarned: result.coinEarned,
        result: result.result, // 'win' | 'lose' | 'tie'
        userScore: result.userScore,
        botScore: result.botScore,
        difficulty: selectedDifficulty.id,
      });
    }
  };

  if (view === 'lobby') {
    return (
      <LobbyView
        lives={lives}
        onBack={onBack}
        onHome={onHome}
        onStart={handleStart}
      />
    );
  }

  if (view === 'playing' && selectedDifficulty) {
    return (
      <PlayingView
        difficulty={selectedDifficulty}
        userName={userName}
        onComplete={onPlayComplete}
        onQuit={() => setView('lobby')}
      />
    );
  }

  if (view === 'result' && matchResult) {
    return (
      <ResultView
        result={matchResult}
        difficulty={selectedDifficulty}
        lives={lives}
        onRematch={() => {
          if (lives <= 0) {
            if (onNoLives) onNoLives();
            return;
          }
          setView('playing');
        }}
        onBackToLobby={() => setView('lobby')}
        onBack={onBack}
      />
    );
  }

  return null;
}

// ============================================================================
// LOBBY VIEW — pilih difficulty bot
// ============================================================================
function LobbyView({ lives, onBack, onHome, onStart }) {
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
            Adu Cepat & Tepat
          </h2>
        </div>
      </div>

      {/* Hero card */}
      <div className="rounded-3xl p-5 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #a05536, #c46a3f)' }}>
        <div className="absolute -right-6 -top-4 text-7xl opacity-15">⚔️</div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-80 mb-1">Game Sosial</p>
        <h3 className="text-xl text-white mb-2 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
          Adu skor lawan robot
        </h3>
        <p className="text-sm text-white opacity-95 leading-relaxed">
          5 ronde quick race × 8 detik. Tap huruf yang benar lebih cepat dari bot — Win XP & koin!
        </p>
      </div>

      {/* Difficulty picker */}
      <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#8b6b3d' }}>Pilih Level Robot</p>
      <div className="space-y-3 mb-4">
        {MATCH_DIFFICULTIES.map((diff) => (
          <button
            key={diff.id}
            onClick={() => onStart(diff)}
            className="w-full p-4 rounded-2xl text-left flex items-center gap-3 transition-transform active:scale-[0.98]"
            style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: diff.bgGradient }}>
              {diff.botAvatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-base leading-tight" style={{ color: diff.color }}>{diff.label}</p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${diff.color}15`, color: diff.color }}>
                  {diff.botName}
                </span>
              </div>
              <p className="text-xs leading-snug mb-1.5" style={{ color: '#666' }}>{diff.description}</p>
              <div className="flex items-center gap-3 text-[11px]">
                <span style={{ color: '#c9a961' }}>⭐ +{diff.xpReward.win} XP</span>
                <span style={{ color: '#c9a961' }}>🪙 +{diff.coinReward} koin</span>
                <span style={{ color: '#8b6b3d' }}>(kalau menang)</span>
              </div>
            </div>
            <ArrowRight size={18} style={{ color: '#c9a961' }} className="flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* Lives warning */}
      {lives <= 0 ? (
        <div className="rounded-2xl p-3 mb-2" style={{ background: 'rgba(160,85,54,0.12)', border: '1px solid rgba(160,85,54,0.25)' }}>
          <p className="text-xs leading-relaxed text-center" style={{ color: '#a05536' }}>
            ❤️ Nyawa habis — beli pakai koin atau tunggu refresh
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-1.5 text-xs" style={{ color: '#8b6b3d' }}>
          <span>❤️</span>
          <span>{lives}/10 nyawa · 1 match = -1 kalau kalah</span>
        </div>
      )}

      {/* Future PvP teaser */}
      <div className="rounded-2xl p-3 mt-4" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
        <p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: '#c9a961' }}>Akan datang</p>
        <p className="text-xs leading-relaxed" style={{ color: '#8b6b3d' }}>
          👥 <strong>Lawan user lain</strong> — tantang teman atau jamaah lain secara langsung. Lagi disiapkan.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// PLAYING VIEW — main 5 ronde, race vs bot
// ============================================================================
function PlayingView({ difficulty, userName, onComplete, onQuit }) {
  const [questions] = useState(() => generateMatchRound(ROUNDS_PER_MATCH));
  const [round, setRound] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [userAnswered, setUserAnswered] = useState(null); // {letter, ms} | null
  const [botAnswered, setBotAnswered] = useState(null);    // {isCorrect, ms} | null
  const [timeLeft, setTimeLeft] = useState(ROUND_TIMEOUT_MS / 1000);
  const startTimeRef = useRef(Date.now());
  const botTimeoutRef = useRef(null);
  const roundTimeoutRef = useRef(null);

  const current = questions[round];

  // Setup ronde baru
  useEffect(() => {
    if (round >= questions.length) return;

    startTimeRef.current = Date.now();
    setUserAnswered(null);
    setBotAnswered(null);
    setTimeLeft(Math.floor(ROUND_TIMEOUT_MS / 1000));

    // Schedule bot answer
    const botSim = simulateBotAnswer(difficulty.id);
    botTimeoutRef.current = setTimeout(() => {
      setBotAnswered({ isCorrect: botSim.isCorrect, ms: botSim.delayMs });
      if (botSim.isCorrect) {
        const botRoundScore = calculateScore(true, botSim.delayMs, ROUND_TIMEOUT_MS);
        setBotScore((s) => s + botRoundScore);
      }
    }, botSim.delayMs);

    // Timeout — kalau ronde abis
    roundTimeoutRef.current = setTimeout(() => {
      advanceRound();
    }, ROUND_TIMEOUT_MS);

    return () => {
      clearTimeout(botTimeoutRef.current);
      clearTimeout(roundTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  // Countdown display
  useEffect(() => {
    if (userAnswered) return; // user udah jawab, stop counting
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 0.1));
    }, 100);
    return () => clearInterval(interval);
  }, [round, userAnswered]);

  const advanceRound = () => {
    clearTimeout(botTimeoutRef.current);
    clearTimeout(roundTimeoutRef.current);

    if (round + 1 >= questions.length) {
      // Match selesai — kalkulasi outcome
      const finalUserScore = userScore;
      const finalBotScore = botScore;
      const outcome = determineMatchOutcome(finalUserScore, finalBotScore, difficulty.id);
      onComplete({
        ...outcome,
        userScore: finalUserScore,
        botScore: finalBotScore,
      });
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
    // Tunggu 1.2s untuk show feedback, lalu advance
    setTimeout(advanceRound, 1200);
  };

  if (!current) return null;

  const userTapDisabled = !!userAnswered;
  const timePercent = (timeLeft / (ROUND_TIMEOUT_MS / 1000)) * 100;

  return (
    <div className="flex-1 flex flex-col px-5 py-4">
      {/* Header with quit */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onQuit} className="text-xs font-semibold flex items-center gap-1" style={{ color: '#8b6b3d' }}>
          <X size={14} /> Keluar
        </button>
        <p className="text-xs tracking-widest uppercase font-bold" style={{ color: difficulty.color }}>
          Ronde {round + 1}/{questions.length}
        </p>
        <span className="text-xs font-semibold" style={{ color: '#0a4d3c' }}>vs {difficulty.botName}</span>
      </div>

      {/* Score board: kamu vs bot */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-2xl p-3 text-center" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}>
          <p className="text-[10px] tracking-widest uppercase font-bold mb-0.5" style={{ color: '#0a4d3c' }}>Kamu</p>
          <p className="text-2xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>{userScore}</p>
          <p className="text-[10px]" style={{ color: '#8b6b3d' }}>{userName || 'You'}</p>
        </div>
        <div className="rounded-2xl p-3 text-center" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}>
          <p className="text-[10px] tracking-widest uppercase font-bold mb-0.5" style={{ color: difficulty.color }}>Robot</p>
          <p className="text-2xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: difficulty.color }}>{botScore}</p>
          <p className="text-[10px]" style={{ color: '#8b6b3d' }}>{difficulty.label}</p>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(10,77,60,0.1)' }}>
        <div
          className="h-full transition-all"
          style={{
            width: `${timePercent}%`,
            background: timePercent > 50 ? difficulty.color : timePercent > 25 ? '#c9a961' : '#a05536',
          }}
        />
      </div>

      {/* Prompt */}
      <p className="text-xs tracking-widest uppercase mb-2 text-center" style={{ color: '#8b6b3d' }}>Tap huruf untuk</p>
      <div className="rounded-3xl p-5 mb-3 text-center" style={{ background: 'white', boxShadow: '0 10px 30px -10px rgba(10,77,60,0.15)' }}>
        <p className="text-xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: difficulty.color }}>
          {current.prompt}
        </p>
      </div>

      {/* Bot status indicator */}
      <div className="flex items-center justify-center gap-2 mb-2 text-xs" style={{ color: '#8b6b3d' }}>
        {botAnswered ? (
          <span className={botAnswered.isCorrect ? 'font-semibold' : ''} style={{ color: botAnswered.isCorrect ? '#0a4d3c' : '#a05536' }}>
            🤖 Robot: {botAnswered.isCorrect ? '✓ benar!' : '✗ salah'}
          </span>
        ) : (
          <span className="italic">🤖 Robot lagi mikir...</span>
        )}
      </div>

      {/* Letter grid 3x2 */}
      <div className="grid grid-cols-3 gap-2.5">
        {current.choices.map((letter, i) => {
          let bg = 'white';
          let border = 'rgba(10,77,60,0.12)';
          if (userAnswered) {
            if (letter === current.correct) {
              bg = 'rgba(10,77,60,0.1)';
              border = '#0a4d3c';
            } else if (letter === userAnswered.letter) {
              bg = 'rgba(160,85,54,0.15)';
              border = '#a05536';
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleUserTap(letter)}
              disabled={userTapDisabled}
              className="aspect-square rounded-2xl flex items-center justify-center transition-all active:scale-95 disabled:active:scale-100"
              style={{
                background: bg,
                border: `2px solid ${border}`,
                fontFamily: 'Amiri, serif',
                fontSize: '34px',
                color: difficulty.color,
              }}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* User feedback */}
      {userAnswered && (
        <div className="mt-3 text-center">
          {userAnswered.isCorrect ? (
            <p className="text-sm font-bold" style={{ color: '#0a4d3c' }}>
              ✓ Benar! +{calculateScore(true, userAnswered.ms, ROUND_TIMEOUT_MS)} skor
            </p>
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
// RESULT VIEW — siapa menang, reward
// ============================================================================
function ResultView({ result, difficulty, lives, onRematch, onBackToLobby, onBack }) {
  const isWin = result.result === 'win';
  const isLose = result.result === 'lose';
  const isTie = result.result === 'tie';
  const noLives = lives <= 0;

  const tier = isWin
    ? { label: 'MENANG!', emoji: '🏆', color: '#c9a961', gradient: 'linear-gradient(135deg, #d4b876, #c9a961)' }
    : isLose
    ? { label: 'KALAH', emoji: '🔥', color: '#a05536', gradient: 'linear-gradient(135deg, #a05536, #7a3d2a)' }
    : { label: 'SERI', emoji: '🤝', color: '#8b6b3d', gradient: 'linear-gradient(135deg, #8b6b3d, #a87f47)' };

  return (
    <div className="flex-1 flex flex-col px-5 py-6 items-center justify-center text-center">
      <div className="relative mb-4">
        <div className="absolute inset-0 blur-3xl opacity-50" style={{ background: tier.color, borderRadius: '50%' }} />
        <div className="relative w-28 h-28 rounded-full flex items-center justify-center text-5xl" style={{ background: tier.gradient, boxShadow: `0 20px 40px -10px ${tier.color}80` }}>
          {tier.emoji}
        </div>
      </div>

      <p className="text-[11px] tracking-[0.3em] uppercase mb-2 font-bold" style={{ color: tier.color }}>{tier.label}</p>
      <h2 className="text-2xl mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
        vs {difficulty.botName}
      </h2>
      <p className="text-xs mb-4" style={{ color: '#8b6b3d' }}>{difficulty.label}</p>

      {/* Skor head-to-head */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <p className="text-4xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>{result.userScore}</p>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: '#8b6b3d' }}>Kamu</p>
        </div>
        <span className="text-2xl" style={{ color: '#8b6b3d' }}>vs</span>
        <div className="text-center">
          <p className="text-4xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: difficulty.color }}>{result.botScore}</p>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: '#8b6b3d' }}>Robot</p>
        </div>
      </div>

      {/* Rewards */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: `${tier.color}20`, border: `1.5px solid ${tier.color}` }}>
          <Star size={14} style={{ color: tier.color }} fill={tier.color} />
          <span className="text-sm font-bold" style={{ color: tier.color }}>+{result.xpEarned} XP</span>
        </div>
        {result.coinEarned > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(201,169,97,0.2)', border: '1.5px solid #c9a961' }}>
            <span style={{ fontSize: '14px' }}>🪙</span>
            <span className="text-sm font-bold" style={{ color: '#8b6b3d' }}>+{result.coinEarned}</span>
          </div>
        )}
      </div>

      <p className="text-sm max-w-xs mb-4" style={{ color: '#3d2817' }}>{result.message}</p>

      {/* Lives indicator kalau kalah */}
      {isLose && (
        <div className="flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full text-xs" style={{ background: noLives ? 'rgba(160,85,54,0.15)' : 'rgba(198,69,69,0.12)' }}>
          <span>❤️</span>
          <span className="font-semibold" style={{ color: noLives ? '#a05536' : '#c64545' }}>
            -1 Nyawa · sisa {lives}/10
          </span>
        </div>
      )}

      <div className="w-full max-w-xs space-y-2">
        <button
          onClick={onRematch}
          className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-white"
          style={{
            background: noLives ? '#8b6b3d' : tier.gradient,
            opacity: noLives ? 0.7 : 1,
          }}
        >
          {noLives ? (
            <>❤️ Nyawa habis — beli atau tunggu</>
          ) : (
            <><RefreshCw size={16} /> Rematch</>
          )}
        </button>
        <button onClick={onBackToLobby} className="w-full py-3 rounded-2xl text-sm font-semibold" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
          Ganti Level Robot
        </button>
        <button onClick={onBack} className="w-full py-3 rounded-2xl text-sm font-semibold" style={{ background: 'rgba(10,77,60,0.06)', color: '#8b6b3d' }}>
          Kembali ke Sosial
        </button>
      </div>
    </div>
  );
}
