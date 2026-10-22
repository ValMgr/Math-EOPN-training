import { AIRCRAFT, BASES } from "../constants";
import { formatLiters, formatNumber, roundHours, roundTo } from "../format";
import {
  de,
  makeQuestion,
  nearbyDistractors,
  randChoice,
  spacedDeltas,
  type TemplateGenerator,
} from "../helpers";

const PROFILES = [
  { altFt: 6000, climbFpm: 1000, descFpm: 2000 },
  { altFt: 6000, climbFpm: 2000, descFpm: 1000 },
  { altFt: 9000, climbFpm: 1000, descFpm: 1500 },
  { altFt: 9000, climbFpm: 1500, descFpm: 1000 },
  { altFt: 12000, climbFpm: 1000, descFpm: 2000 },
  { altFt: 12000, climbFpm: 2000, descFpm: 1000 },
  { altFt: 15000, climbFpm: 1000, descFpm: 2500 },
  { altFt: 15000, climbFpm: 2500, descFpm: 1000 },
  { altFt: 18000, climbFpm: 1500, descFpm: 2000 },
  { altFt: 18000, climbFpm: 2000, descFpm: 1500 },
];

/** Montée, palier, descente → volume consommé */
export const monteeCroisiereDescente: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.jet]);
  const base = randChoice([...BASES]);
  const profile = randChoice(PROFILES);
  const climbSpeed = randChoice([180, 210, 240, 270, 300]);
  const descSpeed = randChoice([270, 300, 330, 360, 390]);
  const cruiseSpeed = randChoice([420, 450, 480, 540, 600]);
  const cClimb = randChoice([900, 1000, 1100, 1200, 1400]);
  const cCruise = randChoice([500, 600, 700, 800]);
  const cDesc = randChoice([300, 400, 500, 600]);
  const cruiseH = randChoice([1, 1.25, 1.5, 1.75, 2, 2.25, 2.5]);

  const climbMin = profile.altFt / profile.climbFpm;
  const descMin = profile.altFt / profile.descFpm;
  const climbH = roundHours(climbMin / 60);
  const descH = roundHours(descMin / 60);
  const climbDist = roundTo((climbSpeed * climbMin) / 60, 2);
  const descDist = roundTo((descSpeed * descMin) / 60, 2);
  const cruiseDist = roundTo(cruiseSpeed * cruiseH, 2);
  const totalDist = roundTo(climbDist + descDist + cruiseDist, 2);

  const volClimb = roundTo((cClimb * climbMin) / 60, 0);
  const volCruise = roundTo(cCruise * cruiseH, 0);
  const volDesc = roundTo((cDesc * descMin) / 60, 0);
  const answer = volClimb + volCruise + volDesc;

  const fullCruiseH = roundHours(totalDist / cruiseSpeed);
  const forgotProfile = Math.round(volClimb + cCruise * fullCruiseH + volDesc);

  const { correctLabel, distractors } = nearbyDistractors(
    answer,
    spacedDeltas(
      [40, -60, 90, -120, 160, forgotProfile - answer],
      25
    ),
    (n) => formatLiters(n, 0)
  );

  return makeQuestion(
    "montee-croisiere-descente",
    `Un ${craft} décolle ${de(base)} pour un trajet de ${formatNumber(totalDist, 2, { trimZeros: true })} km. Il monte de ${formatNumber(profile.altFt)} ft à ${formatNumber(profile.climbFpm)} ft/min, en volant à ${formatNumber(climbSpeed)} km/h et ${formatNumber(cClimb)} L/h. Le palier se fait à ${formatNumber(cruiseSpeed)} km/h et ${formatNumber(cCruise)} L/h. Il redescend ensuite de la même hauteur, jusqu'à l'altitude de départ, à ${formatNumber(profile.descFpm)} ft/min, ${formatNumber(descSpeed)} km/h et ${formatNumber(cDesc)} L/h. Quel volume de carburant la mission consomme-t-elle ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Montée et descente",
        detail: `Montée = ${formatNumber(profile.altFt)} ÷ ${formatNumber(profile.climbFpm)} = ${formatNumber(climbMin)} min = ${formatNumber(climbH, 2)} h, soit ${formatNumber(climbDist, 2, { trimZeros: true })} km\nDescente = ${formatNumber(profile.altFt)} ÷ ${formatNumber(profile.descFpm)} = ${formatNumber(descMin)} min = ${formatNumber(descH, 2)} h, soit ${formatNumber(descDist, 2, { trimZeros: true })} km`,
      },
      {
        title: "Distance et temps de palier",
        detail: `Palier = ${formatNumber(totalDist, 2, { trimZeros: true })} − ${formatNumber(climbDist, 2, { trimZeros: true })} − ${formatNumber(descDist, 2, { trimZeros: true })} = ${formatNumber(cruiseDist, 2, { trimZeros: true })} km\nTemps = ${formatNumber(cruiseDist, 2, { trimZeros: true })} ÷ ${formatNumber(cruiseSpeed)} = ${formatNumber(cruiseH, 2)} h`,
      },
      {
        title: "Volumes par phase",
        detail: `Montée = ${formatNumber(cClimb)} × ${formatNumber(climbH, 2)} = ${formatNumber(volClimb)} L\nPalier = ${formatNumber(cCruise)} × ${formatNumber(cruiseH, 2)} = ${formatNumber(volCruise)} L\nDescente = ${formatNumber(cDesc)} × ${formatNumber(descH, 2)} = ${formatNumber(volDesc)} L`,
      },
      {
        title: "Volume total",
        detail: `${formatNumber(volClimb)} + ${formatNumber(volCruise)} + ${formatNumber(volDesc)} = ${formatLiters(answer)}`,
      },
    ]
  );
};
