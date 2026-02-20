/***************************************************************
 * FICHIER : systeme.gs
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Fonctions système
 *   - Accès BDD, logs, constantes, utilitaires
 *
 * NOTES :
 *   - Ce fichier est automatiquement poussé dans Apps Script via CLASP
 *   - Toute modification locale doit être suivie d’un "clasp push"
 *   - Les logs sont centralisés dans LOGS (Google Sheets)
 ***************************************************************/


/***************************************************************
 * ACCÈS À LA BDD
 ***************************************************************/
function getSheet(name) {
  const ss = SpreadsheetApp.getActive();
  return ss.getSheetByName(name);
}

function readSheet(name) {
  const sheet = getSheet(name);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  return values.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function writeRow(name, row) {
  const sheet = getSheet(name);
  if (!sheet) return;
  sheet.appendRow(row);
}


/***************************************************************
 * LOGS
 ***************************************************************/
function logSystem(message) {
  const sheet = getSheet("LOGS");
  if (!sheet) return;
  sheet.appendRow([new Date().toISOString(), "SYSTEME", message]);
}

function logApi(message) {
  const sheet = getSheet("LOGS");
  if (!sheet) return;
  sheet.appendRow([new Date().toISOString(), "API", message]);
}


/***************************************************************
 * CONSTANTES
 ***************************************************************/
function getConst(key) {
  const data = readSheet("CONSTANTES");
  const row = data.find(r => r.key === key);
  return row ? row.value : null;
}

function setConst(key, value) {
  const sheet = getSheet("CONSTANTES");
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      return;
    }
  }
  sheet.appendRow([key, value]);
}