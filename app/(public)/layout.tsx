import FentyHeader from "../components/FentyHeader";
import RoyalBridalsFooter from "../components/RoyalBridalsFooter";
import ChatBot from "../components/ChatBot";
import prisma from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let topbar: { text: string }[] = [];
  let nav: { name: string; href: string }[] = [];
  let settings: {
    logoUrl: string | null;
    ugFlagUrl: string | null;
    contactPhone: string | null;
  } | null = null;

  if (isDatabaseConfigured()) {
    try {
      const [topbarData, navData, settingsData] = await Promise.all([
        prisma.topbarMessage.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
        prisma.headerNavItem.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
        prisma.siteSettings.findUnique({ where: { id: 1 } }),
      ]);
      topbar = topbarData;
      nav = navData;
      settings = settingsData;
    } catch (error) {
      console.error("Failed to fetch public layout data:", error);
    }
  }

  const promoMessages = topbar.map((m) => m.text);
  const navLinks = nav.map((n) => ({ name: n.name, href: n.href }));

  return (
    <>
      <FentyHeader 
        promoMessages={promoMessages} 
        navLinks={navLinks} 
        settings={settings} 
      />
      {children}
      <ChatBot
        logoUrl={settings?.logoUrl ?? undefined}
        phoneNumber={settings?.contactPhone ?? undefined}
      />
      <RoyalBridalsFooter />
    </>
  );
}
