import Hero from "@/components/landing/Hero";
import ToolApp from "@/components/tool/ToolApp";

// Server component: renders the static landing section, reads the checkout URLs
// from server env (exact brief names — not NEXT_PUBLIC_), and passes them as
// props into the client tool.
export default function HomePage() {
  const checkoutOnce = process.env.CHECKOUT_URL_ONCE ?? "#";
  const checkoutSub = process.env.CHECKOUT_URL_SUB ?? "#";

  return (
    <main>
      <Hero />
      <ToolApp checkoutOnce={checkoutOnce} checkoutSub={checkoutSub} />
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Kerbly — compliance assistance only, not legal advice.
      </footer>
    </main>
  );
}
