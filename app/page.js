'use client';

import { useAuth } from '@/lib/auth-context';
import TulisNoonApp from '@/components/TulisNoonApp';
import LandingPage from '@/components/LandingPage';
import BrandLoader from '@/components/BrandLoader';

export default function Home() {
  const { user, loading } = useAuth();

  // Loading state
  if (loading) {
    return <BrandLoader fullScreen text="Memuat..." />;
  }

  // Sudah login → render app utama
  if (user) {
    return <TulisNoonApp />;
  }

  // Belum login → tampilkan landing page (bukan auto-redirect ke /login).
  // Feedback ustadz (Juni 2026): auto-redirect ke /login bikin user khawatir scam
  // karena tidak ada penjelasan apa-apa. Sekarang user lihat value prop dulu.
  return <LandingPage />;
}
