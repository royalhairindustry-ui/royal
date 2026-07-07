"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cloudinaryImages } from "@/lib/cloudinary";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Hardcoded credentials as requested
    if (email === "admin@royalbraids.com" && password === "123456Pp") {
      // Simulate slight delay for better UX
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } else {
      setIsLoading(false);
      setError("Invalid email address or password. Please try again.");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white font-sans">
      {/* Left Column: Image Area (Hidden on mobile) */}
      <div className="hidden h-full w-1/2 lg:block relative">
        <img 
          src={cloudinaryImages.authBackground} 
          alt="Royal Braids Branding" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col justify-end p-20 text-white">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-white" />
            <h2 className="text-[32px] font-bold uppercase tracking-[0.4em]">Royal Braids</h2>
          </div>
          <p className="max-w-[400px] text-[18px] font-light leading-relaxed opacity-90">
            Experience the royal touch in every thread. Manage your artistry through the premium dashboard.
          </p>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex h-full w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-[400px] space-y-12">
          {/* Mobile Logo */}
          <div className="flex flex-col items-center lg:hidden">
            <div className="h-16 w-16 mb-6 rounded-2xl bg-black flex items-center justify-center shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-[20px] font-bold uppercase tracking-[0.3em] text-black text-center">
              Royal Braids
            </h1>
          </div>

          <div className="space-y-4 text-center lg:text-left">
            <h2 className="text-[32px] font-bold text-black lg:text-[40px]">Sign In</h2>
            <p className="text-[14px] text-zinc-500">Welcome back. Enter your credentials to access the dashboard.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-[13px] text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="group space-y-2">
                <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 group-focus-within:text-black transition-colors">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@royalbraids.com"
                    required
                    className="h-14 w-full rounded-2xl bg-zinc-50 pl-11 pr-4 text-[14px] outline-none border border-transparent focus:border-black/10 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="group space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 group-focus-within:text-black transition-colors">
                    Password
                  </label>
                  <a href="#" className="text-[12px] font-medium text-zinc-400 hover:text-black transition-colors underline-offset-4 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-14 w-full rounded-2xl bg-zinc-50 pl-11 pr-4 text-[14px] outline-none border border-transparent focus:border-black/10 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-black px-8 text-[15px] font-bold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">{isLoading ? "Accessing..." : "Access Dashboard"}</span>
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          <p className="text-center text-[13px] text-zinc-500">
            Don't have access? <a href="#" className="font-bold text-black border-b border-black">Contact System Admin</a>
          </p>
        </div>
      </div>
    </div>
  );
}
