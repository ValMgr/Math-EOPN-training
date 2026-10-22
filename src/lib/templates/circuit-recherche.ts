import { AIRCRAFT, BASES } from "../constants";
import {
  formatDurationHM,
  formatNumber,
  roundHours,
  roundTo,
} from "../format";
import {
  de,
  makeQuestion,
  randChoice,
  type TemplateGenerator,
} from "../helpers";

type SearchPattern = {
  speed: number;
  timeH: number;
  legs: number;
  spacing: number;
  leg: number;
  total: number;
};

function pickPattern(): SearchPattern {
  const speeds = [120, 150, 160, 180, 200, 240];
  const times = [1, 1.25, 1.5, 2, 2.5, 3];
  const legCounts = [4, 5, 6, 8, 10, 12];
  const spacings = [2, 4, 5, 8, 10];
  for (let attempt = 0; attempt < 200; attempt++) {
    const speed = randChoice(speeds);
    const timeH = randChoice(times);
    const legs = randChoice(legCounts);
    const spacing = randChoice(spacings);
    const total = speed * timeH;
    const cross = (legs - 1) * spacing;
    const along = total - cross;
    if (along <= 0 || along % legs !== 0) continue;
    const leg = along / legs;
    if (leg < 12 || leg > 90) continue;
    if (cross >= along / 2) continue;
    return { speed, timeH, legs, spacing, leg, total };
  }
  return {
    speed: 200,
    timeH: 1.5,
    legs: 5,
    spacing: 10,
    leg: 52,
    total: 300,
  };
}

/** Créneaux parallèles → durée du circuit */
export const circuitRecherche: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.helico]);
  const base = randChoice([...BASES]);
  const pattern = pickPattern();
  const turns = pattern.legs - 1;
  const along = pattern.legs * pattern.leg;
  const cross = turns * pattern.spacing;
  const total = along + cross;
  const timeH = roundHours(total / pattern.speed);
  const correctLabel = formatDurationHM(timeH);

  const legsOnly = roundHours(along / pattern.speed);
  const oneLegShort = roundHours(
    ((pattern.legs - 1) * pattern.leg + Math.max(turns - 1, 0) * pattern.spacing) /
      pattern.speed
  );

  const seen = new Set<string>([correctLabel]);
  const distractors: string[] = [];
  const push = (hours: number) => {
    if (!Number.isFinite(hours) || hours <= 0) return;
    const label = formatDurationHM(roundTo(hours, 2));
    if (seen.has(label)) return;
    seen.add(label);
    distractors.push(label);
  };
  push(legsOnly);
  push(oneLegShort);
  for (const delta of [-30, -20, -15, 15, 20, 30, 45, -45]) {
    push((Math.round(timeH * 60) + delta) / 60);
    if (distractors.length >= 4) break;
  }

  return makeQuestion(
    "circuit-recherche",
    `Un ${craft} décolle ${de(base)} pour un circuit de recherche en créneaux parallèles : ${formatNumber(pattern.legs)} branches de ${formatNumber(pattern.leg)} km, reliées par ${formatNumber(turns)} segments de ${formatNumber(pattern.spacing)} km. La vitesse de recherche est de ${formatNumber(pattern.speed)} km/h. Quelle est la durée du circuit ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Distance des branches",
        detail: `${formatNumber(pattern.legs)} × ${formatNumber(pattern.leg)} = ${formatNumber(along)} km`,
      },
      {
        title: "Distance des raccordements",
        detail: `${formatNumber(turns)} × ${formatNumber(pattern.spacing)} = ${formatNumber(cross)} km`,
      },
      {
        title: "Distance totale",
        detail: `${formatNumber(along)} + ${formatNumber(cross)} = ${formatNumber(total)} km`,
      },
      {
        title: "Durée",
        detail: `${formatNumber(total)} ÷ ${formatNumber(pattern.speed)} = ${formatNumber(timeH, 2)} h = ${correctLabel}`,
      },
    ]
  );
};
