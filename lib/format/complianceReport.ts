import type { ComplianceAdjustment } from "@/types/outputs";
import { ruleInfo } from "@/lib/compliance/ruleCodes";

// Builds the LinkedIn-ready compliance snippet. Pure + client-safe (no secrets,
// no server-only imports) — this is a first-class distribution feature.
export function buildComplianceReport(
  address: string,
  score: number,
  adjustments: ComplianceAdjustment[],
): string {
  const lines: string[] = [];
  lines.push(`Kerbly Compliance Check — ${address || "this listing"}`);
  lines.push(`${score}/100`);
  lines.push("");

  if (adjustments.length === 0) {
    lines.push("Changes made: none — compliance clear.");
  } else {
    lines.push("Changes made:");
    for (const a of adjustments) {
      const info = ruleInfo(a.rule_code);
      const revised = a.revised && a.revised.trim() ? `"${a.revised}"` : "REMOVED";
      lines.push(
        `• [${a.rule_code}] "${a.original}" → ${revised} — ${a.reason} (${info.statute})`,
      );
    }
  }

  lines.push("");
  lines.push("Compliance assistance only — not legal advice. kerbly.co.uk");
  return lines.join("\n");
}
