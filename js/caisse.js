// ============================================================
//  MODULE CAISSE — LOGIQUE JS
//  Version GitHub Pages — compatible chargement dynamique
// ============================================================

// ⚠️ Mets ici ton vrai WebApp Apps Script
const API_URL = "https://script.google.com/macros/s/TON_WEBAPP_ID/exec";

// ============================================================
//  FONCTION API GÉNÉRIQUE
// ============================================================

async function api(action, payload = {}) {
  const body = { action, ...payload };

  console.log("[API] Appel :", action, body);

  const res = await fetch(API_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    console.error("[API] Erreur HTTP :", res.status, res.statusText);
    throw new Error("Erreur API");
  }

  const data = await res.json();
  console.log("[API] Réponse :", data);
  return data;
}

// ============================================================
//  INITIALISATION DU MODULE CAISSE
// ============================================================

function initCaisse() {
  console.log("[CAISSE] Initialisation…");

  const typeOperation = document.getElementById("typeOperation");
  const employeSelect = document.getElementById("employeSelect");
  const listeArticles = document.getElementById("listeArticles");

  if (!typeOperation || !employeSelect || !listeArticles) {
    console.error("[CAISSE] ERREUR : éléments HTML manquants");
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
//  CHARGEMENTS INITIAUX (APPELS API)
// ============================================================

async function chargerTypeOperations() {
  console.log("[CAISSE] Chargement types d'opération…");
  try {
    await api("getTypeOperations");
  } catch (e) {
    console.error("[CAISSE] Erreur types d'opération :", e);
  }
}

async function chargerEmployes() {
  console.log("[CAISSE] Chargement employés…");
  try {
    const data = await api("getEmployes");
    const select = document.getElementById("employeSelect");
    if (!select) return;

    select.innerHTML = "";
    data.forEach(emp => {
      const opt = document.createElement("option");
      opt.value = emp.id || emp.nom;
      opt.textContent = emp.nom;
      select.appendChild(opt);
    });

  } catch (e) {
    console.error("[CAISSE] Erreur employés :", e);
  }
}

async function chargerArticles() {
  console.log("[CAISSE] Chargement articles…");
  try {
    await api("getArticles");
  } catch (e) {
    console.error("[CAISSE] Erreur articles :", e);
  }
}

async function chargerClients() {
  console.log("[CAISSE] Chargement clients…");
  try {
    await api("getClients");
  } catch (e) {
    console.error("[CAISSE] Erreur clients :", e);
  }
}

async function chargerPaiements() {
  console.log("[CAISSE] Chargement paiements…");
  try {
    await api("getPaiements");
  } catch (e) {
    console.error("[CAISSE] Erreur paiements :", e);
  }
}

// ============================================================
//  GESTION DES LIGNES D’ARTICLE
// ============================================================

function ajouterLigneArticle() {
  console.log("[CAISSE] Ajout ligne article");

  const liste = document.getElementById("listeArticles");
  if (!liste) return;

  const ligne = document.createElement("div");
  ligne.className = "ligne-article";

  ligne.innerHTML = `
    <input class="articleInput" placeholder="Article">
    <input type="number" class="qteInput" value="1" min="1">
    <input type="number" class="prixInput" value="0" min="0">
    <span class="totalLigne">0 €</span>
    <button class="supprimerLigne" onclick="supprimerLigne(this)">✖</button>
  `;

  liste.appendChild(ligne);
}

function supprimerLigne(btn) {
  const ligne = btn.closest(".ligne-article");
  if (ligne) {
    console.log("[CAISSE] Suppression ligne article");
    ligne.remove();
    recalculerTotal();
  }
}

function recalculerTotal() {
  console.log("[CAISSE] Recalcul total…");

  const lignes = document.querySelectorAll(".ligne-article");
  let total = 0;

  lignes.forEach(ligne => {
    const qte = Number(ligne.querySelector(".qteInput")?.value || 0);
    const prix = Number(ligne.querySelector(".prixInput")?.value || 0);
    total += qte * prix;
  });

  const totalBox = document.getElementById("totalGlobalBox");
  if (totalBox) totalBox.textContent = `Total : ${total.toFixed(2)} €`;
}

// ============================================================
//  VALIDATION / RESET
// ============================================================

function validerCaisse() {
  console.log("[CAISSE] Validation (à implémenter)");
}

function resetCaisse() {
  console.log("[CAISSE] Reset caisse");
  const liste = document.getElementById("listeArticles");
  if (liste) liste.innerHTML = "";
  const totalBox = document.getElementById("totalGlobalBox");
  if (totalBox) totalBox.textContent = "Total : 0 €";
}
