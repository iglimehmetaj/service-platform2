"use client";

import { signIn } from "next-auth/react";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Lock, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CompanyLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

    useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/auth/session");
      const session = await res.json();

      if (session?.user?.role === "COMPANY") {
        router.replace("/company/dashboard"); // Redirect to dashboard
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use the company-login provider ID explicitly
    const res = await signIn("company-login", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.error);
      return;
    }

    toast.success("Login successful!");

    // Fetch session info to check role
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    if (session?.user?.role === "COMPANY") {
      router.push("/company/dashboard");
    } else {
      toast.error("You are not authorized to login here.");
      // Optionally sign out or redirect
      // await signOut();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">

     

       <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        type="button"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                Company Login
              </h2>
              <p className="text-slate-500 text-sm">
                Sign in to your company account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white font-semibold py-4 rounded-xl hover:from-blue-900 hover:to-blue-950 focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
