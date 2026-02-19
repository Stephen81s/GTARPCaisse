/**
 * ============================================================
 *  FICHIER : employes.gs
 *  MODULE  : RP BUSINESS SYSTEM — EMPLOYÉS
 *  VERSION : PRO 2026
 *  AUTEUR  : Stephen + Copilot PRO
 * ------------------------------------------------------------
 *  DESCRIPTION :
 *    Gestion des employés :
 *      - Accès feuille EMPLOYES
 *      - Recherche par ID / joueur / entreprise
 *      - Liste des employés actifs
 *      - Assignation (via admin.assignPlayerToEmploi)
 *      - Changement de grade
 *      - Désactivation (licenciement)
 * ------------------------------------------------------------
 *  FEUILLE : EMPLOYES
 *  COLONNES :
 *    [0] Employe_ID
 *    [1] Joueur_ID
 *    [2] Entreprise_ID
 *    [3] Emploi_ID
 *    [4] Grade_ID
 *    [5] Date_embauche
 *    [6] Actif
 * ============================================================
 */

console.log("🟦 [employes.gs] Module EMPLOYÉS chargé.");

var employes = {

  /**
   * Retourne la feuille EMPLOYES.
   */
  getSheet: function () {
    return admin.getSheetByName(consts.SHEET_EMPLOYES);
  },

  /**
   * Retourne toutes les lignes brutes.
   */
  getAllRaw: function () {
    const sheet = employes.getSheet();
    return sheet.getDataRange().getValues();
  },

  /**
   * Transforme une ligne en objet employé.
   */
  mapRowToObject: function (row) {
    return {
      id: row[0],
      joueurID: row[1],
      entrepriseID: row[2],
      emploiID: row[3],
      gradeID: row[4],
      dateEmbauche: row[5],
      actif: row[6] === true
    };
  },

  /**
   * Recherche un employé par ID.
   */
  findByID: function (id) {
    const data = employes.getAllRaw();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        return employes.mapRowToObject(data[i]);
      }
    }

    return null;
  },

  /**
   * Liste les employés d'une entreprise.
   */
  listByEntreprise: function (entrepriseID, onlyActive) {
    const data = employes.getAllRaw();
    const results = [];

    for (let i = 1; i < data.length; i++) {
      const row = employes.mapRowToObject(data[i]);
      if (row.entrepriseID !== entrepriseID) continue;
      if (onlyActive && !row.actif) continue;
      results.push(row);
    }

    return results;
  },

  /**
   * Liste les employés d’un joueur (toutes entreprises).
   */
  listByJoueur: function (joueurID, onlyActive) {
    const data = employes.getAllRaw();
    const results = [];

    for (let i = 1; i < data.length; i++) {
      const row = employes.mapRowToObject(data[i]);
      if (row.joueurID !== joueurID) continue;
      if (onlyActive && !row.actif) continue;
      results.push(row);
    }

    return results;
  },

  /**
   * Liste tous les employés (option : seulement actifs).
   */
  listAll: function (onlyActive) {
    const data = employes.getAllRaw();
    const results = [];

    for (let i = 1; i < data.length; i++) {
      const row = employes.mapRowToObject(data[i]);
      if (onlyActive && !row.actif) continue;
      results.push(row);
    }

    return results;
  },

  /**
   * Change le grade d’un employé.
   */
  updateGrade: function (employeID, newGradeID) {
    if (!admin.isAdmin()) throw new Error("Accès refusé.");

    const sheet = employes.getSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === employeID) {
        sheet.getRange(i + 1, 5).setValue(newGradeID);
        Logger.log("🟩 [employes] Grade mis à jour pour employé : " + employeID);
        return true;
      }
    }

    return false;
  },

  /**
   * Désactive un employé (licenciement).
   */
  deactivateEmploye: function (employeID) {
    if (!admin.isAdmin()) throw new Error("Accès refusé.");

    const sheet = employes.getSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === employeID) {
        sheet.getRange(i + 1, 7).setValue(false);
        Logger.log("🟥 [employes] Employé désactivé : " + employeID);
        return true;
      }
    }

    return false;
  }

};

console.log("🟩 [employes.gs] Module EMPLOYÉS chargé avec succès.");