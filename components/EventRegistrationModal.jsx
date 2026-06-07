// components/EventRegistrationModal.jsx
// Modal pendaftaran Event Tantangan 10 Hari Aktif — 3 step wizard.
//   Step 1: Data Diri (nama, HP, email, alamat, tahun lahir)
//   Step 2: Rekening Hadiah (bank/e-wallet, no rek, atas nama)
//   Step 3: Persetujuan (8 pernyataan + tanda tangan digital)
//
// User WAJIB selesaikan semua step sebelum bisa muncul di leaderboard.

'use client';

import { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Shield, Trophy, ClipboardList } from 'lucide-react';
import {
  AGREEMENT_POINTS, PAYOUT_BANKS, PAYOUT_EWALLETS,
  validateRegistration, buildRegistrationPayload,
} from '@/lib/event-registration';
import { CHALLENGE_TITLE, CHALLENGE_TOTAL_PRIZE, challengeTotalPrize } from '@/lib/challenge-launch';

const TOTAL_STEPS = 3;

export default function EventRegistrationModal({ userProfile, userEmail, onClose, onRegistered }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: userProfile?.displayName || '',
    phone: userProfile?.phone || '',
    email: userEmail || userProfile?.email || '',
    province: '',
    city: '',
    address: '',
    birthYear: '',
    payoutMethod: 'bank',
    payoutProvider: '',
    accountNumber: '',
    accountName: '',
    signature: '',
    agreedPoints: [],
  });

  const update = (field, value) => {
    setFormData((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => { const c = { ...e }; delete c[field]; return c; });
  };

  const toggleAgreement = (id) => {
    setFormData((d) => {
      const cur = d.agreedPoints || [];
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      return { ...d, agreedPoints: next };
    });
    if (errors.agreedPoints) setErrors((e) => { const c = { ...e }; delete c.agreedPoints; return c; });
  };

  // Step validation untuk Next button
  const canProceedStep1 = useMemo(() => {
    return formData.fullName.trim().length >= 3 &&
      formData.phone.replace(/\s|-/g, '').length >= 10 &&
      formData.email.includes('@') &&
      formData.province.trim().length >= 2 &&
      formData.city.trim().length >= 2 &&
      formData.address.trim().length >= 10 &&
      formData.birthYear;
  }, [formData]);

  const canProceedStep2 = useMemo(() => {
    return formData.payoutProvider &&
      formData.accountNumber.replace(/\s|-/g, '').length >= 8 &&
      formData.accountName.trim().length >= 3;
  }, [formData]);

  const canSubmit = useMemo(() => {
    const requiredIds = AGREEMENT_POINTS.filter((p) => p.required).map((p) => p.id);
    const allAgreed = requiredIds.every((id) => formData.agreedPoints.includes(id));
    return allAgreed && formData.signature.trim().length >= 3;
  }, [formData]);

  const handleNext = () => {
    const v = validateStep(step);
    if (!v.ok) { setErrors(v.errors); return; }
    setErrors({});
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const validateStep = (stepNum) => {
    const tempData = { ...formData };
    // Validate hanya field di step ini
    const full = validateRegistration(tempData);
    const fieldsByStep = {
      1: ['fullName', 'phone', 'email', 'province', 'city', 'address', 'birthYear'],
      2: ['payoutMethod', 'payoutProvider', 'accountNumber', 'accountName'],
      3: ['agreedPoints', 'signature'],
    };
    const fields = fieldsByStep[stepNum] || [];
    const stepErrors = {};
    for (const f of fields) {
      if (full.errors[f]) stepErrors[f] = full.errors[f];
    }
    return { ok: Object.keys(stepErrors).length === 0, errors: stepErrors };
  };

  const handleSubmit = async () => {
    const full = validateRegistration(formData);
    if (!full.ok) {
      setErrors(full.errors);
      // Jump back to first step with error
      const fieldsByStep = {
        1: ['fullName', 'phone', 'email', 'province', 'city', 'address', 'birthYear'],
        2: ['payoutMethod', 'payoutProvider', 'accountNumber', 'accountName'],
        3: ['agreedPoints', 'signature'],
      };
      for (const [s, fields] of Object.entries(fieldsByStep)) {
        if (fields.some((f) => full.errors[f])) {
          setStep(Number(s));
          break;
        }
      }
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildRegistrationPayload(formData, { fromScreen: 'event-dashboard' });
      await onRegistered(payload);
    } catch (err) {
      console.error('Registration failed:', err);
      setErrors({ submit: 'Gagal menyimpan pendaftaran. Coba lagi.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(10,77,60,0.65)' }}>
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-hidden flex flex-col" style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.25)' }}>
        {/* HEADER */}
        <div className="px-5 py-4 flex items-center justify-between sticky top-0 z-10" style={{ background: 'linear-gradient(135deg, #0a4d3c, #1a6b56)' }}>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,169,97,0.25)' }}>
              <Trophy size={17} style={{ color: '#c9a961' }} />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase font-bold" style={{ color: '#c9a961' }}>Pendaftaran Event</p>
              <p className="text-sm font-bold text-white">{CHALLENGE_TITLE}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }} aria-label="Tutup">
            <X size={16} style={{ color: 'white' }} />
          </button>
        </div>

        {/* PROGRESS */}
        <div className="px-5 py-3 flex items-center gap-2 border-b" style={{ background: '#faf6ee', borderColor: 'rgba(10,77,60,0.08)' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex-1">
              <div className="h-1.5 rounded-full" style={{ background: n <= step ? '#0a4d3c' : 'rgba(10,77,60,0.15)' }} />
              <p className="text-[10px] mt-1 text-center font-semibold" style={{ color: n === step ? '#0a4d3c' : '#8b6b3d' }}>
                {n === 1 ? 'Data Diri' : n === 2 ? 'Rekening' : 'Persetujuan'}
              </p>
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {step === 1 && <Step1 formData={formData} update={update} errors={errors} />}
          {step === 2 && <Step2 formData={formData} update={update} errors={errors} />}
          {step === 3 && <Step3 formData={formData} update={update} toggleAgreement={toggleAgreement} errors={errors} />}
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t flex gap-2" style={{ background: '#faf6ee', borderColor: 'rgba(10,77,60,0.08)' }}>
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-3 rounded-2xl flex items-center gap-1 font-semibold text-sm"
              style={{ background: 'rgba(10,77,60,0.08)', color: '#0a4d3c' }}
              disabled={submitting}
            >
              <ChevronLeft size={16} /> Balik
            </button>
          )}
          {step < TOTAL_STEPS ? (
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-3 rounded-2xl flex items-center justify-center gap-1 font-bold text-sm disabled:opacity-50"
              style={{ background: '#0a4d3c', color: 'white' }}
              disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)}
            >
              Lanjut <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-50"
              style={{ background: canSubmit ? '#0a4d3c' : 'rgba(10,77,60,0.3)', color: 'white' }}
              disabled={!canSubmit || submitting}
            >
              {submitting ? 'Menyimpan...' : (<><CheckCircle2 size={16} /> Saya Setuju & Daftar</>)}
            </button>
          )}
        </div>

        {errors.submit && (
          <div className="px-5 pb-3 text-xs text-center" style={{ color: '#a02020' }}>{errors.submit}</div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// STEP 1: DATA DIRI
// ============================================================================
function Step1({ formData, update, errors }) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl p-3 mb-3" style={{ background: 'rgba(201,169,97,0.12)', border: '1px solid rgba(201,169,97,0.3)' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#7a3d2a' }}>
          <ClipboardList size={12} className="inline mr-1 -mt-0.5" />
          <span className="font-bold">Data ini WAJIB BENAR & sesuai KTP.</span> Akan dipakai untuk verifikasi & transfer hadiah Rp 500rb/300rb/200rb kalau kamu menang.
        </p>
      </div>

      <Field label="Nama Lengkap (sesuai KTP)" required error={errors.fullName}>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          placeholder="Contoh: Ahmad Fauzi Pratama"
          className="w-full px-3 py-2.5 rounded-xl border text-sm"
          style={{ borderColor: errors.fullName ? '#a02020' : 'rgba(10,77,60,0.2)' }}
        />
      </Field>

      <Field label="Nomor HP / WhatsApp Aktif" required error={errors.phone}>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="08123456789"
          className="w-full px-3 py-2.5 rounded-xl border text-sm"
          style={{ borderColor: errors.phone ? '#a02020' : 'rgba(10,77,60,0.2)' }}
        />
        <p className="text-[10px] mt-1" style={{ color: '#8b6b3d' }}>Untuk verifikasi & konfirmasi pemenang via WhatsApp.</p>
      </Field>

      <Field label="Email" required error={errors.email}>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="nama@gmail.com"
          className="w-full px-3 py-2.5 rounded-xl border text-sm"
          style={{ borderColor: errors.email ? '#a02020' : 'rgba(10,77,60,0.2)' }}
        />
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Provinsi" required error={errors.province}>
          <input
            type="text"
            value={formData.province}
            onChange={(e) => update('province', e.target.value)}
            placeholder="Jawa Tengah"
            className="w-full px-3 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: errors.province ? '#a02020' : 'rgba(10,77,60,0.2)' }}
          />
        </Field>
        <Field label="Kota/Kab" required error={errors.city}>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder="Semarang"
            className="w-full px-3 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: errors.city ? '#a02020' : 'rgba(10,77,60,0.2)' }}
          />
        </Field>
      </div>

      <Field label="Alamat Lengkap" required error={errors.address}>
        <textarea
          value={formData.address}
          onChange={(e) => update('address', e.target.value)}
          placeholder="Jl. Pemuda No. 1, RT 02 / RW 03, Kelurahan ..."
          rows={2}
          className="w-full px-3 py-2.5 rounded-xl border text-sm resize-none"
          style={{ borderColor: errors.address ? '#a02020' : 'rgba(10,77,60,0.2)' }}
        />
      </Field>

      <Field label="Tahun Lahir" required error={errors.birthYear}>
        <input
          type="number"
          value={formData.birthYear}
          onChange={(e) => update('birthYear', e.target.value)}
          placeholder="1995"
          min="1940"
          max={new Date().getFullYear() - 13}
          className="w-full px-3 py-2.5 rounded-xl border text-sm"
          style={{ borderColor: errors.birthYear ? '#a02020' : 'rgba(10,77,60,0.2)' }}
        />
        <p className="text-[10px] mt-1" style={{ color: '#8b6b3d' }}>Minimal usia 13 tahun.</p>
      </Field>
    </div>
  );
}

