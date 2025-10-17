import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

type Size = "sm" | "md" | "lg";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  size?: Size;
  /** Force l'état invalide (sinon se base sur :invalid natif) */
  invalid?: boolean;
  /** Prend toute la largeur */
  fullWidth?: boolean;
  /** Icône/élément à gauche */
  leftIcon?: ReactNode;
  /** Icône/élément à droite */
  rightIcon?: ReactNode;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      className = "",
      size = "md",
      invalid,
      fullWidth = true,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    const sizePadX = size === "sm" ? "px-2.5" : size === "lg" ? "px-4" : "px-3";
    const sizePadY =
      size === "sm" ? "py-1.5" : size === "lg" ? "py-2.5" : "py-2";
    const withLeft = leftIcon
      ? size === "sm"
        ? "pl-8"
        : size === "lg"
          ? "pl-11"
          : "pl-9"
      : "";
    const withRight = rightIcon
      ? size === "sm"
        ? "pr-8"
        : size === "lg"
          ? "pr-11"
          : "pr-9"
      : "";

    const base =
      "w-full rounded-xl text-sm outline-none " +
      "bg-white dark:bg-slate-900 text-zinc-900 dark:text-zinc-100 " +
      "placeholder:text-zinc-400 dark:placeholder:text-zinc-500 " +
      "ring-1 ring-zinc-200 dark:ring-white/10 " +
      "focus:ring-2 focus:ring-blue-500 " +
      "disabled:opacity-60 disabled:cursor-not-allowed " +
      "aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500";

    return (
      <div className={cx(fullWidth && "w-full", "relative")}>
        {leftIcon && (
          <span
            className={cx(
              "pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center text-zinc-400 dark:text-zinc-500",
              size === "sm" ? "w-8" : size === "lg" ? "w-11" : "w-9",
            )}
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          className={cx(
            base,
            sizePadX,
            sizePadY,
            withLeft,
            withRight,
            className,
          )}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          {...props}
        />

        {rightIcon && (
          <span
            className={cx(
              "absolute inset-y-0 right-0 flex items-center justify-center text-zinc-400 dark:text-zinc-500",
              size === "sm" ? "w-8" : size === "lg" ? "w-11" : "w-9",
            )}
          >
            {rightIcon}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
