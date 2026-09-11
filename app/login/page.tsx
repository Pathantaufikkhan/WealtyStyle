"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WealthStyleLogo } from "@/components/ui/WealthStyleLogo";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = loginWithCredentials(email, password);

      setIsLoading(false);

      if (!result.success) {
        toast.error(result.error || "Authentication failed");
        return;
      }

      toast.success(
        result.isAdmin
          ? "Welcome back, Maison Administrator!"
          : `Welcome back, ${result.user?.fullName || "Valued Client"}!`
      );

      router.push(result.isAdmin ? "/admin" : "/account");
    }, 500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <WealthStyleLogo variant="stacked" size="md" href="/" />
          <p className="text-xs text-zinc-500 pt-1">
            Access your orders, saved wishlists, and personalized concierge.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@domain.com"
            required
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div className="flex justify-end pt-1">
              <Link
                href="/forgot-password"
                className="text-[11px] text-gold-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="gold"
            isLoading={isLoading}
            className="w-full h-12 flex items-center justify-center gap-2 mt-2 font-bold tracking-widest text-xs uppercase"
          >
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Register Link */}
        <div className="pt-2 text-center text-xs text-zinc-500 border-t border-border/60">
          <span>Don&apos;t have an account yet? </span>
          <Link href="/register" className="text-gold-500 font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
