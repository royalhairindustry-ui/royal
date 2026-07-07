import React from "react";
import { FileText, ShieldCheck, Save } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-black">Privacy Policy</h1>
        <p className="mt-1 text-[14px] text-zinc-500">
          Update your store's privacy policy and data collection terms.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-black" />
            <span className="text-[16px] font-bold text-black">Policy Content</span>
          </div>
          <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-black px-4 text-[13px] font-medium text-white hover:bg-zinc-800">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
        
        <textarea 
          className="min-h-[400px] w-full rounded-xl border border-zinc-100 bg-zinc-50 p-6 text-[14px] leading-relaxed outline-none focus:border-black/10"
          placeholder="Enter your Privacy Policy here..."
          defaultValue={`Royal Braids Ltd takes your privacy seriously. This policy outlines how we collect, use, and protect your personal information when you use our website.

1. Information Collection
We collect personal identification information from Users when they place an order, subscribe to a newsletter, or fill out a form...`}
        />
      </div>
    </div>
  );
}
