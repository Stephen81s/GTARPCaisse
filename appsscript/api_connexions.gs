/***************************************************************
 * FICHIER : api_connexions.gs
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - API dédiée aux connexions RP
 *   - Première connexion : auto‑admin si USERS est vide
 *   - Connexions suivantes : demande en attente
 *   - Validation admin : création utilisateur + jeton
 *   - Vérification session : sécurisation de la page d’accueil
 *
 * NOTES :
 *   - Ce fichier est automatiquement poussé via CLASP
 *   - Toute modification locale doit être suivie d’un "clasp push"
 *   - Les logs sont centralisés dans LOGS (Google Sheets)
 ***************************************************************/


/***************************************************************
 * API : DEMANDE DE CONNEXION (joueur)
 ***************************************************************/
function api_requestConnexion(nomRP, prenomRP, ip) {
  logAction("API_CONNEXION", `Demande connexion : ${nomRP} ${prenomRP}`);

  try {
    const res = requestConnexion(nomRP, prenomRP, ip);
    return apiResponse(true, res);

  } catch (err) {
    logAction("API_CONNEXION", `❌ Erreur requestConnexion : ${err}`);
    return apiResponse(false, null, "Erreur serveur : " + err);
  }
}


/***************************************************************
 * API : VALIDATION ADMIN
 ***************************************************************/
function api_approveConnexion(demandeId, adminId) {
  logAction("API_CONNEXION", `Validation admin → demande ${demandeId}`);

  try {
    const res = approveConnexion(demandeId, adminId);
    return apiResponse(true, res);

  } catch (err) {
    logAction("API_CONNEXION", `❌ Erreur approveConnexion : ${err}`);
    return apiResponse(false, null, "Erreur serveur : " + err);
  }
}


/***************************************************************
 * API : VÉRIFICATION SESSION (page d’accueil)
 ***************************************************************/
function api_checkUserSession(userId, jeton) {
  logAction("API_CONNEXION", `Check session → user ${userId}`);

  try {
    const res = checkUserSession(userId, jeton);
    return apiResponse(true, res);

  } catch (err) {
    logAction("API_CONNEXION", `❌ Erreur checkUserSession : ${err}`);
    return apiResponse(false, null, "Erreur serveur : " + err);
  }
}
