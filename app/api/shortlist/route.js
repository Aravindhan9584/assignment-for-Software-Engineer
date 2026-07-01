import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getCarById } from "../../../lib/scoring";

// Simple file-backed persistence so the shortlist survives a page refresh
// without standing up a database for a 2-3 hour assignment. On serverless
// platforms (Vercel) this resets on redeploy/cold start since the filesystem
// isn't durable there — noted in the README as a known tradeoff.
const STORE_PATH = path.join(process.cwd(), ".shortlist-store.json");

function readStore() {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return { carIds: [] };
  }
}

function writeStore(store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

export async function GET() {
  const store = readStore();
  const cars = store.carIds.map(getCarById).filter(Boolean);
  return NextResponse.json({ cars });
}

export async function POST(req) {
  const { carId } = await req.json();
  if (!carId || !getCarById(carId)) {
    return NextResponse.json({ error: "Unknown carId" }, { status: 400 });
  }
  const store = readStore();
  if (!store.carIds.includes(carId)) store.carIds.push(carId);
  writeStore(store);
  const cars = store.carIds.map(getCarById).filter(Boolean);
  return NextResponse.json({ cars });
}

export async function DELETE(req) {
  const { carId } = await req.json();
  const store = readStore();
  store.carIds = store.carIds.filter((id) => id !== carId);
  writeStore(store);
  const cars = store.carIds.map(getCarById).filter(Boolean);
  return NextResponse.json({ cars });
}
