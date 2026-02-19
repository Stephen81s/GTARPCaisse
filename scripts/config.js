/* ============================================================
   CONFIGURATION GLOBALE — RP Business System
   VERSION : PRO 2026
   Ce fichier centralise toutes les constantes globales.
   ============================================================ */

console.log("🟦 [config] Configuration chargée.");

/* ============================================================
   URL DE L'API (WEB APP APPS SCRIPT)
   ============================================================ */

const API_URL = "https://script.google.com/macros/s/AKfycbxX795abvANEfdvYVJ-_e-PYFdSOa0iyTZ43Tl7CWaaTEJGZ0rWj2e38ug0MFbe5AtS/exec";

/* ============================================================
   FONCTION API UNIVERSELLE
   ============================================================ */

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