/**
 * ============================================================
 *  createEntreprise(nom, patronNom, patronPrenom)
 *  Auteur : Stephen
 *  Version : PRO 2026
 *  Description :
 *      Crée une entreprise PRO 2026 :
 *        - ID auto-incrémenté
 *        - Patron_ID (lien vers JOUEURS)
 *        - Champs standards
 *        - Entreprise active
 * ============================================================
 */
function createEntreprise(nom, patronNom, patronPrenom) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetEnt = ss.getSheetByName("ENTREPRISES");
  const sheetJ = ss.getSheetByName("JOUEURS");

  // ============================================================
  // 1) Trouver le joueur patron
  // ============================================================
  const data = sheetJ.getDataRange().getValues();
  let patronID = null;

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === patronNom && data[i][2] === patronPrenom) {
      patronID = data[i][0];
      break;
    }
  }

  if (!patronID)
    throw new Error("Joueur introuvable : " + patronNom + " " + patronPrenom);

  // ============================================================
  // 2) Générer ID entreprise
  // ============================================================
  const entrepriseID = getNextID("ENT", "ENTREPRISES", "Entreprise_ID");

  // ============================================================
  // 3) Créer l’entreprise
  // ============================================================
  sheetEnt.appendRow([
    entrepriseID,   // ID
    nom,            // Nom
    patronID,       // Patron_ID
    "",             // Type (optionnel)
    "",             // Catégorie
    "",             // Description
    "",             // Logo_URL
    "",             // Clé (optionnel)
    new Date(),     // Date_activation
    "",             // Date_expiration
    true            // Actif
  ]);

  // ============================================================
  // 4) Log interne
  // ============================================================
  const sheetLogs = ss.getSheetByName("LOGS");
  sheetLogs.appendRow([
    new Date(),
    "Création entreprise",
    entrepriseID,
    patronID,
    "SYSTEM"
  ]);

  Logger.log("🏢 Entreprise créée : " + entrepriseID + " (" + nom + ")");
  Logger.log("👑 Patron : " + patronID);

  return entrepriseID;
}