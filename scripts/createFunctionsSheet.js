/**
 * ============================================================
 *  createFunctionsSheet()
 *  Auteur : Stephen
 *  Version : PRO 2026
 *  Description :
 *      Génère la documentation interne des fonctions du système RP.
 *      Liste toutes les fonctions principales :
 *        - Setup
 *        - Admin
 *        - Entreprises
 *        - Emplois
 *        - Grades
 *        - Employés
 *        - Utilitaires
 * ============================================================
 */
function createFunctionsSheet() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("FUNCTIONS");

  if (!sheet) sheet = ss.insertSheet("FUNCTIONS");
  else sheet.clear();

  const headers = [
    "Fonction",
    "Description",
    "Paramètres",
    "Retour",
    "Module"
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");

  const functions = [

    // ============================================================
    // SETUP
    // ============================================================
    ["setupRPSystem", "Crée toutes les feuilles PRO 2026", "aucun", "void", "SETUP"],
    ["createCoreSheet", "Crée la source de vérité CORE", "aucun", "void", "SETUP"],
    ["createFunctionsSheet", "Crée la documentation FUNCTIONS", "aucun", "void", "SETUP"],

    // ============================================================
    // UTILITAIRES
    // ============================================================
    ["getNextID", "Génère un ID auto-incrémenté", "sheet, prefix", "string", "UTILS"],
    ["admin.getSheetByName", "Récupère une feuille", "name", "Sheet", "UTILS"],
    ["admin.getConfig", "Lit un paramètre CONFIG", "key", "string", "UTILS"],
    ["admin.setConfig", "Écrit un paramètre CONFIG", "key, value", "void", "UTILS"],

    // ============================================================
    // ADMIN — RÔLES
    // ============================================================
    ["admin.getCurrentEmail", "Retourne l’email Google", "aucun", "string", "ADMIN"],
    ["admin.isAdmin", "Vérifie admin principal ou secondaire", "aucun", "bool", "ADMIN"],
    ["admin.isAdminPrincipal", "Vérifie admin principal", "aucun", "bool", "ADMIN"],
    ["admin.isAdminSecondaire", "Vérifie admin secondaire", "aucun", "bool", "ADMIN"],
    ["admin.getUserRole", "Retourne le rôle RP", "aucun", "string", "ADMIN"],

    // ============================================================
    // ADMIN — GESTION DES ADMINS
    // ============================================================
    ["admin.addAdmin", "Ajoute un admin secondaire", "email", "string", "ADMIN"],
    ["admin.removeAdmin", "Retire un admin secondaire", "email", "string", "ADMIN"],
    ["admin.getAdminsList", "Liste des admins", "aucun", "object", "ADMIN"],

    // ============================================================
    // JOUEURS
    // ============================================================
    ["admin.createJoueur", "Crée un joueur RP", "nom, prenom", "Joueur_ID", "JOUEURS"],

    // ============================================================
    // ENTREPRISES
    // ============================================================
    ["createEntreprise", "Crée une entreprise PRO 2026", "nom, patronNom, patronPrenom", "Entreprise_ID", "ENTREPRISES"],
    ["admin.checkIfPlayerIsPatron", "Vérifie si un joueur est patron", "nom, prenom", "object/null", "ENTREPRISES"],

    // ============================================================
    // EMPLOIS
    // ============================================================
    ["admin.createEmploi", "Crée un emploi pour une entreprise", "entrepriseID, nom, description", "Emploi_ID", "EMPLOIS"],

    // ============================================================
    // GRADES
    // ============================================================
    ["admin.createGrade", "Crée un grade pour un emploi", "emploiID, nom, niveau, salaire", "Grade_ID", "GRADES"],

    // ============================================================
    // EMPLOYÉS
    // ============================================================
    ["admin.assignPlayerToEmploi", "Affecte un joueur à un emploi + grade", "joueurID, entrepriseID, emploiID, gradeID", "Employe_ID", "EMPLOYES"],

    // ============================================================
    // MAINTENANCE
    // ============================================================
    ["admin.updateSchema", "Met à jour SCHEMA", "aucun", "string", "MAINTENANCE"],
    ["admin.updateFunctions", "Met à jour FUNCTIONS", "aucun", "string", "MAINTENANCE"],
    ["admin.updateConstantes", "Met à jour CONSTANTES", "aucun", "string", "MAINTENANCE"],
    ["admin.updateAll", "Maintenance complète", "aucun", "string", "MAINTENANCE"]
  ];

  sheet.getRange(2, 1, functions.length, headers.length).setValues(functions);
}