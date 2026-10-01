export type MentalOp = "add" | "sub" | "mul" | "div" | "pct" | "conv";

export type MentalConfig = {
  operations: MentalOp[];
  durationMinutes: number;
};

export type MentalQuestion = {
  id: string;
  op: MentalOp;
  a: number;
  b: number;
  /** Canonical / displayed correct answer */
  answer: number;
  expression: string;
};

export type MentalAnswerRecord = {
  questionId: string;
  userAnswer: number | null;
  isCorrect: boolean;
};

export type MentalSessionState = {
  config: MentalConfig;
  questions: MentalQuestion[];
  answers: MentalAnswerRecord[];
  currentIndex: number;
  remainingMs: number;
  durationMs: number;
  finished: boolean;
  startedAt: number;
};

/** Strict for +−×÷; relative tolerance for % / conversions (aviation approximations). */
export function isMentalAnswerCorrect(
  op: MentalOp,
  userAnswer: number,
  expected: number
): boolean {
  const delta = Math.abs(userAnswer - expected);
  if (op === "add" || op === "sub" || op === "mul" || op === "div") {
    return delta < 1e-6;
  }
  // ~2 % relative, floor 0.05 so 18,52 vs 18,5 still passes
  const tolerance = Math.max(0.05, Math.abs(expected) * 0.02);
  return delta <= tolerance;
}
