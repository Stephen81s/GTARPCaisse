/***************************************************************
 * FICHIER : entreprises.gs
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Gestion complète des entreprises
 *   - CRUD : Create, Read, Update, Delete
 *   - Utilise la BDD Google Sheets (feuille ENTREPRISES)
 *
 * NOTES :
 *   - Ce fichier est automatiquement poussé dans Apps Script via CLASP
 *   - Toute modification locale doit être suivie d’un "clasp push"
 *   - Les logs sont centralisés dans LOGS (Google Sheets)
 ***************************************************************/


/***************************************************************
 * CONSTANTES LOCALES
 ***************************************************************/
const SHEET_ENTREPRISES = "ENTREPRISES";


/***************************************************************
 * LECTURE DES ENTREPRISES
 ***************************************************************/
function getEntreprises() {
  logSystem("Lecture des entreprises");

  const data = readSheet(SHEET_ENTREPRISES);
  return data.filter(e => e.actif === "yes");
}


/***************************************************************
 * CRÉATION D’UNE ENTREPRISE
 ***************************************************************/
function createEntreprise(nom, type) {
  logSystem(`Création entreprise : ${nom}`);

  const id = generateEntrepriseId();
  const now = new Date().toISOString();

  const row = [
    id,            // id
    nom,           // nom
    type,          // type
    0,             // solde
    now,           // created_at
    "system",      // created_by
    now,           // updated_at
    "system",      // updated_by
    "yes",         // actif
    "active"       // status
  ];

  writeRow(SHEET_ENTREPRISES, row);

  return id;
}


/***************************************************************
 * GÉNÉRATION D’ID ENTREPRISE
 ***************************************************************/
function generateEntrepriseId() {
  const key = "NEXT_ENTREPRISE_ID";
  let next = parseInt(getConst(key), 10);

  const id = "ENT" + String(next).padStart(3, "0");

  setConst(key, next + 1);

  return id;
}


/***************************************************************
 * MISE À JOUR D’UNE ENTREPRISE
 ***************************************************************/
function updateEntreprise(id, data) {
  logSystem(`Mise à jour entreprise : ${id}`);

  const sheet = getSheet(SHEET_ENTREPRISES);
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
 * SUPPRESSION LOGIQUE D’UNE ENTREPRISE
 ***************************************************************/
function deleteEntreprise(id) {
  logSystem(`Suppression entreprise : ${id}`);

  return updateEntreprise(id, {
    actif: "no",
    status: "inactive"
  });
}