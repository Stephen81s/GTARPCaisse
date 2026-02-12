// ============================================================
//  API.JS — POINT CENTRAL DE COMMUNICATION AVEC APPS SCRIPT
//  Utilisé par tous les modules : Caisse, Ticket, Ressource, Service
//  Version GitHub Pages — compatible CORS + WebApp Google
// ============================================================

// ============================================================
//  URL UNIQUE DE TON WEBAPP APPS SCRIPT
//  ⚠️ Remplace TON_WEBAPP_ID par ton vrai ID Apps Script
// ============================================================

const API_URL = "https://script.google.com/macros/s/TON_WEBAPP_ID/exec";

console.log("[API] Initialisation de l'API — URL :", API_URL);

// ============================================================
//  FONCTION API GÉNÉRIQUE
//  Tous les modules utilisent cette fonction pour communiquer
// ============================================================

async function callAPI(action, payload = {}) {
  const body = { action, ...payload };

  console.log("%c[API] → Envoi", "color:#4ea1ff", body);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error("[API] ❌ Erreur HTTP :", response.status, response.statusText);
      throw new Error("Erreur HTTP " + response.status);
    }

    const data = await response.json();
    console.log("%c[API] ← Réponse", "color:#7dff7d", data);

    return data;

  } catch (err) {
    console.error("[API] ❌ Erreur réseau / CORS :", err);
    throw err;
  }
}

// ============================================================
//  WRAPPERS PAR MODULE (facultatif mais propre)
//  Permet d'avoir des logs clairs et séparés
// ============================================================

// --- CAISSE ---
function apiCaisse(action, payload = {}) {
  console.log("[API-CAISSE] Action :", action);
  return callAPI(action, payload);
}

// --- TICKET ---
function apiTicket(action, payload = {}) {
  console.log("[API-TICKET] Action :", action);
  return callAPI(action, payload);
}

// --- RESSOURCE ---
function apiRessource(action, payload = {}) {
  console.log("[API-RESSOURCE] Action :", action);
  return callAPI(action, payload);
}

// --- SERVICE ---
function apiService(action, payload = {}) {
  console.log("[API-SERVICE] Action :", action);
  return callAPI(action, payload);
}

// ============================================================
//  FIN DU FICHIER API.JS
// ============================================================

console.log("[API] API.js chargé avec succès.");
