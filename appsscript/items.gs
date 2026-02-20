/***************************************************************
 * FICHIER : items.gs
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Gestion complète des items RP
 *   - CRUD : Create, Read, Update, Delete
 *   - Gestion des types via ITEMS_OPTIONS
 *   - Utilise la BDD Google Sheets (feuille ITEMS)
 *
 * NOTES :
 *   - Ce fichier est automatiquement poussé dans Apps Script via CLASP
 *   - Toute modification locale doit être suivie d’un "clasp push"
 *   - Les logs sont centralisés dans LOGS (Google Sheets)
 ***************************************************************/


/***************************************************************
 * CONSTANTES LOCALES
 ***************************************************************/
const SHEET_ITEMS = "ITEMS";
const SHEET_ITEMS_OPTIONS = "ITEMS_OPTIONS";


/***************************************************************
 * LECTURE DES ITEMS
 ***************************************************************/
function getItems() {
  logSystem("Lecture des items");

  const data = readSheet(SHEET_ITEMS);
  return data.filter(i => i.actif === "yes");
}


/***************************************************************
 * LECTURE DES TYPES D’ITEMS
 ***************************************************************/
function getItemTypes() {
  logSystem("Lecture des types d’items");

  const data = readSheet(SHEET_ITEMS_OPTIONS);

  return data
    .filter(opt => opt.option === "type")
    .map(opt => ({
      value: opt.valeur,
      description: opt.description,
      rarete: opt.rarete
    }));
}


/***************************************************************
 * CRÉATION D’UN ITEM
 ***************************************************************/
function createItem(nom, type, rarete) {
  logSystem(`Création item : ${nom}`);

  const id = generateItemId();
  const now = new Date().toISOString();

  const row = [
    id,             // id
    nom,            // nom
    type,           // type
    rarete,         // rarete
    now,            // created_at
    "system",       // created_by
    now,            // updated_at
    "system",       // updated_by
    "yes",          // actif
    "active"        // status
  ];

  writeRow(SHEET_ITEMS, row);

  return id;
}


/***************************************************************
 * GÉNÉRATION D’ID ITEM
 ***************************************************************/
function generateItemId() {
  const key = "NEXT_ITEM_ID";
  let next = parseInt(getConst(key), 10);

  const id = "ITM" + String(next).padStart(3, "0");

  setConst(key, next + 1);

  return id;
}


/***************************************************************
 * MISE À JOUR D’UN ITEM
 ***************************************************************/
function updateItem(id, data) {
  logSystem(`Mise à jour item : ${id}`);

  const sheet = getSheet(SHEET_ITEMS);
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
 * SUPPRESSION LOGIQUE D’UN ITEM
 ***************************************************************/
function deleteItem(id) {
  logSystem(`Suppression item : ${id}`);

  return updateItem(id, {
    actif: "no",
    status: "inactive"
  });
}