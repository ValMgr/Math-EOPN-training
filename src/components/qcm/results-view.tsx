"use client";

import Link from "next/link";
import { SolutionSteps } from "@/components/qcm/solution-steps";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatTimer } from "@/lib/format";
import { clearSession } from "@/lib/session";
import type { AnswerRecord, Question, TrainingMode } from "@/lib/types";
import { CheckCircle2, XCircle } from "lucide-react";

type ResultsViewProps = {
  questions: Question[];
  answers: AnswerRecord[];
  durationMs: number;
  remainingMs: number;
  mode: TrainingMode;
};

export function ResultsView({
  questions,
  answers,
  durationMs,
  remainingMs,
  mode,
}: ResultsViewProps) {
  const answered = answers.filter((a) => a.selectedIndex !== null);
  const score = answers.filter((a) => a.isCorrect).length;
  const total = questions.length;
  const usedMs = Math.max(0, durationMs - remainingMs);
  const pct = Math.round((score / total) * 100);

  return (
    <div className="animate-fade-up mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <div className="space-y-4 text-center">
        <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
          Résultats
        </p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          {score} / {total}
        </h1>
        <p className="text-muted-foreground text-lg">
          {pct}% de réussite · temps effectif {formatTimer(usedMs)}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary">
            {mode === "examen" ? "Mode examen" : "Mode entraînement"}
          </Badge>
          <Badge variant="outline">
            {answered.length} réponse{answered.length > 1 ? "s" : ""} donnée
            {answered.length > 1 ? "s" : ""}
          </Badge>
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button
            size="lg"
            className="shadow-md shadow-primary/15"
            render={<Link href="/qcm" />}
            onClick={() => clearSession()}
          >
            Nouvel entraînement
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <h2 className="font-heading text-xl font-semibold">Corrigé détaillé</h2>
        {questions.map((q, i) => {
          const answer = answers[i];
          const selected = answer?.selectedIndex ?? null;
          const correct = answer?.isCorrect ?? false;
          const skipped = selected === null;

          return (
            <article
              key={q.id}
              className="space-y-4 rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-heading text-base font-semibold">
                  Question {i + 1}
                </h3>
                {skipped ? (
                  <Badge variant="outline">Non répondue</Badge>
                ) : correct ? (
                  <Badge className="bg-success text-success-foreground gap-1">
                    <CheckCircle2 className="size-3" />
                    Correct
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="size-3" />
                    Incorrect
                  </Badge>
                )}
              </div>
              <p className="leading-relaxed">{q.enonce}</p>
              <div className="text-sm">
                <p>
                  <span className="text-muted-foreground">Votre réponse : </span>
                  {skipped
                    ? "—"
                    : q.choices[selected!] ?? "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Bonne réponse : </span>
                  {q.choices[q.correctIndex]}
                </p>
              </div>
              <SolutionSteps
                steps={q.steps}
                isCorrect={correct}
                correctLabel={q.choices[q.correctIndex]!}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}
