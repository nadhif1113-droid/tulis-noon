'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import TulisNoonApp from '@/components/TulisNoonApp';
import BrandLoader from '@/components/BrandLoader';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // DEBUG: Log auth state
    console.log('🔍 Auth State:', { user: user ? user.email : 'null', loading });

    // Kalau sudah login, render app utama
    // Kalau belum login, redirect ke /login
    if (!loading && !user) {
      console.log('📍 Redirecting to /login (no user)');
      router.replace('/login');
    } else if (!loading && user) {
      console.log('✅ User logged in, rendering app');
    }
  }, [user, loading, router]);

  // Loading state
  if (loading) {
    return <BrandLoader fullScreen text="Memuat..." />;
  }

  // Kalau user sudah login, render app
  if (user) {
    return <TulisNoonApp />;
  }

  // Default: return null (akan redirect ke /login)
  return null;
}
