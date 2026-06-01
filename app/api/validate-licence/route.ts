import { NextResponse } from "next/server";
import { validateLicence } from "@/lib/licence/validate";
import { makeToken } from "@/lib/licence/token";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { key?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const key = body.key ?? "";
  const { valid, plan } = await validateLicence(key);
  if (!valid) {
    return NextResponse.json({ valid: false }, { status: 200 });
  }

  // Issue an HMAC-signed unlock token the client stores and replays as
  // the x-licence-token header on /api/generate.
  return NextResponse.json({ valid: true, token: makeToken(key), plan: plan ?? null });
}
