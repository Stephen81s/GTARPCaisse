/**
 * ==========================================
 * File: Code.gs
 * Project: GTARP Caisse
 * Build: PRO 2026
 * Description: Serveur HTML principal + gestion des vues SPA
 * ==========================================
 */

/**
 * ==========================================
 * Section: doGet()
 * Description: Point d'entrée principal — charge index.html
 * ==========================================
 */
function doGet() {
  return HtmlService
    .createTemplateFromFile('index')
    .evaluate()
    .setTitle('GTARP Caisse')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

/**
 * ==========================================
 * Section: include()
 * Description: Inclusion de fichiers HTML (CSS, JS, partials)
 * Usage dans HTML : <?!= include('includes'); ?>
 * ==========================================
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * ==========================================
 * File: loadPage (dans Code.gs)
 * Project: GTARP Caisse
 * Build: PRO 2026
 * Description: Charge une vue dynamique.
 *              Si le fichier n'existe pas,
 *              renvoie error.html avec le message.
 * ==========================================
 */
function loadPage(viewName) {
  try {
    return HtmlService
      .createHtmlOutputFromFile(viewName)
      .getContent();

  } catch (e) {

    // On injecte le message d’erreur dans une variable globale JS
    return HtmlService
      .createTemplateFromFile('error')
      .evaluate()
      .getContent()
      .replace(
        '<!--MESSAGE-->',
        `Impossible de charger : ${viewName}.html\n\n${e.message}`
      );
  }
}