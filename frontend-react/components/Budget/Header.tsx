import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/utils/auth";

const today = new Date();

type Props = {
  month: number;
  year: number;
  setMonth: (m: number) => void;
  setYear: (y: number) => void;
};

export function Header({ month, year, setMonth, setYear }: Props) {
  const { user, signOut } = useAuth();
  const nav = useNavigate();

  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Fermer le menu au clic extérieur / escape
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (menuRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const goLogin = () => nav("/login");
  const goPassword = () => {
    setOpen(false);
    nav("/account/password");
  };
  const doSignOut = () => {
    setOpen(false);
    signOut();
    nav("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/10 backdrop-blur-xl dark:border-white/5 dark:bg-white/5">
      <div className="mx-auto max-w-md md:max-w-3xl lg:max-w-6xl px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="i-tabler-pig-money h-6 w-6" aria-hidden />
            <h1 className="text-lg md:text-xl font-semibold tracking-tight">
              Mon Budget
            </h1>
            <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
              BETA
            </span>
          </div>

          {/* Desktop toolbar */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeSwitch className="h-9" />

            {/* Mois */}
            <select
              className="rounded-xl border-0 bg-white/20 px-2 py-1 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-white/40"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option className="text-zinc-900" key={i} value={i}>
                  {new Date(2000, i, 1).toLocaleDateString("fr-FR", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>

            {/* Année */}
            <select
              className="rounded-xl border-0 bg-white/20 px-2 py-1 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-white/40"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {Array.from({ length: 7 }).map((_, idx) => {
                const y = today.getFullYear() - 3 + idx;
                return (
                  <option className="text-zinc-900" key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>

            {/* Connexion / Menu utilisateur */}
            {!user ? (
              <Button onClick={goLogin} className="h-9">
                Se connecter
              </Button>
            ) : (
              <div className="relative">
                <Button
                  ref={btnRef}
                  variant="soft"
                  className="h-9"
                  onClick={() => setOpen((v) => !v)}
                >
                  {user.email}
                </Button>

                {open && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/95 text-slate-100 shadow-2xl ring-1 ring-cyan-400/30 backdrop-blur-xl z-[100000]"
                  >
                    <div className="px-4 pt-3 text-[11px] text-cyan-300/80 truncate">
                      {user.email}
                    </div>
                    <button
                      onClick={goPassword}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-white/5"
                    >
                      Changer le mot de passe
                    </button>
                    <button
                      onClick={doSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-white/5"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile pills */}
        <div className="mt-3 grid grid-cols-3 gap-2 md:hidden">
          <select
            className="col-span-1 rounded-xl border-0 bg-white/20 px-2 py-2 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-white/40"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {Array.from({ length: 7 }).map((_, idx) => {
              const y = today.getFullYear() - 3 + idx;
              return (
                <option className="text-zinc-900" key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>

          <select
            className="col-span-1 rounded-xl border-0 bg-white/20 px-2 py-2 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-white/40"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option className="text-zinc-900" key={i} value={i}>
                {new Date(2000, i, 1).toLocaleDateString("fr-FR", {
                  month: "long",
                })}
              </option>
            ))}
          </select>

          {/* Bouton login en mobile si pas connecté */}
          {!user ? (
            <Button onClick={goLogin} className="h-10">
              Connexion
            </Button>
          ) : (
            <Button onClick={() => setOpen((v) => !v)} className="h-10">
              {user.email.split("@")[0]}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
