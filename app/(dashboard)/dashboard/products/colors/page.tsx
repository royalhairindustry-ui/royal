"use client";

import React from "react";
import { Palette, Plus, Search, Trash2 } from "lucide-react";

const colorPalette = [
  { id: 1, name: "Jet Black", hex: "#000000", code: "1", products: 45 },
  { id: 2, name: "Dark Brown", hex: "#3D2B1F", code: "2", products: 32 },
  { id: 3, name: "Auburn", hex: "#722620", code: "33", products: 18 },
  { id: 4, name: "Honey Blonde", hex: "#D4AF37", code: "27", products: 24 },
  { id: 5, name: "Platinum", hex: "#E5E4E2", code: "613", products: 12 },
  { id: 6, name: "Copper", hex: "#B87333", code: "350", products: 9 },
];

export default function ColorsPage() {
  return (
    <div className="max-w-[1000px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-black">Color Management</h1>
          <p className="text-[14px] text-zinc-500">Manage the hair color palette for your collections.</p>
        </div>
        <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-black px-5 text-[14px] font-medium text-white transition-all hover:bg-zinc-800">
          <Plus className="h-4 w-4" />
          Add Color
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Color Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search colors..." 
                className="w-full h-10 rounded-xl bg-zinc-50 pl-10 pr-4 text-[13px] outline-none border border-transparent focus:border-black/5"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {colorPalette.map((color) => (
                <div key={color.id} className="group relative rounded-xl border border-zinc-50 bg-white p-4 hover:border-black/10 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-4">
                    <div 
                      className="h-12 w-12 rounded-lg shadow-inner flex items-center justify-center border border-zinc-100"
                      style={{ backgroundColor: color.hex }}
                    >
                      {color.hex === "#E5E4E2" && <Palette className="h-4 w-4 text-zinc-400 opacity-20" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-bold text-black">{color.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-medium text-zinc-400">Code: {color.code}</span>
                        <span className="text-[11px] text-zinc-300">•</span>
                        <span className="text-[11px] font-medium text-zinc-400">{color.hex}</span>
                      </div>
                    </div>
                    <button className="p-2 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Add Form */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm h-fit space-y-6">
          <h3 className="text-[16px] font-bold text-black">New Pallette Color</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-2">Color Name</label>
              <input 
                type="text" 
                placeholder="e.g. Electric Blue"
                className="w-full h-11 rounded-xl bg-zinc-50 px-4 text-[14px] outline-none border border-transparent focus:border-black/10 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-2">Hex Code</label>
                <input 
                  type="text" 
                  placeholder="#000000"
                  className="w-full h-11 rounded-xl bg-zinc-50 px-4 text-[14px] outline-none border border-transparent focus:border-black/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-2">ID Code</label>
                <input 
                  type="text" 
                  placeholder="ID"
                  className="w-full h-11 rounded-xl bg-zinc-50 px-4 text-[14px] outline-none border border-transparent focus:border-black/10 transition-all"
                />
              </div>
            </div>
            <div className="pt-2">
              <button className="w-full h-11 rounded-xl bg-black text-[14px] font-medium text-white hover:bg-zinc-800 transition-all">
                Save Color
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
