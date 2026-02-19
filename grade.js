/**
 * ============================================================
 *  FICHIER : grade.gs
 *  MODULE  : RP BUSINESS SYSTEM — GRADES
 *  VERSION : PRO 2026
 * ============================================================
 */

var grade = {

  /**
   * Retourne la feuille GRADES
   */
  getSheet: function () {
    return admin.getSheetByName("GRADES");
  },

  /**
   * ============================================================
   *  listGrades(emploiID)
   *  Description :
   *      Retourne tous les grades d’un emploi.
   *      Si emploiID = null → retourne tous les grades.
   * ============================================================
   */
  listGrades: function (emploiID) {

    const sheet = grade.getSheet();
    const data = sheet.getDataRange().getValues();
    const result = [];

    for (let i = 1; i < data.length; i++) {

      const rowEmploiID = data[i][1];

      if (!emploiID || rowEmploiID === emploiID) {

        result.push({
          id: data[i][0],           // Grade_ID
          emploiID: data[i][1],     // Emploi_ID
          nom: data[i][2],          // Nom
          niveau: data[i][3],       // Niveau
          salaire: data[i][4],      // Salaire
          actif: data[i][5]         // Actif
        });
      }
    }

    return result;
  },

  /**
   * ============================================================
   *  getGrade(gradeID)
   *  Description :
   *      Retourne un grade précis par son ID.
   * ============================================================
   */
  getGrade: function (gradeID) {

    const sheet = grade.getSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {

      if (data[i][0] === gradeID) {

        return {
          id: data[i][0],
          emploiID: data[i][1],
          nom: data[i][2],
          niveau: data[i][3],
          salaire: data[i][4],
          actif: data[i][5]
        };
      }
    }

    return null;
  },

  /**
   * ============================================================
   *  disableGrade(gradeID)
   *  Description :
   *      Désactive un grade (Actif = false)
   * ============================================================
   */
  disableGrade: function (gradeID) {

    const sheet = grade.getSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {

      if (data[i][0] === gradeID) {
        sheet.getRange(i + 1, 6).setValue(false); // Colonne Actif
        return true;
      }
    }

    throw new Error("Grade introuvable : " + gradeID);
  }

};