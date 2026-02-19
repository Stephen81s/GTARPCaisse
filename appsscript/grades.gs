/**
 * ============================================================
 *  FICHIER : grades.gs
 *  MODULE  : RP BUSINESS SYSTEM — GRADES
 *  VERSION : PRO 2026
 *  AUTEUR  : Stephen + Copilot PRO
 * ------------------------------------------------------------
 *  DESCRIPTION :
 *    Gestion des grades d’un emploi :
 *      - Accès feuille GRADES
 *      - Recherche par ID / emploi
 *      - Liste des grades actifs
 *      - Création (via admin.createGrade)
 *      - Mise à jour / désactivation
 * ------------------------------------------------------------
 *  FEUILLE : GRADES
 *  COLONNES :
 *    [0] Grade_ID
 *    [1] Emploi_ID
 *    [2] Nom
 *    [3] Niveau
 *    [4] Salaire
 *    [5] Actif
 * ============================================================
 */

console.log("🟦 [grades.gs] Module GRADES chargé.");

var grades = {

  /**
   * Retourne la feuille GRADES.
   */
  getSheet: function () {
    return admin.getSheetByName(consts.SHEET_GRADES);
  },

  /**
   * Retourne toutes les lignes brutes.
   */
  getAllRaw: function () {
    const sheet = grades.getSheet();
    return sheet.getDataRange().getValues();
  },

  /**
   * Transforme une ligne en objet grade.
   */
  mapRowToObject: function (row) {
    return {
      id: row[0],
      emploiID: row[1],
      nom: row[2],
      niveau: row[3],
      salaire: row[4],
      actif: row[5] === true
    };
  },

  /**
   * Recherche un grade par ID.
   */
  findByID: function (id) {
    const data = grades.getAllRaw();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        return grades.mapRowToObject(data[i]);
      }
    }

    return null;
  },

  /**
   * Liste les grades d’un emploi.
   */
  listByEmploi: function (emploiID, onlyActive) {
    const data = grades.getAllRaw();
    const results = [];

    for (let i = 1; i < data.length; i++) {
      const row = grades.mapRowToObject(data[i]);
      if (row.emploiID !== emploiID) continue;
      if (onlyActive && !row.actif) continue;
      results.push(row);
    }

    return results;
  },

  /**
   * Liste tous les grades (option : seulement actifs).
   */
  listAll: function (onlyActive) {
    const data = grades.getAllRaw();
    const results = [];

    for (let i = 1; i < data.length; i++) {
      const row = grades.mapRowToObject(data[i]);
      if (onlyActive && !row.actif) continue;
      results.push(row);
    }

    return results;
  },

  /**
   * Met à jour un grade.
   * fields = { nom, niveau, salaire, actif }
   */
  updateGrade: function (id, fields) {
    if (!admin.isAdmin()) throw new Error("Accès refusé.");

    const sheet = grades.getSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {

        if (fields.nom !== undefined) sheet.getRange(i + 1, 3).setValue(fields.nom);
        if (fields.niveau !== undefined) sheet.getRange(i + 1, 4).setValue(fields.niveau);
        if (fields.salaire !== undefined) sheet.getRange(i + 1, 5).setValue(fields.salaire);
        if (fields.actif !== undefined) sheet.getRange(i + 1, 6).setValue(fields.actif === true);

        Logger.log("🟩 [grades] Grade mis à jour : " + id);
        return true;
      }
    }

    return false;
  },

  /**
   * Désactive un grade.
   */
  deactivateGrade: function (id) {
    return grades.updateGrade(id, { actif: false });
  }

};

console.log("🟩 [grades.gs] Module GRADES chargé avec succès.");