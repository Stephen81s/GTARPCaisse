// ============================================================
//  NAVIGATION.JS — GESTION DES INTERFACES
//  Ce fichier contrôle l'affichage des modules HTML chargés
//  dynamiquement dans index.html.
// ============================================================

console.log("[NAVIGATION] Initialisation du système de navigation…");

// ============================================================
//  Fonction : showInterface(id)
//  Affiche une interface et masque toutes les autres
// ============================================================

function showInterface(id) {
  console.log(`[NAVIGATION] → Demande d'affichage : ${id}`);

  // Récupération de toutes les interfaces
  const interfaces = document.querySelectorAll(".interface");

  if (!interfaces.length) {
    console.error("[NAVIGATION] ❌ Aucune interface trouvée dans le DOM.");
    return;
  }

  // Masquer toutes les interfaces
  interfaces.forEach(div => {
    div.style.display = "none";
  });

  // Afficher l'interface demandée
  const target = document.getElementById(id);

  if (!target) {
    console.error(`[NAVIGATION] ❌ Interface introuvable : ${id}`);
    return;
  }

  target.style.display = "block";
  console.log(`[NAVIGATION] ✔ Interface affichée : ${id}`);

  // ============================================================
  //  Réinitialisation automatique des modules
  //  (si une fonction init existe dans le module)
  // ============================================================

  const initName = "init" + id.replace("interface_", "").charAt(0).toUpperCase()
    + id.replace("interface_", "").slice(1);

  if (typeof window[initName] === "function") {
    console.log(`[NAVIGATION] → Appel automatique : ${initName}()`);
    try {
      window[initName]();
    } catch (err) {
      console.error(`[NAVIGATION] ❌ Erreur dans ${initName}()`, err);
    }
  } else {
    console.log(`[NAVIGATION] Aucun init détecté pour : ${id}`);
  }
}

// ============================================================
//  Navigation automatique vers l'accueil au chargement
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("[NAVIGATION] DOM chargé — affichage de l'accueil");
  showInterface("interface_home");
});

// ============================================================
//  FIN DU FICHIER NAVIGATION.JS
// ============================================================

console.log("[NAVIGATION] navigation.js chargé avec succès.");
