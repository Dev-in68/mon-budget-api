import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/utils/auth";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const loc = useLocation() as { state?: { from?: string } };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      nav(loc.state?.from || "/", { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Échec de connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-950">
      <form
        onSubmit={onSubmit}
        className="w-[92%] max-w-sm rounded-2xl bg-white/5 p-6 text-white ring-1 ring-white/10 backdrop-blur-2xl"
      >
        <h1 className="mb-4 text-xl font-semibold">Connexion</h1>

        {err && (
          <div className="mb-3 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200 ring-1 ring-red-500/30">
            {err}
          </div>
        )}

        <label className="text-sm opacity-80">Adresse e-mail</label>
        <input
          className="mt-1 w-full rounded-xl border-0 bg-white px-3 py-2 text-sm text-zinc-900 ring-1 ring-zinc-200 focus:ring-2 focus:ring-cyan-500"
          type="email"
          placeholder="vous@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />

        <label className="mt-4 block text-sm opacity-80">Mot de passe</label>
        <input
          className="mt-1 w-full rounded-xl border-0 bg-white px-3 py-2 text-sm text-zinc-900 ring-1 ring-zinc-200 focus:ring-2 focus:ring-cyan-500"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <Button
          type="submit"
          className="mt-4 w-full"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
