// components/ui/AccountMenu.tsx
import { createPortal } from "react-dom";
import { useLayoutEffect, useState, type RefObject } from "react";

type Props = {
  anchorRef: RefObject<HTMLElement>;
  open: boolean;
  email: string;
  onClose: () => void;
  onSignOut: () => void;
  onChangePassword?: () => void;
};

export function AccountMenu({
  anchorRef,
  open,
  email,
  onClose,
  onSignOut,
  onChangePassword,
}: Props) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  useLayoutEffect(() => {
    if (!open) return;
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      top: r.bottom + 8 + window.scrollY,
      left: r.left + window.scrollX,
      width: r.width,
    });
  }, [open, anchorRef]);

  if (!open) return null;

  return createPortal(
    <>
      {/* Overlay click to close – also above the header */}
      <div className="fixed inset-0 z-[100000]" onClick={onClose} />
      {/* The menu itself */}
      <div className="fixed inset-0 z-[100000]" onClick={onClose} />{" "}
      {/* overlay */}
      <div
        className="fixed z-[9999999] rounded-2xl bg-slate-900/95 text-slate-100 shadow-2xl ring-1 ring-cyan-400/40 backdrop-blur"
        style={{ top: pos.top, left: pos.left }}
        role="menu"
      >
        ...
      </div>
      <div>
        <div className="px-4 pt-3 text-[11px] text-cyan-300/80">{email}</div>
        {onChangePassword && (
          <button
            className="block w-full px-4 py-3 text-left hover:bg-white/5"
            onClick={() => {
              onChangePassword();
              onClose();
            }}
          >
            Modifier le mot de passe
          </button>
        )}
        <button
          className="block w-full px-4 py-3 text-left text-red-300 hover:bg-white/5"
          onClick={() => {
            onSignOut();
            onClose();
          }}
        >
          Se déconnecter
        </button>
      </div>
    </>,
    document.body,
  );
}
