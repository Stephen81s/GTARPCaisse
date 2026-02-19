/**
 * ============================================================
 *  getNextID(prefix, sheetName, columnName)
 *  Auteur : Stephen
 *  Version : PRO 2026
 *  Description :
 *      Génère un ID auto-incrémenté basé sur :
 *        - un préfixe (ENT, J, E, G, T…)
 *        - une feuille
 *        - une colonne
 *      Exemple : ENT001, ENT002, ENT003...
 * ============================================================
 */
function getNextID(prefix, sheetName, columnName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error("Feuille introuvable : " + sheetName);
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const colIndex = headers.indexOf(columnName);

  if (colIndex === -1) {
    throw new Error("Colonne introuvable : " + columnName + " dans " + sheetName);
  }

  const data = sheet.getRange(2, colIndex + 1, sheet.getLastRow() - 1, 1).getValues();

  let max = 0;

  data.forEach(row => {
    const id = row[0];
    if (id && typeof id === "string" && id.startsWith(prefix)) {
      const num = parseInt(id.replace(prefix, ""), 10);
      if (!isNaN(num) && num > max) {
        max = num;
      }
    }
  });

  const next = Utilities.formatString("%03d", max + 1);
  const finalID = prefix + next;

  Logger.log("🔢 ID généré : " + finalID);
  return finalID;
}