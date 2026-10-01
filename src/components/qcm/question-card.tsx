"use client";

import { AnswerChoices } from "@/components/qcm/answer-choices";
import { SolutionSteps } from "@/components/qcm/solution-steps";
import { Button } from "@/components/ui/button";
import type { Question } from "@/lib/types";

type QuestionCardProps = {
  question: Question;
  questionNumber: number;
  total: number;
  selectedIndex: number | null;
  showingFeedback: boolean;
  mode: "entrainement" | "examen";
  onSelect: (index: number) => void;
  onValidate: () => void;
  onNext: () => void;
};

export function QuestionCard({
  question,
  questionNumber,
  total,
  selectedIndex,
  showingFeedback,
  mode,
  onSelect,
  onValidate,
  onNext,
}: QuestionCardProps) {
  const isLast = questionNumber >= total;
  const isCorrect =
    selectedIndex !== null && selectedIndex === question.correctIndex;

  return (
    <div className="animate-fade-up space-y-6">
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          Question {questionNumber} sur {total}
        </p>
        <p className="font-heading text-lg leading-relaxed font-medium sm:text-xl">
          {question.enonce}
        </p>
      </div>

      <AnswerChoices
        choices={question.choices}
        selectedIndex={selectedIndex}
        correctIndex={question.correctIndex}
        showResult={showingFeedback}
        disabled={showingFeedback}
        onSelect={onSelect}
      />

      {showingFeedback && mode === "entrainement" && (
        <SolutionSteps
          steps={question.steps}
          isCorrect={isCorrect}
          correctLabel={question.choices[question.correctIndex]!}
        />
      )}

      <div className="flex justify-end pt-1">
        {!showingFeedback ? (
          <Button
            size="lg"
            disabled={selectedIndex === null}
            onClick={onValidate}
            className="min-w-36 shadow-md shadow-primary/15"
          >
            Valider
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={onNext}
            className="min-w-36 shadow-md shadow-primary/15"
          >
            {isLast ? "Voir les résultats" : "Question suivante"}
          </Button>
        )}
      </div>
    </div>
  );
}
