/**
 * ============================================================
 *  FICHIER : FunctionsRegistry.gs
 *  AUTEUR  : Stephen
 *  VERSION : PRO 2026
 *  OBJET   :
 *      Registre central des fonctions officielles du système RP.
 *      Utilisé pour alimenter automatiquement l’onglet FUNCTIONS.
 *
 *      ➤ Tu ajoutes une nouvelle fonction .gs
 *      ➤ Tu ajoutes une ligne dans FUNCTION_REGISTRY
 *      ➤ Tu exécutes updateFunctions()
 *      ➤ L’onglet FUNCTIONS est mis à jour proprement
 * ============================================================
 */

/**
 * Registre officiel des fonctions.
 * FORMAT :
 *  [ Nom_fonction, Description, Paramètres, Retour, Notes ]
 */
const FUNCTION_REGISTRY = [
  ["setupRPSystem", "Crée toutes les feuilles + headers", "aucun", "void", "À exécuter une fois"],
  ["generateKey", "Génère une clé AAA-123-BBB", "aucun", "string", "Unique"],
  ["populateTypes", "Remplit l’onglet TYPES", "aucun", "void", ""],
  ["createFixedGrades", "Crée les grades fixes", "entrepriseID", "void", ""],
  ["createSchemaSheet", "Génère automatiquement l’onglet SCHEMA (dynamique PRO)", "aucun", "void", "Documentation technique auto-générée"],
  ["getNextID", "Génère un ID auto-incrémenté", "prefix, sheetName, columnName", "string", "ID PRO"],
  ["createEntreprise", "Crée une entreprise complète RP", "nom, typeID, description, logoURL, patronID", "void", "Auto-ID + Clé + Grades + Emploi"],
  ["setupRPSystem", "Crée toutes les feuilles + headers du système RP", "aucun", "void", "Initialisation complète du système"],
  ["generateKey", "Génère une clé AAA-123-BBB", "aucun", "string", "Clé unique pour entreprises"],
  ["createFunctionsSheet", "Crée ou réinitialise l’onglet FUNCTIONS", "aucun", "void", "Documentation interne"],
  ["createCoreSheet", "Crée ou réinitialise l’onglet CORE", "aucun", "void", "Structure centrale du système RP"],
  ["admin", "Module central d'administration RP", "actions variées", "object", "Point d’entrée unique du système"],


];

/**
 * ============================================================
 *  FONCTION : updateFunctions()
 *  OBJET    :
 *      Met à jour automatiquement l’onglet FUNCTIONS à partir
 *      de FUNCTION_REGISTRY.
 *
 *      ➤ Efface les anciennes lignes (sauf les headers)
 *      ➤ Réécrit toutes les fonctions officielles
 *      ➤ Log clair et explicite
 * ============================================================
 */
function updateFunctions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = "FUNCTIONS";
  const sheet = ss.getSheetByName(sheetName);

  Logger.log("===== UPDATE FUNCTIONS — LOGS =====");

  if (!sheet) {
    Logger.log("❌ Feuille FUNCTIONS introuvable");
    throw new Error("Feuille FUNCTIONS introuvable");
  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  Logger.log("📄 Feuille détectée : " + sheetName + " (lignes : " + lastRow + ", colonnes : " + lastCol + ")");

  // Efface tout sauf les headers
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 5).clearContent();
    Logger.log("🧹 Anciennes entrées effacées (lignes 2 à " + lastRow + ")");
  } else {
    Logger.log("ℹ️ Aucune ancienne entrée à effacer (seulement les headers présents)");
  }

  // Réécrit toutes les fonctions du registre
  if (FUNCTION_REGISTRY.length > 0) {
    sheet.getRange(2, 1, FUNCTION_REGISTRY.length, 5).setValues(FUNCTION_REGISTRY);
    Logger.log("✅ FUNCTIONS mis à jour avec " + FUNCTION_REGISTRY.length + " fonctions officielles");
  } else {
    Logger.log("⚠️ FUNCTION_REGISTRY est vide — aucune fonction écrite");
  }

  Logger.log("===== UPDATE FUNCTIONS — TERMINÉ =====");
}