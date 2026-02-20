/***************************************************************
 * SETUP PRO 2026 — Piloté par SCHEMA_FEUILLES
 * Gère 3 types :
 *   - sheet     → crée une feuille + colonnes
 *   - constante → remplit CONSTANTES
 *   - fonction  → remplit FONCTIONS
 *
 * Gère 3 modes :
 *   - reset  → efface + recrée les colonnes
 *   - keep   → ne pas effacer, ajouter colonnes manquantes
 *   - append → ne jamais toucher aux colonnes
 ***************************************************************/
function setup_sheets() {
  const ss = SpreadsheetApp.getActive();
  const schema = ss.getSheetByName("SCHEMA_FEUILLES");

  if (!schema) return logSetup("ERREUR : SCHEMA_FEUILLES introuvable.");

  const data = schema.getRange(2, 1, schema.getLastRow() - 1, 4).getValues();

  const constantes = [];
  const fonctions = [];

  data.forEach(row => {
    const type = row[0];
    const name = row[1];
    const raw = row[2];
    const mode = row[3] || "reset";

    if (!type || !name || !raw) return;

    switch (type) {

      /***********************
       * TYPE : sheet
       ***********************/
      case "sheet":
        let sheet = ss.getSheetByName(name);

        if (!sheet) {
          sheet = ss.insertSheet(name);
          logSetup(`Feuille créée : ${name}`);
        }

        const columns = raw.split(",").map(c => c.trim());

        if (mode === "reset") {
          sheet.clear();
          sheet.appendRow(columns);
          logSetup(`RESET : Colonnes installées pour ${name}`);
        }

        if (mode === "keep") {
          const existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
          const missing = columns.filter(c => !existing.includes(c));
          if (missing.length > 0) {
            sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
            logSetup(`KEEP : Colonnes ajoutées pour ${name} : ${missing.join(", ")}`);
          }
        }

        if (mode === "append") {
          logSetup(`APPEND : Colonnes non modifiées pour ${name}`);
        }

        break;

      /***********************
       * TYPE : constante
       ***********************/
      case "constante":
        constantes.push([name, raw]);
        break;

      /***********************
       * TYPE : fonction
       ***********************/
      case "fonction":
        const parts = raw.split(",");
        fonctions.push([name, parts[0], parts[1], parts[2], parts[3]]);
        break;
    }
  });

  /***************************************************************
   * Injection des constantes
   ***************************************************************/
  const sheetConst = ss.getSheetByName("CONSTANTES");
  if (sheetConst && constantes.length > 0) {
    sheetConst.getRange(sheetConst.getLastRow() + 1, 1, constantes.length, 2).setValues(constantes);
    logSetup("Constantes injectées.");
  }

  /***************************************************************
   * Injection des fonctions
   ***************************************************************/
  const sheetFunc = ss.getSheetByName("FONCTIONS");
  if (sheetFunc && fonctions.length > 0) {
    sheetFunc.getRange(sheetFunc.getLastRow() + 1, 1, fonctions.length, 5).setValues(fonctions);
    logSetup("Fonctions injectées.");
  }

  logSetup("=== Setup complet via SCHEMA_FEUILLES ===");
}


/***************************************************************
 * LOGGER PRO 2026
 ***************************************************************/
function logSetup(message) {
  const timestamp = new Date().toISOString();
  console.log(`[SETUP] ${timestamp} — ${message}`);

  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName("LOGS");
    if (sheet) sheet.appendRow([timestamp, "SETUP", message]);
  } catch (e) {}
}