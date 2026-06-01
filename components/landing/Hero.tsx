import Logo from "@/components/ui/Logo";

// Landing marketing section — also a screenshot asset, so keep it clean.
export default function Hero() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <a
            href="#tool"
            className="hidden rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark sm:inline-block"
          >
            Try it free
          </a>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
          ✓ DMCC Act 2024 + NTSELAT + Equality Act — checked automatically
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Compliant Rightmove listings in 20 seconds.
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Every listing checked against the DMCC Act 2024, NTSELAT Parts A/B/C and the
          Equality Act — automatically.
        </p>
        <p className="mt-4 max-w-2xl text-slate-700">
          Paste your property facts. Get a Rightmove description, key features, Instagram
          caption, Facebook post, LinkedIn update, buyer email and window card — all
          compliant, all in one click.
        </p>

        {/* TESTIMONIAL slot — fill before the first £1,000 */}
        {/* <!-- TESTIMONIAL --> */}

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          Only <strong>24%</strong> of independent UK agents use AI for listings — vs{" "}
          <strong>82%</strong> of large chains. Kerbly closes the gap.
        </div>
      </div>
    </header>
  );
}
