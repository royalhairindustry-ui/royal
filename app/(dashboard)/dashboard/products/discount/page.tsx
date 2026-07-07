"use client";

import React from "react";
import { Percent, Calendar, Plus, Tag } from "lucide-react";

export default function DiscountPage() {
  return (
    <div className="max-w-[1000px] space-y-8">
      <div>
        <h1 className="text-[24px] font-bold text-black">Category Discounts</h1>
        <p className="text-[14px] text-zinc-500">Apply promotional offers to entire product categories.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Active Discounts */}
        <div className="space-y-6">
          <h3 className="text-[16px] font-bold text-black">Active Promotions</h3>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="group relative rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Percent className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-black">
                        {i === 1 ? "Easter Special - Braids" : "Flash Sale - Accessories"}
                      </h4>
                      <div className="mt-1 flex items-center gap-3 text-[12px] text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {i === 1 ? "Braids" : "Accessories"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Ends in 3 days
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[18px] font-bold text-emerald-600">{i === 1 ? "15%" : "25%"} OFF</p>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Fixed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Discount Form */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-[18px] font-bold text-black">New Category Discount</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-2">Select Category</label>
              <select className="w-full h-11 rounded-xl bg-zinc-50 px-4 text-[14px] outline-none border border-transparent focus:border-black/10 focus:bg-white appearance-none transition-all">
                <option>Braids</option>
                <option>Crochet</option>
                <option>Weaves</option>
              </select>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-2">Discount Type</label>
                <select className="w-full h-11 rounded-xl bg-zinc-50 px-4 text-[14px] outline-none border border-transparent focus:border-black/10 focus:bg-white appearance-none transition-all">
                  <option>Percentage (%)</option>
                  <option>Fixed Amount (UGX)</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-2">Value</label>
                <input 
                  type="text" 
                  placeholder="0"
                  className="w-full h-11 rounded-xl bg-zinc-50 px-4 text-[14px] outline-none border border-transparent focus:border-black/10 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button className="mt-4 w-full h-12 rounded-xl bg-black text-[15px] font-semibold text-white hover:bg-zinc-800 transition-all">
              Apply Discount
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
