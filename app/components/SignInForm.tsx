"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Phone, Lock, AlertCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signinClient } from "@/lib/actions";

export default function SignInForm({ logoUrl }: { logoUrl?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signinClient(formData);
      if (result.success) {
        window.location.href = callbackUrl;
      } else {
        setError(result.error || "Invalid phone number or password.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen bg-white font-sans lg:flex-row">
      {/* Visual Column */}
      <div className="hidden w-1/2 lg:block relative">
        <img 
          src="https://res.cloudinary.com/doh2vn9zn/image/upload/v1773692504/new1_m8z7aj.png" 
          alt="Royal Braids Collection" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col justify-center p-20 text-white">
          <h2 className="text-[48px] font-black uppercase leading-tight tracking-tight">Royal Access.</h2>
          <p className="mt-6 max-w-[400px] text-[20px] font-light leading-relaxed opacity-80 italic">
            "Sign in to access your royal dashboard and tracking history."
          </p>
        </div>
      </div>

      {/* Form Column */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-6 py-12 lg:w-1/2 md:px-20 lg:px-24">
        <div className="w-full max-w-[420px]">
          <div className="mb-12">
            <Link href="/" className="mb-10 inline-flex items-center gap-4 group">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-110" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black transition-transform group-hover:scale-110">
                  <Sparkles size={20} className="text-white" />
                </div>
              )}
              <span className="text-[20px] font-black uppercase tracking-[0.3em] text-black">Royal Braids</span>
            </Link>
            
            <h1 className="text-[36px] font-black text-black uppercase tracking-tight leading-none">Welcome Back</h1>
            <p className="mt-4 text-[16px] text-zinc-500">Enter your credentials to manage your royalties.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-[13px] font-medium text-red-600">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 0770 000 000"
                    className="h-14 w-full rounded-2xl border border-transparent bg-zinc-50 pl-12 pr-4 text-[15px] font-medium transition-all focus:border-black/10 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Password</label>
                  <a href="#" className="text-[12px] font-medium text-zinc-400 hover:text-black transition-colors underline-offset-4 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="h-14 w-full rounded-2xl border border-transparent bg-zinc-50 pl-12 pr-4 text-[15px] font-medium transition-all focus:border-black/10 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="group flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-black text-[15px] font-black uppercase tracking-widest text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              {isLoading ? "Signing In..." : "Log In"}
            </button>
          </form>

          <p className="mt-10 text-center text-[14px] text-zinc-500">
            First time at Royal Braids? <Link href="/signup" className="font-bold text-black border-b-2 border-black/10 transition-colors hover:border-black pb-0.5">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
