"use client";

import React, { useState, useRef } from "react";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff, 
  Save, 
  Settings, 
  Image as ImageIcon, 
  Type,
  Link as LinkIcon,
  RefreshCcw,
  Layout,
  Upload,
  X
} from "lucide-react";
import { Reorder } from "framer-motion";
import { 
  updateSiteSettings, 
  updateTopbarMessages, 
  updateNavbarItems,
  addTopbarMessage,
  deleteTopbarMessage,
  addNavbarItem,
  deleteNavbarItem
} from "@/app/actions/headerActions";

export default function HeaderDashboardClient({ 
  initialTopbar, 
  initialNav, 
  initialSettings 
}: { 
  initialTopbar: any[], 
  initialNav: any[], 
  initialSettings: any 
}) {
  // States
  const [topbar, setTopbar] = useState(initialTopbar);
  const [nav, setNav] = useState(initialNav);
  const [settings, setSettings] = useState(initialSettings || { logoUrl: "", ugFlagUrl: "", contactEmail: "", contactPhone: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"logo" | "topbar" | "navbar">("logo");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Logo handlers
  const handleSettingChange = (field: string, value: string) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary upload is not configured.");
      return;
    }

    setIsUploading(true);
    try {
      const payload = new FormData();
      payload.append("file", file);
      payload.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: payload }
      );

      const data = await response.json();
      if (data.secure_url) {
        setSettings({ ...settings, logoUrl: data.secure_url });
      }
    } catch (error) {
      console.error("Logo upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await updateSiteSettings(settings);
    setIsSaving(false);
  };

  // Topbar handlers
  const handleAddTopbar = async () => {
    const result = await addTopbarMessage("New Promotional Message");
    if (result.success) window.location.reload();
  };

  const handleDeleteTopbar = async (id: number) => {
    const result = await deleteTopbarMessage(id);
    if (result.success) window.location.reload();
  };

  const handleSaveTopbar = async () => {
    setIsSaving(true);
    await updateTopbarMessages(topbar.map((m, i) => ({ ...m, order: i })));
    setIsSaving(false);
  };

  // Navbar handlers
  const handleAddNav = async () => {
    const result = await addNavbarItem("New Link", "/products");
    if (result.success) window.location.reload();
  };

  const handleDeleteNav = async (id: number) => {
    const result = await deleteNavbarItem(id);
    if (result.success) window.location.reload();
  };

  const handleSaveNav = async () => {
    setIsSaving(true);
    await updateNavbarItems(nav.map((n, i) => ({ ...n, order: i })));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Menu / Tabs */}
      <div className="flex gap-2 p-1 bg-zinc-100/50 rounded-xl w-fit">
        {[
          { id: "logo", icon: <ImageIcon className="h-4 w-4" />, label: "Branding" },
          { id: "topbar", icon: <Type className="h-4 w-4" />, label: "Top Bar" },
          { id: "navbar", icon: <Layout className="h-4 w-4" />, label: "Main Nav" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id ? "bg-black text-white shadow-md scale-[1.02]" : "text-zinc-500 hover:text-black hover:bg-zinc-100"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm min-h-[500px] overflow-hidden">
        
        {/* TAB: Logo & Branding */}
        {activeTab === "logo" && (
          <div className="p-8 max-w-[600px] animate-in fade-in duration-500">
            <h3 className="text-[18px] font-bold text-black mb-6">Site Branding & Contact</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Website Logo</label>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleLogoUpload}
                />
                
                {settings.logoUrl ? (
                  <div className="relative group w-fit">
                    <div className="relative h-32 w-64 rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition-all group-hover:border-black flex items-center justify-center overflow-hidden">
                      <img src={settings.logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                          <RefreshCcw className="h-6 w-6 animate-spin text-black" />
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => setSettings({ ...settings, logoUrl: "" })}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 text-[12px] font-bold text-black underline underline-offset-4 hover:opacity-70"
                    >
                      Change Logo
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex h-32 w-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-300 transition-all group"
                  >
                    {isUploading ? (
                      <RefreshCcw className="h-6 w-6 animate-spin text-zinc-300" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-zinc-300 group-hover:text-black transition-colors mb-2" />
                        <span className="text-[13px] font-bold text-zinc-400 group-hover:text-black transition-colors">Upload Logo</span>
                        <span className="text-[11px] text-zinc-400">PNG or SVG recommended</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[12px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Alternative Logo URL (Optional)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-300" />
                  <input 
                    type="text" 
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-zinc-200 outline-none focus:border-black transition-all text-[14px]"
                    value={settings.logoUrl || ""} 
                    onChange={e => handleSettingChange("logoUrl", e.target.value)}
                    placeholder="Enter Cloudinary or external URL"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Contact Phone</label>
                  <input 
                    type="text" 
                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 outline-none focus:border-black transition-all text-[14px]"
                    value={settings.contactPhone || ""} 
                    onChange={e => handleSettingChange("contactPhone", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Contact Email</label>
                  <input 
                    type="text" 
                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 outline-none focus:border-black transition-all text-[14px]"
                    value={settings.contactEmail || ""} 
                    onChange={e => handleSettingChange("contactEmail", e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-black px-8 text-[14px] font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800 disabled:bg-zinc-200"
              >
                {isSaving ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Branding
              </button>
            </div>
          </div>
        )}

        {/* TAB: Top Bar */}
        {activeTab === "topbar" && (
          <div className="p-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-[18px] font-bold text-black">Topbar Marquee Content</h3>
                <p className="text-[13px] text-zinc-400">Manage the sliding promotional messages at the very top of site.</p>
              </div>
              <button 
                onClick={handleAddTopbar}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-black px-4 text-[12px] font-bold uppercase tracking-widest text-black transition hover:bg-black hover:text-white"
              >
                <Plus className="h-4 w-4" /> Add Message
              </button>
            </div>

            <Reorder.Group axis="y" values={topbar} onReorder={setTopbar} className="space-y-3">
              {topbar.map((msg) => (
                <Reorder.Item 
                  key={msg.id} 
                  value={msg}
                  className="flex items-center gap-4 p-4 rounded-xl border border-zinc-100 bg-zinc-50/30 group hover:border-black transition-all"
                >
                  <GripVertical className="h-5 w-5 text-zinc-300 cursor-grab active:cursor-grabbing group-hover:text-black transition-colors" />
                  <input 
                    type="text" 
                    className="flex-1 bg-transparent text-[14px] font-medium outline-none focus:text-black"
                    value={msg.text}
                    onChange={e => {
                      const updated = topbar.map(m => m.id === msg.id ? { ...m, text: e.target.value } : m);
                      setTopbar(updated);
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const updated = topbar.map(m => m.id === msg.id ? { ...m, isVisible: !m.isVisible } : m);
                        setTopbar(updated);
                      }}
                      className={`h-9 w-9 flex items-center justify-center rounded-lg ${msg.isVisible ? "text-emerald-500 hover:bg-emerald-50" : "text-zinc-300 hover:bg-zinc-100 hover:text-black"}`}
                    >
                      {msg.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button 
                      onClick={() => handleDeleteTopbar(msg.id)}
                      className="h-9 w-9 flex items-center justify-center rounded-lg text-rose-300 hover:text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <div className="mt-8 pt-8 border-t border-zinc-50">
              <button 
                onClick={handleSaveTopbar}
                disabled={isSaving}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-black px-8 text-[14px] font-bold uppercase tracking-widest text-white"
              >
                <Save className="h-4 w-4" /> Save Topbar Config
              </button>
            </div>
          </div>
        )}

        {/* TAB: Main Nav */}
        {activeTab === "navbar" && (
          <div className="p-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-[18px] font-bold text-black">Main Navigation Links</h3>
                <p className="text-[13px] text-zinc-400">Manage the core menu links below the logo.</p>
              </div>
              <button 
                onClick={handleAddNav}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-black px-4 text-[12px] font-bold uppercase tracking-widest text-black transition hover:bg-black hover:text-white"
              >
                <Plus className="h-4 w-4" /> Add Link
              </button>
            </div>

            <Reorder.Group axis="y" values={nav} onReorder={setNav} className="space-y-3">
              {nav.map((item) => (
                <Reorder.Item 
                  key={item.id} 
                  value={item}
                  className="flex items-center gap-4 p-4 rounded-xl border border-zinc-100 bg-zinc-50/30 group hover:border-black transition-all"
                >
                  <GripVertical className="h-5 w-5 text-zinc-300 cursor-grab active:cursor-grabbing group-hover:text-black transition-colors" />
                  <div className="flex flex-1 gap-4">
                    <div className="relative flex-1">
                      <Settings className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                      <input 
                        type="text" 
                        className="w-full h-10 pl-9 pr-3 rounded-lg border border-zinc-100 bg-white text-[14px] font-bold uppercase tracking-tight outline-none focus:border-black"
                        value={item.name}
                        onChange={e => {
                          const updated = nav.map(n => n.id === item.id ? { ...n, name: e.target.value } : n);
                          setNav(updated);
                        }}
                      />
                    </div>
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                      <input 
                        type="text" 
                        className="w-full h-10 pl-9 pr-3 rounded-lg border border-zinc-100 bg-white text-[13px] font-medium outline-none focus:border-black"
                        value={item.href}
                        onChange={e => {
                          const updated = nav.map(n => n.id === item.id ? { ...n, href: e.target.value } : n);
                          setNav(updated);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const updated = nav.map(n => n.id === item.id ? { ...n, isVisible: !n.isVisible } : n);
                        setNav(updated);
                      }}
                      className={`h-9 w-9 flex items-center justify-center rounded-lg ${item.isVisible ? "text-emerald-500" : "text-zinc-300"}`}
                    >
                      {item.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button 
                      onClick={() => handleDeleteNav(item.id)}
                      className="h-9 w-9 flex items-center justify-center rounded-lg text-rose-300 hover:text-rose-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <div className="mt-8 pt-8 border-t border-zinc-50">
              <button 
                onClick={handleSaveNav}
                disabled={isSaving}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-black px-8 text-[14px] font-bold uppercase tracking-widest text-white"
              >
                <Save className="h-4 w-4" /> Save Navigation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
