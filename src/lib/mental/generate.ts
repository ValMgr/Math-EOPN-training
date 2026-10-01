import type { MentalOp, MentalQuestion } from "./types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOp(operations: MentalOp[]): MentalOp {
  return operations[randInt(0, operations.length - 1)]!;
}

function makeId(): string {
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const OP_SYMBOL: Record<MentalOp, string> = {
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

const GENERATORS: Record<MentalOp, () => Omit<MentalQuestion, "id">> = {
  add: generateAdd,
  sub: generateSub,
  mul: generateMul,
  div: generateDiv,
};

export function generateMentalQuestion(operations: MentalOp[]): MentalQuestion {
  if (operations.length === 0) {
    throw new Error("At least one operation is required");
  }
  const op = pickOp(operations);
  const base = GENERATORS[op]();
  return { ...base, id: makeId() };
}
