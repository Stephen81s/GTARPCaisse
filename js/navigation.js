/********************************************************************
 * navigation.js — Gestion des interfaces (Front GitHub)
 * ---------------------------------------------------------------
 *  - Affiche une interface et masque toutes les autres
 *  - Fonctionne avec n’importe quel nombre d’interfaces
 *  - Repose sur la classe .interface obligatoire dans chaque page
 ********************************************************************/

/**
 * Affiche une interface et masque toutes les autres
 * @param {string} id - ID de l'interface à afficher
 */
function showInterface(id) {
  // Masquer toutes les interfaces
  const interfaces = document.querySelectorAll(".interface");
  interfaces.forEach(el => {
    el.style.display = "none";
  });

  // Afficher l'interface demandée
  const target = document.getElementById(id);
  if (target) {
    target.style.display = "block";
  } else {
    console.warn("Interface introuvable :", id);
  }
}
