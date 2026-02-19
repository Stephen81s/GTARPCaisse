/**
 * ============================================================
 *  FICHIER : Code.gs
 *  MODULE  : RP BUSINESS SYSTEM — UI WRAPPERS + SECURITY
 *  VERSION : PRO 2026
 *  AUTHOR  : Stephen
 * ============================================================
 */

/* ============================================================
   CHARGEMENT DE LA PAGE (TEMPLATING OBLIGATOIRE)
   ============================================================ */
function doGet() {
  console.log("🟦 [doGet] Chargement du site…");

  const template = HtmlService.createTemplateFromFile("index");

  // Injection côté serveur : rôle de l'utilisateur
  template.userRole = admin.getUserRole();

  return template.evaluate()
    .setTitle("RP Business System")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ============================================================
   INCLUDE HTML (style_admin, partials, etc.)
   ============================================================ */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/* ============================================================
   WRAPPERS UI → BACKEND ADMIN
   ============================================================ */

function ui_registerPlayer(nom, prenom) {
  return admin.createJoueur(nom, prenom);
}

function ui_createEntreprise(nom, patronNom, patronPrenom) {
  return admin.createEntreprise(nom, patronNom, patronPrenom);
}

function ui_updateSchema() {
  return admin.updateSchema();
}

function ui_updateFunctions() {
  return admin.updateFunctions();
}

function ui_updateConstantes() {
  return admin.updateConstantes();
}

function ui_updateAll() {
  return admin.updateAll();
}

function ui_resetSystem() {
  return admin.resetSystem();
}

/* ============================================================
   WRAPPERS — SÉCURITÉ & RÔLES
   ============================================================ */

function ui_getUserRole() {
  return admin.getUserRole();
}

function ui_isAdmin() {
  return admin.isAdmin();
}

function ui_isAdminPrincipal() {
  return admin.isAdminPrincipal();
}

function ui_isAdminSecondaire() {
  return admin.isAdminSecondaire();
}

/* ============================================================
   WRAPPERS — GESTION DES ADMINS (ADMIN PRINCIPAL ONLY)
   ============================================================ */

function ui_addAdmin(email) {
  return admin.addAdmin(email);
}

function ui_removeAdmin(email) {
  return admin.removeAdmin(email);
}

function ui_getAdminsList() {
  return admin.getAdminsList();
}

/* ============================================================
   WRAPPER — CHECK PATRON
   ============================================================ */
function ui_checkIfPlayerIsPatron(nom, prenom) {
  return admin.checkIfPlayerIsPatron(nom, prenom);
}