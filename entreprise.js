/**
 * ============================================================
 *  FICHIER : entreprise.gs
 *  MODULE  : RP BUSINESS SYSTEM — ENTREPRISES
 *  VERSION : PRO 2026
 * ============================================================
 */

var entreprise = {

  getSheet: function () {
    return admin.getSheetByName("ENTREPRISES");
  },

  /**
   * ============================================================
   *  listEntreprises()
   *  Retourne toutes les entreprises PRO 2026
   * ============================================================
   */
  listEntreprises: function () {
    const sheet = entreprise.getSheet();
    const data = sheet.getDataRange().getValues();
    const result = [];

    for (let i = 1; i < data.length; i++) {

      result.push({
        id: data[i][0],              // Entreprise_ID
        nom: data[i][1],             // Nom
        patronID: data[i][2],        // Patron_ID
        type: data[i][3],            // Type (optionnel)
        categorie: data[i][4],       // Catégorie (optionnel)
        description: data[i][5],     // Description
        logo: data[i][6],            // Logo_URL
        cle: data[i][7],             // Clé
        dateCreation: data[i][8],    // Date_activation
        dateExpiration: data[i][9],  // Date_expiration
        actif: data[i][10]           // Actif
      });
    }

    return result;
  },

  /**
   * ============================================================
   *  generateKeyForEntreprise(entrepriseID)
   *  Génère une nouvelle clé AAA-123-BBB pour une entreprise
   * ============================================================
   */
  generateKeyForEntreprise: function (entrepriseID) {
    const sheet = entreprise.getSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === entrepriseID) {

        const key = generateKey(); // version PRO 2026 validée
        sheet.getRange(i + 1, 8).setValue(key); // colonne Cle = index 7 → colonne 8

        return key;
      }
    }

    throw new Error("Entreprise introuvable : " + entrepriseID);
  }

};