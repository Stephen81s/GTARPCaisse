/* ============================================================
   FICHIER : admin_panel.js
   MODULE  : Admin Panel — RP Business System
   VERSION : PRO 2026
   AUTEUR  : Stephen + Copilot PRO
   ------------------------------------------------------------
   DESCRIPTION :
   Gère les actions administratives :
     - Création joueur
     - Création entreprise
     - Rafraîchissement caches
     - Reconstruction types RP
     - Reconstruction système complet
   ------------------------------------------------------------
   LOGS :
   🟦 [admin_panel] Script chargé.
   ============================================================ */

console.log("🟦 [admin_panel] Script chargé.");

/* ============================================================
   FONCTION PRINCIPALE — appelée automatiquement par spa.js
   ============================================================ */
function admin_panel() {
  console.log("🔧 [admin_panel] Initialisation de la page Admin Panel…");
  setAdminLog("Panel chargé. En attente d'action.");
}

/* ============================================================
   LOGS
   ============================================================ */
function setAdminLog(text) {
  document.getElementById("admin_logs").textContent = text;
}

/* ============================================================
   MODULE ADMIN PANEL
   ============================================================ */
var adminPanel = {

  /* -----------------------------------------
     CRÉATION JOUEUR
  ----------------------------------------- */
  async createJoueur() {
    const nom = document.getElementById("admin_nom").value.trim();
    const prenom = document.getElementById("admin_prenom").value.trim();

    if (!nom || !prenom) {
      setAdminLog("❌ Nom et prénom requis.");
      return;
    }

    setAdminLog("⏳ Création du joueur…");

    try {
      const result = await api("admin_createJoueur", { nom, prenom });
      setAdminLog("🟩 Joueur créé : " + result.id);
    } catch (err) {
      console.error(err);
      setAdminLog("❌ Erreur création joueur.");
    }
  },

  /* -----------------------------------------
     CRÉATION ENTREPRISE
  ----------------------------------------- */
  async createEntreprise() {
    const nom = document.getElementById("admin_ent_nom").value.trim();
    const type = document.getElementById("admin_ent_type").value.trim();

    if (!nom || !type) {
      setAdminLog("❌ Nom entreprise et type requis.");
      return;
    }

    setAdminLog("⏳ Création de l’entreprise…");

    try {
      const result = await api("admin_createEntreprise", { nom, type });
      setAdminLog("🟩 Entreprise créée : " + result.id);
    } catch (err) {
      console.error(err);
      setAdminLog("❌ Erreur création entreprise.");
    }
  },

  /* -----------------------------------------
     RAFRAÎCHIR LES CACHES
  ----------------------------------------- */
  async refreshCaches() {
    setAdminLog("⏳ Rafraîchissement des caches…");

    try {
      await api("admin_refreshCaches");
      setAdminLog("🟩 Caches rafraîchis.");
    } catch (err) {
      console.error(err);
      setAdminLog("❌ Erreur rafraîchissement caches.");
    }
  },

  /* -----------------------------------------
     RECHARGER TYPES RP
  ----------------------------------------- */
  async rebuildTypes() {
    setAdminLog("⏳ Reconstruction des types RP…");

    try {
      await api("admin_rebuildTypes");
      setAdminLog("🟩 Types RP rechargés.");
    } catch (err) {
      console.error(err);
      setAdminLog("❌ Erreur reconstruction types.");
    }
  },

  /* -----------------------------------------
     RECONSTRUIRE TOUT LE SYSTÈME
  ----------------------------------------- */
  async rebuildAll() {
    setAdminLog("⏳ Reconstruction complète du système…");

    try {
      await api("admin_rebuildAll");
      setAdminLog("🟩 Reconstruction complète terminée.");
    } catch (err) {
      console.error(err);
      setAdminLog("❌ Erreur reconstruction système.");
    }
  }
};