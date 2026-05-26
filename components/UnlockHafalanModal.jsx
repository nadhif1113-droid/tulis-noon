// components/UnlockHafalanModal.jsx
// Modal payment 120 koin one-time untuk unlock Hafalan Quran 30 juz penuh.
// Trigger pas user tap surat di Juz 1-29 (premium) yang belum unlocked.

'use client';

import { X, Sparkles, Check, Lock } from 'lucide-react';
import { PREMIUM_UNLOCK_COST } from '@/lib/hafalan-tier';

export default function UnlockHafalanModal({ coins = 0, onClose, onUnlock }) {
  const canAfford = coins >= PREMIUM_UNLOCK_COST;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(10,30,25,0.8)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
        style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)', boxShadow: '0 6px 16px -4px rgba(201,169,97,0.5)' }}>
              🕌
            </div>
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-0.5" style={{ color: '#c9a961' }}>Hafalan Quran Penuh</p>
              <h2 className="text-xl leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
                Lanjutkan ke 30 Juz
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <X size={16} style={{ color: '#0a4d3c' }} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Hero: bismillah */}
          <div className="rounded-3xl p-5 mb-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
            <div className="absolute -right-2 -top-2 text-7xl opacity-20" style={{ fontFamily: 'Amiri, serif', color: '#c9a961' }}>﷽</div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-80 mb-1 font-bold">Niatkan</p>
            <p className="text-xl text-white leading-tight mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
              Hafal Al-Quran 30 Juz
            </p>
            <p className="text-xs text-white opacity-90 italic">
              Bayar sekali, akses seumur hidup
            </p>
          </div>

          {/* Status saat ini */}
          <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#c9a961' }}>Yang kamu dapet</p>
          <div className="rounded-2xl p-3.5 mb-4 space-y-2" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.08)' }}>
            <Benefit emoji="📖" title="Al-Fatihah + 37 surat Juz Amma" detail="Gratis selamanya (yang lagi kamu lihat)" />
            <hr style={{ border: 'none', borderTop: '1px dashed rgba(10,77,60,0.15)' }} />
            <Benefit emoji="🕌" title="Juz 1-29 — 76 surat lainnya" detail="Termasuk Al-Baqarah, Yasin, Ar-Rahman, Al-Mulk, dll" highlight />
            <Benefit emoji="🎵" title="Audio syekh Alafasy untuk semua ayat" detail="6,236 ayat dengan suara qari asli" />
            <Benefit emoji="🎤" title="Voice recognition cek bacaan" detail="Sistem dengar & koreksi pelafalanmu" />
            <Benefit emoji="🔄" title="Reset progress kapan aja" detail="Ulang hafalan sesuai kebutuhan" />
            <Benefit emoji="∞" title="Akses seumur hidup" detail="Sekali bayar, gak perlu langganan bulanan" />
          </div>

          {/* Hadis motivasi */}
          <div className="rounded-2xl p-3 mb-4" style={{ background: 'rgba(201,169,97,0.1)', border: '1px dashed #c9a961' }}>
            <p className="text-xs italic leading-relaxed text-center" style={{ color: '#8b6b3d' }}>
              "Sebaik-baik kalian adalah yang belajar Al-Quran dan mengajarkannya"<br/>
              <span className="text-[10px] opacity-80">— HR. Bukhari</span>
            </p>
          </div>

          {/* Price card */}
          <div className="rounded-2xl p-5 mb-4 relative overflow-hidden text-center" style={{ background: 'linear-gradient(135deg, #c9a961, #d4b876)' }}>
            <div className="absolute -right-2 -top-2 text-6xl opacity-20">🪙</div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white opacity-90 mb-1 font-bold">Harga sekali bayar</p>
            <p className="text-4xl text-white font-bold leading-none mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
              {PREMIUM_UNLOCK_COST} 🪙
            </p>
            <p className="text-xs text-white opacity-90">Setara ~Rp 30.000–60.000 (tergantung paket koin)</p>
            <div className="mt-3 px-3 py-1.5 rounded-full inline-block" style={{ background: 'rgba(255,255,255,0.25)' }}>
              <span className="text-xs font-bold text-white">Saldo kamu: {coins} 🪙</span>
            </div>
          </div>

          {/* Unlock button */}
          {canAfford ? (
            <button
              onClick={onUnlock}
              className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 mb-2"
              style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)', boxShadow: '0 10px 24px -8px rgba(10,77,60,0.5)' }}
            >
              <Sparkles size={18} /> Unlock 30 Juz Penuh
            </button>
          ) : (
            <div className="rounded-2xl p-3 mb-2" style={{ background: 'rgba(160,85,54,0.12)', border: '1.5px solid rgba(160,85,54,0.3)' }}>
              <p className="text-sm font-bold mb-0.5" style={{ color: '#a05536' }}>
                Koinmu kurang — butuh {PREMIUM_UNLOCK_COST - coins} koin lagi
              </p>
              <p className="text-xs leading-relaxed" style={{ color: '#8b6b3d' }}>
                Top up koin di tab Sosial atau dapet gratis dari aktivitas belajar harian.
              </p>
            </div>
          )}

          <button onClick={onClose} className="w-full py-3 rounded-2xl text-sm font-semibold" style={{ background: 'rgba(10,77,60,0.06)', color: '#0a4d3c' }}>
            Nanti saja — lanjut Juz Amma
          </button>
        </div>
      </div>
    </div>
  );
}

function Benefit({ emoji, title, detail, highlight }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-lg flex-shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold leading-tight" style={{ color: highlight ? '#c9a961' : '#0a4d3c' }}>{title}</p>
        <p className="text-[11px] leading-snug mt-0.5" style={{ color: '#666' }}>{detail}</p>
      </div>
    </div>
  );
}
