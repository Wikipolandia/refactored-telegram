import ConciergeView from "@/components/founder/ConciergeView";

// Hidden concierge route (no auth in v1). Hand-deliver polished packs to named
// agents to win the first testimonials and paying customers.
export default function FounderPage() {
  return (
    <main>
      <ConciergeView />
    </main>
  );
}
