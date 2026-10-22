import { AIRCRAFT, BASES } from "../constants";
import {
  formatDurationHM,
  formatKg,
  formatNumber,
  roundHours,
  roundTo,
} from "../format";
import {
  makeQuestion,
  randChoice,
  type TemplateGenerator,
} from "../helpers";

/** Aller + attente + retour → temps utilisable sur zone */
export const tempsSurZone: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.helico, ...AIRCRAFT.jet]);
  const base = randChoice([...BASES]);
  const legHours = randChoice([0.5, 0.75, 1, 1.25]);
  const speed = randChoice([240, 280, 320, 360, 400]);
  const distance = speed * legHours;
  const transitKg = randChoice([480, 520, 600, 640, 720, 800]);
  const loiterKg = randChoice([240, 280, 320, 360, 400]);
  const loiterHours = randChoice([0.5, 0.75, 1, 1.25, 1.5, 2]);
  const legTime = roundHours(distance / speed);
  const legFuel = roundTo(transitKg * legTime, 0);
  const loiterFuel = roundTo(loiterKg * loiterHours, 0);
  const fuel = legFuel * 2 + loiterFuel;

  const transitFuel = legFuel * 2;
  const remaining = fuel - transitFuel;
  const onStation = roundHours(remaining / loiterKg);
  const correctLabel = formatDurationHM(onStation);

  const forgotReturn = roundHours((fuel - legFuel) / loiterKg);
  const loiterAtCruise = roundHours(remaining / transitKg);
  const labels = new Set<string>([correctLabel]);
  const distractors: string[] = [];
  const push = (hours: number) => {
    if (!Number.isFinite(hours) || hours <= 0) return;
    const label = formatDurationHM(hours);
    if (labels.has(label)) return;
    labels.add(label);
    distractors.push(label);
  };
  push(forgotReturn);
  push(loiterAtCruise);
  for (const delta of [-45, -30, -20, -15, 15, 20, 30, 45, 60]) {
    push((Math.round(onStation * 60) + delta) / 60);
    if (distractors.length >= 4) break;
  }

  return makeQuestion(
    "temps-sur-zone",
    `Un ${craft} quitte ${base} avec ${formatNumber(fuel)} kg de carburant utilisable. La zone d'attente est à ${formatNumber(distance)} km. L'aller et le retour se font à ${formatNumber(speed)} km/h et ${formatNumber(transitKg)} kg/h. Sur zone, la consommation tombe à ${formatNumber(loiterKg)} kg/h. En gardant de quoi rentrer dans les mêmes conditions, combien de temps peut-il rester sur zone ?`,
    correctLabel,
    distractors,
    [
      {
        title: "Carburant d'un transit",
        detail: `Temps de trajet = ${formatNumber(distance)} ÷ ${formatNumber(speed)} = ${formatNumber(legTime, 2)} h\nAller = ${formatNumber(transitKg)} × ${formatNumber(legTime, 2)} = ${formatKg(legFuel)}\nLe retour est identique.`,
      },
      {
        title: "Carburant réservé au retour",
        detail: `Aller + retour = ${formatNumber(legFuel)} × 2 = ${formatKg(transitFuel)}`,
      },
      {
        title: "Carburant disponible sur zone",
        detail: `${formatNumber(fuel)} − ${formatNumber(transitFuel)} = ${formatKg(remaining)}`,
      },
      {
        title: "Temps sur zone",
        detail: `${formatNumber(remaining)} ÷ ${formatNumber(loiterKg)} = ${formatNumber(onStation, 2)} h = ${correctLabel}`,
      },
    ]
  );
};
