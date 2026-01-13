'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, signOut as strapiSignOut } from '@/lib/strapi/auth';

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Profile {
  id: string;
}

interface AuthContextType {
  user: any | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('strapi_jwt') : null;

    if (token) {
      try {
        const userData = await getCurrentUser(token);
        if (userData) {
          setUser(userData);
          setProfile(userData);
        } else {
          localStorage.removeItem('strapi_jwt');
        }
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const refreshUser = async () => {
    await checkAuth();
  };

  const handleSignOut = async () => {
    await strapiSignOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('strapi_jwt');
    }
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut: handleSignOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

