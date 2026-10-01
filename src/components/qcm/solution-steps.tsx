import type { SolutionStep } from "@/lib/types";

type SolutionStepsProps = {
  steps: SolutionStep[];
  isCorrect: boolean;
  correctLabel: string;
};

export function SolutionSteps({
  steps,
  isCorrect,
  correctLabel,
}: SolutionStepsProps) {
  return (
    <div className="animate-fade-up space-y-4 rounded-xl border border-border/70 bg-card/90 p-4 shadow-sm">
      <div
        className={
          isCorrect
            ? "text-success font-heading text-base font-semibold"
            : "text-destructive font-heading text-base font-semibold"
        }
      >
        {isCorrect ? "Bonne réponse !" : "Réponse incorrecte"}
        <span className="text-foreground ml-2 font-normal">
          — corrigé : {correctLabel}
        </span>
      </div>
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="bg-primary/12 text-primary flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
              {i + 1}
            </span>
            <div className="min-w-0 space-y-1">
              <p className="font-medium">{step.title}</p>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                {step.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
