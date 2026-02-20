/***************************************************************
 * FICHIER : scripts/entreprise/crafts.js
 * ARCHITECTURE : RP MANAGER — PRO 2026
 * MODULE : Recettes / Crafts
 * DESCRIPTION :
 *   - Liste des recettes
 *   - Création / édition / suppression
 *   - Gestion des ingrédients
 * AUTEUR : Stephen
 ***************************************************************/

let currentEntrepriseId = null;
let editingCraftId = null;

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
    loadCrafts();
});

/***************************************************************
 * CHARGEMENT DES ARTICLES (pour produit final + ingrédients)
 ***************************************************************/
let articlesCache = [];

function loadArticles() {
    google.script.run
        .withSuccessHandler(data => {
            articlesCache = data;

            const select = document.getElementById("craft-produit");
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
 * CHARGEMENT DES RECETTES
 ***************************************************************/
function loadCrafts() {
    google.script.run
        .withSuccessHandler(data => {
            const tbody = document.querySelector("#table-crafts tbody");
            tbody.innerHTML = "";

            data.forEach(c => {
                const tr = document.createElement("tr");

                const ingredientsText = c.ingredients
                    .map(i => `${i.nom} (${i.quantite})`)
                    .join(", ");

                tr.innerHTML = `
                    <td>${c.id}</td>
                    <td>${c.nom}</td>
                    <td>${c.produit_nom}</td>
                    <td>${c.quantite}</td>
                    <td>${ingredientsText}</td>
                    <td>
                        <button onclick="editCraft('${c.id}')">Modifier</button>
                        <button onclick="deleteCraft('${c.id}')">Supprimer</button>
                    </td>
                `;

                tbody.appendChild(tr);
            });
        })
        .withFailureHandler(err => console.error(err))
        .getEntrepriseCrafts(currentEntrepriseId);
}

/***************************************************************
 * MODAL
 ***************************************************************/
function openCraftModal() {
    editingCraftId = null;

    document.getElementById("craft-modal-title").textContent = "Nouvelle recette";
    document.getElementById("craft-nom").value = "";
    document.getElementById("craft-produit").value = "";
    document.getElementById("craft-quantite").value = "";

    document.getElementById("ingredients-container").innerHTML = "";
    addIngredientRow();

    document.getElementById("craft-modal").classList.remove("hidden");
}

function closeCraftModal() {
    document.getElementById("craft-modal").classList.add("hidden");
}

/***************************************************************
 * INGREDIENTS
 ***************************************************************/
function addIngredientRow(articleId = "", quantite = "") {
    const container = document.getElementById("ingredients-container");

    const row = document.createElement("div");
    row.className = "ingredient-row";

    row.innerHTML = `
        <select class="ingredient-article">
            ${articlesCache.map(a => `
                <option value="${a.id}" ${a.id === articleId ? "selected" : ""}>
                    ${a.nom}
                </option>
            `).join("")}
        </select>

        <input type="number" class="ingredient-quantite" value="${quantite}" placeholder="Quantité">

        <button class="btn-red" onclick="this.parentNode.remove()">X</button>
    `;

    container.appendChild(row);
}

/***************************************************************
 * EDITION
 ***************************************************************/
function editCraft(id) {
    google.script.run
        .withSuccessHandler(c => {
            editingCraftId = id;

            document.getElementById("craft-modal-title").textContent = "Modifier recette";
            document.getElementById("craft-nom").value = c.nom;
            document.getElementById("craft-produit").value = c.produit_id;
            document.getElementById("craft-quantite").value = c.quantite;

            const container = document.getElementById("ingredients-container");
            container.innerHTML = "";

            c.ingredients.forEach(i => {
                addIngredientRow(i.article_id, i.quantite);
            });

            document.getElementById("craft-modal").classList.remove("hidden");
        })
        .withFailureHandler(err => console.error(err))
        .getCraftById(id);
}

/***************************************************************
 * SAUVEGARDE
 ***************************************************************/
function saveCraft() {
    const nom = document.getElementById("craft-nom").value;
    const produit_id = document.getElementById("craft-produit").value;
    const quantite = Number(document.getElementById("craft-quantite").value);

    const ingredients = [...document.querySelectorAll(".ingredient-row")].map(row => ({
        article_id: row.querySelector(".ingredient-article").value,
        quantite: Number(row.querySelector(".ingredient-quantite").value)
    }));

    if (!nom || !produit_id || !quantite || ingredients.length === 0) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    if (editingCraftId) {
        google.script.run
            .withSuccessHandler(() => {
                closeCraftModal();
                loadCrafts();
            })
            .withFailureHandler(err => console.error(err))
            .updateCraft(editingCraftId, nom, produit_id, quantite, ingredients);
    } else {
        google.script.run
            .withSuccessHandler(() => {
                closeCraftModal();
                loadCrafts();
            })
            .withFailureHandler(err => console.error(err))
            .createCraft(currentEntrepriseId, nom, produit_id, quantite, ingredients);
    }
}

/***************************************************************
 * SUPPRESSION
 ***************************************************************/
function deleteCraft(id) {
    if (!confirm("Supprimer cette recette ?")) return;

    google.script.run
        .withSuccessHandler(() => loadCrafts())
        .withFailureHandler(err => console.error(err))
        .deleteCraft(id);
}