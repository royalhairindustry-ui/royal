"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateHomeSections(sections: { id: number; order: number; isVisible: boolean }[]) {
  try {
    for (const section of sections) {
      await prisma.homeSection.update({
        where: { id: section.id },
        data: {
          order: section.order,
          isVisible: section.isVisible,
        },
      });
    }
    revalidatePath("/");
    revalidatePath("/dashboard/content/featured");
    return { success: true };
  } catch (error) {
    console.error("Failed to update home sections:", error);
    return { success: false, error: "Failed to update home sections" };
  }
}
