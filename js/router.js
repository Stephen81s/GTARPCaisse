// ============================================================
//  ROUTER.JS — CHARGEUR DE PAGES DYNAMIQUE (GITHUB PAGES SAFE)
//  Auteur : Stephen
//  Version : CORE v2.0 (GitHub Pages Compatible)
// ============================================================


// ============================================================
//  🧠 Détection automatique du chemin de base
//  - Local : "" (racine)
//  - GitHub Pages : "/NomDuRepo"
// ============================================================

function getBasePath() {
    const path = window.location.pathname.split("/").filter(Boolean);

    // Exemple GitHub Pages :
    // https://stephen81s.github.io/GTARPCaisse/
    // pathname = "/GTARPCaisse/"
    if (path.length > 0) {
        return "/" + path[0];
    }

    return "";
}

const BASE = getBasePath();


// ============================================================
//  🧠 CACHE DES PAGES DÉJÀ CHARGÉES
// ============================================================

const pageCache = {};


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

    // 1. Cache
    if (pageCache[pageName]) {
        log("router", `Page ${pageName} chargée depuis le cache`);
        container.innerHTML = pageCache[pageName];
        initPageModule(pageName);
        return;
    }

    // 2. Fetch du fichier HTML
    try {
        const url = `${BASE}/interfaces/${pageName}.html?cache=${Date.now()}`;
        log("router", `Chargement depuis : ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
            logError("router", `Fichier introuvable : ${url}`);
            container.innerHTML = `<h2>Erreur</h2><p>Page introuvable.</p>`;
            return;
        }

        const html = await response.text();

        // 3. Nettoyage des scripts internes
        const sanitized = removeScripts(html);

        // 4. Mise en cache
        pageCache[pageName] = sanitized;

        // 5. Injection
        container.innerHTML = sanitized;

        logSuccess("router", `Page ${pageName} chargée avec succès`);

        // 6. Initialisation du module JS
        initPageModule(pageName);

    } catch (err) {
        logError("router", "Erreur lors du chargement :", err);
        container.innerHTML = `<h2>Erreur</h2><p>Impossible de charger la page.</p>`;
    }
}


// ============================================================
//  🧹 Suppression des <script> internes
// ============================================================

function removeScripts(html) {
    return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
}


// ============================================================
//  ⚙️ Initialisation automatique des modules
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
//  🏁 Confirmation
// ============================================================

logSuccess("ROUTER.JS (GitHub Pages Edition) chargé et opérationnel");
