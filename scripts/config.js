/* ============================================================
   FICHIER : config.js
   MODULE  : RP BUSINESS SYSTEM — CONFIGURATION GLOBALE (FRONT)
   VERSION : PRO 2026
   AUTEUR  : Stephen + Copilot PRO
   ------------------------------------------------------------
   DESCRIPTION :
   Centralise toutes les constantes globales côté front :
     - URL de l'API Web App Apps Script
     - Fonction API universelle (fetch)
   ------------------------------------------------------------
   LOGS :
   🟦 [config] Configuration chargée.
   ============================================================ */

console.log("🟦 [config] Configuration chargée.");


// ============================================================
// URL DE L'API (WEB APP APPS SCRIPT)
// ============================================================
const API_URL =
  "https://script.google.com/macros/s/AKfycbxX795abvANEfdvYVJ-_e-PYFdSOa0iyTZ43Tl7CWaaTEJGZ0rWj2e38ug0MFbe5AtS/exec";


// ============================================================
// FONCTION API UNIVERSELLE
// ============================================================
/**
 * Appelle l'API Apps Script via fetch().
 * action : nom de la fonction backend
 * params : objet contenant les paramètres
 */
async function api(action, params = {}) {
  const url = new URL(API_URL);
  url.searchParams.set("action", action);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.error("❌ [api] Erreur API :", err);
    throw err;
  }
}