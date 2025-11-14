"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'teacher' | 'student' | null;

interface User {
  id: string;
  username: string;
  password: string; // In a real app, never store plain passwords
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  { id: 'admin1', username: 'admin', password: 'password', role: 'admin', name: 'Admin User' },
  { id: 'teacher1', username: 'teacher', password: 'password', role: 'teacher', name: 'Teacher Jane' },
  { id: 'student1', username: 'student', password: 'password', role: 'student', name: 'Student John' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    // In a real app, you'd check for a token in localStorage or a session
    // For now, we'll keep it simple and assume no persistent login
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = mockUsers.find(
      (u) => u.username === username && u.password === password
    );
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