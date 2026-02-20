/***************************************************************
 * FICHIER : amendes.gs
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Gestion complète des amendes RP
 *   - CRUD : Create, Read, Update, Delete
 *   - Gestion des motifs via AMENDES_OPTIONS
 *   - Utilise la BDD Google Sheets (feuille AMENDES)
 *
 * NOTES :
 *   - Ce fichier est automatiquement poussé dans Apps Script via CLASP
 *   - Toute modification locale doit être suivie d’un "clasp push"
 *   - Les logs sont centralisés dans LOGS (Google Sheets)
 ***************************************************************/


/***************************************************************
 * CONSTANTES LOCALES
 ***************************************************************/
const SHEET_AMENDES = "AMENDES";
const SHEET_AMENDES_OPTIONS = "AMENDES_OPTIONS";


/***************************************************************
 * LECTURE DES AMENDES
 ***************************************************************/
function getAmendes() {
  logSystem("Lecture des amendes");

  const data = readSheet(SHEET_AMENDES);
  return data.filter(a => a.actif === "yes");
}


/***************************************************************
 * LECTURE DES MOTIFS D’AMENDES
 ***************************************************************/
function getAmendeMotifs() {
  logSystem("Lecture des motifs d’amendes");

  const data = readSheet(SHEET_AMENDES_OPTIONS);

  return data
    .filter(opt => opt.option === "motif")
    .map(opt => ({
      value: opt.valeur,
      description: opt.description,
      montant: opt.montant
    }));
}


/***************************************************************
 * CRÉATION D’UNE AMENDE
 ***************************************************************/
function createAmende(joueur_id, motif, montant) {
  logSystem(`Création amende pour joueur ${joueur_id} : ${motif}`);

  const id = generateAmendeId();
  const now = new Date().toISOString();

  const row = [
    id,             // id
    joueur_id,      // joueur_id
    motif,          // motif
    montant,        // montant
    now,            // created_at
    "system",       // created_by
    now,            // updated_at
    "system",       // updated_by
    "yes",          // actif
    "active"        // status
  ];

  writeRow(SHEET_AMENDES, row);

  return id;
}


/***************************************************************
 * GÉNÉRATION D’ID AMENDE
 ***************************************************************/
function generateAmendeId() {
  const key = "NEXT_AMENDE_ID";
  let next = parseInt(getConst(key), 10);

  const id = "AMD" + String(next).padStart(3, "0");

  setConst(key, next + 1);

  return id;
}


/***************************************************************
 * MISE À JOUR D’UNE AMENDE
 ***************************************************************/
function updateAmende(id, data) {
  logSystem(`Mise à jour amende : ${id}`);

  const sheet = getSheet(SHEET_AMENDES);
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
 * SUPPRESSION LOGIQUE D’UNE AMENDE
 ***************************************************************/
function deleteAmende(id) {
  logSystem(`Suppression amende : ${id}`);

  return updateAmende(id, {
    actif: "no",
    status: "inactive"
  });
}