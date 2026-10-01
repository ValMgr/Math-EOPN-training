"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MentalQuestion } from "@/lib/mental/types";

type MentalQuestionPanelProps = {
  question: MentalQuestion;
  questionNumber: number;
  onSubmit: (value: number) => void;
};

export function MentalQuestionPanel({
  question,
  questionNumber,
  onSubmit,
}: MentalQuestionPanelProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue("");
    inputRef.current?.focus();
  }, [question.id]);

  function submit() {
    const trimmed = value.trim().replace(",", ".");
    if (trimmed === "") return;
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) return;
    onSubmit(parsed);
  }

  return (
    <div
      key={question.id}
      className="animate-fade-up mx-auto flex w-full max-w-md flex-col items-center gap-8"
    >
      <p className="text-muted-foreground text-sm">
        Question {questionNumber}
      </p>
      <p
        className={`font-heading text-center font-semibold tracking-tight tabular-nums ${
          question.expression.length > 14
            ? "text-3xl sm:text-4xl"
            : "text-5xl sm:text-6xl"
        }`}
      >
        {question.expression}
        <span className="text-muted-foreground"> = ?</span>
      </p>

      <form
        className="flex w-full flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          pattern="-?[0-9]*[,.]?[0-9]*"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Réponse"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="font-heading h-14 text-center text-2xl tabular-nums"
          aria-label="Votre réponse"
        />
        <Button
          type="submit"
          size="lg"
          className="h-11 w-full text-base shadow-md shadow-primary/20"
          disabled={value.trim() === ""}
        >
          Valider
        </Button>
      </form>
    </div>
  );
}
