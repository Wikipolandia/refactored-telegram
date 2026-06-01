import "server-only";

// THE POLAR SWAP POINT (v2).
// v1 accepts any non-empty key. To wire real Polar licence validation, replace
// the body of this one function with a call to Polar's validate endpoint — the
// HMAC token machinery in lib/licence/token.ts stays unchanged.
export async function validateLicence(
  key: string,
): Promise<{ valid: boolean; plan?: string }> {
  return { valid: key.trim().length > 0 };
}
