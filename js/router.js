// ============================================================
// ROUTER.JS — Chargeur de pages propre et compatible Netlify
// ============================================================

log("ROUTER", "Initialisation du router…");

// Détection du chemin de base
function getBasePath() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    return parts.length > 0 ? "/" + parts[0] : "";
}

const BASE = getBasePath();
logSuccess("router", `BASE détecté = '${BASE}'`);

// Cache des pages
const pageCache = {};

// Charge une page depuis /interfaces
async function loadPage(pageName) {
    log("router", `Chargement demandé : ${pageName}`);

    const container = document.getElementById("page-container");
    if (!container) {
        logError("router", "Conteneur #page-container introuvable");
        return;
    }

    // Cache
    if (pageCache[pageName]) {
        log("router", `Page ${pageName} chargée depuis le cache`);
        container.innerHTML = pageCache[pageName];
        return;
    }

    const url = `${BASE}/interfaces/${pageName}.html?cache=${Date.now()}`;
    log("router", `FETCH → ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
        logError("router", `Page introuvable : ${url}`);
        container.innerHTML = "<h2>Erreur</h2><p>Page introuvable.</p>";
        return;
    }

    const html = await response.text();
    const sanitized = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

    pageCache[pageName] = sanitized;
    container.innerHTML = sanitized;

    logSuccess("router", `Page ${pageName} chargée`);
}

logSuccess("router", "ROUTER.JS ULTRA PRO chargé et opérationnel");
