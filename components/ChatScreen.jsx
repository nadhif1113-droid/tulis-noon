// components/ChatScreen.jsx
// Chat teman (DM) — WAJIB bahasa Arab & bermakna.
// - Input difilter: cuma huruf Arab, angka, spasi, tanda baca (huruf latin diblok).
// - Saat kirim: divalidasi server (Arab + bermakna via AI). Ngasal → ditolak.
// - Modal aturan muncul pas pertama masuk sesi.

'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Home, Send, Loader2, AlertCircle, Info } from 'lucide-react';
import { dmPairId, sendDmMessage, listenDmMessages, validateArabicText } from '@/lib/social';

// Hanya izinkan: huruf Arab, spasi, angka (latin/arab), tanda baca umum. Sisanya dibuang.
const ALLOWED_RE = /[^؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿\s0-9٠-٩.,!?؟،؛:"'()\-]/g;

function Avatar({ emoji, name, size = 32 }) {
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
      style={{ width: size, height: size, background: emoji ? 'rgba(201,169,97,0.15)' : 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
      {emoji ? <span style={{ fontSize: size * 0.55 }}>{emoji}</span> : <span className="text-white font-bold" style={{ fontSize: size * 0.42 }}>{(name || '?')[0].toUpperCase()}</span>}
    </div>
  );
}

export default function ChatScreen({ userId, userProfile, friend, onBack, onHome }) {
  const me = {
    uid: userId,
    name: userProfile?.displayName || 'Pengguna',
    avatarEmoji: userProfile?.avatarEmoji || null,
  };
  const pairId = friend?.uid && userId ? dmPairId(userId, friend.uid) : null;

  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [showRules, setShowRules] = useState(true);
  const scrollRef = useRef(null);

  // Listen pesan real-time
  useEffect(() => {
    if (!pairId) return;
    const unsub = listenDmMessages(pairId, (msgs) => setMessages(msgs));
    return () => { try { unsub && unsub(); } catch (e) {} };
  }, [pairId]);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const onChangeDraft = (e) => {
    // Buang karakter non-Arab (tutup celah ketik bahasa lain)
    const filtered = e.target.value.replace(ALLOWED_RE, '');
    setDraft(filtered);
    if (error) setError(null);
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setError(null);
    const check = await validateArabicText(text);
    if (!check.valid) {
      setError(check.reason || 'Pesan harus bahasa Arab yang bermakna');
      setSending(false);
      return;
    }
    const res = await sendDmMessage(pairId, me, text);
    if (res.success) {
      setDraft('');
    } else {
      setError('Gagal kirim, coba lagi');
    }
    setSending(false);
  };

  return (
    <div className="flex-1 flex flex-col" style={{ height: '100%' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid rgba(10,77,60,0.08)' }}>
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={17} style={{ color: '#0a4d3c' }} />
        </button>
        <Avatar emoji={friend?.avatarEmoji} name={friend?.displayName} size={36} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: '#0a4d3c' }}>{friend?.displayName || 'Teman'}</p>
          <p className="text-[11px]" style={{ color: friend?.online ? '#16a34a' : '#8b6b3d' }}>{friend?.online ? '● Online' : 'Offline'}</p>
        </div>
        <button onClick={() => setShowRules(true)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Aturan chat">
          <Info size={16} style={{ color: '#0a4d3c' }} />
        </button>
      </div>

      {/* Pesan */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 0 }}>
        {messages.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-3xl mb-2">🕌</div>
            <p className="text-sm font-semibold" style={{ color: '#0a4d3c' }}>Mulai ngobrol pakai bahasa Arab</p>
            <p className="text-xs mt-1" style={{ color: '#8b6b3d' }}>Sapa temanmu: السَّلَامُ عَلَيْكُم</p>
          </div>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === userId;
            return (
              <div key={m.id} className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
                {!mine && <Avatar emoji={m.senderAvatar} name={m.senderName} size={28} />}
                <div className="max-w-[75%]">
                  <div className="px-3.5 py-2.5 rounded-2xl" style={{
                    background: mine ? 'linear-gradient(135deg, #0a4d3c, #1a6b56)' : 'white',
                    border: mine ? 'none' : '1px solid rgba(10,77,60,0.1)',
                    borderBottomRightRadius: mine ? 4 : 16,
                    borderBottomLeftRadius: mine ? 16 : 4,
                  }}>
                    <p className="text-base leading-relaxed" dir="rtl" style={{ fontFamily: 'Amiri, serif', color: mine ? '#fff' : '#1a1a1a' }}>{m.text}</p>
                  </div>
                  <p className={`text-[10px] mt-0.5 ${mine ? 'text-right' : ''}`} style={{ color: '#8b6b3d' }}>{m.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-2 px-3 py-2 rounded-xl flex items-center gap-2" style={{ background: 'rgba(192,57,43,0.08)' }}>
          <AlertCircle size={14} style={{ color: '#c0392b' }} className="flex-shrink-0" />
          <p className="text-xs" style={{ color: '#c0392b' }}>{error}</p>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 flex items-end gap-2" style={{ borderTop: '1px solid rgba(10,77,60,0.08)' }}>
        <textarea
          value={draft}
          onChange={onChangeDraft}
          placeholder="اكتب بالعربية..."
          dir="rtl"
          rows={1}
          maxLength={500}
          className="flex-1 px-4 py-2.5 rounded-2xl text-base outline-none resize-none"
          style={{ fontFamily: 'Amiri, serif', background: 'rgba(10,77,60,0.05)', border: '1px solid rgba(10,77,60,0.12)', color: '#1a1a1a', maxHeight: 100 }}
        />
        <button
          onClick={handleSend}
          disabled={sending || !draft.trim()}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40"
          style={{ background: '#0a4d3c' }}
        >
          {sending ? <Loader2 size={18} className="animate-spin" color="white" /> : <Send size={18} color="white" />}
        </button>
      </div>

      {/* Modal aturan */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-sm rounded-3xl p-5" style={{ background: '#faf6ee' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
              <span style={{ fontFamily: 'Amiri, serif', color: '#fff', fontSize: 24 }}>ع</span>
            </div>
            <h3 className="text-lg font-bold text-center mb-2" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>Aturan Chat: Arab Saja</h3>
            <div className="space-y-2 mb-4">
              {[
                'Chat ini WAJIB pakai bahasa Arab. Ketik dengan keyboard Arab.',
                'Pesan harus bermakna (kalimat/kata asli) — bukan huruf acak.',
                'Bahasa lain (latin) otomatis tidak bisa diketik & tidak terkirim.',
                'Tujuannya: biar kamu makin lancar menulis & berpikir dalam bahasa Arab 💪',
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ color: '#c9a961' }}>•</span>
                  <p className="text-sm leading-snug" style={{ color: '#3d2817' }}>{t}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowRules(false)} className="w-full py-3 rounded-2xl font-semibold text-white" style={{ background: '#0a4d3c' }}>
              Mengerti, mulai chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
