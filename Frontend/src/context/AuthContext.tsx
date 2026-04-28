import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { loginUser, registerUser } from '../api/auth';
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../auth/storage';
import type { AuthUser, LoginPayload, RegisterPayload } from '../types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = getStoredAuth();
  const [token, setToken] = useState<string | null>(stored?.token ?? null);
  const [user, setUser] = useState<AuthUser | null>(stored?.user ?? null);

  const login = async (payload: LoginPayload) => {
    const response = await loginUser(payload);
    setStoredAuth(response.access_token, response.user);
    setToken(response.access_token);
    setUser(response.user);
  };

  const register = async (payload: RegisterPayload) => {
    const response = await registerUser(payload);
    setStoredAuth(response.access_token, response.user);
    setToken(response.access_token);
    setUser(response.user);
  };

  const logout = () => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
