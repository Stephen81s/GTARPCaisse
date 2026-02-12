/* ============================================================
   ADMIN.JS — Gestion complète de la BDD PocketBase
   CRUD : Articles + Employés
   Auteur : Stephen
   Version : PocketBase Edition
============================================================ */

// ============================================================
//  INITIALISATION POCKETBASE
// ============================================================

const pb = new PocketBase("https://pocketbase-server-t8sv.onrender.com");
console.log("[ADMIN] Connexion PocketBase :", pb.baseUrl);

// ============================================================
//  CHARGEMENT INITIAL
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    chargerArticles();
    chargerEmployes();
});

// ============================================================
//  ARTICLES — CRUD COMPLET
// ============================================================

// Charger la liste des articles
async function chargerArticles() {
    console.log("[ADMIN] Chargement des articles…");

    const table = document.querySelector("#tableArticles tbody");
    table.innerHTML = "";

    try {
        const articles = await pb.collection("Articles").getFullList();

        articles.forEach(a => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${a.Nom}</td>
                <td>${a.Prix} €</td>
                <td>
                    <button class="btn-edit" onclick="modifierArticle('${a.id}', '${a.Nom}', ${a.Prix})">Modifier</button>
                    <button class="btn-del" onclick="supprimerArticle('${a.id}')">Supprimer</button>
                </td>
            `;

            table.appendChild(tr);
        });

        console.log("[ADMIN] Articles chargés :", articles.length);

    } catch (err) {
        console.error("[ADMIN] Erreur chargement articles :", err);
    }
}

// Ouvrir un formulaire d'ajout d'article
function ouvrirFormArticle() {
    const nom = prompt("Nom de l'article :");
    if (!nom) return;

    const prix = Number(prompt("Prix :"));
    if (isNaN(prix)) return alert("Prix invalide");

    ajouterArticle(nom, prix);
}

// Ajouter un article
async function ajouterArticle(nom, prix) {
    try {
        await pb.collection("Articles").create({ Nom: nom, Prix: prix });
        console.log("[ADMIN] Article ajouté :", nom, prix);
        chargerArticles();
    } catch (err) {
        console.error("[ADMIN] Erreur ajout article :", err);
    }
}

// Modifier un article
function modifierArticle(id, nomActuel, prixActuel) {
    const nom = prompt("Nouveau nom :", nomActuel);
    if (!nom) return;

    const prix = Number(prompt("Nouveau prix :", prixActuel));
    if (isNaN(prix)) return alert("Prix invalide");

    updateArticle(id, nom, prix);
}

async function updateArticle(id, nom, prix) {
    try {
        await pb.collection("Articles").update(id, { Nom: nom, Prix: prix });
        console.log("[ADMIN] Article modifié :", id);
        chargerArticles();
    } catch (err) {
        console.error("[ADMIN] Erreur modification article :", err);
    }
}

// Supprimer un article
async function supprimerArticle(id) {
    if (!confirm("Supprimer cet article ?")) return;

    try {
        await pb.collection("Articles").delete(id);
        console.log("[ADMIN] Article supprimé :", id);
        chargerArticles();
    } catch (err) {
        console.error("[ADMIN] Erreur suppression article :", err);
    }
}

// ============================================================
//  EMPLOYÉS — CRUD COMPLET
// ============================================================

// Charger la liste des employés
async function chargerEmployes() {
    console.log("[ADMIN] Chargement des employés…");

    const table = document.querySelector("#tableEmployes tbody");
    table.innerHTML = "";

    try {
        const employes = await pb.collection("Employes").getFullList();

        employes.forEach(e => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${e.Nom}</td>
                <td>
                    <button class="btn-edit" onclick="modifierEmploye('${e.id}', '${e.Nom}')">Modifier</button>
                    <button class="btn-del" onclick="supprimerEmploye('${e.id}')">Supprimer</button>
                </td>
            `;

            table.appendChild(tr);
        });

        console.log("[ADMIN] Employés chargés :", employes.length);

    } catch (err) {
        console.error("[ADMIN] Erreur chargement employés :", err);
    }
}

// Ouvrir un formulaire d'ajout d'employé
function ouvrirFormEmploye() {
    const nom = prompt("Nom de l'employé :");
    if (!nom) return;

    ajouterEmploye(nom);
}

// Ajouter un employé
async function ajouterEmploye(nom) {
    try {
        await pb.collection("Employes").create({ Nom: nom });
        console.log("[ADMIN] Employé ajouté :", nom);
        chargerEmployes();
    } catch (err) {
        console.error("[ADMIN] Erreur ajout employé :", err);
    }
}

// Modifier un employé
function modifierEmploye(id, nomActuel) {
    const nom = prompt("Nouveau nom :", nomActuel);
    if (!nom) return;

    updateEmploye(id, nom);
}

async function updateEmploye(id, nom) {
    try {
        await pb.collection("Employes").update(id, { Nom: nom });
        console.log("[ADMIN] Employé modifié :", id);
        chargerEmployes();
    } catch (err) {
        console.error("[ADMIN] Erreur modification employé :", err);
    }
}

// Supprimer un employé
async function supprimerEmploye(id) {
    if (!confirm("Supprimer cet employé ?")) return;

    try {
        await pb.collection("Employes").delete(id);
        console.log("[ADMIN] Employé supprimé :", id);
        chargerEmployes();
    } catch (err) {
        console.error("[ADMIN] Erreur suppression employé :", err);
    }
}
