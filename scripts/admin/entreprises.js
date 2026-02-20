/* ============================================================
   entreprises.js — Gestion des entreprises
   ============================================================ */

console.log("🟦 [entreprises] Module entreprises chargé.");

async function initEntreprises() {
  console.log("🟦 [entreprises] Initialisation…");

  try {
    const entreprises = await api("entreprises_getAll");
    console.log("🟦 [entreprises] Données reçues :", entreprises);

    const container = document.getElementById("entreprises-container");
    if (!container) {
      console.error("❌ [entreprises] Élément #entreprises-container introuvable.");
      return;
    }

    container.innerHTML = entreprises.map(e =>
      `<div class="card">
         <h3>${e.nom}</h3>
         <p>ID : ${e.id}</p>
         <p>Type : ${e.type}</p>
       </div>`
    ).join("");

  } catch (err) {
    console.error("❌ [entreprises] Erreur :", err);
  }
}

document.addEventListener("DOMContentLoaded", initEntreprises);