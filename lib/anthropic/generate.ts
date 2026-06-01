import "server-only";
import { getAnthropic, MODEL, MAX_TOKENS } from "./client";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { OUTPUT_SCHEMA } from "./outputSchema";
import { buildUserMessage } from "./buildUserMessage";
import type { ListingInput } from "@/types/inputs";
import type { GenerationOutput, RegeneratableField } from "@/types/outputs";

const REQUIRED_KEYS: (keyof GenerationOutput)[] = [
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
];

function firstTextBlock(content: { type: string; text?: string }[]): string {
  const block = content.find((b) => b.type === "text");
  return block?.text ?? "";
}

function isValidOutput(data: unknown): data is GenerationOutput {
  if (!data || typeof data !== "object") return false;
  const o = data as Record<string, unknown>;
  for (const key of REQUIRED_KEYS) {
    if (!(key in o)) return false;
  }
  if (!Array.isArray(o.portal_key_features)) return false;
  if (!Array.isArray(o.instagram_hashtags)) return false;
  if (!Array.isArray(o.compliance_adjustments)) return false;
  if (typeof o.portal_short !== "string") return false;
  if (typeof o.portal_full !== "string") return false;
  return true;
}

interface RawCallArgs {
  system: string;
  user: string;
  // When set, constrain output to a single-field object schema.
  singleField?: string;
}

async function rawCall({ system, user, singleField }: RawCallArgs): Promise<string> {
  const client = getAnthropic();
  const schema = singleField
    ? {
        type: "object",
        additionalProperties: false,
        properties: {
          [singleField]: (OUTPUT_SCHEMA.properties as Record<string, unknown>)[singleField],
        },
        required: [singleField],
      }
    : OUTPUT_SCHEMA;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system,
    messages: [{ role: "user", content: user }],
    // Structured output — constrains the response to valid JSON matching the schema.
    output_config: { format: { type: "json_schema", schema } },
  } as Parameters<typeof client.messages.create>[0]);

  return firstTextBlock(
    (response as { content: { type: string; text?: string }[] }).content,
  );
}

/**
 * Generate the full set of channel copy in one LLM call. Parses + validates the
 * JSON; on a malformed response, does exactly one corrective retry, then throws.
 */
export async function generateCopy(input: ListingInput): Promise<GenerationOutput> {
  const user = buildUserMessage(input);

  let text = await rawCall({ system: SYSTEM_PROMPT, user });
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = null;
  }

  if (!isValidOutput(parsed)) {
    // One corrective retry.
    text = await rawCall({
      system: SYSTEM_PROMPT,
      user: user + "\n\nReturn ONLY valid JSON matching the required schema. No prose.",
    });
    parsed = JSON.parse(text); // if this throws, the route surfaces a clean 502
    if (!isValidOutput(parsed)) {
      throw new Error("Model returned an invalid generation shape");
    }
  }

  return parsed;
}

/**
 * Regenerate a single field. Reuses the same system prompt and listing facts,
 * asking the model to rewrite only the requested field (cheaper, leaves the
 * other cards stable). The compliance card is never regenerated this way.
 */
export async function regenerateField(
  input: ListingInput,
  field: RegeneratableField,
  current: unknown,
): Promise<unknown> {
  const user =
    buildUserMessage(input) +
    `\n\nREGENERATE ONLY the "${field}" field with a fresh, different version` +
    ` (the current value was: ${JSON.stringify(current)}).` +
    ` Return JSON with just that one key.`;

  const text = await rawCall({ system: SYSTEM_PROMPT, user, singleField: field });
  const parsed = JSON.parse(text) as Record<string, unknown>;
  if (!(field in parsed)) {
    throw new Error("Model did not return the requested field");
  }
  return parsed[field];
}
