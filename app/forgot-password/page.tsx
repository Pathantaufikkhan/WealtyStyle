"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Lock,
  RefreshCw,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RealtimeEmailInput } from "@/components/auth/RealtimeEmailInput";
import { WealthStyleLogo } from "@/components/ui/WealthStyleLogo";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { registeredAccounts, resetUserPassword } = useAuthStore();

  // Step flow: "identify" -> "verify_reset" -> "success"
  const [step, setStep] = useState<"identify" | "verify_reset" | "success">("identify");
  const [accountEmail, setAccountEmail] = useState("");
  const [targetRecoveryEmail, setTargetRecoveryEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [hasCustomRecovery, setHasCustomRecovery] = useState(false);

  // OTP & New Password state
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "verify_reset" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Step 1: Submit Account Email -> Check Recovery Email -> Send OTP
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = accountEmail.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your account email.");
      return;
    }

    const accounts = registeredAccounts || [];
    const matchedAccount = accounts.find(
      (acc) => acc.email.toLowerCase().trim() === cleanEmail
    );

    if (!matchedAccount) {
      toast.error("No account found with this email address. Please verify your address or create an account.");
      return;
    }

    // Determine recovery email destination
    const recoveryDestination = matchedAccount.recoveryEmail
      ? matchedAccount.recoveryEmail.trim()
      : matchedAccount.email.trim();

    setTargetRecoveryEmail(recoveryDestination);
    setHasCustomRecovery(!!matchedAccount.recoveryEmail);

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountEmail: cleanEmail,
          recoveryEmail: recoveryDestination,
          fullName: matchedAccount.fullName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch password recovery code.");
      }

      setMaskedEmail(data.maskedEmail || recoveryDestination);

      if (matchedAccount.recoveryEmail) {
        toast.success(`Password reset passcode sent to your recovery email: ${data.maskedEmail || recoveryDestination}`, {
          description: "Please check your Inbox and Spam/Junk folder.",
          duration: 10000,
        });
      } else {
        toast.success(`Password reset passcode sent to ${cleanEmail}`, {
          description: "Please check your Inbox and Spam/Junk folder.",
          duration: 10000,
        });
      }

      setStep("verify_reset");
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      toast.error(err?.message || "Failed to request password reset. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasteData[i] || "";
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Step 2: Verify OTP & Update Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("");

    if (token.length !== 6) {
      toast.error("Please enter the complete 6-digit recovery passcode.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please re-enter.");
      return;
    }

    setIsVerifying(true);

    try {
      const res = await fetch("/api/auth/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountEmail: accountEmail.trim(),
          otp: token,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Passcode verification failed.");
      }

      // Update password in local storage store
      const result = resetUserPassword(accountEmail.trim(), newPassword);
      if (!result.success) {
        throw new Error(result.error || "Failed to update account password.");
      }

      toast.success("Password reset successfully! You can now log in with your new password.");
      setStep("success");
    } catch (err: any) {
      toast.error(err?.message || "Invalid or expired recovery passcode.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setTimer(60);
    setOtp(["", "", "", "", "", ""]);

    try {
      const cleanEmail = accountEmail.trim().toLowerCase();
      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountEmail: cleanEmail,
          recoveryEmail: targetRecoveryEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend code");

      toast.success(`A fresh passcode has been sent to ${maskedEmail || targetRecoveryEmail}`, {
        description: "Please check your Inbox and Spam/Junk folder.",
      });
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err?.message || "Failed to resend recovery code.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <WealthStyleLogo variant="stacked" size="md" href="/" />
          <div className="pt-1">
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-foreground uppercase tracking-tight">
              {step === "success" ? "Password Updated" : "Account Recovery"}
            </h1>
            <p className="text-xs text-zinc-500 pt-1 max-w-xs">
              {step === "identify"
                ? "Enter your account email to receive a recovery passcode via your registered recovery email."
                : step === "verify_reset"
                ? "Enter the recovery passcode and set your new account password."
                : "Your password has been successfully reset. Sign in to your account."}
            </p>
          </div>
        </div>

        {/* STEP 1: Enter Account Email */}
        {step === "identify" && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <RealtimeEmailInput
              label="Primary Account Email"
              value={accountEmail}
              onChange={setAccountEmail}
              placeholder="name@domain.com"
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="gold"
                isLoading={isLoading}
                className="w-full h-12 flex items-center justify-center gap-2 font-bold tracking-widest text-xs uppercase"
              >
                <span>Send Recovery Passcode</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: Verify Passcode & Set New Password */}
        {step === "verify_reset" && (
          <div className="space-y-6">
            <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-gold-500 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Passcode Sent to Recovery Destination</span>
              </div>
              <p className="text-xs text-foreground font-medium">
                {maskedEmail || targetRecoveryEmail}
              </p>
              {hasCustomRecovery && (
                <span className="inline-block text-[10px] text-emerald-500 font-semibold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1">
                  Verified Recovery Email
                </span>
              )}

              {/* Spam reminder notice */}
              <div className="mt-2 pt-2 border-t border-gold-500/20 flex items-center justify-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400/90 bg-amber-500/5 py-1.5 px-2 rounded-md">
                <Mail className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                <span>If not in inbox, please check your <strong>Spam / Junk</strong> folder.</span>
              </div>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 text-center block">
                  Enter 6-Digit Passcode
                </label>
                
                {/* 6 Digit Input Boxes */}
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl font-bold rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-foreground focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gold"
                  isLoading={isVerifying}
                  disabled={otp.join("").length !== 6 || !newPassword || !confirmPassword}
                  className="w-full h-12 flex items-center justify-center gap-2 font-bold tracking-widest text-xs uppercase"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Update Password</span>
                </Button>
              </div>
            </form>

            {/* Resend Actions */}
            <div className="flex flex-col items-center gap-3 pt-1 text-xs">
              <div className="text-zinc-500">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    type="button"
                    className="text-gold-500 font-semibold hover:underline inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend Passcode</span>
                  </button>
                ) : (
                  <span className="text-zinc-400">
                    Resend code in <strong className="text-foreground">{timer}s</strong>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStep("identify")}
                className="text-zinc-400 hover:text-foreground inline-flex items-center gap-1 transition-colors text-[11px]"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Change account email</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success */}
        {step === "success" && (
          <div className="space-y-5 text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-foreground">
                Password Successfully Reset
              </h3>
              <p className="text-xs text-zinc-500">
                You can now sign in to your GLAMSTEP account using your new credentials.
              </p>
            </div>

            <Link href="/login" className="block pt-2">
              <Button variant="gold" className="w-full h-11 font-bold text-xs tracking-wider uppercase">
                <span>Sign In to Account</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-2 text-center text-xs text-zinc-500 border-t border-border/50">
          <Link href="/login" className="text-zinc-400 hover:text-gold-500 transition-colors">
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
