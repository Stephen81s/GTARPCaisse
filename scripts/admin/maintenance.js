/* ============================================================
   maintenance.js — Outils de maintenance
   ============================================================ */

console.log("🟦 [maintenance] Module maintenance chargé.");

async function initMaintenance() {
  console.log("🟦 [maintenance] Initialisation…");

  const log = msg => {
    const box = document.getElementById("maintenance-log");
    if (box) box.innerHTML += `<div>${msg}</div>`;
  };

  document.getElementById("btn-refresh-types")?.addEventListener("click", async () => {
    log("Mise à jour des types…");
    try {
      const res = await api("populateTypes");
      log("✔️ Types mis à jour.");
      console.log("🟦 [maintenance] Résultat :", res);
    } catch (err) {
      log("❌ Erreur lors de la mise à jour.");
      console.error(err);
    }
  });
}

document.addEventListener("DOMContentLoaded", initMaintenance);