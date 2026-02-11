/****************************************************
 * Ticket_core.gs
 * --------------------------------------------------
 * Validation d’un ticket :
 *  - Vérifie si le ticket existe
 *  - Vérifie s’il est déjà utilisé
 *  - Marque comme utilisé
 *  - Retourne { success: true/false }
 ****************************************************/

function validerTicket(code) {
  console.log("===== 🎟️ [TICKET] DÉBUT validerTicket() =====");
  console.log("🔎 Ticket reçu :", code);

  try {
    const ss = SpreadsheetApp.getActive();
    const sheet = ss.getSheetByName(SHEET_TICKETS);

    if (!sheet) {
      console.error("💥 [TICKET] Feuille Tickets introuvable");
      return { success: false, error: "Feuille Tickets introuvable" };
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      console.warn("📭 [TICKET] Aucun ticket dans la feuille");
      return { success: false };
    }

    // Lecture des tickets
    const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    // Colonnes attendues :
    // A = Code
    // B = Utilisé (TRUE/FALSE)

    for (let i = 0; i < data.length; i++) {
      const rowCode = String(data[i][0]).trim();
      const used = Boolean(data[i][1]);

      if (rowCode === code) {
        if (used) {
          console.warn("⚠️ [TICKET] Ticket déjà utilisé :", code);
          return { success: false };
        }

        // Marquer comme utilisé
        sheet.getRange(i + 2, 2).setValue(true);

        console.log("🟩 [TICKET] Ticket validé :", code);
        console.log("===== 🟩 FIN validerTicket() =====");
        return { success: true };
      }
    }

    console.warn("⚠️ [TICKET] Ticket introuvable :", code);
    return { success: false };

  } catch (err) {
    console.error("💥 [TICKET] ERREUR validerTicket()", err);
    return { success: false, error: err.toString() };
  }
}
