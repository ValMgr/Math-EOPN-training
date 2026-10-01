"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { QuestionCard } from "@/components/qcm/question-card";
import { ResultsView } from "@/components/qcm/results-view";
import { SessionHeader } from "@/components/qcm/session-header";
import {
  getServerSessionSnapshot,
  getSessionSnapshot,
  saveSession,
  subscribeSession,
} from "@/lib/session";
import type { SessionState } from "@/lib/types";

export default function EntrainementPage() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSessionSnapshot
  );
  const lastTick = useRef<number | null>(null);

  useEffect(() => {
    if (!session) {
      router.replace("/qcm");
    }
  }, [session, router]);

  const persist = useCallback((next: SessionState) => {
    saveSession(next);
  }, []);

  const paused = session?.paused ?? true;
  const finished = session?.finished ?? true;
  const startedAt = session?.startedAt;

  useEffect(() => {
    if (!startedAt || finished || paused) {
      lastTick.current = null;
      return;
    }

    let remainingMs = getSessionSnapshot()?.remainingMs ?? 0;
    let lastSavedBucket = Math.floor(remainingMs / 250);
    let raf = 0;

    const tick = (now: number) => {
      if (lastTick.current == null) lastTick.current = now;
      const delta = now - lastTick.current;
      lastTick.current = now;
      remainingMs = Math.max(0, remainingMs - delta);

      if (remainingMs === 0) {
        const prev = getSessionSnapshot();
        if (prev && !prev.finished) {
          saveSession({
            ...prev,
            remainingMs: 0,
            finished: true,
            showingFeedback: false,
            paused: false,
          });
        }
        return;
      }

      const bucket = Math.floor(remainingMs / 250);
      if (bucket !== lastSavedBucket) {
        lastSavedBucket = bucket;
        const prev = getSessionSnapshot();
        if (prev && !prev.paused && !prev.finished) {
          saveSession({ ...prev, remainingMs });
        }
      }

      raf = requestAnimationFrame(tick);
    };

    lastTick.current = null;
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, finished, startedAt]);

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
        <ResultsView
          questions={current.questions}
          answers={current.answers}
          durationMs={current.durationMs}
          remainingMs={current.remainingMs}
          mode={current.config.mode}
        />
      </main>
    );
  }

  const question = current.questions[current.currentIndex]!;
  const answer = current.answers[current.currentIndex]!;

  function handleSelect(index: number) {
    if (current.showingFeedback) return;
    const answers = [...current.answers];
    answers[current.currentIndex] = {
      ...answer,
      selectedIndex: index,
      isCorrect: index === question.correctIndex,
    };
    persist({ ...current, answers });
  }

  function handleValidate() {
    if (answer.selectedIndex === null) return;

    if (current.config.mode === "examen") {
      const nextIndex = current.currentIndex + 1;
      if (nextIndex >= current.questions.length) {
        persist({
          ...current,
          finished: true,
          showingFeedback: false,
          paused: false,
        });
      } else {
        persist({
          ...current,
          currentIndex: nextIndex,
          showingFeedback: false,
          paused: false,
        });
      }
      return;
    }

    persist({
      ...current,
      showingFeedback: true,
      paused: true,
    });
  }

  function handleNext() {
    const nextIndex = current.currentIndex + 1;
    if (nextIndex >= current.questions.length) {
      persist({
        ...current,
        finished: true,
        showingFeedback: false,
        paused: false,
      });
      return;
    }
    persist({
      ...current,
      currentIndex: nextIndex,
      showingFeedback: false,
      paused: false,
    });
  }

  function handleFinishEarly() {
    const confirmed = window.confirm(
      "Terminer l'entraînement maintenant et voir les résultats ?"
    );
    if (!confirmed) return;
    persist({
      ...current,
      finished: true,
      showingFeedback: false,
      paused: false,
    });
  }

  return (
    <main className="flex flex-1 flex-col">
      <SessionHeader
        currentIndex={current.currentIndex}
        total={current.questions.length}
        remainingMs={current.remainingMs}
        durationMs={current.durationMs}
        mode={current.config.mode}
        paused={current.paused}
        onFinishEarly={handleFinishEarly}
      />
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <QuestionCard
          key={question.id}
          question={question}
          questionNumber={current.currentIndex + 1}
          total={current.questions.length}
          selectedIndex={answer.selectedIndex}
          showingFeedback={current.showingFeedback}
          mode={current.config.mode}
          onSelect={handleSelect}
          onValidate={handleValidate}
          onNext={handleNext}
        />
      </div>
    </main>
  );
}
