import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gold" | "secondary" | "outline" | "sale" | "new";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900",
    gold: "bg-gold-500/15 text-gold-600 dark:text-gold-300 border border-gold-500/30",
    sale: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold",
    new: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold",
    secondary: "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
    outline: "text-foreground border border-border",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xs px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
