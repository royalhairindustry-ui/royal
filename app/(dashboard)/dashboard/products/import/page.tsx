"use client";

import React from "react";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function BulkImportPage() {
  return (
    <div className="max-w-[800px] space-y-8">
      <div>
        <h1 className="text-[24px] font-bold text-black">Bulk Import Products</h1>
        <p className="text-[14px] text-zinc-500">Upload a CSV or Excel file to add multiple products at once.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-3 space-y-6">
          <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-2xl h-[300px] bg-zinc-50/50 hover:bg-zinc-50 transition-all cursor-pointer group">
              <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <FileText className="h-8 w-8 text-black" />
              </div>
              <h3 className="mt-6 text-[16px] font-bold text-black">Drop your file here</h3>
              <p className="mt-2 text-[13px] text-zinc-500">Maximum file size 10MB (CSV, XLSX)</p>
              
              <button className="mt-8 rounded-xl bg-black px-8 h-11 text-[14px] font-medium text-white transition-all hover:bg-zinc-800">
                Browse Files
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-black mb-4">Instructions</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <p className="text-[13px] text-zinc-600">Download the template file and fill in your data.</p>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <p className="text-[13px] text-zinc-600">Required fields: Name, Price, Category, and SKU.</p>
              </li>
              <li className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                <p className="text-[13px] text-zinc-600">Avoid duplicate SKUs as they will overwrite existing data.</p>
              </li>
            </ul>
            <button className="mt-8 w-full h-11 rounded-xl border border-black/5 bg-zinc-50 text-[14px] font-medium text-black hover:bg-zinc-100 transition-colors">
              Download Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
