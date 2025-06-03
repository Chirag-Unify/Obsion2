import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState<Theme>(
    (user?.settings?.theme as Theme) || 'system'
  );
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Update theme when user settings change
    if (user?.settings?.theme) {
      setTheme(user.settings.theme as Theme);
    }
  }, [user?.settings?.theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const systemDark = mediaQuery.matches;
      const shouldBeDark = theme === 'dark' || (theme === 'system' && systemDark);
      
      setIsDark(shouldBeDark);
      root.classList.toggle('dark', shouldBeDark);
      
      // Update CSS variables for primary color
      root.style.setProperty('--primary-50', shouldBeDark ? '#f0f9ff' : '#eff6ff');
      root.style.setProperty('--primary-100', shouldBeDark ? '#e0f2fe' : '#dbeafe');
      root.style.setProperty('--primary-200', shouldBeDark ? '#bae6fd' : '#bfdbfe');
      root.style.setProperty('--primary-300', shouldBeDark ? '#7dd3fc' : '#93c5fd');
      root.style.setProperty('--primary-400', shouldBeDark ? '#38bdf8' : '#60a5fa');
      root.style.setProperty('--primary-500', shouldBeDark ? '#0ea5e9' : '#3b82f6');
      root.style.setProperty('--primary-600', shouldBeDark ? '#0284c7' : '#2563eb');
      root.style.setProperty('--primary-700', shouldBeDark ? '#0369a1' : '#1d4ed8');
      root.style.setProperty('--primary-800', shouldBeDark ? '#075985' : '#1e40af');
      root.style.setProperty('--primary-900', shouldBeDark ? '#0c4a6e' : '#1e3a8a');
    };

    applyTheme();
    mediaQuery.addEventListener('change', applyTheme);

    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 