/***************************************************************
 * FICHIER : navigation.js
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 * DESCRIPTION :
 *   - Gère les clics du menu
 *   - Appelle spa.loadPage(<path>)
 ***************************************************************/

console.log("🟦 [navigation] Module navigation chargé.");

function setupNavigation() {
    const buttons = document.querySelectorAll("#menu button");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const page = btn.dataset.page;

            console.log(`🟦 [navigation] Navigation vers : ${page}`);

            // Appelle le SPA PRO 2026
            spa.loadPage(page);
        });
    });
}

window.addEventListener("DOMContentLoaded", () => {
    setupNavigation();

    // Page par défaut
    spa.loadPage("admin/core");
});