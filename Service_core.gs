/****************************************************
 * Service_core.gs
 * --------------------------------------------------
 * Enregistrement d’un service :
 *  - nom du service
 *  - prix
 *  - horodatage
 *  - employé (optionnel si tu veux l’ajouter plus tard)
 ****************************************************/

function enregistrerService(payload) {
  console.log("===== 🟪 [SERVICE] DÉBUT enregistrerService() =====");
  console.log("📥 Payload reçu :", payload);

  try {
    const ss = SpreadsheetApp.getActive();
    const sheet = ss.getSheetByName(SHEET_RESUME);

    if (!sheet) {
      console.error("💥 [SERVICE] Feuille Résumé introuvable");
      return { success: false, error: "Feuille Résumé introuvable" };
    }

    const horodatage = new Date();

    // Format d’enregistrement :
    // A = Date
    // B = Type (ici : "Service")
    // C = Nom du service
    // D = Prix
    // E = Employé (optionnel)
    sheet.appendRow([
      horodatage,
      "Service",
      payload.nom,
      payload.prix,
      "" // champ employé si tu veux l’ajouter plus tard
    ]);

    console.log("🟩 [SERVICE] Service enregistré :", payload);
    console.log("===== 🟩 FIN enregistrerService() =====");

    return { success: true };

  } catch (err) {
    console.error("💥 [SERVICE] ERREUR enregistrerService()", err);
    return { success: false, error: err.toString() };
  }
}
