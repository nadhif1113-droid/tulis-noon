// components/RoleplayScreen.jsx
// Chat UI untuk AI Roleplay. User chat dengan Claude Haiku in character (Hijazi).
// Setelah scenario selesai (END_SCENARIO terdeteksi atau maxTurns), render grade screen.

'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Sparkles, Star, RefreshCw, Share2, X, Lightbulb, BookOpen, Trophy, Volume2 } from 'lucide-react';

export default function RoleplayScreen({ scenario, userId, onBack, onComplete, onShare }) {
  const [messages, setMessages] = useState([]); // [{role: 'user'|'assistant', content: '...'}]
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState('intro'); // intro, chatting, grading, graded
  const [grade, setGrade] = useState(null);
  const [showVocab, setShowVocab] = useState(false);
  const [endDetected, setEndDetected] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll ke bawah saat pesan baru masuk
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Hitung turn user (untuk maxTurns enforcement)
  const userTurns = messages.filter((m) => m.role === 'user').length;
  const turnsLeft = Math.max(0, scenario.maxTurns - userTurns);

  // Start scenario — kirim salam sbg opening user message (Anthropic API butuh
  // minimal 1 user message di array). Salam ini natural + culturally appropriate
  // untuk jamaah Indonesia, sekaligus edukatif (ngingetin selalu mulai dgn salam).
  const startScenario = async () => {
    setStage('chatting');
    setLoading(true);
    setError(null);
    try {
      const openingMessage = { role: 'user', content: 'السلام عليكم' };
      const res = await fetch('/api/roleplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          messages: [openingMessage],
          userId,
          action: 'chat',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mulai scenario');
      // Tampilkan salam user + AI greeting sebagai pesan pertama
      setMessages([
        openingMessage,
        { role: 'assistant', content: data.reply },
      ]);
      if (data.endScenario) setEndDetected(true);
    } catch (e) {
      setError(e.message);
      setStage('intro');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const newMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/roleplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          messages: newMessages,
          userId,
          action: 'chat',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI ga merespon');

      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      if (data.endScenario) {
        setEndDetected(true);
        // Auto trigger grading setelah 1.5s biar user sempet baca closing message
        setTimeout(() => requestGrading([...newMessages, { role: 'assistant', content: data.reply }]), 1500);
      } else if (newMessages.filter((m) => m.role === 'user').length >= scenario.maxTurns) {
        // Max turns tercapai — auto grade
        setTimeout(() => requestGrading([...newMessages, { role: 'assistant', content: data.reply }]), 800);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const requestGrading = async (fullHistory) => {
    setStage('grading');
    setLoading(true);
    try {
      const res = await fetch('/api/roleplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          messages: fullHistory,
          userId,
          action: 'grade',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal grading');

      setGrade(data.grade);
      setStage('graded');

      // Hitung XP earned
      const score = data.grade?.score || 0;
      const xpEarned = Math.round((score / 100) * scenario.xpReward);
      if (onComplete) {
        onComplete({ earned: xpEarned, score, grade: data.grade.grade });
      }
    } catch (e) {
      setError(e.message);
      setStage('chatting'); // balikin ke chat kalau grading gagal
    } finally {
      setLoading(false);
    }
  };

  const handleHint = () => {
    sendMessage('hint');
  };

  const handleFinish = () => {
    // User pencet "Selesai" — paksa grading
    if (messages.length === 0) {
      onBack();
      return;
    }
    requestGrading(messages);
  };

  // ============== RENDER ==============

  // INTRO stage — pre-game card with scenario info, persona, vocab hint
  if (stage === 'intro') {
    return (
      <div className="flex-1 flex flex-col px-5 py-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>

        <div className="flex-1 flex flex-col">
          {/* Scenario card */}
          <div className="rounded-3xl p-5 mb-4 relative overflow-hidden" style={{ background: scenario.bgGradient }}>
            <div className="absolute -right-4 -top-4 text-7xl opacity-15">{scenario.emoji}</div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-80 mb-1">AI Roleplay · {scenario.difficulty}</p>
            <h2 className="text-2xl text-white mb-1 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
              {scenario.title}
            </h2>
            <p className="text-base text-white opacity-90 mb-3" style={{ fontFamily: 'Amiri, serif' }}>{scenario.arTitle}</p>
            <p className="text-sm text-white opacity-95 leading-relaxed">{scenario.description}</p>
          </div>

          {/* Persona card */}
          <div className="rounded-2xl p-4 mb-3 flex items-center gap-3" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.12)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0" style={{ background: 'rgba(201,169,97,0.15)' }}>
              {scenario.persona.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: '#c9a961' }}>Kamu akan ngobrol dengan</p>
              <p className="font-semibold text-base" style={{ color: '#0a4d3c' }}>{scenario.persona.name}</p>
              <p className="text-xs" style={{ color: '#666' }}>{scenario.persona.role}</p>
            </div>
          </div>

          {/* Objective */}
          <div className="rounded-2xl p-3 mb-3 flex items-start gap-2" style={{ background: 'rgba(10,77,60,0.05)' }}>
            <Sparkles size={16} style={{ color: '#0a4d3c' }} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] tracking-widest uppercase font-bold mb-0.5" style={{ color: '#0a4d3c' }}>Misi</p>
              <p className="text-sm" style={{ color: '#3d2817' }}>{scenario.objective}</p>
            </div>
          </div>

          {/* Vocab cheat sheet (expandable) */}
          <button
            onClick={() => setShowVocab((v) => !v)}
            className="rounded-2xl p-3 mb-2 flex items-center gap-2 text-left"
            style={{ background: 'rgba(201,169,97,0.12)', border: '1px dashed #c9a961' }}
          >
            <BookOpen size={16} style={{ color: '#c9a961' }} />
            <span className="flex-1 text-sm font-semibold" style={{ color: '#8b6b3d' }}>
              {showVocab ? 'Sembunyikan' : 'Lihat'} cheat sheet vocab ({scenario.helpfulVocab.length} kata)
            </span>
            <span className="text-xs" style={{ color: '#c9a961' }}>{showVocab ? '▲' : '▼'}</span>
          </button>

          {showVocab && (
            <div className="rounded-2xl p-3 mb-3 space-y-2" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.1)' }}>
              {scenario.helpfulVocab.map((v, i) => (
                <div key={i} className="flex items-center gap-3 pb-2" style={{ borderBottom: i < scenario.helpfulVocab.length - 1 ? '1px solid rgba(10,77,60,0.08)' : 'none' }}>
                  <div className="flex-1">
                    <p className="text-base" style={{ fontFamily: 'Amiri, serif', color: scenario.color }}>{v.ar}</p>
                    <p className="text-[10px] italic" style={{ color: '#8b6b3d' }}>{v.latin}</p>
                  </div>
                  <p className="text-xs flex-1 text-right" style={{ color: '#3d2817' }}>{v.id}</p>
                </div>
              ))}
            </div>
          )}

          {/* Starter hint */}
          <div className="rounded-xl p-3 mb-4 flex items-start gap-2" style={{ background: 'rgba(201,169,97,0.08)' }}>
            <Lightbulb size={14} style={{ color: '#c9a961' }} className="mt-0.5 flex-shrink-0" />
            <p className="text-xs" style={{ color: '#8b6b3d' }}>{scenario.starterMessage}</p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl p-3 mb-3 text-xs" style={{ background: 'rgba(160,85,54,0.15)', color: '#7a3d2a' }}>
            {error}
          </div>
        )}

        <button
          onClick={startScenario}
          disabled={loading}
          className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: scenario.color, boxShadow: `0 10px 24px -8px ${scenario.color}80` }}
        >
          {loading ? 'Memulai...' : 'Mulai Ngobrol'} <Send size={16} />
        </button>
      </div>
    );
  }

  // GRADED stage — show grade card
  if (stage === 'graded' && grade) {
    const tierConfig = {
      Mumtaaz: { emoji: '🏆', color: '#c9a961', gradient: 'linear-gradient(135deg, #d4b876, #c9a961)', label: 'MUMTAAZ' },
      Jayyid: { emoji: '⭐', color: '#0a4d3c', gradient: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', label: 'JAYYID' },
      Maqbul: { emoji: '🌱', color: '#8b6b3d', gradient: 'linear-gradient(135deg, #8b6b3d, #a87f47)', label: 'MAQBUL' },
      'Latih lagi': { emoji: '🔥', color: '#a05536', gradient: 'linear-gradient(135deg, #a05536, #7a3d2a)', label: 'LATIH LAGI' },
    };
    const tier = tierConfig[grade.grade] || tierConfig.Maqbul;
    const xpEarned = Math.round(((grade.score || 0) / 100) * scenario.xpReward);

    return (
      <div className="flex-1 flex flex-col px-5 py-6 items-center justify-center text-center overflow-y-auto">
        {/* Trophy */}
        <div className="relative mb-4">
          <div className="absolute inset-0 blur-3xl opacity-50" style={{ background: tier.color, borderRadius: '50%' }} />
          <div className="relative w-28 h-28 rounded-full flex items-center justify-center text-5xl" style={{ background: tier.gradient, boxShadow: `0 20px 40px -10px ${tier.color}80` }}>
            {tier.emoji}
          </div>
        </div>

        <p className="text-[11px] tracking-[0.3em] uppercase mb-2 font-bold" style={{ color: tier.color }}>{tier.label}</p>

        <h2 className="text-2xl mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
          {scenario.title}
        </h2>
        <p className="text-xs mb-4" style={{ color: '#8b6b3d' }}>{scenario.emoji} dengan {scenario.persona.name}</p>

        {/* Score */}
        <div className="flex items-baseline gap-2 mb-3">
          <p className="text-5xl font-bold" style={{ fontFamily: 'Fraunces, serif', color: tier.color }}>{grade.score}</p>
          <p className="text-base" style={{ color: '#8b6b3d' }}>/100</p>
        </div>

        {/* XP pill */}
        <div className="flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full" style={{ background: `${tier.color}20`, border: `1.5px solid ${tier.color}` }}>
          <Star size={14} style={{ color: tier.color }} fill={tier.color} />
          <span className="text-sm font-bold" style={{ color: tier.color }}>+{xpEarned} XP</span>
        </div>

        {/* Achievement Hijazi */}
        {grade.achievement_hijazi && (
          <div className="w-full max-w-xs rounded-2xl p-3 mb-3 text-center" style={{ background: 'rgba(201,169,97,0.1)', border: '1.5px dashed #c9a961' }}>
            <p className="text-base" style={{ fontFamily: 'Amiri, serif', color: '#8b6b3d' }}>
              {grade.achievement_hijazi.split('(')[0]?.trim()}
            </p>
            {grade.achievement_hijazi.includes('(') && (
              <p className="text-xs italic mt-1" style={{ color: '#8b6b3d' }}>
                ({grade.achievement_hijazi.split('(')[1]?.replace(')', '').trim()})
              </p>
            )}
          </div>
        )}

        {/* Feedback */}
        {grade.feedback_id && (
          <p className="text-sm max-w-xs mb-4" style={{ color: '#3d2817' }}>{grade.feedback_id}</p>
        )}

        {/* Vocab learned / to practice */}
        {(grade.vocab_learned?.length > 0 || grade.vocab_to_practice?.length > 0) && (
          <div className="w-full max-w-xs space-y-2 mb-4">
            {grade.vocab_learned?.length > 0 && (
              <div className="rounded-xl p-3 text-left" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.1)' }}>
                <p className="text-[10px] tracking-widest uppercase font-bold mb-1.5" style={{ color: '#0a4d3c' }}>✓ Vocab dikuasai</p>
                <div className="flex flex-wrap gap-1.5">
                  {grade.vocab_learned.slice(0, 6).map((v, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c', fontFamily: 'Amiri, serif' }}>{v}</span>
                  ))}
                </div>
              </div>
            )}
            {grade.vocab_to_practice?.length > 0 && (
              <div className="rounded-xl p-3 text-left" style={{ background: 'white', border: '1px solid rgba(160,85,54,0.15)' }}>
                <p className="text-[10px] tracking-widest uppercase font-bold mb-1.5" style={{ color: '#a05536' }}>↻ Latih lagi</p>
                <div className="flex flex-wrap gap-1.5">
                  {grade.vocab_to_practice.slice(0, 6).map((v, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(160,85,54,0.08)', color: '#a05536', fontFamily: 'Amiri, serif' }}>{v}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="w-full max-w-xs space-y-2">
          <button
            onClick={() => {
              setMessages([]);
              setGrade(null);
              setEndDetected(false);
              setStage('intro');
            }}
            className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-white"
            style={{ background: tier.gradient }}
          >
            <RefreshCw size={16} /> Coba Lagi
          </button>

          {grade.score >= 70 && onShare && (
            <button
              onClick={() => onShare({
                scenarioName: scenario.title,
                scenarioEmoji: scenario.emoji,
                grade: grade.grade,
                score: grade.score,
                xpEarned,
              })}
              className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}
            >
              <Share2 size={16} /> Pamerin Pencapaian
            </button>
          )}

          <button onClick={onBack} className="w-full py-3 rounded-2xl text-sm font-semibold" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
            Kembali ke Pilih Roleplay
          </button>
        </div>
      </div>
    );
  }

  // GRADING stage — loading state
  if (stage === 'grading') {
    return (
      <div className="flex-1 flex items-center justify-center px-5">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 animate-spin" style={{ background: 'conic-gradient(from 0deg, #0a4d3c, #c9a961, #0a4d3c)', borderRadius: '50%' }} />
          <p className="text-sm" style={{ color: '#8b6b3d' }}>{scenario.persona.name} mengevaluasi percakapanmu...</p>
          <p className="text-xs mt-1 italic" style={{ color: '#c9a961' }}>إن شاء الله سيكون جيد</p>
        </div>
      </div>
    );
  }

  // CHATTING stage — chat UI
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 sticky top-0 z-10" style={{ background: 'rgba(250,246,238,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(10,77,60,0.08)' }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Kembali">
          <ArrowLeft size={16} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(201,169,97,0.15)' }}>
          {scenario.persona.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-tight" style={{ color: '#0a4d3c' }}>{scenario.persona.name}</p>
          <p className="text-[10px] truncate" style={{ color: '#8b6b3d' }}>
            {scenario.emoji} {scenario.title} · {turnsLeft} turn left
          </p>
        </div>
        <button
          onClick={handleFinish}
          className="px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}
        >
          Selesai
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}>
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} scenarioColor={scenario.color} personaAvatar={scenario.persona.avatar} />
        ))}
        {loading && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'rgba(201,169,97,0.15)' }}>
              {scenario.persona.avatar}
            </div>
            <div className="rounded-2xl rounded-bl-md px-4 py-3" style={{ background: 'white' }}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: scenario.color, animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: scenario.color, animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: scenario.color, animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 text-xs flex items-start gap-2" style={{ background: 'rgba(160,85,54,0.12)', color: '#7a3d2a' }}>
          <X size={14} className="mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Input area */}
      <div className="px-3 py-3 flex items-center gap-2" style={{ background: 'white', borderTop: '1px solid rgba(10,77,60,0.08)' }}>
        <button
          onClick={handleHint}
          disabled={loading}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40"
          style={{ background: 'rgba(201,169,97,0.15)' }}
          aria-label="Minta hint"
        >
          <Lightbulb size={16} style={{ color: '#c9a961' }} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          disabled={loading || endDetected}
          placeholder={endDetected ? 'Percakapan sudah ditutup...' : 'Ketik dalam Arab/Indonesia...'}
          dir="auto"
          className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
          style={{ background: 'rgba(10,77,60,0.05)', border: '1.5px solid rgba(10,77,60,0.12)', color: '#1a1a1a' }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim() || endDetected}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40"
          style={{ background: scenario.color }}
          aria-label="Kirim"
        >
          <Send size={16} color="white" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MESSAGE BUBBLE — render satu pesan (user atau AI).
// AI message format 3 baris:
//   1. Arabic dengan harakat (ditampilkan besar, font Amiri serif)
//   2. Transliterasi Latin (ditampilkan italic, ukuran sedang)
//   3. Translation Indonesia dalam ( ) (ditampilkan kecil, warna muted)
// Parsing robust: deteksi line by content (Arab vs Latin vs Indo dalam kurung).
// ============================================================================
function MessageBubble({ message, scenarioColor, personaAvatar }) {
  const isUser = message.role === 'user';

  // Parse AI message ke 3 komponen
  const parseAiMessage = (text) => {
    const lines = text.split('\n').map((l) => l.trim()).filter((l) => l);
    let arabic = '';
    let latin = '';
    let translation = '';

    for (const line of lines) {
      // Deteksi translation: line yang dimulai dengan '(' atau seluruhnya dalam ( )
      if (/^\(.+\)$/.test(line) || (line.startsWith('(') && line.endsWith(')'))) {
        translation = line.replace(/^\(|\)$/g, '').trim();
        continue;
      }
      // Deteksi Arabic: mengandung karakter Unicode Arabic (؀-ۿ)
      if (/[؀-ۿ]/.test(line)) {
        // Kalau Arabic line kedua, gabungkan
        arabic = arabic ? `${arabic} ${line}` : line;
        continue;
      }
      // Sisanya: Latin transliteration
      latin = latin ? `${latin} ${line}` : line;
    }

    // Fallback: kalau parsing gagal (cuma 1 line tanpa format), tampilkan as-is
    if (!arabic && !latin && !translation) {
      return { arabic: text, latin: '', translation: '' };
    }
    return { arabic, latin, translation };
  };

  if (isUser) {
    // User message: kalau Arab, render rtl + Amiri font. Kalau Indo/English, render normal.
    const hasArabic = /[؀-ۿ]/.test(message.content);
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[78%] rounded-2xl rounded-br-md px-4 py-2.5 shadow-sm"
          style={{ background: scenarioColor, color: 'white' }}
        >
          <p
            className="leading-relaxed whitespace-pre-wrap"
            style={{
              fontFamily: hasArabic ? 'Amiri, serif' : 'inherit',
              fontSize: hasArabic ? '17px' : '14px',
              direction: hasArabic ? 'rtl' : 'ltr',
            }}
            dir="auto"
          >
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  const { arabic, latin, translation } = parseAiMessage(message.content);

  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'rgba(201,169,97,0.15)' }}>
        {personaAvatar}
      </div>
      <div
        className="max-w-[82%] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm"
        style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}
      >
        {/* Baris 1: Arabic dengan harakat — paling prominent */}
        {arabic && (
          <p
            className="leading-relaxed"
            style={{
              fontFamily: 'Amiri, serif',
              color: scenarioColor,
              direction: 'rtl',
              fontSize: '19px',
              fontWeight: 500,
            }}
          >
            {arabic}
          </p>
        )}
        {/* Baris 2: Transliterasi Latin — italic, sedang */}
        {latin && (
          <p
            className="leading-snug italic"
            style={{
              color: '#a87f47',
              fontSize: '13px',
              marginTop: '4px',
              letterSpacing: '0.01em',
            }}
          >
            {latin}
          </p>
        )}
        {/* Baris 3: Translation Indonesia — kecil, muted */}
        {translation && (
          <p
            className="text-xs leading-snug"
            style={{ color: '#8b6b3d', marginTop: '6px' }}
          >
            <span style={{ opacity: 0.6 }}>"</span>{translation}<span style={{ opacity: 0.6 }}>"</span>
          </p>
        )}
      </div>
    </div>
  );
}
