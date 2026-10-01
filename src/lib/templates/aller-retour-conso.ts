import { formatNumber, formatTonnes, roundTo } from "../format";
import { AIRCRAFT, BASES } from "../constants";
import {
  makeQuestion,
  nearbyDistractors,
  randChoice,
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

  const t1 = t1min / 60;
  const d = v1 * t1;
  const t2 = d / v2;
  const consumed = c1 * t1 + c2 * t2;
  const remaining = roundTo(fuelTons - consumed, 2);

  const { correctLabel, distractors } = nearbyDistractors(
    remaining,
    [0.02, -0.04, 0.05, -0.03, 0.08, roundTo(fuelTons - c1 * t1, 2) - remaining],
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
        detail: `Temps initial = ${t1min}/60 = ${formatNumber(roundTo(t1, 4), 4)} h\nDistance = ${formatNumber(v1)} × ${formatNumber(roundTo(t1, 4), 4)} = ${formatNumber(roundTo(d, 2), 2)} km`,
      },
      {
        title: "Temps de retour",
        detail: `Temps retour = ${formatNumber(roundTo(d, 2), 2)} ÷ ${formatNumber(v2)} = ${formatNumber(roundTo(t2, 4), 4)} h`,
      },
      {
        title: "Consommations",
        detail: `Phase 1 : ${formatNumber(c1, 2)} × ${formatNumber(roundTo(t1, 4), 4)} = ${formatNumber(roundTo(c1 * t1, 3), 3)} t\nRetour : ${formatNumber(c2, 2)} × ${formatNumber(roundTo(t2, 4), 4)} = ${formatNumber(roundTo(c2 * t2, 3), 3)} t\nTotal consommé = ${formatNumber(roundTo(consumed, 3), 3)} t`,
      },
      {
        title: "Carburant restant",
        detail: `${formatNumber(fuelTons, 1)} − ${formatNumber(roundTo(consumed, 3), 3)} = ${formatTonnes(remaining, 2)}`,
      },
    ]
  );
};
