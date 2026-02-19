/* ============================================================
   employes.js — Gestion des employés
   ============================================================ */

console.log("🟦 [employes] Module employés chargé.");

async function initEmployes() {
  console.log("🟦 [employes] Initialisation…");

  try {
    const employes = await api("employes_getAll");
    console.log("🟦 [employes] Données reçues :", employes);

    const container = document.getElementById("employes-container");
    if (!container) {
      console.error("❌ [employes] Élément #employes-container introuvable.");
      return;
    }

    container.innerHTML = employes.map(emp =>
      `<div class="card">
         <h3>${emp.nom}</h3>
         <p>ID : ${emp.id}</p>
         <p>Entreprise : ${emp.entreprise}</p>
         <p>Grade : ${emp.grade}</p>
       </div>`
    ).join("");

  } catch (err) {
    console.error("❌ [employes] Erreur :", err);
  }
}

document.addEventListener("DOMContentLoaded", initEmployes);