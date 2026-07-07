"use client";

import React from "react";
import { Ruler, Plus, Edit, Trash2, Info } from "lucide-react";

const sizeGuides = [
  { id: 1, type: "Braids", sizes: ["Shoulder (12\")", "Mid-back (18\")", "Waist (24\")", "Hip (30\")"], packs: "3-5 packs" },
  { id: 2, type: "Weaves", sizes: ["10-12\"", "14-16\"", "18-20\"", "22-24\""], packs: "2-3 bundles" },
  { id: 3, type: "Crochet", sizes: ["Regular", "Premium Long"], packs: "4-6 packs" },
];

export default function SizeGuidePage() {
  return (
    <div className="max-w-[1000px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-black">Size Guides</h1>
          <p className="text-[14px] text-zinc-500">Define how sizes are displayed and recommended to customers.</p>
        </div>
        <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-black px-5 text-[14px] font-medium text-white transition-all hover:bg-zinc-800">
          <Plus className="h-4 w-4" />
          Create Guide
        </button>
      </div>

      <div className="grid gap-6">
        {sizeGuides.map((guide) => (
          <div key={guide.id} className="rounded-2xl border border-zinc-100 bg-white overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-zinc-50 bg-zinc-50/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Ruler className="h-5 w-5 text-black" />
                </div>
                <h3 className="text-[16px] font-bold text-black">{guide.type} Size Chart</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-zinc-400 hover:text-black transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[12px] font-semibold uppercase tracking-wider text-zinc-400">
                    <th className="pb-4">Label / Length</th>
                    <th className="pb-4">Usage Recommendation</th>
                    <th className="pb-4 text-right">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {guide.sizes.map((size) => (
                    <tr key={size} className="group transition-colors">
                      <td className="py-4 text-[14px] font-medium text-black">{size}</td>
                      <td className="py-4 text-[14px] text-zinc-500">{guide.packs}</td>
                      <td className="py-4 text-right">
                        <span className="inline-flex h-2 w-12 rounded-full bg-zinc-100 relative overflow-hidden">
                          <span className="absolute left-0 top-0 h-full bg-emerald-500 w-2/3" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-zinc-50/50 flex items-center gap-3">
              <Info className="h-4 w-4 text-zinc-400" />
              <p className="text-[12px] text-zinc-500 italic">This guide will be visible on all {guide.type} product pages.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
