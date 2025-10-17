import type { ReactNode } from "react";

type Intent = "default" | "danger" | "muted";

type Props = {
  children: ReactNode;
  intent?: Intent;
  className?: string;
  title?: string;
};

export function Badge({
  children,
  intent = "default",
  className = "",
  title,
}: Props) {
  const intents: Record<Intent, string> = {
    default: "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900",
    danger: "bg-red-600 text-white dark:bg-red-500 dark:text-white",
    muted: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
  };

  return (
    <span
      title={title}
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5",
        "text-xs font-medium leading-5 tracking-wide",
        intents[intent],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
