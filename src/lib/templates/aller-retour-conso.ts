import { formatNumber, formatTonnes, roundHours, roundTo } from "../format";
import { AIRCRAFT, BASES } from "../constants";
import {
  makeQuestion,
  nearbyDistractors,
  randChoice,
  spacedDeltas,
  type TemplateGenerator,
} from "../helpers";

/** Phase aller + retour → carburant restant */
export const allerRetourConso: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.jet]);
  const base = randChoice([...BASES]);
  const fuelTons = randChoice([2.5, 2.8, 3.2, 3.5, 4.0, 4.3, 4.5]);
  const t1min = randChoice([18, 20, 22, 25, 28, 30, 32]);
  const v1 = randChoice([550, 580, 650, 700, 800, 880]);
  const c1 = randChoice([0.55, 0.6, 0.65, 0.7, 0.75, 0.8]);
  const v2 = randChoice([480, 520, 600, 650, 700, 720]);
  const c2 = randChoice([0.5, 0.55, 0.6, 0.65, 0.7]);

  const t1 = roundHours(t1min / 60);
  const d = roundTo(v1 * t1, 2);
  const t2 = roundHours(d / v2);
  const cons1 = roundTo(c1 * t1, 2);
  const cons2 = roundTo(c2 * t2, 2);
  const consumed = roundTo(cons1 + cons2, 2);
  const remaining = roundTo(fuelTons - consumed, 2);

  const { correctLabel, distractors } = nearbyDistractors(
    remaining,
    spacedDeltas(
      [0.3, -0.5, 0.7, -0.9, 1.1, roundTo(fuelTons - cons1, 2) - remaining],
      0.2
    ),
    (n) => formatTonnes(n, 2),
    2
  );

  return makeQuestion(
    "aller-retour-conso",
    `Dans le cadre d'un exercice militaire, un ${craft} décolle de ${base} avec ${formatNumber(fuelTons, 1)} tonnes de carburant. Il effectue une première phase de vol pendant ${t1min} minutes à ${formatNumber(v1)} km/h avec une consommation de ${formatNumber(c1, 2)} tonne par heure. Suite à un ordre de mission, il doit regagner sa base de ${base} à ${formatNumber(v2)} km/h en consommant ${formatNumber(c2, 2)} tonne par heure. Quel carburant reste-t-il à son retour ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Distance de la première phase",
        detail: `Temps initial = ${t1min}/60 = ${formatNumber(t1, 2)} h\nDistance = ${formatNumber(v1)} × ${formatNumber(t1, 2)} = ${formatNumber(d, 2)} km`,
      },
      {
        title: "Temps de retour",
        detail: `Temps retour = ${formatNumber(d, 2)} ÷ ${formatNumber(v2)} = ${formatNumber(t2, 2)} h`,
      },
      {
        title: "Consommations",
        detail: `Phase 1 : ${formatNumber(c1, 2)} × ${formatNumber(t1, 2)} = ${formatNumber(cons1, 2)} t\nRetour : ${formatNumber(c2, 2)} × ${formatNumber(t2, 2)} = ${formatNumber(cons2, 2)} t\nTotal consommé = ${formatNumber(cons1, 2)} + ${formatNumber(cons2, 2)} = ${formatNumber(consumed, 2)} t`,
      },
      {
        title: "Carburant restant",
        detail: `${formatNumber(fuelTons, 1)} − ${formatNumber(consumed, 2)} = ${formatTonnes(remaining, 2)}`,
      },
    ]
  );
};
