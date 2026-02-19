/**
 * ============================================================
 *  FICHIER : entreprise.gs
 *  MODULE  : RP BUSINESS SYSTEM — ENTREPRISES
 *  VERSION : PRO 2026
 *  AUTEUR  : Stephen + Copilot PRO
 * ------------------------------------------------------------
 *  DESCRIPTION :
 *    Gestion des entreprises :
 *      - Accès feuille ENTREPRISES
 *      - Recherche par ID / Nom
 *      - Liste des entreprises actives
 *      - Création (via admin.createEntreprise)
 *      - Mise à jour / désactivation
 * ------------------------------------------------------------
 *  FEUILLE : ENTREPRISES
 *  COLONNES :
 *    [0] Entreprise_ID
 *    [1] Nom
 *    [2] Patron_ID
 *    [3] Type
 *    [4] Categorie
 *    [5] Description
 *    [6] Logo_URL
 *    [7] Cle
 *    [8] Date_activation
 *    [9] Date_expiration
 *    [10] Actif
 * ============================================================
 */

console.log("🟦 [entreprise.gs] Module ENTREPRISES chargé.");

var entreprise = {

  /**
   * Retourne la feuille ENTREPRISES.
   */
  getSheet: function () {
    return admin.getSheetByName(consts.SHEET_ENTREPRISES);
  },

  /**
   * Retourne toutes les lignes (brutes) de la feuille.
   */
  getAllRaw: function () {
    const sheet = entreprise.getSheet();
    return sheet.getDataRange().getValues();
  },

  /**
   * Transforme une ligne en objet entreprise.
   */
  mapRowToObject: function (row) {
    return {
      id: row[0],
      nom: row[1],
      patronID: row[2],
      type: row[3],
      categorie: row[4],
      description: row[5],
      logoURL: row[6],
      cle: row[7],
      dateActivation: row[8],
      dateExpiration: row[9],
      actif: row[10] === true
    };
  },

  /**
   * Recherche une entreprise par ID.
   */
  findByID: function (id) {
    const data = entreprise.getAllRaw();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        return entreprise.mapRowToObject(data[i]);
      }
    }

    return null;
  },

  /**
   * Recherche une entreprise par nom (insensible à la casse).
   */
  findByName: function (nom) {
    const target = String(nom).toLowerCase();
    const data = entreprise.getAllRaw();

    for (let i = 1; i < data.length; i++) {
      const n = String(data[i][1] || "").toLowerCase();
      if (n === target) {
        return entreprise.mapRowToObject(data[i]);
      }
    }

    return null;
  },

  /**
   * Liste toutes les entreprises (option : seulement actives).
   */
  listEntreprises: function (onlyActive) {
    const data = entreprise.getAllRaw();
    const results = [];

    for (let i = 1; i < data.length; i++) {
      const obj = entreprise.mapRowToObject(data[i]);
      if (onlyActive && !obj.actif) continue;
      results.push(obj);
    }

    return results;
  },

  /**
   * Met à jour certains champs d'une entreprise.
   * fields est un objet : { nom, type, categorie, description, logoURL, actif, dateExpiration, ... }
   */
  updateEntreprise: function (id, fields) {
    if (!admin.isAdmin()) throw new Error("Accès refusé.");

    const sheet = entreprise.getSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        // Colonnes :
        // 0: ID, 1: Nom, 2: Patron_ID, 3: Type, 4: Categorie,
        // 5: Description, 6: Logo_URL, 7: Cle, 8: Date_activation,
        // 9: Date_expiration, 10: Actif
        if (fields.nom !== undefined) sheet.getRange(i + 1, 2).setValue(fields.nom);
        if (fields.patronID !== undefined) sheet.getRange(i + 1, 3).setValue(fields.patronID);
        if (fields.type !== undefined) sheet.getRange(i + 1, 4).setValue(fields.type);
        if (fields.categorie !== undefined) sheet.getRange(i + 1, 5).setValue(fields.categorie);
        if (fields.description !== undefined) sheet.getRange(i + 1, 6).setValue(fields.description);
        if (fields.logoURL !== undefined) sheet.getRange(i + 1, 7).setValue(fields.logoURL);
        if (fields.cle !== undefined) sheet.getRange(i + 1, 8).setValue(fields.cle);
        if (fields.dateActivation !== undefined) sheet.getRange(i + 1, 9).setValue(fields.dateActivation);
        if (fields.dateExpiration !== undefined) sheet.getRange(i + 1, 10).setValue(fields.dateExpiration);
        if (fields.actif !== undefined) sheet.getRange(i + 1, 11).setValue(fields.actif === true);

        Logger.log("🟩 [entreprise] Entreprise mise à jour : " + id);
        return true;
      }
    }

    return false;
  },

  /**
   * Désactive une entreprise (Actif = false, Date_expiration = now).
   */
  deactivateEntreprise: function (id) {
    return entreprise.updateEntreprise(id, {
      actif: false,
      dateExpiration: new Date()
    });
  },

  /**
   * Retourne l'objet patron (ligne JOUEURS) d'une entreprise.
   */
  getPatron: function (entrepriseID) {
    const ent = entreprise.findByID(entrepriseID);
    if (!ent) return null;

    const sheetJ = admin.getSheetByName(consts.SHEET_JOUEURS);
    const dataJ = sheetJ.getDataRange().getValues();

    for (let i = 1; i < dataJ.length; i++) {
      if (dataJ[i][0] === ent.patronID) {
        return {
          id: dataJ[i][0],
          nom: dataJ[i][1],
          prenom: dataJ[i][2]
        };
      }
    }

    return null;
  }

};

console.log("🟩 [entreprise.gs] Module ENTREPRISES chargé avec succès.");