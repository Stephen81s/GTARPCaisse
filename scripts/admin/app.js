/***************************************************************
 * FICHIER : app.js (PRO 2026 — Version Avancée)
 * AUTEUR : Stephen + Copilot PRO
 *
 * DESCRIPTION :
 *   - Moteur principal du frontend
 *   - API unifiée (backend + local)
 *   - Gestion centralisée des erreurs
 *   - Logger PRO 2026
 *   - Notifications globales
 *   - Loader global
 *   - Mode DEBUG activable
 ***************************************************************/


/***************************************************************
 * CONFIGURATION GLOBALE
 ***************************************************************/
const APP = {
    debug: true,   // Passe à false en production
    version: "PRO 2026",
    logs: []
};


/***************************************************************
 * LOGGER PRO 2026
 ***************************************************************/
function log(message, type = "info") {
    const timestamp = new Date().toISOString();
    const entry = { timestamp, type, message };

    APP.logs.push(entry);

    if (APP.debug) {
        const color = type === "error" ? "color:red" :
                      type === "warn"  ? "color:orange" :
                                         "color:#4da3ff";
        console.log(`%c[LOG ${type.toUpperCase()}] ${message}`, color);
    }
}

function logError(message) {
    log(message, "error");
}

function logWarn(message) {
    log(message, "warn");
}


/***************************************************************
 * API UNIFIÉE (Google Apps Script)
 ***************************************************************/
function apiCall(functionName, ...params) {
    log(`API → Appel : ${functionName}(${params.join(", ")})`);

    return new Promise((resolve, reject) => {

        showLoader();

        google.script.run
            .withSuccessHandler((response) => {
                hideLoader();

                if (!response || response.success !== true) {
                    const err = response?.error || "Erreur inconnue";
                    logError(`API → Erreur : ${err}`);
                    showError(err);
                    reject(err);
                    return;
                }

                log(`API → Succès : ${functionName}`);
                resolve(response.data);
            })
            .withFailureHandler((err) => {
                hideLoader();
                logError(`API → Exception : ${err.message}`);
                showError("Erreur API : " + err.message);
                reject(err);
            })[functionName](...params);
    });
}


/***************************************************************
 * NOTIFICATIONS PRO 2026
 ***************************************************************/
function showSuccess(message) {
    showToast(message, "success");
}

function showError(message) {
    showToast(message, "error");
}

function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("visible"), 10);

    setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


/***************************************************************
 * FORMATTAGE / UTILITAIRES
 ***************************************************************/
function formatPrice(value) {
    return Number(value).toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " $";
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString("fr-FR");
}

function uuid() {
    return crypto.randomUUID();
}


/***************************************************************
 * LOADER GLOBAL
 ***************************************************************/
function showLoader() {
    document.getElementById("loader").classList.remove("hidden");
}

function hideLoader() {
    document.getElementById("loader").classList.add("hidden");
}


/***************************************************************
 * ERREURS GLOBALES (PRO 2026)
 ***************************************************************/
window.addEventListener("error", (event) => {
    logError(`Erreur JS : ${event.message}`);
    showError("Une erreur interne est survenue.");
});

window.addEventListener("unhandledrejection", (event) => {
    logError(`Promise rejetée : ${event.reason}`);
    showError("Une erreur interne est survenue.");
});


/***************************************************************
 * INITIALISATION GLOBALE — DÉMARRAGE OFFICIEL DU SPA
 ***************************************************************/
window.addEventListener("DOMContentLoaded", () => {
    log("Application PRO 2026 initialisée.");

    // 🚀 DÉMARRAGE OFFICIEL DU SPA
    spa.loadPage("login");
});