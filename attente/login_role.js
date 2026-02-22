/* ============================================================
   FICHIER : login_role.js
   MODULE  : Activation via clé + Session LocalStorage
   VERSION : PRO 2026
   AUTEUR  : Stephen + Copilot PRO
   ------------------------------------------------------------
   DESCRIPTION :
   - Le joueur entre une clé d’activation (ex : ABC-123-XYZ)
   - Le backend vérifie la clé dans la BDD (feuille KEYS)
   - Si valide → attribution du rôle + création d’une session locale
   - Le joueur n’a plus jamais besoin de la clé
   - Le menu est construit automatiquement selon le rôle
   ------------------------------------------------------------
   PRÉREQUIS :
   - Fonction api(action, payload) déjà définie
   - Fonction buildMenu(role) déjà définie
   - Présence d’un input #activation_key dans le HTML
   ------------------------------------------------------------
   LOGS :
   🟦 [login] Module login_role.js chargé.
   ============================================================ */

console.log("🟦 [login] Module login_role.js chargé.");

const loginRole = {

  /* ------------------------------------------------------------
     ACTIVATION — Envoi de la clé au backend
     ------------------------------------------------------------ */
  async activateKey() {
    const keyInput = document.getElementById("activation_key");

    if (!keyInput) {
      console.error("❌ [activate] Champ #activation_key introuvable.");
      return;
    }

    const key = keyInput.value.trim();

    if (!key) {
      console.warn("🟧 [activate] Clé vide → activation annulée.");
      return;
    }

    console.log("🟦 [activate] Tentative activation clé :", key);

    // Appel backend
    const res = await api("ui_activateKey", { key });

    if (!res.success) {
      console.warn("🟥 [activate] Échec activation :", res.error);
      alert(res.error);
      return;
    }

    console.log("🟩 [activate] Activation OK → rôle :", res.role);

    // Création de la session locale
    localStorage.setItem("session_user", key);
    localStorage.setItem("session_role", res.role);

    console.log("🟩 [activate] Session enregistrée dans LocalStorage.");
    console.log("🔄 [activate] Reload de la page.");
    location.reload();
  },

  /* ------------------------------------------------------------
     AUTO-LOGIN — Lecture session locale
     ------------------------------------------------------------ */
  autoLogin() {
    const user = localStorage.getItem("session_user");
    const role = localStorage.getItem("session_role");

    if (!user || !role) {
      console.warn("🟧 [login] Aucune session → menu joueur.");
      buildMenu("joueur");
      return;
    }

    console.log(`🟩 [login] Session trouvée → user="${user}", role="${role}"`);
    buildMenu(role);
  }
};

/* ============================================================
   HOOK AUTOMATIQUE AU CHARGEMENT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  console.log("🟦 [login] DOMContentLoaded → autoLogin()");
  loginRole.autoLogin();
});