// The strict JSON shape returned by the LLM in a single call. Shared by the
// API route, the validator, the result cards, and the regenerate allowlist.

export interface ComplianceAdjustment {
  original: string;
  revised: string;
  reason: string;
  rule_code: string; // e.g. "MP-06", "DL-01", "MI-02"
}

export interface GenerationOutput {
  portal_key_features: string[]; // 10 bullets, each <= 50 chars
  portal_short: string; // <= 300 chars
  portal_full: string;
  instagram_caption: string;
  instagram_hashtags: string[]; // 8-12
  facebook_post: string;
  linkedin_post: string;
  email_subject: string;
  email_body: string;
  window_headline: string;
  window_blurb: string;
  compliance_adjustments: ComplianceAdjustment[];
}

// Fields that can be individually regenerated via /api/regenerate.
// The compliance card is deliberately NOT here — it regenerates as a full re-run
// (compliance depends on the whole listing).
export const REGENERATABLE_FIELDS = [
  "portal_key_features",
  "portal_short",
  "portal_full",
  "instagram_caption",
  "instagram_hashtags",
  "facebook_post",
  "linkedin_post",
  "email_subject",
  "email_body",
  "window_headline",
  "window_blurb",
] as const;

export type RegeneratableField = (typeof REGENERATABLE_FIELDS)[number];

// The subset of fields returned to a locked user on their 2nd+ generation.
export const PREVIEW_FIELDS = [
  "portal_short",
  "portal_full",
  "portal_key_features",
] as const;

export type PreviewField = (typeof PREVIEW_FIELDS)[number];
