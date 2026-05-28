import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Argentina is UTC-3 (no DST)
export function getArgentinaDate(): Date {
  const now = new Date();
  return new Date(now.getTime() - 3 * 60 * 60 * 1000);
}

export function getArgentinaDateStr(): string {
  return getArgentinaDate().toISOString().split("T")[0];
}

export function getArgentinaDateUTC(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00.000Z");
}

