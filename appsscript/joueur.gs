/**
 * ============================================================
 *  FICHIER : joueur.gs
 *  MODULE  : RP BUSINESS SYSTEM — JOUEURS
 *  VERSION : PRO 2026
 *  AUTEUR  : Stephen + Copilot PRO
 * ------------------------------------------------------------
 *  DESCRIPTION :
 *    Gestion des joueurs :
 *      - Accès feuille JOUEURS
 *      - Recherche par ID / nom
 *      - Création (via admin.createJoueur)
 *      - Normalisation des noms
 *      - Mise à jour / désactivation
 * ------------------------------------------------------------
 *  FEUILLE : JOUEURS
 *  COLONNES :
 *    [0] Joueur_ID
 *    [1] Nom
 *    [2] Prenom
 *    [3] Notes
 *    [4] Date_creation
 * ============================================================
 */

console.log("🟦 [joueur.gs] Module JOUEURS chargé.");

var joueur = {

  /**
   * Retourne la feuille JOUEURS.
   */
  getSheet: function () {
    return admin.getSheetByName(consts.SHEET_JOUEURS);
  },

  /**
   * Retourne toutes les lignes brutes.
   */
  getAllRaw: function () {
    const sheet = joueur.getSheet();
    return sheet.getDataRange().getValues();
  },

  /**
   * Transforme une ligne en objet joueur.
   */
  mapRowToObject: function (row) {
    return {
      id: row[0],
      nom: row[1],
      prenom: row[2],
      notes: row[3],
      dateCreation: row[4]
    };
  },

  /**
   * Recherche un joueur par ID.
   */
  findByID: function (id) {
    const data = joueur.getAllRaw();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        return joueur.mapRowToObject(data[i]);
      }
    }

    return null;
  },

  /**
   * Recherche un joueur par nom + prénom.
   * Normalisation PRO 2026.
   */
  findByName: function (nom, prenom) {
    const n = utils.normalizeName(nom);
    const p = utils.normalizeName(prenom);

    const data = joueur.getAllRaw();

    for (let i = 1; i < data.length; i++) {
      if (
        utils.normalizeName(data[i][1]) === n &&
        utils.normalizeName(data[i][2]) === p
      ) {
        return joueur.mapRowToObject(data[i]);
      }
    }

    return null;
  },

  /**
   * Trouve un joueur ou le crée automatiquement.
   * Utilisé par admin.createEntreprise().
   */
  findOrCreate: function (nom, prenom) {
    const existing = joueur.findByName(nom, prenom);
    if (existing) return existing.id;

    // Création via admin
    const id = admin.createJoueur(nom, prenom);
    return id;
  },

  /**
   * Liste tous les joueurs.
   */
  listAll: function () {
    const data = joueur.getAllRaw();
    const results = [];

    for (let i = 1; i < data.length; i++) {
      results.push(joueur.mapRowToObject(data[i]));
    }

    return results;
  },

  /**
   * Met à jour un joueur.
   * fields = { nom, prenom, notes }
   */
  updateJoueur: function (id, fields) {
    if (!admin.isAdmin()) throw new Error("Accès refusé.");

    const sheet = joueur.getSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {

        if (fields.nom !== undefined)
          sheet.getRange(i + 1, 2).setValue(utils.normalizeName(fields.nom));

        if (fields.prenom !== undefined)
          sheet.getRange(i + 1, 3).setValue(utils.normalizeName(fields.prenom));

        if (fields.notes !== undefined)
          sheet.getRange(i + 1, 4).setValue(fields.notes);

        Logger.log("🟩 [joueur] Joueur mis à jour : " + id);
        return true;
      }
    }

    return false;
  }

};

console.log("🟩 [joueur.gs] Module JOUEURS chargé avec succès.");