import { formatKmH, formatNumber, roundHours, roundTo } from "../format";
import { AIRCRAFT } from "../constants";
import {
  makeQuestion,
  nearbyDistractors,
  randChoice,
  type TemplateGenerator,
} from "../helpers";

function toHours(h: number, m: number): number {
  return h + m / 60;
}

function formatHM(h: number, m: number): string {
  return `${h}h${String(m).padStart(2, "0")}m`;
}

/** 3 vols → vitesse moyenne */
export const vitesseMoyenneMissions: TemplateGenerator = () => {
  const craft = randChoice([...AIRCRAFT.helico, ...AIRCRAFT.jet]);
  const missions = [
    {
      label: "reconnaissance",
      v: randChoice([240, 250, 260, 280, 300]),
      h: randChoice([1, 1, 2]),
      m: randChoice([10, 15, 20, 25, 30]),
    },
    {
      label: "transport de troupes",
      v: randChoice([200, 210, 215, 220, 230]),
      h: randChoice([2, 3]),
      m: randChoice([0, 10, 15, 20, 30]),
    },
    {
      label: "évacuation sanitaire",
      v: randChoice([170, 180, 185, 190, 200]),
      h: randChoice([1, 2]),
      m: randChoice([10, 15, 20, 25, 30]),
    },
  ];

  const times = missions.map((m) => roundHours(toHours(m.h, m.m)));
  const distances = missions.map((m, i) => roundTo(m.v * times[i]!, 2));
  const totalDist = roundTo(
    distances.reduce((a, b) => a + b, 0),
    2
  );
  const totalTime = roundHours(times.reduce((a, b) => a + b, 0));
  const avg = roundTo(totalDist / totalTime, 1);

  const { correctLabel, distractors } = nearbyDistractors(
    avg,
    [10, -15, 20, -25, 30],
    (n) => formatKmH(n, 1),
    1
  );

  return makeQuestion(
    "vitesse-moyenne-missions",
    `Lors d'un exercice d'entraînement, un ${craft} effectue trois missions consécutives. Premier vol : ${missions[0]!.label} à ${formatNumber(missions[0]!.v)} km/h durant ${formatHM(missions[0]!.h, missions[0]!.m)}. Deuxième vol : ${missions[1]!.label} à ${formatNumber(missions[1]!.v)} km/h durant ${formatHM(missions[1]!.h, missions[1]!.m)}. Troisième vol : ${missions[2]!.label} à ${formatNumber(missions[2]!.v)} km/h durant ${formatHM(missions[2]!.h, missions[2]!.m)}. Calculez la vitesse moyenne de l'appareil sur l'ensemble des opérations.`,
    correctLabel,
    distractors,
    [
      {
        title: "Conversion des durées",
        detail: missions
          .map(
            (m, i) =>
              `${formatHM(m.h, m.m)} = ${formatNumber(times[i]!, 2)} h`
          )
          .join("\n"),
      },
      {
        title: "Distances parcourues",
        detail: missions
          .map(
            (m, i) =>
              `${m.label} : ${formatNumber(m.v)} × ${formatNumber(times[i]!, 2)} = ${formatNumber(distances[i]!, 2)} km`
          )
          .join("\n"),
      },
      {
        title: "Vitesse moyenne",
        detail: `Distance totale = ${formatNumber(totalDist, 2)} km\nTemps total = ${formatNumber(totalTime, 2)} h\nVitesse moyenne = ${formatNumber(totalDist, 2)} ÷ ${formatNumber(totalTime, 2)} = ${formatKmH(avg, 1)}`,
      },
    ]
  );
};
