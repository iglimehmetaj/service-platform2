"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import { Home, Lock, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

export default function ClientLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/client/dashboard";

  const router = useRouter();


     useEffect(() => {
      const checkSession = async () => {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
  
        if (session?.user?.role === "CLIENT") {
          router.replace("/client/dashboard"); // Redirect to dashboard
        }
      };
  
      checkSession();
    }, [router]);
    
  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await signIn("client-login", {
    email,
    password,
    redirect: false,
  });

  if (res?.error) {
    toast.error(res.error);
    return;
  }

  toast.success("Login successful!");

  const sessionRes = await fetch("/api/auth/session");
  const session = await sessionRes.json();

  if (session?.user?.role === "CLIENT") {
    router.push(callbackUrl); // ✅ return to where user came from
  } else {
    toast.error("You are not authorized to login here.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-50 to-green-100 px-6 py-12">
       <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        type="button"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-green-200 overflow-hidden">
        <div className="px-10 py-8">
          <div className="flex justify-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-3xl flex items-center justify-center shadow-md">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-green-900 mb-2">Client Login</h2>
            <p className="text-green-700 text-base font-medium">
              Sign in to your client account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-7">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Mail className="h-6 w-6 text-green-400" />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-5 py-4 border border-green-300 rounded-2xl focus:ring-4 focus:ring-green-400 focus:border-transparent transition duration-300 text-green-900 placeholder-green-400 bg-green-50"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Lock className="h-6 w-6 text-green-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-5 py-4 border border-green-300 rounded-2xl focus:ring-4 focus:ring-green-400 focus:border-transparent transition duration-300 text-green-900 placeholder-green-400 bg-green-50"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-700 to-green-900 text-white font-extrabold py-4 rounded-2xl hover:from-green-900 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg transition transform hover:-translate-y-0.5"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
