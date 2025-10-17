import { createPortal } from "react-dom";
import { type PropsWithChildren, useEffect, useState } from "react";

export function Portal({ children }: PropsWithChildren) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => setTarget(document.body), []);
  if (!target) return null;
  return createPortal(children, target);
}
