import { AIRCRAFT } from "../constants";
import {
  formatKm,
  formatNumber,
  formatPercent,
  roundTo,
} from "../format";
import {
  makeQuestion,
  nearbyDistractors,
  randChoice,
  type TemplateGenerator,
} from "../helpers";

/** Capacité + réserve + densité → distance max */
export const autonomieReserveSecurite: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.transport, ...AIRCRAFT.jet, "chasseur"]);
  const capacityL = randChoice([800, 900, 950, 1000, 1050, 1100, 1200]);
  const density = randChoice([0.78, 0.8, 0.81, 0.84, 0.86]);
  const reservePct = randChoice([0.08, 0.1, 0.12, 0.15]);
  const consumption = randChoice([70, 75, 78, 80, 85, 88, 90, 95]);
  const speed = randChoice([160, 165, 180, 190, 200, 205, 220]);

  const mass = capacityL * density;
  const reserve = mass * reservePct;
  const usable = mass - reserve;
  const hours = usable / consumption;
  const distance = roundTo(hours * speed, 0);

  const withoutReserve = roundTo((mass / consumption) * speed, 0);
  const { correctLabel, distractors } = nearbyDistractors(
    distance,
    [
      withoutReserve - distance,
      30,
      -45,
      60,
      -25,
      roundTo(hours * speed * 0.95, 0) - distance,
    ],
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
        detail: `${formatNumber(capacityL)} L × ${formatNumber(density, 2)} kg/L = ${formatNumber(roundTo(mass, 1), 1)} kg`,
      },
      {
        title: "Réserve de sécurité",
        detail: `${formatPercent(reservePct)} de ${formatNumber(roundTo(mass, 1), 1)} = ${formatNumber(roundTo(reserve, 2), 2)} kg à conserver`,
      },
      {
        title: "Carburant utilisable",
        detail: `${formatNumber(roundTo(mass, 1), 1)} − ${formatNumber(roundTo(reserve, 2), 2)} = ${formatNumber(roundTo(usable, 2), 2)} kg`,
      },
      {
        title: "Autonomie et distance",
        detail: `Autonomie = ${formatNumber(roundTo(usable, 2), 2)} ÷ ${formatNumber(consumption)} = ${formatNumber(roundTo(hours, 2), 2)} h\nDistance = ${formatNumber(roundTo(hours, 2), 2)} × ${formatNumber(speed)} = ${formatKm(distance)}`,
      },
    ]
  );
};
