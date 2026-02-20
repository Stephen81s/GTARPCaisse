/***************************************************************
 * FICHIER : scripts/entreprise/entreprise.js
 * ARCHITECTURE : RP MANAGER — PRO 2026
 * MODULE : Dashboard entreprise
 * DESCRIPTION :
 *   - Informations générales
 *   - Statistiques
 *   - Activités récentes
 *   - Liens rapides
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

    updateLinks();
    loadEntrepriseInfo();
    loadStats();
    loadRecentLogs();
});

/***************************************************************
 * MISE À JOUR DES LIENS
 ***************************************************************/
function updateLinks() {
    const links = [
        "link-banque",
        "link-employes",
        "link-permissions",
        "link-stock",
        "link-crafts",
        "link-articles",
        "link-historique"
    ];

    links.forEach(id => {
        const el = document.getElementById(id);
        el.href = el.href + currentEntrepriseId;
    });
}

/***************************************************************
 * INFORMATIONS ENTREPRISE
 ***************************************************************/
function loadEntrepriseInfo() {
    google.script.run
        .withSuccessHandler(data => {
            document.getElementById("ent-nom").textContent = data.nom;
            document.getElementById("ent-type").textContent = data.type;
        })
        .withFailureHandler(err => console.error(err))
        .getEntrepriseInfo(currentEntrepriseId);
}

/***************************************************************
 * STATISTIQUES
 ***************************************************************/
function loadStats() {
    google.script.run
        .withSuccessHandler(stats => {
            document.getElementById("stat-solde").textContent = stats.solde + " $";
            document.getElementById("stat-employes").textContent = stats.employes;
            document.getElementById("stat-stock").textContent = stats.stock;
            document.getElementById("stat-crafts").textContent = stats.crafts;
        })
        .withFailureHandler(err => console.error(err))
        .getEntrepriseStats(currentEntrepriseId);
}

/***************************************************************
 * ACTIVITÉS RÉCENTES
 ***************************************************************/
function loadRecentLogs() {
    google.script.run
        .withSuccessHandler(rows => {
            const tbody = document.getElementById("recent-logs");
            tbody.innerHTML = "";

            rows.forEach(r => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${r.date}</td>
                    <td>${r.type}</td>
                    <td>${r.action}</td>
                    <td>${r.user}</td>
                `;

                tbody.appendChild(tr);
            });
        })
        .withFailureHandler(err => console.error(err))
        .getEntrepriseRecentLogs(currentEntrepriseId);
}