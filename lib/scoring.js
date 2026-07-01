import cars from "../data/cars.json";

const PRIORITY_WEIGHTS = {
  budget: { budget: 3, mileage: 1, safety: 1, use: 1 },
  mileage: { budget: 1, mileage: 3, safety: 1, use: 1 },
  safety: { budget: 1, mileage: 1, safety: 3, use: 1 },
  performance: { budget: 1, mileage: 0.5, safety: 1, use: 1.5 },
  family: { budget: 1, mileage: 1, safety: 2, use: 2 },
};

// EV mileage is stored as kWh/100km-equivalent-ish (lower is "thirstier" in our
// synthetic data) so we normalize fuel-efficiency into a single 0-1 scale that's
// comparable across fuel types instead of comparing kmpl to km/kWh directly.
function normalizedEfficiency(car) {
  if (car.fuelType === "electric") {
    // lower number = more efficient for our EV field, so invert
    const best = 4.5;
    const worst = 8.0;
    return clamp01((worst - car.mileage) / (worst - best));
  }
  const best = 32; // CNG WagonR-class ceiling in this dataset
  const worst = 14; // large diesel SUVs
  return clamp01((car.mileage - worst) / (best - worst));
}

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function budgetScore(car, budgetMin, budgetMax) {
  if (budgetMin == null && budgetMax == null) return 0.6; // neutral if no budget given
  const lo = budgetMin ?? 0;
  const hi = budgetMax ?? Infinity;

  // Fully inside range: high score, slightly favoring cars that use the
  // budget efficiently (closer to the top of the range = more car for the money).
  if (car.priceMinLakh <= hi && car.priceMaxLakh >= lo) {
    const overlapLow = Math.max(car.priceMinLakh, lo);
    const overlapHigh = Math.min(car.priceMaxLakh, hi);
    const overlap = Math.max(0, overlapHigh - overlapLow);
    const carSpan = car.priceMaxLakh - car.priceMinLakh || 0.1;
    return 0.7 + 0.3 * clamp01(overlap / carSpan);
  }

  // Outside range: decay score based on how far outside it is.
  const distance = car.priceMinLakh > hi ? car.priceMinLakh - hi : lo - car.priceMaxLakh;
  const span = Math.max(hi - lo, 3);
  return clamp01(0.5 - distance / span);
}

function safetyScore(car) {
  if (car.safetyRating == null) return 0.4;
  return car.safetyRating / 5;
}

function useCaseScore(car, useCases, bodyType, seats) {
  let score = 0.4;
  let signals = 0;

  if (bodyType) {
    signals++;
    if (car.bodyType === bodyType) score += 0.6;
  }
  if (seats) {
    signals++;
    if (car.seats >= seats) score += 0.3;
    else score -= 0.2;
  }
  if (useCases && useCases.length) {
    signals++;
    const matches = useCases.filter((u) => car.tags.includes(u)).length;
    score += 0.3 * clamp01(matches / useCases.length);
  }

  return signals ? clamp01(score) : 0.5;
}

/**
 * @param {object} filters
 * @param {number} [filters.budgetMin] lakh INR
 * @param {number} [filters.budgetMax] lakh INR
 * @param {string} [filters.bodyType] hatchback|sedan|suv|muv
 * @param {string} [filters.fuelType] petrol|diesel|cng|hybrid|electric
 * @param {number} [filters.seats]
 * @param {string[]} [filters.useCases] e.g. ["family","city"]
 * @param {string} [filters.priority] one of PRIORITY_WEIGHTS keys
 * @param {number} [limit]
 */
export function recommendCars(filters = {}, limit = 6) {
  const { budgetMin, budgetMax, bodyType, fuelType, seats, useCases = [], priority = "family" } = filters;
  const weights = PRIORITY_WEIGHTS[priority] || PRIORITY_WEIGHTS.family;

  let pool = cars;
  if (fuelType) pool = pool.filter((c) => c.fuelType === fuelType);

  const scored = pool.map((car) => {
    const b = budgetScore(car, budgetMin, budgetMax);
    const m = normalizedEfficiency(car);
    const s = safetyScore(car);
    const u = useCaseScore(car, useCases, bodyType, seats);

    const totalWeight = weights.budget + weights.mileage + weights.safety + weights.use;
    const rawScore =
      (b * weights.budget + m * weights.mileage + s * weights.safety + u * weights.use) / totalWeight;

    return {
      ...car,
      fitScore: Math.round(rawScore * 100),
      scoreBreakdown: {
        budgetFit: Math.round(b * 100),
        efficiency: Math.round(m * 100),
        safety: Math.round(s * 100),
        useCaseFit: Math.round(u * 100),
      },
    };
  });

  scored.sort((a, b) => b.fitScore - a.fitScore);
  return scored.slice(0, limit);
}

export function getAllCars() {
  return cars;
}

export function getCarById(id) {
  return cars.find((c) => c.id === id) || null;
}
