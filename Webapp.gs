/****************************************************
 * 🌐 Webapp.gs
 * --------------------------------------------------
 * Point d’entrée du WebApp.
 *
 * - Active le moteur de templating (obligatoire pour <?!= ?>)
 * - Charge Index.html (respecte la MAJUSCULE)
 * - Autorise l’affichage dans un iframe (FiveM)
 * - Ajoute un titre d’onglet
 * - Logge tout pour debug
 *
 * ⚠️ Aucun changement de nom de fonction.
 ****************************************************/
function doGet(e) {

  console.log("🌐 [WEBAPP] doGet() APPELÉ");

  /****************************************************
   * 1) LOG DES PARAMÈTRES REÇUS
   ****************************************************/
  try {
    if (e) {
      console.log("🌐 [WEBAPP] Paramètres reçus :", JSON.stringify(e, null, 2));
    } else {
      console.log("🌐 [WEBAPP] Aucun paramètre reçu.");
    }
  } catch (err) {
    console.warn("⚠️ [WEBAPP] Impossible de logger les paramètres :", err);
  }


  /****************************************************
   * 2) CHARGEMENT DU TEMPLATE INDEX.HTML
   ****************************************************/
  let template;

  try {
    console.log("📄 [WEBAPP] Chargement du template Index.html…");

    // ⚠️ IMPORTANT : templating activé → include() fonctionne
    template = HtmlService.createTemplateFromFile("Index");

    console.log("📄 [WEBAPP] Template Index.html chargé avec succès.");

  } catch (err) {
    console.error("💥 [WEBAPP] ERREUR chargement template Index.html :", err);

    return HtmlService.createHtmlOutput(
      "<h2>❌ Erreur critique : impossible de charger Index.html</h2>" +
      "<p>Vérifiez que le fichier existe et respecte la MAJUSCULE.</p>"
    );
  }


  /****************************************************
   * 3) ÉVALUATION + CONFIGURATION DE LA PAGE
   ****************************************************/
  try {
    console.log("⚙️ [WEBAPP] Évaluation du template…");

    const output = template
      .evaluate()
      .setTitle("La Confrérie du Néant • Interface Caisse")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

    console.log("🟩 [WEBAPP] Page générée et prête à être affichée.");

    return output;

  } catch (err) {
    console.error("💥 [WEBAPP] ERREUR lors de l’évaluation du template :", err);

    return HtmlService.createHtmlOutput(
      "<h2>❌ Erreur lors du rendu de l’interface.</h2>" +
      "<p>Veuillez contacter un administrateur.</p>"
    );
  }
}
