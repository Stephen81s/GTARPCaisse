/**
 * ============================================================
 *  GTARPCaisse — API Backend (PRO 2026)
 *  Architecture REST pour front GitHub Pages
 *  Auteur : Stephen
 * ============================================================
 */

/**
 * Réponse JSON standardisée
 */
function json(data, status = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Point d'entrée principal (GET)
 */
function doGet(e) {
  const action = e?.parameter?.action;

  if (!action) {
    return json({ status: "ok", message: "GTARPCaisse API active" });
  }

  try {
    switch (action) {

      // -------------------------
      // UI / Rôles
      // -------------------------
      case "ui_getUserRole":
        return json(ui_getUserRole());

      case "ui_isAdmin":
        return json(ui_isAdmin());

      case "ui_isAdminPrincipal":
        return json(ui_isAdminPrincipal());

      case "ui_isAdminSecondaire":
        return json(ui_isAdminSecondaire());

      // -------------------------
      // Joueurs
      // -------------------------
      case "joueurs_getAll":
        return json(joueurs_getAll());

      // -------------------------
      // Entreprises
      // -------------------------
      case "entreprises_getAll":
        return json(entreprises_getAll());

      // -------------------------
      // Employés
      // -------------------------
      case "employes_getAll":
        return json(employes_getAll());

      // -------------------------
      // Maintenance
      // -------------------------
      case "ui_updateSchema":
        return json(ui_updateSchema());

      case "ui_updateFunctions":
        return json(ui_updateFunctions());

      case "ui_updateConstantes":
        return json(ui_updateConstantes());

      case "ui_updateAll":
        return json(ui_updateAll());

      case "ui_resetSystem":
        return json(ui_resetSystem());

      // -------------------------
      // Populate
      // -------------------------
      case "populateTypes":
        return json(populateTypes());

      // -------------------------
      // Action inconnue
      // -------------------------
      default:
        return json({ error: `Action inconnue : ${action}` });
    }

  } catch (err) {
    return json({ error: err.message, stack: err.stack });
  }
}