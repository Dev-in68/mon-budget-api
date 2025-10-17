import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  anchorRef: React.RefObject<HTMLElement>;
  open: boolean;
  onClose: () => void;
  items: Array<{
    label: string;
    onClick?: () => void;
    variant?: "danger" | "default";
    disabled?: boolean;
  }>;
};

export default function BurgerMenu({ anchorRef, open, onClose, items }: Props) {
  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 240,
  });
  const root = document.body;
  const panelRef = useRef<HTMLDivElement>(null);

  // calcule la position depuis l’ancre
  useLayoutEffect(() => {
    if (!open) return;
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = 260;
    const left = Math.max(12, r.right - width);
    const top = r.bottom + 8;
    setPos({ top, left, width });
  }, [open, anchorRef]);

  // clic extérieur / échap
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const p = panelRef.current;
      if (!p) return;
      if (
        !p.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      )
        onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={panelRef}
      // z giga-élevé pour passer AU-DESSUS de ta nav sticky
      className="fixed z-[100000] rounded-2xl bg-slate-900/95 text-slate-100 ring-1 ring-cyan-400/40 backdrop-blur shadow-2xl"
      style={{ top: pos.top, left: pos.left, width: pos.width }}
      role="menu"
    >
      <div className="px-4 py-2 text-[11px] uppercase tracking-wide text-cyan-300/70">
        Menu
      </div>
      <div className="divide-y divide-white/10">
        {items.map((it, i) => (
          <button
            key={i}
            disabled={it.disabled}
            onClick={() => {
              it.onClick?.();
              onClose();
            }}
            className={[
              "w-full text-left px-4 py-3 text-[13px]",
              it.variant === "danger"
                ? "text-red-300 hover:bg-red-500/10"
                : "hover:bg-white/5",
              it.disabled ? "opacity-60 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>,
    root,
  );
}
