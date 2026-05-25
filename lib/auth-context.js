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

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
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
