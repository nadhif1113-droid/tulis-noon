// components/LandingPage.jsx
// Halaman utama untuk visitor yang belum login.
// Tujuan: build trust + jelaskan value prop sebelum minta user login.
// Feedback ustadz (Juni 2026): "Halaman utama terlalu polos, khawatir scam,
// tidak ada gambaran isinya seperti apa sehingga tidak berani login."

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, GraduationCap, Users, Award, MessageCircle, Sparkles, Star, CheckCircle2, ArrowRight, Shield, Mic, ImageIcon, FileText, Trophy } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full" style={{
      background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=DM+Sans:wght@400;500;600;700&family=Amiri:wght@400;700&family=Reem+Kufi:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z' fill='none' stroke='%230a4d3c' stroke-width='1'/%3E%3C/svg%3E")`,
      }}/>

      <div className="relative max-w-md mx-auto min-h-screen flex flex-col">
        {/* HEADER */}
        <header className="px-5 py-4 flex items-center justify-between sticky top-0 z-30" style={{ background: 'rgba(250,246,238,0.92)', backdropFilter: 'blur(8px)' }}>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#0a4d3c' }}>
              <span className="text-white font-bold text-xl" style={{ fontFamily: 'Reem Kufi, serif' }}>ن</span>
            </div>
            <div>
              <p className="text-base font-bold leading-none" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>Tulis Noon</p>
              <p className="text-[10px]" style={{ color: '#8b6b3d' }}>Belajar Arab praktis</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 rounded-xl text-sm font-bold"
            style={{ background: '#0a4d3c', color: 'white' }}
          >
            Masuk
          </button>
        </header>

        <div className="px-5">
          {/* HERO */}
          <section className="py-6">
            <div className="rounded-3xl p-6 relative overflow-hidden" style={{
              background: 'linear-gradient(135deg, #0a4d3c 0%, #1a6b56 100%)',
            }}>
              <div className="absolute -right-6 -top-6 text-8xl opacity-10" style={{ fontFamily: 'Reem Kufi, serif' }}>ن</div>
              <div className="relative">
                <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-2" style={{ color: '#c9a961' }}>UNTUK JAMAAH INDONESIA</p>
                <h1 className="text-3xl text-white mb-3 leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}>
                  Belajar Bahasa Arab praktis untuk umrah, kerja & kuliah di Saudi
                </h1>
                <p className="text-sm text-white opacity-95 mb-4 leading-relaxed">
                  Dialek <span className="font-bold">Hijazi</span> yang dipakai sehari-hari. Bukan teori — langsung praktek pasar, masjid, hotel, kantor.
                </p>
                <button
                  onClick={() => router.push('/login')}
                  className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                  style={{ background: '#c9a961', color: '#0a4d3c' }}
                >
                  Mulai Belajar Gratis <ArrowRight size={15} />
                </button>
                <p className="text-[10px] text-white opacity-75 text-center mt-2">
                  Daftar gratis · Tanpa kartu kredit · Akses langsung semua fitur
                </p>
              </div>
            </div>
          </section>

          {/* TRUST SIGNALS */}
          <section className="mb-6">
            <div className="grid grid-cols-3 gap-2">
              <TrustItem num="200+" label="Jam belajar" />
              <TrustItem num="13" label="Fitur lengkap" />
              <TrustItem num="7+1" label="Sertifikat" />
            </div>
          </section>

          {/* PROBLEM-SOLUTION */}
          <section className="mb-6">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-2" style={{ color: '#8b6b3d' }}>UNTUK SIAPA?</p>
            <h2 className="text-xl mb-3 leading-tight" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c', fontWeight: 700 }}>
              Kenapa belajar Arab dari Tulis Noon?
            </h2>
            <div className="space-y-2">
              <PersonaCard emoji="🕋" title="Mau umrah/haji" desc="Belajar dialek Hijazi (yang dipakai di Mekkah-Madinah) — bukan Fusha kaku yang gak kepakai di pasar." />
              <PersonaCard emoji="💼" title="Kerja di Saudi/Timur Tengah" desc="Vocab kantor, presentasi, ngobrol bos & klien. Materi siap pakai untuk profesi nyata." />
              <PersonaCard emoji="🎓" title="Pelajar/mahasiswa Arab" desc="Nahwu, Shorf, hafalan Juz 30 lengkap. Persiapan kuliah di King Saud, Madinah, Al-Azhar." />
              <PersonaCard emoji="🤲" title="Ingin paham Quran" desc="Kosakata Quran + tafsir mini dalam Bahasa Indonesia. Dari hafalan ke pemahaman." />
            </div>
          </section>

          {/* FEATURES */}
          <section className="mb-6">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-2" style={{ color: '#8b6b3d' }}>FITUR LENGKAP</p>
            <h2 className="text-xl mb-3 leading-tight" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c', fontWeight: 700 }}>
              13 fitur dalam 1 aplikasi
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <FeatureCard icon={BookOpen} title="45 Modul Lesson" desc="Umrah, Profesi, Pelajar" />
              <FeatureCard icon={GraduationCap} title="64 Pelajaran Grammar" desc="Nahwu 35 + Shorf 29" />
              <FeatureCard icon={MessageCircle} title="Tanya Cepat AI" desc="Tanya Arab apa saja" />
              <FeatureCard icon={Sparkles} title="AI Roleplay" desc="Praktek ngobrol nyata" />
              <FeatureCard icon={Mic} title="Belajar Ngomong" desc="AI nilai pengucapan" />
              <FeatureCard icon={ImageIcon} title="200 Tebak Gambar" desc="Visual vocab AI image" />
              <FeatureCard icon={FileText} title="Tulis Arab" desc="Dari nol sampai paragraf" />
              <FeatureCard icon={Users} title="Komunitas" desc="Teman + chat Arab" />
            </div>
          </section>

          {/* CONTENT PROOF */}
          <section className="mb-6">
            <div className="rounded-2xl p-4" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.1)' }}>
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-2" style={{ color: '#8b6b3d' }}>KONTEN YANG ADA</p>
              <div className="space-y-1.5 text-sm" style={{ color: '#3d2817' }}>
                <CheckRow text="15 modul belajar Umrah dengan percakapan jamaah" />
                <CheckRow text="20 modul Bahasa Profesional kantor" />
                <CheckRow text="10 modul Pelajar untuk persiapan kuliah" />
                <CheckRow text="35 pelajaran Nahwu (tata bahasa)" />
                <CheckRow text="29 pelajaran Shorf (perubahan kata)" />
                <CheckRow text="12 materi Perkenalan Diri persona-specific" />
                <CheckRow text="37 surat Juz 30 hafalan + audio Syekh Alafasy" />
                <CheckRow text="200 vocab Tebak Gambar 10 kategori" />
                <CheckRow text="21 Cerita Interaktif sejarah Islam" />
                <CheckRow text="15 level Tulis Arab dari huruf ke paragraf" />
              </div>
            </div>
          </section>

          {/* COMMITMENTS / TRUST */}
          <section className="mb-6">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-2" style={{ color: '#8b6b3d' }}>KOMITMEN KAMI</p>
            <div className="space-y-2">
              <CommitmentCard
                icon={Shield}
                title="Bukan scam — aplikasi resmi"
                desc="Dibuat oleh tim Indonesia. Hubungi kami via WhatsApp atau email untuk verifikasi."
              />
              <CommitmentCard
                icon={Star}
                title="Sesuai syariat & adab Islam"
                desc="Tidak ada musik latar. Konten persona-sensitive (umrah, profesi, pelajar). Komunitas dimoderasi."
              />
              <CommitmentCard
                icon={CheckCircle2}
                title="Konten yang benar — feedback ditampung"
                desc="Setiap koreksi dari ustadz/native speaker langsung kami audit. Bukan AI-only — ada manual review."
              />
              <CommitmentCard
                icon={Trophy}
                title="Event berhadiah real-money"
                desc="Tantangan belajar dengan hadiah uang tunai. Anti-cheat 6-layer untuk fairness."
              />
            </div>
          </section>

          {/* FAQ-ish */}
          <section className="mb-6">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-2" style={{ color: '#8b6b3d' }}>PERTANYAAN UMUM</p>
            <div className="space-y-2">
              <FaqCard q="Gratis selamanya?" a="Saat ini SEMUA fitur dibuka gratis untuk launch phase. Nanti akan ada tier Mahir berbayar, tapi tier free tetap generous (modul awal tiap path tetap gratis)." />
              <FaqCard q="Apakah ada di App Store / Play Store?" a="Versi Android sudah ready. iOS sedang proses submission. Sementara bisa akses via web di smartphone — semua fitur jalan." />
              <FaqCard q="Bagaimana kalau saya menemukan kesalahan konten?" a="Hubungi kami via halaman Bantuan dalam aplikasi (akses lewat Profile setelah login). Tim akan review feedback dalam 24 jam." />
              <FaqCard q="Data saya aman?" a="Ya. Data disimpan di Firebase Google Cloud dengan enkripsi. Lihat Privacy Policy untuk detail (link di footer)." />
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="mb-6">
            <div className="rounded-3xl p-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(201,169,97,0.18), rgba(212,184,118,0.1))', border: '1.5px solid rgba(201,169,97,0.4)' }}>
              <p className="text-2xl mb-2" style={{ fontFamily: 'Reem Kufi, serif', color: '#0a4d3c' }}>بِسْمِ اللَّهِ نَبْدَأ</p>
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Fraunces, serif', color: '#0a4d3c' }}>
                Siap mulai perjalanan belajarmu?
              </h3>
              <p className="text-xs mb-4" style={{ color: '#3d2817' }}>
                Daftar gratis dalam 30 detik. Pakai akun Google atau email.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                style={{ background: '#0a4d3c', color: 'white' }}
              >
                Mulai Sekarang <ArrowRight size={15} />
              </button>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="px-5 py-6 mt-auto border-t" style={{ borderColor: 'rgba(10,77,60,0.1)', background: 'rgba(10,77,60,0.04)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0a4d3c' }}>
              <span className="text-white font-bold text-sm" style={{ fontFamily: 'Reem Kufi, serif' }}>ن</span>
            </div>
            <p className="text-sm font-bold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>Tulis Noon</p>
          </div>
          <p className="text-[11px] mb-3" style={{ color: '#8b6b3d' }}>
            Aplikasi belajar bahasa Arab Hijazi untuk jamaah Indonesia. Persiapan umrah, profesi, dan pelajar.
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
            <Link href="/terms" style={{ color: '#0a4d3c' }}>Syarat & Ketentuan</Link>
            <Link href="/privacy" style={{ color: '#0a4d3c' }}>Privacy Policy</Link>
            <Link href="/contact" style={{ color: '#0a4d3c' }}>Kontak</Link>
          </div>
          <p className="text-[10px] mt-4" style={{ color: '#8b6b3d' }}>
            © 2026 Tulis Noon · Dibuat dengan cinta untuk umat
          </p>
        </footer>
      </div>
    </div>
  );
}

