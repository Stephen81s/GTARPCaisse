// ============================================================
//  ROUTER.JS — Gestion centralisée des pages du front-end
//  Auteur : Stephen
//  Description : Charge dynamiquement les pages HTML situées
//  dans /interfaces/, met à jour le header, et injecte les
//  scripts JS spécifiques à chaque module.
// ============================================================


// ------------------------------------------------------------
//  Initialisation du routeur
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    logInfo("Initialisation du routeur…");
    loadPage("accueil"); // Page par défaut
});


// ------------------------------------------------------------
//  Fonction : loadPage(name)
//  Charge /interfaces/<name>.html dans #page-container
//  et injecte le JS correspondant si nécessaire.
// ------------------------------------------------------------
function loadPage(name) {

    logInfo(`Chargement de la page : ${name}`);

    fetch(`interfaces/${name}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`Page introuvable : ${name}`);
            return response.text();
        })
        .then(html => {

            // Injection du HTML dans le container principal
            const container = document.getElementById("page-container");
            if (!container) {
                logError("Erreur critique : #page-container introuvable dans index.html");
                return;
            }

            container.innerHTML = html;

            // Mise à jour des boutons du header
            updateHeaderButtons(name);

            // Chargement du script JS associé à la page
            loadPageScript(name);

            logSuccess(`Page chargée : ${name}`);
        })
        .catch(err => {
            logError(err);
            document.getElementById("page-container").innerHTML =
                `<p style="color:red;">Erreur : impossible de charger ${name}.html</p>`;
        });
}


// ------------------------------------------------------------
//  Fonction : loadPageScript(name)
//  Charge automatiquement le JS correspondant à la page
//  Exemple : caisse → js/caisse.js
// ------------------------------------------------------------
function loadPageScript(name) {

    const scripts = {
        "caisse": "js/caisse.js",
        "ticket": "js/ticket.js",
        "ressource": "js/ressource.js",
        "service": "js/service.js"
    };

    if (scripts[name]) {
        const script = document.createElement("script");
        script.src = scripts[name];
        script.defer = true;
        document.body.appendChild(script);

        logInfo(`Script chargé : ${scripts[name]}`);
    }
}


// ------------------------------------------------------------
//  Fonction : updateHeaderButtons(page)
//  Cache le bouton de la page active et affiche les autres
// ------------------------------------------------------------
function updateHeaderButtons(page) {

    const pages = ["accueil", "caisse", "ticket", "ressource", "service"];

    pages.forEach(p => {
        const btn = document.getElementById(`btn-${p}`);

        if (!btn) return;

        if (p === page) {
            btn.style.display = "none"; // On cache le bouton actif
        } else {
            btn.style.display = "inline-block"; // On montre les autres
        }
    });
}
