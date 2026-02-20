/***************************************************************
 * FICHIER : scripts/entreprise/banque.js
 * ARCHITECTURE : RP MANAGER — PRO 2026
 * MODULE : Banque entreprise
 * DESCRIPTION :
 *   - Solde
 *   - Dépôts / Retraits / Transferts
 *   - Historique
 *   - Graphique
 * AUTEUR : Stephen
 ***************************************************************/

let currentEntrepriseId = null;
let currentOperationType = null;

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

    loadSolde();
    loadHistorique();
    initChart();
});

/***************************************************************
 * SOLDE
 ***************************************************************/
function loadSolde() {
    google.script.run
        .withSuccessHandler(solde => {
            document.getElementById("solde-amount").textContent = solde + " $";
        })
        .withFailureHandler(err => console.error(err))
        .getEntrepriseSolde(currentEntrepriseId);
}

/***************************************************************
 * MODAL OPÉRATION
 ***************************************************************/
function openOperationModal(type) {
    currentOperationType = type;

    document.getElementById("modal-title").textContent =
        type === "deposit" ? "Dépôt"
        : type === "withdraw" ? "Retrait"
        : "Transfert interne";

    document.getElementById("transfer-target-container").classList.toggle(
        "hidden",
        type !== "transfer"
    );

    document.getElementById("operation-modal").classList.remove("hidden");
}

function closeOperationModal() {
    document.getElementById("operation-modal").classList.add("hidden");
    document.getElementById("operation-amount").value = "";
    document.getElementById("transfer-target").value = "";
}

/***************************************************************
 * CONFIRMATION OPÉRATION
 ***************************************************************/
function confirmOperation() {
    const amount = Number(document.getElementById("operation-amount").value);
    const target = document.getElementById("transfer-target").value;

    if (!amount || amount <= 0) {
        alert("Montant invalide.");
        return;
    }

    google.script.run
        .withSuccessHandler(() => {
            closeOperationModal();
            loadSolde();
            loadHistorique();
        })
        .withFailureHandler(err => alert(err))
        .executeBanqueOperation(currentEntrepriseId, currentOperationType, amount, target);
}

/***************************************************************
 * HISTORIQUE
 ***************************************************************/
function loadHistorique() {
    const type = document.getElementById("filter-type").value;
    const date = document.getElementById("filter-date").value;

    google.script.run
        .withSuccessHandler(rows => {
            const tbody = document.getElementById("historique-body");
            tbody.innerHTML = "";

            rows.forEach(r => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${r.date}</td>
                    <td>${r.type}</td>
                    <td>${r.montant} $</td>
                    <td>${r.user}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .withFailureHandler(err => console.error(err))
        .getBanqueHistorique(currentEntrepriseId, type, date);
}

/***************************************************************
 * GRAPHIQUE
 ***************************************************************/
let banqueChart = null;

function initChart() {
    const ctx = document.getElementById("banqueChart");

    banqueChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "Montants",
                data: [],
                borderColor: "#4CAF50",
                borderWidth: 2,
                fill: false
            }]
        }
    });

    loadChartData();
}

function loadChartData() {
    google.script.run
        .withSuccessHandler(data => {
            banqueChart.data.labels = data.labels;
            banqueChart.data.datasets[0].data = data.values;
            banqueChart.update();
        })
        .withFailureHandler(err => console.error(err))
        .getBanqueGraphData(currentEntrepriseId);
}