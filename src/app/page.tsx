import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, ClipboardList } from "lucide-react";

const modes = [
  {
    href: "/qcm",
    title: "QCM EOPN",
    description:
      "Problèmes chronométrés façon sélections pilote — volume, durée et mode de correction.",
    icon: ClipboardList,
    delay: "180ms",
  },
  {
    href: "/calcul-mental",
    title: "Calcul mental",
    description:
      "Opérations, pourcentages et conversions en série chronométrée — tapez les réponses le plus vite possible.",
    icon: Brain,
    delay: "240ms",
  },
] as const;

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <div className="mb-10 space-y-3 text-center">
          <p className="text-primary animate-fade-up text-sm font-semibold tracking-[0.22em] uppercase">
            EOPN Maths
          </p>
          <h1
            className="font-heading animate-fade-up text-4xl font-semibold tracking-tight sm:text-5xl"
            style={{ animationDelay: "60ms" }}
          >
            Entraînement
          </h1>
          <p
            className="text-muted-foreground animate-fade-up mx-auto max-w-md text-base leading-relaxed sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Choisissez un type d&apos;exercice pour démarrer.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Link
                key={mode.href}
                href={mode.href}
                className="animate-fade-up group block outline-none"
                style={{ animationDelay: mode.delay }}
              >
                <Card className="border-border/70 bg-card/90 shadow-lg shadow-sky-900/5 backdrop-blur-sm transition-transform group-hover:scale-[1.01] group-focus-visible:ring-3 group-focus-visible:ring-ring/50">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                      <Icon className="size-5" />
                    </div>
                    <div className="space-y-1.5">
                      <CardTitle className="font-heading text-xl">
                        {mode.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {mode.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pl-19">
                    <span className="text-primary text-sm font-medium">
                      Configurer →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
