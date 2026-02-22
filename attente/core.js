/***************************************************************
 * FICHIER : core.js
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Page d’accueil RP
 *   - Affiche nom RP
 *   - Ajoute menu admin / entreprise selon rôle
 ***************************************************************/

console.log("🟦 [core] Script core chargé.");

window.addEventListener("DOMContentLoaded", async () => {

    console.log("🟦 [core] Initialisation…");

    const nom = localStorage.getItem("rp_nom");
    const prenom = localStorage.getItem("rp_prenom");

    if (!nom || !prenom) {
        console.warn("⚠️ [core] Pas d’infos RP → retour login.");
        spa.loadPage("login");
        return;
    }

    document.getElementById("rp-name").textContent = `${prenom} ${nom}`;

    console.log("🟩 [core] Nom RP affiché.");

    // Récupération du rôle via ton backend
    const role = await apiCall("getUserRole");
    console.log("🟦 [core] Rôle détecté :", role);

    const zone = document.getElementById("role-zone");

    if (role === "admin") {
        zone.innerHTML = `<button onclick="spa.loadPage('admin/core')">Panel Admin</button>`;
        console.log("🟩 [core] Bouton admin ajouté.");
    }

    if (role === "entreprise") {
        zone.innerHTML = `<button onclick="spa.loadPage('entreprise/entreprise')">Panel Entreprise</button>`;
        console.log("🟩 [core] Bouton entreprise ajouté.");
    }
});