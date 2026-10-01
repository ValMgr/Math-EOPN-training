export type TrainingMode = "entrainement" | "examen";

export type SolutionStep = {
  title: string;
  detail: string;
};

export type Question = {
  id: string;
  templateId: string;
  enonce: string;
  choices: string[];
  correctIndex: number;
  steps: SolutionStep[];
};

export type TrainingConfig = {
  questionCount: number;
  durationMinutes: number;
  mode: TrainingMode;
};

export type AnswerRecord = {
  questionId: string;
  selectedIndex: number | null;
  isCorrect: boolean;
};

export type SessionState = {
  config: TrainingConfig;
  questions: Question[];
  answers: AnswerRecord[];
  currentIndex: number;
  remainingMs: number;
  durationMs: number;
  paused: boolean;
  showingFeedback: boolean;
  finished: boolean;
  startedAt: number;
};
