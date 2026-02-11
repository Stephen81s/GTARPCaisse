/********************************************************************
 * caisse.js — Gestion complète de l’interface CAISSE (Front GitHub)
 * ---------------------------------------------------------------
 *  - Chargement des listes (articles, employés, paiements, clients)
 *  - Gestion des lignes dynamiques (template → clone)
 *  - Calculs : PU × Qté, remises €, %, livraison €, %
 *  - Total global
 *  - Validation → envoi au backend Apps Script
 ********************************************************************/


/* ============================================================
   🔄 INITIALISATION
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  chargerTypeOperations();
  chargerEmployes();
  chargerPaiements();
  chargerArticles();
  chargerClients();

  document.getElementById("ajouterLigne").addEventListener("click", ajouterLigne);
  document.getElementById("btn-valider").addEventListener("click", validerCaisse);
});



/* ============================================================
   🌐 API WRAPPER
   ============================================================ */
async function api(action, data = {}) {
  data.action = action;

  const res = await fetch(WEBAPP_URL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  return await res.json();
}



/* ============================================================
   📌 CHARGEMENT DES LISTES
   ============================================================ */

async function chargerTypeOperations() {
  const data = await api("getTypeOperations");
  const select = document.getElementById("typeOperation");

  data.forEach(op => {
    const opt = document.createElement("option");
    opt.value = op;
    opt.textContent = op;
    select.appendChild(opt);
  });
}

async function chargerEmployes() {
  const data = await api("getEmployes");
  const select = document.getElementById("employe");

  data.forEach(emp => {
    const opt = document.createElement("option");
    opt.value = emp.nomComplet;
    opt.textContent = emp.nomComplet;
    select.appendChild(opt);
  });
}

async function chargerPaiements() {
  const data = await api("getPaiements");
  const select = document.getElementById("paiement");

  data.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    select.appendChild(opt);
  });
}

async function chargerArticles() {
  const data = await api("getArticles");
  const datalist = document.getElementById("articlesList");

  data.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a.nom;
    opt.dataset.prix = a.prixVente;
    opt.dataset.type = a.typeCaisse;
    datalist.appendChild(opt);
  });
}

async function chargerClients() {
  const data = await api("getClients");
  const datalist = document.getElementById("clientsList");

  data.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.full;
    opt.dataset.tel = c.tel;
    datalist.appendChild(opt);
  });

  // Auto-remplissage téléphone
  document.getElementById("client").addEventListener("input", e => {
    const option = [...datalist.options].find(o => o.value === e.target.value);
    if (option) {
      document.getElementById("clientTel").value = option.dataset.tel;
    }
  });
}



/* ============================================================
   ➕ GESTION DES LIGNES
   ============================================================ */

function ajouterLigne() {
  const template = document.querySelector(".template-ligne");
  const clone = template.cloneNode(true);

  clone.style.display = "flex";
  clone.classList.remove("template-ligne");

  // Événements
  clone.querySelector(".articleInput").addEventListener("input", majPrix);
  clone.querySelector(".quantite").addEventListener("input", majTotalLigne);
  clone.querySelector(".remiseMontant").addEventListener("input", majTotalLigne);
  clone.querySelector(".remiseType").addEventListener("change", majTotalLigne);

  clone.querySelector(".dupliquerLigne").addEventListener("click", () => {
    const newClone = clone.cloneNode(true);
    document.getElementById("lignesReelles").appendChild(newClone);
  });

  clone.querySelector(".supprimerLigne").addEventListener("click", () => {
    clone.remove();
    majTotalGlobal();
  });

  document.getElementById("lignesReelles").appendChild(clone);
}



/* ============================================================
   💵 CALCUL DES TOTAUX
   ============================================================ */

function majPrix(e) {
  const input = e.target;
  const option = [...document.getElementById("articlesList").options]
    .find(o => o.value === input.value);

  if (option) {
    const ligne = input.closest(".ligne-article");
    ligne.querySelector(".prixUnitaire").value = option.dataset.prix;
    majTotalLigne({ target: ligne.querySelector(".quantite") });
  }
}

function majTotalLigne(e) {
  const ligne = e.target.closest(".ligne-article");

  const pu = parseFloat(ligne.querySelector(".prixUnitaire").value) || 0;
  const qte = parseInt(ligne.querySelector(".quantite").value) || 1;
  const remise = parseFloat(ligne.querySelector(".remiseMontant").value) || 0;
  const typeRemise = ligne.querySelector(".remiseType").value;

  let total = pu * qte;

  if (typeRemise === "%") total -= total * (remise / 100);
  else total -= remise;

  ligne.querySelector(".totalLigne").value = total.toFixed(2);

  majTotalGlobal();
}

function majTotalGlobal() {
  let total = 0;

  document.querySelectorAll(".ligne-article:not(.template-ligne)").forEach(ligne => {
    total += parseFloat(ligne.querySelector(".totalLigne").value) || 0;
  });

  // Livraison
  const livMontant = parseFloat(document.getElementById("livraisonMontant").value) || 0;
  const livType = document.getElementById("livraisonType").value;

  if (livType === "%") total += total * (livMontant / 100);
  else total += livMontant;

  document.getElementById("totalArticle").textContent = total.toFixed(2);
}



/* ============================================================
   ✔ VALIDATION DE LA CAISSE
   ============================================================ */

async function validerCaisse() {
  const lignes = [];

  document.querySelectorAll(".ligne-article:not(.template-ligne)").forEach(ligne => {
    lignes.push({
      article: ligne.querySelector(".articleInput").value,
      pu: ligne.querySelector(".prixUnitaire").value,
      qte: ligne.querySelector(".quantite").value,
      remise: ligne.querySelector(".remiseMontant").value + ligne.querySelector(".remiseType").value,
      total: ligne.querySelector(".totalLigne").value
    });
  });

  const payload = {
    action: "validerCaisse",
    typeOperation: document.getElementById("typeOperation").value,
    employe: document.getElementById("employe").value,
    client: document.getElementById("client").value,
    tel: document.getElementById("clientTel").value,
    paiement: document.getElementById("paiement").value,
    livraison: document.getElementById("livraisonMontant").value + document.getElementById("livraisonType").value,
    total: document.getElementById("totalArticle").textContent,
    lignes
  };

  const res = await api("validerCaisse", payload);

  alert(res.message || "Caisse validée !");
}
