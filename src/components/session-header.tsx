import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatTimer } from "@/lib/format";
import type { TrainingMode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Flag, Pause } from "lucide-react";

type SessionHeaderProps = {
  currentIndex: number;
  total: number;
  remainingMs: number;
  durationMs: number;
  mode: TrainingMode;
  paused: boolean;
  onFinishEarly: () => void;
};

export function SessionHeader({
  currentIndex,
  total,
  remainingMs,
  durationMs,
  mode,
  paused,
  onFinishEarly,
}: SessionHeaderProps) {
  const progress = ((currentIndex + 1) / total) * 100;
  const urgent = remainingMs <= 60_000;

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm font-semibold tracking-tight">
              EOPN Maths
            </span>
            <Badge variant="outline" className="capitalize">
              {mode === "examen" ? "Examen" : "Entraînement"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {paused && (
              <Badge
                variant="secondary"
                className="animate-pulse-soft gap-1 text-amber-700"
              >
                <Pause className="size-3" />
                En pause
              </Badge>
            )}
            <span
              className={cn(
                "font-heading tabular-nums text-lg font-semibold tracking-wide",
                urgent && !paused && "text-destructive",
                paused && "text-muted-foreground"
              )}
            >
              {formatTimer(remainingMs)}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={onFinishEarly}
            >
              <Flag className="size-3.5" />
              Terminer
            </Button>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>
              Question {currentIndex + 1} / {total}
            </span>
            <span>
              {Math.round(((durationMs - remainingMs) / 1000 / 60) * 10) / 10}{" "}
              min écoulées
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>
    </header>
  );
}
