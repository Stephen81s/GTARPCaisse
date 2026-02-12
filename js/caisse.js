// ============================================================
//  CAISSE.JS — MODULE CAISSE (SUPABASE)
//  Auteur : Stephen
//  Version : 1.0
//  Description :
//    - Gestion de la caisse RP
//    - Chargement des articles
//    - Panier local
//    - Calcul total
//    - Enregistrement en base (table compta)
// ============================================================


// ============================================================
//  🛒 PANIER LOCAL
// ============================================================

let panier = [];


// ============================================================
//  🔧 INITIALISATION DE L’INTERFACE CAISSE
// ============================================================

function initCaisse() {
    log("caisse", "Initialisation de l’interface…");

    const liste = document.getElementById("caisseArticles");
    const total = document.getElementById("caisseTotal");
    const btnValider = document.getElementById("caisseValider");

    if (!liste || !total || !btnValider) {
        logError("caisse", "Éléments HTML manquants");
        return;
    }

    panier = [];
    majTotal();

    chargerArticles();
}


// ============================================================
//  📦 CHARGEMENT DES ARTICLES DEPUIS SUPABASE
// ============================================================

async function chargerArticles() {
    log("caisse", "Chargement des articles…");

    const select = document.getElementById("caisseArticles");
    if (!select) return;

    try {
        const articles = await api("articles", "list");

        select.innerHTML = "";

        articles.forEach(a => {
            const opt = document.createElement("option");
            opt.value = a.id;
            opt.textContent = `${a.nom} — ${a.prix} $`;
            opt.dataset.prix = a.prix;
            select.appendChild(opt);
        });

        logSuccess("caisse", "Articles chargés");

    } catch (err) {
        logError("caisse", "Erreur chargement articles", err);
    }
}


// ============================================================
//  ➕ AJOUTER UN ARTICLE AU PANIER
// ============================================================

function ajouterArticle() {
    const select = document.getElementById("caisseArticles");
    if (!select) return;

    const id = select.value;
    const nom = select.options[select.selectedIndex].textContent.split(" — ")[0];
    const prix = Number(select.options[select.selectedIndex].dataset.prix);

    panier.push({ id, nom, prix });

    log("caisse", "Article ajouté :", nom, prix);

    afficherPanier();
    majTotal();
}


// ============================================================
//  🧾 AFFICHAGE DU PANIER
// ============================================================

function afficherPanier() {
    const zone = document.getElementById("caissePanier");
    if (!zone) return;

    zone.innerHTML = "";

    panier.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "panier-item";
        div.innerHTML = `
            <span>${item.nom} — ${item.prix} $</span>
            <button onclick="supprimerArticle(${index})">❌</button>
        `;
        zone.appendChild(div);
    });
}


// ============================================================
//  ❌ SUPPRIMER UN ARTICLE DU PANIER
// ============================================================

function supprimerArticle(index) {
    panier.splice(index, 1);
    afficherPanier();
    majTotal();
}


// ============================================================
//  💰 CALCUL DU TOTAL
// ============================================================

function majTotal() {
    const total = panier.reduce((sum, item) => sum + item.prix, 0);
    const zone = document.getElementById("caisseTotal");

    if (zone) zone.textContent = total + " $";

    return total;
}


// ============================================================
//  🧾 VALIDATION / ENREGISTREMENT EN BASE
// ============================================================

async function validerCaisse() {
    log("caisse", "Validation de la caisse…");

    if (panier.length === 0) {
        alert("Le panier est vide.");
        return;
    }

    const total = majTotal();

    try {
        const data = await api("caisse", "create", {
            date: new Date().toISOString(),
            montant: total,
            details: JSON.stringify(panier)
        });

        logSuccess("caisse", "Caisse enregistrée :", data);

        alert("Caisse validée !");
        panier = [];
        afficherPanier();
        majTotal();

    } catch (err) {
        logError("caisse", "Erreur validation caisse", err);
        alert("Erreur lors de la validation.");
    }
}


// ============================================================
//  🏁 Confirmation de chargement
// ============================================================

logSuccess("CAISSE.JS chargé et opérationnel");
