import React, { createContext, useState, useMemo, useEffect, useContext } from "react";
import {
  getJson,
  postJson,
  saveTokens,
  loadTokens,
  clearTokens,
} from "@/lib/api";

type User = { email: string } | null;

const AuthCtx = createContext<{
  user: User;
  login: (email: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  loading: boolean;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokens = loadTokens();
    if (!tokens) {
      setLoading(false);
      return;
    }
    getJson<{ email: string }>("/auth/me", { token: tokens.accessToken })
      .then((u) => {
        setUser({ email: u.email });
        setLoading(false);
      })
      .catch(() => {
        clearTokens();
        setLoading(false);
      });
  }, []);

  const login = async (email: string) => {
    const tokens = await postJson<{
      accessToken: string;
      refreshToken: string;
    }>("/auth/login", { email });
    saveTokens(tokens);
    const me = await getJson<{ email: string }>("/auth/me", {
      token: tokens.accessToken,
    });
    setUser({ email: me.email });
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const tokens = await postJson<{
        accessToken: string;
        refreshToken: string;
      }>("/auth/login", { email, password });
      saveTokens(tokens);
      const me = await getJson<{ email: string }>("/auth/me", {
        token: tokens.accessToken,
      });
      setUser({ email: me.email });
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
    try {
      await postJson("/auth/register", { email, password });
      await signIn(email, password);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    const tokens = loadTokens();
    if (!tokens) throw new Error("Not authenticated");
    
    await postJson("/auth/change-password", { 
      oldPassword, 
      newPassword 
    }, { token: tokens.accessToken });
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const signOut = logout;

  const value = useMemo(() => ({ 
    user, 
    login, 
    signIn, 
    signOut, 
    logout, 
    signup, 
    changePassword, 
    loading 
  }), [user, loading]);
  
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return <>{children}</>;
}
