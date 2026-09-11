"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Mail, 
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface EmailVerificationResult {
  status: "idle" | "checking" | "valid" | "invalid_syntax" | "disposable" | "invalid_domain" | "typo_detected" | "error";
  isValid: boolean;
  domainExists: boolean;
  suggestion: string | null;
  message: string;
}

interface RealtimeEmailInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (result: EmailVerificationResult) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showDetails?: boolean;
}

export function RealtimeEmailInput({
  value,
  onChange,
  onValidationChange,
  label = "Email Address",
  placeholder = "name@domain.com",
  required = true,
  disabled = false,
  className,
  showDetails = true,
}: RealtimeEmailInputProps) {
  const [verification, setVerification] = useState<EmailVerificationResult>({
    status: "idle",
    isValid: false,
    domainExists: false,
    suggestion: null,
    message: "",
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced real-time email existence check
  useEffect(() => {
    const trimmed = value.trim();

    if (!trimmed || !trimmed.includes("@")) {
      const resetState: EmailVerificationResult = {
        status: "idle",
        isValid: false,
        domainExists: false,
        suggestion: null,
        message: "",
      };
      setVerification(resetState);
      onValidationChange?.(resetState);
      return;
    }

    // Don't check until domain part has at least 3 characters
    const parts = trimmed.split("@");
    if (parts.length !== 2 || parts[1].length < 3 || !parts[1].includes(".")) {
      const pendingState: EmailVerificationResult = {
        status: "idle",
        isValid: false,
        domainExists: false,
        suggestion: null,
        message: "",
      };
      setVerification(pendingState);
      onValidationChange?.(pendingState);
      return;
    }

    // Set status to checking
    setVerification((prev) => ({ ...prev, status: "checking" }));

    // Cancel prior fetch if user continues typing
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmed }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Validation check failed");
        }

        const data: EmailVerificationResult = await res.json();
        setVerification(data);
        onValidationChange?.(data);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          const errState: EmailVerificationResult = {
            status: "error",
            isValid: false,
            domainExists: false,
            suggestion: null,
            message: "Unable to verify email domain.",
          };
          setVerification(errState);
          onValidationChange?.(errState);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  const handleApplySuggestion = (suggested: string) => {
    onChange(suggested);
  };

  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-gold-500" />
            <span>{label}</span>
            {required && <span className="text-red-500">*</span>}
          </label>

          {/* Inline mini status badge */}
          {verification.status === "checking" && (
            <span className="text-[10px] text-gold-500 flex items-center gap-1">
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
              <span>Checking format...</span>
            </span>
          )}
          {verification.status === "valid" && (
            <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Ready for OTP</span>
            </span>
          )}
        </div>
      )}

      {/* Input container with dynamic status border */}
      <div className="relative">
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none",
            "bg-zinc-50 dark:bg-zinc-900/70 text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600",
            "border",
            verification.status === "valid"
              ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              : verification.status === "invalid_domain" || verification.status === "disposable"
              ? "border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : verification.status === "typo_detected"
              ? "border-amber-500/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              : "border-border/80 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          )}
        />

        {/* Right action icon */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          {verification.status === "checking" && (
            <Loader2 className="w-4 h-4 text-gold-500 animate-spin" />
          )}
          {verification.status === "valid" && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
          {(verification.status === "invalid_domain" || verification.status === "disposable") && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          {verification.status === "typo_detected" && (
            <Sparkles className="w-4 h-4 text-amber-500" />
          )}
        </div>
      </div>

      {/* Real-time Detailed Feedback Notice */}
      {showDetails && (
        <>
          {/* Typo Suggestion Box with 1-Click Fix */}
          {verification.suggestion && verification.suggestion !== value && (
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  Did you mean <strong className="font-semibold underline">{verification.suggestion}</strong>?
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleApplySuggestion(verification.suggestion!)}
                className="shrink-0 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-[11px] rounded-md transition-colors flex items-center gap-1 shadow-sm"
              >
                <span>Fix</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Invalid Domain Warning */}
          {verification.status === "invalid_domain" && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {verification.message || "This email domain does not exist or cannot receive mail."}
              </span>
            </div>
          )}

          {/* Disposable Email Warning */}
          {verification.status === "disposable" && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs animate-in fade-in duration-200">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Temporary or disposable email addresses are not accepted for luxury client accounts.
              </span>
            </div>
          )}

          {/* Valid Active Status */}
          {verification.status === "valid" && !verification.suggestion && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium px-1">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Email address format verified & ready for OTP code.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
