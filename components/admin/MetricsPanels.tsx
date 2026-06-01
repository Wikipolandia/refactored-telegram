import type { AnalyticsSnapshot } from "@/types/analytics";
import { TONE_LABELS, type Tone } from "@/types/inputs";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <div className="mt-3 text-sm text-slate-700">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-1 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}

export default function MetricsPanels({ data }: { data: AnalyticsSnapshot }) {
  const totalUnlock = data.unlock_clicks.once + data.unlock_clicks.sub;
  const copies = Object.entries(data.card_copies).sort((a, b) => b[1] - a[1]);
  const regens = Object.entries(data.regenerate_counts).sort((a, b) => b[1] - a[1]);
  const buckets = Object.entries(data.score_distribution).sort(
    (a, b) => Number(a[0]) - Number(b[0]),
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-bold text-ink">ListPilot — admin</h1>
      <p className="mb-6 text-xs text-slate-400">
        In-memory metrics (reset on redeploy / cold start). Directional only — DB is v2.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title="Generations">
          <Row label="Lifetime" value={data.generations_total} />
          <Row label="Today" value={data.generations_today} />
          <Row label="Perfect compliance (100)" value={data.perfect_scores} />
        </Panel>

        <Panel title="Unlock CTA — the v1 metric">
          <Row
            label="Option A · £39 one-time"
            value={`${data.unlock_clicks.once}${totalUnlock ? ` (${Math.round((data.unlock_clicks.once / totalUnlock) * 100)}%)` : ""}`}
          />
          <Row
            label="Option B · £19/month"
            value={`${data.unlock_clicks.sub}${totalUnlock ? ` (${Math.round((data.unlock_clicks.sub / totalUnlock) * 100)}%)` : ""}`}
          />
        </Panel>

        <Panel title="Compliance adjustments by category">
          <Row label="DL — discriminatory language" value={data.adjustment_counts.DL} />
          <Row label="MP — misleading property claims" value={data.adjustment_counts.MP} />
          <Row label="MI — missing material info" value={data.adjustment_counts.MI} />
        </Panel>

        <Panel title="Compliance score distribution">
          {buckets.length ? (
            buckets.map(([b, n]) => (
              <Row key={b} label={b === "100" ? "100" : `${b}–${Number(b) + 9}`} value={n} />
            ))
          ) : (
            <p className="text-slate-400">No data yet.</p>
          )}
        </Panel>

        <Panel title="Cards copied most">
          {copies.length ? (
            copies.map(([f, n]) => <Row key={f} label={f} value={n} />)
          ) : (
            <p className="text-slate-400">No data yet.</p>
          )}
        </Panel>

        <Panel title="Regenerate counts">
          {regens.length ? (
            regens.map(([f, n]) => <Row key={f} label={f} value={n} />)
          ) : (
            <p className="text-slate-400">No data yet.</p>
          )}
        </Panel>

        <Panel title="Tones chosen">
          {(Object.keys(TONE_LABELS) as Tone[]).map((t) => (
            <Row key={t} label={TONE_LABELS[t]} value={data.tones[t] ?? 0} />
          ))}
        </Panel>

        <Panel title="Feedback">
          {data.feedback.length ? (
            <ul className="space-y-1">
              {data.feedback.slice(0, 20).map((f, i) => (
                <li key={i} className="text-xs">
                  {f.vote === "up" ? "👍" : "👎"} {f.note}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400">No feedback yet.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
