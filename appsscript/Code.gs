/* ============================================================
   FICHIER : Code.gs
   MODULE  : Backend RP Business — Activation via clé + Rôles
   VERSION : PRO 2026
   AUTEUR  : Stephen + Copilot PRO
   ------------------------------------------------------------
   DESCRIPTION :
   - Vérification d’une clé d’activation dans la BDD (feuille KEYS)
   - Attribution du rôle selon la clé
   - Marquage de la clé comme utilisée
   - Réponses JSON standardisées
   ------------------------------------------------------------
   PRÉREQUIS BDD :
   Feuille : KEYS
   Colonnes (ligne 1) :
     A : key
     B : role
     C : used ("yes" / "no")
   Exemple :
     ABC-123-XYZ | joueur           | no
     ADM-999-AAA | admin_principal | no
   ------------------------------------------------------------
   LOGS :
   🟦 [backend] Code.gs chargé.
   ============================================================ */

console.log("🟦 [backend] Code.gs chargé.");

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ============================================================
   ACTIVATION — Vérification de la clé dans la BDD
   ============================================================ */
function ui_activateKey(key) {
  console.log("🟦 [activate] Vérification clé :", key);

  const sheet = SpreadsheetApp.getActive().getSheetByName("KEYS");
  if (!sheet) {
    console.error("❌ [activate] Feuille KEYS introuvable.");
    return { success: false, error: "BDD manquante" };
  }

  const data = sheet.getDataRange().getValues();
  console.log("🟦 [activate] Lignes KEYS chargées :", data.length);

  for (let i = 1; i < data.length; i++) {
    const rowKey  = String(data[i][0]).trim();
    const rowRole = String(data[i][1]).trim();
    const rowUsed = String(data[i][2]).trim();

    if (rowKey === key) {

      if (rowUsed === "yes") {
        console.warn("🟧 [activate] Clé déjà utilisée.");
        return { success: false, error: "Clé déjà utilisée" };
      }

      console.log(`🟩 [activate] Clé valide → rôle = ${rowRole}`);

      // Marquer la clé comme utilisée
      sheet.getRange(i + 1, 3).setValue("yes");

      return { success: true, role: rowRole };
    }
  }

  console.warn("🟥 [activate] Clé inconnue.");
  return { success: false, error: "Clé invalide" };
}

/* ============================================================
   POINT D’ENTRÉE WEBAPP — doGet
   ============================================================ */
function doGet(e) {
  const params = e?.parameter || {};
  const action = params.action || "";
  console.log("🟦 [api] doGet action :", action, "params :", JSON.stringify(params));

  try {
    switch (action) {

      case "ui_activateKey":
        return json(ui_activateKey(params.key));

      default:
        console.warn("🟧 [api] Action inconnue :", action);
        return json({ error: "Action inconnue : " + action });
    }

  } catch (err) {
    console.error("❌ [api] Erreur doGet :", err);
    return json({ error: "Erreur serveur : " + err });
  }
}