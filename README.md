# Kerbly

Compliant UK estate-agent listing copy in ~20 seconds. Paste raw property facts →
get a Rightmove description, key features, Instagram caption, Facebook post,
LinkedIn update, buyer email and window card — every output checked against the
**DMCC Act 2024**, **NTSELAT** material information, and the **Equality Act 2010 /
Renters' Rights Act 2025** for discriminatory language. The **compliance badge** is
the hero feature.

Built with Next.js (App Router) + TypeScript + Tailwind. One server-side LLM call
(Anthropic Claude). No database in v1.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

### Where to put your LLM key

Set `LLM_API_KEY` in `.env.local` to your Anthropic API key (from
<https://console.anthropic.com/>). It is read **only** on the server in
`lib/anthropic/client.ts` and is never exposed to the browser — all model traffic
goes through the `/api/*` routes.

### Environment variables (`.env.example`)

| Var | Purpose |
| --- | --- |
| `LLM_API_KEY` | Anthropic API key (server-only). |
| `CHECKOUT_URL_ONCE` | Paywall CTA A — "Unlock unlimited — £39 one-time". |
| `CHECKOUT_URL_SUB` | Paywall CTA B — "Or subscribe — £19/month". |
| `ADMIN_SECRET` | Gate for `/admin?secret=...`. |
| `LICENCE_SECRET` | HMAC signing secret for unlock tokens. |
| `POLAR_API_KEY` | (commented) for real licence validation in v2. |

## Deploy to Vercel

1. Push this repo to GitHub and import it into Vercel (zero config — it's a
   standard Next.js app).
2. Add every variable from `.env.example` in **Project → Settings → Environment
   Variables**.
3. Deploy. `npm run build` must pass locally first (`npm run build`).

## Routes

- `/` — landing section + the generator tool. First generation is free; after that,
  results are gated behind a paywall (server-enforced) showing the two price options.
- `/admin?secret=YOUR_SECRET` — in-memory analytics: total generations, the
  **Option A (£39) vs Option B (£19/mo) click split** (the most important v1 metric),
  cards copied most, regenerate counts, tones chosen, compliance-score distribution
  (incl. DL/MP/MI breakdown), and the feedback log. Wrong/blank secret → blank page.
- `/founder` — concierge mode (no auth in v1): generate a full polished pack for a
  named agent and copy or print it to hand-deliver.

## How the paywall works (v1)

- The first generation per IP returns the **full** set (so agents see the compliance
  badge and every channel). Subsequent locked generations return only the Rightmove
  summary, description and key features — the rest is server-gated, never sent to the
  browser.
- Up to **3 free generations per IP per hour** (then a friendly 429).
- Paying returns an **HMAC-signed unlock token** (`/api/validate-licence`), stored in
  localStorage and replayed as the `x-licence-token` header. Verified tokens get the
  full set and skip the rate limit.
- v1 accepts **any non-empty key** — replace the body of `validateLicence()` in
  `lib/licence/validate.ts` with a real Polar call (one-function swap; the token
  machinery stays).

> Compliance assistance only — not legal advice.

## v2 TODO (prioritised)

1. **Real Polar licence validation** — swap the one function in `lib/licence/validate.ts`.
2. **Pricing decision** — pick the winner from the Option A vs Option B click data.
3. **Database** (Postgres via Vercel) — saved generations per branch, agent accounts;
   also makes analytics + rate limiting durable (currently in-memory, lost on cold
   start and not shared across serverless instances).
4. **Key-features pre-population** from a branch's previous listings (branch memory).
5. **Image suggestions** — alt text + social image brief from the listing facts.
6. **Lettings mode** — Renters' Rights Act 2025 compliance additions.
7. **Brand-voice training** — agent uploads past listings; the model learns their style.
8. **Bulk import** — CSV of listings → batch generation.
