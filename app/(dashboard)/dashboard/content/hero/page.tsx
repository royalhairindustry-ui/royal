import React from "react";
import { Monitor, Image as ImageIcon, Save } from "lucide-react";

export default function HeroContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-black">Hero Banners</h1>
        <p className="mt-1 text-[14px] text-zinc-500">
          Manage the promotional banners on the home page slider.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-12 shadow-sm">
        <div className="mx-auto flex max-w-[420px] flex-col items-center text-center">
          <div className="mb-6 rounded-full bg-zinc-50 p-6">
            <ImageIcon className="h-10 w-10 text-zinc-300" />
          </div>
          <h2 className="text-[20px] font-bold text-black">
            Hero Slider Management
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">
            This module is being connected to the database to allow dynamic banner updates. You will be able to upload images, set CTA links, and reorder slides here.
          </p>
          
          <button className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-black px-6 text-[14px] font-medium text-white transition hover:bg-zinc-800">
            <Save className="h-4 w-4" />
            Enable Live Updates
          </button>
        </div>
      </div>
    </div>
  );
}
