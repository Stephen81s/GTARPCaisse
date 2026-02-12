// ============================================================
// LOGGER.JS — Système de logs propre et lisible
// ============================================================

function log(module, message) {
    console.log(`%c[${module.toUpperCase()}] ${message}`, "color:#9E9E9E;");
}

function logSuccess(module, message) {
    console.log(`%c[SUCCESS] [${module}] ${message}`, "color:#4CAF50;font-weight:bold;");
}

function logWarn(module, message) {
    console.warn(`%c[WARN] [${module}] ${message}`, "color:#FFC107;font-weight:bold;");
}

function logError(module, message) {
    console.error(`%c[ERROR] [${module}] ${message}`, "color:#F44336;font-weight:bold;");
}

logSuccess("LOGGER", "LOGGER.JS chargé et opérationnel");
