// ============================================================
//  LOGGER.JS — MODULE GLOBAL DE LOGGING
//  Auteur : Stephen
//  Version : CORE v1.0
//  Description :
//    - Fournit un système de logs unifié pour tout le projet
//    - Ajoute des couleurs, timestamps, niveaux de logs
//    - Utilisable dans tous les modules (caisse, ticket, etc.)
//    - Désactivable facilement en production
// ============================================================


// ============================================================
//  🔧 CONFIGURATION GLOBALE
// ============================================================

// Active/désactive tous les logs (mode production)
const LOG_ENABLED = true;

// Format du timestamp
function logTimestamp() {
    const d = new Date();
    return d.toLocaleTimeString("fr-FR", { hour12: false });
}


// ============================================================
//  🎨 COULEURS POUR LES LOGS
// ============================================================

const LOG_COLORS = {
    info:    "color:#2196F3;font-weight:bold;",   // Bleu
    warn:    "color:#FFC107;font-weight:bold;",   // Jaune
    error:   "color:#F44336;font-weight:bold;",   // Rouge
    success: "color:#4CAF50;font-weight:bold;",   // Vert
    default: "color:#9E9E9E;"                     // Gris
};


// ============================================================
//  🧩 FONCTIONS DE LOG
// ============================================================

function logInfo(...msg) {
    if (!LOG_ENABLED) return;
    console.log(`%c[INFO ${logTimestamp()}]`, LOG_COLORS.info, ...msg);
}

function logWarn(...msg) {
    if (!LOG_ENABLED) return;
    console.warn(`%c[WARN ${logTimestamp()}]`, LOG_COLORS.warn, ...msg);
}

function logError(...msg) {
    if (!LOG_ENABLED) return;
    console.error(`%c[ERROR ${logTimestamp()}]`, LOG_COLORS.error, ...msg);
}

function logSuccess(...msg) {
    if (!LOG_ENABLED) return;
    console.log(`%c[SUCCESS ${logTimestamp()}]`, LOG_COLORS.success, ...msg);
}


// ============================================================
//  🌐 LOG GLOBAL (utilisable partout)
//  Exemple : log("ticket", "Chargement terminé")
// ============================================================

function log(moduleName, ...msg) {
    if (!LOG_ENABLED) return;
    console.log(
        `%c[${moduleName.toUpperCase()} ${logTimestamp()}]`,
        LOG_COLORS.default,
        ...msg
    );
}


// ============================================================
//  🏁 CONFIRMATION DE CHARGEMENT
// ============================================================

logSuccess("LOGGER.JS chargé et opérationnel");
