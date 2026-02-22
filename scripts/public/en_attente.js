/* ============================================================
   SCRIPT : scripts/public/en_attente.js
   MODULE : Public
   DESCRIPTION :
      - Gère la page d'attente de validation
      - Script associé à : pages/public/en_attente.html
   ============================================================ */

console.log("🟦 [en_attente] Page en attente chargée.");

document.getElementById("btn-retour-accueil")?.addEventListener("click", () => {
    spa.loadPage("public/accueil");
});