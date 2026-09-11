"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Mail, X, CheckCircle2, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

interface RecoveryEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInitialPrompt?: boolean;
}

export function RecoveryEmailModal({
  isOpen,
  onClose,
  isInitialPrompt = false,
}: RecoveryEmailModalProps) {
  const { user, updateRecoveryEmail } = useAuthStore();
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.recoveryEmail) {
      setRecoveryEmail(user.recoveryEmail);
    }
  }, [user?.recoveryEmail]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = recoveryEmail.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      toast.error("Please enter a valid email address format (e.g. recovery@example.com).");
      return;
    }

    if (user?.email && cleanEmail === user.email.toLowerCase().trim()) {
      toast.error("Recovery email cannot be the same as your primary account email.");
      return;
    }

    setIsLoading(true);

    try {
      const result = updateRecoveryEmail(cleanEmail);
      if (!result.success) {
        toast.error(result.error || "This email is already registered as a user. Please try a different recovery email.");
        return;
      }

      toast.success("Recovery email saved successfully! Your account is now secured.", {
        description: `Password reset links will be sent to ${cleanEmail} if you ever forget your password.`,
        duration: 8000,
      });
      onClose();
    } catch (err: any) {
      toast.error("Failed to update recovery email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-gold-500/30 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 relative overflow-hidden">
        
        {/* Luxury subtle ambient glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="h-12 w-12 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>Account Protection</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-white uppercase tracking-tight">
            {isInitialPrompt ? "Add Your Recovery Email" : "Manage Recovery Email"}
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            {isInitialPrompt
              ? "For your safety, add a secondary recovery email. If you ever forget your password, your reset passcode will be sent directly to this recovery address."
              : "Update your secondary recovery email address used for password recovery and account verification."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gold-500" />
              <span>Recovery Email Address</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="e.g. backup.email@gmail.com"
              required
              className={cn(
                "w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none",
                "bg-zinc-950 border border-zinc-700 text-white placeholder:text-zinc-500",
                "focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
              )}
            />
            {user?.email && (
              <p className="text-[11px] text-zinc-500 px-1">
                Primary Account Email: <span className="text-zinc-300 font-mono">{user.email}</span>
              </p>
            )}
          </div>

          <div className="pt-2 space-y-2">
            <Button
              type="submit"
              variant="gold"
              isLoading={isLoading}
              className="w-full h-11 flex items-center justify-center gap-2 font-bold tracking-widest text-xs uppercase"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Save Recovery Email</span>
            </Button>

            {isInitialPrompt && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-center text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                I&apos;ll do this later
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
