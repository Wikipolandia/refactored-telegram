"use client";
import { useState } from "react";

export default function CopyButton({
  text,
  field,
  label = "Copy",
}: {
  text: string;
  field?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      if (field) {
        // Fire-and-forget analytics ping.
        void fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "copy", field }),
        }).catch(() => {});
      }
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
