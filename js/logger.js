// ============================================================
//  LOGGER.JS — Logger simple et propre
// ============================================================

function logInfo(msg) {
    console.log(`%c[INFO] ${msg}`, "color:#58a6ff;");
}

function logSuccess(msg) {
    console.log(`%c[SUCCESS] ${msg}`, "color:#2ea043;");
}

function logError(msg) {
    console.log(`%c[ERROR] ${msg}`, "color:#da3633;");
}
