/****************************************************
 * include.gs
 * --------------------------------------------------
 * Fournit la fonction include() utilisée dans :
 *   <?!= include('nom_du_fichier') ?>
 *
 * Cette fonction charge un fichier HTML et renvoie
 * son contenu sous forme de chaîne.
 *
 * Si un fichier est introuvable ou plante, un log
 * clair est envoyé dans la console Apps Script.
 ****************************************************/

function include(filename) {
  console.log("===== 📄 [INCLUDE] Chargement du fichier :", filename, "=====");

  try {
    // Lecture du fichier HTML
    const content = HtmlService
      .createHtmlOutputFromFile(filename)
      .getContent();

    console.log("🟩 [INCLUDE] Fichier chargé avec succès :", filename);
    return content;

  } catch (err) {
    console.error("💥 [INCLUDE] ERREUR lors du chargement de :", filename);
    console.error("📛 Détails :", err);

    // On renvoie un message HTML visible pour faciliter le debug
    return `
      <div style="padding:10px; border:2px solid red; color:red;">
        <h3>❌ Erreur include("${filename}")</h3>
        <p>${err}</p>
      </div>
    `;
  }
}
