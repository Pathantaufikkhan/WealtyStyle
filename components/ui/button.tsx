import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "gold"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "luxury";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500 disabled:pointer-events-none disabled:opacity-50 select-none tracking-wider uppercase";

    const variantStyles = {
      default:
        "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm",
      gold: "bg-gold-500 text-zinc-950 font-semibold hover:bg-gold-400 shadow-md hover:shadow-gold-500/20 active:scale-[0.99]",
      luxury:
        "bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-zinc-950 font-bold hover:brightness-110 shadow-lg shadow-gold-500/25 border border-gold-300/30",
      secondary:
        "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
      outline:
        "border border-zinc-300 bg-transparent hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50",
      ghost:
        "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50",
      link: "text-gold-500 underline-offset-4 hover:underline lowercase normal-case tracking-normal",
    };

    const sizeStyles = {
      default: "h-11 px-6 py-2 rounded-sm text-xs font-semibold",
      sm: "h-9 px-4 rounded-sm text-[11px]",
      lg: "h-13 px-8 py-3.5 rounded-sm text-xs font-bold tracking-widest",
      xl: "h-14 px-10 py-4 rounded-sm text-sm font-bold tracking-widest",
      icon: "h-10 w-10 rounded-full",
    };

    return (
      <button
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          isLoading && "opacity-80 cursor-wait",
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
