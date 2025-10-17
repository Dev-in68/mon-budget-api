import { NavLink, Outlet } from "react-router-dom";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import UserMenu from "@/components/Budget/UserMenu";
export default function AppShell({
  month,
  year,
  setMonth,
  setYear,
}: {
  month: number;
  year: number;
  setMonth: (m: number) => void;
  setYear: (y: number) => void;
}) {
  const today = new Date();

  return (
    <div className="min-h-screen relative app-holo app-noise">
      {/* HEADER */}
      <header className="sticky top-0 z-40">
        <div className="mx-auto md:max-w-3xl lg:max-w-6xl px-4 py-3">
          <div className="glass glass-hover flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-3">
              <span
                className="i-tabler-hexagon-letter-b h-6 w-6 text-cyan-300"
                aria-hidden
              />
              <span className="text-sm md:text-base font-semibold tracking-wide text-white">
                Mon&nbsp;Budget
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-zinc-200">
                BETA
              </span>
            </div>

            {/* desktop controls */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeSwitch className="h-9" />
              <select
                className="rounded-xl bg-white/10 px-2 py-1 text-zinc-100 ring-1 ring-white/15 focus:ring-2 focus:ring-cyan-400"
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
              <select
                className="rounded-xl bg-white/10 px-2 py-1 text-zinc-100 ring-1 ring-white/15 focus:ring-2 focus:ring-cyan-400"
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
            </div>
          </div>
        </div>

        {/* TABS */}
        <nav className="mx-auto md:max-w-3xl lg:max-w-6xl px-4 pb-3">
          <div className="glass flex gap-2 p-1">
            {[
              { to: "/", label: "Tableau de bord" },
              { to: "/revenus", label: "Revenus" },
              { to: "/depenses", label: "Dépenses" },
            ].map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                className={({ isActive }) =>
                  [
                    "rounded-lg px-3 py-1.5 text-sm text-zinc-200 ring-1 ring-white/10",
                    isActive ? "bg-white/15" : "hover:bg-white/10",
                  ].join(" ")
                }
              >
                {t.label}
              </NavLink>
            ))}
            <div className="ml-auto md:hidden"></div>
          </div>
        </nav>

        {/* mobile selects */}
        <div className="mx-auto md:max-w-3xl lg:max-w-6xl px-4 pb-3 md:hidden">
          <div className="grid grid-cols-3 gap-2">
            <select
              className="col-span-1 rounded-xl bg-white/10 px-2 py-2 text-zinc-100 ring-1 ring-white/15 focus:ring-2 focus:ring-cyan-400"
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
              className="col-span-2 rounded-xl bg-white/10 px-2 py-2 text-zinc-100 ring-1 ring-white/15 focus:ring-2 focus:ring-cyan-400"
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
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="relative z-10 mx-auto max-w-md space-y-4 px-4 py-5 md:max-w-3xl lg:max-w-6xl">
        <Outlet context={{ month, year, setMonth, setYear }} />
      </main>
    </div>
  );
}
