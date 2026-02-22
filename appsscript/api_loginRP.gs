/***************************************************************
 * FICHIER : appsscript/api_loginRP.gs
 * ARCHITECTURE : RP MANAGER — PRO 2026
 * MODULE : Authentification RP
 * DESCRIPTION :
 *    - Auto-admin si premier utilisateur
 *    - Vérification utilisateur existant
 *    - Ajout dans CONNEXIONS_EN_ATTENTE
 *    - Retour structuré pour le SPA
 * AUTEUR : Stephen
 ***************************************************************/

function api_loginRP(nom, prenom) {
  try {
    const ss = SpreadsheetApp.openById(CONSTANTS.SSID);
    const users = ss.getSheetByName("USERS");
    const pending = ss.getSheetByName("CONNEXIONS_EN_ATTENTE");

    const nomRP = nom.trim();
    const prenomRP = prenom.trim();
    const ip = Session.getActiveUser().getEmail() || "unknown";

    Logger.log("[api_loginRP] Connexion : " + nomRP + " " + prenomRP);

    const usersData = users.getDataRange().getValues();

    // ----------------------------------------------------------
    // 1) PREMIER UTILISATEUR → ADMIN PRINCIPAL
    // ----------------------------------------------------------
    if (usersData.length <= 1) {
      Logger.log("[api_loginRP] Premier utilisateur → AUTO ADMIN");

      const id = Utilities.getUuid();
      users.appendRow([id, nomRP, prenomRP, "ADMIN", new Date(), ip]);

      return {
        success: true,
        status: "AUTO_ADMIN"
      };
    }

    // ----------------------------------------------------------
    // 2) UTILISATEUR EXISTANT
    // ----------------------------------------------------------
    const existing = usersData.find(r => r[1] === nomRP && r[2] === prenomRP);

    if (existing) {
      const role = existing[3];
      Logger.log("[api_loginRP] Utilisateur existant → rôle : " + role);

      return {
        success: true,
        status: "OK",
        role
      };
    }

    // ----------------------------------------------------------
    // 3) DEMANDE EN ATTENTE
    // ----------------------------------------------------------
    Logger.log("[api_loginRP] Nouvelle demande en attente.");

    const id = Utilities.getUuid();
    pending.appendRow([
      id,
      nomRP,
      prenomRP,
      new Date(),
      ip,
      "PENDING",
      "",
      "",
      new Date(),
      "SYSTEM",
      "",
      ""
    ]);

    return {
      success: true,
      status: "PENDING"
    };

  } catch (err) {
    Logger.log("[api_loginRP] ERREUR : " + err);
    return { success: false, error: err.toString() };
  }
}