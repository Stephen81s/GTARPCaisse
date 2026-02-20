/***************************************************************
 * FICHIER : navigation.js
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 ***************************************************************/


/***************************************************************
 * EXECUTION DES SCRIPTS INTERNES
 ***************************************************************/
function executeScripts(container) {
    const scripts = container.querySelectorAll("script");

    scripts.forEach(oldScript => {
        const newScript = document.createElement("script");

        if (oldScript.textContent) {
            newScript.textContent = oldScript.textContent;
        }

        if (oldScript.src) {
            newScript.src = oldScript.src;
        }

        document.body.appendChild(newScript);
        oldScript.remove();
    });
}


/***************************************************************
 * CHARGEMENT D’UNE PAGE
 ***************************************************************/
async function loadPage(pageName) {
    showLoader();

    try {
        const response = await fetch(`pages/${pageName}.html`);
        if (!response.ok) throw new Error(`Page introuvable : ${pageName}`);

        const html = await response.text();
        const app = document.getElementById("app");
        app.innerHTML = html;

        // Exécute les scripts internes de la page
        executeScripts(app);

        // Appelle init_<page> si présent
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
 * INITIALISATION
 ***************************************************************/
window.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    loadPage("core");
});