"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  clearMentalSession,
  createMentalSession,
  saveMentalSession,
} from "@/lib/mental/session";
import type { MentalOp } from "@/lib/mental/types";
import { Clock, Divide, Minus, Plus, X } from "lucide-react";

const OP_OPTIONS: {
  id: MentalOp;
  label: string;
  symbol: string;
  icon: typeof Plus;
}[] = [
  { id: "add", label: "Addition", symbol: "+", icon: Plus },
  { id: "sub", label: "Soustraction", symbol: "−", icon: Minus },
  { id: "mul", label: "Multiplication", symbol: "×", icon: X },
  { id: "div", label: "Division", symbol: "÷", icon: Divide },
];

export function MentalConfigForm() {
  const router = useRouter();
  const [operations, setOperations] = useState<MentalOp[]>([
    "add",
    "sub",
    "mul",
    "div",
  ]);
  const [durationMinutes, setDurationMinutes] = useState(3);

  function toggleOp(op: MentalOp, enabled: boolean) {
    setOperations((prev) => {
      if (enabled) {
        return prev.includes(op) ? prev : [...prev, op];
      }
      if (prev.length <= 1) return prev;
      return prev.filter((o) => o !== op);
    });
  }

  function start() {
    if (operations.length === 0) return;
    clearMentalSession();
    const session = createMentalSession({ operations, durationMinutes });
    saveMentalSession(session);
    router.push("/calcul-mental/session");
  }

  return (
    <div className="animate-fade-up space-y-8">
      <div className="space-y-5">
        <div className="space-y-3">
          <Label className="text-base font-medium">Opérations</Label>
          <div className="space-y-2">
            {OP_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const checked = operations.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  className="bg-muted/60 flex items-center justify-between gap-4 rounded-xl border border-border/60 p-3.5"
                >
                  <Label
                    htmlFor={`op-${opt.id}`}
                    className="flex flex-1 cursor-pointer items-center gap-2.5 text-base font-medium"
                  >
                    <Icon className="text-primary size-4" />
                    {opt.label}
                    <Badge variant="outline" className="ml-1 tabular-nums">
                      {opt.symbol}
                    </Badge>
                  </Label>
                  <Switch
                    id={`op-${opt.id}`}
                    checked={checked}
                    onCheckedChange={(v) => toggleOp(opt.id, v)}
                    disabled={checked && operations.length === 1}
                  />
                </div>
              );
            })}
          </div>
          <p className="text-muted-foreground text-xs">
            Au moins une opération requise
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label
              htmlFor="mental-duration"
              className="flex items-center gap-2 text-base font-medium"
            >
              <Clock className="text-primary size-4" />
              Durée
            </Label>
            <Badge variant="secondary" className="tabular-nums text-sm">
              {durationMinutes} min
            </Badge>
          </div>
          <Slider
            id="mental-duration"
            min={1}
            max={10}
            step={1}
            value={[durationMinutes]}
            onValueChange={(v) => {
              const next = Array.isArray(v) ? v[0] : v;
              setDurationMinutes(next ?? 3);
            }}
            className="w-full"
          />
          <p className="text-muted-foreground text-xs">
            Questions illimitées pendant {durationMinutes} minute
            {durationMinutes > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <Button
        size="lg"
        className="h-11 w-full text-base shadow-md shadow-primary/20 transition-transform hover:scale-[1.01] active:scale-[0.99]"
        onClick={start}
        disabled={operations.length === 0}
      >
        Commencer
      </Button>
    </div>
  );
}
