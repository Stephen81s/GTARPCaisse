/**
 * ============================================================
 *  FICHIER : emplois.gs
 *  MODULE  : RP BUSINESS SYSTEM — EMPLOIS
 *  VERSION : PRO 2026
 *  AUTEUR  : Stephen + Copilot PRO
 * ------------------------------------------------------------
 *  DESCRIPTION :
 *    Gestion des emplois d'une entreprise :
 *      - Accès feuille EMPLOIS
 *      - Recherche par ID / entreprise
 *      - Liste des emplois actifs
 *      - Création (via admin.createEmploi)
 *      - Mise à jour / désactivation
 * ------------------------------------------------------------
 *  FEUILLE : EMPLOIS
 *  COLONNES :
 *    [0] Emploi_ID
 *    [1] Entreprise_ID
 *    [2] Nom
 *    [3] Description
 *    [4] Actif
 * ============================================================
 */

console.log("🟦 [emplois.gs] Module EMPLOIS chargé.");

var emplois = {

  /**
   * Retourne la feuille EMPLOIS.
   */
  getSheet: function () {
    return admin.getSheetByName(consts.SHEET_EMPLOIS);
  },

  /**
   * Retourne toutes les lignes brutes.
   */
  getAllRaw: function () {
    const sheet = emplois.getSheet();
    return sheet.getDataRange().getValues();
  },

  /**
   * Transforme une ligne en objet emploi.
   */
  mapRowToObject: function (row) {
    return {
      id: row[0],
      entrepriseID: row[1],
      nom: row[2],
      description: row[3],
      actif: row[4] === true
    };
  },

  /**
   * Recherche un emploi par ID.
   */
  findByID: function (id) {
    const data = emplois.getAllRaw();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        return emplois.mapRowToObject(data[i]);
      }
    }

    return null;
  },

  /**
   * Liste les emplois d'une entreprise.
   */
  listByEntreprise: function (entrepriseID, onlyActive) {
    const data = emplois.getAllRaw();
    const results = [];

    for (let i = 1; i < data.length; i++) {
      const row = emplois.mapRowToObject(data[i]);
      if (row.entrepriseID !== entrepriseID) continue;
      if (onlyActive && !row.actif) continue;
      results.push(row);
    }

    return results;
  },

  /**
   * Liste tous les emplois (option : seulement actifs).
   */
  listAll: function (onlyActive) {
    const data = emplois.getAllRaw();
    const results = [];

    for (let i = 1; i < data.length; i++) {
      const row = emplois.mapRowToObject(data[i]);
      if (onlyActive && !row.actif) continue;
      results.push(row);
    }

    return results;
  },

  /**
   * Met à jour un emploi.
   * fields = { nom, description, actif }
   */
  updateEmploi: function (id, fields) {
    if (!admin.isAdmin()) throw new Error("Accès refusé.");

    const sheet = emplois.getSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {

        if (fields.nom !== undefined) sheet.getRange(i + 1, 3).setValue(fields.nom);
        if (fields.description !== undefined) sheet.getRange(i + 1, 4).setValue(fields.description);
        if (fields.actif !== undefined) sheet.getRange(i + 1, 5).setValue(fields.actif === true);

        Logger.log("🟩 [emplois] Emploi mis à jour : " + id);
        return true;
      }
    }

    return false;
  },

  /**
   * Désactive un emploi.
   */
  deactivateEmploi: function (id) {
    return emplois.updateEmploi(id, { actif: false });
  }

};

console.log("🟩 [emplois.gs] Module EMPLOIS chargé avec succès.");