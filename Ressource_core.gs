/****************************************************
 * Ressource_core.gs
 * --------------------------------------------------
 * Enregistrement d’une ressource :
 *  - ressource (nom)
 *  - qte (quantité)
 *  - horodatage
 *  - employé (optionnel si tu veux l’ajouter plus tard)
 ****************************************************/

function enregistrerRessource(payload) {
  console.log("===== 🟨 [RESSOURCE] DÉBUT enregistrerRessource() =====");
  console.log("📥 Payload reçu :", payload);

  try {
    const ss = SpreadsheetApp.getActive();
    const sheet = ss.getSheetByName(SHEET_ITEMS_CACHE);

    if (!sheet) {
      console.error("💥 [RESSOURCE] Feuille ItemCache introuvable");
      return { success: false, error: "Feuille ItemCache introuvable" };
    }

    const horodatage = new Date();

    // Format d’enregistrement :
    // A = Date
    // B = Ressource
    // C = Quantité
    sheet.appendRow([
      horodatage,
      payload.ressource,
      payload.qte
    ]);

    console.log("🟩 [RESSOURCE] Ressource enregistrée :", payload);
    console.log("===== 🟩 FIN enregistrerRessource() =====");

    return { success: true };

  } catch (err) {
    console.error("💥 [RESSOURCE] ERREUR enregistrerRessource()", err);
    return { success: false, error: err.toString() };
  }
}
