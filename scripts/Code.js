function ui_activateKey(key) {
  console.log("🟦 [activate] Vérification clé :", key);

  const sheet = SpreadsheetApp.getActive().getSheetByName("KEYS");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const rowKey = String(data[i][0]).trim();
    const rowRole = String(data[i][1]).trim();
    const rowUsed = String(data[i][2]).trim();

    if (rowKey === key) {

      if (rowUsed === "yes") {
        console.warn("🟧 [activate] Clé déjà utilisée.");
        return { success: false, error: "Clé déjà utilisée" };
      }

      console.log("🟩 [activate] Clé valide → rôle :", rowRole);

      // Marquer la clé comme utilisée
      sheet.getRange(i + 1, 3).setValue("yes");

      return { success: true, role: rowRole };
    }
  }

  console.warn("🟥 [activate] Clé inconnue.");
  return { success: false, error: "Clé invalide" };
}