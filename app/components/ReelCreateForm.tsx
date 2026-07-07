"use client";

import React, { useRef, useState } from "react";
import { Upload, Plus, X, Film, Image as ImageIcon, Video, Save, Loader2 } from "lucide-react";
import { createReel } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function ReelCreateForm() {
  const router = useRouter();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const [videoUrl, setVideoUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("/products");

  const [isUploading, setIsUploading] = useState(""); // "video" | "poster" | ""
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleUpload = async (file: File, type: "video" | "poster") => {
    if (!cloudName || !uploadPreset) {
      setError("Cloudinary is not configured.");
      return;
    }

    setIsUploading(type);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const resourceType = type === "video" ? "video" : "image";
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        { method: "POST", body: formData }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || "Upload failed");

      if (type === "video") setVideoUrl(data.secure_url);
      else if (type === "poster") setPosterUrl(data.secure_url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl || !title || !price) {
      setError("Please fill in all required fields and upload the video.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("video", videoUrl);
    formData.append("poster", posterUrl);
    formData.append("title", title);
    formData.append("price", price);
    formData.append("link", link);

    const result = await createReel(formData);
    if (result.success) {
      router.refresh();
      setVideoUrl("");
      setPosterUrl("");
      setTitle("");
      setPrice("");
      setLink("/products");
    } else {
      setError(result.error || "Failed to create reel");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 text-left">
        {/* Video Upload */}
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-zinc-700">Video Reel (MP4) *</label>
          <div 
            onClick={() => videoInputRef.current?.click()}
            className={`group relative flex aspect-[9/16] max-h-[400px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-100 bg-zinc-50 transition-all hover:bg-zinc-100 ${videoUrl ? "border-solid border-emerald-500/20" : ""}`}
          >
            {videoUrl ? (
              <video src={videoUrl} className="h-full w-full object-cover rounded-2xl" />
            ) : (
              <div className="flex flex-col items-center p-6 text-center">
                {isUploading === "video" ? (
                  <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                ) : (
                  <>
                    <Video className="mb-3 h-8 w-8 text-zinc-300" />
                    <p className="text-[13px] font-medium text-zinc-600">Click to upload video</p>
                    <p className="mt-1 text-[11px] text-zinc-400">Max 50MB suggested</p>
                  </>
                )}
              </div>
            )}
            {videoUrl && (
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setVideoUrl(""); }}
                className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 shadow-sm hover:bg-white"
              >
                <X className="h-4 w-4 text-black" />
              </button>
            )}
          </div>
          <input 
            type="file" 
            ref={videoInputRef} 
            className="hidden" 
            accept="video/mp4,video/quicktime" 
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "video")}
          />
        </div>

        <div className="space-y-6">
          {/* Info Fields */}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-zinc-600">Product Title *</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Fenty Eau de Parfum"
                className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-zinc-600">Display Price *</label>
              <input 
                type="text" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="e.g. Ush 650,000"
                className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-zinc-600">Product Link</label>
              <input 
                type="text" 
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/products/your-slug"
                className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !!isUploading}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black px-8 text-[15px] font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Save className="h-5 w-5" />
        )}
        {isSubmitting ? "Saving Reel..." : "Publish Product Reel"}
      </button>
    </form>
  );
}
