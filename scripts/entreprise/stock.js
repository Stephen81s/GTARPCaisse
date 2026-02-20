/***************************************************************
 * FICHIER : scripts/entreprise/stock.js
 * ARCHITECTURE : RP MANAGER — PRO 2026
 * MODULE : Gestion du stock
 * DESCRIPTION :
 *   - Liste du stock
 *   - Entrées / sorties
 *   - Ajustements
 * AUTEUR : Stephen
 ***************************************************************/

let currentEntrepriseId = null;
let editingStockId = null;

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

    loadArticles();
    loadStock();
});

/***************************************************************
 * CHARGEMENT DES ARTICLES (pour le select)
 ***************************************************************/
function loadArticles() {
    google.script.run
        .withSuccessHandler(data => {
            const select = document.getElementById("stock-article");
            select.innerHTML = "";

            data.forEach(a => {
                const opt = document.createElement("option");
                opt.value = a.id;
                opt.textContent = a.nom;
                select.appendChild(opt);
            });
        })
        .withFailureHandler(err => console.error(err))
        .getEntrepriseArticles(currentEntrepriseId);
}

/***************************************************************
 * CHARGEMENT DU STOCK
 ***************************************************************/
function loadStock() {
    google.script.run
        .withSuccessHandler(data => {
            const tbody = document.querySelector("#table-stock tbody");
            tbody.innerHTML = "";

            data.forEach(s => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${s.id}</td>
                    <td>${s.article_nom}</td>
                    <td>${s.quantite}</td>
                    <td>${s.updated_at}</td>
                    <td>
                        <button onclick="editStock('${s.id}')">Modifier</button>
                        <button onclick="deleteStock('${s.id}')">Supprimer</button>
                    </td>
                `;

                tbody.appendChild(tr);
            });
        })
        .withFailureHandler(err => console.error(err))
        .getEntrepriseStock(currentEntrepriseId);
}

/***************************************************************
 * MODAL
 ***************************************************************/
function openStockModal() {
    editingStockId = null;

    document.getElementById("stock-modal-title").textContent = "Entrée de stock";
    document.getElementById("stock-article").value = "";
    document.getElementById("stock-quantite").value = "";

    document.getElementById("stock-modal").classList.remove("hidden");
}

function closeStockModal() {
    document.getElementById("stock-modal").classList.add("hidden");
}

/***************************************************************
 * EDITION
 ***************************************************************/
function editStock(id) {
    google.script.run
        .withSuccessHandler(s => {
            editingStockId = id;

            document.getElementById("stock-modal-title").textContent = "Modifier stock";
            document.getElementById("stock-article").value = s.article_id;
            document.getElementById("stock-quantite").value = s.quantite;

            document.getElementById("stock-modal").classList.remove("hidden");
        })
        .withFailureHandler(err => console.error(err))
        .getStockById(id);
}

/***************************************************************
 * SAUVEGARDE
 ***************************************************************/
function saveStock() {
    const article_id = document.getElementById("stock-article").value;
    const quantite = Number(document.getElementById("stock-quantite").value);

    if (!article_id || !quantite) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    if (editingStockId) {
        google.script.run
            .withSuccessHandler(() => {
                closeStockModal();
                loadStock();
            })
            .withFailureHandler(err => console.error(err))
            .updateStock(editingStockId, article_id, quantite);
    } else {
        google.script.run
            .withSuccessHandler(() => {
                closeStockModal();
                loadStock();
            })
            .withFailureHandler(err => console.error(err))
            .createStock(currentEntrepriseId, article_id, quantite);
    }
}

/***************************************************************
 * SUPPRESSION
 ***************************************************************/
function deleteStock(id) {
    if (!confirm("Supprimer cette entrée de stock ?")) return;

    google.script.run
        .withSuccessHandler(() => loadStock())
        .withFailureHandler(err => console.error(err))
        .deleteStock(id);
}