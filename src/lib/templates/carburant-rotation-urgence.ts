import {
  formatLiters,
  formatNumber,
  formatPercent,
  roundTo,
} from "../format";
import {
  AIRCRAFT,
  makeQuestion,
  nearbyDistractors,
  randChoice,
  randInt,
  type TemplateGenerator,
} from "./helpers";

/** Vitesse/conso +%, A/R → volume carburant */
export const carburantRotationUrgence: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.helico]);
  const v0 = randChoice([200, 220, 240, 250, 260]);
  const c0 = randChoice([900, 1000, 1100, 1150, 1200, 1300]);
  const pctV = randChoice([0.1, 0.12, 0.15, 0.18, 0.2]);
  const pctC = randChoice([0.2, 0.22, 0.25, 0.26, 0.28, 0.3]);
  const distance = randChoice([480, 540, 600, 660, 720, 780]);

  const v = v0 * (1 + pctV);
  const c = c0 * (1 + pctC);
  const totalDist = distance * 2;
  const duration = totalDist / v;
  const fuel = c * duration;
  const fuelRounded = Math.round(fuel);

  const { correctLabel, distractors } = nearbyDistractors(
    fuelRounded,
    [
      Math.round(c0 * duration) - fuelRounded,
      Math.round(c * (distance / v)) - fuelRounded,
      Math.round(c * (totalDist / v0)) - fuelRounded,
      Math.round(fuel * 1.08) - fuelRounded,
      -50,
      80,
      -120,
    ],
    (n) => formatLiters(n, 0)
  );

  return makeQuestion(
    "carburant-rotation-urgence",
    `Dans le cadre d'une opération de sauvetage, un ${craft} navigue normalement à ${formatNumber(v0)} km/h avec une consommation de ${formatNumber(c0)} L/h. Face à l'urgence, l'équipage décide d'augmenter sa vitesse de ${formatPercent(pctV)}, entraînant une hausse de consommation de ${formatPercent(pctC)}. Il doit se rendre sur un site distant de ${formatNumber(distance)} km puis rentrer en se déplaçant à sa vitesse augmentée. Quel sera le besoin en carburant pour cette rotation ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Caractéristiques de vol en urgence",
        detail: `Vitesse d'urgence = ${formatNumber(v0)} × (1 + ${pctV.toFixed(2).replace(".", ",")}) = ${formatNumber(roundTo(v, 1), 1)} km/h\nConsommation d'urgence = ${formatNumber(c0)} × (1 + ${pctC.toFixed(2).replace(".", ",")}) = ${formatNumber(roundTo(c, 0))} L/h`,
      },
      {
        title: "Distance de la mission complète",
        detail: `Parcours total = ${formatNumber(distance)} × 2 = ${formatNumber(totalDist)} km`,
      },
      {
        title: "Calcul du temps nécessaire",
        detail: `Durée = ${formatNumber(totalDist)} ÷ ${formatNumber(roundTo(v, 1), 1)} = ${formatNumber(roundTo(duration, 3), 3)} heures`,
      },
      {
        title: "Consommation pour la mission",
        detail: `Carburant total = ${formatNumber(roundTo(c, 0))} × ${formatNumber(roundTo(duration, 3), 3)} = ${formatLiters(fuelRounded)}`,
      },
    ]
  );
};
