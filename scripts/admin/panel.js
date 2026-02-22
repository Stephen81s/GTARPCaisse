/* ============================================================
   SCRIPT : scripts/admin/panel.js
   MODULE : Admin
   DESCRIPTION :
      - Gère le panneau administrateur
      - Charge les sous-modules (demandes, utilisateurs, entreprises...)
      - Script associé à : pages/admin/panel.html
   ============================================================ */

console.log("🟦 [admin/panel] Panel admin chargé.");

const contentZone = document.getElementById("admin-panel-content");

// Gestion des boutons du panel
document.querySelectorAll("[data-admin-action]").forEach(btn => {
    btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-admin-action");
        chargerSousModule(action);
    });
});

// Fonction pour charger un sous-module admin
function chargerSousModule(module) {
    console.log("🟧 Chargement du module admin :", module);

    switch (module) {

        case "demandes":
            spa.loadSubModule("admin/demandes", contentZone);
            break;

        case "utilisateurs":
            spa.loadSubModule("admin/utilisateurs", contentZone);
            break;

        case "entreprises":
            spa.loadSubModule("admin/entreprises", contentZone);
            break;

        case "logs":
            spa.loadSubModule("admin/logs", contentZone);
            break;

        default:
            contentZone.innerHTML = "<p>Module inconnu.</p>";
    }
}