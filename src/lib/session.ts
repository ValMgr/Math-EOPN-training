import type { SessionState, TrainingConfig } from "./types";
import { generateQuestions } from "./generate";

const STORAGE_KEY = "eopn-math-session";

let cachedRaw: string | null | undefined;
let cachedSession: SessionState | null = null;
const listeners = new Set<() => void>();

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY);
}

function parseSession(raw: string | null): SessionState | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionState;
  } catch {
    return null;
  }
}

function syncCacheFromStorage(): SessionState | null {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedSession;
  cachedRaw = raw;
  cachedSession = parseSession(raw);
  return cachedSession;
}

function writeSession(session: SessionState | null): void {
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

export function createSession(config: TrainingConfig): SessionState {
  const durationMs = config.durationMinutes * 60 * 1000;
  const questions = generateQuestions(config.questionCount);
  return {
    config,
    questions,
    answers: questions.map((q) => ({
      questionId: q.id,
      selectedIndex: null,
      isCorrect: false,
    })),
    currentIndex: 0,
    remainingMs: durationMs,
    durationMs,
    paused: false,
    showingFeedback: false,
    finished: false,
    startedAt: Date.now(),
  };
}

export function saveSession(session: SessionState): void {
  writeSession(session);
}

export function loadSession(): SessionState | null {
  return syncCacheFromStorage();
}

export function clearSession(): void {
  writeSession(null);
}

/** useSyncExternalStore — stable snapshot + notify on save/clear */
export function subscribeSession(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getSessionSnapshot(): SessionState | null {
  return syncCacheFromStorage();
}

export function getServerSessionSnapshot(): SessionState | null {
  return null;
}
