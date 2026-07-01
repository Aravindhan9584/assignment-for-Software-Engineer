// One-off generator for a representative (not scraped) Indian car-market dataset.
// Run: node scripts/generate-data.js  -> writes data/cars.json
// Swap this for a real dataset (e.g. a Kaggle India car-prices dataset) if you
// want production-accurate numbers; this is intentionally illustrative so the
// scoring/recommendation logic has realistic shapes to work with.

const fs = require("fs");
const path = require("path");

let idCounter = 1;
function mk(brand, model, variant, bodyType, fuelType, transmission, priceMinLakh, priceMaxLakh, seats, mileage, safetyRating, tags) {
  return {
    id: `car-${String(idCounter++).padStart(3, "0")}`,
    brand,
    model,
    variant,
    bodyType,
    fuelType,
    transmission,
    priceMinLakh,
    priceMaxLakh,
    seats,
    mileage, // kmpl for ICE/hybrid/CNG, km per kWh-equivalent for EV — normalized in scoring
    safetyRating, // Global NCAP style, 0-5
    tags,
  };
}

const cars = [
  // --- Hatchbacks ---
  mk("Maruti Suzuki", "Alto K10", "VXI", "hatchback", "petrol", "manual", 4.2, 5.8, 5, 24.4, 2, ["budget", "city", "first-car"]),
  mk("Maruti Suzuki", "Swift", "ZXI", "hatchback", "petrol", "manual", 6.5, 9.2, 5, 22.4, 3, ["city", "value", "first-car"]),
  mk("Maruti Suzuki", "Swift", "ZXI+ AMT", "hatchback", "petrol", "automatic", 8.0, 9.8, 5, 21.8, 3, ["city", "value"]),
  mk("Hyundai", "Grand i10 Nios", "Sportz", "hatchback", "petrol", "manual", 6.2, 8.9, 5, 20.3, 3, ["city", "value", "first-car"]),
  mk("Hyundai", "i20", "Asta", "hatchback", "petrol", "manual", 8.5, 11.8, 5, 20.0, 3, ["city", "premium-feel"]),
  mk("Tata", "Tiago", "XZ+", "hatchback", "petrol", "manual", 6.6, 8.9, 5, 19.9, 4, ["city", "value", "safety-first"]),
  mk("Tata", "Altroz", "XZ+", "hatchback", "petrol", "manual", 7.6, 10.9, 5, 19.3, 5, ["city", "safety-first", "premium-feel"]),
  mk("Toyota", "Glanza", "V", "hatchback", "petrol", "manual", 7.2, 10.2, 5, 22.3, 3, ["city", "reliability"]),

  // --- Compact / Mid sedans ---
  mk("Honda", "Amaze", "VX", "sedan", "petrol", "manual", 8.0, 10.5, 5, 18.6, 4, ["family", "highway", "reliability"]),
  mk("Maruti Suzuki", "Dzire", "ZXI", "sedan", "petrol", "manual", 7.5, 10.1, 5, 22.6, 3, ["family", "value", "city"]),
  mk("Hyundai", "Aura", "SX", "sedan", "petrol", "manual", 7.8, 10.0, 5, 20.5, 3, ["family", "value"]),
  mk("Skoda", "Slavia", "AMT", "sedan", "petrol", "automatic", 13.5, 18.5, 5, 18.7, 5, ["highway", "premium-feel", "performance"]),
  mk("Volkswagen", "Virtus", "GT", "sedan", "petrol", "automatic", 14.0, 19.5, 5, 18.1, 5, ["highway", "performance", "premium-feel"]),
  mk("Honda", "City", "ZX CVT", "sedan", "petrol", "automatic", 14.5, 18.0, 5, 18.4, 4, ["family", "highway", "reliability"]),

  // --- Compact SUVs ---
  mk("Tata", "Punch", "Creative+", "suv", "petrol", "manual", 7.0, 10.2, 5, 20.1, 5, ["city", "safety-first", "value"]),
  mk("Tata", "Nexon", "Fearless+", "suv", "petrol", "manual", 9.5, 15.0, 5, 17.4, 5, ["family", "safety-first", "city"]),
  mk("Tata", "Nexon EV", "Long Range", "suv", "electric", "automatic", 14.5, 19.2, 5, 4.5, 5, ["family", "city", "ev", "safety-first"]),
  mk("Hyundai", "Venue", "SX(O)", "suv", "petrol", "manual", 9.0, 13.8, 5, 18.2, 4, ["city", "premium-feel"]),
  mk("Hyundai", "Exter", "SX(O)", "suv", "petrol", "manual", 8.5, 12.5, 5, 19.4, 4, ["city", "value"]),
  mk("Maruti Suzuki", "Brezza", "ZXI+", "suv", "petrol", "manual", 9.8, 14.0, 5, 19.8, 4, ["family", "city", "value"]),
  mk("Maruti Suzuki", "Fronx", "Alpha", "suv", "petrol", "automatic", 9.5, 13.8, 5, 20.0, 4, ["city", "value"]),
  mk("Kia", "Sonet", "GTX+", "suv", "petrol", "automatic", 11.0, 16.0, 5, 18.4, 4, ["performance", "premium-feel"]),
  mk("Mahindra", "XUV300", "W8(O)", "suv", "diesel", "manual", 10.5, 14.5, 5, 20.0, 5, ["safety-first", "performance"]),
  mk("Renault", "Kiger", "RXZ", "suv", "petrol", "manual", 7.8, 11.5, 5, 19.9, 4, ["value", "city"]),
  mk("Nissan", "Magnite", "XV Premium", "suv", "petrol", "manual", 7.8, 11.8, 5, 19.9, 4, ["value", "city"]),

  // --- Mid/Large SUVs ---
  mk("Hyundai", "Creta", "SX(O)", "suv", "petrol", "automatic", 14.5, 20.5, 5, 17.4, 5, ["family", "highway", "premium-feel"]),
  mk("Kia", "Seltos", "GTX+", "suv", "diesel", "automatic", 15.0, 21.5, 5, 19.8, 5, ["family", "highway", "performance"]),
  mk("Maruti Suzuki", "Grand Vitara", "Alpha Hybrid", "suv", "hybrid", "automatic", 17.0, 20.5, 5, 27.9, 5, ["family", "highway", "mileage"]),
  mk("Toyota", "Urban Cruiser Hyryder", "V Hybrid", "suv", "hybrid", "automatic", 17.5, 21.0, 5, 27.9, 5, ["family", "reliability", "mileage"]),
  mk("Tata", "Harrier", "Fearless+", "suv", "diesel", "automatic", 22.0, 27.5, 5, 16.8, 5, ["family", "highway", "safety-first"]),
  mk("Mahindra", "XUV700", "AX7L", "suv", "diesel", "automatic", 20.5, 26.0, 7, 16.0, 5, ["family", "highway", "performance", "safety-first"]),
  mk("Mahindra", "Scorpio-N", "Z8L", "suv", "diesel", "automatic", 19.5, 24.5, 7, 15.2, 5, ["family", "offroad", "performance"]),
  mk("MG", "Hector", "Sharp", "suv", "petrol", "automatic", 18.0, 22.0, 5, 14.1, 4, ["family", "premium-feel"]),
  mk("Skoda", "Kushaq", "Monte Carlo", "suv", "petrol", "automatic", 16.0, 20.5, 5, 18.0, 5, ["highway", "performance", "premium-feel"]),
  mk("Volkswagen", "Taigun", "GT Plus", "suv", "petrol", "automatic", 16.5, 21.5, 5, 18.0, 5, ["highway", "performance", "premium-feel"]),

  // --- MPVs / family-first ---
  mk("Maruti Suzuki", "Ertiga", "ZXI+", "muv", "petrol", "manual", 9.5, 13.0, 7, 20.3, 4, ["family", "long-drive", "value"]),
  mk("Toyota", "Innova Crysta", "GX", "muv", "diesel", "manual", 20.5, 24.0, 7, 15.6, 4, ["family", "long-drive", "reliability"]),
  mk("Toyota", "Innova Hycross", "ZX Hybrid", "muv", "hybrid", "automatic", 24.0, 31.0, 7, 16.3, 4, ["family", "long-drive", "premium-feel"]),
  mk("Kia", "Carens", "Luxury Plus", "muv", "diesel", "automatic", 14.0, 19.5, 6, 19.0, 5, ["family", "long-drive"]),
  mk("Maruti Suzuki", "XL6", "Alpha", "muv", "petrol", "automatic", 12.0, 15.5, 6, 20.0, 4, ["family", "premium-feel"]),

  // --- Premium / performance sedans & SUVs ---
  mk("Skoda", "Superb", "L&K", "sedan", "petrol", "automatic", 32.0, 36.0, 5, 14.6, 5, ["premium-feel", "performance", "highway"]),
  mk("Honda", "Elevate", "ZX CVT", "suv", "petrol", "automatic", 15.5, 19.5, 5, 15.2, 5, ["family", "reliability"]),
  mk("Hyundai", "Alcazar", "Signature(O)", "suv", "diesel", "automatic", 20.0, 25.5, 7, 18.1, 5, ["family", "long-drive", "premium-feel"]),
  mk("Tata", "Safari", "Adventure+", "suv", "diesel", "automatic", 21.5, 27.0, 7, 16.1, 5, ["family", "long-drive", "safety-first"]),

  // --- EVs ---
  mk("Tata", "Punch EV", "Empowered+", "suv", "electric", "automatic", 11.0, 15.5, 5, 5.2, 5, ["city", "ev", "value"]),
  mk("MG", "Comet EV", "Pace", "hatchback", "electric", "automatic", 7.0, 9.0, 4, 7.5, 3, ["city", "ev", "first-car"]),
  mk("Hyundai", "Creta Electric", "Excellence", "suv", "electric", "automatic", 18.0, 22.5, 5, 5.5, 5, ["family", "ev", "premium-feel"]),
  mk("Mahindra", "BE 6", "Pack Three", "suv", "electric", "automatic", 20.0, 26.5, 5, 5.0, 5, ["family", "ev", "performance"]),
  mk("Tata", "Curvv EV", "Accomplished+", "suv", "electric", "automatic", 17.0, 21.5, 5, 5.8, 5, ["city", "ev", "premium-feel"]),

  // --- CNG budget picks ---
  mk("Maruti Suzuki", "WagonR", "VXI CNG", "hatchback", "cng", "manual", 6.8, 8.5, 5, 32.5, 2, ["budget", "city", "value"]),
  mk("Maruti Suzuki", "Ertiga", "VXI CNG", "muv", "cng", "manual", 10.0, 12.5, 7, 26.1, 4, ["family", "budget", "long-drive"]),
  mk("Hyundai", "Aura", "S CNG", "sedan", "cng", "manual", 8.0, 9.8, 5, 28.1, 3, ["budget", "value"]),
];

fs.writeFileSync(
  path.join(__dirname, "..", "data", "cars.json"),
  JSON.stringify(cars, null, 2)
);

console.log(`Wrote ${cars.length} cars to data/cars.json`);
