"use client";
import OutputCard from "./OutputCard";
import HashtagCard from "./HashtagCard";
import ComplianceCard from "./ComplianceCard";
import type {
  GenerationOutput,
  RegeneratableField,
  ComplianceAdjustment,
} from "@/types/outputs";

interface CardDef {
  field: RegeneratableField;
  title: string;
  charLimit?: number;
}

const CARDS: CardDef[] = [
  { field: "portal_key_features", title: "Key features — Rightmove (all 10)" },
  { field: "portal_short", title: "Rightmove summary", charLimit: 300 },
  { field: "portal_full", title: "Rightmove description" },
  { field: "instagram_caption", title: "Instagram caption" },
  { field: "facebook_post", title: "Facebook post" },
  { field: "linkedin_post", title: "LinkedIn post" },
  { field: "email_subject", title: "Email subject" },
  { field: "email_body", title: "Email body" },
  { field: "window_headline", title: "Window headline" },
  { field: "window_blurb", title: "Window blurb" },
];

const LOCKED_TEASER = [
  "Instagram caption",
  "Facebook post",
  "LinkedIn post",
  "Buyer email",
  "Window card",
  "Compliance badge",
];

interface Props {
  result: Partial<GenerationOutput>;
  gated: boolean;
  address: string;
  regeneratingField: RegeneratableField | null;
  onRegenerate: (field: RegeneratableField) => void;
  paywall: React.ReactNode;
}

export default function ResultGrid({
  result,
  gated,
  address,
  regeneratingField,
  onRegenerate,
  paywall,
}: Props) {
  const adjustments = result.compliance_adjustments as ComplianceAdjustment[] | null | undefined;
  const hashtags = result.instagram_hashtags as string[] | null | undefined;

  return (
    <div className="space-y-4">
      {Array.isArray(adjustments) && (
        <ComplianceCard adjustments={adjustments} address={address} />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((c) => {
          const value = result[c.field];
          if (value == null) return null;
          return (
            <OutputCard
              key={c.field}
              title={c.title}
              field={c.field}
              value={value as string | string[]}
              charLimit={c.charLimit}
              onRegenerate={onRegenerate}
              regenerating={regeneratingField === c.field}
            />
          );
        })}

        {Array.isArray(hashtags) && <HashtagCard tags={hashtags} />}
      </div>

      {gated && (
        <div className="relative mt-2">
          {/* Blurred teaser of the locked channels */}
          <div className="pointer-events-none grid gap-4 blur-sm sm:grid-cols-2" aria-hidden>
            {LOCKED_TEASER.map((t) => (
              <div key={t} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-ink">{t}</div>
                <div className="mt-3 h-3 w-3/4 rounded bg-slate-200" />
                <div className="mt-2 h-3 w-2/3 rounded bg-slate-200" />
                <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <div className="w-full max-w-lg">{paywall}</div>
          </div>
        </div>
      )}
    </div>
  );
}
