import { AIRCRAFT, BASES } from "../constants";
import { formatKg, formatNumber, roundHours, roundTo } from "../format";
import {
  de,
  makeQuestion,
  nearbyDistractors,
  randChoice,
  shuffle,
  spacedDeltas,
  type TemplateGenerator,
} from "../helpers";

/** Déroutement en route → carburant encore à bord à l'atterrissage */
export const deroutementBingo: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.jet, ...AIRCRAFT.transport]);
  const [origin, destination, alternate] = shuffle([...BASES]);
  const speed = randChoice([360, 400, 450, 480]);
  const flownHours = randChoice([0.5, 0.75, 1, 1.25, 1.5]);
  const destHours = randChoice([0.5, 0.75, 1, 1.25]);
  const cruiseKg = randChoice([800, 1000, 1200, 1600]);
  const fuelNow = randChoice([2200, 2500, 2800, 3000, 3200, 3600]);
  const flownDist = speed * flownHours;
  const destDist = speed * destHours;
  const flownFuel = roundTo(cruiseKg * flownHours, 0);
  const fuelDeparture = fuelNow + flownFuel;

  const altSpeed = randChoice([300, 320, 360, 400]);
  const altHours = randChoice([0.5, 0.75, 1]);
  const altDist = altSpeed * altHours;
  const altKg = randChoice([700, 800, 900, 1000, 1200]);
  const reserve = randChoice([400, 500, 600, 800]);

  const flownTime = roundHours(flownDist / speed);
  const altTime = roundHours(altDist / altSpeed);
  const divertFuel = roundTo(altKg * altTime, 0);
  const landing = fuelNow - divertFuel;
  const destTime = roundHours(destDist / speed);
  const destFuel = roundTo(cruiseKg * destTime, 0);
  const ifContinue = fuelNow - destFuel;
  const ifFromDeparture = fuelDeparture - divertFuel;

  const { correctLabel, distractors } = nearbyDistractors(
    landing,
    spacedDeltas(
      [
        150,
        -200,
        300,
        -450,
        600,
        ifContinue - landing,
        ifFromDeparture - landing,
        -reserve,
      ],
      100
    ),
    (n) => formatKg(n, 0)
  );

  return makeQuestion(
    "deroutement-bingo",
    `Un ${craft} a décollé ${de(origin!)} avec ${formatNumber(fuelDeparture)} kg de carburant vers ${destination}, à ${formatNumber(speed)} km/h et ${formatNumber(cruiseKg)} kg/h. Après ${formatNumber(flownDist, 1, { trimZeros: true })} km, ${destination} ferme pour cause météo : il resterait ${formatNumber(destDist, 1, { trimZeros: true })} km à parcourir. L'équipage déroute vers ${alternate}, à ${formatNumber(altDist, 1, { trimZeros: true })} km, rallié à ${formatNumber(altSpeed)} km/h et ${formatNumber(altKg)} kg/h. Le posé est exigé avec au moins ${formatNumber(reserve)} kg. Quelle masse de carburant restera-t-il dans les réservoirs à l'atterrissage sur ${alternate} ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Carburant au point de décision",
        detail: `Temps déjà volé = ${formatNumber(flownDist, 1, { trimZeros: true })} ÷ ${formatNumber(speed)} = ${formatNumber(flownTime, 2)} h\nConsommé = ${formatNumber(cruiseKg)} × ${formatNumber(flownTime, 2)} = ${formatKg(flownFuel)}\nReste = ${formatNumber(fuelDeparture)} − ${formatNumber(flownFuel)} = ${formatKg(fuelNow)}`,
      },
      {
        title: "Temps vers le dégagement",
        detail: `${formatNumber(altDist, 1, { trimZeros: true })} ÷ ${formatNumber(altSpeed)} = ${formatNumber(altTime, 2)} h`,
      },
      {
        title: "Consommation du déroutement",
        detail: `${formatNumber(altKg)} × ${formatNumber(altTime, 2)} = ${formatKg(divertFuel)}`,
      },
      {
        title: "Masse à l'atterrissage",
        detail: `${formatNumber(fuelNow)} − ${formatNumber(divertFuel)} = ${formatKg(landing)}\nLes ${formatNumber(reserve)} kg exigés sont un minimum à respecter : ils restent dans les réservoirs, ils ne se retranchent pas.`,
      },
    ]
  );
};
