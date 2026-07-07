"use client";

import React from "react";
import { Download, FileSpreadsheet, Settings2 } from "lucide-react";

export default function BulkExportPage() {
  return (
    <div className="max-w-[800px] space-y-8">
      <div>
        <h1 className="text-[24px] font-bold text-black">Bulk Export Products</h1>
        <p className="text-[14px] text-zinc-500">Download your product catalog for backup or external use.</p>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center max-w-[500px] mx-auto">
          <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
            <FileSpreadsheet className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-[20px] font-bold text-black">Ready to Export</h2>
          <p className="mt-3 text-[14px] text-zinc-500 leading-relaxed">
            Choose your preferred format and export settings. Your file will be processed and downloaded automatically.
          </p>

          <div className="mt-10 w-full space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
              <div className="flex items-center gap-3">
                <Settings2 className="h-4 w-4 text-zinc-400" />
                <span className="text-[14px] font-medium text-black">Format</span>
              </div>
              <select className="bg-transparent text-[14px] font-medium text-black outline-none cursor-pointer">
                <option>CSV (.csv)</option>
                <option>Excel (.xlsx)</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
              <span className="text-[14px] font-medium text-black">Include Images</span>
              <div className="h-6 w-11 rounded-full bg-black flex items-center px-1 cursor-pointer">
                <div className="h-4 w-4 rounded-full bg-white translate-x-5" />
              </div>
            </div>
          </div>

          <button className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-black px-8 h-12 text-[15px] font-semibold text-white transition-all hover:bg-zinc-800">
            <Download className="h-5 w-5" />
            Generate & Download
          </button>
          
          <p className="mt-4 text-[12px] text-zinc-400 italic">
            Note: Large catalogs may take a few moments to process.
          </p>
        </div>
      </div>
    </div>
  );
}
