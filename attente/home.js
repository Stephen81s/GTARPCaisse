/***************************************************************
 * FICHIER : home.js
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Sécurisation de la page d’accueil RP
 *   - Vérification de la session via backend
 *   - Redirection vers login si session invalide
 *   - Chargement des infos utilisateur
 ***************************************************************/

console.log("🟦 [home] Script home chargé.");


/***************************************************************
 * LOG FRONT
 ***************************************************************/
function logHome(msg) {
    console.log("🟦 [home] " + msg);
}


/***************************************************************
 * FONCTION : Vérifier la session utilisateur
 ***************************************************************/
function checkSession() {
    const userId = localStorage.getItem("userId");
    const jeton = localStorage.getItem("jeton");

    if (!userId || !jeton) {
        logHome("Aucune session locale → redirection login");
        spa.loadPage("login");
        return;
    }

    logHome(`Vérification session backend → user ${userId}`);

    google.script.run
        .withSuccessHandler(handleSessionResponse)
        .withFailureHandler(err => {
            console.error("❌ [home] Erreur API :", err);
            spa.loadPage("login");
        })
        .api_checkUserSession(userId, jeton);
}


/***************************************************************
 * TRAITEMENT RÉPONSE BACKEND
 ***************************************************************/
function handleSessionResponse(res) {
    logHome("Réponse backend reçue");
    console.log(res);

    if (!res.success || !res.data.success) {
        logHome("Session invalide → nettoyage + login");
        localStorage.clear();
        spa.loadPage("login");
        return;
    }

    const user = res.data.user;

    logHome(`Session valide → bienvenue ${user[3]} ${user[4]}`);

    // Affichage dans l’UI
    document.getElementById("homeUserName").innerText =
        `${user[3]} ${user[4]}`;

    document.getElementById("homeUserRole").innerText =
        `${user[0]}`;
}


/***************************************************************
 * AUTO-EXECUTION À L’OUVERTURE DE LA PAGE
 ***************************************************************/
window.addEventListener("DOMContentLoaded", () => {
    logHome("Chargement page → vérification session");
    checkSession();
});