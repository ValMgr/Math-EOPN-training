import { AIRCRAFT, BASES } from "../constants";
import {
  formatKg,
  formatNumber,
  formatPercent,
  roundHours,
  roundTo,
} from "../format";
import {
  de,
  makeQuestion,
  nearbyDistractors,
  randChoice,
  shuffle,
  spacedDeltas,
  type TemplateGenerator,
} from "../helpers";

/** Trajet + majoration du trajet + dégagement + réserve finale → masse au départ */
export const carburantReglementaire: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.transport]);
  const [origin, destination, alternate] = shuffle([...BASES]);
  const tripHours = randChoice([1.5, 2, 2.5, 3]);
  const tripSpeed = randChoice([400, 420, 450, 480, 500]);
  const tripDist = tripSpeed * tripHours;
  const altHours = randChoice([0.5, 0.75, 1]);
  const altSpeed = randChoice([360, 400, 480]);
  const altDist = altSpeed * altHours;
  const cruiseKg = randChoice([800, 1000, 1200, 1400, 1600]);
  const altKg = randChoice([700, 900, 1000, 1100, 1300]);
  const holdKg = randChoice([600, 800, 1000]);
  const reserveMin = randChoice([30, 45]);
  const contingency = randChoice([0.05, 0.1]);

  const tripTime = roundHours(tripDist / tripSpeed);
  const tripFuel = roundTo(cruiseKg * tripTime, 0);
  const contingencyFuel = roundTo(tripFuel * contingency, 0);
  const altTime = roundHours(altDist / altSpeed);
  const altFuel = roundTo(altKg * altTime, 0);
  const reserveHours = roundHours(reserveMin / 60);
  const reserveFuel = roundTo(holdKg * reserveHours, 0);
  const total = tripFuel + contingencyFuel + altFuel + reserveFuel;

  const onTripAndAlt = roundTo((tripFuel + altFuel) * contingency, 0);
  const onEverything = roundTo(
    (tripFuel + altFuel + reserveFuel) * contingency,
    0
  );
  const reserveAtCruise = roundTo(cruiseKg * reserveHours, 0);

  const { correctLabel, distractors } = nearbyDistractors(
    total,
    spacedDeltas(
      [
        150,
        -250,
        400,
        -600,
        800,
        -contingencyFuel,
        onTripAndAlt - contingencyFuel,
        onEverything - contingencyFuel,
        reserveAtCruise - reserveFuel,
        -reserveFuel,
      ],
      80
    ),
    (n) => formatKg(n, 0)
  );

  return makeQuestion(
    "carburant-reglementaire",
    `Un ${craft} prépare un départ ${de(origin!)} vers ${destination}, à ${formatNumber(tripDist)} km. La croisière se fait à ${formatNumber(tripSpeed)} km/h pour ${formatNumber(cruiseKg)} kg/h. Le dossier carburant retient une majoration de ${formatPercent(contingency)} du carburant de trajet, puis de quoi rallier ${alternate} (${formatNumber(altDist)} km à ${formatNumber(altSpeed)} km/h et ${formatNumber(altKg)} kg/h), puis une réserve finale de ${reserveMin} minutes à la consommation d'attente de ${formatNumber(holdKg)} kg/h. Quelle masse de carburant faut-il embarquer au départ ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Carburant de trajet",
        detail: `Temps = ${formatNumber(tripDist)} ÷ ${formatNumber(tripSpeed)} = ${formatNumber(tripTime, 2)} h\nTrajet = ${formatNumber(cruiseKg)} × ${formatNumber(tripTime, 2)} = ${formatKg(tripFuel)}`,
      },
      {
        title: "Majoration du seul trajet",
        detail: `${formatPercent(contingency)} de ${formatNumber(tripFuel)} = ${formatKg(contingencyFuel)}\nLa majoration ne s'applique ni au dégagement ni à la réserve finale.`,
      },
      {
        title: "Dégagement et réserve finale",
        detail: `Dégagement = ${formatNumber(altDist)} ÷ ${formatNumber(altSpeed)} = ${formatNumber(altTime, 2)} h, soit ${formatNumber(altKg)} × ${formatNumber(altTime, 2)} = ${formatKg(altFuel)}\nRéserve = ${reserveMin} min = ${formatNumber(reserveHours, 2)} h, soit ${formatNumber(holdKg)} × ${formatNumber(reserveHours, 2)} = ${formatKg(reserveFuel)}`,
      },
      {
        title: "Masse au départ",
        detail: `${formatNumber(tripFuel)} + ${formatNumber(contingencyFuel)} + ${formatNumber(altFuel)} + ${formatNumber(reserveFuel)} = ${formatKg(total)}`,
      },
    ]
  );
};
