"use client";

import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D", "E"] as const;

type AnswerChoicesProps = {
  choices: string[];
  selectedIndex: number | null;
  correctIndex?: number;
  showResult?: boolean;
  disabled?: boolean;
  onSelect: (index: number) => void;
};

export function AnswerChoices({
  choices,
  selectedIndex,
  correctIndex,
  showResult = false,
  disabled = false,
  onSelect,
}: AnswerChoicesProps) {
  return (
    <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Réponses">
      {choices.map((choice, index) => {
        const selected = selectedIndex === index;
        const isCorrect = showResult && index === correctIndex;
        const isWrong = showResult && selected && index !== correctIndex;

        return (
          <button
            key={`${index}-${choice}`}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onSelect(index)}
            className={cn(
              "group flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-all",
              "hover:border-primary/40 hover:bg-accent/40 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              "disabled:cursor-default disabled:opacity-100",
              selected && !showResult && "border-primary bg-primary/8 shadow-sm shadow-primary/10",
              !selected && !showResult && "border-border/80 bg-card/80",
              isCorrect && "border-success bg-success/10",
              isWrong && "border-destructive bg-destructive/8",
              showResult && !isCorrect && !isWrong && "opacity-60"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
                selected && !showResult && "bg-primary text-primary-foreground",
                !selected && !showResult && "bg-muted text-muted-foreground",
                isCorrect && "bg-success text-success-foreground",
                isWrong && "bg-destructive text-white"
              )}
            >
              {LETTERS[index]}
            </span>
            <span className="pt-0.5 text-[0.95rem] leading-relaxed whitespace-pre-wrap">
              {choice}
            </span>
          </button>
        );
      })}
    </div>
  );
}
