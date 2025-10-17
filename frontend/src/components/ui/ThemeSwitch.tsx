import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/utils/useTheme";

type ThemeName = "system" | "light" | "dark";

const LABELS: Record<ThemeName, string> = {
  system: "Système",
  light: "Clair",
  dark: "Sombre",
};

export function ThemeSwitch({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme(); // suppose de type ThemeName

  const cycle = React.useCallback(() => {
    setTheme(
      theme === "system" ? "dark" : theme === "dark" ? "light" : "system",
    );
  }, [theme, setTheme]);

  const Icon = theme === "system" ? Monitor : theme === "dark" ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={cycle}
      onKeyDown={(e) => {
        // support clavier: Entrée / Espace
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          cycle();
        }
      }}
      className={`inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${className}`}
      aria-label={`Thème: ${LABELS[theme as ThemeName]}`}
      title={`Thème: ${LABELS[theme as ThemeName]}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">
        Thème: {LABELS[theme as ThemeName]}
      </span>
      {/* annonce polie pour lecteurs d'écran quand le thème change */}
      <span className="sr-only" aria-live="polite">
        {LABELS[theme as ThemeName]}
      </span>
    </button>
  );
}
