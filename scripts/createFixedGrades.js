/**
 * ============================================================
 *  createFixedGrades(emploiID)
 *  Auteur : Stephen
 *  Version : PRO 2026
 *  Description :
 *      Crée les 4 grades fixes pour un EMPLOI :
 *      Patron, Manager, Employé, Recrue.
 * ============================================================
 */
function createFixedGrades(emploiID) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("GRADES");

  const fixedGrades = [
    ["Patron", 4],
    ["Manager", 3],
    ["Employé", 2],
    ["Recrue", 1]
  ];

  fixedGrades.forEach((g) => {
    const gradeID = getNextID("GR", "GRADES", "Grade_ID");

    sheet.appendRow([
      gradeID,       // Grade_ID
      emploiID,      // Emploi_ID
      g[0],          // Nom
      g[1],          // Niveau
      0,             // Salaire (par défaut)
      true           // Actif
    ]);

    Logger.log(`🎖️ Grade fixe ajouté : ${g[0]} → ${gradeID}`);
  });
}