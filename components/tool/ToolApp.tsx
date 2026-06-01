"use client";
import { useEffect, useState } from "react";
import ListingForm from "./ListingForm";
import ResultGrid from "./ResultGrid";
import PaywallGate from "./PaywallGate";
import FeedbackWidget from "./FeedbackWidget";
import { useMounted } from "@/lib/hooks/useMounted";
import { getLicenceToken, setLicenceToken } from "@/lib/storage/licence";
import { pushHistory } from "@/lib/storage/history";
import { emptyListingInput, TONE_LABELS, type ListingInput, type Tone } from "@/types/inputs";
import type { GenerationOutput, RegeneratableField } from "@/types/outputs";

interface Props {
  checkoutOnce: string;
  checkoutSub: string;
}

export default function ToolApp({ checkoutOnce, checkoutSub }: Props) {
  const mounted = useMounted();
  const [form, setForm] = useState<ListingInput>(emptyListingInput());
  const [result, setResult] = useState<Partial<GenerationOutput> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gated, setGated] = useState(false);
  const [licenceToken, setToken] = useState<string | null>(null);
  const [regenField, setRegenField] = useState<RegeneratableField | null>(null);

  useEffect(() => {
    setToken(getLicenceToken());
  }, []);

  function patch(p: Partial<ListingInput>) {
    setForm((f) => ({ ...f, ...p }));
  }

  async function generate(opts?: { input?: ListingInput; token?: string | null }) {
    const input = opts?.input ?? form;
    const token = opts?.token !== undefined ? opts.token : licenceToken;
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["x-licence-token"] = token;
      const res = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setResult(data.result);
      setGated(Boolean(data.gated));
      if (!data.gated && data.result?.portal_full) {
        pushHistory({
          at: Date.now(),
          town: input.town,
          tone: input.tone,
          result: data.result as GenerationOutput,
        });
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function regenerate(field: RegeneratableField) {
    if (!result) return;
    setRegenField(field);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (licenceToken) headers["x-licence-token"] = licenceToken;
      const res = await fetch("/api/regenerate", {
        method: "POST",
        headers,
        body: JSON.stringify({ input: form, field, current: result[field] }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult((r) => (r ? { ...r, [field]: data.value } : r));
      } else {
        setError(data.error ?? "Regenerate failed.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setRegenField(null);
    }
  }

  function onTone(tone: Tone) {
    const next = { ...form, tone };
    setForm(next);
    if (result) void generate({ input: next });
  }

  function unlock(token: string) {
    setLicenceToken(token);
    setToken(token);
    setGated(false);
    // Re-run to fetch the full set now that the user is unlocked.
    void generate({ token });
  }

  const showPaywall = mounted && gated && !licenceToken;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div>
          <ListingForm value={form} onChange={patch} onSubmit={() => generate()} loading={loading} />
        </div>

        <div className="space-y-4">
          {error && (
            <div className="rounded-lg border border-risk/30 bg-risk/10 px-4 py-3 text-sm text-risk">
              {error}
            </div>
          )}

          {result && (
            <>
              {/* Prominent tone toggle — re-runs the LLM without clearing input */}
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-3">
                <span className="text-xs font-medium text-slate-500">Tone:</span>
                {(Object.keys(TONE_LABELS) as Tone[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onTone(t)}
                    disabled={loading}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      form.tone === t
                        ? "bg-brand text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    } disabled:opacity-50`}
                  >
                    {TONE_LABELS[t]}
                  </button>
                ))}
              </div>

              <ResultGrid
                result={result}
                gated={showPaywall}
                address={form.town}
                regeneratingField={regenField}
                onRegenerate={regenerate}
                paywall={
                  <PaywallGate
                    checkoutOnce={checkoutOnce}
                    checkoutSub={checkoutSub}
                    onUnlock={unlock}
                  />
                }
              />

              {!showPaywall && <FeedbackWidget />}
            </>
          )}

          {!result && !loading && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">
              Fill in the property facts and hit{" "}
              <span className="font-medium text-slate-600">Generate</span> — your first
              listing is free.
            </div>
          )}

          {loading && !result && (
            <div className="grid gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="mt-3 h-3 w-full rounded bg-slate-100" />
                  <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
