/***************************************************************
 * FICHIER : scripts/entreprise/historique.js
 * ARCHITECTURE : RP MANAGER — PRO 2026
 * MODULE : Historique entreprise
 * DESCRIPTION :
 *   - Chargement des logs
 *   - Filtres (type, date, utilisateur)
 *   - Affichage dynamique
 * AUTEUR : Stephen
 ***************************************************************/

let currentEntrepriseId = null;

/***************************************************************
 * INITIALISATION
 ***************************************************************/
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    currentEntrepriseId = params.get("id");

    if (!currentEntrepriseId) {
        alert("Aucune entreprise sélectionnée.");
        return;
    }

    loadHistorique();
});

/***************************************************************
 * CHARGEMENT HISTORIQUE
 ***************************************************************/
function loadHistorique() {
    const type = document.getElementById("filter-type").value;
    const date = document.getElementById("filter-date").value;
    const user = document.getElementById("filter-user").value;

    google.script.run
        .withSuccessHandler(rows => {
            const tbody = document.getElementById("historique-body");
            tbody.innerHTML = "";

            rows.forEach(r => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${r.date}</td>
                    <td>${r.type}</td>
                    <td>${r.action}</td>
                    <td>${r.user}</td>
                    <td>${r.details}</td>
                `;

                tbody.appendChild(tr);
            });
        })
        .withFailureHandler(err => console.error(err))
        .getEntrepriseHistorique(currentEntrepriseId, type, date, user);
}