// ============================================================================
// STEP 2: REKENING HADIAH
// ============================================================================
function Step2({ formData, update, errors }) {
  const providers = formData.payoutMethod === 'bank' ? PAYOUT_BANKS : PAYOUT_EWALLETS;

  return (
    <div className="space-y-3">
      <div className="rounded-2xl p-3 mb-3" style={{ background: 'rgba(10,77,60,0.06)', border: '1px solid rgba(10,77,60,0.2)' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#0a4d3c' }}>
          <Shield size={12} className="inline mr-1 -mt-0.5" />
          <span className="font-bold">Rekening WAJIB atas nama kamu sendiri</span> (sama dengan nama KTP). Tidak boleh atas nama orang lain.
        </p>
      </div>

      <Field label="Metode Hadiah" required>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => { update('payoutMethod', 'bank'); update('payoutProvider', ''); }}
            className="px-3 py-2.5 rounded-xl border text-sm font-semibold"
            style={{
              background: formData.payoutMethod === 'bank' ? '#0a4d3c' : 'white',
              color: formData.payoutMethod === 'bank' ? 'white' : '#0a4d3c',
              borderColor: 'rgba(10,77,60,0.2)',
            }}
          >🏦 Bank Transfer</button>
          <button
            onClick={() => { update('payoutMethod', 'ewallet'); update('payoutProvider', ''); }}
            className="px-3 py-2.5 rounded-xl border text-sm font-semibold"
            style={{
              background: formData.payoutMethod === 'ewallet' ? '#0a4d3c' : 'white',
              color: formData.payoutMethod === 'ewallet' ? 'white' : '#0a4d3c',
              borderColor: 'rgba(10,77,60,0.2)',
            }}
          >📱 E-wallet</button>
        </div>
      </Field>

      <Field label={formData.payoutMethod === 'bank' ? 'Pilih Bank' : 'Pilih E-wallet'} required error={errors.payoutProvider}>
        <select
          value={formData.payoutProvider}
          onChange={(e) => update('payoutProvider', e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border text-sm bg-white"
          style={{ borderColor: errors.payoutProvider ? '#a02020' : 'rgba(10,77,60,0.2)' }}
        >
          <option value="">— Pilih —</option>
          {providers.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </Field>

      <Field label="Nomor Rekening / E-wallet" required error={errors.accountNumber}>
        <input
          type="text"
          inputMode="numeric"
          value={formData.accountNumber}
          onChange={(e) => update('accountNumber', e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="1234567890"
          className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono"
          style={{ borderColor: errors.accountNumber ? '#a02020' : 'rgba(10,77,60,0.2)' }}
        />
      </Field>

      <Field label="Nama Pemilik Rekening" required error={errors.accountName}>
        <input
          type="text"
          value={formData.accountName}
          onChange={(e) => update('accountName', e.target.value)}
          placeholder={formData.fullName || 'Sama dengan nama KTP'}
          className="w-full px-3 py-2.5 rounded-xl border text-sm"
          style={{ borderColor: errors.accountName ? '#a02020' : 'rgba(10,77,60,0.2)' }}
        />
        <p className="text-[10px] mt-1" style={{ color: '#8b6b3d' }}>Harus PERSIS sama dengan nama lengkap kamu di Step 1.</p>
      </Field>
    </div>
  );
}

// ============================================================================
// STEP 3: PERSETUJUAN
// ============================================================================
function Step3({ formData, update, toggleAgreement, errors }) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl p-3 mb-2" style={{ background: 'rgba(160,85,54,0.08)', border: '1px solid rgba(160,85,54,0.3)' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#7a3d2a' }}>
          <AlertCircle size={12} className="inline mr-1 -mt-0.5" />
          <span className="font-bold">Baca semua pernyataan dengan cermat.</span> Mencentang artinya kamu MEMAHAMI & SETUJU. Pelanggaran = diskualifikasi.
        </p>
      </div>

      <div className="space-y-2">
        {AGREEMENT_POINTS.map((point, idx) => {
          const checked = formData.agreedPoints.includes(point.id);
          return (
            <button
              key={point.id}
              onClick={() => toggleAgreement(point.id)}
              className="w-full text-left rounded-2xl p-3 flex items-start gap-3 transition-all active:scale-[0.98]"
              style={{
                background: checked ? 'rgba(10,77,60,0.06)' : 'white',
                border: `1.5px solid ${checked ? 'rgba(10,77,60,0.4)' : 'rgba(10,77,60,0.15)'}`,
              }}
            >
              <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                background: checked ? '#0a4d3c' : 'white',
                border: `1.5px solid ${checked ? '#0a4d3c' : 'rgba(10,77,60,0.3)'}`,
              }}>
                {checked && <CheckCircle2 size={12} style={{ color: 'white' }} />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold mb-0.5" style={{ color: '#0a4d3c' }}>
                  {idx + 1}. {point.title}
                </p>
                <p className="text-[11px] leading-snug" style={{ color: '#3d2817' }}>
                  {point.text}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {errors.agreedPoints && (
        <p className="text-xs text-center" style={{ color: '#a02020' }}>{errors.agreedPoints}</p>
      )}

      <div className="rounded-2xl p-4 mt-3" style={{ background: '#faf6ee', border: '1.5px solid rgba(201,169,97,0.4)' }}>
        <p className="text-[10px] tracking-[0.2em] uppercase font-bold mb-2" style={{ color: '#8b6b3d' }}>
          ✍️ Tanda Tangan Digital
        </p>
        <p className="text-xs mb-2 leading-snug" style={{ color: '#3d2817' }}>
          Ketik <span className="font-bold">nama lengkap persis</span> sama dengan Step 1 sebagai konfirmasi persetujuan kamu.
        </p>
        <input
          type="text"
          value={formData.signature}
          onChange={(e) => update('signature', e.target.value)}
          placeholder={formData.fullName || 'Nama lengkap'}
          className="w-full px-3 py-3 rounded-xl border text-base text-center font-bold"
          style={{
            borderColor: errors.signature ? '#a02020' : 'rgba(201,169,97,0.6)',
            background: 'white',
            fontFamily: 'Fraunces, serif',
            color: '#0a4d3c',
          }}
        />
        {errors.signature && (
          <p className="text-[10px] mt-1" style={{ color: '#a02020' }}>{errors.signature}</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SHARED FIELD WRAPPER
// ============================================================================
function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="text-xs font-semibold mb-1 block" style={{ color: '#3d2817' }}>
        {label} {required && <span style={{ color: '#a02020' }}>*</span>}
      </label>
      {children}
      {error && <p className="text-[10px] mt-1" style={{ color: '#a02020' }}>{error}</p>}
    </div>
  );
}
