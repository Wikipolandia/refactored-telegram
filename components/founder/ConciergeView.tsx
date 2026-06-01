"use client";
import { useEffect, useState } from "react";
import ListingForm from "@/components/tool/ListingForm";
import CopyButton from "@/components/ui/CopyButton";
import Logo from "@/components/ui/Logo";
import { computeScore } from "@/lib/compliance/score";
import { buildComplianceReport } from "@/lib/format/complianceReport";
import { emptyListingInput, type ListingInput } from "@/types/inputs";
import type { GenerationOutput } from "@/types/outputs";

function buildExport(input: ListingInput, r: GenerationOutput): string {
  const { score } = computeScore(r.compliance_adjustments);
  const lines: string[] = [];
  lines.push(`LISTING PACK — ${input.town} — ${input.price}`);
  lines.push(`Compliance score: ${score}/100`);
  lines.push("");
  lines.push("KEY FEATURES");
  r.portal_key_features.forEach((f) => lines.push(`• ${f}`));
  lines.push("");
  lines.push("RIGHTMOVE SUMMARY");
  lines.push(r.portal_short);
  lines.push("");
  lines.push("RIGHTMOVE DESCRIPTION");
  lines.push(r.portal_full);
  lines.push("");
  lines.push("INSTAGRAM");
  lines.push(r.instagram_caption);
  lines.push((r.instagram_hashtags ?? []).map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" "));
  lines.push("");
  lines.push("FACEBOOK");
  lines.push(r.facebook_post);
  lines.push("");
  lines.push("LINKEDIN");
  lines.push(r.linkedin_post);
  lines.push("");
  lines.push("EMAIL");
  lines.push(r.email_subject);
  lines.push(r.email_body);
  lines.push("");
  lines.push("WINDOW CARD");
  lines.push(r.window_headline);
  lines.push(r.window_blurb);
  lines.push("");
  lines.push("---");
  lines.push(buildComplianceReport(input.town, score, r.compliance_adjustments));
  return lines.join("\n");
}

export default function ConciergeView() {
  const [form, setForm] = useState<ListingInput>(emptyListingInput());
  const [result, setResult] = useState<GenerationOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Acquire an unlock token so concierge generations are always full (no gate).
  useEffect(() => {
    void fetch("/api/validate-licence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "founder-concierge" }),
    })
      .then((r) => r.json())
      .then((d) => d.token && setToken(d.token))
      .catch(() => {});
  }, []);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["x-licence-token"] = token;
      const res = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({ input: form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Generation failed.");
        return;
      }
      setResult(data.result as GenerationOutput);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  const exportText = result ? buildExport(form, result) : "";

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="no-print">
        <div className="mb-3 flex items-center gap-3">
          <Logo />
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
            concierge
          </span>
        </div>
        <h1 className="text-2xl font-bold text-ink">Concierge mode</h1>
        <p className="mb-6 text-sm text-slate-500">
          Generate a full, polished listing pack for a named agent — copy or print to
          hand-deliver.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="no-print">
          <ListingForm value={form} onChange={(p) => setForm((f) => ({ ...f, ...p }))} onSubmit={generate} loading={loading} />
        </div>

        <div>
          {error && (
            <div className="no-print mb-3 rounded-lg border border-risk/30 bg-risk/10 px-4 py-3 text-sm text-risk">
              {error}
            </div>
          )}

          {result ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="no-print mb-3 flex gap-2">
                <CopyButton text={exportText} label="Copy full pack" />
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Print
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">
                {exportText}
              </pre>
            </div>
          ) : (
            <div className="no-print rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">
              {loading ? "Generating…" : "Fill in the facts and generate a pack."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
