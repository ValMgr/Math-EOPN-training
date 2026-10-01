"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { TrainingConfig, TrainingMode } from "@/lib/types";
import { clearSession, createSession, saveSession } from "@/lib/session";
import { Clock, ListOrdered, Target } from "lucide-react";

export function ConfigForm() {
  const router = useRouter();
  const [questionCount, setQuestionCount] = useState(10);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [examMode, setExamMode] = useState(false);

  function start() {
    const mode: TrainingMode = examMode ? "examen" : "entrainement";
    const config: TrainingConfig = {
      questionCount,
      durationMinutes,
      mode,
    };
    clearSession();
    const session = createSession(config);
    saveSession(session);
    router.push("/entrainement");
  }

  return (
    <div className="animate-fade-up space-y-8">
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label
              htmlFor="questions"
              className="flex items-center gap-2 text-base font-medium"
            >
              <ListOrdered className="size-4 text-primary" />
              Nombre de questions
            </Label>
            <Badge variant="secondary" className="tabular-nums text-sm">
              {questionCount}
            </Badge>
          </div>
          <Slider
            id="questions"
            min={5}
            max={25}
            step={1}
            value={[questionCount]}
            onValueChange={(v) => {
              const next = Array.isArray(v) ? v[0] : v;
              setQuestionCount(next ?? 10);
            }}
            className="w-full"
          />
          <p className="text-muted-foreground text-xs">De 5 à 25 questions</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label
              htmlFor="duration"
              className="flex items-center gap-2 text-base font-medium"
            >
              <Clock className="size-4 text-primary" />
              Durée
            </Label>
            <Badge variant="secondary" className="tabular-nums text-sm">
              {durationMinutes} min
            </Badge>
          </div>
          <Slider
            id="duration"
            min={5}
            max={40}
            step={1}
            value={[durationMinutes]}
            onValueChange={(v) => {
              const next = Array.isArray(v) ? v[0] : v;
              setDurationMinutes(next ?? 15);
            }}
            className="w-full"
          />
          <p className="text-muted-foreground text-xs">
            Environ {Math.round((durationMinutes * 60) / questionCount)} s par
            question
          </p>
        </div>

        <div className="bg-muted/60 flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4">
          <div className="space-y-1">
            <Label
              htmlFor="exam-mode"
              className="flex items-center gap-2 text-base font-medium"
            >
              <Target className="size-4 text-primary" />
              Mode examen
            </Label>
            <p className="text-muted-foreground text-sm leading-snug">
              {examMode
                ? "Corrigé uniquement à la fin — le chronomètre ne s'arrête pas."
                : "Corrigé après chaque question — le chronomètre se met en pause."}
            </p>
          </div>
          <Switch
            id="exam-mode"
            checked={examMode}
            onCheckedChange={setExamMode}
          />
        </div>
      </div>

      <Button
        size="lg"
        className="h-11 w-full text-base shadow-md shadow-primary/20 transition-transform hover:scale-[1.01] active:scale-[0.99]"
        onClick={start}
      >
        Commencer l&apos;entraînement
      </Button>
    </div>
  );
}
