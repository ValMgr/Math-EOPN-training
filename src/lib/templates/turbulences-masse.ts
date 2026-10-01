import {
  formatNumber,
  formatPercent,
  formatTonnes,
  roundTo,
} from "../format";
import {
  AIRCRAFT,
  makeQuestion,
  nearbyDistractors,
  randChoice,
  type TemplateGenerator,
} from "./helpers";

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

  const d1 = v0 * t1;
  // Ensure remaining distance is positive
  const safeTotal = d1 < totalDist ? totalDist : Math.ceil(d1) + randChoice([200, 250, 300]);
  const d2 = safeTotal - d1;
  const v2 = v0 * (1 - pctV);
  const c2 = c0 * (1 + pctC);
  const t2 = d2 / v2;
  const fuelL = c0 * t1 + c2 * t2;
  const massTonnes = (fuelL * density) / 1000;
  const answer = roundTo(massTonnes, 2);

  const { correctLabel, distractors } = nearbyDistractors(
    answer,
    [0.05, -0.08, 0.12, -0.15, 0.2, -0.04],
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
        detail: `Distance parcourue = ${formatNumber(v0)} × ${formatNumber(t1, 1, { trimZeros: true })} = ${formatNumber(d1)} km\nDistance restante = ${formatNumber(safeTotal)} − ${formatNumber(d1)} = ${formatNumber(roundTo(d2, 1), 1)} km`,
      },
      {
        title: "Conditions en turbulence",
        detail: `Vitesse = ${formatNumber(v0)} × (1 − ${pctV.toFixed(2).replace(".", ",")}) = ${formatNumber(roundTo(v2, 1), 1)} km/h\nConsommation = ${formatNumber(c0)} × (1 + ${pctC.toFixed(2).replace(".", ",")}) = ${formatNumber(roundTo(c2, 1), 1)} L/h`,
      },
      {
        title: "Temps et volumes consommés",
        detail: `Temps phase 2 = ${formatNumber(roundTo(d2, 1), 1)} ÷ ${formatNumber(roundTo(v2, 1), 1)} = ${formatNumber(roundTo(t2, 3), 3)} h\nVolume total = ${formatNumber(c0)} × ${formatNumber(t1, 1, { trimZeros: true })} + ${formatNumber(roundTo(c2, 1), 1)} × ${formatNumber(roundTo(t2, 3), 3)} = ${formatNumber(roundTo(fuelL, 1), 1)} L`,
      },
      {
        title: "Conversion en masse",
        detail: `Masse = ${formatNumber(roundTo(fuelL, 1), 1)} × ${formatNumber(density, 2)} = ${formatNumber(roundTo(fuelL * density, 1), 1)} kg = ${formatTonnes(answer, 2)}`,
      },
    ]
  );
};
