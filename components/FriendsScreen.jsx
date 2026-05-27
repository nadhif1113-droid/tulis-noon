// components/FriendsScreen.jsx
// Fase 1 sosial — daftar teman + add by friend code + share kode sendiri.

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Home, UserPlus, Copy, Check, Users, Trophy, Flame, X, Loader2, Swords, MessageCircle } from 'lucide-react';
import { ensureFriendCode, addFriendByCode, getFriends, removeFriend } from '@/lib/social';

const FLAGS = { SA: '🇸🇦', AE: '🇦🇪', QA: '🇶🇦', KW: '🇰🇼', BH: '🇧🇭', OM: '🇴🇲', JO: '🇯🇴', EG: '🇪🇬', YE: '🇾🇪', ID: '🇮🇩', MY: '🇲🇾', SG: '🇸🇬', BN: '🇧🇳' };

export default function FriendsScreen({ userId, userProfile, onBack, onHome, onChallengeFriend, onOpenChat }) {
  const [myCode, setMyCode] = useState(userProfile?.friendCode || null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [codeInput, setCodeInput] = useState('');
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState(null); // { type: 'ok'|'err', text }
  const [copied, setCopied] = useState(false);
  const [justAdded, setJustAdded] = useState(null); // friend yg baru di-add → tampil prompt CTA

  useEffect(() => {
    (async () => {
      if (!userId) { setLoading(false); setMsg({ type: 'err', text: 'Belum login (userId kosong)' }); return; }
      try {
        const code = await ensureFriendCode(userId);
        setMyCode(code);
      } catch (e) {
        console.error('ensureFriendCode error:', e);
        setMsg({ type: 'err', text: 'Kode gagal dibuat: ' + (e?.code || e?.message || e) });
      }
      try {
        const list = await getFriends(userId);
        setFriends(list);
      } catch (e) {
        console.error('getFriends error:', e);
        setMsg({ type: 'err', text: 'Baca teman gagal: ' + (e?.code || e?.message || e) });
      }
      setLoading(false);
    })();
  }, [userId]);

  // Auto-refresh status online tiap 45 detik (biar "live")
  useEffect(() => {
    if (!userId) return;
    const iv = setInterval(async () => {
      try { setFriends(await getFriends(userId)); } catch (e) {}
    }, 45000);
    return () => clearInterval(iv);
  }, [userId]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(myCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {}
  };

  const shareCode = async () => {
    const text = `Yuk belajar bahasa Arab bareng aku di Tulis Noon! Add aku pakai kode teman: ${myCode}`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setMsg({ type: 'ok', text: 'Teks ajakan disalin!' });
      }
    } catch (e) {}
  };

  const handleAdd = async () => {
    const code = codeInput.trim().toUpperCase();
    if (!code || adding) return;
    setAdding(true);
    setMsg(null);
    const res = await addFriendByCode(userId, code);
    if (res.success) {
      setMsg(null);
      setCodeInput('');
      setJustAdded(res.friend); // tampilkan prompt CTA (Tantang / Chat)
      // refresh list
      const list = await getFriends(userId);
      setFriends(list);
    } else {
      setMsg({ type: 'err', text: res.error });
    }
    setAdding(false);
  };

  const handleRemove = async (friendUid, name) => {
    if (!confirm(`Hapus ${name} dari daftar teman?`)) return;
    const res = await removeFriend(userId, friendUid);
    if (res.success) setFriends((f) => f.filter((x) => x.uid !== friendUid));
  };

  return (
    <div className="flex-1 flex flex-col px-5 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
          <ArrowLeft size={18} style={{ color: '#0a4d3c' }} />
        </button>
        <div className="flex-1">
          <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>Komunitas</p>
          <h2 className="text-xl font-semibold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>Teman</h2>
        </div>
        {onHome && (
          <button onClick={onHome} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <Home size={18} style={{ color: '#0a4d3c' }} />
          </button>
        )}
      </div>

      {/* Kode teman saya */}
      <div className="rounded-2xl p-5 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
        <p className="text-[10px] tracking-widest uppercase text-white opacity-80 mb-2">Kode Teman Kamu</p>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold tracking-[0.2em] text-white" style={{ fontFamily: 'Fraunces, serif' }}>
            {myCode || '••••••'}
          </span>
          <button onClick={copyCode} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.18)' }}>
            {copied ? <Check size={16} color="white" /> : <Copy size={16} color="white" />}
          </button>
        </div>
        <button onClick={shareCode} className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white" style={{ color: '#0a4d3c' }}>
          Bagikan kode ke teman
        </button>
      </div>

      {/* Add teman by code */}
      <div className="rounded-2xl p-4 mb-4" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: '#0a4d3c' }}>Tambah Teman</p>
        <div className="flex gap-2">
          <input
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
            placeholder="Masukkan kode teman (mis. TN7K2A)"
            maxLength={8}
            className="flex-1 px-3 py-2.5 rounded-xl text-sm tracking-wider outline-none"
            style={{ background: 'rgba(10,77,60,0.05)', border: '1px solid rgba(10,77,60,0.1)', color: '#0a4d3c' }}
          />
          <button
            onClick={handleAdd}
            disabled={adding || !codeInput.trim()}
            className="px-4 rounded-xl flex items-center justify-center font-semibold text-sm text-white disabled:opacity-50"
            style={{ background: '#0a4d3c' }}
          >
            {adding ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          </button>
        </div>
        {msg && (
          <p className="text-xs mt-2" style={{ color: msg.type === 'ok' ? '#0a7d52' : '#c0392b' }}>{msg.text}</p>
        )}
      </div>

      {/* Prompt CTA setelah berhasil add teman — ajak langsung Tantang / Chat */}
      {justAdded && (
        <div className="rounded-2xl p-4 mb-4 relative" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
          <button onClick={() => setJustAdded(null)} className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <X size={12} color="white" />
          </button>
          <p className="text-sm font-semibold text-white mb-0.5">🎉 {justAdded.displayName} jadi temanmu!</p>
          <p className="text-xs text-white opacity-85 mb-3">Langsung tantang dia atau sapa lewat chat?</p>
          <div className="flex gap-2">
            <button onClick={() => { onChallengeFriend?.(justAdded); setJustAdded(null); }} className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-sm font-bold" style={{ background: 'white', color: '#a05536' }}>
              <Swords size={15} /> Tantang Match
            </button>
            <button onClick={() => { onOpenChat?.(justAdded); setJustAdded(null); }} className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-sm font-bold" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <MessageCircle size={15} /> Chat
            </button>
          </div>
        </div>
      )}

      {/* Daftar teman */}
      <div className="flex items-center gap-2 mb-3 mt-1">
        <Users size={16} style={{ color: '#8b6b3d' }} />
        <p className="text-xs tracking-widest uppercase" style={{ color: '#8b6b3d' }}>
          Teman Kamu {friends.length > 0 && `(${friends.length})`}
        </p>
      </div>

      {loading ? (
        <div className="py-8 flex justify-center">
          <Loader2 size={22} className="animate-spin" style={{ color: '#c9a961' }} />
        </div>
      ) : friends.length === 0 ? (
        <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(10,77,60,0.04)' }}>
          <div className="text-4xl mb-2">🫂</div>
          <p className="text-sm font-semibold mb-1" style={{ color: '#0a4d3c' }}>Belum ada teman</p>
          <p className="text-xs" style={{ color: '#8b6b3d' }}>Bagikan kode kamu atau masukkan kode teman untuk mulai belajar bareng.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {friends.map((f, i) => (
            <div key={f.uid} className="p-3 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center overflow-hidden" style={{ background: f.avatarEmoji ? 'rgba(201,169,97,0.15)' : 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
                    {f.avatarEmoji ? <span className="text-xl">{f.avatarEmoji}</span> : f.photoURL ? <img src={f.photoURL} alt="" className="w-full h-full object-cover" /> : <span className="text-white font-bold">{(f.displayName || '?')[0].toUpperCase()}</span>}
                  </div>
                  {/* Status online */}
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white" style={{ background: f.online ? '#22c55e' : '#c4c4c4' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm truncate" style={{ color: '#1a1a1a' }}>
                      {FLAGS[f.countryCode] ? FLAGS[f.countryCode] + ' ' : ''}{f.displayName}
                    </p>
                    {f.online && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(34,197,94,0.15)', color: '#16a34a' }}>ONLINE</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#8b6b3d' }}>
                    <span className="flex items-center gap-1"><Trophy size={11} style={{ color: '#c9a961' }} /> {f.xp} XP</span>
                    <span>Lv {f.level}</span>
                    {f.streak > 0 && <span className="flex items-center gap-1"><Flame size={11} style={{ color: '#e07a3f' }} /> {f.streak}</span>}
                  </div>
                </div>
                <button onClick={() => handleRemove(f.uid, f.displayName)} className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(192,57,43,0.06)' }}>
                  <X size={13} style={{ color: '#c0392b' }} />
                </button>
              </div>
              {/* Aksi: Tantang Match + Chat */}
              <div className="flex gap-2 mt-2.5">
                <button onClick={() => onChallengeFriend?.(f)} className="flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold text-white active:scale-95 transition-transform" style={{ background: 'linear-gradient(135deg, #a05536, #c46a3f)' }}>
                  <Swords size={14} /> Tantang
                </button>
                <button onClick={() => onOpenChat?.(f)} className="flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold active:scale-95 transition-transform" style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}>
                  <MessageCircle size={14} /> Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
