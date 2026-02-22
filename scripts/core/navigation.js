/***************************************************************
 * FICHIER : navigation.js
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Menu hamburger déroulant en haut à gauche
 *   - Gère les clics du menu
 *   - ⚠️ Ne lance plus le SPA (déplacé dans app.js)
 ***************************************************************/

console.log("🟦 [navigation] Module navigation chargé.");

function setupNavigation() {

    // Gestion des boutons du menu
    const buttons = document.querySelectorAll("#menu button");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const page = btn.dataset.page;
            console.log(`🟦 [navigation] Navigation vers : ${page}`);
            spa.loadPage(page);

            // refermer le menu après clic
            document.getElementById("menu").classList.add("hidden");
        });
    });

    // Toggle du menu hamburger
    const toggle = document.getElementById("menu-toggle");
    toggle.addEventListener("click", () => {
        const menu = document.getElementById("menu");
        menu.classList.toggle("hidden");
        console.log("🟦 [navigation] Menu toggled.");
    });
}

window.addEventListener("DOMContentLoaded", () => {
    console.log("🟦 [navigation] Initialisation DOM…");
    setupNavigation();
    // ❌ spa.loadPage("login") supprimé
});