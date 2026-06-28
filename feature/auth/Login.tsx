"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Eye, EyeOff, Lock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const autofillClass =
    "[&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]";

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/resetpass`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Link reset password has been sent to " + email);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Login Success");
    window.location.replace("/dashboard");
  };

  // Hapus useEffect onAuthStateCha
  return (
    <section
      className="min-h-screen w-full flex items-center justify-center bg-center bg-cover relative"
      style={{
        backgroundImage: "url('/bg-login.jpeg')",
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="right-10 top-25 bg-center rounded-full bg-gradient-to-br from-green-400 via-emerald-500 absolute to-lime-300 h-90 w-180 opacity-35 blur-[80px]" />
      <div className="left-20 bottom-10 bg-center rounded-full bg-gradient-to-br from-teal-400 via-green-500 absolute to-emerald-300 h-90 w-180 opacity-25 blur-[80px]" />

      <Card className="w-full max-w-sm backdrop-blur-sm shadow-2xl text-white bg-white/10 gap-2 border border-green-200/20 relative z-10 md:mx-0 mx-4">
        <CardHeader>
          <CardTitle className="text-center flex justify-center items-center gap-2 text-lg font-semibold text-white">
            <div className="bg-gradient-to-r from-green-400 to-emerald-600 p-2 rounded-lg">
              <Leaf className="text-white w-5 h-5" />
            </div>
            Lestari Farm
          </CardTitle>

          <CardDescription className="mt-3 text-center text-green-100/80">
            Login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4 px-1 pt-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white/80">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="name@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-11 bg-white/10 border-green-200/20 text-white placeholder:text-white/40 focus-visible:ring-green-500/50 focus-visible:border-green-400/50 ${autofillClass}`}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-white/70"
                >
                  Password
                </Label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={!email}
                  className="text-[11px] cursor-pointer text-green-100/60 hover:text-green-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-100/40 pointer-events-none" />

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-9 pr-10 h-11 bg-white/10 border-green-200/20 text-white placeholder:text-white/30 focus-visible:ring-green-500/50 focus-visible:border-green-400/50 ${autofillClass}`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-100/40 hover:text-green-100/80 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 mt-2 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium shadow-lg shadow-green-900/20"
            >
              Login
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <div className="text-[12px] text-white/80">
            Haven&apos;t account yet?{" "}
            <a
              href="https://wa.me/6282398380058"
              target="_blank"
              rel="noopener noreferrer"
              className="underline cursor-pointer hover:text-green-200"
            >
              Contact Admin
            </a>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};
