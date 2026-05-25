'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';

export default function ProfilePage() {
  const router = useRouter();
  const { user, userProfile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  async function handleSignOut() {
    const result = await signOut();
    if (result.success) {
      router.push('/');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="text-center">
          <div className="text-4xl mb-3">🕌</div>
          <p className="text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#FAF7F2' }}>

      <div className="px-6 pt-12 pb-8" style={{ background: 'linear-gradient(135deg, #1B5E3F 0%, #2D7A56 100%)' }}>
        <div className="flex flex-col items-center text-center">

          {userProfile && userProfile.photoURL ? (
            <img
              src={userProfile.photoURL}
              alt={userProfile.displayName}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl shadow-lg mb-4">
              {userProfile && userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}

          <h1 className="text-2xl font-bold text-white mb-1">
            {userProfile && userProfile.displayName ? userProfile.displayName : 'User'}
          </h1>
          <p className="text-white opacity-90 text-sm">
            {user.email}
          </p>
        </div>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-1">XP</div>
              <div className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>
                {userProfile && userProfile.xp ? userProfile.xp : 0}
              </div>
              <div className="text-xs text-gray-600">XP</div>
            </div>
            <div className="text-center border-l border-r border-gray-200">
              <div className="text-2xl mb-1">LV</div>
              <div className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>
                {userProfile && userProfile.level ? userProfile.level : 1}
              </div>
              <div className="text-xs text-gray-600">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">ST</div>
              <div className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>
                {userProfile && userProfile.streak ? userProfile.streak : 0}
              </div>
              <div className="text-xs text-gray-600">Streak</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <h3 className="font-bold mb-4" style={{ color: '#1B5E3F' }}>
            Pengingat Sholat
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Notifikasi 5x sehari
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Dengan hadis dan doa pilihan
              </p>
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
              Aktif
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <h3 className="font-bold mb-4" style={{ color: '#1B5E3F' }}>
            Lokasi
          </h3>
          <div>
            <p className="text-sm text-gray-700">
              {userProfile && userProfile.location && userProfile.location.city ? userProfile.location.city : 'Madinah'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Untuk jadwal sholat akurat
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <h3 className="font-bold mb-4" style={{ color: '#1B5E3F' }}>
            Tentang Akun
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">User ID</span>
              <span className="text-gray-800 font-mono text-xs">
                {user.uid.substring(0, 12)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="text-gray-800">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Verifikasi Email</span>
              <span className={user.emailVerified ? 'text-green-600' : 'text-orange-500'}>
                {user.emailVerified ? 'Terverifikasi' : 'Belum'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full bg-white border-2 border-red-200 text-red-600 py-3 rounded-2xl font-semibold hover:bg-red-50 transition mb-4"
        >
          Keluar dari Akun
        </button>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            Kembali ke beranda
          </Link>
        </div>

      </div>
    </div>
  );
}
