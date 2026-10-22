import { AIRCRAFT, BASES } from "../constants";
import {
  addMinutesToClock,
  formatClock,
  formatNumber,
  roundHours,
} from "../format";
import {
  makeQuestion,
  randChoice,
  type TemplateGenerator,
} from "../helpers";

/** Transit du relèveur et recouvrement → heure limite de décollage */
export const releveSurZone: TemplateGenerator = () => {
  const fleet = [...AIRCRAFT.helico];
  const onStation = randChoice(fleet);
  const relief = randChoice(fleet.filter((craft) => craft !== onStation));
  const base = randChoice([...BASES]);
  const leaveH = randChoice([9, 10, 11, 14, 15, 16]);
  const leaveM = randChoice([0, 10, 15, 20, 30, 40, 45]);
  const transitHours = randChoice([0.5, 0.75, 1, 1.25]);
  const speed = randChoice([240, 280, 320, 360, 400]);
  const distance = speed * transitHours;
  const overlap = randChoice([5, 10]);

  const transitH = roundHours(distance / speed);
  const transitMin = Math.round(transitH * 60);
  const leaveLabel = formatClock(leaveH, leaveM);
  const arrival = addMinutesToClock(leaveH, leaveM, -overlap);
  const launch = addMinutesToClock(leaveH, leaveM, -(transitMin + overlap));
  const correctLabel = launch.label;

  const seen = new Set<string>([correctLabel]);
  const distractors: string[] = [];
  const pushMinutes = (deltaFromLeave: number) => {
    const label = addMinutesToClock(leaveH, leaveM, deltaFromLeave).label;
    if (seen.has(label)) return;
    seen.add(label);
    distractors.push(label);
  };
  pushMinutes(-transitMin);
  pushMinutes(overlap - transitMin);
  pushMinutes(-(transitMin + overlap * 2));
  for (const delta of [-15, 15, -30, 30, -20, 20]) {
    pushMinutes(-(transitMin + overlap) + delta);
    if (distractors.length >= 4) break;
  }

  return makeQuestion(
    "releve-sur-zone",
    `Un ${onStation} doit quitter la zone à ${leaveLabel} au plus tard. Un ${relief}, basé à ${base}, doit le relever avec ${formatNumber(overlap)} minutes de présence commune sur zone. La zone est à ${formatNumber(distance)} km et se rejoint à ${formatNumber(speed)} km/h. À quelle heure l'${relief} doit-il décoller au plus tard ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Temps de transit",
        detail: `${formatNumber(distance)} ÷ ${formatNumber(speed)} = ${formatNumber(transitH, 2)} h = ${formatNumber(transitMin)} min`,
      },
      {
        title: "Heure d'arrivée sur zone",
        detail: `Les ${formatNumber(overlap)} minutes de recouvrement imposent d'arriver avant le départ du premier.\nArrivée = ${leaveLabel} − ${formatNumber(overlap)} min = ${arrival.label}`,
      },
      {
        title: "Décollage limite",
        detail: `${arrival.label} − ${formatNumber(transitMin)} min = ${correctLabel}`,
      },
    ]
  );
};
