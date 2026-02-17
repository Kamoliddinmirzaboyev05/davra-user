'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  userId: string | null;
  phoneNumber: string | null;
  isLoading: boolean;
  login: (phoneNumber: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing auth data
    const storedUserId = localStorage.getItem('userId');
    const storedPhone = localStorage.getItem('phoneNumber');
    
    if (storedUserId) {
      setUserId(storedUserId);
      setPhoneNumber(storedPhone);
    }
    
    setIsLoading(false);
  }, []);

  const login = (phone: string) => {
    localStorage.setItem('phoneNumber', phone);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('phoneNumber');
    setUserId(null);
    setPhoneNumber(null);
  };

  return (
    <AuthContext.Provider value={{ userId, phoneNumber, isLoading, login, logout }}>
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
