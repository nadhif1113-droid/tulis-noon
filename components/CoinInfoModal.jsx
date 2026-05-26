// components/CoinInfoModal.jsx
// Modal nerangin Koin: apa, kegunaan, cara dapet, paket top-up.
// Trigger dari coin pill di home header atau dari profile.

'use client';

import { X, Sparkles, Check } from 'lucide-react';
import { COIN_PACKAGES, COIN_SOURCES, COIN_USES, formatRupiah, totalCoinsForPackage, pricePerCoin } from '@/lib/coin-system';

export default function CoinInfoModal({ coins = 0, onClose, onTopUp }) {
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
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)', boxShadow: '0 6px 16px -4px rgba(201,169,97,0.5)' }}>
              🪙
            </div>
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-0.5" style={{ color: '#c9a961' }}>Mata Uang Tulis Noon</p>
              <h2 className="text-xl leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
                Apa itu Koin?
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }} aria-label="Tutup">
            <X size={16} style={{ color: '#0a4d3c' }} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* SECTION 1: Definisi */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>1. Apa itu Koin?</p>
          <div className="rounded-2xl p-3.5 mb-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            <p className="text-sm leading-relaxed mb-2" style={{ color: '#3d2817' }}>
              🪙 <strong>Koin</strong> adalah mata uang dalam Tulis Noon — fleksibel, gak harus bayar bulanan.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#3d2817' }}>
              Kalau kamu cuma mau buka 1-2 fitur Premium tertentu, tinggal bayar pakai koin. <strong>Tanpa langganan</strong>, bayar sekali pakai.
            </p>
          </div>

          {/* SECTION 2: Saldo kamu sekarang */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>2. Saldo kamu</p>
          <div className="rounded-2xl p-4 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
            <div className="absolute -right-2 -top-2 text-7xl opacity-15">🪙</div>
            <p className="text-[10px] tracking-widest uppercase font-bold text-white opacity-90 mb-1">Total Koin</p>
            <p className="text-4xl font-bold leading-none text-white" style={{ fontFamily: 'Fraunces, serif' }}>
              {coins.toLocaleString('id-ID')} <span className="text-base font-normal opacity-90">koin</span>
            </p>
            {onTopUp && (
              <button
                onClick={onTopUp}
                className="mt-3 px-4 py-2 rounded-full text-xs font-semibold bg-white inline-flex items-center gap-1.5"
                style={{ color: '#8b6b3d' }}
              >
                <Sparkles size={12} /> Top Up Koin
              </button>
            )}
          </div>

          {/* SECTION 3: Kegunaan koin */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>3. Kegunaan Koin</p>
          <div className="rounded-2xl p-3.5 mb-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            <p className="text-xs mb-2.5" style={{ color: '#666' }}>Tukar koin dengan akses ke fitur premium:</p>
            {COIN_USES.map((use, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5" style={{ borderBottom: idx < COIN_USES.length - 1 ? '1px solid rgba(10,77,60,0.06)' : 'none' }}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-base flex-shrink-0">{use.icon}</span>
                  <span className="text-xs truncate" style={{ color: '#3d2817' }}>{use.label}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                  <span className="text-xs font-bold" style={{ color: '#c9a961' }}>{use.cost} 🪙</span>
                  {use.save && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#0a4d3c', color: 'white' }}>
                      HEMAT {use.save}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* SECTION 4: Cara dapet koin (free) */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>4. Cara dapet koin GRATIS</p>
          <div className="rounded-2xl p-3.5 mb-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            {COIN_SOURCES.map((src, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5" style={{ borderBottom: idx < COIN_SOURCES.length - 1 ? '1px solid rgba(10,77,60,0.06)' : 'none' }}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-base flex-shrink-0">{src.icon}</span>
                  <span className="text-xs truncate" style={{ color: '#3d2817' }}>{src.label}</span>
                </div>
                <span className="text-xs font-bold ml-2 flex-shrink-0" style={{ color: '#c9a961' }}>{src.coins}</span>
              </div>
            ))}
          </div>

          {/* SECTION 5: Paket koin (top-up) */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>5. Paket Top Up</p>
          <div className="space-y-2 mb-4">
            {COIN_PACKAGES.map((pkg) => {
              const total = totalCoinsForPackage(pkg);
              const perCoin = pricePerCoin(pkg);
              return (
                <button
                  key={pkg.id}
                  onClick={onTopUp}
                  className="w-full rounded-2xl p-3 flex items-center gap-3 text-left transition-transform active:scale-[0.98] relative"
                  style={{
                    background: 'white',
                    border: pkg.popular ? '2px solid #c9a961' : '1.5px solid rgba(10,77,60,0.08)',
                  }}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest" style={{ background: '#c9a961', color: 'white' }}>
                      Populer
                    </span>
                  )}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: pkg.popular ? 'linear-gradient(135deg, #c9a961, #d4b876)' : 'rgba(201,169,97,0.15)' }}
                  >
                    🪙
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-sm" style={{ color: '#0a4d3c' }}>
                        {total} koin
                      </p>
                      {pkg.bonus > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(10,77,60,0.1)', color: '#0a4d3c' }}>
                          +{pkg.bonus} bonus
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] leading-snug" style={{ color: '#666' }}>{pkg.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold" style={{ color: '#c9a961' }}>{formatRupiah(pkg.price)}</p>
                    <p className="text-[10px]" style={{ color: '#8b6b3d' }}>{formatRupiah(perCoin)}/koin</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Coming soon notice */}
          <div className="rounded-2xl p-3 mb-4" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
            <p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: '#c9a961' }}>Catatan</p>
            <p className="text-xs leading-relaxed" style={{ color: '#8b6b3d' }}>
              Sistem top-up koin akan diaktifkan di update berikutnya. Sementara ini, kumpulin koin gratis dari aktivitas belajar harianmu — kamu udah dapet <strong>5 koin welcome</strong> gratis.
            </p>
          </div>

          {/* Footer hadis tentang sedekah/keberkahan */}
          <p className="text-[11px] mt-2 italic text-center px-2" style={{ color: '#8b6b3d' }}>
            "Sebaik-baik harta adalah harta yang berada di tangan orang shaleh"<br/>
            <span className="text-[10px] opacity-80">— HR. Ahmad</span>
          </p>

          <button onClick={onClose} className="w-full mt-5 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2" style={{ background: '#0a4d3c', color: 'white' }}>
            <Check size={15} /> Paham, lanjut belajar
          </button>
        </div>
      </div>
    </div>
  );
}
