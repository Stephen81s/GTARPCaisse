/* ============================================================
   SCRIPT : scripts/public/login.js
   MODULE : Public
   DESCRIPTION :
      - Gère la demande d'accès
      - Script associé à : pages/public/login.html
   ============================================================ */

console.log("🟦 [login] Page login chargée.");

document.getElementById("btn-login-submit")?.addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();

    if (!email) {
        alert("Veuillez entrer un email.");
        return;
    }

    // Appel backend (à implémenter dans api.js)
    const result = await api.demandeAcces(email);

    if (result.status === "pending") {
        spa.loadPage("public/en_attente");
    } else if (result.status === "allowed") {
        spa.loadPage("admin/panel");
    } else {
        alert("Erreur : " + result.message);
    }
});