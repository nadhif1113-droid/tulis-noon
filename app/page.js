'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import TulisNoonApp from '@/components/TulisNoonApp';

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
      router.push('/login');
    } else if (!loading && user) {
      console.log('✅ User logged in, rendering app');
    }
  }, [user, loading, router]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(180deg, #faf6ee 0%, #f3ebd9 100%)' }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 animate-spin" style={{ background: 'linear-gradient(90deg, #0a4d3c, #1a6b56)', backgroundClip: 'border-box', borderTop: '4px solid #c9a961' }} />
          <p style={{ color: '#8b6b3d' }}>Memuat...</p>
        </div>
      </div>
    );
  }

  // Kalau user sudah login, render app
  if (user) {
    return <TulisNoonApp />;
  }

  // Default: return null (akan redirect ke /login)
  return null;
}
