import { AIRCRAFT } from "../constants";
import {
  formatKm,
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

/** Capacité + réserve + densité → distance max */
export const autonomieReserveSecurite: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.transport, ...AIRCRAFT.jet]);
  const capacityL = randChoice([800, 900, 950, 1000, 1050, 1100, 1200]);
  const density = randChoice([0.78, 0.8, 0.81, 0.84, 0.86]);
  const reservePct = randChoice([0.08, 0.1, 0.12, 0.15]);
  const consumption = randChoice([70, 75, 78, 80, 85, 88, 90, 95]);
  const speed = randChoice([160, 165, 180, 190, 200, 205, 220]);

  const mass = roundTo(capacityL * density, 1);
  const reserve = roundTo(mass * reservePct, 2);
  const usable = roundTo(mass - reserve, 2);
  const hours = roundHours(usable / consumption);
  const distanceExact = roundTo(hours * speed, 2);
  const distance = Math.round(distanceExact);

  const hoursFull = roundHours(mass / consumption);
  const withoutReserve = roundTo(hoursFull * speed, 0);
  const { correctLabel, distractors } = nearbyDistractors(
    distance,
    spacedDeltas(
      [80, -120, 160, -200, 240, withoutReserve - distance],
      40
    ),
    (n) => formatKm(n, 0)
  );

  return makeQuestion(
    "autonomie-reserve-securite",
    `Lors d'une mission de convoyage, un ${craft} doit maintenir ${formatPercent(reservePct)} de son carburant en réserve de sécurité. Sa consommation s'élève à ${formatNumber(consumption)} kg/h en vol de croisière à ${formatNumber(speed)} km/h, pour une capacité totale de ${formatNumber(capacityL)} litres. La densité du kérosène est de ${formatNumber(density, 2)} kg/L. Quelle distance maximale peut-il couvrir durant cette mission ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Masse totale de carburant",
        detail: `${formatNumber(capacityL)} L × ${formatNumber(density, 2)} kg/L = ${formatNumber(mass, 1)} kg`,
      },
      {
        title: "Réserve de sécurité",
        detail: `${formatPercent(reservePct)} de ${formatNumber(mass, 1)} = ${formatNumber(reserve, 2)} kg à conserver`,
      },
      {
        title: "Carburant utilisable",
        detail: `${formatNumber(mass, 1)} − ${formatNumber(reserve, 2)} = ${formatNumber(usable, 2)} kg`,
      },
      {
        title: "Autonomie et distance",
        detail: `Autonomie = ${formatNumber(usable, 2)} ÷ ${formatNumber(consumption)} = ${formatNumber(hours, 2)} h\nDistance = ${formatNumber(hours, 2)} × ${formatNumber(speed)} = ${distanceExact === distance ? formatKm(distance) : `${formatNumber(distanceExact, 2, { trimZeros: true })} ≈ ${formatKm(distance)}`}`,
      },
    ]
  );
};
