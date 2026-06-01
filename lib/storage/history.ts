import type { GenerationOutput } from "@/types/outputs";

// Guarded localStorage generation history. TODO(v2): replace with a database
// (saved generations per branch).

const KEY = "kerbly_history";
const MAX = 20;

export interface HistoryEntry {
  at: number;
  town: string;
  tone: string;
  result: GenerationOutput;
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function pushHistory(entry: HistoryEntry): void {
  if (typeof window === "undefined") return;
  try {
    const items = [entry, ...loadHistory()].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}
