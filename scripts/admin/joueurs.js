/* ============================================================
   joueurs.js — Gestion des joueurs
   Chargé automatiquement par spa.js quand page_joueurs.html est affichée
   ============================================================ */

console.log("🟦 [joueurs] Module joueurs chargé.");

async function initJoueurs() {
  console.log("🟦 [joueurs] Initialisation…");

  try {
    const joueurs = await api("joueurs_getAll");
    console.log("🟦 [joueurs] Données reçues :", joueurs);

    const container = document.getElementById("joueurs-container");
    if (!container) {
      console.error("❌ [joueurs] Élément #joueurs-container introuvable.");
      return;
    }

    container.innerHTML = joueurs.map(j =>
      `<div class="card">
         <h3>${j.nom}</h3>
         <p>ID : ${j.id}</p>
         <p>Entreprise : ${j.entreprise || "Aucune"}</p>
       </div>`
    ).join("");

  } catch (err) {
    console.error("❌ [joueurs] Erreur :", err);
  }
}

document.addEventListener("DOMContentLoaded", initJoueurs);