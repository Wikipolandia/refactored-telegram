// Guarded localStorage access for the unlock token. SSR-safe (no-ops on the
// server / in private mode).

const KEY = "kerbly_licence_token";

export function getLicenceToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setLicenceToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, token);
  } catch {
    /* ignore quota / private-mode errors */
  }
}

export function clearLicenceToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
