// components/XpLevelInfoModal.jsx
// Reusable modal yang nerangin XP, Level, & cara naik.
// Dipakai di home tab (XP pill onClick) dan di profile page (? button).

'use client';

import { X, Check, Sparkles, Star, Flame, BookOpen, Trophy, Target, Award, MessageCircle } from 'lucide-react';
import { TIERS, getXpProgress, XP_SOURCES } from '@/lib/xp-system';

// Icon map untuk XP_SOURCES
const ICON_MAP = {
  BookOpen, Target, Trophy, Award, MessageCircle, Sparkles, Flame, Star,
};

export default function XpLevelInfoModal({ xp = 0, onClose }) {
  const progress = getXpProgress(xp);
  const { currentLevel, tier, nextTier, xpInLevel, xpNeeded, xpRemaining, percent } = progress;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(10,30,25,0.75)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
        style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div
          className="flex items-start justify-between px-6 pt-6 pb-3 sticky top-0 z-10"
          style={{ background: 'linear-gradient(180deg, #faf6ee 0%, rgba(250,246,238,0.95) 100%)' }}
        >
          <div className="flex items-start gap-3 flex-1">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
              ⭐
            </div>
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-0.5" style={{ color: '#c9a961' }}>Sistem Progres</p>
              <h2 className="text-xl leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
                Apa itu XP & Level?
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Tutup">
            <X size={16} style={{ color: '#0a4d3c' }} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* SECTION 1: Definisi XP */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>1. Apa itu XP?</p>
          <div className="rounded-2xl p-3.5 mb-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            <p className="text-sm leading-relaxed mb-2" style={{ color: '#3d2817' }}>
              <strong>XP</strong> kependekan dari <em>Experience Points</em> — poin pengalaman.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#3d2817' }}>
              Tiap kali kamu belajar atau main game di Tulis Noon, kamu dapet XP. Makin sering belajar, makin banyak XP, makin naik <strong>level</strong>-mu.
            </p>
          </div>

          {/* SECTION 2: XP kamu sekarang */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>2. XP kamu sekarang</p>
          <div className="rounded-2xl p-4 mb-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-3xl font-bold leading-none" style={{ fontFamily: 'Fraunces, serif', color: tier.color }}>
                {xp.toLocaleString('id-ID')}
              </p>
              <p className="text-xs font-semibold" style={{ color: '#8b6b3d' }}>XP total</p>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{tier.emoji}</span>
              <span className="text-xs font-bold" style={{ color: tier.color }}>{tier.label}</span>
              <span className="text-[10px] uppercase tracking-widest" style={{ color: '#8b6b3d' }}>{tier.subtitle}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold ml-1" style={{ background: `${tier.color}15`, color: tier.color }}>
                Level {currentLevel}
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden mt-2" style={{ background: 'rgba(10,77,60,0.1)' }}>
              <div className="h-full transition-all duration-700 rounded-full" style={{ width: `${percent}%`, background: tier.bgGradient }} />
            </div>
            <p className="text-[11px] mt-1.5" style={{ color: '#8b6b3d' }}>
              {xpRemaining.toLocaleString('id-ID')} XP lagi → naik ke <strong style={{ color: nextTier.color }}>Level {currentLevel + 1}</strong>
            </p>
          </div>

          {/* SECTION 3: Cara dapet XP */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>3. Cara dapet XP</p>
          <div className="rounded-2xl p-3.5 mb-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            <p className="text-xs mb-2.5" style={{ color: '#666' }}>Setiap aktivitas belajar kasih XP otomatis:</p>
            {XP_SOURCES.map((src, idx) => {
              const Icon = ICON_MAP[src.icon] || Star;
              return (
                <div key={idx} className="flex items-center justify-between py-1.5" style={{ borderBottom: idx < XP_SOURCES.length - 1 ? '1px solid rgba(10,77,60,0.06)' : 'none' }}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Icon size={13} style={{ color: '#0a4d3c' }} />
                    <span className="text-xs truncate" style={{ color: '#3d2817' }}>{src.label}</span>
                  </div>
                  <span className="text-xs font-bold ml-2" style={{ color: '#c9a961' }}>{src.xp}</span>
                </div>
              );
            })}
          </div>

          {/* SECTION 4: Gunanya XP */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>4. Kegunaan XP</p>
          <div className="rounded-2xl p-3.5 mb-4 space-y-2.5" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            <BenefitItem emoji="📈" title="Naik Level otomatis" desc="Tiap target XP tercapai, level kamu naik. Tanpa effort tambahan." />
            <BenefitItem emoji="🏷️" title="Unlock Tier baru" desc="Dari Mubtadi → Daris → Mutawassith → Faaheem → Mahir. Setiap tier punya identitas." />
            <BenefitItem emoji="🏆" title="Bukti progres nyata" desc="Pantau seberapa jauh kamu udah belajar. Tidak buang-buang waktu." />
            <BenefitItem emoji="🔥" title="Bikin termotivasi" desc="Setiap XP yang masuk kasih dopamine kecil — bikin betah belajar tiap hari." />
            <BenefitItem emoji="🎁" title="Reward & achievement (segera)" desc="Achievement, badge, dan fitur bonus bakal di-unlock berdasarkan XP." />
          </div>

          {/* SECTION 5: Tier ladder */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>5. Jenjang Tier</p>
          <div className="space-y-2 mb-2">
            {TIERS.map((t) => {
              const isCurrent = tier.id === t.id;
              const isPast = currentLevel > t.maxLevel;
              return (
                <div
                  key={t.id}
                  className="rounded-2xl p-3 flex items-center gap-3 relative"
                  style={{
                    background: isCurrent ? 'white' : 'rgba(255,255,255,0.55)',
                    border: isCurrent ? `2px solid ${t.color}` : '1.5px solid rgba(10,77,60,0.08)',
                    opacity: isPast ? 0.7 : 1,
                  }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: t.bgGradient }}>
                    {t.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-sm leading-tight" style={{ color: t.color, fontFamily: 'Fraunces, serif' }}>{t.label}</p>
                      <span className="text-[10px] uppercase tracking-widest" style={{ color: '#8b6b3d' }}>{t.subtitle}</span>
                    </div>
                    <p className="text-[11px] leading-snug" style={{ color: '#3d2817' }}>{t.description}</p>
                    <p className="text-[10px] mt-1 font-semibold" style={{ color: '#8b6b3d' }}>
                      Level {t.minLevel}{t.maxLevel < 999 ? `–${t.maxLevel}` : '+'}
                    </p>
                  </div>
                  {isCurrent && (
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest" style={{ background: t.color, color: 'white' }}>
                      Kamu disini
                    </div>
                  )}
                  {isPast && <Check size={16} style={{ color: '#0a4d3c' }} className="flex-shrink-0" />}
                </div>
              );
            })}
          </div>

          {/* Footer hadis */}
          <p className="text-[11px] mt-5 italic text-center px-2" style={{ color: '#8b6b3d' }}>
            "Tuntutlah ilmu meski jauh ke negeri Cina"<br/>
            <span className="text-[10px] opacity-80">— HR. Baihaqi</span>
          </p>

          <button onClick={onClose} className="w-full mt-5 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2" style={{ background: '#0a4d3c', color: 'white' }}>
            <Sparkles size={15} /> Mulai kumpulin XP
          </button>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ emoji, title, desc }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="text-lg flex-shrink-0" style={{ width: '24px' }}>{emoji}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold leading-tight" style={{ color: '#0a4d3c' }}>{title}</p>
        <p className="text-[11px] leading-snug mt-0.5" style={{ color: '#666' }}>{desc}</p>
      </div>
    </div>
  );
}
