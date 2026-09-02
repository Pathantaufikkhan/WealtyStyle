import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[100px] w-full rounded-sm border border-zinc-200 bg-transparent px-3.5 py-2.5 text-sm text-foreground placeholder:text-zinc-400 focus-visible:outline-none focus-visible:border-gold-500 focus-visible:ring-1 focus-visible:ring-gold-500 transition-all disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900/50",
            error && "border-rose-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
