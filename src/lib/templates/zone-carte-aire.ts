import { AIRCRAFT } from "../constants";
import { formatKm2, formatNumber, roundTo } from "../format";
import {
  makeQuestion,
  nearbyDistractors,
  randChoice,
  spacedDeltas,
  type TemplateGenerator,
} from "../helpers";

/** Rectangle sur la carte → aire réelle, échelle au carré */
export const zoneCarteAire: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.helico, ...AIRCRAFT.jet]);
  const scale = randChoice([250_000, 500_000, 1_000_000, 2_000_000]);
  const lengthCm = randChoice([4, 5, 6, 8, 10, 12]);
  const widthCm = randChoice([3, 4, 5, 6, 8]);
  const kmPerCm = scale / 100_000;
  const lengthKm = roundTo(lengthCm * kmPerCm, 2);
  const widthKm = roundTo(widthCm * kmPerCm, 2);
  const area = roundTo(lengthKm * widthKm, 2);
  const scaledOnce = roundTo(lengthCm * widthCm * kmPerCm, 2);
  const cell = roundTo(kmPerCm * kmPerCm, 2);

  const { correctLabel, distractors } = nearbyDistractors(
    area,
    spacedDeltas(
      [
        scaledOnce - area,
        lengthKm - area,
        cell,
        -2 * cell,
        3 * cell,
        -4 * cell,
      ],
      roundTo(cell / 2, 2)
    ),
    (n) => formatKm2(n, 2),
    2
  );

  return makeQuestion(
    "zone-carte-aire",
    `Sur une carte au 1/${formatNumber(scale)}, la zone assignée à un ${craft} est un rectangle de ${formatNumber(lengthCm)} cm sur ${formatNumber(widthCm)} cm. Quelle est l'aire réelle de cette zone ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Échelle linéaire",
        detail: `1 cm représente ${formatNumber(scale)} ÷ ${formatNumber(100_000)} = ${formatNumber(kmPerCm, 2, { trimZeros: true })} km.`,
      },
      {
        title: "Dimensions réelles",
        detail: `Longueur = ${formatNumber(lengthCm)} × ${formatNumber(kmPerCm, 2, { trimZeros: true })} = ${formatNumber(lengthKm, 2, { trimZeros: true })} km\nLargeur = ${formatNumber(widthCm)} × ${formatNumber(kmPerCm, 2, { trimZeros: true })} = ${formatNumber(widthKm, 2, { trimZeros: true })} km`,
      },
      {
        title: "Aire",
        detail: `Le facteur d'échelle s'applique aux deux côtés.\nAire = ${formatNumber(lengthKm, 2, { trimZeros: true })} × ${formatNumber(widthKm, 2, { trimZeros: true })} = ${formatKm2(area, 2)}`,
      },
    ]
  );
};
