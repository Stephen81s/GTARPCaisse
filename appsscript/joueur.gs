/**
 * ============================================================
 *  FICHIER : joueur.gs
 *  MODULE  : RP BUSINESS SYSTEM — JOUEURS
 *  VERSION : PRO 2026
 *  AUTEUR  : Stephen + Copilot PRO
 * ------------------------------------------------------------
 *  DESCRIPTION :
 *  Gestion des joueurs RP :
 *    - Accès à la feuille JOUEURS
 *    - Recherche d’un joueur par nom + prénom
 *    - Retour d'informations PRO 2026 (Entreprise_ID incluse)
 * ------------------------------------------------------------
 *  LOGS :
 *  🟦 [joueur.gs] Module JOUEURS chargé.
 * ============================================================
 */

console.log("🟦 [joueur.gs] Chargement du module JOUEURS...");

var joueur = {};

/* ============================================================
   getSheet()
   ------------------------------------------------------------
   Retourne la feuille JOUEURS.
   ============================================================ */
joueur.getSheet = function () {
  const sheet = admin.getSheetByName("JOUEURS");

  if (!sheet) {
    console.error("❌ [joueur] Feuille JOUEURS introuvable.");
    throw new Error("Feuille JOUEURS introuvable.");
  }

  return sheet;
};

/* ============================================================
   findJoueur(nom, prenom)
   ------------------------------------------------------------
   Recherche un joueur RP par nom + prénom (insensible à la casse)
   Retourne :
     - id
     - nom
     - prenom
     - entrepriseID (colonne PRO 2026)
   ============================================================ */
joueur.findJoueur = function (nom, prenom) {
  console.log("🔎 [joueur] Recherche :", nom, prenom);

  const sheet = joueur.getSheet();
  const data = sheet.getDataRange().getValues();

  const targetNom = String(nom).toLowerCase();
  const targetPrenom = String(prenom).toLowerCase();

  for (let i = 1; i < data.length; i++) {
    const n = String(data[i][1] || "").toLowerCase(); // Nom
    const p = String(data[i][2] || "").toLowerCase(); // Prénom

    if (n === targetNom && p === targetPrenom) {
      const result = {
        id: data[i][0],          // Joueur_ID
        nom: data[i][1],         // Nom
        prenom: data[i][2],      // Prénom
        entrepriseID: data[i][3] // Entreprise_ID (PRO 2026)
      };

      console.log("🟩 [joueur] Joueur trouvé :", result);
      return result;
    }
  }

  console.warn("🟧 [joueur] Aucun joueur trouvé pour :", nom, prenom);
  return null;
};

console.log("🟩 [joueur.gs] Module JOUEURS chargé avec succès.");