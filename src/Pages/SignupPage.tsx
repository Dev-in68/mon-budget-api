import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/utils/auth";

export default function SignupPage() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      setBusy(true);
      await signup(email.trim(), password, email.split('@')[0]);
      nav("/", { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Erreur à l’inscription");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0ea5e9] via-[#2563eb] to-[#0b3ea8] dark:from-[#0b1220] dark:via-[#0c1a33] dark:to-[#0b1220] flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-white/80 p-5 shadow ring-1 ring-black/5 backdrop-blur dark:bg-slate-900/60 dark:ring-white/10"
      >
        <h1 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
          Inscription
        </h1>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Déjà un compte ?{" "}
          <Link to="/login" className="underline">
            Connexion
          </Link>
        </p>

        {err && (
          <p className="mt-3 rounded-xl bg-red-50 p-2 text-sm text-red-600 ring-1 ring-red-100 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20">
            {err}
          </p>
        )}

        <label className="mt-4 block text-xs text-zinc-600 dark:text-zinc-400">
          Email
        </label>
        <input
          className="mt-1 w-full rounded-xl border-0 bg-white px-3 py-2 text-sm ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-zinc-100 dark:ring-white/10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <label className="mt-3 block text-xs text-zinc-600 dark:text-zinc-400">
          Mot de passe
        </label>
        <input
          className="mt-1 w-full rounded-xl border-0 bg-white px-3 py-2 text-sm ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-zinc-100 dark:ring-white/10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />

        <button
          className="mt-4 w-full rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white ring-1 ring-blue-600 hover:bg-blue-700 disabled:opacity-50"
          disabled={busy}
        >
          {busy ? "Création…" : "Créer mon compte"}
        </button>
      </form>
    </div>
  );
}
