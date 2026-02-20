/***************************************************************
 * FICHIER : fauxpapiers.gs
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Gestion complète des faux papiers RP
 *   - CRUD : Create, Read, Update, Delete
 *   - Gestion des types via FAUXPAPIERS_OPTIONS
 *   - Utilise la BDD Google Sheets (feuille FAUXPAPIERS)
 *
 * NOTES :
 *   - Ce fichier est automatiquement poussé dans Apps Script via CLASP
 *   - Toute modification locale doit être suivie d’un "clasp push"
 *   - Les logs sont centralisés dans LOGS (Google Sheets)
 ***************************************************************/


/***************************************************************
 * CONSTANTES LOCALES
 ***************************************************************/
const SHEET_FAUXPAPIERS = "FAUXPAPIERS";
const SHEET_FAUXPAPIERS_OPTIONS = "FAUXPAPIERS_OPTIONS";


/***************************************************************
 * LECTURE DES FAUX PAPIERS
 ***************************************************************/
function getFauxPapiers() {
  logSystem("Lecture des faux papiers");

  const data = readSheet(SHEET_FAUXPAPIERS);
  return data.filter(fp => fp.actif === "yes");
}


/***************************************************************
 * LECTURE DES TYPES DE FAUX PAPIERS
 ***************************************************************/
function getFauxPapiersTypes() {
  logSystem("Lecture des types de faux papiers");

  const data = readSheet(SHEET_FAUXPAPIERS_OPTIONS);

  return data
    .filter(opt => opt.option === "type")
    .map(opt => ({
      value: opt.valeur,
      description: opt.description,
      prix: opt.prix
    }));
}


/***************************************************************
 * CRÉATION D’UN FAUX PAPIER
 ***************************************************************/
function createFauxPapier(joueur_id, type, prix) {
  logSystem(`Création faux papier pour joueur ${joueur_id} : ${type}`);

  const id = generateFauxPapierId();
  const now = new Date().toISOString();

  const row = [
    id,             // id
    joueur_id,      // joueur_id
    type,           // type
    prix,           // prix
    now,            // created_at
    "system",       // created_by
    now,            // updated_at
    "system",       // updated_by
    "yes",          // actif
    "active"        // status
  ];

  writeRow(SHEET_FAUXPAPIERS, row);

  return id;
}


/***************************************************************
 * GÉNÉRATION D’ID FAUX PAPIER
 ***************************************************************/
function generateFauxPapierId() {
  const key = "NEXT_FAUXPAPIER_ID";
  let next = parseInt(getConst(key), 10);

  const id = "FP" + String(next).padStart(3, "0");

  setConst(key, next + 1);

  return id;
}


/***************************************************************
 * MISE À JOUR D’UN FAUX PAPIER
 ***************************************************************/
function updateFauxPapier(id, data) {
  logSystem(`Mise à jour faux papier : ${id}`);

  const sheet = getSheet(SHEET_FAUXPAPIERS);
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
 * SUPPRESSION LOGIQUE D’UN FAUX PAPIER
 ***************************************************************/
function deleteFauxPapier(id) {
  logSystem(`Suppression faux papier : ${id}`);

  return updateFauxPapier(id, {
    actif: "no",
    status: "inactive"
  });
}