"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import { Menu, Search, Bell, User } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white font-sans text-black">
      {/* Sidebar */}
      <DashboardSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Dashboard Header */}
        <header className="flex h-[72px] items-center justify-between border-b border-zinc-100 bg-white px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-full p-2 hover:bg-zinc-100 lg:hidden"
            >
              <Menu className="h-6 w-6 text-zinc-600" />
            </button>
            <div className="hidden relative md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="h-10 w-[240px] rounded-full bg-zinc-100 pl-10 pr-4 text-[14px] outline-none transition-all focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-zinc-200 px-4 py-2 text-[13px] font-medium text-zinc-700 transition hover:border-black hover:text-black lg:inline-flex"
            >
              Back to Website
            </Link>
            <button className="rounded-full p-2 hover:bg-zinc-100">
              <Bell className="h-5 w-5 text-zinc-600" />
            </button>
            <div className="h-8 w-[1px] bg-zinc-200" />
            <button className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-zinc-100 md:px-2">
              <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden text-[14px] font-medium md:block">Admin</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/50 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
