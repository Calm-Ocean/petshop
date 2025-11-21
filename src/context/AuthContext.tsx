"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { findUserByCredentials, User as MockUserType } from '@/data/mockUsers'; // Import from mockUsers

export type UserRole = 'admin' | 'user' | null;

// Re-export User type from mockUsers.ts to avoid duplication
export type User = MockUserType;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    // In a real app, you'd check for a token in localStorage or a session
    // For now, we'll keep it simple and assume no persistent login
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = findUserByCredentials(username, password);
    if (foundUser) {
      setUser(foundUser);
      setRole(foundUser.role);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
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