/* ============================================================
   Code.gs — Backend API PRO 2026
   Point d’entrée unique pour toutes les actions API ss
   ============================================================ */

/**
 * Point d’entrée Web App
 * Exemple : /exec?action=joueurs_getAll
 */
function doGet(e) {
  try {
    const action = e?.parameter?.action;

    if (!action) {
      return json({ error: "Aucune action fournie." });
    }

    // Routeur API
    switch (action) {

      case "ui_getUserRole":
        return json(ui_getUserRole());

      case "joueurs_getAll":
        return json(joueurs_getAll());

      case "entreprises_getAll":
        return json(entreprises_getAll());

      case "employes_getAll":
        return json(employes_getAll());

      case "populateTypes":
        return json(populateTypes());

      default:
        return json({ error: "Action inconnue : " + action });
    }

  } catch (err) {
    return json({ error: err.message });
  }
}

/* ============================================================
   Helper : réponse JSON propre
   ============================================================ */
function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}