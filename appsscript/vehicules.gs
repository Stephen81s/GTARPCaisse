/***************************************************************
 * FICHIER : vehicules.gs
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Gestion complète des véhicules RP
 *   - CRUD : Create, Read, Update, Delete
 *   - Gestion des types via VEHICULES_OPTIONS
 *   - Utilise la BDD Google Sheets (feuille VEHICULES)
 *
 * NOTES :
 *   - Ce fichier est automatiquement poussé dans Apps Script via CLASP
 *   - Toute modification locale doit être suivie d’un "clasp push"
 *   - Les logs sont centralisés dans LOGS (Google Sheets)
 ***************************************************************/


/***************************************************************
 * CONSTANTES LOCALES
 ***************************************************************/
const SHEET_VEHICULES = "VEHICULES";
const SHEET_VEHICULES_OPTIONS = "VEHICULES_OPTIONS";


/***************************************************************
 * LECTURE DES VÉHICULES
 ***************************************************************/
function getVehicules() {
  logSystem("Lecture des véhicules");

  const data = readSheet(SHEET_VEHICULES);
  return data.filter(v => v.actif === "yes");
}


/***************************************************************
 * LECTURE DES TYPES DE VÉHICULES
 ***************************************************************/
function getVehiculeTypes() {
  logSystem("Lecture des types de véhicules");

  const data = readSheet(SHEET_VEHICULES_OPTIONS);

  return data
    .filter(opt => opt.option === "type")
    .map(opt => ({
      value: opt.valeur,
      description: opt.description,
      categorie: opt.categorie
    }));
}


/***************************************************************
 * CRÉATION D’UN VÉHICULE
 ***************************************************************/
function createVehicule(joueur_id, modele, type, plaque) {
  logSystem(`Création véhicule : ${modele} (${plaque})`);

  const id = generateVehiculeId();
  const now = new Date().toISOString();

  const row = [
    id,             // id
    joueur_id,      // joueur_id
    modele,         // modele
    type,           // type
    plaque,         // plaque
    now,            // created_at
    "system",       // created_by
    now,            // updated_at
    "system",       // updated_by
    "yes",          // actif
    "active"        // status
  ];

  writeRow(SHEET_VEHICULES, row);

  return id;
}


/***************************************************************
 * GÉNÉRATION D’ID VÉHICULE
 ***************************************************************/
function generateVehiculeId() {
  const key = "NEXT_VEHICULE_ID";
  let next = parseInt(getConst(key), 10);

  const id = "VEH" + String(next).padStart(3, "0");

  setConst(key, next + 1);

  return id;
}


/***************************************************************
 * MISE À JOUR D’UN VÉHICULE
 ***************************************************************/
function updateVehicule(id, data) {
  logSystem(`Mise à jour véhicule : ${id}`);

  const sheet = getSheet(SHEET_VEHICULES);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];

  const idIndex = headers.indexOf("id");

  for (let i = 1; i < values.length; i++) {
    if (values[i][idIndex] === id) {

      // Mise à jour des colonnes
      Object.keys(data).forEach(key => {
        const colIndex = headers.indexOf(key);
        if (colIndex !== -1) {
          values[i][colIndex] = data[key];
        }
      });

      // updated_at / updated_by
      values[i][headers.indexOf("updated_at")] = new Date().toISOString();
      values[i][headers.indexOf("updated_by")] = "system";

      // Écriture
      sheet.getRange(1, 1, values.length, headers.length).setValues(values);
      return true;
    }
  }

  return false;
}


/***************************************************************
 * SUPPRESSION LOGIQUE D’UN VÉHICULE
 ***************************************************************/
function deleteVehicule(id) {
  logSystem(`Suppression véhicule : ${id}`);

  return updateVehicule(id, {
    actif: "no",
    status: "inactive"
  });
}