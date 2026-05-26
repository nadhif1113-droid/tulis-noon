// components/AdminHelpFAB.jsx
// Floating button + chat modal untuk AI Admin (customer service).
// Hanya dipakai di Profile page — gak muncul di tempat lain.
//
// Flow: user tap FAB → modal chat terbuka → ngobrol dgn AI → kalau AI gak bisa jawab,
// user bisa tap "Tanyakan ke Founder" → escalate ke email + Firestore.

'use client';

import { useState, useEffect, useRef } from 'react';
import { Headphones, X, Send, Loader2, Mail, Check, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminHelpFAB({ user, userProfile }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed flex items-center gap-2 rounded-full active:scale-95 transition-all"
        style={{
          right: 16,
          bottom: 88, // di atas BottomNav-like area
          zIndex: 60,
          padding: '14px 18px 14px 14px',
          background: 'linear-gradient(135deg, #0a4d3c 0%, #1a6b56 100%)',
          boxShadow: '0 12px 28px -4px rgba(10,77,60,0.5), 0 0 0 4px rgba(255,255,255,0.85), 0 0 0 6px rgba(10,77,60,0.2)',
        }}
        aria-label="Bantuan / Admin"
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.95)' }}>
          <Headphones size={14} style={{ color: '#0a4d3c' }} />
        </div>
        <div className="pr-1">
          <p className="text-[9px] tracking-widest uppercase font-bold leading-none text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
            BUTUH BANTUAN?
          </p>
          <p className="text-[11px] font-bold text-white leading-tight mt-0.5" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
            Tanya Admin
          </p>
        </div>
      </button>

      {isOpen && <AdminChatModal user={user} userProfile={userProfile} onClose={() => setIsOpen(false)} />}
    </>
  );
}

