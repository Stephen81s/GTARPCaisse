// ============================================================
//  CONFIG POCKETBASE
// ============================================================

const pb = new PocketBase("https://pocketbase-server-t8sv.onrender.com");

console.log("[CAISSE] Connexion PocketBase :", pb.baseUrl);

// ============================================================
//  CHARGEMENT DES DONNÉES
// ============================================================

async function chargerDonneesCaisse() {
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

    initCaisse({
      typesOperation,
      employes,
      clients,
      paiements,
      articles
    });

  } catch (err) {
    console.error("[CAISSE] Erreur chargement PocketBase :", err);
  }
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
    opt.value = t.type_doperation;
    opt.textContent = t.type_doperation;
    sel.appendChild(opt);
  });
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
}

function remplirArticles(list) {
  const dl = document.getElementById("articlesList");
  dl.innerHTML = "";
  list.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a.Nom;
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
