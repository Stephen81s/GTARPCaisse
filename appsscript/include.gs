/**
 * ============================================================
 *  FICHIER : include.gs
 *  MODULE  : RP BUSINESS SYSTEM — HTML INCLUDES
 *  VERSION : PRO 2026
 *  AUTEUR  : Stephen + Copilot PRO
 * ------------------------------------------------------------
 *  DESCRIPTION :
 *    Fournit une fonction utilitaire permettant d'inclure des
 *    fragments HTML dans les pages (partials, styles, scripts).
 *
 *    Utilisation dans un fichier HTML :
 *      <?!= include('header'); ?>
 *      <?!= include('style_admin'); ?>
 *
 *    Le fichier doit exister dans /pages ou /styles ou /scripts
 * ------------------------------------------------------------
 *  LOGS :
 *  🟦 [include.gs] Module INCLUDE chargé.
 * ============================================================
 */

console.log("🟦 [include.gs] Chargement du module INCLUDE...");

/**
 * Inclut un fichier HTML dans un template Apps Script.
 *
 * @param {string} filename - Nom du fichier sans extension.
 * @returns {string} - Contenu HTML du fichier.
 */
function include(filename) {
  try {
    const output = HtmlService.createHtmlOutputFromFile(filename).getContent();
    return output;
  } catch (err) {
    console.error("❌ [include] Fichier introuvable :", filename, err);
    throw new Error("Include impossible : fichier introuvable → " + filename);
  }
}

console.log("🟩 [include.gs] Module INCLUDE chargé avec succès.");