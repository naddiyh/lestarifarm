"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
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
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login Success");
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-left bg-cover
            relative "
      style={{
        backgroundImage: "url('/bg-login.jpeg')",
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="right-10 top-25 bg-center rounded-full bg-linear-to-br from-[#66BB6A] via-[#9CCC65] absolute to-[#DCEDC8] h-90 w-180 opacity-35 blur-[80px]" />
      <div className="left-20 bottom-10 bg-center rounded-full bg-linear-to-br from-blue-400 via-blue-400 absolute to-purple-500 h-90 w-180 opacity-30 blur-[80px]" />
      <Card className="w-full max-w-sm backdrop-blur-sm shadow-2xl text-white  bg-white/10 gap-2 border border-white/20 relative z-10 md:mx-0 mx-4">
        <CardHeader>
          <CardTitle className="text-center flex justify-center  items-center gap-2 text-lg font-semibold text-white">
            <div className="bg-linear-to-r from-green-400 to-emerald-600 p-2 rounded-lg">
              <Leaf className="text-white w-5 h-5" />
            </div>
            Lestari Farm
          </CardTitle>
          <CardDescription className="mt-2 text-center text-white">
            Login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4 px-1 pt-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@gmail.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                className=" placeholder:text-white py-5 placeholder:white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="py-5"
                onChange={(e) => setPassword(e.target.value)}
              />
              <a
                href="#"
                className="text-[12px] underline-offset-4 hover:underline text-right"
              >
                Forgot password?
              </a>
            </div>
            <Button
              type="submit"
              className="w-full py-5 cursor-pointer bg-hover:opacity-90"
            >
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-[12px]">
            Haven't account yet?{" "}
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
