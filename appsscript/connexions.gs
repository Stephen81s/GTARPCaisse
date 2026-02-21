/***************************************************************
 * FICHIER : connexions.gs
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Gestion des demandes de connexion RP
 *   - Première connexion : auto‑admin si USERS est vide
 *   - Connexions suivantes : ajout dans CONNEXIONS_EN_ATTENTE
 *   - Validation admin : création utilisateur + jeton
 *
 * NOTES :
 *   - Ce fichier est automatiquement poussé via CLASP
 *   - Toute modification locale doit être suivie d’un "clasp push"
 *   - Les logs sont centralisés dans LOGS (Google Sheets)
 ***************************************************************/


/***************************************************************
 * LOGGING — Fonction standardisée
 ***************************************************************/
function logConnexion(message) {
  logAction("CONNEXIONS", message); // utilise ton système global de logs
}


/***************************************************************
 * 1️⃣ DEMANDE DE CONNEXION (joueur)
 *    - Si USERS est vide → auto‑admin
 *    - Sinon → ajout dans CONNEXIONS_EN_ATTENTE
 ***************************************************************/
function requestConnexion(nomRP, prenomRP, ip) {
  logConnexion(`Demande connexion : ${nomRP} ${prenomRP}`);

  const users = getSheetData("USERS");

  // Première connexion → auto‑admin
  if (users.length === 0) {
    logConnexion("Première connexion → création admin automatique");

    const jeton = Utilities.getUuid();
    const now = new Date();

    appendRow("USERS", [
      "admin",          // role
      1,                // id
      jeton,            // jeton
      nomRP,
      prenomRP,
      now, "system",
      now, "system",
      true, "OK"
    ]);

    return {
      success: true,
      autoAdmin: true,
      userId: 1,
      jeton: jeton
    };
  }

  // Sinon → demande en attente
  const now = new Date();
  appendRow("CONNEXIONS_EN_ATTENTE", [
    generateId("CONNEXIONS_EN_ATTENTE"),
    nomRP,
    prenomRP,
    now,
    ip,
    "pending",
    "",
    "",
    now, "system",
    now, "system"
  ]);

  logConnexion("Demande ajoutée dans CONNEXIONS_EN_ATTENTE");

  return {
    success: true,
    autoAdmin: false,
    message: "Demande en attente de validation admin"
  };
}


/***************************************************************
 * 2️⃣ VALIDATION ADMIN
 *    - L’admin accepte une demande
 *    - Création utilisateur dans USERS
 *    - Génération jeton
 ***************************************************************/
function approveConnexion(demandeId, adminId) {
  logConnexion(`Validation admin → demande ${demandeId}`);

  const sheet = SpreadsheetApp.getActive().getSheetByName("CONNEXIONS_EN_ATTENTE");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == demandeId) {

      const nomRP = data[i][1];
      const prenomRP = data[i][2];
      const now = new Date();
      const jeton = Utilities.getUuid();
      const newId = generateId("USERS");

      // Création utilisateur
      appendRow("USERS", [
        "joueur",
        newId,
        jeton,
        nomRP,
        prenomRP,
        now, adminId,
        now, adminId,
        true, "OK"
      ]);

      // Mise à jour demande
      sheet.getRange(i + 1, 6).setValue("approved");
      sheet.getRange(i + 1, 7).setValue(adminId);
      sheet.getRange(i + 1, 11).setValue(now);
      sheet.getRange(i + 1, 12).setValue(adminId);

      logConnexion(`Demande ${demandeId} approuvée → user ${newId}`);

      return {
        success: true,
        userId: newId,
        jeton: jeton
      };
    }
  }

  return { success: false, error: "Demande introuvable" };
}


/***************************************************************
 * 3️⃣ VÉRIFICATION SESSION (page d’accueil)
 ***************************************************************/
function checkUserSession(userId, jeton) {
  logConnexion(`Check session → user ${userId}`);

  const users = getSheetData("USERS");

  for (let i = 0; i < users.length; i++) {
    const row = users[i];

    if (row[1] == userId && row[2] == jeton && row[9] === true) {
      return { success: true, user: row };
    }
  }

  return { success: false, error: "Session invalide" };
}