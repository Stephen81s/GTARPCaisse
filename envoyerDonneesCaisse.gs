/**
 * @file envoyerDonneesCaisse.gs
 * @description Traite la validation de la caisse :
 *              - met à jour le stock
 *              - écrit dans Résumé
 *              - met à jour la comptabilité
 *              - renvoie un statut au frontend
 *
 * Auteur : Stephen
 * Version : 1.0.0
 * Mis à jour : 2026-02-10
 *
 * Dépendances :
 *   - SHEET_ARTICLES
 *   - SHEET_RESUME
 *   - SHEET_COMPTA
 */

function envoyerDonneesCaisse(payload) {
  console.log("===== 📤 DÉBUT envoyerDonneesCaisse() =====");
  console.log("Payload reçu :", payload);

  try {
    const ss = SpreadsheetApp.getActive();

    /****************************************************
     * 1) MISE À JOUR DU STOCK
     ****************************************************/
    const shArticles = ss.getSheetByName(SHEET_ARTICLES);
    const data = shArticles.getDataRange().getValues();

    payload.lignes.forEach(ligne => {
      const nom = ligne.article;
      const qte = Number(ligne.quantite);
      const mode = payload.modeOperation;

      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim() === nom) {

          let stockActuel = Number(data[i][3]) || 0;

          if (mode === "Vente") stockActuel -= qte;
          if (mode === "Achat") stockActuel += qte;
          if (mode === "Restock") stockActuel += qte;
          if (mode === "Destock") stockActuel -= qte;

          shArticles.getRange(i + 1, 4).setValue(stockActuel);
          break;
        }
      }
    });

    console.log("🟩 Stock mis à jour.");


    /****************************************************
     * 2) ÉCRITURE DANS RÉSUMÉ
     ****************************************************/
    const shResume = ss.getSheetByName(SHEET_RESUME);

    payload.lignes.forEach(ligne => {
      shResume.appendRow([
        new Date(),
        payload.employe,
        payload.client,
        ligne.article,
        ligne.quantite,
        ligne.prixUnitaire,
        ligne.remise || 0,
        ligne.total,
        ligne.typeCaisse,
        payload.paiement,
        payload.modeOperation
      ]);
    });

    console.log("🟩 Résumé mis à jour.");


    /****************************************************
     * 3) MISE À JOUR COMPTABILITÉ
     ****************************************************/
    const shCompta = ss.getSheetByName(SHEET_COMPTA);

    const legal = Number(shCompta.getRange("B1").getValue()) || 0;
    const illegal = Number(shCompta.getRange("B2").getValue()) || 0;
    const global = Number(shCompta.getRange("B3").getValue()) || 0;

    const newLegal = legal + (payload.totalLegal || 0);
    const newIllegal = illegal + (payload.totalIllegal || 0);
    const newGlobal = global + Number(payload.totalGeneral || 0);

    shCompta.getRange("B1").setValue(newLegal);
    shCompta.getRange("B2").setValue(newIllegal);
    shCompta.getRange("B3").setValue(newGlobal);

    console.log("🟩 Comptabilité mise à jour.");


    /****************************************************
     * 4) RÉPONSE AU FRONTEND
     ****************************************************/
    console.log("===== 🟩 FIN envoyerDonneesCaisse() =====");

    return {
      success: true,
      message: "Caisse enregistrée avec succès."
    };

  } catch (err) {
    console.error("💥 ERREUR envoyerDonneesCaisse :", err);

    return {
      success: false,
      message: "Erreur lors de l’enregistrement de la caisse.",
      error: String(err)
    };
  }
}
