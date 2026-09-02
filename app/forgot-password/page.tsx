"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSent(true);
    toast.success("Password reset instructions have been sent to your email.");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center mx-auto mb-2">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground uppercase">
            Reset Password
          </h1>
          <p className="text-xs text-zinc-500">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {isSent ? (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400 space-y-2 text-center">
            <CheckCircle2 className="h-6 w-6 mx-auto text-emerald-500" />
            <p className="font-bold">Instructions Sent!</p>
            <p className="text-zinc-500">
              Check your inbox at <strong>{email}</strong> for the recovery link.
            </p>
            <Link href="/login" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Account Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              required
            />
            <Button type="submit" variant="gold" className="w-full h-11">
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="text-center text-xs">
          <Link href="/login" className="text-zinc-400 hover:text-gold-500">
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
