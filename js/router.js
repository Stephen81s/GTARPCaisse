// ============================================================
//  ROUTER.JS — Gestion des pages incluses
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    logInfo("Initialisation du routeur…");
    loadPage("accueil"); // page par défaut
});

// ------------------------------------------------------------
//  Fonction : loadPage(name)
//  Charge un fichier HTML depuis /interfaces/name.html
// ------------------------------------------------------------
function loadPage(name) {

    logInfo(`Chargement de la page : ${name}`);

    fetch(`interfaces/${name}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`Page introuvable : ${name}`);
            return response.text();
        })
        .then(html => {
            document.getElementById("page-container").innerHTML = html;
            updateHeaderButtons(name);
            logSuccess(`Page chargée : ${name}`);
        })
        .catch(err => {
            logError(err);
            document.getElementById("page-container").innerHTML =
                `<p style="color:red;">Erreur : impossible de charger ${name}.html</p>`;
        });
}

// ------------------------------------------------------------
//  Fonction : updateHeaderButtons(page)
//  Cache le bouton de la page actuelle
// ------------------------------------------------------------
function updateHeaderButtons(page) {

    const pages = ["accueil", "caisse", "ticket", "ressource", "service"];

    pages.forEach(p => {
        const btn = document.getElementById(`btn-${p}`);

        if (!btn) return;

        if (p === page) {
            btn.style.display = "none";   // on cache le bouton actif
        } else {
            btn.style.display = "inline-block"; // on montre les autres
        }
    });
}
