// ============================================================
//  ROUTER.JS — CHARGEUR DE PAGES DYNAMIQUE
//  Auteur : Stephen
//  Version : CORE v1.0
//  Description :
//    - Charge les pages HTML depuis /interfaces/*.html
//    - Empêche le rechargement des scripts
//    - Gère un cache local pour éviter les fetch inutiles
//    - Initialise automatiquement les modules JS associés
// ============================================================


// ============================================================
//  🧠 CACHE DES PAGES DÉJÀ CHARGÉES
// ============================================================

const pageCache = {};   // { "caisse": "<html>", "ticket": "<html>" }


// ============================================================
//  📌 Fonction principale : charger une page
// ============================================================

async function loadPage(pageName) {
    log("router", `Demande de chargement : ${pageName}`);

    const container = document.getElementById("page-container");
    if (!container) {
        logError("router", "Conteneur #page-container introuvable");
        return;
    }

    // ------------------------------------------------------------
    // 1. Si la page est en cache → affichage immédiat
    // ------------------------------------------------------------
    if (pageCache[pageName]) {
        log("router", `Page ${pageName} chargée depuis le cache`);
        container.innerHTML = pageCache[pageName];
        initPageModule(pageName);
        return;
    }

    // ------------------------------------------------------------
    // 2. Sinon → fetch du fichier HTML
    // ------------------------------------------------------------
    try {
        const response = await fetch(`interfaces/${pageName}.html?cache=${Date.now()}`);

        if (!response.ok) {
            logError("router", `Fichier introuvable : interfaces/${pageName}.html`);
            container.innerHTML = `<h2>Erreur</h2><p>Page introuvable.</p>`;
            return;
        }

        const html = await response.text();

        // ------------------------------------------------------------
        // 3. Nettoyage : suppression des <script> internes
        // ------------------------------------------------------------
        const sanitized = removeScripts(html);

        // ------------------------------------------------------------
        // 4. Mise en cache
        // ------------------------------------------------------------
        pageCache[pageName] = sanitized;

        // ------------------------------------------------------------
        // 5. Injection dans le DOM
        // ------------------------------------------------------------
        container.innerHTML = sanitized;

        logSuccess("router", `Page ${pageName} chargée avec succès`);

        // ------------------------------------------------------------
        // 6. Initialisation du module JS associé
        // ------------------------------------------------------------
        initPageModule(pageName);

    } catch (err) {
        logError("router", "Erreur lors du chargement :", err);
        container.innerHTML = `<h2>Erreur</h2><p>Impossible de charger la page.</p>`;
    }
}


// ============================================================
//  🧹 Suppression des <script> internes (sécurité + éviter doublons)
// ============================================================

function removeScripts(html) {
    return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}


// ============================================================
//  ⚙️ Initialisation automatique des modules
// ============================================================
//  Chaque page peut avoir une fonction initXxx()
//  Exemple : caisse.html → initCaisse()
// ============================================================

function initPageModule(pageName) {
    log("router", `Initialisation du module : ${pageName}`);

    switch (pageName) {
        case "caisse":
            if (typeof initCaisse === "function") initCaisse();
            break;

        case "ticket":
            if (typeof initTicket === "function") initTicket();
            break;

        case "ressource":
            if (typeof initRessource === "function") initRessource();
            break;

        case "service":
            if (typeof initService === "function") initService();
            break;

        case "admin":
            if (typeof initAdmin === "function") initAdmin();
            break;

        default:
            logWarn("router", `Aucun module JS associé à : ${pageName}`);
    }
}


// ============================================================
//  🏁 Confirmation de chargement
// ============================================================

logSuccess("ROUTER.JS chargé et opérationnel");
