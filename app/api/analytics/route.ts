import { NextResponse } from "next/server";
import {
  recordUnlockClick,
  recordCopy,
  recordFeedback,
  snapshot,
} from "@/lib/analytics/store";
import type { UnlockOption } from "@/types/analytics";

export const runtime = "nodejs";

// GET is gated by the admin secret (the /admin page passes ?secret=...).
export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(snapshot());
}

// POST records a lightweight analytics event from the client.
export async function POST(req: Request) {
  let body: {
    type?: string;
    option?: UnlockOption;
    field?: string;
    vote?: "up" | "down";
    note?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  switch (body.type) {
    case "unlock_click":
      if (body.option === "once" || body.option === "sub") {
        recordUnlockClick(body.option);
      }
      break;
    case "copy":
      if (body.field) recordCopy(body.field);
      break;
    case "feedback":
      if (body.vote === "up" || body.vote === "down") {
        recordFeedback({ vote: body.vote, note: body.note, at: Date.now() });
      }
      break;
    default:
      return NextResponse.json({ error: "Unknown event" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
