import type { MentalOp, MentalQuestion } from "./types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOp(operations: MentalOp[]): MentalOp {
  return operations[randInt(0, operations.length - 1)]!;
}

function pickOne<T>(items: readonly T[]): T {
  return items[randInt(0, items.length - 1)]!;
}

function makeId(): string {
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

const OP_SYMBOL: Record<"add" | "sub" | "mul" | "div", string> = {
  add: "+",
  sub: "−",
  mul: "×",
  div: "÷",
};

function generateAdd(): Omit<MentalQuestion, "id"> {
  const a = randInt(1, 50);
  const b = randInt(1, 50);
  return {
    op: "add",
    a,
    b,
    answer: a + b,
    expression: `${a} ${OP_SYMBOL.add} ${b}`,
  };
}

function generateSub(): Omit<MentalQuestion, "id"> {
  const a = randInt(1, 50);
  const b = randInt(1, a);
  return {
    op: "sub",
    a,
    b,
    answer: a - b,
    expression: `${a} ${OP_SYMBOL.sub} ${b}`,
  };
}

function generateMul(): Omit<MentalQuestion, "id"> {
  const a = randInt(2, 12);
  const b = randInt(2, 12);
  return {
    op: "mul",
    a,
    b,
    answer: a * b,
    expression: `${a} ${OP_SYMBOL.mul} ${b}`,
  };
}

function generateDiv(): Omit<MentalQuestion, "id"> {
  const quotient = randInt(2, 12);
  const divisor = randInt(2, 12);
  const product = quotient * divisor;
  return {
    op: "div",
    a: product,
    b: divisor,
    answer: quotient,
    expression: `${product} ${OP_SYMBOL.div} ${divisor}`,
  };
}

const PCT_BASES = [
  48, 64, 75, 80, 96, 120, 125, 150, 160, 200, 240, 250, 320, 360, 400, 480,
  500, 640, 750, 800, 960, 1000, 1200, 1250, 1500, 1600, 2000, 2400, 2500,
  3000, 3600, 4000, 4800, 5000, 6375, 7200, 8000,
] as const;

function generatePct(): Omit<MentalQuestion, "id"> {
  const pct = randInt(0, 99);
  const base = pickOne(PCT_BASES);
  const answer = round1((base * pct) / 100);
  return {
    op: "pct",
    a: base,
    b: pct,
    answer,
    expression: `${pct} % de ${base}`,
  };
}

type ConvCase = {
  a: number;
  from: string;
  to: string;
  answer: number;
};

/** Precomputed conversions with clean 0–1 decimal answers */
const CONV_CASES: readonly ConvCase[] = [
  // m/s ↔ km/h (×3.6)
  { a: 10, from: "m/s", to: "km/h", answer: 36 },
  { a: 15, from: "m/s", to: "km/h", answer: 54 },
  { a: 20, from: "m/s", to: "km/h", answer: 72 },
  { a: 25, from: "m/s", to: "km/h", answer: 90 },
  { a: 30, from: "m/s", to: "km/h", answer: 108 },
  { a: 40, from: "m/s", to: "km/h", answer: 144 },
  { a: 50, from: "m/s", to: "km/h", answer: 180 },
  { a: 75, from: "m/s", to: "km/h", answer: 270 },
  { a: 100, from: "m/s", to: "km/h", answer: 360 },
  { a: 36, from: "km/h", to: "m/s", answer: 10 },
  { a: 54, from: "km/h", to: "m/s", answer: 15 },
  { a: 72, from: "km/h", to: "m/s", answer: 20 },
  { a: 90, from: "km/h", to: "m/s", answer: 25 },
  { a: 108, from: "km/h", to: "m/s", answer: 30 },
  { a: 144, from: "km/h", to: "m/s", answer: 40 },
  { a: 180, from: "km/h", to: "m/s", answer: 50 },
  { a: 270, from: "km/h", to: "m/s", answer: 75 },
  { a: 360, from: "km/h", to: "m/s", answer: 100 },
  // m ↔ ft — facteur mental aéronautique 1 m ≈ 3,3 ft
  { a: 10, from: "m", to: "ft", answer: 33 },
  { a: 25, from: "m", to: "ft", answer: 82.5 },
  { a: 50, from: "m", to: "ft", answer: 165 },
  { a: 100, from: "m", to: "ft", answer: 330 },
  { a: 200, from: "m", to: "ft", answer: 660 },
  { a: 250, from: "m", to: "ft", answer: 825 },
  { a: 500, from: "m", to: "ft", answer: 1650 },
  { a: 1000, from: "m", to: "ft", answer: 3300 },
  { a: 33, from: "ft", to: "m", answer: 10 },
  { a: 82.5, from: "ft", to: "m", answer: 25 },
  { a: 165, from: "ft", to: "m", answer: 50 },
  { a: 330, from: "ft", to: "m", answer: 100 },
  { a: 660, from: "ft", to: "m", answer: 200 },
  { a: 825, from: "ft", to: "m", answer: 250 },
  { a: 1650, from: "ft", to: "m", answer: 500 },
  { a: 3300, from: "ft", to: "m", answer: 1000 },
  // km ↔ NM (×1.852) — valeurs exactes ; 18,5 accepté via tolérance
  { a: 5, from: "NM", to: "km", answer: 9.26 },
  { a: 10, from: "NM", to: "km", answer: 18.52 },
  { a: 20, from: "NM", to: "km", answer: 37.04 },
  { a: 50, from: "NM", to: "km", answer: 92.6 },
  { a: 100, from: "NM", to: "km", answer: 185.2 },
  { a: 9.26, from: "km", to: "NM", answer: 5 },
  { a: 18.52, from: "km", to: "NM", answer: 10 },
  { a: 37.04, from: "km", to: "NM", answer: 20 },
  { a: 92.6, from: "km", to: "NM", answer: 50 },
  { a: 185.2, from: "km", to: "NM", answer: 100 },
  // km/h ↔ kt (×1.852)
  { a: 100, from: "kt", to: "km/h", answer: 185.2 },
  { a: 150, from: "kt", to: "km/h", answer: 277.8 },
  { a: 200, from: "kt", to: "km/h", answer: 370.4 },
  { a: 250, from: "kt", to: "km/h", answer: 463 },
  { a: 300, from: "kt", to: "km/h", answer: 555.6 },
  { a: 185.2, from: "km/h", to: "kt", answer: 100 },
  { a: 277.8, from: "km/h", to: "kt", answer: 150 },
  { a: 370.4, from: "km/h", to: "kt", answer: 200 },
  { a: 463, from: "km/h", to: "kt", answer: 250 },
  { a: 555.6, from: "km/h", to: "kt", answer: 300 },
];

function formatConvValue(n: number): string {
  return Number.isInteger(n) ? String(n) : String(n).replace(".", ",");
}

function generateConv(): Omit<MentalQuestion, "id"> {
  const c = pickOne(CONV_CASES);
  return {
    op: "conv",
    a: c.a,
    b: 0,
    answer: c.answer,
    expression: `${formatConvValue(c.a)} ${c.from} → ${c.to}`,
  };
}

const GENERATORS: Record<MentalOp, () => Omit<MentalQuestion, "id">> = {
  add: generateAdd,
  sub: generateSub,
  mul: generateMul,
  div: generateDiv,
  pct: generatePct,
  conv: generateConv,
};

export function generateMentalQuestion(operations: MentalOp[]): MentalQuestion {
  if (operations.length === 0) {
    throw new Error("At least one operation is required");
  }
  const op = pickOp(operations);
  const base = GENERATORS[op]();
  return { ...base, id: makeId() };
}
