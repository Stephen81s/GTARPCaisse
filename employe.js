/**
 * ============================================================
 *  FICHIER : employe.gs
 *  MODULE  : RP BUSINESS SYSTEM — EMPLOYÉS
 *  VERSION : PRO 2026
 * ============================================================
 */

var employe = {

  /**
   * Retourne la feuille EMPLOYES
   */
  getSheet: function () {
    return admin.getSheetByName("EMPLOYES");
  },

  /**
   * ============================================================
   *  listEmployes(entrepriseID)
   *  Description :
   *      Retourne tous les employés d’une entreprise.
   *      Si entrepriseID = null → retourne tous les employés.
   * ============================================================
   */
  listEmployes: function (entrepriseID) {

    const sheet = employe.getSheet();
    const data = sheet.getDataRange().getValues();
    const result = [];

    for (let i = 1; i < data.length; i++) {

      const rowEntrepriseID = data[i][2];

      if (!entrepriseID || rowEntrepriseID === entrepriseID) {

        result.push({
          id: data[i][0],             // Employe_ID
          joueurID: data[i][1],       // Joueur_ID
          entrepriseID: data[i][2],   // Entreprise_ID
          emploiID: data[i][3],       // Emploi_ID
          gradeID: data[i][4],        // Grade_ID
          dateEmbauche: data[i][5],   // Date_embauche
          actif: data[i][6]           // Actif
        });
      }
    }

    return result;
  },

  /**
   * ============================================================
   *  getEmploye(employeID)
   *  Description :
   *      Retourne un employé précis par son ID.
   * ============================================================
   */
  getEmploye: function (employeID) {

    const sheet = employe.getSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {

      if (data[i][0] === employeID) {

        return {
          id: data[i][0],
          joueurID: data[i][1],
          entrepriseID: data[i][2],
          emploiID: data[i][3],
          gradeID: data[i][4],
          dateEmbauche: data[i][5],
          actif: data[i][6]
        };
      }
    }

    return null;
  },

  /**
   * ============================================================
   *  listEmployesByEmploi(emploiID)
   *  Description :
   *      Retourne tous les employés d’un emploi donné.
   * ============================================================
   */
  listEmployesByEmploi: function (emploiID) {

    const sheet = employe.getSheet();
    const data = sheet.getDataRange().getValues();
    const result = [];

    for (let i = 1; i < data.length; i++) {

      if (data[i][3] === emploiID) {

        result.push({
          id: data[i][0],
          joueurID: data[i][1],
          entrepriseID: data[i][2],
          emploiID: data[i][3],
          gradeID: data[i][4],
          dateEmbauche: data[i][5],
          actif: data[i][6]
        });
      }
    }

    return result;
  },

  /**
   * ============================================================
   *  disableEmploye(employeID)
   *  Description :
   *      Désactive un employé (Actif = false)
   * ============================================================
   */
  disableEmploye: function (employeID) {

    const sheet = employe.getSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {

      if (data[i][0] === employeID) {
        sheet.getRange(i + 1, 7).setValue(false); // Colonne Actif
        return true;
      }
    }

    throw new Error("Employé introuvable : " + employeID);
  }

};