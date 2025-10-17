import { useState } from "react";
import { useAuth } from "@/utils/auth";

export default function ChangePasswordPage() {
  const { changePassword } = useAuth();
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setOk(null);
    try {
      setBusy(true);
      await changePassword(oldPwd, newPwd);
      setOk("Mot de passe modifié.");
      setOldPwd("");
      setNewPwd("");
    } catch (e: any) {
      setErr(e?.message || "Erreur");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl bg-white/80 p-5 shadow ring-1 ring-black/5 backdrop-blur dark:bg-slate-900/60 dark:ring-white/10">
        <h1 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
          Modifier le mot de passe
        </h1>

        {ok && (
          <p className="mt-3 rounded-xl bg-emerald-50 p-2 text-sm text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">
            {ok}
          </p>
        )}
        {err && (
          <p className="mt-3 rounded-xl bg-red-50 p-2 text-sm text-red-600 ring-1 ring-red-100 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20">
            {err}
          </p>
        )}

        <form onSubmit={submit} className="mt-3 space-y-3">
          <div>
            <label className="block text-xs text-zinc-600 dark:text-zinc-400">
              Ancien mot de passe
            </label>
            <input
              type="password"
              value={oldPwd}
              onChange={(e) => setOldPwd(e.target.value)}
              className="mt-1 w-full rounded-xl border-0 bg-white px-3 py-2 text-sm ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-zinc-100 dark:ring-white/10"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-600 dark:text-zinc-400">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="mt-1 w-full rounded-xl border-0 bg-white px-3 py-2 text-sm ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-zinc-100 dark:ring-white/10"
              required
            />
          </div>
          <button
            className="w-full rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white ring-1 ring-blue-600 hover:bg-blue-700 disabled:opacity-50"
            disabled={busy}
          >
            {busy ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
