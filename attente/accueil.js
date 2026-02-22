/* ============================================================
   FICHIER : accueil.js
   MODULE  : Dashboard d’accueil — RP Business System
   VERSION : PRO 2026
   AUTEUR  : Stephen + Copilot PRO
   ------------------------------------------------------------
   DESCRIPTION :
   Gère l’affichage dynamique de la page d’accueil :
     - Informations joueur
     - Rôle utilisateur
     - Personnage RP
     - Entreprise associée
     - Statistiques globales
     - Actions rapides selon le rôle
   ------------------------------------------------------------
   LOGS :
   🟦 [accueil] Script accueil chargé.
   ============================================================ */

console.log("🟦 [accueil] Script accueil chargé.");

/* ============================================================
   FONCTION PRINCIPALE — appelée automatiquement par spa.js
   ============================================================ */
function accueil() {
  console.log("🔧 [accueil] Initialisation de la page d’accueil…");

  loadUserInfo();
  loadStats();
  loadActions();
}

/* ============================================================
   1) INFORMATIONS UTILISATEUR
   ============================================================ */
async function loadUserInfo() {
  try {
    const user = await api("ui_getUserInfo"); // { nom, prenom, role, joueurID }

    document.getElementById("accueil_nom").textContent =
      `${user.prenom} ${user.nom}`;

    document.getElementById("accueil_role").textContent =
      `Rôle : ${formatRole(user.role)}`;

    loadPersonnage(user.joueurID);
    loadEntreprise(user.joueurID);

  } catch (err) {
    console.error("❌ [accueil] Impossible de charger les infos utilisateur :", err);
  }
}

/* Formatage du rôle */
function formatRole(role) {
  switch (role) {
    case "joueur": return "Joueur";
    case "employe": return "Employé";
    case "patron": return "Patron";
    case "admin_secondaire": return "Admin secondaire";
    case "admin_principal": return "Admin principal";
    default: return role;
  }
}

/* ============================================================
   2) PERSONNAGE RP
   ============================================================ */
async function loadPersonnage(joueurID) {
  try {
    const perso = await api("ui_getPersonnage", { joueurID });

    if (!perso) {
      document.getElementById("accueil_personnage").textContent =
        "Aucun personnage enregistré.";
      return;
    }

    document.getElementById("accueil_personnage").innerHTML = `
      <strong>Nom :</strong> ${perso.nom}<br>
      <strong>Prénom :</strong> ${perso.prenom}<br>
      <strong>Notes :</strong> ${perso.notes || "Aucune"}
    `;

  } catch (err) {
    console.error("❌ [accueil] Erreur chargement personnage :", err);
  }
}

/* ============================================================
   3) ENTREPRISE ASSOCIÉE
   ============================================================ */
async function loadEntreprise(joueurID) {
  try {
    const ent = await api("ui_getEntrepriseByJoueur", { joueurID });

    if (!ent) {
      document.getElementById("accueil_entreprise").textContent =
        "Aucune entreprise associée.";
      return;
    }

    document.getElementById("accueil_entreprise").innerHTML = `
      <strong>Nom :</strong> ${ent.nom}<br>
      <strong>Type :</strong> ${ent.type}<br>
      <strong>Catégorie :</strong> ${ent.categorie}<br>
      <strong>Rôle :</strong> ${ent.role}<br>
    `;

  } catch (err) {
    console.error("❌ [accueil] Erreur chargement entreprise :", err);
  }
}

/* ============================================================
   4) STATISTIQUES GLOBALES
   ============================================================ */
async function loadStats() {
  try {
    const stats = await api("ui_getStats"); 
    // { joueurs, entreprises, emplois, grades, employes }

    document.getElementById("accueil_stats").innerHTML = `
      <li>Joueurs : ${stats.joueurs}</li>
      <li>Entreprises : ${stats.entreprises}</li>
      <li>Emplois : ${stats.emplois}</li>
      <li>Grades : ${stats.grades}</li>
      <li>Employés : ${stats.employes}</li>
    `;

  } catch (err) {
    console.error("❌ [accueil] Erreur chargement stats :", err);
  }
}

/* ============================================================
   5) ACTIONS RAPIDES
   ============================================================ */
async function loadActions() {
  try {
    const role = await api("ui_getUserRole");

    let html = "";

    if (role === "admin_principal" || role === "admin_secondaire") {
      html += `<button onclick="navigation.go('admin_panel')">🛡️ Admin Panel</button>`;
    }

    if (role === "patron") {
      html += `<button onclick="navigation.go('entreprises')">🏢 Gérer mon entreprise</button>`;
      html += `<button onclick="navigation.go('employes')">💼 Gérer mes employés</button>`;
    }

    if (role === "employe") {
      html += `<button onclick="navigation.go('entreprises')">🏢 Voir mon entreprise</button>`;
    }

    html += `<button onclick="navigation.go('joueurs')">🧍 Voir les joueurs</button>`;

    document.getElementById("accueil_actions").innerHTML = html;

  } catch (err) {
    console.error("❌ [accueil] Erreur chargement actions rapides :", err);
  }
}