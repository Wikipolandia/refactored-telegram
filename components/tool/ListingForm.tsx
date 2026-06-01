"use client";
import {
  KNOWN_ISSUES,
  TONE_LABELS,
  type ListingInput,
  type KnownIssue,
  type Tone,
} from "@/types/inputs";

interface Props {
  value: ListingInput;
  onChange: (patch: Partial<ListingInput>) => void;
  onSubmit: () => void;
  loading: boolean;
}

const inputCls =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";
const labelCls = "block text-xs font-medium text-slate-600";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="mt-0.5 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

export default function ListingForm({ value, onChange, onSubmit, loading }: Props) {
  function toggleIssue(issue: KnownIssue) {
    const has = value.known_issues.includes(issue);
    onChange({
      known_issues: has
        ? value.known_issues.filter((i) => i !== issue)
        : [...value.known_issues, issue],
    });
  }

  function setPoint(i: number, v: string) {
    const next = [...value.selling_points];
    next[i] = v;
    onChange({ selling_points: next });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Property type *">
          <select
            className={inputCls}
            value={value.property_type}
            onChange={(e) => onChange({ property_type: e.target.value as ListingInput["property_type"] })}
          >
            <option value="">Select…</option>
            {["flat", "terraced", "end-of-terrace", "semi-detached", "detached", "bungalow", "other"].map(
              (t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ),
            )}
          </select>
        </Field>
        <Field label="Price (£) *">
          <input
            className={inputCls}
            value={value.price}
            onChange={(e) => onChange({ price: e.target.value })}
            placeholder="285,000"
          />
        </Field>
      </div>

      <Field label="Town + neighbourhood *">
        <input
          className={inputCls}
          value={value.town}
          onChange={(e) => onChange({ town: e.target.value })}
          placeholder="Headingley, Leeds"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Tenure *">
          <select
            className={inputCls}
            value={value.tenure}
            onChange={(e) => onChange({ tenure: e.target.value as ListingInput["tenure"] })}
          >
            <option value="">Select…</option>
            <option value="freehold">freehold</option>
            <option value="leasehold">leasehold</option>
            <option value="share of freehold">share of freehold</option>
          </select>
        </Field>
        <Field label="Chain status">
          <select
            className={inputCls}
            value={value.chain_status}
            onChange={(e) => onChange({ chain_status: e.target.value as ListingInput["chain_status"] })}
          >
            <option value="">Select…</option>
            <option value="chain-free">chain-free</option>
            <option value="in chain">in chain</option>
            <option value="part-exchange available">part-exchange available</option>
          </select>
        </Field>
      </div>

      {value.tenure === "leasehold" && (
        <div className="grid grid-cols-3 gap-3 rounded-lg bg-brand-light/50 p-3">
          <Field label="Lease yrs left *">
            <input
              className={inputCls}
              value={value.lease_years_remaining}
              onChange={(e) => onChange({ lease_years_remaining: e.target.value })}
            />
          </Field>
          <Field label="Ground rent £/yr *">
            <input
              className={inputCls}
              value={value.ground_rent}
              onChange={(e) => onChange({ ground_rent: e.target.value })}
            />
          </Field>
          <Field label="Service charge £/yr *">
            <input
              className={inputCls}
              value={value.service_charge}
              onChange={(e) => onChange({ service_charge: e.target.value })}
            />
          </Field>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        <Field label="Beds *">
          <input
            className={inputCls}
            value={value.beds}
            onChange={(e) => onChange({ beds: e.target.value })}
          />
        </Field>
        <Field label="Baths">
          <input
            className={inputCls}
            value={value.bathrooms}
            onChange={(e) => onChange({ bathrooms: e.target.value })}
          />
        </Field>
        <Field label="EPC *">
          <select
            className={inputCls}
            value={value.epc_rating}
            onChange={(e) => onChange({ epc_rating: e.target.value as ListingInput["epc_rating"] })}
          >
            <option value="">—</option>
            {["A", "B", "C", "D", "E", "F", "G"].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Council tax">
          <input
            className={inputCls}
            value={value.council_tax_band}
            onChange={(e) => onChange({ council_tax_band: e.target.value })}
          />
        </Field>
      </div>

      <Field label="Room highlights" hint="e.g. large open-plan kitchen-diner, dual-aspect sitting room, home office">
        <textarea
          className={inputCls}
          rows={2}
          value={value.room_highlights}
          onChange={(e) => onChange({ room_highlights: e.target.value })}
        />
      </Field>

      <div>
        <label className={labelCls}>Key selling points (Rightmove shows all 10) *</label>
        <p className="mb-1 text-[11px] text-slate-400">Fill all 10 — mix property AND local lifestyle.</p>
        <div className="grid grid-cols-2 gap-2">
          {value.selling_points.map((p, i) => (
            <input
              key={i}
              className={inputCls}
              value={p}
              onChange={(e) => setPoint(i, e.target.value)}
              placeholder={`Point ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Garden / outdoor space">
          <input
            className={inputCls}
            value={value.garden}
            onChange={(e) => onChange({ garden: e.target.value })}
          />
        </Field>
        <Field label="Orientation (south-facing adds buyer appeal)">
          <select
            className={inputCls}
            value={value.garden_orientation}
            onChange={(e) =>
              onChange({ garden_orientation: e.target.value as ListingInput["garden_orientation"] })
            }
          >
            <option value="">—</option>
            {["south-facing", "north-facing", "east-facing", "west-facing", "unknown"].map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div>
        <label className={labelCls}>Known issues (must be disclosed if known)</label>
        <div className="mt-1 grid grid-cols-2 gap-1">
          {KNOWN_ISSUES.map((issue) => (
            <label key={issue} className="flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={value.known_issues.includes(issue)}
                onChange={() => toggleIssue(issue)}
              />
              {issue}
            </label>
          ))}
        </div>
        {value.known_issues.length > 0 && (
          <textarea
            className={`${inputCls} mt-2`}
            rows={2}
            placeholder="Details for the ticked issues"
            value={value.known_issues_details}
            onChange={(e) => onChange({ known_issues_details: e.target.value })}
          />
        )}
      </div>

      <Field label="Recent works / upgrades">
        <input
          className={inputCls}
          value={value.recent_works}
          onChange={(e) => onChange({ recent_works: e.target.value })}
        />
      </Field>

      <Field label="Target buyer / tone">
        <select
          className={inputCls}
          value={value.tone}
          onChange={(e) => onChange({ tone: e.target.value as Tone })}
        >
          {(Object.keys(TONE_LABELS) as Tone[]).map((t) => (
            <option key={t} value={t}>
              {TONE_LABELS[t]}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Agent name">
          <input
            className={inputCls}
            value={value.agent_name}
            onChange={(e) => onChange({ agent_name: e.target.value })}
          />
        </Field>
        <Field label="Branch">
          <input
            className={inputCls}
            value={value.branch}
            onChange={(e) => onChange({ branch: e.target.value })}
          />
        </Field>
        <Field label="Contact">
          <input
            className={inputCls}
            value={value.contact}
            onChange={(e) => onChange({ contact: e.target.value })}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white shadow transition hover:bg-brand-dark disabled:opacity-60"
      >
        {loading ? "Generating…" : "Generate listing copy"}
      </button>
    </form>
  );
}
