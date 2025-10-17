import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "ghost" | "soft";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const base =
      "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors " +
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 " +
      "focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 " +
      "disabled:opacity-50 disabled:cursor-not-allowed";

    const variants: Record<Variant, string> = {
      primary:
        "bg-cyan-500 text-white hover:bg-cyan-400 active:bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,.35)]",
      soft: "bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/15 active:bg-cyan-400/20 ring-1 ring-white/10",
      ghost:
        "text-slate-100 hover:bg-white/5 active:bg-white/10 ring-1 ring-white/10",
    };

    const sizes: Record<Size, string> = {
      sm: "px-2.5 py-1.5 text-xs",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-2.5 text-base",
    };

    return (
      <button
        ref={ref}
        className={cx(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        {...rest}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
