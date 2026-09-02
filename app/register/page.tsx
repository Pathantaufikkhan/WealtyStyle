"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles,
  Lock,
  User,
  Phone
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WealthStyleLogo } from "@/components/ui/WealthStyleLogo";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  // Registration Form State
  const [step, setStep] = useState<"details" | "otp">("details");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // OTP State
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // References for OTP individual digit input boxes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Step 1: Submit Details & Request OTP via Nodemailer
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), fullName: fullName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch verification email");
      }

      if (data.isDemo && data.demoOtp) {
        setDemoOtp(data.demoOtp);
        toast.info("SMTP Not Configured", {
          description: `Generated Demo Code: ${data.demoOtp}`,
          duration: 12000,
        });
      } else {
        setDemoOtp(null);
        toast.success(`Verification passcode sent to ${email}`);
      }

      setStep("otp");
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      toast.error(err?.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Digit Change in 6-digit boxes
  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);

    // Auto-focus next input box
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace and Navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Paste of 6-digit Code
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

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("");

    if (token.length !== 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    setIsVerifying(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: token,
          fullName: fullName.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      // Save user session
      login(data.user);

      toast.success("Account successfully verified! Welcome to GLAMSTEP.");
      router.push("/account");
    } catch (err: any) {
      toast.error(err?.message || "Invalid or expired verification code.");
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
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), fullName: fullName.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend code");

      if (data.isDemo && data.demoOtp) {
        setDemoOtp(data.demoOtp);
        toast.info("SMTP Not Configured", {
          description: `New Demo Code: ${data.demoOtp}`,
          duration: 12000,
        });
      } else {
        toast.success(`A fresh verification code has been dispatched to ${email}`);
      }
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err?.message || "Failed to resend code.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-xl p-8 space-y-6">
        
        {/* Header / Logo */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <WealthStyleLogo variant="stacked" size="md" href="/" />
          <p className="text-xs text-zinc-500 pt-1 max-w-xs">
            {step === "details"
              ? "Create your exclusive GLAMSTEP account with verified email security."
              : "Enter the verification code sent to your email to activate your account."}
          </p>
        </div>

        {/* STEP 1: Details Registration Form */}
        {step === "details" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <Input
              label="Full Legal Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Vikramaditya Roy"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              required
            />

            <Input
              label="Mobile Phone (Optional)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="gold"
                isLoading={isLoading}
                className="w-full h-12 flex items-center justify-center gap-2 font-bold tracking-widest text-xs"
              >
                <span>Send Verification OTP</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: Nodemailer OTP Verification */}
        {step === "otp" && (
          <div className="space-y-6">
            <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-gold-500 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Email Verification Code Sent</span>
              </div>
              <p className="text-xs text-foreground font-medium">{email}</p>
              
              {demoOtp && (
                <div className="mt-2 pt-2 border-t border-gold-500/20">
                  <span className="text-[11px] text-zinc-400">Demo Code (SMTP unconfigured): </span>
                  <span className="text-xs font-mono font-bold text-gold-400 bg-black/40 px-2 py-0.5 rounded">
                    {demoOtp}
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
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

              <Button
                type="submit"
                variant="gold"
                isLoading={isVerifying}
                disabled={otp.join("").length !== 6}
                className="w-full h-12 flex items-center justify-center gap-2 font-bold tracking-widest text-xs"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Verify & Activate Account</span>
              </Button>
            </form>

            {/* Resend and Edit Actions */}
            <div className="flex flex-col items-center gap-3 pt-1 text-xs">
              <div className="text-zinc-500">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    type="button"
                    className="text-gold-500 font-semibold hover:underline inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend OTP Code</span>
                  </button>
                ) : (
                  <span className="text-zinc-400">
                    Resend code in <strong className="text-foreground">{timer}s</strong>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStep("details")}
                className="text-zinc-400 hover:text-foreground inline-flex items-center gap-1 transition-colors text-[11px]"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Edit registration details</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-2 text-center text-xs text-zinc-500 border-t border-border/50">
          <span>Already registered with GLAMSTEP? </span>
          <Link href="/login" className="text-gold-500 font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
