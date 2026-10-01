"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatTimer } from "@/lib/format";
import { clearMentalSession } from "@/lib/mental/session";
import type {
  MentalAnswerRecord,
  MentalQuestion,
} from "@/lib/mental/types";
import { CheckCircle2, XCircle } from "lucide-react";

type MentalResultsViewProps = {
  questions: MentalQuestion[];
  answers: MentalAnswerRecord[];
  durationMs: number;
  remainingMs: number;
};

export function MentalResultsView({
  questions,
  answers,
  durationMs,
  remainingMs,
}: MentalResultsViewProps) {
  const answered = answers.filter((a) => a.userAnswer !== null);
  const score = answers.filter((a) => a.isCorrect).length;
  const total = answered.length;
  const usedMs = Math.max(0, durationMs - remainingMs);
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const errors = questions
    .map((q, i) => ({ question: q, answer: answers[i]! }))
    .filter(
      ({ answer }) =>
        answer.userAnswer !== null && !answer.isCorrect
    );

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
          {total > 0 ? `${pct}% de réussite` : "Aucune réponse"}
          {" · "}
          temps effectif {formatTimer(usedMs)}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary">Calcul mental</Badge>
          <Badge variant="outline">
            {answered.length} réponse{answered.length > 1 ? "s" : ""}
          </Badge>
          {errors.length > 0 && (
            <Badge variant="destructive">
              {errors.length} erreur{errors.length > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button
            size="lg"
            className="shadow-md shadow-primary/15"
            render={<Link href="/calcul-mental" />}
            onClick={() => clearMentalSession()}
          >
            Rejouer
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href="/" />}
            onClick={() => clearMentalSession()}
          >
            Accueil
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <h2 className="font-heading text-xl font-semibold">
          {errors.length === 0
            ? "Aucune erreur"
            : "Récapitulatif des erreurs"}
        </h2>

        {errors.length === 0 ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-card/80 p-8 text-success">
            <CheckCircle2 className="size-5" />
            <p className="font-medium">Parfait — toutes les réponses sont justes.</p>
          </div>
        ) : (
          errors.map(({ question, answer }, i) => (
            <article
              key={question.id}
              className="space-y-3 rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-heading text-base font-semibold">
                  Erreur {i + 1}
                </h3>
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="size-3" />
                  Incorrect
                </Badge>
              </div>
              <p className="font-heading text-2xl font-semibold tabular-nums">
                {question.expression} = ?
              </p>
              <div className="text-sm">
                <p>
                  <span className="text-muted-foreground">Votre réponse : </span>
                  {answer.userAnswer}
                </p>
                <p>
                  <span className="text-muted-foreground">Bonne réponse : </span>
                  {question.answer}
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
