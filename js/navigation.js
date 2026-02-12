// ============================================================
//  NAVIGATION.JS — Gestion centralisée des interfaces
// ============================================================

console.log("[NAVIGATION] Initialisation du système de navigation…");

// ------------------------------------------------------------
//  Fonction : showInterface(id)
//  Affiche une interface et masque toutes les autres
// ------------------------------------------------------------

function showInterface(id) {
  console.log(`[NAVIGATION] → Demande d'affichage : ${id}`);

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

  // ------------------------------------------------------------
  //  Appel automatique d'une fonction init si elle existe
  //  Exemple : interface_ticket → initTicket()
  // ------------------------------------------------------------

  const cleanId = id.replace("interface_", "");
  const initName = "init" + cleanId.charAt(0).toUpperCase() + cleanId.slice(1);

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

// ------------------------------------------------------------
//  Redirection automatique vers la page d'accueil
// ------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  console.log("[NAVIGATION] DOM chargé — affichage automatique de l'accueil");
  showInterface("interface_home");
});

// ------------------------------------------------------------
//  Fin du fichier
// ------------------------------------------------------------

console.log("[NAVIGATION] navigation.js chargé avec succès.");
