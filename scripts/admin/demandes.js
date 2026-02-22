/* ============================================================
   SCRIPT : scripts/admin/demandes.js
   MODULE : Admin
   DESCRIPTION :
      - Gère l'affichage et la validation des demandes d'accès
      - Script associé à : pages/admin/demandes.html
   ============================================================ */

console.log("🟦 [admin/demandes] Module demandes chargé.");

const tbody = document.getElementById("demandes-list");

// Chargement des demandes depuis le backend
(async function chargerDemandes() {
    const demandes = await api.getDemandesAcces(); // À implémenter dans api.js

    if (!demandes || demandes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center;">Aucune demande en attente.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = "";

    demandes.forEach(demande => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${demande.email}</td>
            <td>${demande.date}</td>
            <td>
                <button class="btn-success" data-validate="${demande.email}">Valider</button>
                <button class="btn-danger" data-refuse="${demande.email}">Refuser</button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    // Gestion des boutons
    document.querySelectorAll("[data-validate]").forEach(btn => {
        btn.addEventListener("click", async () => {
            const email = btn.getAttribute("data-validate");
            await api.validerDemande(email); // À implémenter
            chargerDemandes(); // Refresh
        });
    });

    document.querySelectorAll("[data-refuse]").forEach(btn => {
        btn.addEventListener("click", async () => {
            const email = btn.getAttribute("data-refuse");
            await api.refuserDemande(email); // À implémenter
            chargerDemandes(); // Refresh
        });
    });
})();