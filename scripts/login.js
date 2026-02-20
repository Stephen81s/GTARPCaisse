/***************************************************************
 * FICHIER : login.js
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Page de connexion RP
 *   - Stocke jeton + nom RP + prénom RP dans localStorage
 *   - Redirige vers la page d’accueil si déjà connecté
 ***************************************************************/

console.log("🟦 [login] Script login chargé.");

function login() {
    console.log("🟦 [login] Tentative de connexion…");

    const token = document.getElementById("token").value.trim();
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();

    if (!token || !nom || !prenom) {
        console.warn("⚠️ [login] Champs manquants.");
        alert("Merci de remplir tous les champs.");
        return;
    }

    localStorage.setItem("rp_token", token);
    localStorage.setItem("rp_nom", nom);
    localStorage.setItem("rp_prenom", prenom);

    console.log("🟩 [login] Infos RP enregistrées dans localStorage.");

    spa.loadPage("core");
}

// Auto-login si déjà enregistré
window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("rp_token")) {
        console.log("🟩 [login] Déjà connecté → redirection vers core.");
        spa.loadPage("core");
    }
});