"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import { computeScore, scoreBand } from "@/lib/compliance/score";
import { ruleInfo } from "@/lib/compliance/ruleCodes";
import { buildComplianceReport } from "@/lib/format/complianceReport";
import type { ComplianceAdjustment } from "@/types/outputs";

const BAND_STYLES: Record<string, string> = {
  clear: "bg-clear/10 text-clear border-clear/30",
  warn: "bg-warn/10 text-warn border-warn/30",
  risk: "bg-risk/10 text-risk border-risk/30",
};

export default function ComplianceCard({
  adjustments,
  address,
}: {
  adjustments: ComplianceAdjustment[];
  address: string;
}) {
  const [open, setOpen] = useState(adjustments.length > 0);
  const { score } = computeScore(adjustments);
  const band = scoreBand(score);
  const clear = adjustments.length === 0;
  const report = buildComplianceReport(address, score, adjustments);

  return (
    <div className={`rounded-xl border-2 p-4 shadow-sm ${BAND_STYLES[band]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-bold">
            {clear
              ? "✓ Compliance clear — DMCC Act 2024 + Equality Act 2010"
              : `⚠ ${adjustments.length} phrase${adjustments.length === 1 ? "" : "s"} adjusted for compliance`}
          </div>
          <div className="mt-1 text-xs opacity-80">
            Compliance assistance only — not legal advice.
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-3xl font-extrabold leading-none">{score}</div>
          <div className="text-xs font-medium opacity-80">/ 100</div>
        </div>
      </div>

      {!clear && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-xs font-semibold underline underline-offset-2"
          >
            {open ? "Hide details" : "Show what changed"}
          </button>

          {open && (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-current/20 text-current/70">
                    <th className="py-1 pr-3 font-semibold">Original phrase</th>
                    <th className="py-1 pr-3 font-semibold">Adjusted to</th>
                    <th className="py-1 font-semibold">Rule triggered</th>
                  </tr>
                </thead>
                <tbody className="text-ink">
                  {adjustments.map((a, i) => {
                    const info = ruleInfo(a.rule_code);
                    return (
                      <tr key={i} className="border-b border-slate-200 align-top">
                        <td className="py-1.5 pr-3">{a.original}</td>
                        <td className="py-1.5 pr-3">
                          {a.revised?.trim() ? a.revised : <em>removed</em>}
                        </td>
                        <td className="py-1.5">
                          <span className="font-mono font-semibold">{a.rule_code}</span>{" "}
                          — {info.label}
                          <span className="block text-[11px] text-slate-500">
                            {info.statute}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="mt-3">
        <CopyButton text={report} field="compliance_report" label="Copy compliance report" />
      </div>
    </div>
  );
}
