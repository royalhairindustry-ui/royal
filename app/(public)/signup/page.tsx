"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Phone, User, Lock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerClient } from "@/lib/actions";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await registerClient(formData);
    
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } else {
      setError(result.error || "Failed to create account. Please try again.");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6">
        <div className="w-full max-w-[420px] text-center animate-in fade-in zoom-in duration-500">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-[28px] font-black text-black uppercase tracking-tight">Account Created!</h1>
          <p className="mt-4 text-zinc-500">Welcome to Royal Braids. Redirecting you to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white font-sans lg:flex-row-reverse">
      {/* Visual Column */}
      <div className="hidden w-1/2 lg:block relative">
        <img 
          src="https://res.cloudinary.com/doh2vn9zn/image/upload/v1773692504/new1_m8z7aj.png" 
          alt="Royal Braids Collection" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col justify-center p-20 text-white">
          <h2 className="text-[48px] font-black uppercase leading-tight tracking-tight">The Royal Experience.</h2>
          <p className="mt-6 max-w-[400px] text-[20px] font-light leading-relaxed opacity-80 italic">
            "Every braid is a crown. Sign up to manage your orders and explore premium textures."
          </p>
        </div>
      </div>

      {/* Form Column */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-6 py-12 lg:w-1/2 md:px-20 lg:px-24">
        <div className="w-full max-w-[420px]">
          <div className="mb-12">
            <Link href="/" className="mb-10 inline-flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black transition-transform group-hover:scale-110">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-[18px] font-black uppercase tracking-[0.3em] text-black">Royal Braids</span>
            </Link>
            
            <h1 className="text-[36px] font-black text-black uppercase tracking-tight leading-none">Create Account</h1>
            <p className="mt-4 text-[16px] text-zinc-500">Join our premium client community today.</p>
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
                <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Sarah Nakato"
                    className="h-14 w-full rounded-2xl border border-transparent bg-zinc-50 pl-12 pr-4 text-[15px] font-medium transition-all focus:border-black/10 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Phone Number *</label>
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
                <label className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Create Password</label>
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
              {isLoading ? "Creating Account..." : "Join Now"}
            </button>
          </form>

          <p className="mt-10 text-center text-[14px] text-zinc-500">
            Already have an account? <Link href="/signin" className="font-bold text-black border-b-2 border-black/10 transition-colors hover:border-black pb-0.5">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
