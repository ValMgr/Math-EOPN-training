import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatTimer } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Flag } from "lucide-react";

type MentalSessionHeaderProps = {
  remainingMs: number;
  durationMs: number;
  correctCount: number;
  answeredCount: number;
  onFinishEarly: () => void;
};

export function MentalSessionHeader({
  remainingMs,
  durationMs,
  correctCount,
  answeredCount,
  onFinishEarly,
}: MentalSessionHeaderProps) {
  const progress =
    durationMs > 0
      ? ((durationMs - remainingMs) / durationMs) * 100
      : 0;
  const urgent = remainingMs <= 30_000;

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm font-semibold tracking-tight">
              Calcul mental
            </span>
            <Badge variant="secondary" className="tabular-nums">
              {correctCount}/{answeredCount}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-heading tabular-nums text-lg font-semibold tracking-wide",
                urgent && "text-destructive"
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
        <Progress value={progress} className="h-1.5" />
      </div>
    </header>
  );
}
