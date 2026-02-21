/**
 * ============================================================
 *  UTILS — Fonctions transversales (PRO 2026)
 *  Auteur : Stephen
 *  Description :
 *    - Logging centralisé (console + feuille LOGS)
 *    - Helpers transversaux utilisés par tous les modules
 * ============================================================
 */

/**
 * ------------------------------------------------------------
 *  LOGGING — Console uniquement
 * ------------------------------------------------------------
 */
function log(msg) {
  const time = new Date().toISOString();
  console.log(`[GTARPCaisse][${time}] ${msg}`);
}


/**
 * ------------------------------------------------------------
 *  LOGGING — Log système (console + feuille LOGS)
 * ------------------------------------------------------------
 */
function logSystem(message) {
  const time = new Date().toISOString();
  const entry = {
    timestamp: time,
    type: "SYSTEM",
    message: message
  };

  console.log(`🟦 [SYSTEM] ${message}`);
  appendLogRow(entry);
}


/**
 * ------------------------------------------------------------
 *  LOGGING — Log API (console + feuille LOGS)
 * ------------------------------------------------------------
 */
function logApi(action, payload) {
  const time = new Date().toISOString();
  const entry = {
    timestamp: time,
    type: "API",
    action: action,
    payload: JSON.stringify(payload || {})
  };

  console.log(`🟧 [API] ${action} → ${entry.payload}`);
  appendLogRow(entry);
}


/**
 * ------------------------------------------------------------
 *  LOGGING — Log erreur (console + feuille LOGS)
 * ------------------------------------------------------------
 */
function logError(error) {
  const time = new Date().toISOString();
  const entry = {
    timestamp: time,
    type: "ERROR",
    message: error.toString()
  };

  console.error(`❌ [ERROR] ${error}`);
  appendLogRow(entry);
}


/**
 * ------------------------------------------------------------
 *  LOGGING — Écriture dans la feuille LOGS
 * ------------------------------------------------------------
 */
function appendLogRow(entry) {
  try {
    const ss = SpreadsheetApp.getActive();
    const sheet = ss.getSheetByName("LOGS");

    if (!sheet) {
      console.error("❌ Feuille LOGS introuvable.");
      return;
    }

    sheet.appendRow([
      entry.timestamp,
      entry.type,
      entry.action || "",
      entry.message || "",
      entry.payload || ""
    ]);

  } catch (err) {
    console.error("❌ Impossible d'écrire dans LOGS :", err);
  }
}