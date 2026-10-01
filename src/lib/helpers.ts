import type { Question, SolutionStep } from "./types";
import { roundTo } from "./format";

export type TemplateGenerator = () => Question;

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randChoice<T>(items: T[]): T {
  return items[randInt(0, items.length - 1)]!;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Build 5 unique choices; correct must be included. Distractors as numbers or strings. */
export function buildChoices(
  correctLabel: string,
  distractorLabels: string[]
): { choices: string[]; correctIndex: number } {
  const unique = Array.from(
    new Set([correctLabel, ...distractorLabels.filter((d) => d !== correctLabel)])
  );
  let n = 1;
  while (unique.length < 5) {
    const fallback = `${correctLabel} (±${n})`;
    if (!unique.includes(fallback)) unique.push(fallback);
    n += 1;
    if (n > 20) break;
  }
  const picked = [correctLabel, ...unique.filter((u) => u !== correctLabel).slice(0, 4)];
  const choices = shuffle(picked);
  return {
    choices,
    correctIndex: choices.indexOf(correctLabel),
  };
}

/** Numeric distractors around a correct value */
export function nearbyDistractors(
  correct: number,
  deltas: number[],
  format: (n: number) => string,
  decimals = 0
): { correctLabel: string; distractors: string[] } {
  const correctR = roundTo(correct, decimals);
  const correctLabel = format(correctR);
  const distractors = deltas
    .map((d) => format(roundTo(correctR + d, decimals)))
    .filter((l) => l !== correctLabel);
  return { correctLabel, distractors };
}

export function makeQuestion(
  templateId: string,
  enonce: string,
  correctLabel: string,
  distractors: string[],
  steps: SolutionStep[]
): Question {
  const { choices, correctIndex } = buildChoices(correctLabel, distractors);
  return {
    id: uid(templateId),
    templateId,
    enonce,
    choices,
    correctIndex,
    steps,
  };
}
