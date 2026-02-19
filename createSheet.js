/**
 * ============================================================
 *  FICHIER : setupRPSystem.gs
 *  MODULE  : RP BUSINESS SYSTEM — SETUP
 *  AUTEUR  : Stephen
 *  VERSION : PRO 2026
 * ============================================================
 */

function setupRPSystem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const log = [];

  function createSheet(name, headers) {
    let sheet = ss.getSheetByName(name);

    if (!sheet) {
      sheet = ss.insertSheet(name);
      log.push(`✔️ Création de l’onglet : ${name}`);
    } else {
      sheet.clear();
      log.push(`♻️ Réinitialisation de l’onglet : ${name}`);
    }

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }

  // ============================================================
  // 1) ENTREPRISES — PRO 2026
  // ============================================================
  createSheet("ENTREPRISES", [
    "Entreprise_ID",
    "Nom",
    "Patron_ID",
    "Type",
    "Categorie",
    "Description",
    "Logo_URL",
    "Cle",
    "Date_activation",
    "Date_expiration",
    "Actif"
  ]);

  // ============================================================
  // 2) JOUEURS
  // ============================================================
  createSheet("JOUEURS", [
    "Joueur_ID",
    "Nom",
    "Prenom",
    "Entreprise_ID"   // optionnel
  ]);

  // ============================================================
  // 3) EMPLOIS — PRO 2026
  // ============================================================
  createSheet("EMPLOIS", [
    "Emploi_ID",
    "Entreprise_ID",
    "Nom",
    "Description",
    "Actif"
  ]);

  // ============================================================
  // 4) GRADES — PRO 2026
  // ============================================================
  createSheet("GRADES", [
    "Grade_ID",
    "Emploi_ID",
    "Nom",
    "Niveau",
    "Salaire",
    "Actif"
  ]);

  // ============================================================
  // 5) EMPLOYES — PRO 2026
  // ============================================================
  createSheet("EMPLOYES", [
    "Employe_ID",
    "Joueur_ID",
    "Entreprise_ID",
    "Emploi_ID",
    "Grade_ID",
    "Date_embauche",
    "Actif"
  ]);

  // ============================================================
  // 6) TYPES
  // ============================================================
  createSheet("TYPES", [
    "Type_ID",
    "Nom",
    "Categorie"
  ]);

  // ============================================================
  // 7) CONFIG
  // ============================================================
  createSheet("CONFIG", [
    "Parametre",
    "Valeur"
  ]);

  // ============================================================
  // 8) LOGS
  // ============================================================
  createSheet("LOGS", [
    "Date",
    "Action",
    "Entreprise",
    "Joueur",
    "Auteur"
  ]);

  // ============================================================
  // FIN — LOGGING
  // ============================================================
  Logger.log("===== SETUP RP SYSTEM — LOGS =====");
  log.forEach(l => Logger.log(l));

  SpreadsheetApp.getUi().alert(
    "Structure RP PRO 2026 créée avec succès.\n\n" +
    log.join("\n")
  );
}