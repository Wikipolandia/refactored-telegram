"use client";
import { useState } from "react";
import type { UnlockOption } from "@/types/analytics";

interface Props {
  checkoutOnce: string;
  checkoutSub: string;
  onUnlock: (token: string) => void;
}

function trackClick(option: UnlockOption) {
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "unlock_click", option }),
  }).catch(() => {});
}

export default function PaywallGate({ checkoutOnce, checkoutSub, onUnlock }: Props) {
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function redeem() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/validate-licence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = (await res.json()) as { valid: boolean; token?: string };
      if (data.valid && data.token) {
        onUnlock(data.token);
      } else {
        setError("That licence key wasn't recognised.");
      }
    } catch {
      setError("Couldn't validate right now — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border-2 border-brand bg-white p-6 text-center shadow-lg">
      <div className="text-xs font-semibold uppercase tracking-wide text-risk">
        DMCC Act 2024 — fines up to 10% of turnover, no court needed
      </div>
      <h3 className="mt-2 text-xl font-bold text-ink">
        Your first listing is on us. Unlock unlimited to keep going.
      </h3>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a
          href={checkoutOnce}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick("once")}
          className="rounded-lg bg-brand px-4 py-3 font-semibold text-white shadow transition hover:bg-brand-dark"
        >
          Unlock unlimited — £39 one-time
        </a>
        <a
          href={checkoutSub}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick("sub")}
          className="rounded-lg border border-brand px-4 py-3 font-semibold text-brand transition hover:bg-brand-light"
        >
          Or subscribe — £19/month
        </a>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-4">
        <label className="block text-left text-xs font-medium text-slate-600">
          Already paid? Paste your licence key
        </label>
        <div className="mt-1 flex gap-2">
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Licence key"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={redeem}
            disabled={busy || !key.trim()}
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "…" : "Unlock"}
          </button>
        </div>
        {error && <p className="mt-1 text-left text-xs text-risk">{error}</p>}
      </div>
    </div>
  );
}
