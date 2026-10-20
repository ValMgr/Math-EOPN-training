import { AIRCRAFT } from "../constants";
import {
  formatDurationHMS,
  formatDurationPlusMinutes,
  formatNumber,
  roundHours,
  roundTo,
} from "../format";
import {
  makeQuestion,
  randChoice,
  type TemplateGenerator,
} from "../helpers";

/** Deux aéronefs face-à-face → temps de jonction */
export const rencontreFrontale: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.jet, ...AIRCRAFT.transport]);
  const distance = randChoice([200, 220, 240, 260, 280, 300]);
  // One speed in m/s, other in km/h
  const v1ms = randChoice([140, 150, 160, 170, 180]);
  const v2kmh = randChoice([400, 420, 445, 460, 480, 500]);

  const v1kmh = roundTo(v1ms * 3.6, 1);
  const closing = roundTo(v1kmh + v2kmh, 1);
  const timeH = roundHours(distance / closing);
  const correctLabel = formatDurationHMS(timeH);

  // At least 3 min apart so a two-decimal hour cannot fall on two choices.
  const distractors = [-6, -3, 3, 6, 9].map((min) =>
    formatDurationPlusMinutes(timeH, min)
  );

  return makeQuestion(
    "rencontre-frontale",
    `Dans le cadre d'un entraînement de l'École de l'Air, deux ${craft} doivent se retrouver en vol pour une formation en patrouille. Ils décollent simultanément de terrains distants de ${formatNumber(distance)} km et volent l'un vers l'autre. Le premier évolue à une vitesse de ${formatNumber(v1ms)} m/s, le second à ${formatNumber(v2kmh)} km/h. Déterminez la durée avant leur jonction.`,
    correctLabel,
    distractors,
    [
      {
        title: "Homogénéisation des unités",
        detail: `Premier appareil : ${formatNumber(v1ms)} m/s × 3,6 = ${formatNumber(v1kmh, 1)} km/h\nSecond appareil : ${formatNumber(v2kmh)} km/h`,
      },
      {
        title: "Vitesse d'approche totale",
        detail: `Les deux appareils se dirigent l'un vers l'autre : ${formatNumber(v1kmh, 1)} + ${formatNumber(v2kmh)} = ${formatNumber(closing, 1)} km/h`,
      },
      {
        title: "Temps de convergence",
        detail: `t = ${formatNumber(distance)} ÷ ${formatNumber(closing, 1)} = ${formatNumber(timeH, 2)} h`,
      },
      {
        title: "Expression en minutes et secondes",
        detail: `${formatNumber(timeH, 2)} × 60 = ${formatNumber(roundTo(timeH * 60, 1), 1)} min = ${correctLabel}`,
      },
    ]
  );
};
