import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Organizer Dashboard helpers (currency, date, and local persistence)
export const naira = (value) => `\u20a6${Number(value).toLocaleString("en-NG")}`;

export const fmtDate = (date) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const load = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
