import type { TemplateGenerator } from "./helpers";
import { carburantRotationUrgence } from "./carburant-rotation-urgence";
import { turbulencesMasse } from "./turbulences-masse";
import { rendezVousRattrapage } from "./rendez-vous-rattrapage";
import { masseCarburantReserveMeteo } from "./masse-carburant-reserve-meteo";
import { segmentsCartes } from "./segments-cartes";
import { allerRetourConso } from "./aller-retour-conso";
import { cartePhasesProcedures } from "./carte-phases-procedures";
import { autonomieReserveSecurite } from "./autonomie-reserve-securite";
import { vitesseMoyenneMissions } from "./vitesse-moyenne-missions";
import { rencontreFrontale } from "./rencontre-frontale";

export const TEMPLATES: TemplateGenerator[] = [
  carburantRotationUrgence,
  turbulencesMasse,
  rendezVousRattrapage,
  masseCarburantReserveMeteo,
  segmentsCartes,
  allerRetourConso,
  cartePhasesProcedures,
  autonomieReserveSecurite,
  vitesseMoyenneMissions,
  rencontreFrontale,
];

export { type TemplateGenerator } from "./helpers";
