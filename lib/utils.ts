import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Compose Tailwind class lists, deduping conflicting utilities.
 * Standard shadcn/ui helper.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
