import type { PropsWithChildren } from "react";

export function Card({
  className = "",
  children,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={`glass ${className}`}>{children}</div>;
}

export function CardTitle({ children }: PropsWithChildren) {
  return <h3 className="text-sm font-semibold text-zinc-100">{children}</h3>;
}