// ============================================================================
// CHAT MODAL — interaksi dgn AI Admin
// ============================================================================
function AdminChatModal({ user, userProfile, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'admin', content: 'Assalamu alaikum 👋 Saya Admin AI Tulis Noon. Ada yang bisa saya bantu? (pertanyaan tentang fitur, koin, hafalan, payment, atau keluhan).' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [error, setError] = useState(null);
  const [needsHumanFlag, setNeedsHumanFlag] = useState(false);
  const [lastCategory, setLastCategory] = useState('lainnya');

  const messagesEndRef = useRef(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    const q = input.trim();
    if (!q || isLoading) return;
    const newMsgs = [...messages, { role: 'user', content: q }];
    setMessages(newMsgs);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs,
          userId: user?.uid || 'anon',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');

      setMessages([...newMsgs, { role: 'admin', content: data.answer, tipLinks: data.tip_links }]);
      setNeedsHumanFlag(!!data.needs_human);
      setLastCategory(data.category || 'lainnya');
    } catch (e) {
      setError(e.message || 'Gagal kirim pesan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (escalating) return;
    setEscalating(true);
    setError(null);
    try {
      const deviceInfo = typeof navigator !== 'undefined' ? `${navigator.userAgent} · ${navigator.language} · ${window.innerWidth}x${window.innerHeight}` : '';
      const res = await fetch('/api/admin-help/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid,
          userEmail: user?.email,
          userName: userProfile?.displayName || user?.displayName || 'User',
          userPhotoURL: userProfile?.photoURL || null,
          messages,
          category: lastCategory,
          deviceInfo,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Escalate failed');
      setEscalated(true);
      setMessages((m) => [...m, {
        role: 'admin',
        content: `✅ Pertanyaan kamu sudah saya teruskan ke founder (Nadhif) via email. Tiket: ${data.ticketId}. Founder akan reply ke email ${user?.email} ya — biasanya 1-2 hari. Terima kasih sudah sabar!`,
      }]);
    } catch (e) {
      setError(e.message || 'Gagal escalate. Coba lagi atau email langsung ke nadhif1113@gmail.com');
    } finally {
      setEscalating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(10,30,25,0.85)' }} onClick={onClose}>
      <div
        className="w-full max-w-md flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)', height: '88vh', maxHeight: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ background: 'rgba(250,246,238,0.95)', borderBottom: '1px solid rgba(10,77,60,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
              <Headphones size={18} color="white" />
            </div>
            <div>
              <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: '#c9a961' }}>🤖 ADMIN AI</p>
              <h2 className="text-base font-semibold leading-tight" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>
                Bantuan Tulis Noon
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <X size={16} style={{ color: '#0a4d3c' }} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((m, i) => (
            <div key={i}>
              {m.role === 'user' && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
                    <p className="text-sm text-white leading-snug">{m.content}</p>
                  </div>
                </div>
              )}
              {m.role === 'admin' && (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
                    <Sparkles size={12} color="white" />
                  </div>
                  <div className="max-w-[85%]">
                    <div className="rounded-2xl rounded-tl-sm px-4 py-2.5" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.12)' }}>
                      <p className="text-sm leading-snug" style={{ color: '#3d2817' }}>{m.content}</p>
                    </div>
                    {Array.isArray(m.tipLinks) && m.tipLinks.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {m.tipLinks.map((l, li) => (
                          <span key={li} className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
                            💡 {l.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
                <Sparkles size={12} color="white" />
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-2" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.1)' }}>
                <Loader2 size={12} className="animate-spin" style={{ color: '#0a4d3c' }} />
                <span className="text-xs" style={{ color: '#8b6b3d' }}>Admin lagi mikir...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="rounded-2xl p-3 flex items-start gap-2" style={{ background: 'rgba(160,85,54,0.1)', border: '1px solid #a05536' }}>
              <AlertCircle size={14} style={{ color: '#a05536' }} className="flex-shrink-0 mt-0.5" />
              <p className="text-xs flex-1" style={{ color: '#a05536' }}>{error}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Escalation CTA — muncul kalau AI bilang butuh founder */}
        {needsHumanFlag && !escalated && (
          <div className="px-4 pb-2 flex-shrink-0">
            <button
              onClick={handleEscalate}
              disabled={escalating}
              className="w-full p-3 rounded-2xl flex items-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)', boxShadow: '0 8px 20px -6px rgba(201,169,97,0.4)' }}
            >
              {escalating ? <Loader2 size={16} className="animate-spin" color="white" /> : <Mail size={16} color="white" />}
              <div className="flex-1 text-left">
                <p className="text-xs font-bold text-white">Tanyakan ke Founder</p>
                <p className="text-[10px] text-white opacity-90">Saya teruskan email ke Nadhif</p>
              </div>
            </button>
          </div>
        )}

        {escalated && (
          <div className="px-4 pb-2 flex-shrink-0">
            <div className="w-full p-3 rounded-2xl flex items-center gap-2" style={{ background: 'rgba(10,77,60,0.08)', border: '1.5px solid rgba(10,77,60,0.2)' }}>
              <Check size={16} style={{ color: '#0a4d3c' }} />
              <p className="text-xs flex-1" style={{ color: '#0a4d3c' }}>
                <strong>Terkirim ke founder.</strong> Reply akan masuk ke email kamu.
              </p>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-4 pt-2 flex-shrink-0" style={{ background: 'rgba(250,246,238,0.95)', borderTop: '1px solid rgba(10,77,60,0.08)' }}>
          <div className="flex items-end gap-2">
            <div className="flex-1 rounded-2xl px-3 py-2 flex items-end" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.15)' }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Tulis pertanyaan atau keluhan kamu..."
                rows={1}
                className="flex-1 outline-none resize-none bg-transparent text-sm leading-relaxed"
                style={{ color: '#1a1a1a', maxHeight: '120px', minHeight: '24px' }}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}
              aria-label="Kirim"
            >
              <Send size={14} color="white" />
            </button>
          </div>
          <p className="text-[9px] text-center mt-2" style={{ color: '#8b6b3d' }}>
            💚 Powered by Claude AI · Pertanyaan complex auto-forward ke founder
          </p>
        </div>
      </div>
    </div>
  );
}
