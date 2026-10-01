import { formatDurationHMS, formatNumber, roundTo } from "../format";
import { AIRCRAFT, BASES } from "../constants";
import {
  makeQuestion,
  randChoice,
  type TemplateGenerator,
} from "../helpers";

/** Carte + 2 phases + procédures % → durée */
export const cartePhasesProcedures: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.jet]);
  const base = randChoice([...BASES]);
  const scale = randChoice([500_000, 1_000_000, 2_000_000]);
  const cm1 = randChoice([10, 12, 14, 16, 18]);
  const cm2 = randChoice([12, 15, 18, 20, 22]);
  const v1 = randChoice([350, 380, 400, 420, 450]);
  const pctSlow = randChoice([0.2, 0.25, 0.3, 0.35]);
  const procedurePct = randChoice([0.1, 0.12, 0.15, 0.18]);

  const kmPerCm = scale / 100_000;
  const d1 = cm1 * kmPerCm;
  const d2 = cm2 * kmPerCm;
  const v2 = v1 * (1 - pctSlow);
  const tVol = d1 / v1 + d2 / v2;
  const tTotal = tVol / (1 - procedurePct);
  const correctLabel = formatDurationHMS(tTotal);

  // Nearby distractors by shifting seconds
  const offsetsSec = [-90, 60, -45, 120, -30];
  const distractors = offsetsSec.map((s) =>
    formatDurationHMS(tTotal + s / 3600)
  );

  return makeQuestion(
    "carte-phases-procedures",
    `Lors d'un exercice militaire, un pilote de ${craft} consulte sa carte au 1:${formatNumber(scale)}. Il mesure ${cm1} cm entre sa base de ${base} et l'objectif, puis ${cm2} cm supplémentaires jusqu'au point de rendez-vous final. Durant la première phase, il vole à ${formatNumber(v1)} km/h, mais doit ralentir de ${formatNumber(pctSlow * 100)} % pour la phase d'approche finale. Les procédures de décollage et d'atterrissage représentent un temps additionnel de ${formatNumber(procedurePct * 100)} % de la durée totale de mission. Quelle est la durée complète de cette mission ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Distances réelles",
        detail: `1 cm = ${formatNumber(kmPerCm, 1, { trimZeros: true })} km\nPhase 1 = ${cm1} × ${formatNumber(kmPerCm, 1, { trimZeros: true })} = ${formatNumber(d1)} km\nPhase 2 = ${cm2} × ${formatNumber(kmPerCm, 1, { trimZeros: true })} = ${formatNumber(d2)} km`,
      },
      {
        title: "Vitesse d'approche",
        detail: `Vitesse phase 2 = ${formatNumber(v1)} × (1 − ${pctSlow.toFixed(2).replace(".", ",")}) = ${formatNumber(roundTo(v2, 1), 1)} km/h`,
      },
      {
        title: "Temps de vol pur",
        detail: `t₁ = ${formatNumber(d1)} ÷ ${formatNumber(v1)} = ${formatNumber(roundTo(d1 / v1, 4), 4)} h\nt₂ = ${formatNumber(d2)} ÷ ${formatNumber(roundTo(v2, 1), 1)} = ${formatNumber(roundTo(d2 / v2, 4), 4)} h\nT_vol = ${formatNumber(roundTo(tVol, 4), 4)} h`,
      },
      {
        title: "Ajout des procédures",
        detail: `T_total = T_vol ÷ (1 − ${procedurePct.toFixed(2).replace(".", ",")}) = ${formatNumber(roundTo(tVol, 4), 4)} ÷ ${formatNumber(1 - procedurePct, 2)} = ${formatNumber(roundTo(tTotal, 4), 4)} h ≈ ${correctLabel}`,
      },
    ]
  );
};
