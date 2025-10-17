import { createContext, useState, useMemo, useEffect, useContext } from "react";
import {
  getJson,
  postJson,
  saveTokens,
  loadTokens,
  clearTokens, // <-- maintenant disponible
} from "@/lib/api";

type User = { email: string } | null;

const AuthCtx = createContext<{
  user: User;
  login: (email: string) => Promise<void>;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  // Exemple: au mount, si des tokens existent on tente un /auth/me
  useEffect(() => {
    const tokens = loadTokens();
    if (!tokens) return;
    getJson<{ email: string }>("/auth/me", { token: tokens.accessToken })
      .then((u) => setUser({ email: u.email }))
      .catch(() => clearTokens());
  }, []);

  const login = async (email: string) => {
    // adaptes à ton backend
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

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
