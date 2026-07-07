"use client";

import React from "react";
import { Settings2, Plus, GripVertical, Trash2 } from "lucide-react";

const attributes = [
  { id: 1, name: "Texture", values: ["Silky", "Yaki", "Kinky", "Straight"], swappable: true },
  { id: 2, name: "Length", values: ["12\"", "18\"", "24\"", "30\""], swappable: false },
  { id: 3, name: "Material", values: ["Human Hair", "Synthetic", "Mixed"], swappable: false },
];

export default function AttributePage() {
  return (
    <div className="max-w-[900px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-black">Product Attributes</h1>
          <p className="text-[14px] text-zinc-500">Define variants like Texture, Length, or Density.</p>
        </div>
        <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-black px-5 text-[14px] font-medium text-white transition-all hover:bg-zinc-800">
          <Plus className="h-4 w-4" />
          Add Attribute
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <div className="p-6 border-b border-zinc-50">
          <h3 className="text-[16px] font-bold text-black">Management</h3>
        </div>
        
        <div className="divide-y divide-zinc-50">
          {attributes.map((attr) => (
            <div key={attr.id} className="flex items-center justify-between p-6 hover:bg-zinc-50/50 transition-colors group">
              <div className="flex items-center gap-4">
                <GripVertical className="h-4 w-4 text-zinc-300 cursor-grab" />
                <div className="h-10 w-10 rounded-lg bg-zinc-50 flex items-center justify-center">
                  <Settings2 className="h-5 w-5 text-zinc-400 font-bold" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-black">{attr.name}</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {attr.values.map((v) => (
                      <span key={v} className="px-2 py-0.5 rounded-md bg-zinc-100 text-[11px] font-medium text-zinc-600">
                        {v}
                      </span>
                    ))}
                    <button className="px-2 py-0.5 rounded-md border border-dashed border-zinc-300 text-[11px] font-medium text-zinc-400 hover:text-black hover:border-black transition-all">
                      + Add value
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-6 mr-8">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Type</span>
                    <span className="text-[13px] font-medium text-black">Multiple Choice</span>
                  </div>
                </div>
                <button className="p-2 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-zinc-900 p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-[18px] font-bold">New Attribute Suggestions?</h3>
            <p className="mt-1 text-zinc-400 text-[14px]">Define how customers filter and customize your products.</p>
          </div>
          <button className="h-11 rounded-lg bg-white px-6 text-[14px] font-bold text-black hover:bg-zinc-100 transition-all">
            Open Creator Tool
          </button>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      </div>
    </div>
  );
}
