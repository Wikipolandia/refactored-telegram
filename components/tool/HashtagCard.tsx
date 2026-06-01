"use client";
import CopyButton from "@/components/ui/CopyButton";

export default function HashtagCard({ tags }: { tags: string[] }) {
  const text = tags.map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ");
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">Instagram hashtags</h3>
        <CopyButton text={text} field="instagram_hashtags" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((t, i) => (
          <span
            key={i}
            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
          >
            {t.startsWith("#") ? t : `#${t}`}
          </span>
        ))}
      </div>
    </div>
  );
}
