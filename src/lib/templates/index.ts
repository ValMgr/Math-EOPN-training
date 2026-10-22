import type { TemplateGenerator } from "../helpers";
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
import { carburantReglementaire } from "./carburant-reglementaire";
import { tempsSurZone } from "./temps-sur-zone";
import { deroutementBingo } from "./deroutement-bingo";
import { ventDansLaxe } from "./vent-dans-laxe";
import { monteeCroisiereDescente } from "./montee-croisiere-descente";
import { regleUnPourSoixante } from "./regle-un-pour-soixante";
import { zoneCarteAire } from "./zone-carte-aire";
import { releveSurZone } from "./releve-sur-zone";
import { circuitRecherche } from "./circuit-recherche";

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
  carburantReglementaire,
  tempsSurZone,
  deroutementBingo,
  ventDansLaxe,
  monteeCroisiereDescente,
  regleUnPourSoixante,
  zoneCarteAire,
  releveSurZone,
  circuitRecherche,
];

export { type TemplateGenerator } from "../helpers";
