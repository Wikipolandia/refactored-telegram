import type { ListingInput } from "@/types/inputs";
import { TONE_LABELS } from "@/types/inputs";

// Deterministic serialisation of the form into a single user message. Free-text
// fields are passed through verbatim so the LLM can handle messy input; empty
// fields are omitted so the model writes around them rather than inventing.

function line(label: string, value: string | undefined | null): string {
  const v = (value ?? "").trim();
  return v ? `${label}: ${v}\n` : "";
}

export function buildUserMessage(input: ListingInput): string {
  let s = "PROPERTY FACTS\n";

  s += line("Property type", input.property_type);
  s += line("Town and neighbourhood", input.town);
  s += line("Price", input.price);
  s += line("Tenure", input.tenure);

  if (input.tenure === "leasehold") {
    s += line("Lease years remaining", input.lease_years_remaining);
    s += line("Ground rent (per year)", input.ground_rent);
    s += line("Service charge (per year)", input.service_charge);
  }

  s += line("Bedrooms", input.beds);
  s += line("Bathrooms", input.bathrooms);
  s += line("Room highlights", input.room_highlights);
  s += line("EPC rating", input.epc_rating);
  s += line("Council tax band", input.council_tax_band);
  s += line("Chain status", input.chain_status);

  const points = input.selling_points.map((p) => p.trim()).filter(Boolean);
  if (points.length) {
    s += "Key selling points:\n";
    points.forEach((p) => {
      s += `  - ${p}\n`;
    });
  }

  s += line("Garden / outdoor space", input.garden);
  s += line("Garden orientation", input.garden_orientation);

  if (input.known_issues.length) {
    s += `Declared known issues (MUST be disclosed): ${input.known_issues.join(", ")}\n`;
  }
  s += line("Known issues details", input.known_issues_details);

  s += line("Recent works / upgrades", input.recent_works);
  s += line("Agent name", input.agent_name);
  s += line("Branch", input.branch);
  s += line("Contact details", input.contact);

  s += `\nTONE MODE: ${input.tone} (${TONE_LABELS[input.tone]})\n`;
  s += "\nGenerate the full set of channel copy now, applying every compliance rule.";

  return s;
}
