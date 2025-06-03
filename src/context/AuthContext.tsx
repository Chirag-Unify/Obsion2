import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../services/localStorage';
import { getCurrentUser, login as loginStorage, register as registerStorage, logout as logoutStorage } from '../services/localStorage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUserSettings: (settings: Partial<User['settings']>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const user = loginStorage(email, password);
      setUser(user);
    } catch (error: any) {
      setError(error.message || 'Error logging in');
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const user = registerStorage(email, password, name);
      setUser(user);
    } catch (error: any) {
      setError(error.message || 'Error registering');
      throw error;
    }
  };

  const logout = () => {
    logoutStorage();
    setUser(null);
  };

  const updateUserSettings = async (settings: Partial<User['settings']>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedUser = {
        ...user,
        settings: {
          ...user.settings,
          ...settings,
        },
      };
      
      localStorage.setItem('obsion_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error: any) {
      setError(error.message || 'Error updating settings');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUserSettings,
      }}
    >
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