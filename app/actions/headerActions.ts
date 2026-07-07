"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Site Settings (Logo, etc)
export async function updateSiteSettings(data: { logoUrl?: string; ugFlagUrl?: string; contactEmail?: string; contactPhone?: string }) {
  try {
    await (prisma as any).siteSettings.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update site settings:", error);
    return { success: false, error: "Failed to update site settings" };
  }
}

// Topbar Messages
export async function updateTopbarMessages(messages: { id: number; text: string; order: number; isVisible: boolean }[]) {
  try {
    for (const msg of messages) {
      await (prisma as any).topbarMessage.update({
        where: { id: msg.id },
        data: { text: msg.text, order: msg.order, isVisible: msg.isVisible },
      });
    }
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update topbar messages:", error);
    return { success: false, error: "Failed to update topbar messages" };
  }
}

export async function addTopbarMessage(text: string) {
  try {
    await (prisma as any).topbarMessage.create({
      data: { text, isVisible: true },
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to add message" };
  }
}

export async function deleteTopbarMessage(id: number) {
  try {
    await (prisma as any).topbarMessage.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete message" };
  }
}

// Navbar Items
export async function updateNavbarItems(items: { id: number; name: string; href: string; order: number; isVisible: boolean }[]) {
  try {
    for (const item of items) {
      await (prisma as any).headerNavItem.update({
        where: { id: item.id },
        data: { name: item.name, href: item.href, order: item.order, isVisible: item.isVisible },
      });
    }
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update navbar items:", error);
    return { success: false, error: "Failed to update navbar items" };
  }
}

export async function addNavbarItem(name: string, href: string) {
  try {
    await (prisma as any).headerNavItem.create({
      data: { name, href, isVisible: true },
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to add nav item" };
  }
}

export async function deleteNavbarItem(id: number) {
  try {
    await (prisma as any).headerNavItem.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete nav item" };
  }
}
