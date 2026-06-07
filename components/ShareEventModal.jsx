// components/ShareEventModal.jsx
// Modal "Pamerkan Progress" — viral growth feature.
// User bisa screenshot card + share ke WA/IG/Twitter dengan caption pre-written.
// Bonus +10 XP per share (capped 1x/hari, anti-spam).

'use client';

import { useEffect, useState } from 'react';
import { X, Copy, Check, MessageCircle, Twitter, Facebook, Send, Share2, Sparkles, Trophy, Flame, Award } from 'lucide-react';
import {
  generateCaption, shareNative, shareToWhatsApp, shareToTwitter,
  shareToFacebook, shareToTelegram, copyToClipboard, buildReferralUrl,
} from '@/lib/share-helpers';
import { CHALLENGE_TITLE, challengeDaysRemaining, challengeCurrentDay, challengeTotalPrize, CHALLENGE_PRIZES } from '@/lib/challenge-launch';

export default function ShareEventModal({ userId, userName, score, rank, streak, onClose, onShared }) {
  const [animate, setAnimate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const [platform, setPlatform] = useState('whatsapp'); // tab aktif untuk preview caption

  const day = challengeCurrentDay();
  const daysLeft = challengeDaysRemaining();
  const url = buildReferralUrl(userId);
  const firstName = (userName || 'Sahabat').split(' ')[0];
  const totalPrize = challengeTotalPrize();

  const captionData = {
    score: score || 0,
    rank: rank || '?',
    day: day || 1,
    daysLeft: daysLeft || 10,
    streak: streak || 0,
    url,
  };

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleShare = async (platformId, action) => {
    try {
      await action();
      setShareCount((c) => c + 1);
      if (shareCount === 0 && onShared) {
        // Award +10 XP bonus untuk share pertama hari ini (caller handle daily cap)
        onShared(platformId);
      }
    } catch (e) {
      console.error('share error:', e);
    }
  };

  const currentCaption = generateCaption(platform, captionData);

  return (
    <div
      className="fixed inset-0 z-[85] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(10,77,60,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-auto rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          background: '#fdfaf4',
          maxHeight: '95vh',
          transform: animate ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          opacity: animate ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative px-5 pt-5 pb-4" style={{ background: 'linear-gradient(135deg, #a05536, #7a3d2a)' }}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <X size={15} color="white" />
          </button>
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: '#c9a961' }}>
            <Share2 size={11} className="inline mr-1" /> PAMERKAN PROGRES
          </p>
          <h2 className="text-xl text-white leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
            Yuk ajak teman ikut!
          </h2>
          <p className="text-xs text-white opacity-90 mt-1">
            +10 XP bonus untuk share hari ini · ajak teman lewat link referral 🎁
          </p>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* SHAREABLE CARD — di-design biar enak di-screenshot */}
          <div
            className="rounded-3xl p-5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0a4d3c 0%, #1a6b56 50%, #c9a961 100%)',
              boxShadow: '0 16px 40px -12px rgba(10,77,60,0.5)',
            }}
          >
            {/* Decorative Arabic letter */}
            <div className="absolute -right-4 -top-4 text-9xl opacity-10" style={{ fontFamily: 'Amiri, serif', color: 'white' }}>ن</div>

            {/* Content */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <span className="text-xl" style={{ fontFamily: 'Amiri, serif', color: 'white' }}>ن</span>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: '#c9a961' }}>TULIS NOON</p>
                  <p className="text-[10px] text-white opacity-80">Bahasa Arab Praktis</p>
                </div>
              </div>

              <p className="text-[11px] tracking-[0.3em] uppercase font-bold mb-2" style={{ color: '#c9a961' }}>
                🏆 {CHALLENGE_TITLE.toUpperCase()}
              </p>
              <h3 className="text-lg text-white mb-3 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
                Progres {firstName}, Day {day}/10
              </h3>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <ShareStat icon="⭐" value={score || 0} label="XP" />
                <ShareStat icon="🔥" value={`${streak}/10`} label="Streak" />
                <ShareStat icon="🏅" value={`#${rank || '?'}`} label="Rank" />
              </div>

              {/* Prize teaser */}
              <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <p className="text-[10px] tracking-widest uppercase font-bold mb-0.5" style={{ color: '#c9a961' }}>
                  🎁 TOTAL HADIAH
                </p>
                <p className="text-base text-white font-bold" style={{ fontFamily: 'Fraunces, serif' }}>
                  Rp {(totalPrize / 1000).toFixed(0)}.000 — untuk 3 pemenang utama
                </p>
              </div>

              <p className="text-[10px] text-white opacity-70 mt-3 text-center">
                tulis-noon.vercel.app · screenshot &amp; share di sosmed
              </p>
            </div>
          </div>

          {/* PLATFORM TABS */}
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-2" style={{ color: '#8b6b3d' }}>
              💬 PILIH PLATFORM
            </p>
            <div className="flex gap-1.5">
              <PlatformTab id="whatsapp" current={platform} onClick={setPlatform} label="WhatsApp" />
              <PlatformTab id="instagram" current={platform} onClick={setPlatform} label="Instagram" />
              <PlatformTab id="twitter" current={platform} onClick={setPlatform} label="X / Twitter" />
              <PlatformTab id="generic" current={platform} onClick={setPlatform} label="Lain" />
            </div>
          </div>

          {/* CAPTION PREVIEW */}
          <div className="rounded-2xl p-3 relative" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}>
            <button
              onClick={async () => {
                const ok = await copyToClipboard(currentCaption);
                if (ok) {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }
              }}
              className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: copied ? '#0a4d3c' : 'rgba(10,77,60,0.08)' }}
              aria-label="Copy"
            >
              {copied ? <Check size={13} color="white" /> : <Copy size={13} style={{ color: '#0a4d3c' }} />}
            </button>
            <p className="text-[10px] tracking-widest uppercase font-bold mb-1.5" style={{ color: '#8b6b3d' }}>
              📋 CAPTION SIAP PAKAI
            </p>
            <pre className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: '#3d2817', fontFamily: 'inherit' }}>
              {currentCaption}
            </pre>
          </div>

          {/* SHARE ACTIONS */}
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-2" style={{ color: '#8b6b3d' }}>
              📤 SHARE LANGSUNG
            </p>
            <div className="grid grid-cols-2 gap-2">
              <ShareButton
                icon={MessageCircle}
                label="WhatsApp"
                color="#25D366"
                onClick={() => handleShare('whatsapp', () => shareToWhatsApp(generateCaption('whatsapp', captionData)))}
              />
              <ShareButton
                icon={Twitter}
                label="X / Twitter"
                color="#1DA1F2"
                onClick={() => handleShare('twitter', () => shareToTwitter(generateCaption('twitter', captionData), url))}
              />
              <ShareButton
                icon={Facebook}
                label="Facebook"
                color="#1877F2"
                onClick={() => handleShare('facebook', () => shareToFacebook(url, generateCaption('generic', captionData)))}
              />
              <ShareButton
                icon={Send}
                label="Telegram"
                color="#0088CC"
                onClick={() => handleShare('telegram', () => shareToTelegram(generateCaption('generic', captionData), url))}
              />
            </div>

            {/* Native share (mobile only — IG Stories etc) */}
            <button
              onClick={() => handleShare('native', () => shareNative({
                title: 'Tantangan Tulis Noon',
                text: generateCaption('generic', captionData),
                url,
              }))}
              className="w-full mt-2 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm text-white active:scale-[0.98] transition-transform"
              style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', boxShadow: '0 6px 16px -6px rgba(10,77,60,0.5)' }}
            >
              <Share2 size={15} /> Share ke aplikasi lain (IG Stories, dll)
            </button>
          </div>

          {/* TIPS */}
          <div className="rounded-2xl p-3" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed rgba(201,169,97,0.4)' }}>
            <p className="text-[10px] tracking-widest uppercase font-bold mb-1.5 flex items-center gap-1" style={{ color: '#8b6b3d' }}>
              <Sparkles size={11} /> TIPS PRO
            </p>
            <ul className="text-[11px] space-y-1 leading-relaxed list-none" style={{ color: '#3d2817' }}>
              <li>📸 Screenshot kartu di atas untuk IG/WA Story</li>
              <li>🔗 Link kamu udah dikasih ?ref untuk track siapa bawa siapa</li>
              <li>🎁 Share 1x/hari → +10 event XP bonus</li>
              <li>🤲 Ajak teman = pahala + boost rank sendiri</li>
            </ul>
          </div>
        </div>

        {/* Bottom note */}
        <div className="px-5 py-3 border-t" style={{ borderColor: 'rgba(10,77,60,0.08)' }}>
          {shareCount > 0 ? (
            <p className="text-xs text-center font-semibold flex items-center justify-center gap-1.5" style={{ color: '#0a4d3c' }}>
              <Check size={13} /> Sudah share {shareCount}× hari ini · +10 XP bonus dapat!
            </p>
          ) : (
            <p className="text-[11px] text-center" style={{ color: '#8b6b3d' }}>
              📣 Yang ke-share otomatis dapat +10 event XP bonus (1x/hari)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function ShareStat({ icon, value, label }) {
  return (
    <div className="rounded-xl p-2 text-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
      <p className="text-lg leading-none mb-1">{icon}</p>
      <p className="text-base font-bold text-white" style={{ fontFamily: 'Fraunces, serif' }}>{value}</p>
      <p className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</p>
    </div>
  );
}

function PlatformTab({ id, current, onClick, label }) {
  const active = id === current;
  return (
    <button
      onClick={() => onClick(id)}
      className="flex-1 py-2 rounded-xl text-[11px] font-semibold transition-all"
      style={{
        background: active ? '#0a4d3c' : 'rgba(10,77,60,0.06)',
        color: active ? 'white' : '#8b6b3d',
        border: active ? '1.5px solid #0a4d3c' : '1px solid transparent',
      }}
    >
      {label}
    </button>
  );
}

function ShareButton({ icon: Icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 p-3 rounded-2xl active:scale-[0.97] transition-transform"
      style={{ background: 'white', border: `1.5px solid ${color}30` }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: color }}>
        <Icon size={15} color="white" />
      </div>
      <span className="text-sm font-semibold" style={{ color: '#0a4d3c' }}>{label}</span>
    </button>
  );
}
