import {
  addMinutesToClock,
  formatClock,
  formatNumber,
  roundHours,
  roundTo,
} from "../format";
import { AIRCRAFT, BASES } from "../constants";
import {
  makeQuestion,
  randChoice,
  type TemplateGenerator,
} from "../helpers";

/** Décollage décalé → heure de rendez-vous */
export const rendezVousRattrapage: TemplateGenerator = () => {
  const slowCraft = randChoice([...AIRCRAFT.helico]);
  const fastCraft = randChoice([...AIRCRAFT.jet]);
  const base = randChoice([...BASES]);
  const startH = randChoice([8, 9, 10, 11, 14, 15]);
  const startM = randChoice([0, 5, 10, 15, 20, 30, 45]);
  const delayMin = randChoice([20, 25, 30, 35, 40, 45]);
  const vSlow = randChoice([140, 150, 160, 170, 180]);
  const vFast = randChoice([320, 340, 360, 380, 400, 420]);

  const delayH = roundHours(delayMin / 60);
  const lead = roundTo(vSlow * delayH, 1);
  const relative = vFast - vSlow;
  const catchH = roundHours(lead / relative);
  const catchMin = roundTo(catchH * 60, 1);
  const catchMinRounded = Math.round(catchMin);
  const meeting = addMinutesToClock(
    startH,
    startM,
    delayMin + catchMinRounded
  );
  const correctLabel = meeting.label;
  const takeoff = addMinutesToClock(startH, startM, delayMin);
  const meetingOffset = delayMin + catchMinRounded;

  const catchMinutes = (distanceKm: number, closingKmH: number) => {
    const hours = roundHours(distanceKm / closingKmH);
    return Math.round(roundTo(hours * 60, 1));
  };

  // Every choice must be after the later takeoff. A time before that
  // departure is impossible and can be discarded without calculating.
  const picked: number[] = [];
  const pushOffset = (offsetMin: number) => {
    if (picked.length >= 4) return;
    const offset = Math.round(offsetMin);
    if (offset <= delayMin || offset === meetingOffset) return;
    if (Math.abs(offset - meetingOffset) < 5) return;
    if (picked.some((existing) => Math.abs(existing - offset) < 5)) return;
    picked.push(offset);
  };

  const leadAtFast = roundTo(vFast * delayH, 1);
  pushOffset(delayMin + catchMinutes(lead, vFast + vSlow));
  pushOffset(delayMin + catchMinutes(lead, vFast));
  pushOffset(delayMin + catchMinutes(lead, vSlow));
  pushOffset(delayMin + catchMinutes(leadAtFast, relative));
  pushOffset(meetingOffset + delayMin);
  for (const delta of [-15, 15, -30, 30, -45, 45, 60, 75, 90]) {
    pushOffset(meetingOffset + delta);
  }

  const distractors = picked.map(
    (offset) => addMinutesToClock(startH, startM, offset).label
  );

  return makeQuestion(
    "rendez-vous-rattrapage",
    `Durant un exercice tactique, un ${slowCraft} quitte la base de ${base} à ${formatClock(startH, startM)} en maintenant une vitesse de ${formatNumber(vSlow)} km/h. Un ${fastCraft} décolle ${delayMin} minutes plus tard de la même base pour rejoindre la zone au même moment, volant à ${formatNumber(vFast)} km/h. À quelle heure les deux appareils se retrouveront-ils au point de rendez-vous ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Décalage temporel",
        detail: `Décalage = ${delayMin} min = ${formatNumber(delayH, 2)} h`,
      },
      {
        title: "Distance d'avance",
        detail: `Distance d'avance = ${formatNumber(vSlow)} × ${formatNumber(delayH, 2)} = ${formatNumber(lead, 1)} km`,
      },
      {
        title: "Vitesse relative de rattrapage",
        detail: `Vitesse relative = ${formatNumber(vFast)} − ${formatNumber(vSlow)} = ${formatNumber(relative)} km/h`,
      },
      {
        title: "Temps de rattrapage",
        detail: `Temps = ${formatNumber(lead, 1)} ÷ ${formatNumber(relative)} = ${formatNumber(catchH, 2)} h\n${formatNumber(catchH, 2)} × 60 = ${formatNumber(catchMin, 1)} min, soit ${formatNumber(catchMinRounded)} min`,
      },
      {
        title: "Heure de rendez-vous",
        detail: `Décollage du ${fastCraft} : ${formatClock(startH, startM)} + ${delayMin} min = ${takeoff.label}\nRendez-vous = ${takeoff.label} + ${formatNumber(catchMinRounded)} min = ${correctLabel}`,
      },
    ]
  );
};
