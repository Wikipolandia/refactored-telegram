import { NextResponse } from "next/server";
import { generateCopy } from "@/lib/anthropic/generate";
import { verifyToken } from "@/lib/licence/token";
import { clientIp } from "@/lib/http/ip";
import {
  rateState,
  hasPriorGeneration,
  recordGeneration,
  recordScore,
} from "@/lib/analytics/store";
import { computeScore } from "@/lib/compliance/score";
import { PREVIEW_FIELDS } from "@/types/outputs";
import type { GenerationOutput } from "@/types/outputs";
import type { ListingInput } from "@/types/inputs";

export const runtime = "nodejs";

// Minimal server-side validation so malformed payloads can't reach the model.
// Note: EPC and leasehold details are intentionally NOT hard-required here —
// the compliance pass (MI-01 / MI-02) is meant to warn when they're missing.
function missingRequired(input: ListingInput): string | null {
  if (!input.property_type) return "property type";
  if (!input.town?.trim()) return "town";
  if (!input.price?.trim()) return "price";
  if (!input.tenure) return "tenure";
  if (!input.beds?.trim()) return "number of bedrooms";
  return null;
}

function previewOnly(result: GenerationOutput): Record<string, unknown> {
  const preview = new Set<string>(PREVIEW_FIELDS);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(result)) {
    out[k] = preview.has(k) ? v : null;
  }
  return out;
}

export async function POST(req: Request) {
  let body: { input?: ListingInput };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const input = body.input;
  if (!input) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  const missing = missingRequired(input);
  if (missing) {
    return NextResponse.json(
      { error: `Please fill in the ${missing} field.` },
      { status: 400 },
    );
  }

  const ip = clientIp(req);
  const unlocked = verifyToken(req.headers.get("x-licence-token"));

  // 1. Verified licence → full output, skip all limits.
  // 2. Otherwise enforce the per-IP free-generation rate limit.
  if (!unlocked && !rateState(ip).allowed) {
    return NextResponse.json(
      {
        error:
          "You've used your free generations for this hour. Unlock unlimited to keep going.",
      },
      { status: 429 },
    );
  }

  // 3. Output gate decision (computed BEFORE recording this generation).
  const firstFree = !unlocked && !hasPriorGeneration(ip);

  let result: GenerationOutput;
  try {
    result = await generateCopy(input);
  } catch (err) {
    console.error("[generate] LLM error:", err);
    return NextResponse.json(
      { error: "Generation failed — please try again." },
      { status: 502 },
    );
  }

  // Analytics: score distribution (always, even when output is gated).
  const breakdown = computeScore(result.compliance_adjustments);
  recordScore(breakdown.score, breakdown);
  const freeRemaining = recordGeneration(ip, input.tone);

  // Unlocked or first-free → full set. Locked 2nd+ → preview fields only.
  const payload = unlocked || firstFree ? result : previewOnly(result);

  return NextResponse.json({
    result: payload,
    free_remaining: unlocked ? null : freeRemaining,
    gated: !unlocked && !firstFree,
  });
}
