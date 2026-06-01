// Maps each compliance rule_code to a friendly label + the statute behind it.
// The amber adjustments table joins on this; unknown codes fall back to the raw
// string so the UI never breaks on a code the model invents.

export interface RuleInfo {
  label: string;
  statute: string;
}

export type RuleCategory = "DL" | "MP" | "MI";

export const RULE_CODES: Record<string, RuleInfo> = {
  // Misleading Property Claims
  "MP-01": { label: "Condition claim not verified for all rooms", statute: "DMCC Act 2024" },
  "MP-02": { label: "Double glazing coverage unverified", statute: "DMCC Act 2024" },
  "MP-03": { label: "Central heating coverage unverified", statute: "DMCC Act 2024" },
  "MP-04": { label: "Secluded/private garden claim unverified", statute: "DMCC Act 2024" },
  "MP-05": { label: "Peaceful/quiet claim requires verification", statute: "DMCC Act 2024" },
  "MP-06": { label: "Proximity claim requires a distance", statute: "DMCC Act 2024" },
  "MP-07": { label: "Private parking/drive ownership unverified", statute: "DMCC Act 2024" },
  "MP-08": { label: "Loft/attic described as a bedroom", statute: "DMCC Act 2024" },
  "MP-09": { label: "False urgency removed", statute: "DMCC Act 2024 Sch. 20 para. 7" },
  "MP-10": { label: "Unsubstantiated market-leader claim", statute: "DMCC Act 2024" },
  "MP-11": { label: "Journey-time estimate replaced with distance", statute: "DMCC Act 2024" },
  // Discriminatory Language
  "DL-01": { label: "Benefit-status exclusion removed", statute: "Equality Act 2010; Renters' Rights Act 2025" },
  "DL-02": { label: "'Professionals only' removed", statute: "Equality Act 2010" },
  "DL-03": { label: "Exclusion of children/families removed", statute: "Equality Act 2010" },
  "DL-04": { label: "'Couples only' family exclusion removed", statute: "Equality Act 2010" },
  "DL-05": { label: "Blanket disability exclusion removed", statute: "Equality Act 2010" },
  "DL-06": { label: "Employment-status exclusion flagged", statute: "Equality Act 2010" },
  "DL-07": { label: "Ethnic/nationality descriptor flagged", statute: "Equality Act 2010" },
  "DL-08": { label: "Religious descriptor flagged", statute: "Equality Act 2010" },
  // Missing Material Information
  "MI-01": { label: "Leasehold material information missing", statute: "NTSELAT Part B / DMCC Act 2024" },
  "MI-02": { label: "EPC rating missing", statute: "EPC Regulations (legal since 2013)" },
  "MI-03": { label: "Declared known issue not disclosed in copy", statute: "NTSELAT Part C" },
  "MI-04": { label: "Council tax band missing", statute: "NTSELAT Part A" },
  "MI-05": { label: "Price contradicted in copy", statute: "DMCC Act 2024" },
};

export function ruleInfo(code: string): RuleInfo {
  return RULE_CODES[code] ?? { label: code, statute: "Compliance rule" };
}

export function ruleCategory(code: string): RuleCategory | null {
  const prefix = code.split("-")[0]?.toUpperCase();
  if (prefix === "DL" || prefix === "MP" || prefix === "MI") return prefix;
  return null;
}
