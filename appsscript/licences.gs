/***************************************************************
 * FICHIER : licences.gs
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Gestion complète des licences RP
 *   - CRUD : Create, Read, Update, Delete
 *   - Gestion des types via LICENCES_OPTIONS
 *   - Utilise la BDD Google Sheets (feuille LICENCES)
 *
 * NOTES :
 *   - Ce fichier est automatiquement poussé dans Apps Script via CLASP
 *   - Toute modification locale doit être suivie d’un "clasp push"
 *   - Les logs sont centralisés dans LOGS (Google Sheets)
 ***************************************************************/


/***************************************************************
 * CONSTANTES LOCALES
 ***************************************************************/
const SHEET_LICENCES = "LICENCES";
const SHEET_LICENCES_OPTIONS = "LICENCES_OPTIONS";


/***************************************************************
 * LECTURE DES LICENCES
 ***************************************************************/
function getLicences() {
  logSystem("Lecture des licences");

  const data = readSheet(SHEET_LICENCES);
  return data.filter(l => l.actif === "yes");
}


/***************************************************************
 * LECTURE DES TYPES DE LICENCES
 ***************************************************************/
function getLicenceTypes() {
  logSystem("Lecture des types de licences");

  const data = readSheet(SHEET_LICENCES_OPTIONS);

  return data
    .filter(opt => opt.option === "type")
    .map(opt => ({
      value: opt.valeur,
      description: opt.description,
      prix: opt.prix,
      duree: opt.duree
    }));
}


/***************************************************************
 * CRÉATION D’UNE LICENCE
 ***************************************************************/
function createLicence(joueur_id, type, prix, duree) {
  logSystem(`Création licence pour joueur ${joueur_id} : ${type}`);

  const id = generateLicenceId();
  const now = new Date().toISOString();

  const row = [
    id,             // id
    joueur_id,      // joueur_id
    type,           // type
    prix,           // prix
    duree,          // duree
    now,            // created_at
    "system",       // created_by
    now,            // updated_at
    "system",       // updated_by
    "yes",          // actif
    "active"        // status
  ];

  writeRow(SHEET_LICENCES, row);

  return id;
}


/***************************************************************
 * GÉNÉRATION D’ID LICENCE
 ***************************************************************/
function generateLicenceId() {
  const key = "NEXT_LICENCE_ID";
  let next = parseInt(getConst(key), 10);

  const id = "LIC" + String(next).padStart(3, "0");

  setConst(key, next + 1);

  return id;
}


/***************************************************************
 * MISE À JOUR D’UNE LICENCE
 ***************************************************************/
function updateLicence(id, data) {
  logSystem(`Mise à jour licence : ${id}`);

  const sheet = getSheet(SHEET_LICENCES);
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
 * SUPPRESSION LOGIQUE D’UNE LICENCE
 ***************************************************************/
function deleteLicence(id) {
  logSystem(`Suppression licence : ${id}`);

  return updateLicence(id, {
    actif: "no",
    status: "inactive"
  });
}