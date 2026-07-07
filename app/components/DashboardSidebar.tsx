"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  X,
  Sparkles,
  ChevronDown,
  PlusCircle,
  List,
  Upload,
  Download,
  Tag,
  Percent,
  Plus,
  Palette,
  Ruler,
  Boxes,
  Globe,
  Monitor,
  Layout,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Film
} from "lucide-react";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { 
    name: "Products", 
    icon: Package,
    children: [
      { name: "Add New Product", href: "/dashboard/products/add", icon: PlusCircle },
      { name: "All products", href: "/dashboard/products", icon: List },
      { name: "Bulk Import", href: "/dashboard/products/import", icon: Upload },
      { name: "Bulk Export", href: "/dashboard/products/export", icon: Download },
      { name: "Category", href: "/dashboard/products/category", icon: Tag },
      { name: "Category Based Discount", href: "/dashboard/products/discount", icon: Percent },
      { name: "Attribute", href: "/dashboard/products/attribute", icon: Plus },
      { name: "Colors", href: "/dashboard/products/colors", icon: Palette },
      { name: "Units", href: "/dashboard/products/units", icon: Boxes },
      { name: "Size Guide", href: "/dashboard/products/size-guide", icon: Ruler },
    ]
  },
  { 
    name: "Website Content", 
    icon: Monitor,
    children: [
      { name: "Hero Carousel", href: "/dashboard/content/hero", icon: ImageIcon },
      { name: "Product Reels", href: "/dashboard/content/reels", icon: Film },
      { name: "Featured Sections", href: "/dashboard/content/featured", icon: Layout },
      { name: "Blog Posts", href: "/dashboard/content/blog", icon: FileText },
      { name: "Category Banners", href: "/dashboard/products/category", icon: Tag },
      { name: "Header & Navbar", href: "/dashboard/content/navbar", icon: Layout },
      { name: "Privacy Policy", href: "/dashboard/content/privacy", icon: ShieldCheck },
      { name: "Terms of Service", href: "/dashboard/content/terms", icon: FileText },
    ]
  },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>(["Products"]);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[120] w-[280px] transform bg-[#0a0a0a] text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex h-[72px] items-center justify-between border-b border-zinc-800/50 px-6">
            <Link href="/" className="flex items-center gap-2" onClick={onClose}>
              <Sparkles className="h-5 w-5 text-zinc-400" />
              <span className="text-[14px] font-semibold uppercase tracking-[0.3em] text-white">
                ROYAL BRAIDS LTD
              </span>
            </Link>
            <button 
              onClick={onClose}
              className="rounded-full p-2 hover:bg-zinc-800 lg:hidden"
            >
              <X className="h-5 w-5 text-zinc-400" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6 no-scrollbar">
            {navItems.map((item) => {
              if (item.children) {
                const isMenuOpen = openMenus.includes(item.name);
                const isAnyChildActive = item.children.some(child => pathname === child.href);
                
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`group flex w-full items-center justify-between rounded-lg px-4 py-3 text-[14px] font-medium transition-all ${
                        isAnyChildActive 
                          ? "text-white" 
                          : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-4 w-4 ${isAnyChildActive ? "text-white" : "group-hover:text-white"}`} />
                        {item.name}
                      </div>
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                    
                    <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`flex items-center gap-3 rounded-lg py-2.5 pl-11 pr-4 text-[13px] font-medium transition-all ${
                              isChildActive 
                                ? "text-white" 
                                : "text-zinc-500 hover:text-white"
                            }`}
                            onClick={() => {
                              if (window.innerWidth < 1024) onClose();
                            }}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-[14px] font-medium transition-all ${
                    isActive 
                      ? "bg-white text-black" 
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                >
                  <item.icon className={`h-4 w-4 transition-colors ${isActive ? "text-black" : "group-hover:text-white"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer / User Session */}
          <div className="border-t border-zinc-800/50 p-4">
            <Link
              href="/login"
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[14px] font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
            >
              <LogOut className="h-4 w-4 text-zinc-400 group-hover:text-white" />
              Logout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
