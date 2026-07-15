import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatParty(size: number) {
  return `${size} ${size === 1 ? "guest" : "guests"}`;
}
