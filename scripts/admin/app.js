/***************************************************************
 * FICHIER : app.js
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Moteur principal du frontend
 *   - Wrapper API pour google.script.run
 *   - Gestion des notifications et erreurs
 *   - Fonctions utilitaires globales
 *
 * NOTES :
 *   - Toutes les pages utilisent apiCall() pour contacter le backend
 *   - Les erreurs sont affichées proprement dans l’UI
 ***************************************************************/


/***************************************************************
 * WRAPPER API GLOBAL
 ***************************************************************/
function apiCall(functionName, ...params) {
    return new Promise((resolve, reject) => {

        showLoader();

        google.script.run
            .withSuccessHandler((response) => {
                hideLoader();

                if (!response || response.success !== true) {
                    showError(response?.error || "Erreur inconnue");
                    reject(response);
                    return;
                }

                resolve(response.data);
            })
            .withFailureHandler((err) => {
                hideLoader();
                showError("Erreur API : " + err.message);
                reject(err);
            })[functionName](...params);
    });
}


/***************************************************************
 * NOTIFICATIONS
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

    setTimeout(() => {
        toast.classList.add("visible");
    }, 10);

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


/***************************************************************
 * LOADER GLOBAL (utilisé aussi par navigation.js)
 ***************************************************************/
function showLoader() {
    document.getElementById("loader").classList.remove("hidden");
}

function hideLoader() {
    document.getElementById("loader").classList.add("hidden");
}