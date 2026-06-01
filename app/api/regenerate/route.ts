import { NextResponse } from "next/server";
import { regenerateField } from "@/lib/anthropic/generate";
import { verifyToken } from "@/lib/licence/token";
import { clientIp } from "@/lib/http/ip";
import { rateState, recordRegenerate } from "@/lib/analytics/store";
import { REGENERATABLE_FIELDS } from "@/types/outputs";
import type { RegeneratableField } from "@/types/outputs";
import type { ListingInput } from "@/types/inputs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { input?: ListingInput; field?: string; current?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { input, field, current } = body;
  if (!input || !field) {
    return NextResponse.json({ error: "Missing input or field" }, { status: 400 });
  }
  if (!(REGENERATABLE_FIELDS as readonly string[]).includes(field)) {
    return NextResponse.json({ error: "Field cannot be regenerated" }, { status: 400 });
  }

  const ip = clientIp(req);
  const unlocked = verifyToken(req.headers.get("x-licence-token"));
  if (!unlocked && !rateState(ip).allowed) {
    return NextResponse.json(
      { error: "Free limit reached for this hour. Unlock unlimited to keep going." },
      { status: 429 },
    );
  }

  try {
    const value = await regenerateField(input, field as RegeneratableField, current);
    recordRegenerate(field);
    return NextResponse.json({ field, value });
  } catch (err) {
    console.error("[regenerate] LLM error:", err);
    return NextResponse.json(
      { error: "Regenerate failed — please try again." },
      { status: 502 },
    );
  }
}
