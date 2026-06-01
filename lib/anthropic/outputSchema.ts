// JSON Schema mirroring types/outputs.ts — passed to the Messages API as a
// structured-output format so the model returns parseable JSON. Schema string
// constraints (max length, item counts) are intentionally omitted: the API's
// structured-output mode does not support them, so we enforce those limits in
// the UI/validation layer instead.

export const OUTPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    portal_key_features: { type: "array", items: { type: "string" } },
    portal_short: { type: "string" },
    portal_full: { type: "string" },
    instagram_caption: { type: "string" },
    instagram_hashtags: { type: "array", items: { type: "string" } },
    facebook_post: { type: "string" },
    linkedin_post: { type: "string" },
    email_subject: { type: "string" },
    email_body: { type: "string" },
    window_headline: { type: "string" },
    window_blurb: { type: "string" },
    compliance_adjustments: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          original: { type: "string" },
          revised: { type: "string" },
          reason: { type: "string" },
          rule_code: { type: "string" },
        },
        required: ["original", "revised", "reason", "rule_code"],
      },
    },
  },
  required: [
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
    "compliance_adjustments",
  ],
} as const;
