import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Server-only singleton. The API key lives ONLY in LLM_API_KEY and is never
// exposed to the client — no `'use client'` file may import this module.
// All model traffic goes through the /api/* routes.

let cached: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!process.env.LLM_API_KEY) {
    throw new Error(
      "LLM_API_KEY is not set. Add it to .env.local (see .env.example).",
    );
  }
  if (!cached) {
    cached = new Anthropic({ apiKey: process.env.LLM_API_KEY });
  }
  return cached;
}

// Pinned in one place. claude-sonnet-4-6: fast + cost-effective for high-volume copy.
export const MODEL = "claude-sonnet-4-6";
export const MAX_TOKENS = 4000;
