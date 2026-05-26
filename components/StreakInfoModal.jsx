// components/StreakInfoModal.jsx
// Modal nerangin flame/streak icon. Pendek aja, ga sepanjang XP/Coin modal.

'use client';

import { X, Flame, Check } from 'lucide-react';

export default function StreakInfoModal({ streak = 0, onClose }) {
  // Milestone selanjutnya
  const milestones = [3, 7, 14, 30, 60, 100];
  const nextMilestone = milestones.find((m) => streak < m) || milestones[milestones.length - 1];
  const daysToNext = Math.max(0, nextMilestone - streak);

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
        <div className="flex items-start justify-between px-6 pt-6 pb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #a05536, #c46a3f)' }}>
              🔥
            </div>
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-0.5" style={{ color: '#a05536' }}>Streak Harian</p>
              <h2 className="text-xl leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
                Apa itu Streak?
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Tutup">
            <X size={16} style={{ color: '#0a4d3c' }} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Current streak hero */}
          <div className="rounded-2xl p-4 mb-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #a05536, #c46a3f)' }}>
            <div className="absolute -right-4 -top-2 text-7xl opacity-15">🔥</div>
            <p className="text-[10px] tracking-widest uppercase font-bold text-white opacity-90 mb-1">Streak kamu</p>
            <p className="text-5xl font-bold text-white leading-none" style={{ fontFamily: 'Fraunces, serif' }}>
              {streak} <span className="text-lg font-normal opacity-90">hari</span>
            </p>
            {streak === 0 && (
              <p className="text-xs text-white opacity-90 mt-2">
                Belajar hari ini buat mulai streak pertamamu!
              </p>
            )}
            {streak > 0 && daysToNext > 0 && (
              <p className="text-xs text-white opacity-90 mt-2">
                {daysToNext} hari lagi → milestone {nextMilestone} hari 🎯
              </p>
            )}
          </div>

          {/* Definisi */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>Apa fungsinya?</p>
          <div className="rounded-2xl p-3.5 mb-4 space-y-2" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            <p className="text-sm leading-relaxed" style={{ color: '#3d2817' }}>
              🔥 <strong>Streak</strong> = jumlah hari <strong>berturut-turut</strong> kamu belajar di Tulis Noon.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#3d2817' }}>
              Setiap hari kamu buka app & selesaikan minimal 1 aktivitas (lesson/challenge/game), streak naik +1.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#a05536' }}>
              ⚠️ Skip 1 hari = streak balik ke 0.
            </p>
          </div>

          {/* Reward milestones */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>Reward milestone</p>
          <div className="rounded-2xl p-3.5 mb-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            {[
              { days: 3, reward: 'Badge "Mulai Konsisten" + 2 koin' },
              { days: 7, reward: 'Badge "Seminggu Penuh" + 5 koin' },
              { days: 14, reward: 'Badge "Dua Pekan" + 10 koin' },
              { days: 30, reward: 'Badge "Sebulan Lurus" + 20 koin + 100 XP' },
              { days: 100, reward: 'Badge "Konsisten" + 100 koin + free 1 bulan Premium' },
            ].map((m) => {
              const reached = streak >= m.days;
              return (
                <div key={m.days} className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid rgba(10,77,60,0.06)' }}>
                  <div className="flex items-center gap-1 w-12 flex-shrink-0">
                    {reached ? <Check size={14} style={{ color: '#0a4d3c' }} /> : <span className="text-xs opacity-30">○</span>}
                    <span className="text-xs font-bold" style={{ color: reached ? '#0a4d3c' : '#8b6b3d' }}>{m.days}h</span>
                  </div>
                  <span className="text-xs flex-1" style={{ color: reached ? '#3d2817' : '#8b6b3d', opacity: reached ? 1 : 0.7 }}>
                    {m.reward}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Tips */}
          <div className="rounded-2xl p-3 mb-4" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
            <p className="text-[10px] tracking-widest uppercase font-bold mb-1.5" style={{ color: '#c9a961' }}>Tips</p>
            <p className="text-xs leading-relaxed" style={{ color: '#8b6b3d' }}>
              Set pengingat tiap hari (mis. setelah Subuh atau Maghrib) buat buka Tulis Noon 2-5 menit. Konsistensi kecil &gt; burst intensif.
            </p>
          </div>

          <p className="text-[11px] mt-2 italic text-center px-2" style={{ color: '#8b6b3d' }}>
            "Amal yang paling dicintai Allah adalah yang konsisten meski sedikit"<br/>
            <span className="text-[10px] opacity-80">— HR. Bukhari & Muslim</span>
          </p>

          <button onClick={onClose} className="w-full mt-5 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2" style={{ background: '#a05536', color: 'white' }}>
            <Flame size={15} /> Belajar sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
