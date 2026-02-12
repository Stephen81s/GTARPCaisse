/* ============================================================
   FICHIER : caisse.js
   MODULE  : Gestion de la caisse GTARP
   AUTEUR  : Stephen
   VERSION : PocketBase Edition
   DESCRIPTION :
     - Connexion PocketBase
     - Chargement des données (articles, employés, clients, etc.)
     - Remplissage des listes
     - Gestion des lignes d’articles
     - Calcul des totaux
============================================================ */


/* ============================================================
   🔗 CONFIGURATION POCKETBASE
   ============================================================ */

console.log("%c[CAISSE] Initialisation du module caisse…", "color:#4CAF50;font-weight:bold;");

const pb = new PocketBase("https://pocketbase-server-t8sv.onrender.com");

console.log("%c[CAISSE] Connexion PocketBase : " + pb.baseUrl, "color:#4CAF50");


/* ============================================================
   📥 CHARGEMENT DES DONNÉES DE LA BDD
   ============================================================ */

async function chargerDonneesCaisse() {
    console.log("%c[CAISSE] Chargement des données PocketBase…", "color:#2196F3");

    try {
        const [
            typesOperation,
            employes,
            clients,
            paiements,
            articles
        ] = await Promise.all([
            pb.collection("TypeOperations").getFullList(),
            pb.collection("Employes").getFullList(),
            pb.collection("Annuaire").getFullList(),
            pb.collection("Moyens_de_paiment").getFullList(),
            pb.collection("Articles").getFullList()
        ]);

        console.log("%c[CAISSE] Données chargées avec succès", "color:#4CAF50");

        initCaisse({
            typesOperation,
            employes,
            clients,
            paiements,
            articles
        });

    } catch (err) {
        console.error("[CAISSE] ❌ Erreur lors du chargement PocketBase :", err);
    }
}

chargerDonneesCaisse();


/* ============================================================
   🚀 INITIALISATION DE LA PAGE CAISSE
   ============================================================ */

function initCaisse(data) {
    console.log("%c[CAISSE] Initialisation de la caisse…", "color:#FFC107");

    remplirTypesOperation(data.typesOperation);
    remplirEmployes(data.employes);
    remplirClients(data.clients);
    remplirPaiements(data.paiements);
    remplirArticles(data.articles);

    ajouterLigneArticle();

    console.log("%c[CAISSE] Caisse prête à l'utilisation", "color:#4CAF50;font-weight:bold;");
}


/* ============================================================
   🧩 REMPLISSAGE DES LISTES DÉROULANTES
   ============================================================ */

function remplirTypesOperation(list) {
    const sel = document.getElementById("typeOperation");
    sel.innerHTML = "";

    list.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.type_doperation;
        opt.textContent = t.type_doperation;
        sel.appendChild(opt);
    });

    console.log("[CAISSE] Types d'opérations chargés :", list.length);
}

function remplirEmployes(list) {
    const sel = document.getElementById("employe");
    sel.innerHTML = "";

    list.forEach(e => {
        const opt = document.createElement("option");
        opt.value = e.Nom;
        opt.textContent = e.Nom;
        sel.appendChild(opt);
    });

    console.log("[CAISSE] Employés chargés :", list.length);
}

function remplirClients(list) {
    const sel = document.getElementById("client");
    sel.innerHTML = "";

    list.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.Nom;
        opt.textContent = c.Nom;
        sel.appendChild(opt);
    });

    console.log("[CAISSE] Clients chargés :", list.length);
}

function remplirPaiements(list) {
    const sel = document.getElementById("paiement");
    sel.innerHTML = "";

    list.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.moyen_de_paiment;
        opt.textContent = p.moyen_de_paiment;
        sel.appendChild(opt);
    });

    console.log("[CAISSE] Moyens de paiement chargés :", list.length);
}

function remplirArticles(list) {
    const dl = document.getElementById("articlesList");
    dl.innerHTML = "";

    list.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.Nom;
        dl.appendChild(opt);
    });

    console.log("[CAISSE] Articles chargés :", list.length);
}


/* ============================================================
   ➕ GESTION DES LIGNES D’ARTICLES
   ============================================================ */

function ajouterLigneArticle() {
    console.log("[CAISSE] Ajout d'une nouvelle ligne article");

    const template = document.querySelector(".template-ligne");
    const clone = template.cloneNode(true);

    clone.classList.remove("template-ligne");
    clone.classList.add("ligne-article");
    clone.style.display = "flex";

    document.getElementById("lignesReelles").appendChild(clone);
}


/* ============================================================
   🧮 CALCUL DES TOTAUX
   ============================================================ */

function updateTotals() {
    let total = 0;

    document.querySelectorAll(".ligne-article").forEach(l => {
        const val = Number(l.querySelector(".totalLigne").value) || 0;
        total += val;
    });

    const livVal = Number(document.getElementById("livraisonMontant").value) || 0;
    const livType = document.getElementById("livraisonType").value;

    if (livVal > 0) {
        if (livType === "€") total += livVal;
        else total += total * (livVal / 100);
    }

    document.getElementById("totalArticle").textContent = total.toFixed(2);

    console.log("[CAISSE] Total mis à jour :", total.toFixed(2));
}
