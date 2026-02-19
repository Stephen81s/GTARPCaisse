/**
 * ============================================================
 *  FICHIER : joueur.gs
 *  MODULE  : RP BUSINESS SYSTEM — JOUEURS
 *  VERSION : PRO 2026
 * ============================================================
 */

var joueur = {

  /**
   * Retourne la feuille JOUEURS
   */
  getSheet: function () {
    return admin.getSheetByName("JOUEURS");
  },

  /**
   * ============================================================
   *  findJoueur(nom, prenom)
   *  Description :
   *      Recherche un joueur RP par nom + prénom (insensible à la casse)
   *      Retourne :
   *        - id
   *        - nom
   *        - prenom
   *        - entrepriseID (nouvelle colonne PRO 2026)
   * ============================================================
   */
  findJoueur: function (nom, prenom) {

    const sheet = joueur.getSheet();
    const data = sheet.getDataRange().getValues();

    const targetNom = String(nom).toLowerCase();
    const targetPrenom = String(prenom).toLowerCase();

    for (let i = 1; i < data.length; i++) {

      const n = String(data[i][1] || "").toLowerCase(); // Nom
      const p = String(data[i][2] || "").toLowerCase(); // Prenom

      if (n === targetNom && p === targetPrenom) {

        return {
          id: data[i][0],             // Joueur_ID
          nom: data[i][1],            // Nom
          prenom: data[i][2],         // Prenom
          entrepriseID: data[i][3]    // Entreprise_ID (nouvelle colonne PRO 2026)
        };
      }
    }

    return null;
  }

};