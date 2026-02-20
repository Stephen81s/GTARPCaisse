/***************************************************************
 * FICHIER : joueurs.gs
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Gestion complète des joueurs RP
 *   - CRUD : Create, Read, Update, Delete
 *   - Utilise la BDD Google Sheets (feuille JOUEURS)
 *
 * NOTES :
 *   - Ce fichier est automatiquement poussé dans Apps Script via CLASP
 *   - Toute modification locale doit être suivie d’un "clasp push"
 *   - Les logs sont centralisés dans LOGS (Google Sheets)
 ***************************************************************/


/***************************************************************
 * CONSTANTES LOCALES
 ***************************************************************/
const SHEET_JOUEURS = "JOUEURS";


/***************************************************************
 * LECTURE DES JOUEURS
 ***************************************************************/
function getJoueurs() {
  logSystem("Lecture des joueurs");

  const data = readSheet(SHEET_JOUEURS);
  return data.filter(j => j.actif === "yes");
}


/***************************************************************
 * CRÉATION D’UN JOUEUR
 ***************************************************************/
function createJoueur(nom, prenom, dateNaissance) {
  logSystem(`Création joueur : ${nom} ${prenom}`);

  const id = generateJoueurId();
  const now = new Date().toISOString();

  const row = [
    id,             // id
    nom,            // nom
    prenom,         // prenom
    dateNaissance,  // date_naissance
    now,            // created_at
    "system",       // created_by
    now,            // updated_at
    "system",       // updated_by
    "yes",          // actif
    "active"        // status
  ];

  writeRow(SHEET_JOUEURS, row);

  return id;
}


/***************************************************************
 * GÉNÉRATION D’ID JOUEUR
 ***************************************************************/
function generateJoueurId() {
  const key = "NEXT_JOUEUR_ID";
  let next = parseInt(getConst(key), 10);

  const id = "JOU" + String(next).padStart(3, "0");

  setConst(key, next + 1);

  return id;
}


/***************************************************************
 * MISE À JOUR D’UN JOUEUR
 ***************************************************************/
function updateJoueur(id, data) {
  logSystem(`Mise à jour joueur : ${id}`);

  const sheet = getSheet(SHEET_JOUEURS);
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
 * SUPPRESSION LOGIQUE D’UN JOUEUR
 ***************************************************************/
function deleteJoueur(id) {
  logSystem(`Suppression joueur : ${id}`);

  return updateJoueur(id, {
    actif: "no",
    status: "inactive"
  });
}