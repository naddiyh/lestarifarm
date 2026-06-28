"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Leaf,
} from "lucide-react";
import { useRouter } from "next/navigation";

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true);
      else {
        setTimeout(async () => {
          const { data: s } = await supabase.auth.getSession();
          if (!s.session) setSessionError(true);
        }, 3000);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
    setTimeout(() => router.push("/login"), 3000);
  };

  const autofillClass =
    "[&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]";

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-left bg-cover relative"
      style={{ backgroundImage: "url('/bg-login.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/75 z-0" />

      <div className="right-10 top-25 rounded-full bg-gradient-to-br from-green-400 via-emerald-500 absolute to-lime-300 h-90 w-180 opacity-30 blur-[80px]" />
      <div className="left-10 bottom-10 rounded-full bg-gradient-to-br from-teal-400 via-green-500 absolute to-emerald-300 h-80 w-150 opacity-20 blur-[90px]" />

      <div className="relative z-10 w-full max-w-sm mx-4 md:mx-0 backdrop-blur-sm bg-white/10 border border-green-200/20 rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 shadow-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
            <Leaf className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-xl font-semibold text-white">Reset Password</h1>
          <p className="text-sm text-green-100/70 mt-1">
            Enter your new password
          </p>
        </div>

        {/* Success */}
        {done ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium text-sm">
                Password updated successfully!
              </p>
              <p className="text-green-100/50 text-xs mt-1">
                Redirecting to login page…
              </p>
            </div>
          </div>
        ) : sessionError ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium text-sm">
                Invalid or expired link
              </p>
              <p className="text-white/50 text-xs mt-1">
                Please request a new reset link.
              </p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="text-xs text-green-100/60 hover:text-green-100 underline underline-offset-4 transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : !sessionReady ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="w-6 h-6 text-green-100/60 animate-spin" />
            <p className="text-green-100/60 text-sm">Verifying link…</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-green-100/70">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-100/40 pointer-events-none" />
                <Input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className={`pl-9 pr-10 h-11 bg-white/10 border-green-200/20 text-white placeholder:text-green-100/30 focus-visible:ring-green-500/50 focus-visible:border-green-400/50 ${autofillClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-100/40 hover:text-green-100/80"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-green-100/70">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-100/40 pointer-events-none" />
                <Input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  className={`pl-9 pr-10 h-11 bg-white/10 border-green-200/20 text-white placeholder:text-green-100/30 focus-visible:ring-green-500/50 focus-visible:border-green-400/50 ${autofillClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-100/40 hover:text-green-100/80"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium gap-2 shadow-lg shadow-green-900/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                </>
              ) : (
                "Save New Password"
              )}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};
