/***************************************************************
 * FICHIER : services.gs
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Gestion complète des services RP
 *   - CRUD : Create, Read, Update, Delete
 *   - Gestion des actions via SERVICES_ACTIONS
 *   - Utilise la BDD Google Sheets (feuille SERVICES)
 *
 * NOTES :
 *   - Ce fichier est automatiquement poussé dans Apps Script via CLASP
 *   - Toute modification locale doit être suivie d’un "clasp push"
 *   - Les logs sont centralisés dans LOGS (Google Sheets)
 ***************************************************************/


/***************************************************************
 * CONSTANTES LOCALES
 ***************************************************************/
const SHEET_SERVICES = "SERVICES";
const SHEET_SERVICES_ACTIONS = "SERVICES_ACTIONS";


/***************************************************************
 * LECTURE DES SERVICES
 ***************************************************************/
function getServices() {
  logSystem("Lecture des services");

  const data = readSheet(SHEET_SERVICES);
  return data.filter(s => s.actif === "yes");
}


/***************************************************************
 * LECTURE DES ACTIONS DE SERVICE
 ***************************************************************/
function getServiceActions() {
  logSystem("Lecture des actions de services");

  const data = readSheet(SHEET_SERVICES_ACTIONS);

  return data.map(a => ({
    action: a.action,
    cout: a.cout,
    duree: a.duree,
    description: a.description
  }));
}


/***************************************************************
 * CRÉATION D’UN SERVICE
 ***************************************************************/
function createService(entreprise_id, nom, prix) {
  logSystem(`Création service : ${nom} (Entreprise ${entreprise_id})`);

  const id = generateServiceId();
  const now = new Date().toISOString();

  const row = [
    id,             // id
    entreprise_id,  // entreprise_id
    nom,            // nom
    prix,           // prix
    now,            // created_at
    "system",       // created_by
    now,            // updated_at
    "system",       // updated_by
    "yes",          // actif
    "active"        // status
  ];

  writeRow(SHEET_SERVICES, row);

  return id;
}


/***************************************************************
 * GÉNÉRATION D’ID SERVICE
 ***************************************************************/
function generateServiceId() {
  const key = "NEXT_SERVICE_ID";
  let next = parseInt(getConst(key), 10);

  const id = "SER" + String(next).padStart(3, "0");

  setConst(key, next + 1);

  return id;
}


/***************************************************************
 * MISE À JOUR D’UN SERVICE
 ***************************************************************/
function updateService(id, data) {
  logSystem(`Mise à jour service : ${id}`);

  const sheet = getSheet(SHEET_SERVICES);
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
 * SUPPRESSION LOGIQUE D’UN SERVICE
 ***************************************************************/
function deleteService(id) {
  logSystem(`Suppression service : ${id}`);

  return updateService(id, {
    actif: "no",
    status: "inactive"
  });
}