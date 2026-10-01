import { generateMentalQuestion } from "./generate";
import type { MentalConfig, MentalSessionState } from "./types";

const STORAGE_KEY = "eopn-mental-session";

let cachedRaw: string | null | undefined;
let cachedSession: MentalSessionState | null = null;
const listeners = new Set<() => void>();

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY);
}

function parseSession(raw: string | null): MentalSessionState | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MentalSessionState;
  } catch {
    return null;
  }
}

function syncCacheFromStorage(): MentalSessionState | null {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedSession;
  cachedRaw = raw;
  cachedSession = parseSession(raw);
  return cachedSession;
}

function writeSession(session: MentalSessionState | null): void {
  if (typeof window === "undefined") return;
  if (session) {
    const raw = JSON.stringify(session);
    sessionStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedSession = session;
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
    cachedRaw = null;
    cachedSession = null;
  }
  listeners.forEach((listener) => listener());
}

export function createMentalSession(config: MentalConfig): MentalSessionState {
  const durationMs = config.durationMinutes * 60 * 1000;
  const first = generateMentalQuestion(config.operations);
  return {
    config,
    questions: [first],
    answers: [
      {
        questionId: first.id,
        userAnswer: null,
        isCorrect: false,
      },
    ],
    currentIndex: 0,
    remainingMs: durationMs,
    durationMs,
    finished: false,
    startedAt: Date.now(),
  };
}

export function appendNextQuestion(
  session: MentalSessionState
): MentalSessionState {
  const next = generateMentalQuestion(session.config.operations);
  return {
    ...session,
    questions: [...session.questions, next],
    answers: [
      ...session.answers,
      {
        questionId: next.id,
        userAnswer: null,
        isCorrect: false,
      },
    ],
    currentIndex: session.currentIndex + 1,
  };
}

export function saveMentalSession(session: MentalSessionState): void {
  writeSession(session);
}

export function clearMentalSession(): void {
  writeSession(null);
}

export function subscribeMentalSession(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getMentalSessionSnapshot(): MentalSessionState | null {
  return syncCacheFromStorage();
}

export function getServerMentalSessionSnapshot(): MentalSessionState | null {
  return null;
}
