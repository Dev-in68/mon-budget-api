import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/utils/auth";

export default function PasswordPage() {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(false);
    if (newPassword !== confirm) {
      setErr("La confirmation ne correspond pas.");
      return;
    }
    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setOk(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (e: any) {
      setErr(e?.message || "Échec du changement de mot de passe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-950 text-white">
      <form
        onSubmit={onSubmit}
        className="w-[92%] max-w-md rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-2xl"
      >
        <h1 className="mb-4 text-xl font-semibold">Changer le mot de passe</h1>

        {err && (
          <div className="mb-3 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200 ring-1 ring-red-500/30">
            {err}
          </div>
        )}
        {ok && (
          <div className="mb-3 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-200 ring-1 ring-emerald-500/30">
            Mot de passe mis à jour.
          </div>
        )}

        <label className="text-sm opacity-80">Mot de passe actuel</label>
        <input
          type="password"
          className="mt-1 w-full rounded-xl border-0 bg-white px-3 py-2 text-sm text-zinc-900 ring-1 ring-zinc-200 focus:ring-2 focus:ring-cyan-500"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <label className="mt-4 block text-sm opacity-80">
          Nouveau mot de passe
        </label>
        <input
          type="password"
          className="mt-1 w-full rounded-xl border-0 bg-white px-3 py-2 text-sm text-zinc-900 ring-1 ring-zinc-200 focus:ring-2 focus:ring-cyan-500"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <label className="mt-4 block text-sm opacity-80">
          Confirmer le nouveau mot de passe
        </label>
        <input
          type="password"
          className="mt-1 w-full rounded-xl border-0 bg-white px-3 py-2 text-sm text-zinc-900 ring-1 ring-zinc-200 focus:ring-2 focus:ring-cyan-500"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          required
        />

        <div className="mt-4 flex gap-2">
          <Button type="submit" disabled={loading} aria-busy={loading}>
            {loading ? "Enregistrement…" : "Enregistrer"}
          </Button>
          <Button type="button" variant="soft" onClick={() => nav("/")}>
            Retour
          </Button>
        </div>
      </form>
    </div>
  );
}
