'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, signOut as strapiSignOut } from '@/lib/strapi/auth';

// Define a generic User type for Strapi
export interface User {
  id: string; // Strapi IDs are numbers usually, but keeping string for compat or casting
  email: string;
  username: string;
  full_name?: string; // Custom field dependent on Strapi
  // Add other attributes as per your Strapi User Content Type
}

export interface Profile {
  id: string;
  // Add other profile fields
}

interface AuthContextType {
  user: any | null; // Using any for flexibility during migration
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage/Cookie on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Assuming you store the JWT in localStorage during sign-in
      // The logic for handling the JWT needs to be added to the signIn function in strapi/auth.ts

      // For now, checks if we have a token (mock check)
      // In a real Strapi app: localStorage.getItem('jwt')
      const token = typeof window !== 'undefined' ? localStorage.getItem('strapi_jwt') : null;

      if (token) {
        try {
          const userData = await getCurrentUser(token);
          if (userData) {
            setUser(userData);
            // Fetch additional profile if needed, or if it's included in userData
            setProfile(userData);
          } else {
            localStorage.removeItem('strapi_jwt'); // Invalid token
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleSignOut = async () => {
    await strapiSignOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('strapi_jwt');
    }
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut: handleSignOut }}>
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

