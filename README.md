# assignment-for-Software-Engineer
A car research platform has a dataset of cars — makes, models, variants, prices, specs, mileage, safety ratings, and user reviews. Buyers come to the platform confused: there are too many options and no easy way to figure out which car is right for them.
# Shortlist — a car-buying decision tool, not another listings page

Turns "I don't know what to buy" into a ranked, explained shortlist. Type what you
actually need in plain English → Claude parses it into structured filters → a
deterministic scoring engine ranks the full car dataset against those filters →
Claude writes a one-line "why this fits" for each top result → you build a
shortlist and compare side by side.

## Run it (under 2 minutes)

npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev

Open http://localhost:3000. The app works without an API key too — it falls back
to a keyword-based parser and template explanations so the full flow is always
demoable (see `lib/fallbackParse.js`).

To regenerate the dataset: `node scripts/generate-data.js`.

## What I built and why

The brief was deliberately vague, so the first job was picking the one thing that
actually moves a confused buyer forward: not another filterable table (every car
site already has that), but a way to turn *fuzzy intent* into a *defensible,
explained shortlist*. That's the whole product surface:

1. **Free-text intake** instead of a form — buyers don't think in dropdowns, they
   think in sentences ("family car, tight budget, mostly city driving").
2. **A deterministic scoring engine** (`lib/scoring.js`) that ranks cars on
   budget fit, efficiency, safety, and use-case match, with per-axis weights
   depending on the buyer's stated priority. This is the part I did *not* hand to
   the LLM — ranking needs to be consistent and explainable, not vibes-based.
3. **LLM-generated "why"** for each result, grounded in the actual score
   breakdown and car specs, so it can't hallucinate a reason that isn't backed by
   data.
4. **A shortlist with a comparison table** — the actual end state a buyer wants:
   2-3 real contenders, side by side, not a list of 50.

### Deliberately cut

- User accounts/auth — one implicit session is enough for a demo.
- Review/sentiment mining — real signal, but a second project on its own.
- Rich car detail pages, image galleries — didn't move the core job forward.
- A production database — shortlist persistence is a flat JSON file
  (`.shortlist-store.json`). Fine for local/demo use; noted as the first thing
  to swap out for real deployment (see below).
- Polished responsive/mobile pixel-perfection — functional down to mobile, not
  obsessed over.

## Tech stack

- **Next.js (App Router)** — frontend and API routes in one project, one
  `npm run dev`, deploys to Vercel with no separate backend to stand up.
- **Claude (`claude-sonnet-5`) via the Anthropic SDK** — for two narrow, well-scoped
  jobs: parsing free text into structured filters, and writing a short grounded
  explanation per result. Not used for ranking — that's deterministic on purpose.
- **A synthetic-but-representative car dataset** (`scripts/generate-data.js` →
  `data/cars.json`, ~50 cars) covering the Indian market's real segments
  (hatchback/sedan/SUV/MUV, petrol/diesel/CNG/hybrid/EV). Swap in a real dataset
  (e.g. a Kaggle India car-prices set) for production-accurate numbers — the
  scoring/API layer doesn't care where the rows came from.
- **Tailwind** for styling speed.
- No database — a flat JSON store for the shortlist, intentionally, given the
  time-box.

## What I delegated to AI vs. did manually

*(Fill this in from your actual recorded session — this is a starting scaffold,
not the graded artifact. The screen recording is what they're actually
evaluating: your prompts, what you accepted vs. rewrote, where you course-corrected.)*

Suggested honest structure:
- What you asked the AI to generate wholesale (e.g. dataset scaffolding,
  component boilerplate)
- Where you rejected or rewrote AI output, and why
- Which decisions were yours, not the tool's (the scoring-vs-LLM split above is
  a good example of a product decision to narrate — explain *why* ranking is
  deterministic and explanation is generative)
- Where the tool slowed you down or got something wrong

## If I had another 4 hours

- Swap the synthetic dataset for a real one and validate the price/spec ranges.
- Move shortlist persistence to a real store (SQLite via Prisma, or Vercel KV)
  so it survives serverless cold starts.
- Add a lightweight user session so shortlists don't collide across visitors.
- Let the buyer refine results conversationally ("actually, drop the diesel
  ones") instead of re-typing the whole query.
- Surface a few "you might be missing" cars deliberately outside the stated
  filters but close, to counter tunnel vision (e.g. a hybrid just over budget
  that pays back in fuel savings).
- Add basic evals for the parsing prompt — a small set of query → expected-filter
  fixtures, since prompt regressions here are silent and easy to miss.
