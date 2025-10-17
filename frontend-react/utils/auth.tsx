import React, { createContext, useState, useMemo, useEffect, useContext } from "react";
import { getJson, postJson, saveTokens, loadTokens, clearTokens } from "@/lib/api";

type User = { 
  id: number;
  email: string; 
  name: string;
} | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthCtx = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const tokens = loadTokens();
      if (!tokens) {
        setLoading(false);
        return;
      }
      
      try {
        const userData = await getJson<{ id: number; email: string; name: string }>("/users/me");
        setUser(userData);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'auth:", error);
        clearTokens();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const response = await postJson<{ access: string }>("/auth/login", { email, password });
      
      saveTokens({ 
        accessToken: response.access, 
        refreshToken: response.access
      });
      
      setUser({ id: 1, email, name: email.split("@")[0] });
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw new Error("Email ou mot de passe incorrect");
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    try {
      const response = await postJson<{ access: string }>("/auth/register", { email, password, name });
      
      saveTokens({ 
        accessToken: response.access, 
        refreshToken: response.access
      });
      
      setUser({ id: 1, email, name });
    } catch (error) {
      console.error("Erreur d inscription:", error);
      throw new Error("Erreur lors de l inscription");
    }
  };

  const signOut = (): void => {
    clearTokens();
    setUser(null);
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      await postJson("/auth/change-password", { oldPassword, newPassword });
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      throw new Error("Erreur lors du changement de mot de passe");
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    signIn,
    signOut,
    signup,
    changePassword,
  }), [user, loading]);

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

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
