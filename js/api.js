/********************************************************************
 * api.js — Communication entre le site GitHub et Apps Script
 * ---------------------------------------------------------------
 *  - Envoie des requêtes POST au WebApp Google
 *  - Reçoit les réponses JSON
 *  - Gère les erreurs réseau
 ********************************************************************/

// ⚠️ IMPORTANT : Mets ici l’URL de TON WebApp Apps Script
const WEBAPP_URL = "https://script.google.com/macros/s/TON_WEBAPP_ID/exec";

/**
 * Appel API générique
 * @param {string} action - Nom de l'action backend
 * @param {object} data - Données envoyées au backend
 * @returns {Promise<object>} - Réponse JSON
 */
async function api(action, data = {}) {
  data.action = action;

  try {
    const response = await fetch(WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      console.error("❌ Erreur réseau :", response.status);
      return { success: false, message: "Erreur réseau" };
    }

    return await response.json();

  } catch (err) {
    console.error("💥 Erreur API :", err);
    return { success: false, message: "Erreur de connexion" };
  }
}
