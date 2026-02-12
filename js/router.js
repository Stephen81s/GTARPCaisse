// ============================================================
//  ROUTER.JS — Gestion des pages incluses
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    logInfo("Initialisation du routeur…");
    loadPage("accueil"); // page par défaut
});

// ------------------------------------------------------------
//  Fonction : loadPage(name)
//  Charge un fichier HTML depuis /pages/name.html
// ------------------------------------------------------------
function loadPage(name) {
    logInfo(`Chargement de la page : ${name}`);

    fetch(`pages/${name}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`Page introuvable : ${name}`);
            return response.text();
        })
        .then(html => {
            document.getElementById("page-container").innerHTML = html;
            logSuccess(`Page chargée : ${name}`);
        })
        .catch(err => {
            logError(err);
            document.getElementById("page-container").innerHTML =
                `<p style="color:red;">Erreur : impossible de charger ${name}.html</p>`;
        });
}
