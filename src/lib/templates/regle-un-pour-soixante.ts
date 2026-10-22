import { AIRCRAFT } from "../constants";
import { formatNm, formatNumber } from "../format";
import {
  makeQuestion,
  nearbyDistractors,
  randChoice,
  spacedDeltas,
  type TemplateGenerator,
} from "../helpers";

const TRACK_ERRORS = [
  { angle: 2, dist: 90 },
  { angle: 2, dist: 150 },
  { angle: 3, dist: 80 },
  { angle: 3, dist: 120 },
  { angle: 3, dist: 200 },
  { angle: 4, dist: 90 },
  { angle: 4, dist: 150 },
  { angle: 5, dist: 72 },
  { angle: 5, dist: 120 },
  { angle: 5, dist: 180 },
  { angle: 6, dist: 80 },
  { angle: 6, dist: 150 },
  { angle: 8, dist: 90 },
  { angle: 10, dist: 120 },
];

const CORRECTIONS = [
  { offsetNm: 2, remaining: 60, deg: 2 },
  { offsetNm: 3, remaining: 90, deg: 2 },
  { offsetNm: 4, remaining: 80, deg: 3 },
  { offsetNm: 4, remaining: 120, deg: 2 },
  { offsetNm: 5, remaining: 75, deg: 4 },
  { offsetNm: 5, remaining: 100, deg: 3 },
  { offsetNm: 6, remaining: 90, deg: 4 },
  { offsetNm: 6, remaining: 120, deg: 3 },
  { offsetNm: 8, remaining: 96, deg: 5 },
  { offsetNm: 8, remaining: 120, deg: 4 },
  { offsetNm: 9, remaining: 108, deg: 5 },
  { offsetNm: 10, remaining: 120, deg: 5 },
  { offsetNm: 10, remaining: 150, deg: 4 },
  { offsetNm: 12, remaining: 144, deg: 5 },
];

function formatDeg(value: number): string {
  return `${formatNumber(value, 0)}°`;
}

function trackError(): ReturnType<TemplateGenerator> {
  const craft = randChoice([...AIRCRAFT.jet]);
  const { angle, dist } = randChoice(TRACK_ERRORS);
  const offset = (angle * dist) / 60;
  const byHundred = (angle * dist) / 100;
  const byThirty = (angle * dist) / 30;
  const candidates = [
    byThirty - offset,
    byHundred - offset,
    angle - offset,
    2,
    -2,
    4,
    -4,
    5,
  ].filter((delta) => offset + delta > 0);

  const { correctLabel, distractors } = nearbyDistractors(
    offset,
    spacedDeltas(candidates, 0.5),
    (n) => formatNm(n, 1),
    1
  );

  return makeQuestion(
    "regle-un-pour-soixante",
    `En navigation, la règle du 1/60 dit qu'un écart de cap de 1° crée un écart latéral de 1 NM tous les 60 NM. Un ${craft} a tenu un cap erroné de ${formatNumber(angle)}° pendant ${formatNumber(dist)} NM. De combien de NM s'est-il écarté de sa route ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Règle du 1/60",
        detail: `Écart latéral = erreur de cap × distance ÷ 60.`,
      },
      {
        title: "Application",
        detail: `${formatNumber(angle)} × ${formatNumber(dist)} ÷ 60 = ${formatNm(offset, 1)}`,
      },
    ]
  );
}

function headingCorrection(): ReturnType<TemplateGenerator> {
  const craft = randChoice([...AIRCRAFT.jet, ...AIRCRAFT.transport]);
  const fix = randChoice(CORRECTIONS);
  const doubled = fix.deg * 2;
  const byHundred = Math.round((fix.offsetNm * 100) / fix.remaining);
  const candidates = [doubled - fix.deg, byHundred - fix.deg, 1, -1, 2, -2, 3].filter(
    (delta) => fix.deg + delta >= 1
  );

  const { correctLabel, distractors } = nearbyDistractors(
    fix.deg,
    spacedDeltas(candidates, 1),
    (n) => formatDeg(n)
  );

  return makeQuestion(
    "regle-un-pour-soixante",
    `La règle du 1/60 donne la correction de cap : écart en NM × 60 ÷ distance restante. Un ${craft} est ${formatNumber(fix.offsetNm)} NM à côté de sa route, et il reste ${formatNumber(fix.remaining)} NM jusqu'au point à rejoindre. Quelle correction de cap, en degrés, doit-il prendre ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Produit écart × 60",
        detail: `${formatNumber(fix.offsetNm)} × 60 = ${formatNumber(fix.offsetNm * 60)}`,
      },
      {
        title: "Correction de cap",
        detail: `${formatNumber(fix.offsetNm * 60)} ÷ ${formatNumber(fix.remaining)} = ${formatDeg(fix.deg)}`,
      },
    ]
  );
}

/** Règle du 1/60 : écart latéral, ou correction pour rejoindre la route */
export const regleUnPourSoixante: TemplateGenerator = () =>
  randChoice([trackError, headingCorrection])();
