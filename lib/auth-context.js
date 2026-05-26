// lib/auth-context.js
// React Context untuk Firebase Authentication

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from './firebase';
import { initFCM } from './fcm-helper';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Register service worker for FCM
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js').then((registration) => {
        console.log('✅ Service Worker registered:', registration);
      }).catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            await createUserProfile(firebaseUser);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }

        // Init FCM for existing sessions (user already logged in from previous visit)
        // initFCM is idempotent: checks permission, only prompts if 'default',
        // and arrayUnion in Firestore prevents duplicate token entries.
        initFCM(firebaseUser.uid).catch((err) => {
          console.error('FCM init (auto) error:', err);
        });
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function createUserProfile(firebaseUser, additionalData = {}) {
    try {
      const userRef = doc(firestore, 'users', firebaseUser.uid);
      const profileData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || additionalData.name || 'User',
        photoURL: firebaseUser.photoURL || null,
        xp: 0,
        level: 1,
        streak: 0,
        // Level Arab user — diset di onboarding (user baru) atau modal survey (user lama).
        // 'unknown' = belum di-survey, 'pemula' | 'bisaBaca' | 'menengah' | 'lancar'
        arabicLevel: 'unknown',
        // Tour singkat 4-slide setelah onboarding/login pertama
        tourCompleted: false,
        lastActivity: serverTimestamp(),
        createdAt: serverTimestamp(),
        fcmTokens: [],
        prayerReminder: {
          enabled: true,
          prayers: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'],
          timezone: 'Asia/Riyadh',
        },
        location: {
          city: 'Madinah',
          latitude: 24.4686,
          longitude: 39.6142,
        },
        ...additionalData,
      };

      await setDoc(userRef, profileData);
      setUserProfile(profileData);
      return profileData;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  async function signUp(email, password, name) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(result.user, {
        displayName: name,
      });

      await createUserProfile(result.user, { displayName: name });
      // Initialize FCM
      await initFCM(result.user.uid);
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  }

  async function signIn(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Initialize FCM
      await initFCM(result.user.uid);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Initialize FCM
      await initFCM(result.user.uid);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  async function signOut() {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update fields di Firestore user profile + sync ke local state.
   * Dipakai untuk simpan data onboarding (interests, learningStyle, dll)
   * juga untuk update XP/streak setelah selesai lesson.
   */
  async function updateUserProfile(updates) {
    if (!user) return { success: false, error: 'Not logged in' };
    try {
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(
        userRef,
        { ...updates, lastActivity: serverTimestamp() },
        { merge: true }
      );
      setUserProfile((prev) => ({ ...(prev || {}), ...updates }));
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Simpan progress 1 level challenge ke Firestore.
   * Strukturnya nested: challengeProgress.{scenarioId}.{level} = { bestScore, attempts, perfectAchieved, xpEarned }
   * Best score TIDAK ditimpa kalau attempt baru lebih rendah — supaya GOLD ga hilang.
   */
  async function saveChallengeProgress({ scenarioId, level, score, totalQuestions, xpEarned }) {
    if (!user) return { success: false, error: 'Not logged in' };
    try {
      const existing = userProfile?.challengeProgress?.[scenarioId]?.[level] || {
        bestScore: 0,
        attempts: 0,
        perfectAchieved: false,
        xpEarned: 0,
      };

      // Update kalau score baru lebih bagus, atau attempts saja kalau lebih rendah
      const newBest = Math.max(existing.bestScore, score);
      const newPerfect = existing.perfectAchieved || score === totalQuestions;
      const newXp = Math.max(existing.xpEarned || 0, xpEarned);

      const progressUpdate = {
        challengeProgress: {
          ...(userProfile?.challengeProgress || {}),
          [scenarioId]: {
            ...(userProfile?.challengeProgress?.[scenarioId] || {}),
            [level]: {
              bestScore: newBest,
              totalQuestions,
              attempts: existing.attempts + 1,
              perfectAchieved: newPerfect,
              xpEarned: newXp,
              lastPlayedAt: new Date().toISOString(),
            },
          },
        },
      };

      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, { ...progressUpdate, lastActivity: serverTimestamp() }, { merge: true });
      setUserProfile((prev) => ({ ...(prev || {}), ...progressUpdate }));
      return { success: true };
    } catch (error) {
      console.error('Save challenge progress error:', error);
      return { success: false, error: error.message };
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateUserProfile,
    saveChallengeProgress,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
