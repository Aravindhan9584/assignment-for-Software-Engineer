import { NextResponse } from "next/server";
import { getAnthropicClient, MODEL } from "../../../lib/anthropic";
import { recommendCars } from "../../../lib/scoring";
import { fallbackParse } from "../../../lib/fallbackParse";

const PARSE_SYSTEM_PROMPT = `You convert a car buyer's free-text description of what they want into structured search filters for an Indian car marketplace.

Respond with ONLY a JSON object, no prose, no markdown fences. Shape:
{
  "budgetMin": number | null,   // lakh INR
  "budgetMax": number | null,   // lakh INR
  "bodyType": "hatchback" | "sedan" | "suv" | "muv" | null,
  "fuelType": "petrol" | "diesel" | "cng" | "hybrid" | "electric" | null,
  "seats": number | null,
  "useCases": string[],         // any of: family, city, highway, long-drive, offroad, first-car, premium-feel, value, budget, performance, safety-first, reliability, mileage, ev
  "priority": "budget" | "mileage" | "safety" | "performance" | "family"
}

Rules:
- If the buyer doesn't mention something, use null (or [] for useCases).
- "lakh" = 100,000 INR. If they say a plain number like "10 lakh" or "under 10L", treat it as lakh.
- Pick the single "priority" that best matches what they seem to care about most. Default to "family" if unclear.
- Only use values from the enumerated lists above.`;

const EXPLAIN_SYSTEM_PROMPT = `You write a single short sentence (under 25 words) explaining why a specific car is a good fit for a buyer, given their stated needs and the car's spec highlights. Be concrete and specific — cite an actual number or fact. No fluff, no marketing language, plain and direct. Respond with ONLY the sentence, no quotes, no prefix.`;

export async function POST(req) {
  const body = await req.json();
  const { query, filters: rawFilters } = body;

  let filters = rawFilters;
  let usedAI = false;
  let parseError = null;

  if (query && !filters) {
    try {
      const client = getAnthropicClient();
      const resp = await client.messages.create({
        model: MODEL,
        max_tokens: 400,
        system: PARSE_SYSTEM_PROMPT,
        messages: [{ role: "user", content: query }],
      });
      const text = resp.content.find((b) => b.type === "text")?.text ?? "{}";
      filters = JSON.parse(stripFences(text));
      usedAI = true;
    } catch (err) {
      parseError = err.message;
      filters = fallbackParse(query);
    }
  }

  filters = filters || {};
  const results = recommendCars(filters, 8);

  // Generate short "why this fits" explanations. Best-effort — if the API
  // isn't configured, fall back to a template built from the score breakdown
  // so the UI still has something useful to show.
  let withExplanations = results;
  if (usedAI) {
    try {
      const client = getAnthropicClient();
      withExplanations = await Promise.all(
        results.slice(0, 6).map(async (car) => {
          try {
            const resp = await client.messages.create({
              model: MODEL,
              max_tokens: 100,
              system: EXPLAIN_SYSTEM_PROMPT,
              messages: [
                {
                  role: "user",
                  content: `Buyer wants: ${JSON.stringify(filters)}\nCar: ${car.brand} ${car.model} ${car.variant}, ${car.bodyType}, ${car.fuelType}, price ₹${car.priceMinLakh}-${car.priceMaxLakh}L, ${car.mileage} mileage, ${car.seats} seats, safety rating ${car.safetyRating}/5, fit score ${car.fitScore}/100.`,
                },
              ],
            });
            const text = resp.content.find((b) => b.type === "text")?.text ?? "";
            return { ...car, explanation: text.trim() || templateExplanation(car) };
          } catch {
            return { ...car, explanation: templateExplanation(car) };
          }
        })
      );
      // keep remaining results (7th, 8th) with template explanations only
      withExplanations = [
        ...withExplanations,
        ...results.slice(6).map((c) => ({ ...c, explanation: templateExplanation(c) })),
      ];
    } catch {
      withExplanations = results.map((c) => ({ ...c, explanation: templateExplanation(c) }));
    }
  } else {
    withExplanations = results.map((c) => ({ ...c, explanation: templateExplanation(c) }));
  }

  return NextResponse.json({
    filters,
    usedAI,
    parseError: usedAI ? null : parseError,
    results: withExplanations,
  });
}

function stripFences(text) {
  return text.replace(/```json|```/g, "").trim();
}

function templateExplanation(car) {
  const b = car.scoreBreakdown;
  const strongest = Object.entries(b).sort((a, b) => b[1] - a[1])[0];
  const labels = {
    budgetFit: `fits your budget well (${b.budgetFit}/100 match)`,
    efficiency: `strong fuel/energy efficiency (${b.efficiency}/100)`,
    safety: `solid safety rating of ${car.safetyRating}/5`,
    useCaseFit: `matches how you plan to use it (${b.useCaseFit}/100 match)`,
  };
  return `${car.brand} ${car.model} ${labels[strongest[0]]}.`;
}
