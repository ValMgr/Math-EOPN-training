import Link from "next/link";
import { ConfigForm } from "@/components/qcm/config-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function QcmConfigPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground animate-fade-up mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Accueil
        </Link>

        <div className="mb-8 space-y-3 text-center">
          <p className="text-primary animate-fade-up text-sm font-semibold tracking-[0.22em] uppercase">
            QCM EOPN
          </p>
          <h1
            className="font-heading animate-fade-up text-4xl font-semibold tracking-tight sm:text-5xl"
            style={{ animationDelay: "60ms" }}
          >
            Configuration
          </h1>
          <p
            className="text-muted-foreground animate-fade-up mx-auto max-w-md text-base leading-relaxed sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            QCM chronométrés façon sélections pilote militaire — configurez
            votre session et lancez-vous.
          </p>
        </div>

        <Card
          className="animate-fade-up border-border/70 bg-card/90 shadow-lg shadow-sky-900/5 backdrop-blur-sm"
          style={{ animationDelay: "180ms" }}
        >
          <CardHeader>
            <CardTitle className="font-heading text-xl">Paramètres</CardTitle>
            <CardDescription>
              Choisissez le volume, la durée et le mode de correction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConfigForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
