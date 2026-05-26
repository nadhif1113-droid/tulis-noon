// components/TopUpKoinModal.jsx
// Modal top-up koin via Midtrans Snap.
// Load Snap.js dari Midtrans CDN, lalu trigger snap.pay() pakai token dari server.
//
// Setelah pembayaran sukses → Midtrans webhook hit server → koin auto-credit ke Firestore.
// Modal ini polling status order untuk show success state.

'use client';

import { useState, useEffect } from 'react';
import { X, Coins, Sparkles, Loader2, Check, CreditCard, Smartphone, QrCode, Building2 } from 'lucide-react';
import { COIN_PACKAGES } from '@/lib/midtrans';

export default function TopUpKoinModal({ user, userProfile, onClose, onSuccess }) {
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [snapLoaded, setSnapLoaded] = useState(false);

  // Load Snap.js
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.snap) { setSnapLoaded(true); return; }

    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const isProd = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
    const src = isProd ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js';

    const script = document.createElement('script');
    script.src = src;
    script.setAttribute('data-client-key', clientKey || '');
    script.async = true;
    script.onload = () => setSnapLoaded(true);
    script.onerror = () => setError('Gagal load payment system. Cek koneksi.');
    document.body.appendChild(script);
    return () => { /* keep snap loaded — reuse on next open */ };
  }, []);

  const handlePay = async (pkg) => {
    if (!user?.uid) { setError('Harap login dulu.'); return; }
    if (!snapLoaded) { setError('Payment system masih loading...'); return; }

    setIsProcessing(true);
    setError(null);
    setSelectedPkg(pkg.id);

    try {
      const res = await fetch('/api/midtrans/snap-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          userId: user.uid,
          userEmail: user.email,
          userName: userProfile?.displayName || user.displayName || 'User',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal create transaction');

      // Trigger Snap popup
      window.snap.pay(data.token, {
        onSuccess: (result) => {
          console.log('Payment success:', result);
          setIsProcessing(false);
          // Webhook will credit koin server-side. Client just refresh after a moment.
          setTimeout(() => { onSuccess?.(); onClose(); }, 1500);
        },
        onPending: (result) => {
          console.log('Payment pending:', result);
          setIsProcessing(false);
          // E.g. VA pending — show info, koin akan masuk setelah user bayar
          alert('Pembayaran pending. Selesaikan transfer sesuai instruksi yang diberikan. Koin otomatis masuk setelah pembayaran terverifikasi.');
          onClose();
        },
        onError: (result) => {
          console.error('Payment error:', result);
          setIsProcessing(false);
          setError('Pembayaran gagal: ' + (result?.status_message || 'unknown'));
        },
        onClose: () => {
          console.log('Payment popup closed by user');
          setIsProcessing(false);
        },
      });
    } catch (e) {
      console.error('Snap-token error:', e);
      setError(e.message || 'Server error');
      setIsProcessing(false);
    }
  };

  const currentCoins = userProfile?.coins || 0;

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(10,30,25,0.85)' }} onClick={onClose}>
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl"
        style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-2">
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1" style={{ color: '#c9a961' }}>💰 TOP UP KOIN</p>
            <h2 className="text-2xl leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, color: '#0a4d3c' }}>
              Pilih Paket Koin
            </h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(10,77,60,0.08)' }}>
            <X size={16} style={{ color: '#0a4d3c' }} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Saldo */}
          <div className="rounded-2xl p-3 mb-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, rgba(10,77,60,0.08), rgba(201,169,97,0.08))', border: '1.5px solid rgba(10,77,60,0.15)' }}>
            <div className="flex items-center gap-2">
              <Coins size={18} style={{ color: '#c9a961' }} />
              <span className="text-sm font-bold" style={{ color: '#8b6b3d' }}>Saldo saat ini</span>
            </div>
            <span className="text-xl font-bold" style={{ color: '#0a4d3c' }}>{currentCoins}</span>
          </div>

          {/* Payment methods preview */}
          <div className="rounded-2xl p-3 mb-4" style={{ background: 'white', border: '1.5px solid rgba(10,77,60,0.1)' }}>
            <p className="text-[10px] tracking-widest uppercase font-bold mb-2" style={{ color: '#8b6b3d' }}>Metode Pembayaran</p>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <div className="flex items-center gap-1" style={{ color: '#3d2817' }}><QrCode size={11} /> QRIS</div>
              <div className="flex items-center gap-1" style={{ color: '#3d2817' }}><Building2 size={11} /> VA Bank (BCA/Mandiri/dll)</div>
              <div className="flex items-center gap-1" style={{ color: '#3d2817' }}><Smartphone size={11} /> GoPay / ShopeePay / OVO / DANA</div>
              <div className="flex items-center gap-1" style={{ color: '#3d2817' }}><CreditCard size={11} /> Kartu kredit</div>
              <div className="flex items-center gap-1" style={{ color: '#3d2817' }}>🍎 Apple Pay</div>
              <div className="flex items-center gap-1" style={{ color: '#3d2817' }}>📱 Google Pay</div>
            </div>
          </div>

          {/* Packages */}
          <div className="space-y-2.5 mb-4">
            {COIN_PACKAGES.map((pkg) => {
              const totalCoins = pkg.coins + pkg.bonusCoins;
              const isLoading = isProcessing && selectedPkg === pkg.id;
              return (
                <button
                  key={pkg.id}
                  onClick={() => handlePay(pkg)}
                  disabled={isProcessing}
                  className="w-full p-4 rounded-2xl text-left flex items-center gap-3 active:scale-[0.98] transition-transform disabled:opacity-50 relative overflow-hidden"
                  style={{
                    background: pkg.popular ? 'linear-gradient(135deg, #c9a961, #d4b876)' : 'white',
                    border: pkg.popular ? 'none' : '1.5px solid rgba(10,77,60,0.1)',
                    boxShadow: pkg.popular ? '0 8px 20px -6px rgba(201,169,97,0.4)' : 'none',
                  }}
                >
                  {pkg.popular && (
                    <div className="absolute top-1.5 right-2 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.95)' }}>
                      <p className="text-[8px] font-bold" style={{ color: '#8b6b3d' }}>⭐ POPULAR</p>
                    </div>
                  )}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: pkg.popular ? 'rgba(255,255,255,0.25)' : 'rgba(201,169,97,0.18)' }}>
                    <span className="text-2xl">{pkg.popular ? '⭐' : '🪙'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-sm" style={{ color: pkg.popular ? 'white' : '#0a4d3c' }}>{pkg.label}</p>
                      {pkg.bonusCoins > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: pkg.popular ? 'rgba(255,255,255,0.95)' : 'rgba(10,77,60,0.1)', color: pkg.popular ? '#8b6b3d' : '#0a4d3c' }}>
                          +{pkg.bonusCoins} BONUS
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-snug mb-0.5" style={{ color: pkg.popular ? 'white' : '#666', opacity: pkg.popular ? 0.95 : 1 }}>{pkg.desc}</p>
                    <p className="text-[11px] font-semibold" style={{ color: pkg.popular ? 'white' : '#c9a961', opacity: pkg.popular ? 0.9 : 1 }}>
                      🪙 {totalCoins} koin
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" style={{ color: pkg.popular ? 'white' : '#0a4d3c' }} />
                    ) : (
                      <>
                        <p className="font-bold text-base" style={{ color: pkg.popular ? 'white' : '#0a4d3c' }}>
                          Rp {pkg.price.toLocaleString('id-ID')}
                        </p>
                        <p className="text-[10px]" style={{ color: pkg.popular ? 'white' : '#8b6b3d', opacity: pkg.popular ? 0.85 : 1 }}>
                          Rp {Math.round(pkg.price / totalCoins).toLocaleString('id-ID')}/koin
                        </p>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {error && (
            <div className="rounded-2xl p-3 mb-3" style={{ background: 'rgba(160,85,54,0.1)', border: '1px solid #a05536' }}>
              <p className="text-xs" style={{ color: '#a05536' }}>⚠️ {error}</p>
            </div>
          )}

          <p className="text-[10px] text-center" style={{ color: '#8b6b3d' }}>
            🔒 Pembayaran aman & terenkripsi · Diproses oleh Midtrans (PCI-DSS Level 1)<br/>
            Koin otomatis masuk setelah pembayaran berhasil
          </p>
        </div>
      </div>
    </div>
  );
}
