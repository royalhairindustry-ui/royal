"use client";

import React, { useState } from "react";
import { 
  Eye, 
  EyeOff, 
  GripVertical, 
  Save, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  Layout,
  RefreshCcw
} from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import { updateHomeSections } from "@/app/actions/contentActions";

interface HomeSection {
  id: number;
  type: string;
  title: string;
  order: number;
  isVisible: boolean;
}

export default function FeaturedSectionsClient({ initialSections }: { initialSections: HomeSection[] }) {
  const [sections, setSections] = useState(initialSections);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const toggleVisibility = (id: number) => {
    setSections(prev => 
      prev.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s)
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    // Prepare sections with updated order
    const updatedSections = sections.map((s, index) => ({
      id: s.id,
      order: index,
      isVisible: s.isVisible
    }));

    const result = await updateHomeSections(updatedSections);

    if (result.success) {
      setMessage({ text: "Home page sections successfully updated!", type: "success" });
    } else {
      setMessage({ text: "Failed to save changes. Please try again.", type: "error" });
    }
    
    setIsSaving(false);
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          message.type === "success" 
            ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
            : "bg-rose-50 border-rose-100 text-rose-800"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <p className="text-[14px] font-medium">{message.text}</p>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-100 bg-white p-1 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-black flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Section Configurator
            </h2>
            <p className="text-[13px] text-zinc-500 mt-0.5">Drag to reorder sections. Use the eye icon to hide/show on home page.</p>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-black px-4 text-[13px] font-semibold text-white transition hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {isSaving ? "Saving..." : "Save Configuration"}
          </button>
        </div>

        <div className="p-6">
          <Reorder.Group 
            axis="y" 
            values={sections} 
            onReorder={setSections}
            className="space-y-3"
          >
            {sections.map((section) => (
              <Reorder.Item 
                key={section.id} 
                value={section}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  section.isVisible 
                    ? "bg-white border-zinc-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)]" 
                    : "bg-zinc-50 border-zinc-100 opacity-60"
                }`}
              >
                <div className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-black transition">
                  <GripVertical className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-black uppercase tracking-tight">
                      {section.title}
                    </span>
                    {!section.isVisible && (
                      <span className="text-[10px] font-bold bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded uppercase tracking-widest">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 uppercase tracking-widest mt-0.5">
                    Component: {section.type}
                  </p>
                </div>

                <button 
                  onClick={() => toggleVisibility(section.id)}
                  className={`h-9 w-9 flex items-center justify-center rounded-lg transition-colors ${
                    section.isVisible 
                      ? "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-black" 
                      : "bg-black text-white hover:bg-zinc-800"
                  }`}
                >
                  {section.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>

      <div className="rounded-2xl bg-[#f4f4f2] p-6 flex gap-4">
        <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-black/5">
          <Info className="h-5 w-5 text-black" />
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-black uppercase tracking-tight">System Notice</h4>
          <p className="text-[13px] text-zinc-600 mt-1 leading-relaxed">
            The changes made here are applied live and globally. For sections like "Featured Categories", ensure you have designated at least one category as "Featured" with a banner image in the Category Manager.
          </p>
        </div>
      </div>
    </div>
  );
}
