import { AIRCRAFT } from "../constants";
import {
  formatKg,
  formatNumber,
  formatPercent,
  formatTonnes,
  roundTo,
} from "../format";
import {
  makeQuestion,
  nearbyDistractors,
  randChoice,
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

  const time = distance / speed;
  const volumeBase = consumption * time;
  const volumeTotal = volumeBase * (1 + reservePct);
  const massKg = volumeTotal * density;
  const massTonnes = roundTo(massKg / 1000, 2);

  const { correctLabel, distractors } = nearbyDistractors(
    massTonnes,
    [
      roundTo(volumeBase * density / 1000, 2) - massTonnes,
      0.1,
      -0.12,
      0.25,
      -0.08,
      roundTo(volumeTotal / 1000, 2) - massTonnes,
    ],
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
        detail: `Temps = ${formatNumber(distance)} ÷ ${formatNumber(speed)} = ${formatNumber(roundTo(time, 3), 3)} h`,
      },
      {
        title: "Volume de base",
        detail: `Volume = ${formatNumber(consumption)} × ${formatNumber(roundTo(time, 3), 3)} = ${formatNumber(roundTo(volumeBase, 0))} L`,
      },
      {
        title: "Application de la majoration météo",
        detail: `Facteur = 1 + ${reservePct.toFixed(2).replace(".", ",")}\nVolume total = ${formatNumber(roundTo(volumeBase, 0))} × ${formatNumber(1 + reservePct, 2)} = ${formatNumber(roundTo(volumeTotal, 0))} L`,
      },
      {
        title: "Conversion en masse",
        detail: `Masse = ${formatNumber(roundTo(volumeTotal, 0))} × ${formatNumber(density, 2)} = ${formatKg(roundTo(massKg, 0))} = ${formatTonnes(massTonnes, 2)}`,
      },
    ]
  );
};
