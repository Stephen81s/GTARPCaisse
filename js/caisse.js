// ============================================================
//  MODULE CAISSE — LOGIQUE JS
//  Utilisé par interfaces/caisse.html
// ============================================================

// ⚠ À adapter avec ton vrai endpoint Apps Script
const API_URL = "https://script.google.com/macros/s/TON_WEBAPP_ID/exec";

// Appel générique API
async function api(action, payload = {}) {
  const body = { action, ...payload };

  console.log("[API] Appel", action, body);

  const res = await fetch(API_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    console.error("[API] Erreur HTTP", res.status, res.statusText);
    throw new Error("Erreur API");
  }

  const data = await res.json();
  console.log("[API] Réponse", data);
  return data;
}

// ============================================================
//  INIT DU MODULE CAISSE
//  Appelée depuis caisse.html une fois le HTML chargé
// ============================================================

function initCaisse() {
  console.log("[CAISSE] Initialisation du module");

  // Sélecteurs
  const typeOperation = document.getElementById("typeOperation");
  const employeSelect = document.getElementById("employeSelect");
  const listeArticles = document.getElementById("listeArticles");

  if (!typeOperation || !employeSelect || !listeArticles) {
    console.error("[CAISSE] Éléments HTML manquants, init annulée");
    return;
  }

  // Chargements initiaux
  chargerTypeOperations();
  chargerEmployes();
  chargerArticles();
  chargerClients();
  chargerPaiements();
}

// ============================================================
//  FONCTIONS DE CHARGEMENT (exemples)
//  À adapter selon ton Apps Script
// ============================================================

async function chargerTypeOperations() {
  console.log("[CAISSE] Chargement des types d'opération");
  try {
    const data = await api("getTypeOperations");
    console.log("[CAISSE] Types d'opération reçus", data);
    // TODO : remplir le select si besoin
  } catch (e) {
    console.error("[CAISSE] Erreur chargement types d'opération", e);
  }
}

async function chargerEmployes() {
  console.log("[CAISSE] Chargement des employés");
  try {
    const data = await api("getEmployes");
    const employeSelect = document.getElementById("employeSelect");
    if (!employeSelect) return;

    employeSelect.innerHTML = "";
    data.forEach(emp => {
      const opt = document.createElement("option");
      opt.value = emp.id || emp.nom;
      opt.textContent = emp.nom;
      employeSelect.appendChild(opt);
    });
  } catch (e) {
    console.error("[CAISSE] Erreur chargement employés", e);
  }
}

async function chargerArticles() {
  console.log("[CAISSE] Chargement des articles");
  try {
    const data = await api("getArticles");
    console.log("[CAISSE] Articles reçus", data);
    // TODO : stocker en mémoire si besoin
  } catch (e) {
    console.error("[CAISSE] Erreur chargement articles", e);
  }
}

async function chargerClients() {
  console.log("[CAISSE] Chargement des clients");
  try {
    const data = await api("getClients");
    console.log("[CAISSE] Clients reçus", data);
  } catch (e) {
    console.error("[CAISSE] Erreur chargement clients", e);
  }
}

async function chargerPaiements() {
  console.log("[CAISSE] Chargement des moyens de paiement");
  try {
    const data = await api("getPaiements");
    console.log("[CAISSE] Paiements reçus", data);
  } catch (e) {
    console.error("[CAISSE] Erreur chargement paiements", e);
  }
}

// ============================================================
//  GESTION DES LIGNES D'ARTICLE (squelette)
// ============================================================

function ajouterLigneArticle() {
  console.log("[CAISSE] Ajout d'une ligne article");

  const listeArticles = document.getElementById("listeArticles");
  if (!listeArticles) return;

  const ligne = document.createElement("div");
  ligne.className = "ligne-article";

  ligne.innerHTML = `
    <input class="articleInput" placeholder="Article">
    <input type="number" class="qteInput" value="1" min="1">
    <input type="number" class="prixInput" value="0" min="0">
    <span class="totalLigne">0 €</span>
    <button class="supprimerLigne" onclick="supprimerLigne(this)">✖</button>
  `;

  listeArticles.appendChild(ligne);
}

function supprimerLigne(btn) {
  const ligne = btn.closest(".ligne-article");
  if (ligne) {
    console.log("[CAISSE] Suppression d'une ligne article");
    ligne.remove();
    recalculerTotal();
  }
}

function recalculerTotal() {
  console.log("[CAISSE] Recalcul du total");
  const lignes = document.querySelectorAll(".ligne-article");
  let total = 0;

  lignes.forEach(ligne => {
    const qte = Number(ligne.querySelector(".qteInput")?.value || 0);
    const prix = Number(ligne.querySelector(".prixInput")?.value || 0);
    total += qte * prix;
  });

  const totalBox = document.getElementById("totalGlobalBox");
  if (totalBox) {
    totalBox.textContent = `Total : ${total.toFixed(2)} €`;
  }
}

// ============================================================
//  VALIDATION / RESET (squelette)
// ============================================================

function validerCaisse() {
  console.log("[CAISSE] Validation de la caisse (à implémenter)");
  // TODO : construire payload + appel API
}

function resetCaisse() {
  console.log("[CAISSE] Reset de la caisse");
  const listeArticles = document.getElementById("listeArticles");
  if (listeArticles) listeArticles.innerHTML = "";
  const totalBox = document.getElementById("totalGlobalBox");
  if (totalBox) totalBox.textContent = "Total : 0 €";
}
