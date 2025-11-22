"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from './SessionContext'; // Import useSession
import { toast } from 'sonner';

export type UserRole = 'admin' | 'user' | null;

// Define a more comprehensive User type based on Supabase auth.users and public.profiles
export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role: UserRole;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isLoadingAuth: boolean; // Loading state specific to AuthContext's profile fetching
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: supabaseUser, isLoading: isLoadingSession } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoadingAuth(true);
      if (supabaseUser) {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url, role')
          .eq('id', supabaseUser.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine for new users
          console.error('Error fetching user profile:', error);
          toast.error('Failed to load user profile.');
          setUserProfile({
            id: supabaseUser.id,
            email: supabaseUser.email || 'N/A',
            role: 'user', // Default to user role if profile not found or error
          });
          setRole('user');
        } else if (data) {
          setUserProfile({
            id: supabaseUser.id,
            email: supabaseUser.email || 'N/A',
            first_name: data.first_name || undefined,
            last_name: data.last_name || undefined,
            avatar_url: data.avatar_url || undefined,
            role: data.role as UserRole,
          });
          setRole(data.role as UserRole);
        } else {
          // If no profile found, it might be a new user. Default to 'user' role.
          setUserProfile({
            id: supabaseUser.id,
            email: supabaseUser.email || 'N/A',
            role: 'user',
          });
          setRole('user');
        }
      } else {
        setUserProfile(null);
        setRole(null);
      }
      setIsLoadingAuth(false);
    };

    if (!isLoadingSession) {
      fetchUserProfile();
    }
  }, [supabaseUser, isLoadingSession]);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to log out: ' + error.message);
    } else {
      // SessionContext will handle the state update and toast message
    }
  };

  return (
    <AuthContext.Provider value={{ user: userProfile, role, isLoadingAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};