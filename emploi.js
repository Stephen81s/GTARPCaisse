/**
 * ============================================================
 *  FICHIER : emploi.gs
 *  MODULE  : RP BUSINESS SYSTEM — EMPLOIS
 *  VERSION : PRO 2026
 * ============================================================
 */

var emploi = {

  /**
   * Retourne la feuille EMPLOIS
   */
  getSheet: function () {
    return admin.getSheetByName("EMPLOIS");
  },

  /**
   * ============================================================
   *  listEmplois(entrepriseID)
   *  Description :
   *      Retourne tous les emplois d’une entreprise.
   *      Si entrepriseID = null → retourne tous les emplois.
   * ============================================================
   */
  listEmplois: function (entrepriseID) {

    const sheet = emploi.getSheet();
    const data = sheet.getDataRange().getValues();
    const result = [];

    for (let i = 1; i < data.length; i++) {

      const rowEntrepriseID = data[i][1];

      if (!entrepriseID || rowEntrepriseID === entrepriseID) {

        result.push({
          id: data[i][0],             // Emploi_ID
          entrepriseID: data[i][1],   // Entreprise_ID
          nom: data[i][2],            // Nom
          description: data[i][3],    // Description
          actif: data[i][4]           // Actif
        });
      }
    }

    return result;
  },

  /**
   * ============================================================
   *  getEmploi(emploiID)
   *  Description :
   *      Retourne un emploi précis par son ID.
   * ============================================================
   */
  getEmploi: function (emploiID) {

    const sheet = emploi.getSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {

      if (data[i][0] === emploiID) {

        return {
          id: data[i][0],
          entrepriseID: data[i][1],
          nom: data[i][2],
          description: data[i][3],
          actif: data[i][4]
        };
      }
    }

    return null;
  },

  /**
   * ============================================================
   *  disableEmploi(emploiID)
   *  Description :
   *      Désactive un emploi (Actif = false)
   * ============================================================
   */
  disableEmploi: function (emploiID) {

    const sheet = emploi.getSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {

      if (data[i][0] === emploiID) {
        sheet.getRange(i + 1, 5).setValue(false); // Colonne Actif
        return true;
      }
    }

    throw new Error("Emploi introuvable : " + emploiID);
  }

};