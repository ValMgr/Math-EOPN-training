"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { MentalQuestionPanel } from "@/components/mental/question-panel";
import { MentalResultsView } from "@/components/mental/results-view";
import { MentalSessionHeader } from "@/components/mental/session-header";
import {
  appendNextQuestion,
  getMentalSessionSnapshot,
  getServerMentalSessionSnapshot,
  saveMentalSession,
  subscribeMentalSession,
} from "@/lib/mental/session";
import {
  isMentalAnswerCorrect,
  type MentalSessionState,
} from "@/lib/mental/types";

export default function CalculMentalSessionPage() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeMentalSession,
    getMentalSessionSnapshot,
    getServerMentalSessionSnapshot
  );
  const lastTick = useRef<number | null>(null);

  useEffect(() => {
    if (!session) {
      router.replace("/calcul-mental");
    }
  }, [session, router]);

  const persist = useCallback((next: MentalSessionState) => {
    saveMentalSession(next);
  }, []);

  const finished = session?.finished ?? true;
  const startedAt = session?.startedAt;

  useEffect(() => {
    if (!startedAt || finished) {
      lastTick.current = null;
      return;
    }

    let remainingMs = getMentalSessionSnapshot()?.remainingMs ?? 0;
    let lastSavedBucket = Math.floor(remainingMs / 250);
    let raf = 0;

    const tick = (now: number) => {
      if (lastTick.current == null) lastTick.current = now;
      const delta = now - lastTick.current;
      lastTick.current = now;
      remainingMs = Math.max(0, remainingMs - delta);

      if (remainingMs === 0) {
        const prev = getMentalSessionSnapshot();
        if (prev && !prev.finished) {
          saveMentalSession({
            ...prev,
            remainingMs: 0,
            finished: true,
          });
        }
        return;
      }

      const bucket = Math.floor(remainingMs / 250);
      if (bucket !== lastSavedBucket) {
        lastSavedBucket = bucket;
        const prev = getMentalSessionSnapshot();
        if (prev && !prev.finished) {
          saveMentalSession({ ...prev, remainingMs });
        }
      }

      raf = requestAnimationFrame(tick);
    };

    lastTick.current = null;
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [finished, startedAt]);

  if (!session) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground animate-pulse-soft text-sm">
          Chargement de la session…
        </p>
      </main>
    );
  }

  const current = session;

  if (current.finished) {
    return (
      <main className="flex-1">
        <MentalResultsView
          questions={current.questions}
          answers={current.answers}
          durationMs={current.durationMs}
          remainingMs={current.remainingMs}
        />
      </main>
    );
  }

  const question = current.questions[current.currentIndex]!;
  const answeredCount = current.answers.filter(
    (a) => a.userAnswer !== null
  ).length;
  const correctCount = current.answers.filter((a) => a.isCorrect).length;

  function handleSubmit(value: number) {
    const prev = getMentalSessionSnapshot();
    if (!prev || prev.finished) return;

    const answers = [...prev.answers];
    const q = prev.questions[prev.currentIndex]!;
    answers[prev.currentIndex] = {
      questionId: q.id,
      userAnswer: value,
      isCorrect: isMentalAnswerCorrect(q.op, value, q.answer),
    };

    const withAnswer: MentalSessionState = { ...prev, answers };
    const next = appendNextQuestion(withAnswer);
    persist(next);
  }

  function handleFinishEarly() {
    const confirmed = window.confirm(
      "Terminer le calcul mental maintenant et voir les résultats ?"
    );
    if (!confirmed) return;
    persist({
      ...current,
      finished: true,
    });
  }

  return (
    <main className="flex flex-1 flex-col">
      <MentalSessionHeader
        remainingMs={current.remainingMs}
        durationMs={current.durationMs}
        correctCount={correctCount}
        answeredCount={answeredCount}
        onFinishEarly={handleFinishEarly}
      />
      <div className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-10 sm:px-6">
        <MentalQuestionPanel
          question={question}
          questionNumber={current.currentIndex + 1}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  );
}
