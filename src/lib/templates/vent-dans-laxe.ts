import { AIRCRAFT, BASES } from "../constants";
import {
  addMinutesToClock,
  formatClock,
  formatDurationHM,
  formatNumber,
  roundHours,
} from "../format";
import {
  de,
  makeQuestion,
  randChoice,
  shuffle,
  type TemplateGenerator,
} from "../helpers";

type WindLeg = {
  gs: number;
  timeH: number;
  windMs: number;
  windKmh: number;
  head: boolean;
  tas: number;
  nm: number;
  distKm: number;
};

/** GS multiple de 37 km/h pour que la distance en NM tombe juste avec 1 NM = 1,85 km. */
function pickWindLeg(): WindLeg {
  const multiples = [8, 9, 10, 11, 12, 13, 14, 15];
  const times = [1, 1.5, 2, 2.5];
  const winds = [10, 15, 20, 25];
  for (let attempt = 0; attempt < 40; attempt++) {
    const multiple = randChoice(multiples);
    const timeH = randChoice(times);
    const windMs = randChoice(winds);
    const head = randChoice([true, false]);
    const gs = 37 * multiple;
    const windKmh = (windMs * 36) / 10;
    const tas = head ? gs + windKmh : gs - windKmh;
    if (tas < 340 || tas > 900) continue;
    const nm = 20 * multiple * timeH;
    const distKm = (nm * 185) / 100;
    return { gs, timeH, windMs, windKmh, head, tas, nm, distKm };
  }
  return {
    gs: 370,
    timeH: 2,
    windMs: 15,
    windKmh: 54,
    head: true,
    tas: 424,
    nm: 400,
    distKm: 740,
  };
}

function clockAfter(startH: number, startM: number, hours: number): string {
  return addMinutesToClock(startH, startM, Math.round(roundHours(hours) * 60))
    .label;
}

/** Vent dans l'axe, NM et m/s → heure d'arrivée */
export const ventDansLaxe: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.jet, ...AIRCRAFT.transport]);
  const [origin, destination] = shuffle([...BASES]);
  const startH = randChoice([7, 8, 9, 10, 13, 14]);
  const startM = randChoice([0, 10, 15, 20, 30, 40]);
  const leg = pickWindLeg();
  const windWord = leg.head ? "vent de face" : "vent arrière";

  const timeH = roundHours(leg.distKm / leg.gs);
  const correctLabel = clockAfter(startH, startM, timeH);
  const gsReverse = leg.head ? leg.tas + leg.windKmh : leg.tas - leg.windKmh;
  const gsAsMs = leg.head ? leg.tas - leg.windMs : leg.tas + leg.windMs;

  const seen = new Set<string>([correctLabel]);
  const distractors: string[] = [];
  const push = (hours: number) => {
    if (!Number.isFinite(hours) || hours <= 0) return;
    const label = clockAfter(startH, startM, hours);
    if (seen.has(label)) return;
    seen.add(label);
    distractors.push(label);
  };
  push(leg.distKm / leg.tas);
  push(leg.distKm / gsReverse);
  push(leg.nm / leg.gs);
  push(leg.distKm / gsAsMs);
  for (const delta of [-60, -30, 30, 60, 45, -45]) {
    push((Math.round(timeH * 60) + delta) / 60);
    if (distractors.length >= 4) break;
  }

  return makeQuestion(
    "vent-dans-laxe",
    `Un ${craft} décolle ${de(origin!)} à ${formatClock(startH, startM)} vers ${destination}, distant de ${formatNumber(leg.nm)} NM. Sa vitesse propre est de ${formatNumber(leg.tas)} km/h, avec un ${windWord} de ${formatNumber(leg.windMs)} m/s. On prendra 1 NM = 1,85 km. À quelle heure se pose-t-il ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Vent en km/h",
        detail: `${formatNumber(leg.windMs)} m/s × 3,6 = ${formatNumber(leg.windKmh)} km/h`,
      },
      {
        title: "Vitesse sol",
        detail: leg.head
          ? `${formatNumber(leg.tas)} − ${formatNumber(leg.windKmh)} = ${formatNumber(leg.gs)} km/h`
          : `${formatNumber(leg.tas)} + ${formatNumber(leg.windKmh)} = ${formatNumber(leg.gs)} km/h`,
      },
      {
        title: "Distance en kilomètres",
        detail: `${formatNumber(leg.nm)} × 1,85 = ${formatNumber(leg.distKm, 1, { trimZeros: true })} km`,
      },
      {
        title: "Heure d'arrivée",
        detail: `Temps = ${formatNumber(leg.distKm, 1, { trimZeros: true })} ÷ ${formatNumber(leg.gs)} = ${formatNumber(timeH, 2)} h = ${formatDurationHM(timeH)}\nArrivée = ${formatClock(startH, startM)} + ${formatDurationHM(timeH)} = ${correctLabel}`,
      },
    ]
  );
};
