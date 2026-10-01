import { formatKm, formatNumber, roundTo } from "../format";
import { AIRCRAFT } from "../constants";
import {
  makeQuestion,
  nearbyDistractors,
  randChoice,
  type TemplateGenerator,
} from "../helpers";

/** 3 segments (cartes + temps) → distance totale */
export const segmentsCartes: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.helico]);
  // scale denom: 1/N → km/cm = N/100000
  const scale1 = randChoice([1_100_000, 1_500_000, 2_000_000, 2_500_000]);
  const cm1 = randChoice([5, 8, 10, 12, 13, 15]);
  const scale2 = randChoice([150_000, 200_000, 220_000, 250_000]);
  const cm2 = randChoice([12, 14, 16, 18, 20]);
  const v3 = randChoice([160, 180, 190, 200, 210]);
  const t3min = randChoice([35, 40, 45, 50, 52, 55]);

  const kmPerCm1 = scale1 / 100_000;
  const kmPerCm2 = scale2 / 100_000;
  const d1 = cm1 * kmPerCm1;
  const d2 = cm2 * kmPerCm2;
  const t3 = t3min / 60;
  const d3 = v3 * t3;
  const total = roundTo(d1 + d2 + d3, 1);

  const { correctLabel, distractors } = nearbyDistractors(
    total,
    [5, -8, 12, -15, d3 - (d1 + d2), 20],
    (n) => formatKm(n, 1),
    1
  );

  return makeQuestion(
    "segments-cartes",
    `Un ${craft} effectue une patrouille de surveillance en trois segments. Le premier tronçon est tracé sur ${cm1} cm sur une carte marine au 1/${formatNumber(scale1)}. Pour le second segment, le pilote utilise une carte topographique au 1/${formatNumber(scale2)} et mesure ${cm2} cm. Le troisième segment est parcouru à ${formatNumber(v3)} km/h pendant ${t3min} minutes. Quelle est la distance totale de la patrouille ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Distance du premier segment",
        detail: `Échelle 1/${formatNumber(scale1)} : 1 cm = ${formatNumber(kmPerCm1, 1, { trimZeros: true })} km\nDistance = ${cm1} × ${formatNumber(kmPerCm1, 1, { trimZeros: true })} = ${formatNumber(d1, 1, { trimZeros: true })} km`,
      },
      {
        title: "Distance du second segment",
        detail: `Échelle 1/${formatNumber(scale2)} : 1 cm = ${formatNumber(kmPerCm2, 1, { trimZeros: true })} km\nDistance = ${cm2} × ${formatNumber(kmPerCm2, 1, { trimZeros: true })} = ${formatNumber(d2, 1, { trimZeros: true })} km`,
      },
      {
        title: "Distance du troisième segment",
        detail: `${t3min} min = ${formatNumber(roundTo(t3, 3), 3)} h\nDistance = ${formatNumber(v3)} × ${formatNumber(roundTo(t3, 3), 3)} = ${formatNumber(roundTo(d3, 1), 1)} km`,
      },
      {
        title: "Distance totale",
        detail: `Total = ${formatNumber(d1, 1, { trimZeros: true })} + ${formatNumber(d2, 1, { trimZeros: true })} + ${formatNumber(roundTo(d3, 1), 1)} = ${formatKm(total, 1)}`,
      },
    ]
  );
};
