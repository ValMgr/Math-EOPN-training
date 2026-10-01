export type MentalOp = "add" | "sub" | "mul" | "div";

export type MentalConfig = {
  operations: MentalOp[];
  durationMinutes: number;
};

export type MentalQuestion = {
  id: string;
  op: MentalOp;
  a: number;
  b: number;
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
