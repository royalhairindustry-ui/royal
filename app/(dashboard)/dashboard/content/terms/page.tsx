import React from "react";
import { FileText, Save } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-black">Terms of Service</h1>
        <p className="mt-1 text-[14px] text-zinc-500">
          Update your store's legal terms, shopping rules, and merchant conditions.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-black" />
            <span className="text-[16px] font-bold text-black">Terms Content</span>
          </div>
          <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-black px-4 text-[13px] font-medium text-white hover:bg-zinc-800">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
        
        <textarea 
          className="min-h-[400px] w-full rounded-xl border border-zinc-100 bg-zinc-50 p-6 text-[14px] leading-relaxed outline-none focus:border-black/10"
          placeholder="Enter your Terms of Service here..."
          defaultValue={`Welcome to Royal Braids Ltd. By accessing our website, you agree to comply with and be bound by the following terms and conditions.

1. General
The content of the pages of this website is for your general information and use only. It is subject to change without notice...`}
        />
      </div>
    </div>
  );
}
