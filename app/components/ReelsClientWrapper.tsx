"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import ReelCreateForm from "./ReelCreateForm";

export default function ReelsClientWrapper() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mb-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-black">Product Reels</h1>
          <p className="mt-1 text-[14px] text-zinc-500">
            Manage the Instagram-style video reels on the storefront.
          </p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`inline-flex h-11 items-center gap-2 rounded-xl px-6 text-[14px] font-medium transition shadow-sm ${
            showForm ? "bg-zinc-100 text-black hover:bg-zinc-200" : "bg-black text-white hover:bg-zinc-800"
          }`}
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add New Reel"}
        </button>
      </div>

      {showForm && (
        <div className="mt-8 rounded-2xl border border-zinc-100 bg-white p-6 shadow-md md:p-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="mb-8 border-b border-zinc-50 pb-6">
            <h2 className="text-[20px] font-bold text-black">New Product Reel</h2>
            <p className="text-[14px] text-zinc-500">Upload a video and select the associated product.</p>
          </div>
          <ReelCreateForm />
        </div>
      )}
    </div>
  );
}
