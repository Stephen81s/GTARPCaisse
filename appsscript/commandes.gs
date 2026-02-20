/***************************************************************
 * FICHIER : commandes.gs
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Gestion complète des commandes RP
 *   - CRUD : Create, Read, Update, Delete
 *   - Gestion des statuts via COMMANDES_OPTIONS
 *   - Utilise la BDD Google Sheets (feuille COMMANDES)
 *
 * NOTES :
 *   - Ce fichier est automatiquement poussé dans Apps Script via CLASP
 *   - Toute modification locale doit être suivie d’un "clasp push"
 *   - Les logs sont centralisés dans LOGS (Google Sheets)
 ***************************************************************/


/***************************************************************
 * CONSTANTES LOCALES
 ***************************************************************/
const SHEET_COMMANDES = "COMMANDES";
const SHEET_COMMANDES_OPTIONS = "COMMANDES_OPTIONS";


/***************************************************************
 * LECTURE DES COMMANDES
 ***************************************************************/
function getCommandes() {
  logSystem("Lecture des commandes");

  const data = readSheet(SHEET_COMMANDES);
  return data.filter(c => c.actif === "yes");
}


/***************************************************************
 * LECTURE DES STATUTS DE COMMANDES
 ***************************************************************/
function getCommandeStatuts() {
  logSystem("Lecture des statuts de commandes");

  const data = readSheet(SHEET_COMMANDES_OPTIONS);

  return data
    .filter(opt => opt.option === "statut")
    .map(opt => ({
      value: opt.valeur,
      description: opt.description
    }));
}


/***************************************************************
 * CRÉATION D’UNE COMMANDE
 ***************************************************************/
function createCommande(joueur_id, entreprise_id, montant, statut) {
  logSystem(`Création commande pour joueur ${joueur_id} → entreprise ${entreprise_id}`);

  const id = generateCommandeId();
  const now = new Date().toISOString();

  const row = [
    id,             // id
    joueur_id,      // joueur_id
    entreprise_id,  // entreprise_id
    montant,        // montant
    statut,         // statut
    now,            // created_at
    "system",       // created_by
    now,            // updated_at
    "system",       // updated_by
    "yes",          // actif
    "active"        // status
  ];

  writeRow(SHEET_COMMANDES, row);

  return id;
}


/***************************************************************
 * GÉNÉRATION D’ID COMMANDE
 ***************************************************************/
function generateCommandeId() {
  const key = "NEXT_COMMANDE_ID";
  let next = parseInt(getConst(key), 10);

  const id = "CMD" + String(next).padStart(3, "0");

  setConst(key, next + 1);

  return id;
}


/***************************************************************
 * MISE À JOUR D’UNE COMMANDE
 ***************************************************************/
function updateCommande(id, data) {
  logSystem(`Mise à jour commande : ${id}`);

  const sheet = getSheet(SHEET_COMMANDES);
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
 * SUPPRESSION LOGIQUE D’UNE COMMANDE
 ***************************************************************/
function deleteCommande(id) {
  logSystem(`Suppression commande : ${id}`);

  return updateCommande(id, {
    actif: "no",
    status: "inactive"
  });
}