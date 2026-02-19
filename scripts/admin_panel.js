/* ============================================================
   SCRIPT  : admin_panel.js
   MODULE  : JS global du panneau admin — RP Business System
   VERSION : PRO 2026 — API REST
   ============================================================ */

(function() {

  // ============================================================
  // CONFIG API
  // ============================================================
  const API_URL = "https://script.google.com/macros/s/TON_DEPLOYMENT_ID/exec";

  async function api(action, params = {}) {
    const url = new URL(API_URL);
    url.searchParams.set("action", action);

    Object.entries(params).forEach(([k, v]) => {
      url.searchParams.set(k, v);
    });

    const res = await fetch(url);
    return res.json();
  }

  // ============================================================
  // PROTECTION : NE PAS EXÉCUTER DANS LA FENÊTRE OAUTH
  // ============================================================
  if (window.location.href.includes("createOAuthDialog=true")) {
    console.warn("Admin script ignoré dans la fenêtre OAuth.");
    return;
  }

  // ============================================================
  // RÔLE UTILISATEUR
  // ============================================================
  async function admin_initRole() {

    const section = document.getElementById("adminSection");
    const principal = document.getElementById("adminPrincipalSection");

    if (!section) return;

    const role = await api("getUserRole");

    if (role === "admin_principal") {
      section.style.display = "block";
      if (principal) principal.style.display = "block";
      admin_loadAdminsList();
    }

    if (role === "admin_secondaire") {
      section.style.display = "block";
    }
  }

  // ============================================================
  // POPUPS
  // ============================================================
  function admin_ouvrirPopupLocal() {
    const el = document.getElementById("admin_popupLocal");
    if (el) el.style.display = "flex";
  }
  function admin_fermerPopupLocal() {
    const el = document.getElementById("admin_popupLocal");
    if (el) el.style.display = "none";
  }

  function admin_ouvrirPopupCreate() {
    const el = document.getElementById("admin_popupCreate");
    if (el) el.style.display = "flex";
  }
  function admin_fermerPopupCreate() {
    const el = document.getElementById("admin_popupCreate");
    if (el) el.style.display = "none";
  }

  function admin_ouvrirPopupEntreprise() {
    const el = document.getElementById("admin_popupEntreprise");
    if (el) el.style.display = "flex";
  }
  function admin_fermerPopupEntreprise() {
    const el = document.getElementById("admin_popupEntreprise");
    if (el) el.style.display = "none";
  }

  function admin_openAddAdminPopup() {
    const el = document.getElementById("admin_popupAddAdmin");
    if (el) el.style.display = "flex";
  }
  function admin_closeAddAdminPopup() {
    const el = document.getElementById("admin_popupAddAdmin");
    if (el) el.style.display = "none";
  }

  function admin_openRemoveAdminPopup() {
    const el = document.getElementById("admin_popupRemoveAdmin");
    if (el) el.style.display = "flex";
  }
  function admin_closeRemoveAdminPopup() {
    const el = document.getElementById("admin_popupRemoveAdmin");
    if (el) el.style.display = "none";
  }

  // ============================================================
  // LOCAL PLAYER
  // ============================================================
  function admin_saveLocalPlayer(player) {
    localStorage.setItem("rp_player", JSON.stringify(player));
  }

  function admin_loadLocalPlayer() {
    const data = localStorage.getItem("rp_player");
    return data ? JSON.parse(data) : null;
  }

  function admin_resetLocalPlayer() {
    localStorage.removeItem("rp_player");
    loadPage("page_admin_panel");
  }

  // ============================================================
  // VALIDATION POPUPS
  // ============================================================
  function admin_validerEnregistrementLocal() {
    const zone = document.getElementById("admin_etatConnexion");
    if (!zone) return;

    const nom = document.getElementById("admin_localNom").value.trim();
    const prenom = document.getElementById("admin_localPrenom").value.trim();

    if (!nom || !prenom) {
      alert("Merci de remplir nom et prénom RP.");
      return;
    }

    admin_saveLocalPlayer({ nom, prenom });
    admin_fermerPopupLocal();
    admin_afficherEtatConnexion();
  }

  async function admin_validerCreationJoueur() {
    const nom = document.getElementById("admin_createNom").value.trim();
    const prenom = document.getElementById("admin_createPrenom").value.trim();

    if (!nom || !prenom) {
      alert("Merci de remplir nom et prénom RP.");
      return;
    }

    const id = await api("registerPlayer", { nom, prenom });

    alert("Joueur créé avec ID : " + id);
    admin_fermerPopupCreate();
  }

  async function admin_validerCreationEntreprise() {
    const nom = document.getElementById("admin_popupNomEntreprise").value.trim();
    const patronNom = document.getElementById("admin_popupPatronNom").value.trim();
    const patronPrenom = document.getElementById("admin_popupPatronPrenom").value.trim();

    if (!nom || !patronNom || !patronPrenom) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    await api("createEntreprise", {
      nom,
      patronNom,
      patronPrenom
    });

    alert("Entreprise créée !");
    admin_fermerPopupEntreprise();
  }

  // ============================================================
  // ADMINS
  // ============================================================
  async function admin_addAdmin() {
    const email = document.getElementById("admin_addAdminEmail").value.trim();

    const msg = await api("addAdmin", { email });

    alert(msg);
    admin_closeAddAdminPopup();
    admin_loadAdminsList();
  }

  async function admin_removeAdmin() {
    const email = document.getElementById("admin_removeAdminEmail").value.trim();

    const msg = await api("removeAdmin", { email });

    alert(msg);
    admin_closeRemoveAdminPopup();
    admin_loadAdminsList();
  }

  async function admin_loadAdminsList() {
    const ul = document.getElementById("admin_adminsList");
    if (!ul) return;

    const data = await api("getAdminsList");

    ul.innerHTML = "";
    data.secondaires.forEach(email => {
      const li = document.createElement("li");
      li.textContent = email;
      ul.appendChild(li);
    });
  }

  // ============================================================
  // ÉTAT DE CONNEXION
  // ============================================================
  async function admin_afficherEtatConnexion() {
    const zone = document.getElementById("admin_etatConnexion");
    if (!zone) return;

    const player = admin_loadLocalPlayer();

    if (!player) {
      zone.innerHTML = `
        <span style='color:#ff6666;'>Aucun joueur enregistré.</span><br><br>
        <button onclick="admin_ouvrirPopupLocal()">S’enregistrer</button>
      `;
      return;
    }

    zone.innerHTML = `<b>${player.nom} ${player.prenom}</b><br>`;

    const ent = await api("isPatron", {
      nom: player.nom,
      prenom: player.prenom
    });

    if (ent) {
      zone.innerHTML += `<span style='color:#00ff66;'>👑 Patron de : ${ent.nom}</span>`;
    }
  }

  // ============================================================
  // EXPORT GLOBAL
  // ============================================================
  window.admin_initRole = admin_initRole;
  window.admin_afficherEtatConnexion = admin_afficherEtatConnexion;
  window.admin_validerEnregistrementLocal = admin_validerEnregistrementLocal;
  window.admin_validerCreationJoueur = admin_validerCreationJoueur;
  window.admin_validerCreationEntreprise = admin_validerCreationEntreprise;
  window.admin_addAdmin = admin_addAdmin;
  window.admin_removeAdmin = admin_removeAdmin;

  window.admin_ouvrirPopupLocal = admin_ouvrirPopupLocal;
  window.admin_fermerPopupLocal = admin_fermerPopupLocal;
  window.admin_ouvrirPopupCreate = admin_ouvrirPopupCreate;
  window.admin_fermerPopupCreate = admin_fermerPopupCreate;
  window.admin_ouvrirPopupEntreprise = admin_ouvrirPopupEntreprise;
  window.admin_fermerPopupEntreprise = admin_fermerPopupEntreprise;
  window.admin_openAddAdminPopup = admin_openAddAdminPopup;
  window.admin_closeAddAdminPopup = admin_closeAddAdminPopup;
  window.admin_openRemoveAdminPopup = admin_openRemoveAdminPopup;
  window.admin_closeRemoveAdminPopup = admin_closeRemoveAdminPopup;

})();