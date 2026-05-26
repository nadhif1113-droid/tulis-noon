// components/LivesInfoModal.jsx
// Modal explainer untuk Lives/Nyawa system Duolingo-style.
// Trigger dari lives pill di home.

'use client';

import { X, Heart, Check } from 'lucide-react';
import { DEFAULT_MAX_LIVES, COIN_PER_LIFE, REFILL_ALL_COST, LIVES_SOURCES, LIVES_RULES, timeUntilRefresh } from '@/lib/lives-system';

export default function LivesInfoModal({
  lives = DEFAULT_MAX_LIVES,
  maxLives = DEFAULT_MAX_LIVES,
  livesResetAt,
  coins = 0,
  onClose,
  onBuyLife,
  onRefillAll,
}) {
  const refreshIn = timeUntilRefresh(livesResetAt);
  const isFull = lives >= maxLives;
  const isEmpty = lives <= 0;
  const canBuyOne = coins >= COIN_PER_LIFE && !isFull;
  const canRefillAll = coins >= REFILL_ALL_COST && !isFull;

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
        <div className="flex items-start justify-between px-6 pt-6 pb-3 sticky top-0 z-10" style={{ background: 'linear-gradient(180deg, #faf6ee 0%, rgba(250,246,238,0.95) 100%)' }}>
          <div className="flex items-start gap-3 flex-1">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #c64545, #e76b6b)' }}>
              ❤️
            </div>
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-0.5" style={{ color: '#c64545' }}>Sistem Nyawa</p>
              <h2 className="text-xl leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
                Apa itu Nyawa?
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Tutup">
            <X size={16} style={{ color: '#0a4d3c' }} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* SECTION 1: Lives saldo */}
          <div className="rounded-2xl p-4 mb-4 relative overflow-hidden text-center" style={{ background: isEmpty ? 'linear-gradient(135deg, #8b6b3d, #a87f47)' : 'linear-gradient(135deg, #c64545, #e76b6b)' }}>
            <div className="absolute -right-4 -top-2 text-7xl opacity-15">❤️</div>
            <p className="text-[10px] tracking-widest uppercase font-bold text-white opacity-90 mb-1">Nyawa kamu</p>
            <p className="text-5xl font-bold text-white leading-none" style={{ fontFamily: 'Fraunces, serif' }}>
              {lives} <span className="text-lg font-normal opacity-90">/ {maxLives}</span>
            </p>
            <div className="flex justify-center gap-0.5 mt-2">
              {Array.from({ length: maxLives }).map((_, i) => (
                <span key={i} style={{ fontSize: '14px', opacity: i < lives ? 1 : 0.25 }}>
                  ❤️
                </span>
              ))}
            </div>
            {!isFull && (
              <p className="text-xs text-white opacity-90 mt-3">
                ⏰ Reset otomatis dalam <strong>{refreshIn}</strong>
              </p>
            )}
            {isFull && (
              <p className="text-xs text-white opacity-90 mt-3">
                ✓ Nyawa kamu penuh — siap main!
              </p>
            )}
          </div>

          {/* SECTION 2: Definisi */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>Apa itu Nyawa?</p>
          <div className="rounded-2xl p-3.5 mb-4 space-y-2" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            <p className="text-sm leading-relaxed" style={{ color: '#3d2817' }}>
              ❤️ <strong>Nyawa</strong> adalah jatah main per hari kamu. Maksimum <strong>{maxLives} nyawa/hari</strong>.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#3d2817' }}>
              <strong>Semua game gratis dimainkan</strong> — tapi nyawa berkurang kalau kamu gagal/kalah. Habis? Tunggu reset 24 jam, atau beli pakai koin.
            </p>
          </div>

          {/* SECTION 3: Kapan nyawa berkurang */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>Kapan nyawa berkurang?</p>
          <div className="rounded-2xl p-3.5 mb-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            {LIVES_RULES.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2.5 py-2" style={{ borderBottom: idx < LIVES_RULES.length - 1 ? '1px solid rgba(10,77,60,0.06)' : 'none' }}>
                <span className="text-base font-bold flex-shrink-0 w-5" style={{ color: rule.icon === '✓' ? '#0a4d3c' : rule.icon === '✗' ? '#c64545' : '#c9a961' }}>{rule.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold leading-tight" style={{ color: '#3d2817' }}>{rule.label}</p>
                  <p className="text-[11px] leading-snug mt-0.5" style={{ color: '#666' }}>{rule.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION 4: Cara dapet nyawa */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>Cara isi nyawa</p>
          <div className="rounded-2xl p-3.5 mb-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            {LIVES_SOURCES.map((src, idx) => (
              <div key={idx} className="flex items-start gap-2.5 py-2" style={{ borderBottom: idx < LIVES_SOURCES.length - 1 ? '1px solid rgba(10,77,60,0.06)' : 'none' }}>
                <span className="text-base flex-shrink-0">{src.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold leading-tight" style={{ color: '#3d2817' }}>{src.label}</p>
                  <p className="text-[11px] leading-snug mt-0.5" style={{ color: '#666' }}>{src.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION 5: Action buttons — beli nyawa pakai koin */}
          {!isFull && (
            <>
              <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>Beli nyawa sekarang</p>
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => canBuyOne && onBuyLife && onBuyLife()}
                  disabled={!canBuyOne}
                  className="w-full rounded-2xl p-3 flex items-center gap-3 text-left transition-transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                  style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.12)' }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'rgba(198,69,69,0.12)' }}>❤️</div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: '#0a4d3c' }}>+1 Nyawa</p>
                    <p className="text-[11px]" style={{ color: '#666' }}>Tambah 1 nyawa instant</p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#c9a961' }}>{COIN_PER_LIFE} 🪙</span>
                </button>

                <button
                  onClick={() => canRefillAll && onRefillAll && onRefillAll()}
                  disabled={!canRefillAll}
                  className="w-full rounded-2xl p-3 flex items-center gap-3 text-left transition-transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 relative"
                  style={{ background: 'white', border: '2px solid #c9a961' }}
                >
                  <span className="absolute -top-2 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest" style={{ background: '#c9a961', color: 'white' }}>
                    Hemat 50%
                  </span>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #c64545, #e76b6b)' }}>💖</div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: '#0a4d3c' }}>Refill semua nyawa</p>
                    <p className="text-[11px]" style={{ color: '#666' }}>Isi penuh ke {maxLives} nyawa</p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#c9a961' }}>{REFILL_ALL_COST} 🪙</span>
                </button>
              </div>
              {coins < COIN_PER_LIFE && (
                <p className="text-[11px] text-center italic mb-2" style={{ color: '#a05536' }}>
                  Koin kamu kurang ({coins} 🪙). Lihat tab Koin buat top-up.
                </p>
              )}
            </>
          )}

          <p className="text-[11px] mt-3 italic text-center px-2" style={{ color: '#8b6b3d' }}>
            "Kesabaran adalah cahaya"<br/>
            <span className="text-[10px] opacity-80">— HR. Muslim</span>
          </p>

          <button onClick={onClose} className="w-full mt-5 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2" style={{ background: '#0a4d3c', color: 'white' }}>
            <Check size={15} /> Paham, lanjut belajar
          </button>
        </div>
      </div>
    </div>
  );
}
