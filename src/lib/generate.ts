import type { Question } from "./types";
import { TEMPLATES } from "./templates";
import { shuffle } from "./helpers";

export function generateQuestions(count: number): Question[] {
  const n = Math.max(1, Math.min(25, count));
  const questions: Question[] = [];
  let pool = shuffle([...TEMPLATES]);

  for (let i = 0; i < n; i++) {
    if (i > 0 && i % TEMPLATES.length === 0) {
      pool = shuffle([...TEMPLATES]);
    }
    questions.push(pool[i % pool.length]!());
  }
  return questions;
}
