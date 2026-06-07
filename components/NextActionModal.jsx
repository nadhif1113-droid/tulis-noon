// components/NextActionModal.jsx
// Modal akhir modul — 4 opsi: Kuis / Lanjut Modul / Selesai / Ulangi.
// Tampil saat user nge-finish percakapan terakhir dari modul.

'use client';

import { useEffect, useState } from 'react';
import { Award, ArrowRight, RotateCcw, Home, Sparkles, ChevronRight } from 'lucide-react';

export default function NextActionModal({
  moduleTitle,
  moduleEmoji = '✅',
  convsDone,
  convsTotal,
  xpEarned = 0,
  hasQuiz = true,
  hasNextModule = true,
  onTakeQuiz,
  onNextModule,
  onFinish,
  onRestart,
  onClose,
}) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-5"
      style={{ background: 'rgba(10,77,60,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden relative"
        style={{
          background: '#fdfaf4',
          boxShadow: '0 24px 60px -16px rgba(0,0,0,0.4)',
          transform: animate ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(20px)',
          opacity: animate ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero header */}
        <div className="px-6 pt-6 pb-5 text-center" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
          <div className="text-5xl mb-2">{moduleEmoji}</div>
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: '#c9a961' }}>
            <Sparkles size={11} className="inline mr-1" /> MODUL SELESAI
          </p>
          <h2 className="text-xl text-white leading-tight mb-2" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
            {moduleTitle}
          </h2>
          <div className="flex items-center justify-center gap-3 text-xs text-white opacity-90">
            <span>📚 {convsDone}/{convsTotal} percakapan</span>
            {xpEarned > 0 && (
              <>
                <span>·</span>
                <span className="font-bold" style={{ color: '#c9a961' }}>+{xpEarned} XP</span>
              </>
            )}
          </div>
        </div>

        {/* Question */}
        <div className="px-5 py-4 text-center">
          <p className="text-sm font-semibold mb-3" style={{ color: '#0a4d3c' }}>Apa berikutnya?</p>

          {/* Actions */}
          <div className="space-y-2">
            {hasQuiz && (
              <ActionButton
                onClick={onTakeQuiz}
                emoji="🎯"
                title="Latihan Soal"
                subtitle="Uji pemahaman — 7 soal kuis"
                color="#a05536"
                gradient="linear-gradient(135deg, #a05536, #c46a3f)"
                primary
              />
            )}
            {hasNextModule && (
              <ActionButton
                onClick={onNextModule}
                emoji="▶️"
                title="Lanjut Modul Berikutnya"
                subtitle="Terus belajar tanpa istirahat"
                color="#0a4d3c"
                gradient="linear-gradient(135deg, #0a4d3c, #1a6b56)"
              />
            )}
            <ActionButton
              onClick={onRestart}
              emoji="🔁"
              title="Ulangi Modul Ini"
              subtitle="Drill lagi dari awal"
              color="#8b6b3d"
              ghost
            />
            <ActionButton
              onClick={onFinish}
              emoji="🏠"
              title="Selesai & Kembali"
              subtitle="Balik ke daftar modul"
              color="#0a4d3c"
              ghost
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ onClick, emoji, title, subtitle, color, gradient, primary, ghost }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-transform active:scale-[0.98]"
      style={{
        background: primary ? gradient : ghost ? 'rgba(10,77,60,0.05)' : 'white',
        border: primary ? 'none' : ghost ? '1px solid rgba(10,77,60,0.1)' : `1.5px solid ${color}40`,
        boxShadow: primary ? `0 8px 20px -8px ${color}80` : 'none',
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: primary ? 'rgba(255,255,255,0.2)' : `${color}15` }}
      >
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm leading-tight" style={{ color: primary ? 'white' : color }}>
          {title}
        </p>
        <p className="text-[11px] leading-snug" style={{ color: primary ? 'rgba(255,255,255,0.85)' : '#8b6b3d' }}>
          {subtitle}
        </p>
      </div>
      <ChevronRight size={16} style={{ color: primary ? 'white' : color, opacity: primary ? 0.8 : 0.5 }} className="flex-shrink-0" />
    </button>
  );
}
