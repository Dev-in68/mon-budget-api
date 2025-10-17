import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

type Props = {
  anchorRef: React.RefObject<HTMLElement>; // <- bouton d’ancrage
  open: boolean;
  onClose: () => void;
  email: string;
  onSignOut: () => void;
  onChangePassword?: () => void;
};

export function UserMenu({
  anchorRef,
  open,
  onClose,
  email,
  onSignOut,
  onChangePassword,
}: Props) {
  // calcule la position par rapport au bouton
  const pos = useMemo(() => {
    const el = anchorRef.current;
    if (!el) return { top: 0, left: 0, width: 0, height: 0 };
    const r = el.getBoundingClientRect();
    return {
      top: r.bottom + 8,
      left: r.left,
      width: r.width,
      height: r.height,
    };
  }, [anchorRef, open]);

  // clic en dehors => onClose
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      const a = anchorRef.current;
      const m = document.getElementById("user-menu");
      if (!a || !m) return;
      if (!a.contains(e.target as Node) && !m.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, [open, anchorRef, onClose]);

  if (!open) return null;

  // rendu dans le body pour passer au-dessus de la nav (z-index très élevé)
  return createPortal(
    <div
      id="user-menu"
      className="absolute z-[100001] rounded-2xl bg-slate-900/95 text-slate-100 shadow-2xl ring-1 ring-cyan-400/40 backdrop-blur"
      style={{ top: pos.top, left: pos.left }}
      role="menu"
    >
      <div className="px-4 pt-3 text-[11px] text-cyan-300/80">{email}</div>

      {onChangePassword && (
        <button
          onClick={() => {
            onClose();
            onChangePassword();
          }}
          className="block w-full rounded-xl px-4 py-2 text-left text-[13px] hover:bg-slate-800/80"
        >
          Modifier le mot de passe
        </button>
      )}

      <button
        onClick={() => {
          onClose();
          onSignOut();
        }}
        className="block w-full rounded-xl px-4 py-2 text-left text-[13px] text-red-300 hover:bg-red-500/10"
      >
        Se déconnecter
      </button>
    </div>,
    document.body,
  );
}

export default UserMenu;
