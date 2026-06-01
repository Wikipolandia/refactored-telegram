// Kerbly logo: a property roofline above a compliance tick (the wedge), plus
// the wordmark. Pure SVG/CSS — no image assets, scales crisply anywhere.
export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <defs>
          <linearGradient id="kerbly-mark" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#12936F" />
            <stop offset="1" stopColor="#0A5240" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="30" height="30" rx="8" fill="url(#kerbly-mark)" />
        <path
          d="M8 14.5 L16 8.5 L24 14.5"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.5 18.5 L14.5 22.5 L22 14.8"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-xl font-extrabold tracking-tight text-ink">
        Kerb<span className="text-brand">ly</span>
      </span>
    </div>
  );
}
