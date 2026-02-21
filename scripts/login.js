/***************************************************************
 * FICHIER : login.js
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Nouveau système de connexion RP
 *   - Envoi nomRP + prenomRP au backend
 *   - Cas 1 : Première connexion → auto-admin
 *   - Cas 2 : Demande en attente admin
 *   - Stockage userId + jeton dans localStorage
 *   - Redirection SPA vers "core"
 ***************************************************************/

console.log("🟦 [login] Script login chargé.");

/***************************************************************
 * ÉVÉNEMENT : Clic sur "Connexion"
 ***************************************************************/
function login() {
    console.log("🟦 [login] Tentative de connexion…");

    const nomRP = document.getElementById("nom").value.trim();
    const prenomRP = document.getElementById("prenom").value.trim();

    if (!nomRP || !prenomRP) {
        console.warn("⚠️ [login] Champs manquants.");
        alert("Merci de remplir Nom RP et Prénom RP.");
        return;
    }

    console.log(`🟦 [login] Envoi demande → ${nomRP} ${prenomRP}`);

    google.script.run
        .withSuccessHandler(handleLoginResponse)
        .withFailureHandler(err => {
            console.error("❌ [login] Erreur API :", err);
            alert("Erreur serveur.");
        })
        .api_requestConnexion(nomRP, prenomRP, "web");
}


/***************************************************************
 * TRAITEMENT DE LA RÉPONSE BACKEND
 ***************************************************************/
function handleLoginResponse(res) {
    console.log("🟦 [login] Réponse backend :", res);

    if (!res.success) {
        alert("Erreur : " + res.error);
        return;
    }

    const data = res.data;

    /***********************************************************
     * CAS 1 : Première connexion → auto-admin
     ***********************************************************/
    if (data.autoAdmin === true) {
        console.log("🟩 [login] Première connexion → auto-admin");

        localStorage.setItem("userId", data.userId);
        localStorage.setItem("jeton", data.jeton);
        localStorage.setItem("role", "admin");

        spa.loadPage("core");
        return;
    }

    /***********************************************************
     * CAS 2 : Demande en attente admin
     ***********************************************************/
    console.log("🟧 [login] Demande en attente admin");

    document.getElementById("loginStatus").innerHTML =
        "<span style='color: orange;'>Votre demande est en attente de validation par un administrateur.</span>";
}


/***************************************************************
 * AUTO-LOGIN SI SESSION EXISTE
 ***************************************************************/
window.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");
    const jeton = localStorage.getItem("jeton");

    if (!userId || !jeton) return;

    console.log("🟦 [login] Session locale détectée → vérification backend…");

    google.script.run
        .withSuccessHandler(res => {
            if (res.success && res.data.success) {
                console.log("🟩 [login] Session valide → redirection core");
                spa.loadPage("core");
            } else {
                console.warn("🟥 [login] Session invalide → nettoyage");
                localStorage.clear();
            }
        })
        .withFailureHandler(err => {
            console.error("❌ [login] Erreur check session :", err);
        })
        .api_checkUserSession(userId, jeton);
});