// Analytics event + snapshot shapes for the in-memory store surfaced on /admin.

import type { Tone } from "./inputs";

export type UnlockOption = "once" | "sub"; // £39 one-time vs £19/mo

export interface FeedbackEntry {
  vote: "up" | "down";
  note?: string;
  at: number;
}

export interface AnalyticsSnapshot {
  generations_total: number;
  generations_today: number;
  unlock_clicks: Record<UnlockOption, number>; // the most important v1 metric
  card_copies: Record<string, number>; // field -> copy count
  regenerate_counts: Record<string, number>; // field -> regenerate count
  tones: Record<Tone, number>;
  // Compliance score distribution, bucketed in tens (0-9, 10-19 ... 100)
  score_distribution: Record<string, number>;
  // Separate DL / MP / MI adjustment totals (over/under-flagging signal)
  adjustment_counts: { DL: number; MP: number; MI: number };
  perfect_scores: number; // how many generations hit 100
  feedback: FeedbackEntry[];
}
