import { addMinutesToClock, formatClock, formatNumber, roundTo } from "../format";
import {
  AIRCRAFT,
  makeQuestion,
  randChoice,
  type TemplateGenerator,
} from "./helpers";

/** Décollage décalé → heure de rendez-vous */
export const rendezVousRattrapage: TemplateGenerator = () => {
  const slowCraft = randChoice([...AIRCRAFT.helico]);
  const fastCraft = randChoice([...AIRCRAFT.jet]);
  const startH = randChoice([8, 9, 10, 11, 14, 15]);
  const startM = randChoice([0, 5, 10, 15, 20, 30, 45]);
  const delayMin = randChoice([20, 25, 30, 35, 40, 45]);
  const vSlow = randChoice([140, 150, 160, 170, 180]);
  const vFast = randChoice([320, 340, 360, 380, 400, 420]);

  const delayH = delayMin / 60;
  const lead = vSlow * delayH;
  const relative = vFast - vSlow;
  const catchH = lead / relative;
  const catchMin = catchH * 60;
  const meeting = addMinutesToClock(startH, startM, delayMin + catchMin);
  const correctLabel = meeting.label;

  const distractors = [
    addMinutesToClock(startH, startM, delayMin + catchMin - 4).label,
    addMinutesToClock(startH, startM, delayMin + catchMin + 2).label,
    addMinutesToClock(startH, startM, delayMin + catchMin + 4).label,
    addMinutesToClock(startH, startM, delayMin + catchMin - 2).label,
    addMinutesToClock(startH, startM, catchMin).label,
  ].filter((l) => l !== correctLabel);

  return makeQuestion(
    "rendez-vous-rattrapage",
    `Durant un exercice tactique, un ${slowCraft} quitte la base à ${formatClock(startH, startM)} en maintenant une vitesse de ${formatNumber(vSlow)} km/h. Un ${fastCraft} décolle ${delayMin} minutes plus tard du même aérodrome pour rejoindre la zone au même moment, volant à ${formatNumber(vFast)} km/h. À quelle heure les deux appareils se retrouveront-ils au point de rendez-vous ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Décalage temporel",
        detail: `Décalage = ${delayMin} min = ${formatNumber(roundTo(delayH, 3), 3)} h`,
      },
      {
        title: "Distance d'avance",
        detail: `Distance d'avance = ${formatNumber(vSlow)} × ${formatNumber(roundTo(delayH, 3), 3)} = ${formatNumber(roundTo(lead, 1), 1)} km`,
      },
      {
        title: "Vitesse relative de rattrapage",
        detail: `Vitesse relative = ${formatNumber(vFast)} − ${formatNumber(vSlow)} = ${formatNumber(relative)} km/h`,
      },
      {
        title: "Temps de rattrapage",
        detail: `Temps = ${formatNumber(roundTo(lead, 1), 1)} ÷ ${formatNumber(relative)} = ${formatNumber(roundTo(catchH, 3), 3)} h ≈ ${formatNumber(roundTo(catchMin, 0))} min`,
      },
      {
        title: "Heure de rendez-vous",
        detail: `Décollage du ${fastCraft} : ${formatClock(startH, startM)} + ${delayMin} min\nRendez-vous = ${correctLabel}`,
      },
    ]
  );
};
