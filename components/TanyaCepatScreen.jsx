// components/TanyaCepatScreen.jsx
// Tanya Cepat — chat dengan AI Hijazi Arab. User ngomong/ketik Indonesia,
// AI jawab Arab Hijazi + latin + Indo + tips. Voice rec via Web Speech API.
//
// Quota: 5 percakapan free, lalu 5 koin = 10 percakapan bundle.

'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Home, Mic, MicOff, Send, Volume2, Sparkles, Loader2, X, Coins, MessageCircle, Lightbulb, Copy, Check, Info, HelpCircle } from 'lucide-react';

const INTRO_STORAGE_KEY = 'tanyaCepatIntroSeen_v1';

export const TANYA_CEPAT_FREE_LIMIT = 5;
export const TANYA_CEPAT_BUNDLE_COST = 20; // koin (= Rp 9.000 dgn baseline Rp 450/koin)
export const TANYA_CEPAT_BUNDLE_QUOTA = 10; // percakapan per bundle

export default function TanyaCepatScreen({
  userProfile,
  userId,
  onBack,
  onHome,
  onConsumeQuota,      // () => Promise<boolean> — kurangi quota (-1)
  onBuyBundle,         // () => Promise<boolean> — beli 10 percakapan = 5 koin
}) {
  const [messages, setMessages] = useState([]); // [{role:'user'|'assistant', content, parsed?}]
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBundleModal, setShowBundleModal] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [showIntro, setShowIntro] = useState(false);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const transcriptRef = useRef('');

  // Show intro modal saat first open (localStorage check)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const seen = window.localStorage.getItem(INTRO_STORAGE_KEY);
      if (!seen) setShowIntro(true);
    } catch (e) {
      // localStorage gak available — tetep show
      setShowIntro(true);
    }
  }, []);

  const handleCloseIntro = (dontShowAgain = true) => {
    if (dontShowAgain && typeof window !== 'undefined') {
      try { window.localStorage.setItem(INTRO_STORAGE_KEY, '1'); } catch {}
    }
    setShowIntro(false);
  };

  // Compute remaining quota
  const freeUsed = userProfile?.tanyaCepatFreeUsed || 0;
  const bundleQuota = userProfile?.tanyaCepatBundleQuota || 0;
  const freeRemaining = Math.max(0, TANYA_CEPAT_FREE_LIMIT - freeUsed);
  const totalRemaining = freeRemaining + bundleQuota;
  const hasQuota = totalRemaining > 0;

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice rec — Indonesian
  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setError('Voice recognition tidak didukung di browser ini. Pakai Chrome atau Safari.');
      return;
    }
    const rec = new SR();
    rec.lang = 'id-ID';
    rec.continuous = true;
    rec.interimResults = true;

    transcriptRef.current = '';
    rec.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      if (final) transcriptRef.current += final + ' ';
      setInputText(transcriptRef.current + interim);
    };
    rec.onerror = (e) => {
      console.error('SpeechRec error:', e.error);
      setIsListening(false);
      if (e.error !== 'no-speech' && e.error !== 'aborted') {
        setError('Error mic: ' + e.error);
      }
    };
    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
    setError(null);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // TTS Arabic
  const speakArabic = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA';
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
  };

  const copyToClipboard = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch (e) {}
  };

  const handleSend = async () => {
    const q = inputText.trim();
    if (!q || isLoading) return;

    // Cek quota
    if (!hasQuota) {
      setShowBundleModal(true);
      return;
    }

    setError(null);
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setInputText('');
    transcriptRef.current = '';
    setIsLoading(true);

    try {
      const res = await fetch('/api/tanya-cepat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, userId: userId || 'anon' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Request failed');
      }

      // Consume quota AFTER success
      await onConsumeQuota?.();

      setMessages((m) => [...m, { role: 'assistant', parsed: data }]);

      // Auto-speak the Arab response
      if (data.ar) {
        setTimeout(() => speakArabic(data.ar), 300);
      }
    } catch (e) {
      setError(e.message || 'Gagal kirim pertanyaan');
      // Remove the optimistic user message? Keep it, just show error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col" style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-3 flex items-center gap-2" style={{ background: 'rgba(250,246,238,0.95)', borderBottom: '1px solid rgba(10,77,60,0.08)' }}>
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <button onClick={onHome || onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <Home size={17} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: '#c9a961' }}>⚡ Tanya Cepat</p>
          <h2 className="text-base font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>
            Asisten Arab Hijazi
          </h2>
        </div>
        <button onClick={() => setShowIntro(true)} className="w-9 h-9 rounded-full flex items-center justify-center mr-1" style={{ background: 'rgba(201,169,97,0.18)' }} aria-label="Info">
          <Info size={15} style={{ color: '#8b6b3d' }} />
        </button>
        <div className="flex flex-col items-end">
          <div className="text-[10px] font-bold" style={{ color: hasQuota ? '#0a4d3c' : '#a05536' }}>
            {totalRemaining} tersisa
          </div>
          <div className="text-[9px]" style={{ color: '#8b6b3d' }}>
            {freeRemaining > 0 ? `${freeRemaining} free` : `${bundleQuota} bundle`}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <WelcomeCard />
        )}

        {messages.map((m, idx) => (
          <div key={idx}>
            {m.role === 'user' && (
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
                  <p className="text-sm text-white leading-snug">{m.content}</p>
                </div>
              </div>
            )}
            {m.role === 'assistant' && m.parsed && (
              <AssistantBubble
                parsed={m.parsed}
                onSpeak={speakArabic}
                onCopy={(txt) => copyToClipboard(txt, idx)}
                copied={copiedIdx === idx}
              />
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
              <Sparkles size={14} color="white" />
            </div>
            <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-2" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.1)' }}>
              <Loader2 size={14} className="animate-spin" style={{ color: '#0a4d3c' }} />
              <span className="text-xs" style={{ color: '#8b6b3d' }}>AI lagi mikir...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl p-3" style={{ background: 'rgba(160,85,54,0.1)', border: '1px solid #a05536' }}>
            <p className="text-xs" style={{ color: '#a05536' }}>{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 pb-4 pt-2" style={{ background: 'rgba(250,246,238,0.95)', borderTop: '1px solid rgba(10,77,60,0.08)' }}>
        {!hasQuota && (
          <button
            onClick={() => setShowBundleModal(true)}
            className="w-full mb-2 rounded-2xl p-3 text-left flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}
          >
            <Sparkles size={18} color="white" />
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Quota habis</p>
              <p className="text-[11px] text-white opacity-90">Tap untuk beli bundle {TANYA_CEPAT_BUNDLE_QUOTA} percakapan = {TANYA_CEPAT_BUNDLE_COST} koin</p>
            </div>
          </button>
        )}
        <div className="flex items-end gap-2">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isLoading}
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform disabled:opacity-50"
            style={{
              background: isListening ? 'linear-gradient(135deg, #a05536, #c46a3f)' : 'linear-gradient(135deg, #0a4d3c, #1a6b56)',
              boxShadow: isListening ? '0 0 0 4px rgba(160,85,54,0.25)' : '0 4px 12px -2px rgba(10,77,60,0.3)',
            }}
            aria-label={isListening ? 'Stop' : 'Rekam suara'}
          >
            {isListening ? <MicOff size={18} color="white" /> : <Mic size={18} color="white" />}
          </button>
          <div className="flex-1 rounded-2xl px-3 py-2 flex items-end" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.15)' }}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={isListening ? '🎤 Lagi dengerin...' : 'Tulis pertanyaan dalam Bahasa Indonesia'}
              rows={1}
              className="flex-1 outline-none resize-none bg-transparent text-sm leading-relaxed"
              style={{ color: '#1a1a1a', maxHeight: '120px', minHeight: '24px' }}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}
            aria-label="Kirim"
          >
            <Send size={16} color="white" />
          </button>
        </div>
        <p className="text-[10px] text-center mt-2" style={{ color: '#8b6b3d' }}>
          {isListening ? '🔴 Ngomong dalam Bahasa Indonesia...' : 'Tap mic, ngomong dalam Bahasa Indonesia. AI jawab pakai Arab Hijazi.'}
        </p>
      </div>

      {/* Bundle modal */}
      {/* Intro modal — keterangan singkat tujuan Tanya Cepat */}
      {showIntro && <TanyaCepatIntroModal onClose={handleCloseIntro} />}

      {showBundleModal && (
        <BundleModal
          coins={userProfile?.coins || 0}
          onClose={() => setShowBundleModal(false)}
          onBuy={async () => {
            const ok = await onBuyBundle?.();
            if (ok !== false) setShowBundleModal(false);
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// Welcome card — saat belum ada pesan
// ============================================================================
function WelcomeCard() {
  const examples = [
    'Gimana cara tanya di mana toilet?',
    'Aku mau bilang terima kasih ke supir taksi',
    'Cara nawar harga kurma di pasar',
    'Bilang lagi puasa, gak makan dulu',
    'Tanya jadwal sholat Maghrib',
  ];
  return (
    <div className="text-center py-4">
      <div className="rounded-3xl p-5 mb-3 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
        <div className="absolute -right-2 -top-2 text-7xl opacity-15">⚡</div>
        <div className="text-5xl mb-2">💬</div>
        <h3 className="text-lg font-bold text-white mb-1.5" style={{ fontFamily: 'Fraunces, serif' }}>
          Cara cepat ngomong Arab Hijazi
        </h3>
        <p className="text-xs text-white opacity-90 leading-snug px-2">
          Tulis atau ngomong dalam Bahasa Indonesia.<br/>
          AI jawab pakai dialek Mekkah/Madinah + cara baca + arti.
        </p>
      </div>

      <p className="text-[10px] tracking-widest uppercase font-bold mb-2 text-center" style={{ color: '#8b6b3d' }}>
        Contoh pertanyaan
      </p>
      <div className="space-y-1.5 text-left">
        {examples.map((e, i) => (
          <div key={i} className="rounded-xl px-3 py-2 text-xs" style={{ background: 'rgba(10,77,60,0.05)', color: '#3d2817' }}>
            💡 "{e}"
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Assistant bubble — render parsed AI response
// ============================================================================
function AssistantBubble({ parsed, onSpeak, onCopy, copied }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
        <Sparkles size={14} color="white" />
      </div>
      <div className="flex-1 max-w-[88%] space-y-2">
        {/* Main Arab response */}
        {parsed.ar && (
          <div className="rounded-2xl rounded-tl-sm p-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.12)' }}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-[9px] tracking-widest uppercase font-bold" style={{ color: '#c9a961' }}>JAWABAN ARAB HIJAZI</span>
              <div className="flex gap-1">
                <button onClick={() => onSpeak(parsed.ar)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Dengarkan">
                  <Volume2 size={12} style={{ color: '#0a4d3c' }} />
                </button>
                <button onClick={() => onCopy(parsed.ar + '\n' + parsed.latin)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Copy">
                  {copied ? <Check size={12} style={{ color: '#0a4d3c' }} /> : <Copy size={12} style={{ color: '#0a4d3c' }} />}
                </button>
              </div>
            </div>
            <p className="text-2xl leading-relaxed mb-1.5" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c', direction: 'rtl' }}>
              {parsed.ar}
            </p>
            <p className="text-xs italic mb-1" style={{ color: '#8b6b3d' }}>{parsed.latin}</p>
            <p className="text-xs leading-snug" style={{ color: '#3d2817' }}>{parsed.indo}</p>
          </div>
        )}

        {/* Tips */}
        {parsed.tips && (
          <div className="rounded-2xl p-3 flex items-start gap-2" style={{ background: 'rgba(201,169,97,0.12)', border: '1px dashed #c9a961' }}>
            <Lightbulb size={12} style={{ color: '#8b6b3d' }} className="flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-snug flex-1" style={{ color: '#8b6b3d' }}>{parsed.tips}</p>
          </div>
        )}

        {/* Alternatif */}
        {Array.isArray(parsed.alternatif) && parsed.alternatif.length > 0 && (
          <div>
            <p className="text-[9px] tracking-widest uppercase font-bold mb-1.5 ml-1" style={{ color: '#8b6b3d' }}>Cara lain</p>
            <div className="space-y-1.5">
              {parsed.alternatif.map((alt, ai) => (
                <div key={ai} className="rounded-xl p-3" style={{ background: 'rgba(10,77,60,0.04)', border: '1px solid rgba(10,77,60,0.1)' }}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-lg leading-snug" style={{ fontFamily: 'Amiri, serif', color: '#0a4d3c', direction: 'rtl' }}>
                      {alt.ar}
                    </p>
                    <button onClick={() => onSpeak(alt.ar)} className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'white' }}>
                      <Volume2 size={10} style={{ color: '#0a4d3c' }} />
                    </button>
                  </div>
                  <p className="text-[10px] italic mb-0.5" style={{ color: '#8b6b3d' }}>{alt.latin}</p>
                  <p className="text-[10px]" style={{ color: '#3d2817' }}>{alt.indo}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Bundle modal — beli 10 percakapan = 5 koin
// ============================================================================
function BundleModal({ coins, onClose, onBuy }) {
  const canAfford = coins >= TANYA_CEPAT_BUNDLE_COST;
  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(10,30,25,0.85)' }} onClick={onClose}>
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
        style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-2">
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: '#c9a961' }}>⚡ TAMBAH QUOTA</p>
            <h2 className="text-2xl leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
              {TANYA_CEPAT_BUNDLE_QUOTA} Percakapan
            </h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <X size={16} style={{ color: '#0a4d3c' }} />
          </button>
        </div>
        <div className="px-6 pb-6">
          <div className="rounded-3xl p-6 mb-4 text-center" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
            <div className="text-6xl mb-2">⚡</div>
            <p className="text-base text-white font-semibold leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
              Hemat & Cepat
            </p>
            <p className="text-xs text-white opacity-90 mt-1">
              0,5 koin per pertanyaan (lebih hemat dari beli 1-1)
            </p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 rounded-xl p-2.5" style={{ background: 'rgba(10,77,60,0.06)' }}>
              <span className="text-base">💬</span>
              <p className="text-xs flex-1" style={{ color: '#3d2817' }}>{TANYA_CEPAT_BUNDLE_QUOTA} pertanyaan ekstra ke AI Hijazi</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl p-2.5" style={{ background: 'rgba(10,77,60,0.06)' }}>
              <span className="text-base">🎙️</span>
              <p className="text-xs flex-1" style={{ color: '#3d2817' }}>Voice rec ID + TTS Arab tetep aktif</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl p-2.5" style={{ background: 'rgba(10,77,60,0.06)' }}>
              <span className="text-base">♾️</span>
              <p className="text-xs flex-1" style={{ color: '#3d2817' }}>Quota terakumulasi, gak expire</p>
            </div>
          </div>

          <div className="rounded-2xl p-3 mb-3 flex items-center justify-between" style={{ background: 'rgba(201,169,97,0.12)' }}>
            <div className="flex items-center gap-2">
              <Coins size={16} style={{ color: '#c9a961' }} />
              <span className="text-xs font-bold" style={{ color: '#8b6b3d' }}>Saldo koin</span>
            </div>
            <span className="text-base font-bold" style={{ color: '#0a4d3c' }}>{coins}</span>
          </div>

          <button
            onClick={onBuy}
            disabled={!canAfford}
            className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)', boxShadow: '0 10px 24px -8px rgba(201,169,97,0.5)' }}
          >
            <Coins size={16} /> Beli Bundle · {TANYA_CEPAT_BUNDLE_COST} koin
          </button>

          {!canAfford && (
            <p className="text-[11px] text-center mt-2" style={{ color: '#a05536' }}>
              Koin kurang. Top-up koin atau selesaikan game untuk dapet free.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INTRO MODAL — keterangan singkat tujuan Tanya Cepat
// Muncul sekali pas first open. User bisa tap info icon (ⓘ) di header buat re-open.
// ============================================================================
function TanyaCepatIntroModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[85] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(10,30,25,0.88)' }} onClick={() => onClose(true)}>
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
        style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-2">
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: '#c9a961' }}>
              ⚡ APA INI?
            </p>
            <h2 className="text-2xl leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
              Tanya Cepat
            </h2>
          </div>
          <button onClick={() => onClose(true)} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Tutup">
            <X size={16} style={{ color: '#0a4d3c' }} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Hero */}
          <div className="rounded-3xl p-5 mb-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
            <div className="absolute inset-0 opacity-15" style={{ background: 'radial-gradient(circle at 50% 30%, white 0%, transparent 60%)' }} />
            <div className="relative">
              <div className="text-6xl mb-2">⚡</div>
              <p className="text-base text-white opacity-95 font-semibold leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
                Asisten Bahasa Arab Hijazi
              </p>
              <p className="text-xs text-white opacity-90 mt-1">
                Khusus jamaah yang lagi di Saudi
              </p>
            </div>
          </div>

          {/* Bullet penjelasan */}
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#3d2817' }}>
            Tombol ini bantu kamu <strong>ngomong sama orang Saudi</strong> walaupun gak bisa Arab — pas kondisi mendesak di Mekkah/Madinah.
          </p>

          <div className="space-y-2 mb-4">
            {[
              { icon: '🎙️', t: 'Tap mic → ngomong dalam Bahasa Indonesia', d: 'Contoh: "Gimana cara tanya di mana toilet?"' },
              { icon: '🗣️', t: 'AI jawab pakai Arab Hijazi (Mekkah/Madinah)', d: 'Bukan Fusha formal — pakai dialek native yang dipake sehari-hari' },
              { icon: '🔊', t: 'Auto-suara native + transliterasi latin', d: 'Tinggal tirukan, langsung paham orang Saudi-nya' },
              { icon: '💡', t: 'Plus tips konteks & alternatif kata', d: 'Biar tau pakai yang formal atau casual' },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl p-3" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
                <span className="text-xl flex-shrink-0">{b.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold leading-tight" style={{ color: '#0a4d3c' }}>{b.t}</p>
                  <p className="text-[11px] mt-1 leading-snug" style={{ color: '#8b6b3d' }}>{b.d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Use cases */}
          <div className="rounded-2xl p-3 mb-4" style={{ background: 'rgba(10,77,60,0.05)', border: '1.5px dashed rgba(10,77,60,0.2)' }}>
            <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#0a4d3c' }}>📌 Cocok dipake buat:</p>
            <ul className="text-xs space-y-1.5" style={{ color: '#3d2817' }}>
              <li>🗺️ Tanya arah ke masjid, hotel, restoran</li>
              <li>🛍️ Nawar harga di pasar / toko</li>
              <li>🚖 Komunikasi sama supir taksi</li>
              <li>🍽️ Order makanan di restoran</li>
              <li>🆘 Minta bantuan ke polisi/security</li>
              <li>👨‍⚕️ Tanya obat di apotek</li>
            </ul>
          </div>

          {/* Quota info */}
          <div className="rounded-2xl p-3 mb-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(10,77,60,0.08), rgba(201,169,97,0.08))', border: '1.5px solid rgba(10,77,60,0.15)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,169,97,0.3)' }}>
              <Coins size={16} style={{ color: '#c9a961' }} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold mb-0.5" style={{ color: '#0a4d3c' }}>5 percakapan GRATIS</p>
              <p className="text-[11px] leading-snug" style={{ color: '#8b6b3d' }}>
                Setelah habis, top-up <strong>5 koin = 10 percakapan</strong>
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => onClose(true)}
            className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', boxShadow: '0 10px 24px -8px rgba(10,77,60,0.5)' }}
          >
            <Sparkles size={16} /> Oke, Coba Sekarang
          </button>

          <p className="text-[10px] text-center mt-3" style={{ color: '#8b6b3d' }}>
            Bisa buka info ini lagi lewat ikon <Info size={10} className="inline" /> di pojok kanan atas
          </p>
        </div>
      </div>
    </div>
  );
}
