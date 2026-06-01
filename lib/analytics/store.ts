import "server-only";
import type {
  AnalyticsSnapshot,
  FeedbackEntry,
  UnlockOption,
} from "@/types/analytics";
import type { Tone } from "@/types/inputs";

// Module-level singleton in-memory store. /api/* writes, /admin reads.
//
// KNOWN v1 LIMITATION: on Vercel this is lost on cold start and is not shared
// across serverless instances, so numbers are directional and the IP rate-limit
// is best-effort. A database is the v2 fix (see README v2 TODO).

interface Store {
  startOfDay: number;
  generationsTotal: number;
  generationsToday: number;
  unlockClicks: Record<UnlockOption, number>;
  cardCopies: Record<string, number>;
  regenerateCounts: Record<string, number>;
  tones: Record<string, number>;
  scoreDistribution: Record<string, number>;
  adjustmentCounts: { DL: number; MP: number; MI: number };
  perfectScores: number;
  feedback: FeedbackEntry[];
  // IP -> generation timestamps (ms), used for the free-count + rate limit.
  ipHits: Map<string, number[]>;
}

const HOUR = 60 * 60 * 1000;
const FREE_PER_HOUR = 3;

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const g = globalThis as unknown as { __kerblyStore?: Store };

function store(): Store {
  if (!g.__kerblyStore) {
    g.__kerblyStore = {
      startOfDay: startOfToday(),
      generationsTotal: 0,
      generationsToday: 0,
      unlockClicks: { once: 0, sub: 0 },
      cardCopies: {},
      regenerateCounts: {},
      tones: {},
      scoreDistribution: {},
      adjustmentCounts: { DL: 0, MP: 0, MI: 0 },
      perfectScores: 0,
      feedback: [],
      ipHits: new Map(),
    };
  }
  // Roll the "today" counter over at midnight.
  const s = g.__kerblyStore;
  if (s.startOfDay !== startOfToday()) {
    s.startOfDay = startOfToday();
    s.generationsToday = 0;
  }
  return s;
}

// --- Rate limiting / free-count (per IP, sliding 1-hour window) ---

export interface RateState {
  /** Generations used by this IP in the last hour. */
  used: number;
  /** Whether a further free generation is permitted right now. */
  allowed: boolean;
}

export function rateState(ip: string): RateState {
  const s = store();
  const now = Date.now();
  const recent = (s.ipHits.get(ip) ?? []).filter((t) => now - t < HOUR);
  s.ipHits.set(ip, recent);
  return { used: recent.length, allowed: recent.length < FREE_PER_HOUR };
}

/** Record a generation for an IP and return how many free generations remain. */
export function recordGeneration(ip: string, tone: Tone): number {
  const s = store();
  const now = Date.now();
  const recent = (s.ipHits.get(ip) ?? []).filter((t) => now - t < HOUR);
  recent.push(now);
  s.ipHits.set(ip, recent);

  s.generationsTotal += 1;
  s.generationsToday += 1;
  s.tones[tone] = (s.tones[tone] ?? 0) + 1;

  return Math.max(0, FREE_PER_HOUR - recent.length);
}

/** True if this IP has already generated at least once this hour. */
export function hasPriorGeneration(ip: string): boolean {
  return rateState(ip).used > 0;
}

// --- Other events ---

export function recordScore(
  score: number,
  counts: { DL: number; MP: number; MI: number },
): void {
  const s = store();
  const bucket = score === 100 ? "100" : `${Math.floor(score / 10) * 10}`;
  s.scoreDistribution[bucket] = (s.scoreDistribution[bucket] ?? 0) + 1;
  if (score === 100) s.perfectScores += 1;
  s.adjustmentCounts.DL += counts.DL;
  s.adjustmentCounts.MP += counts.MP;
  s.adjustmentCounts.MI += counts.MI;
}

export function recordUnlockClick(option: UnlockOption): void {
  store().unlockClicks[option] += 1;
}

export function recordCopy(field: string): void {
  const s = store();
  s.cardCopies[field] = (s.cardCopies[field] ?? 0) + 1;
}

export function recordRegenerate(field: string): void {
  const s = store();
  s.regenerateCounts[field] = (s.regenerateCounts[field] ?? 0) + 1;
}

export function recordFeedback(entry: FeedbackEntry): void {
  const s = store();
  s.feedback.unshift(entry);
  if (s.feedback.length > 200) s.feedback.length = 200;
}

export function snapshot(): AnalyticsSnapshot {
  const s = store();
  return {
    generations_total: s.generationsTotal,
    generations_today: s.generationsToday,
    unlock_clicks: { ...s.unlockClicks },
    card_copies: { ...s.cardCopies },
    regenerate_counts: { ...s.regenerateCounts },
    tones: { ...s.tones } as AnalyticsSnapshot["tones"],
    score_distribution: { ...s.scoreDistribution },
    adjustment_counts: { ...s.adjustmentCounts },
    perfect_scores: s.perfectScores,
    feedback: [...s.feedback],
  };
}

export { FREE_PER_HOUR };
