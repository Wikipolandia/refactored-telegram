"use client";
import CopyButton from "@/components/ui/CopyButton";
import type { RegeneratableField } from "@/types/outputs";

interface Props {
  title: string;
  field: RegeneratableField;
  value: string | string[];
  // Optional live character count + amber warning above this limit.
  charLimit?: number;
  onRegenerate: (field: RegeneratableField) => void;
  regenerating: boolean;
}

function asText(value: string | string[]): string {
  return Array.isArray(value) ? value.map((v) => `• ${v}`).join("\n") : value;
}

export default function OutputCard({
  title,
  field,
  value,
  charLimit,
  onRegenerate,
  regenerating,
}: Props) {
  const text = asText(value);
  const charCount = typeof value === "string" ? value.length : null;
  const over = charLimit != null && charCount != null && charCount > charLimit;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <div className="flex items-center gap-2">
          <CopyButton text={text} field={field} />
          <button
            type="button"
            onClick={() => onRegenerate(field)}
            disabled={regenerating}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {regenerating ? "…" : "Regenerate"}
          </button>
        </div>
      </div>

      {Array.isArray(value) ? (
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          {value.map((v, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-brand">•</span>
              <span>{v}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{value}</p>
      )}

      {charLimit != null && charCount != null && (
        <div
          className={`mt-2 text-xs ${over ? "font-semibold text-warn" : "text-slate-400"}`}
        >
          {charCount}/{charLimit} characters{over ? " — over the Rightmove limit" : ""}
        </div>
      )}
    </div>
  );
}
