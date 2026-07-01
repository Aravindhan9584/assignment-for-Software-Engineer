// Lightweight keyword parser used as a fallback when ANTHROPIC_API_KEY isn't
// configured, so the app still demonstrates the full flow without a key.
// The real parsing (see app/api/recommend/route.js) uses Claude and is far
// more flexible — this is just a safety net.

const BODY_TYPE_KEYWORDS = {
  suv: "suv",
  hatchback: "hatchback",
  hatch: "hatchback",
  sedan: "sedan",
  muv: "muv",
  mpv: "muv",
  minivan: "muv",
};

const FUEL_KEYWORDS = {
  petrol: "petrol",
  diesel: "diesel",
  cng: "cng",
  electric: "electric",
  ev: "electric",
  hybrid: "hybrid",
};

const USE_CASE_KEYWORDS = [
  "family",
  "city",
  "highway",
  "long-drive",
  "offroad",
  "first-car",
  "premium-feel",
  "value",
  "budget",
  "performance",
  "safety-first",
  "reliability",
  "mileage",
  "ev",
];

export function fallbackParse(text) {
  const lower = text.toLowerCase();
  const filters = { useCases: [] };

  const budgetMatch = lower.match(/(\d+(\.\d+)?)\s*(-|to)\s*(\d+(\.\d+)?)\s*(lakh|l\b)/);
  const underMatch = lower.match(/(under|below|upto|up to)\s*(\d+(\.\d+)?)\s*(lakh|l\b)/);
  const aroundMatch = lower.match(/(around|about|~)\s*(\d+(\.\d+)?)\s*(lakh|l\b)/);

  if (budgetMatch) {
    filters.budgetMin = parseFloat(budgetMatch[1]);
    filters.budgetMax = parseFloat(budgetMatch[4]);
  } else if (underMatch) {
    filters.budgetMax = parseFloat(underMatch[2]);
  } else if (aroundMatch) {
    const v = parseFloat(aroundMatch[2]);
    filters.budgetMin = v * 0.8;
    filters.budgetMax = v * 1.2;
  }

  for (const [kw, val] of Object.entries(BODY_TYPE_KEYWORDS)) {
    if (lower.includes(kw)) {
      filters.bodyType = val;
      break;
    }
  }
  for (const [kw, val] of Object.entries(FUEL_KEYWORDS)) {
    if (lower.includes(kw)) {
      filters.fuelType = val;
      break;
    }
  }
  const seatsMatch = lower.match(/(\d)\s*(seater|seats)/);
  if (seatsMatch) filters.seats = parseInt(seatsMatch[1], 10);

  for (const uc of USE_CASE_KEYWORDS) {
    if (lower.includes(uc.replace("-", " ")) || lower.includes(uc)) {
      filters.useCases.push(uc);
    }
  }

  if (lower.includes("family")) filters.priority = "family";
  else if (lower.includes("mileage") || lower.includes("fuel efficient") || lower.includes("efficient"))
    filters.priority = "mileage";
  else if (lower.includes("safe") || lower.includes("safety")) filters.priority = "safety";
  else if (lower.includes("cheap") || lower.includes("budget") || lower.includes("affordable"))
    filters.priority = "budget";
  else if (lower.includes("fast") || lower.includes("powerful") || lower.includes("sporty"))
    filters.priority = "performance";
  else filters.priority = "family";

  return filters;
}
