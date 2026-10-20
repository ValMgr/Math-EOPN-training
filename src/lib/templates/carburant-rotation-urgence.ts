import { AIRCRAFT } from "../constants";
import {
  formatLiters,
  formatNumber,
  formatPercent,
  roundHours,
  roundTo,
} from "../format";
import {
  makeQuestion,
  nearbyDistractors,
  randChoice,
  spacedDeltas,
  type TemplateGenerator,
} from "../helpers";

/** Vitesse/conso +%, A/R → volume carburant */
export const carburantRotationUrgence: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.helico]);
  const v0 = randChoice([200, 220, 240, 250, 260]);
  const c0 = randChoice([900, 1000, 1100, 1150, 1200, 1300]);
  const pctV = randChoice([0.1, 0.12, 0.15, 0.18, 0.2]);
  const pctC = randChoice([0.2, 0.22, 0.25, 0.26, 0.28, 0.3]);
  const distance = randChoice([480, 540, 600, 660, 720, 780]);

  const v = roundTo(v0 * (1 + pctV), 1);
  const c = roundTo(c0 * (1 + pctC), 0);
  const totalDist = distance * 2;
  const duration = roundHours(totalDist / v);
  const fuelExact = roundTo(c * duration, 2);
  const fuelRounded = Math.round(fuelExact);
  const oneWay = Math.round(c * roundHours(distance / v));
  const baseConso = Math.round(c0 * duration);
  const forgotSpeed = Math.round(c * roundHours(totalDist / v0));

  const { correctLabel, distractors } = nearbyDistractors(
    fuelRounded,
    spacedDeltas(
      [
        300,
        -500,
        700,
        -900,
        1100,
        baseConso - fuelRounded,
        oneWay - fuelRounded,
        forgotSpeed - fuelRounded,
      ],
      200
    ),
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
        detail: `Vitesse d'urgence = ${formatNumber(v0)} × (1 + ${pctV.toFixed(2).replace(".", ",")}) = ${formatNumber(v, 1)} km/h\nConsommation d'urgence = ${formatNumber(c0)} × (1 + ${pctC.toFixed(2).replace(".", ",")}) = ${formatNumber(c)} L/h`,
      },
      {
        title: "Distance de la mission complète",
        detail: `Parcours total = ${formatNumber(distance)} × 2 = ${formatNumber(totalDist)} km`,
      },
      {
        title: "Calcul du temps nécessaire",
        detail: `Durée = ${formatNumber(totalDist)} ÷ ${formatNumber(v, 1)} = ${formatNumber(duration, 2)} h`,
      },
      {
        title: "Consommation pour la mission",
        detail: `Carburant total = ${formatNumber(c)} × ${formatNumber(duration, 2)} = ${formatNumber(fuelExact, 2, { trimZeros: true })} ≈ ${formatLiters(fuelRounded)}`,
      },
    ]
  );
};
