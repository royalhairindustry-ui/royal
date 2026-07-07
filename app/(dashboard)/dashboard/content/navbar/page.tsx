import prisma from "@/lib/prisma";
import HeaderDashboardClient from "@/app/components/HeaderDashboardClient";
import { Layout } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NavbarManagementPage() {
  const [topbar, nav, settings] = isDatabaseConfigured()
    ? await Promise.all([
        prisma.topbarMessage.findMany({ orderBy: { order: "asc" } }),
        prisma.headerNavItem.findMany({ orderBy: { order: "asc" } }),
        prisma.siteSettings.findUnique({ where: { id: 1 } }),
      ])
    : [[], [], null];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-xl">
          <Layout className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-[28px] font-black uppercase tracking-tight text-black">Manage Header</h1>
          <p className="text-[14px] text-zinc-400">Control the brand identity, top promotional bar, and navigation menu.</p>
        </div>
      </div>

      <HeaderDashboardClient 
        initialTopbar={topbar} 
        initialNav={nav} 
        initialSettings={settings} 
      />
    </div>
  );
}
