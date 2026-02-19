/**
 * ============================================================
 *  UI — Gestion des rôles & maintenance
 * ============================================================
 */

function ui_getUserRole() {
  const email = Session.getActiveUser().getEmail();
  const admins = CONSTANTES.ADMINS;

  if (admins.PRINCIPAL.includes(email)) return { role: "admin_principal" };
  if (admins.SECONDAIRE.includes(email)) return { role: "admin_secondaire" };
  return { role: "user" };
}

function ui_isAdmin() {
  const role = ui_getUserRole().role;
  return { isAdmin: role.startsWith("admin") };
}

function ui_isAdminPrincipal() {
  const role = ui_getUserRole().role;
  return { isAdminPrincipal: role === "admin_principal" };
}

function ui_isAdminSecondaire() {
  const role = ui_getUserRole().role;
  return { isAdminSecondaire: role === "admin_secondaire" };
}

/**
 * Maintenance
 */
function ui_updateSchema() {
  return { status: "ok", updated: "schema" };
}

function ui_updateFunctions() {
  return { status: "ok", updated: "functions" };
}

function ui_updateConstantes() {
  return { status: "ok", updated: "constantes" };
}

function ui_updateAll() {
  return { status: "ok", updated: "all" };
}

function ui_resetSystem() {
  return { status: "ok", reset: true };
}