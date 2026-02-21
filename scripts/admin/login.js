/***************************************************************
 * FICHIER : scripts/admin/login.js
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Connexion RP via API REST Apps Script
 *   - Envoi nomRP + prenomRP au backend
 *   - Cas 1 : Première connexion → auto-admin
 *   - Cas 2 : Demande en attente admin
 *   - Stockage userId + jeton dans localStorage
 *   - Redirection SPA vers "core"
 ***************************************************************/

console.log("🟦 [login] Script login chargé.");

/***************************************************************
 * ÉVÉNEMENT : Clic sur "Connexion"
 ***************************************************************/
async function login() {
    console.log("🟦 [login] Tentative de connexion…");

    const nomRP = document.getElementById("nom").value.trim();
    const prenomRP = document.getElementById("prenom").value.trim();

    if (!nomRP || !prenomRP) {
        console.warn("⚠️ [login] Champs manquants.");
        alert("Merci de remplir Nom RP et Prénom RP.");
        return;
    }

    console.log(`🟦 [login] Envoi demande → ${nomRP} ${prenomRP}`);

    const payload = {
        action: "login",
        nom: nomRP,
        prenom: prenomRP,
        source: "web"
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error("❌ [login] HTTP error :", res.status, res.statusText);
            alert("Erreur serveur (HTTP).");
            return;
        }

        const data = await res.json();
        handleLoginResponse(data);

    } catch (err) {
        console.error("❌ [login] Erreur API :", err);
        alert("Erreur serveur (réseau).");
    }
}

/***************************************************************
 * TRAITEMENT DE LA RÉPONSE BACKEND
 ***************************************************************/
function handleLoginResponse(res) {
    console.log("🟦 [login] Réponse backend :", res);

    if (!res || !res.success) {
        alert("Erreur : " + (res && res.error ? res.error : "Réponse invalide."));
        return;
    }

    const data = res.data || {};

    /***********************************************************
     * CAS 1 : Première connexion → auto-admin
     ***********************************************************/
    if (data.autoAdmin === true) {
        console.log("🟩 [login] Première connexion → auto-admin");

        localStorage.setItem("userId", data.userId);
        localStorage.setItem("jeton", data.jeton);
        localStorage.setItem("role", "admin");

        spa.loadPage("core");
        return;
    }

    /***********************************************************
     * CAS 2 : Demande en attente admin
     ***********************************************************/
    console.log("🟧 [login] Demande en attente admin");

    const statusEl = document.getElementById("loginStatus");
    if (statusEl) {
        statusEl.innerHTML =
            "<span style='color: orange;'>Votre demande est en attente de validation par un administrateur.</span>";
    } else {
        alert("Votre demande est en attente de validation par un administrateur.");
    }
}

/***************************************************************
 * AUTO-LOGIN SI SESSION EXISTE
 ***************************************************************/
window.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");
    const jeton = localStorage.getItem("jeton");

    if (!userId || !jeton) return;

    console.log("🟦 [login] Session locale détectée → vérification backend…");

    const payload = {
        action: "checkSession",
        userId,
        jeton
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error("❌ [login] HTTP error checkSession :", res.status, res.statusText);
            return;
        }

        const data = await res.json();
        console.log("🟦 [login] Réponse checkSession :", data);

        if (data.success && data.data && data.data.valid === true) {
            console.log("🟩 [login] Session valide → redirection core");
            spa.loadPage("core");
        } else {
            console.warn("🟥 [login] Session invalide → nettoyage");
            localStorage.clear();
        }

    } catch (err) {
        console.error("❌ [login] Erreur checkSession :", err);
    }
});