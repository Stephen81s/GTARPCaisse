/***************************************************************
 * FICHIER : navigation.js
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Routeur principal du frontend
 *   - Charge dynamiquement les pages HTML dans #app
 *   - Gère le menu, le loader et les erreurs
 *
 * NOTES :
 *   - Les pages sont dans /pages/<page>.html
 *   - Le loader global est #loader
 *   - Le conteneur principal est #app
 ***************************************************************/


/***************************************************************
 * CHARGEMENT D’UNE PAGE
 ***************************************************************/
async function loadPage(pageName) {
    showLoader();

    try {
        const response = await fetch(`pages/${pageName}.html`);
        if (!response.ok) throw new Error(`Page introuvable : ${pageName}`);

        const html = await response.text();
        document.getElementById("app").innerHTML = html;

        // Exécute un script d'initialisation si présent
        if (typeof window[`init_${pageName}`] === "function") {
            window[`init_${pageName}`]();
        }

    } catch (err) {
        document.getElementById("app").innerHTML = `
            <div class="error">
                <h2>Erreur</h2>
                <p>${err.message}</p>
            </div>
        `;
    }

    hideLoader();
}


/***************************************************************
 * GESTION DU MENU
 ***************************************************************/
function setupNavigation() {
    const buttons = document.querySelectorAll("#menu button");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const page = btn.dataset.page;
            loadPage(page);
        });
    });
}


/***************************************************************
 * LOADER GLOBAL
 ***************************************************************/
function showLoader() {
    document.getElementById("loader").classList.remove("hidden");
}

function hideLoader() {
    document.getElementById("loader").classList.add("hidden");
}


/***************************************************************
 * INITIALISATION AU CHARGEMENT
 ***************************************************************/
window.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    loadPage("core"); // Page d’accueil
});