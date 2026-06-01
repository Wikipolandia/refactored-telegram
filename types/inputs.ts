// Single source of truth for Kerbly form inputs. Shared by the form,
// the API route, the server-side validator, and the LLM user-message builder.

export type PropertyType =
  | "flat"
  | "terraced"
  | "end-of-terrace"
  | "semi-detached"
  | "detached"
  | "bungalow"
  | "other";

export type Tenure = "freehold" | "leasehold" | "share of freehold";

export type ChainStatus = "chain-free" | "in chain" | "part-exchange available" | "";

export type EpcRating = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "";

export type GardenOrientation =
  | "south-facing"
  | "north-facing"
  | "east-facing"
  | "west-facing"
  | "unknown"
  | "";

export type Tone =
  | "first_time_buyer"
  | "family"
  | "downsizer"
  | "buy_to_let"
  | "premium_luxury";

// Known issues — these MUST be disclosed if known (NTSELAT Part C material information).
export const KNOWN_ISSUES = [
  "flood risk zone 2 or 3",
  "building safety or cladding issue",
  "Japanese knotweed",
  "conservation area",
  "listed building",
  "public right of way",
  "mining area",
  "coastal erosion",
] as const;

export type KnownIssue = (typeof KNOWN_ISSUES)[number];

export interface ListingInput {
  // Property basics
  property_type: PropertyType | "";
  town: string; // town + neighbourhood (required)
  price: string; // kept as string for forgiving free-text entry (e.g. "£285,000")
  tenure: Tenure | "";

  // Leasehold details (required if tenure = leasehold)
  lease_years_remaining: string;
  ground_rent: string;
  service_charge: string;

  // Property details
  beds: string;
  bathrooms: string;
  room_highlights: string;
  epc_rating: EpcRating;
  council_tax_band: string;
  chain_status: ChainStatus;

  // Key selling points — Rightmove shows all 10
  selling_points: string[]; // length 10

  // Outdoor
  garden: string;
  garden_orientation: GardenOrientation;

  // Known issues
  known_issues: KnownIssue[];
  known_issues_details: string;

  // Other
  recent_works: string;
  tone: Tone;

  // Agent
  agent_name: string;
  branch: string;
  contact: string;
}

export function emptyListingInput(): ListingInput {
  return {
    property_type: "",
    town: "",
    price: "",
    tenure: "",
    lease_years_remaining: "",
    ground_rent: "",
    service_charge: "",
    beds: "",
    bathrooms: "",
    room_highlights: "",
    epc_rating: "",
    council_tax_band: "",
    chain_status: "",
    selling_points: Array(10).fill(""),
    garden: "",
    garden_orientation: "",
    known_issues: [],
    known_issues_details: "",
    recent_works: "",
    tone: "first_time_buyer",
    agent_name: "",
    branch: "",
    contact: "",
  };
}

export const TONE_LABELS: Record<Tone, string> = {
  first_time_buyer: "First-time buyer",
  family: "Family",
  downsizer: "Downsizer",
  buy_to_let: "Buy-to-let investor",
  premium_luxury: "Premium / luxury",
};
