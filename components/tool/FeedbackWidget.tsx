"use client";
import { useState } from "react";

export default function FeedbackWidget() {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  function send(v: "up" | "down") {
    setVote(v);
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "feedback", vote: v, note: note || undefined }),
    }).catch(() => {});
  }

  if (sent) {
    return <p className="text-sm text-slate-500">Thanks for the feedback.</p>;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">Was this useful?</span>
        <button
          type="button"
          onClick={() => send("up")}
          className={`rounded-md border px-2 py-1 text-sm ${vote === "up" ? "border-brand bg-brand-light" : "border-slate-300"}`}
        >
          👍
        </button>
        <button
          type="button"
          onClick={() => send("down")}
          className={`rounded-md border px-2 py-1 text-sm ${vote === "down" ? "border-risk bg-risk/10" : "border-slate-300"}`}
        >
          👎
        </button>
      </div>
      {vote && (
        <div className="mt-2 flex gap-2">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note"
            className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              void fetch("/api/analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "feedback", vote, note: note || undefined }),
              }).catch(() => {});
              setSent(true);
            }}
            className="rounded-md bg-ink px-3 py-1 text-sm font-medium text-white"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
