import type { ComplianceAdjustment } from "@/types/outputs";
import { ruleCategory } from "./ruleCodes";

export interface ScoreBreakdown {
  score: number; // 0-100
  DL: number;
  MP: number;
  MI: number;
  total: number;
}

// score = max(0, 100 − 20×DL − 10×MP − 5×MI)
export function computeScore(adjustments: ComplianceAdjustment[]): ScoreBreakdown {
  let DL = 0;
  let MP = 0;
  let MI = 0;
  for (const a of adjustments) {
    const cat = ruleCategory(a.rule_code);
    if (cat === "DL") DL += 1;
    else if (cat === "MP") MP += 1;
    else if (cat === "MI") MI += 1;
  }
  const score = Math.max(0, 100 - 20 * DL - 10 * MP - 5 * MI);
  return { score, DL, MP, MI, total: adjustments.length };
}

export function scoreBand(score: number): "clear" | "warn" | "risk" {
  if (score >= 90) return "clear";
  if (score >= 60) return "warn";
  return "risk";
}
