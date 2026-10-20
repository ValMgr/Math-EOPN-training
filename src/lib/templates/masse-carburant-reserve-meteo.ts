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
  spacedDeltas,
  type TemplateGenerator,
} from "../helpers";

/** Distance, conso L/h, majoration météo %, densité → masse */
export const masseCarburantReserveMeteo: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.transport, ...AIRCRAFT.jet]);
  const distance = randChoice([1800, 2000, 2160, 2400, 2500, 2700]);
  const speed = randChoice([360, 380, 390, 400, 420]);
  const consumption = randChoice([800, 850, 900, 920, 950, 1000]);
  const reservePct = randChoice([0.15, 0.18, 0.2, 0.22, 0.25]);
  const density = randChoice([0.78, 0.8, 0.82, 0.84]);

  const time = roundHours(distance / speed);
  const volumeFactor = roundTo(1 + reservePct, 2);
  const volumeBase = roundTo(consumption * time, 2);
  const volumeTotal = roundTo(volumeBase * volumeFactor, 2);
  const massKg = roundTo(volumeTotal * density, 2);
  const massTonnes = roundTo(massKg / 1000, 2);
  const withoutReserve = roundTo(roundTo(volumeBase * density, 2) / 1000, 2);

  const { correctLabel, distractors } = nearbyDistractors(
    massTonnes,
    spacedDeltas(
      [
        0.6,
        -1,
        1.4,
        -1.8,
        2.2,
        withoutReserve - massTonnes,
        roundTo(volumeTotal / 1000, 2) - massTonnes,
      ],
      0.4
    ),
    (n) => formatTonnes(n, 2),
    2
  );

  return makeQuestion(
    "masse-carburant-reserve-meteo",
    `Un ${craft} doit effectuer un acheminement vers une destination située à ${formatNumber(distance)} km. La vitesse de croisière est de ${formatNumber(speed)} km/h. Le débit de carburant planifié est de ${formatNumber(consumption)} L/h, mais les prévisions atmosphériques imposent une réserve supplémentaire de ${formatPercent(reservePct)}. Avec une densité du kérosène de ${formatNumber(density, 2)} kg/L, quelle masse de carburant sera nécessaire ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Temps de vol",
        detail: `Temps = ${formatNumber(distance)} ÷ ${formatNumber(speed)} = ${formatNumber(time, 2)} h`,
      },
      {
        title: "Volume de base",
        detail: `Volume = ${formatNumber(consumption)} × ${formatNumber(time, 2)} = ${formatNumber(volumeBase, 2, { trimZeros: true })} L`,
      },
      {
        title: "Application de la majoration météo",
        detail: `Facteur = 1 + ${reservePct.toFixed(2).replace(".", ",")}\nVolume total = ${formatNumber(volumeBase, 2, { trimZeros: true })} × ${formatNumber(volumeFactor, 2)} = ${formatNumber(volumeTotal, 2, { trimZeros: true })} L`,
      },
      {
        title: "Conversion en masse",
        detail: `Masse = ${formatNumber(volumeTotal, 2, { trimZeros: true })} × ${formatNumber(density, 2)} = ${formatNumber(massKg, 2, { trimZeros: true })} kg ≈ ${formatTonnes(massTonnes, 2)}`,
      },
    ]
  );
};
