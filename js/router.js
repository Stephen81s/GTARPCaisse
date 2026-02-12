// ============================================================
//  ROUTER.JS — VERSION ULTRA LOGGÉE
// ============================================================

// Petit helper pour chronométrer
function now() {
    return performance.now().toFixed(2);
}

log("router", "Initialisation du router…");

// ============================================================
//  🧠 Détection automatique du chemin de base
// ============================================================

function getBasePath() {
    const parts = window.location.pathname.split("/").filter(Boolean);

    log("router", `pathname = ${window.location.pathname}`);
    log("router", `parts = ${JSON.stringify(parts)}`);

    if (parts.length > 0) {
        const base = "/" + parts[0];
        logSuccess("router", `BASE détecté = ${base}`);
        return base;
    }

    logSuccess("router", "BASE détecté = '' (racine)");
    return "";
}

const BASE = getBasePath();


// ============================================================
//  🧠 Cache des pages déjà chargées
// ============================================================

const pageCache = {};


// ============================================================
//  📌 Fonction principale : charger une page
// ============================================================

async function loadPage(pageName) {
    const start = now();
    logWarn("router", `=== loadPage('${pageName}') START @ ${start}ms ===`);

    const container = document.getElementById("page-container");
    if (!container) {
        logError("router", "Conteneur #page-container introuvable");
        return;
    }

    // 1. Cache
    if (pageCache[pageName]) {
        logSuccess("router", `CACHE HIT → ${pageName}`);
        container.innerHTML = pageCache[pageName];
        initPageModule(pageName);
        logWarn("router", `=== loadPage('${pageName}') END (cache) @ ${now()}ms ===`);
        return;
    }

    // 2. Fetch du fichier HTML
    try {
        const url = `${BASE}/${pageName}.html?cache=${Date.now()}`;
        log("router", `FETCH → ${url}`);

        const response = await fetch(url);

        log("router", `HTTP status = ${response.status}`);

        if (!response.ok) {
            logError("router", `Fichier introuvable : ${url}`);
            container.innerHTML = `<h2>Erreur</h2><p>Page introuvable.</p>`;
            return;
        }

        const html = await response.text();

        // 3. Suppression des scripts internes
        log("router", `Suppression des <script> internes…`);
        const sanitized = removeScripts(html);

        // 4. Mise en cache
        pageCache[pageName] = sanitized;
        logSuccess("router", `Page ${pageName} mise en cache`);

        // 5. Injection
        container.innerHTML = sanitized;
        logSuccess("router", `Page ${pageName} injectée dans le DOM`);

        // 6. Initialisation du module JS
        initPageModule(pageName);

    } catch (err) {
        logError("router", `Erreur lors du chargement de ${pageName}`, err);
        container.innerHTML = `<h2>Erreur</h2><p>Impossible de charger la page.</p>`;
    }

    logWarn("router", `=== loadPage('${pageName}') END @ ${now()}ms ===`);
}


// ============================================================
//  🧹 Suppression des <script> internes
// ============================================================

function removeScripts(html) {
    const cleaned = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
    log("router", `Scripts internes supprimés (${html.length} → ${cleaned.length} chars)`);
    return cleaned;
}


// ============================================================
//  ⚙️ Initialisation automatique des modules
// ============================================================

function initPageModule(pageName) {
    log("router", `Initialisation du module JS pour '${pageName}'`);

    switch (pageName) {
        case "caisse":
            if (typeof initCaisse === "function") {
                logSuccess("router", "initCaisse() exécuté");
                initCaisse();
            }
            break;

        case "ticket":
            if (typeof initTicket === "function") {
                logSuccess("router", "initTicket() exécuté");
                initTicket();
            }
            break;

        case "ressource":
            if (typeof initRessource === "function") {
                logSuccess("router", "initRessource() exécuté");
                initRessource();
            }
            break;

        case "service":
            if (typeof initService === "function") {
                logSuccess("router", "initService() exécuté");
                initService();
            }
            break;

        case "admin":
            if (typeof initAdmin === "function") {
                logSuccess("router", "initAdmin() exécuté");
                initAdmin();
            }
            break;

        default:
            logWarn("router", `Aucun module JS associé à : ${pageName}`);
    }
}


// ============================================================
//  🏁 Confirmation
// ============================================================

logSuccess("ROUTER.JS ULTRA LOGGÉ chargé et opérationnel");
