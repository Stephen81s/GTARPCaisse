/**
 * ============================================================
 *  FICHIER : include.gs
 *  MODULE  : RP BUSINESS SYSTEM — LOADER HTML + INCLUDE
 *  VERSION : PRO 2026
 *  AUTEUR  : Stephen + Copilot PRO
 * ------------------------------------------------------------
 *  DESCRIPTION :
 *  Fournit deux fonctions essentielles :
 *
 *   1) include(filename)
 *      → Charge un fragment HTML (partial)
 *      → Utilisé dans les fichiers HTML via :
 *         <?!= include('style_admin'); ?>
 *
 *   2) loadPage(name)
 *      → Charge une page HTML complète via templating
 *      → Permet d'injecter des variables côté backend
 *
 * ------------------------------------------------------------
 *  LOGS :
 *  🟦 [include.gs] Module INCLUDE chargé.
 * ============================================================
 */

console.log("🟦 [include.gs] Initialisation du module d'inclusion HTML…");

/* ============================================================
   include(filename)
   ------------------------------------------------------------
   Charge un fragment HTML (partial) et renvoie son contenu.
   Utilisé dans les fichiers HTML via :
      <?!= include('style_admin'); ?>
   ============================================================ */
function include(filename) {
  console.log("📥 [include] include() →", filename);

  try {
    const content = HtmlService
      .createHtmlOutputFromFile(filename)
      .getContent();

    console.log("🟩 [include] Chargé :", filename);
    return content;

  } catch (err) {
    console.error("❌ [include] Erreur lors du chargement :", filename, err);
    return "<!-- include error : " + filename + " -->";
  }
}

/* ============================================================
   loadPage(name)
   ------------------------------------------------------------
   Charge une page HTML complète via templating.
   Utilisé côté backend si besoin d'injecter des variables.
   ============================================================ */
function loadPage(name) {
  console.log("📄 [backend] loadPage() →", name);

  try {
    return HtmlService
      .createTemplateFromFile(name)
      .evaluate()
      .getContent();

  } catch (err) {
    console.error("❌ [backend] loadPage ERROR :", name, err);
    throw err;
  }
}

console.log("🟩 [include.gs] Module INCLUDE chargé avec succès.");