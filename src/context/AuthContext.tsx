"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from './SessionContext';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation

export type UserRole = 'admin' | 'user' | null;

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role: UserRole;
  address?: string; // New field
  city?: string;    // New field
  zip_code?: string; // New field
  country?: string; // New field
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isLoadingAuth: boolean;
  logout: () => Promise<void>;
  refetchUserProfile: () => void; // New function to refetch profile
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: supabaseUser, isLoading: isLoadingSession } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserProfile = useCallback(async () => {
    setIsLoadingAuth(true);
    if (supabaseUser) {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, role, address, city, zip_code, country') // Select new fields
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        // Display the specific error message from Supabase
        toast.error(`Failed to load user profile: ${error.message}`);
        setUserProfile({
          id: supabaseUser.id,
          email: supabaseUser.email || 'N/A',
          role: 'user',
        });
        setRole('user');
      } else if (data) {
        const profileData: UserProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email || 'N/A',
          first_name: data.first_name || undefined,
          last_name: data.last_name || undefined,
          avatar_url: data.avatar_url || undefined,
          role: data.role as UserRole,
          address: data.address || undefined,
          city: data.city || undefined,
          zip_code: data.zip_code || undefined,
          country: data.country || undefined,
        };
        setUserProfile(profileData);
        setRole(data.role as UserRole);

        // Redirect if address is incomplete and not already on the address page or login/register
        const isAddressIncomplete = !profileData.address || !profileData.city || !profileData.zip_code || !profileData.country;
        const isOnAddressPage = location.pathname === '/my-account/address';
        const isOnAuthPage = location.pathname === '/login' || location.pathname === '/register';

        if (isAddressIncomplete && !isOnAddressPage && !isOnAuthPage) {
          toast.info("Please complete your address details to proceed.");
          navigate('/my-account/address');
        }

      } else {
        // If no profile found (PGRST116 error or data is null), it might be a new user. Default to 'user' role.
        const newProfile: UserProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email || 'N/A',
          role: 'user',
        };
        setUserProfile(newProfile);
        setRole('user');

        // For new users, redirect to address page
        const isOnAddressPage = location.pathname === '/my-account/address';
        const isOnAuthPage = location.pathname === '/login' || location.pathname === '/register';
        if (!isOnAddressPage && !isOnAuthPage) {
          toast.info("Welcome! Please complete your address details.");
          navigate('/my-account/address');
        }
      }
    } else {
      setUserProfile(null);
      setRole(null);
    }
    setIsLoadingAuth(false);
  }, [supabaseUser, navigate, location.pathname]);

  useEffect(() => {
    if (!isLoadingSession) {
      fetchUserProfile();
    }
  }, [supabaseUser, isLoadingSession, fetchUserProfile]);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to log out: ' + error.message);
    } else {
      // SessionContext will handle the state update and toast message
    }
  };

  return (
    <AuthContext.Provider value={{ user: userProfile, role, isLoadingAuth, logout, refetchUserProfile: fetchUserProfile }}>
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