/**
 * ============================================================
 *  Entreprises — Accès aux données
 * ============================================================
 */

function entreprises_getAll() {
  const sheet = SpreadsheetApp.openById(CONSTANTES.SS_ID).getSheetByName("Entreprises");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();

  return data.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}