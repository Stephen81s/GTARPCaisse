/***************************************************************
 * FICHIER : scripts/public/login.js
 * ARCHITECTURE : RP MANAGER — PRO 2026
 * MODULE : Authentification RP
 * DESCRIPTION :
 *    - Envoi des infos au backend
 *    - Auto-admin si premier utilisateur
 *    - Gestion des demandes en attente
 *    - Redirection vers page d'accueil
 * AUTEUR : Stephen
 ***************************************************************/

async function login() {
    const nom = document.getElementById("nomRP").value.trim();
    const prenom = document.getElementById("prenomRP").value.trim();

    log("[login] Tentative de connexion RP…");

    if (!nom || !prenom) {
        showError("Merci de remplir les deux champs.");
        logWarn("[login] Champs manquants.");
        return;
    }

    try {
        const data = await apiCall("api_loginRP", nom, prenom);

        log("[login] Réponse backend : " + JSON.stringify(data));

        // --- CAS 1 : AUTO ADMIN (premier utilisateur) ---
        if (data.status === "AUTO_ADMIN") {
            showSuccess("Bienvenue Administrateur Principal !");
            updateMenu("ADMIN");
            spa.loadPage("public/home");
            return;
        }

        // --- CAS 2 : UTILISATEUR EXISTANT ---
        if (data.status === "OK") {
            showSuccess("Connexion réussie !");
            updateMenu(data.role);
            spa.loadPage("public/home");
            return;
        }

        // --- CAS 3 : DEMANDE EN ATTENTE ---
        if (data.status === "PENDING") {
            showSuccess("Votre demande est en attente d'un administrateur.");
            updateMenu("NONE");
            spa.loadPage("public/home");
            return;
        }

    } catch (err) {
        logError("[login] Erreur API : " + err);
        showError("Erreur de connexion.");
    }
}