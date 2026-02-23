/* ***************************************************************
 *  FICHIER : backend/core/main.gs
 *  MODULE  : Core / Entrée WebApp
 *  DESCRIPTION :
 *      - Point d'entrée principal du WebApp (doGet)
 *      - Injection des includes (head, header, footer, scripts)
 *      - Initialisation du SPA PRO 2026
 *      - Fonction include() pour charger les fichiers HTML
 *      - Compatible Clasp (fichiers aplatis)
 *
 *  ARCHITECTURE :
 *      /backend/core/main.gs
 *      /frontend/index.html
 *      /frontend/includes/head.html
 *      /frontend/includes/core/navigation/header.html
 *      /frontend/includes/footer.html
 *      /frontend/includes/scripts.html
 *
 *  NOTES :
 *      - Clasp aplatit tous les fichiers → Apps Script reçoit
 *        head.html, header.html, footer.html, scripts.html
 *      - Le SPA charge les pages via loadPage("nomFichier")
 * *************************************************************** */


/* ===============================================================
 *  doGet() — Point d'entrée WebApp
 * ---------------------------------------------------------------
 *  Rôle :
 *      - Servir index.html
 *      - Injecter les includes via <?!= include('xxx'); ?>
 *      - Autoriser l'affichage dans iframe (ALLOWALL)
 *      - Définir le titre de l'application
 * =============================================================== */
function doGet() {
  return HtmlService
    .createTemplateFromFile("index")   // index.html
    .evaluate()
    .setTitle("GTARP Caisse — PRO 2026")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/* ===============================================================
 *  include() — Charge un fichier HTML
 * ---------------------------------------------------------------
 *  Rôle :
 *      - Permet d'inclure head.html, header.html, footer.html,
 *        scripts.html, ou n'importe quelle page du SPA.
 *      - Compatible Clasp : les fichiers sont aplatis.
 *
 *  Exemple :
 *      <?!= include('head'); ?>
 *      <?!= include('header'); ?>
 * =============================================================== */
function include(filename) {
  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();
}