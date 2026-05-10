import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiRequest } from '../api/client';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from SecureStore
    const restore = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('traveloop_token');
        const storedUser = await SecureStore.getItemAsync('traveloop_user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (_) {}
      setIsLoading(false);
    };
    restore();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await apiRequest('/auth/login', 'POST', { email, password });
      if (res.success && res.data) {
        const { accessToken, user: userData } = res.data as any;
        await SecureStore.setItemAsync('traveloop_token', accessToken);
        await SecureStore.setItemAsync('traveloop_user', JSON.stringify(userData));
        setToken(accessToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: (res as any).message || 'Invalid credentials' };
    } catch (e: any) {
      return { success: false, error: 'Network error. Check backend is running.' };
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const res = await apiRequest('/auth/signup', 'POST', { email, password, firstName, lastName });
      if (res.success && res.data) {
        const { accessToken, user: userData } = res.data as any;
        await SecureStore.setItemAsync('traveloop_token', accessToken);
        await SecureStore.setItemAsync('traveloop_user', JSON.stringify(userData));
        setToken(accessToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: (res as any).message || 'Signup failed' };
    } catch (e: any) {
      return { success: false, error: 'Network error. Check backend is running.' };
    }
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync('traveloop_token');
    await SecureStore.deleteItemAsync('traveloop_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
