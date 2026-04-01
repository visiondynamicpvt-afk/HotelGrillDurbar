import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

export interface AppAuthUser {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
}

interface AuthContextType {
  user: AppAuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const mapUser = (rawUser: { id: string; email: string; name?: string; phone?: string }): AppAuthUser => ({
    uid: rawUser.id,
    email: rawUser.email,
    displayName: rawUser.name,
    phone: rawUser.phone,
  });

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const me = await api.getCurrentUser();
        const mapped = mapUser(me);
        setUser(mapped);
        localStorage.setItem('authUser', JSON.stringify(mapped));
      } catch {
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
      setLoading(false);
    };

    bootstrapAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await api.loginUser(email, password);
    const mapped = mapUser(result.user);
    localStorage.setItem('authToken', result.token);
    localStorage.setItem('authUser', JSON.stringify(mapped));
    setUser(mapped);
  };

  const signup = async (email: string, password: string) => {
    const result = await api.signupUser(email, password);
    const mapped = mapUser(result.user);
    localStorage.setItem('authToken', result.token);
    localStorage.setItem('authUser', JSON.stringify(mapped));
    setUser(mapped);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
