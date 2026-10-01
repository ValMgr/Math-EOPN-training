import { formatDurationHMS, formatNumber, roundTo } from "../format";
import {
  AIRCRAFT,
  makeQuestion,
  randChoice,
  type TemplateGenerator,
} from "./helpers";

/** Deux aéronefs face-à-face → temps de jonction */
export const rencontreFrontale: TemplateGenerator = () => {
  const craft = randChoice(["Fouga Magister", "Alpha Jet", "TB-30 Epsilon"]);
  const distance = randChoice([200, 220, 240, 260, 280, 300]);
  // One speed in m/s, other in km/h
  const v1ms = randChoice([140, 150, 160, 170, 180]);
  const v2kmh = randChoice([400, 420, 445, 460, 480, 500]);

  const v1kmh = v1ms * 3.6;
  const closing = v1kmh + v2kmh;
  const timeH = distance / closing;
  const correctLabel = formatDurationHMS(timeH);

  const distractors = [-20, 15, -30, 28, 40].map((s) =>
    formatDurationHMS(timeH + s / 3600)
  );

  return makeQuestion(
    "rencontre-frontale",
    `Dans le cadre d'un entraînement de l'École de l'Air, deux ${craft} doivent se retrouver en vol pour une formation en patrouille. Ils décollent simultanément de terrains distants de ${formatNumber(distance)} km et volent l'un vers l'autre. Le premier évolue à une vitesse de ${formatNumber(v1ms)} m/s, le second à ${formatNumber(v2kmh)} km/h. Déterminez la durée avant leur jonction.`,
    correctLabel,
    distractors,
    [
      {
        title: "Homogénéisation des unités",
        detail: `Premier appareil : ${formatNumber(v1ms)} m/s × 3,6 = ${formatNumber(roundTo(v1kmh, 1), 1)} km/h\nSecond appareil : ${formatNumber(v2kmh)} km/h`,
      },
      {
        title: "Vitesse d'approche totale",
        detail: `Les deux appareils se dirigent l'un vers l'autre : ${formatNumber(roundTo(v1kmh, 1), 1)} + ${formatNumber(v2kmh)} = ${formatNumber(roundTo(closing, 1), 1)} km/h`,
      },
      {
        title: "Temps de convergence",
        detail: `t = ${formatNumber(distance)} ÷ ${formatNumber(roundTo(closing, 1), 1)} = ${formatNumber(roundTo(timeH, 4), 4)} h`,
      },
      {
        title: "Expression en minutes et secondes",
        detail: `Durée = ${correctLabel}`,
      },
    ]
  );
};
