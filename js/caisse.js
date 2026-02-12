// ============================================================
//  CONFIG
// ============================================================

const API_URL = "https://script.google.com/macros/s/AKfycbxtRL13AwKz-GCICw1mkFtdRPlQEGEPAetdeQrlMA3o-57V6IL-Xy3JfU7_56-h6hp0/exec";

// ============================================================
//  API
// ============================================================

async function api(action, payload = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload })
  });
  return res.json();
}

// ============================================================
//  CHARGEMENT DES DONNÉES
// ============================================================

async function chargerDonneesCaisse() {
  const [
    typesOperation,
    employes,
    clients,
    paiements,
    articles
  ] = await Promise.all([
    api("getTypeOperations"),
    api("getEmployes"),
    api("getClients"),
    api("getPaiements"),
    api("getArticles")
  ]);

  initCaisse({
    typesOperation,
    employes,
    clients,
    paiements,
    articles
  });
}

chargerDonneesCaisse();

// ============================================================
//  INITIALISATION
// ============================================================

function initCaisse(data) {
  remplirTypesOperation(data.typesOperation);
  remplirEmployes(data.employes);
  remplirClients(data.clients);
  remplirPaiements(data.paiements);
  remplirArticles(data.articles);
  ajouterLigneArticle();
}

// ============================================================
//  REMPLISSAGE DES LISTES
// ============================================================

function remplirTypesOperation(list) {
  const sel = document.getElementById("typeOperation");
  sel.innerHTML = "";
  list.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.nom;
    opt.textContent = t.nom;
    sel.appendChild(opt);
  });
}

function remplirEmployes(list) {
  const sel = document.getElementById("employe");
  sel.innerHTML = "";
  list.forEach(e => {
    const opt = document.createElement("option");
    opt.value = e.nom;
    opt.textContent = e.nom;
    sel.appendChild(opt);
  });
}

function remplirClients(list) {
  const sel = document.getElementById("client");
  sel.innerHTML = "";
  list.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.nom;
    opt.textContent = c.nom;
    sel.appendChild(opt);
  });
}

function remplirPaiements(list) {
  const sel = document.getElementById("paiement");
  sel.innerHTML = "";
  list.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.nom;
    opt.textContent = p.nom;
    sel.appendChild(opt);
  });
}

function remplirArticles(list) {
  const dl = document.getElementById("articlesList");
  dl.innerHTML = "";
  list.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a.nom;
    dl.appendChild(opt);
  });
}

// ============================================================
//  LIGNES D’ARTICLES
// ============================================================

function ajouterLigneArticle() {
  const template = document.querySelector(".template-ligne");
  const clone = template.cloneNode(true);
  clone.classList.remove("template-ligne");
  clone.classList.add("ligne-article");
  clone.style.display = "flex";

  document.getElementById("lignesReelles").appendChild(clone);
}

// ============================================================
//  TOTAL
// ============================================================

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
}
