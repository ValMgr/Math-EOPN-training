import { AIRCRAFT } from "../constants";
import {
  formatNumber,
  formatPercent,
  formatTonnes,
  roundHours,
  roundTo,
} from "../format";
import {
  makeQuestion,
  nearbyDistractors,
  randChoice,
  type TemplateGenerator,
} from "../helpers";

/** 2 phases (normale puis turbulences) + densité → tonnes */
export const turbulencesMasse: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.helico]);
  const v0 = randChoice([90, 95, 100, 110, 120]);
  const c0 = randChoice([280, 300, 320, 350, 380, 400]);
  const t1 = randChoice([2, 2.5, 3, 3.5]);
  const totalDist = randChoice([450, 500, 540, 570, 600, 650]);
  const pctV = randChoice([0.1, 0.12, 0.15, 0.18]);
  const pctC = randChoice([0.18, 0.2, 0.22, 0.25]);
  const density = randChoice([0.76, 0.78, 0.8, 0.82]);

  const d1 = roundTo(v0 * t1, 1);
  // Ensure remaining distance is positive
  const safeTotal = d1 < totalDist ? totalDist : Math.ceil(d1) + randChoice([200, 250, 300]);
  const d2 = roundTo(safeTotal - d1, 1);
  const v2 = roundTo(v0 * (1 - pctV), 1);
  const c2 = roundTo(c0 * (1 + pctC), 1);
  const t2 = roundHours(d2 / v2);
  const vol1 = roundTo(c0 * t1, 1);
  const vol2 = roundTo(c2 * t2, 1);
  const fuelL = roundTo(vol1 + vol2, 1);
  const massKg = roundTo(fuelL * density, 1);
  const answer = roundTo(massKg / 1000, 2);

  const { correctLabel, distractors } = nearbyDistractors(
    answer,
    [0.25, -0.4, 0.55, -0.7, 0.9],
    (n) => formatTonnes(n, 2),
    2
  );

  return makeQuestion(
    "turbulences-masse",
    `Un ${craft} effectue une mission de reconnaissance. Sa consommation normale est de ${formatNumber(c0)} L/h à une vitesse de croisière de ${formatNumber(v0)} km/h. Il doit couvrir une zone de ${formatNumber(safeTotal)} km au total. Après ${formatNumber(t1, 1, { trimZeros: true })} heures de vol, il entre dans une zone de turbulences qui diminuent sa vitesse de ${formatPercent(pctV)} et augmentent sa consommation de ${formatPercent(pctC)}. Le carburant utilisé a une densité de ${formatNumber(density, 2)} kg/L. Quelle masse totale de carburant en tonnes aura-t-il consommée à l'issue de cette mission ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Distance parcourue avant les turbulences",
        detail: `Distance parcourue = ${formatNumber(v0)} × ${formatNumber(t1, 2)} = ${formatNumber(d1, 1)} km\nDistance restante = ${formatNumber(safeTotal)} − ${formatNumber(d1, 1)} = ${formatNumber(d2, 1)} km`,
      },
      {
        title: "Conditions en turbulence",
        detail: `Vitesse = ${formatNumber(v0)} × (1 − ${pctV.toFixed(2).replace(".", ",")}) = ${formatNumber(v2, 1)} km/h\nConsommation = ${formatNumber(c0)} × (1 + ${pctC.toFixed(2).replace(".", ",")}) = ${formatNumber(c2, 1)} L/h`,
      },
      {
        title: "Temps et volumes consommés",
        detail: `Temps phase 2 = ${formatNumber(d2, 1)} ÷ ${formatNumber(v2, 1)} = ${formatNumber(t2, 2)} h\nVolume total = ${formatNumber(c0)} × ${formatNumber(t1, 2)} + ${formatNumber(c2, 1)} × ${formatNumber(t2, 2)} = ${formatNumber(vol1, 1)} + ${formatNumber(vol2, 1)} = ${formatNumber(fuelL, 1)} L`,
      },
      {
        title: "Conversion en masse",
        detail: `Masse = ${formatNumber(fuelL, 1)} × ${formatNumber(density, 2)} = ${formatNumber(massKg, 1)} kg ≈ ${formatTonnes(answer, 2)}`,
      },
    ]
  );
};
