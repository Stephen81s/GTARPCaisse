/* ============================================================
   SCRIPT : Admin Panel — RP Business System
   VERSION : PRO 2026 — API REST + SPA
   ============================================================ */

console.log("🟦 [admin] Script Admin Panel chargé.");

/* ============================================================
   CONFIG API
============================================================ */
const API_URL = "https://script.google.com/macros/s/TON_DEPLOYMENT_ID/exec";

async function api(action, params = {}) {
  const url = new URL(API_URL);
  url.searchParams.set("action", action);

  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error("❌ [api] Erreur API :", err);
    throw err;
  }
}

/* ============================================================
   POPUPS
============================================================ */
function admin_showPopup(id) {
  document.getElementById(id).style.display = "flex";
}
function admin_hidePopup(id) {
  document.getElementById(id).style.display = "none";
}

function admin_ouvrirPopupLocal() { admin_showPopup("admin_popupLocal"); }
function admin_fermerPopupLocal() { admin_hidePopup("admin_popupLocal"); }

function admin_ouvrirPopupCreate() { admin_showPopup("admin_popupCreate"); }
function admin_fermerPopupCreate() { admin_hidePopup("admin_popupCreate"); }

function admin_ouvrirPopupEntreprise() { admin_showPopup("admin_popupEntreprise"); }
function admin_fermerPopupEntreprise() { admin_hidePopup("admin_popupEntreprise"); }

function admin_openAddAdminPopup() { admin_showPopup("admin_popupAddAdmin"); }
function admin_closeAddAdminPopup() { admin_hidePopup("admin_popupAddAdmin"); }

function admin_openRemoveAdminPopup() { admin_showPopup("admin_popupRemoveAdmin"); }
function admin_closeRemoveAdminPopup() { admin_hidePopup("admin_popupRemoveAdmin"); }

/* ============================================================
   ÉTAT DE CONNEXION
============================================================ */
async function admin_afficherEtatConnexion() {
  const zone = document.getElementById("admin_etatConnexion");
  zone.innerText = "Chargement…";

  try {
    const etat = await api("admin_getEtatConnexion");
    zone.innerText = etat;
  } catch {
    zone.innerText = "Erreur";
  }
}

/* ============================================================
   INITIALISATION DU RÔLE
============================================================ */
async function admin_initRole() {
  const role = await api("ui_getUserRole");

  document.getElementById("adminSection").style.display =
    (role === "admin_secondaire" || role === "admin_principal") ? "block" : "none";

  document.getElementById("adminPrincipalSection").style.display =
    (role === "admin_principal") ? "block" : "none";

  if (role === "admin_principal") {
    admin_chargerAdmins();
  }
}

/* ============================================================
   CRÉATION JOUEUR RP
============================================================ */
async function admin_validerCreationJoueur() {
  const nom = document.getElementById("admin_createNom").value.trim();
  const prenom = document.getElementById("admin_createPrenom").value.trim();

  await api("admin_creerJoueur", { nom, prenom });
  admin_fermerPopupCreate();
}

/* ============================================================
   ENREGISTREMENT LOCAL
============================================================ */
async function admin_validerEnregistrementLocal() {
  const nom = document.getElementById("admin_localNom").value.trim();
  const prenom = document.getElementById("admin_localPrenom").value.trim();

  await api("admin_enregistrerLocal", { nom, prenom });
  admin_fermerPopupLocal();
}

async function admin_resetLocalPlayer() {
  await api("admin_resetLocal");
}

/* ============================================================
   CRÉATION ENTREPRISE
============================================================ */
async function admin_validerCreationEntreprise() {
  const nom = document.getElementById("admin_popupNomEntreprise").value.trim();
  const patronNom = document.getElementById("admin_popupPatronNom").value.trim();
  const patronPrenom = document.getElementById("admin_popupPatronPrenom").value.trim();

  await api("admin_creerEntreprise", { nom, patronNom, patronPrenom });
  admin_fermerPopupEntreprise();
}

/* ============================================================
   ADMIN PRINCIPAL — GESTION DES ADMINS
============================================================ */
async function admin_chargerAdmins() {
  const admins = await api("admin_getAdmins");

  const ul = document.getElementById("admin_adminsList");
  ul.innerHTML = "";

  admins.forEach(mail => {
    const li = document.createElement("li");
    li.innerText = mail;
    ul.appendChild(li);
  });
}

async function admin_addAdmin() {
  const email = document.getElementById("admin_addAdminEmail").value.trim();
  await api("admin_addAdmin", { email });
  admin_closeAddAdminPopup();
  admin_chargerAdmins();
}

async function admin_removeAdmin() {
  const email = document.getElementById("admin_removeAdminEmail").value.trim();
  await api("admin_removeAdmin", { email });
  admin_closeRemoveAdminPopup();
  admin_chargerAdmins();
}

/* ============================================================
   MAINTENANCE SYSTÈME
============================================================ */
async function admin_updateAll() {
  await api("admin_updateAll");
}

async function admin_resetSystem() {
  await api("admin_resetSystem");
}