// ============================================================================
// SUB COMPONENTS
// ============================================================================

function TrustItem({ num, label }) {
  return (
    <div className="rounded-2xl p-3 text-center" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.1)' }}>
      <p className="text-xl font-bold" style={{ color: '#0a4d3c', fontFamily: 'Fraunces, serif' }}>{num}</p>
      <p className="text-[10px]" style={{ color: '#8b6b3d' }}>{label}</p>
    </div>
  );
}

function PersonaCard({ emoji, title, desc }) {
  return (
    <div className="rounded-2xl p-3 flex items-start gap-3" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
      <div className="text-3xl flex-shrink-0">{emoji}</div>
      <div className="flex-1">
        <p className="text-sm font-bold mb-0.5" style={{ color: '#0a4d3c' }}>{title}</p>
        <p className="text-[11px] leading-relaxed" style={{ color: '#3d2817' }}>{desc}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-2xl p-3" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: 'rgba(10,77,60,0.08)' }}>
        <Icon size={15} style={{ color: '#0a4d3c' }} />
      </div>
      <p className="text-xs font-bold mb-0.5" style={{ color: '#0a4d3c' }}>{title}</p>
      <p className="text-[10px]" style={{ color: '#8b6b3d' }}>{desc}</p>
    </div>
  );
}

function CheckRow({ text }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 size={14} style={{ color: '#0a4d3c', flexShrink: 0, marginTop: '2px' }} />
      <p className="text-xs leading-relaxed">{text}</p>
    </div>
  );
}

function CommitmentCard({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-2xl p-3 flex items-start gap-3" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,169,97,0.18)' }}>
        <Icon size={17} style={{ color: '#8b6b3d' }} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold mb-0.5" style={{ color: '#0a4d3c' }}>{title}</p>
        <p className="text-[11px] leading-relaxed" style={{ color: '#3d2817' }}>{desc}</p>
      </div>
    </div>
  );
}

function FaqCard({ q, a }) {
  return (
    <details className="rounded-2xl p-3" style={{ background: 'white', border: '1px solid rgba(10,77,60,0.08)' }}>
      <summary className="text-sm font-bold cursor-pointer flex items-center justify-between" style={{ color: '#0a4d3c' }}>
        {q}
        <span style={{ color: '#8b6b3d', fontSize: '14px' }}>+</span>
      </summary>
      <p className="text-[11px] leading-relaxed mt-2" style={{ color: '#3d2817' }}>{a}</p>
    </details>
  );
}
