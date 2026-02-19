/* ============================================================
   FICHIER : navigation.js
   MODULE  : RP BUSINESS SYSTEM — NAVIGATION FRONT
   VERSION : PRO 2026
   AUTEUR  : Stephen + Copilot PRO
   ------------------------------------------------------------
   DESCRIPTION :
   Gère la navigation dynamique du site :
     - Mise en surbrillance du bouton actif
     - Construction du menu selon le rôle utilisateur
     - Ajout dynamique de liens
     - Intégration avec spa.loadPage()
     - Hook onPageLoaded() appelé par spa.js
   ------------------------------------------------------------
   LOGS :
   🟦 [nav] Script navigation chargé.
   ============================================================ */

console.log("🟦 [nav] Script navigation chargé.");

let currentPage = null;

/* ============================================================
   NAVIGATION — Mise en surbrillance du bouton actif
   ============================================================ */
function setActiveNav(pageName) {
  const links = document.querySelectorAll("#menu-links a");
  links.forEach(a => a.classList.remove("nav-active"));

  const id = "nav-" + pageName;
  const active = document.getElementById(id);

  if (active) {
    active.classList.add("nav-active");
    console.log("🟩 [nav] Bouton actif :", id);
  } else {
    console.warn("🟧 [nav] Aucun bouton trouvé pour :", id);
  }
}

/* ============================================================
   NAVIGATION — Ajout d’un lien dans le menu
   ============================================================ */
function addMenuLink(label, page) {
  const id = "nav-" + page;

  const li = document.createElement("li");
  li.innerHTML = `
    <a id="${id}" href="javascript:void(0)" onclick="navigation.go('${page}')">
      ${label}
    </a>
  `;

  document.getElementById("menu-links").appendChild(li);
}

/* ============================================================
   NAVIGATION — Action principale
   ============================================================ */
var navigation = {

  go: function(page) {
    console.log("🔧 [nav] Navigation vers :", page);
    currentPage = page;
    spa.loadPage(page);
  }
};

/* ============================================================
   MENU DYNAMIQUE SELON LE RÔLE
   ============================================================ */
function buildMenu(role) {
  console.log("🟦 [nav] Construction du menu pour rôle :", role);

  const menu = document.getElementById("menu-links");
  menu.innerHTML = "";

  // Toujours visible
  addMenuLink("🏠 Accueil", "accueil");

  // Rôles non-joueur
  if (role !== "joueur") {
    addMenuLink("🧍 Joueurs", "joueurs");
    addMenuLink("🏢 Entreprises", "entreprises");
    addMenuLink("💼 Employés", "employes");
  }

  // Admin secondaire + principal
  if (role === "admin_secondaire" || role === "admin_principal") {
    addMenuLink("🛡️ Admin Panel", "admin_panel");
  }

  // Admin principal uniquement
  if (role === "admin_principal") {
    addMenuLink("👑 Configuration système", "config_systeme");
    addMenuLink("🛠️ Maintenance", "maintenance_systeme");
  }
}

/* ============================================================
   HOOK : appelé automatiquement par spa.loadPage()
   ============================================================ */
function onPageLoaded(pageName) {
  setActiveNav(pageName);
}