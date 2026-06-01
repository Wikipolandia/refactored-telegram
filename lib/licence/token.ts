import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// HMAC-signed unlock token. /api/validate-licence issues one for a valid key;
// the client sends it as the `x-licence-token` header on /api/generate, and the
// server verifies it here. No new dependency — Node's built-in crypto only.

function secret(): string {
  return process.env.LICENCE_SECRET ?? "listpilot-dev-secret";
}

export function signLicence(key: string): string {
  return createHmac("sha256", secret()).update(key.trim()).digest("hex");
}

// The token IS the HMAC of the licence key. To verify, we can't re-derive
// without the key, so the token is self-validating: a token is valid iff it is
// a well-formed HMAC produced with our secret. We verify by re-signing the
// embedded payload. For v1 (any non-empty key), we store key+sig as "key.sig"
// and check the signature matches.
export function makeToken(key: string): string {
  const sig = signLicence(key);
  // base64url so it travels safely in a header
  return Buffer.from(`${key.trim()}.${sig}`).toString("base64url");
}

export function verifyToken(token: string | null | undefined): boolean {
  if (!token) return false;
  let decoded: string;
  try {
    decoded = Buffer.from(token, "base64url").toString("utf8");
  } catch {
    return false;
  }
  const idx = decoded.lastIndexOf(".");
  if (idx <= 0) return false;
  const key = decoded.slice(0, idx);
  const sig = decoded.slice(idx + 1);
  const expected = signLicence(key);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
