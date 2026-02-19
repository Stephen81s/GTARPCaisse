/**
 * ============================================================
 *  FICHIER : admin.gs
 *  MODULE  : RP BUSINESS SYSTEM — ADMIN CORE
 *  VERSION : PRO 2026
 *  AUTHOR  : Stephen + Copilot PRO
 * ============================================================
 */

var admin = {};

/* ============================================================
   OUTILS DE BASE
   ============================================================ */

admin.getSheetByName = function (name) {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error("Feuille introuvable : " + name);
  return sheet;
};

admin.getNextID = function (sheet, prefix) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return prefix + "001";

  const lastID = sheet.getRange(lastRow, 1).getValue();
  const num = parseInt(lastID.replace(prefix, ""), 10) + 1;
  return prefix + Utilities.formatString("%03d", num);
};

admin.setConfig = function (key, value) {
  const sheet = admin.getSheetByName(consts.SHEET_CONFIG);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      return;
    }
  }

  sheet.appendRow([key, value]);
};

admin.getConfig = function (key) {
  const sheet = admin.getSheetByName(consts.SHEET_CONFIG);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) return data[i][1];
  }

  return null;
};

/* ============================================================
   SÉCURITÉ — EMAIL GOOGLE
   ============================================================ */

admin.getCurrentEmail = function () {
  return Session.getActiveUser().getEmail();
};

/* ============================================================
   RÔLES — ADMIN PRINCIPAL / SECONDAIRE
   ============================================================ */

admin.isAdminPrincipal = function () {
  const email = admin.getCurrentEmail();
  const adminPrincipal = admin.getConfig(consts.CONFIG_ADMIN_PRINCIPAL);
  return email && adminPrincipal && email === adminPrincipal;
};

admin.isAdminSecondaire = function () {
  const email = admin.getCurrentEmail();
  const list = admin.getConfig(consts.CONFIG_ADMINS_SECONDAIRES);

  if (!list) return false;

  const admins = list.split(",").map(s => s.trim());
  return admins.includes(email);
};

admin.isAdmin = function () {
  return admin.isAdminPrincipal() || admin.isAdminSecondaire();
};

admin.getUserRole = function () {
  if (admin.isAdminPrincipal()) return "admin_principal";
  if (admin.isAdminSecondaire()) return "admin_secondaire";
  return "joueur";
};

/* ============================================================
   GESTION DES ADMINS (ADMIN PRINCIPAL ONLY)
   ============================================================ */

admin.addAdmin = function (email) {
  if (!admin.isAdminPrincipal())
    throw new Error("Accès refusé — seul l'admin principal peut ajouter un admin.");

  const list = admin.getConfig(consts.CONFIG_ADMINS_SECONDAIRES);
  let admins = list ? list.split(",").map(s => s.trim()) : [];

  if (!admins.includes(email)) admins.push(email);

  admin.setConfig(consts.CONFIG_ADMINS_SECONDAIRES, admins.join(","));
  return "Admin ajouté : " + email;
};

admin.removeAdmin = function (email) {
  if (!admin.isAdminPrincipal())
    throw new Error("Accès refusé — seul l'admin principal peut retirer un admin.");

  const list = admin.getConfig(consts.CONFIG_ADMINS_SECONDAIRES);
  if (!list) return "Aucun admin secondaire enregistré.";

  let admins = list.split(",").map(s => s.trim());
  admins = admins.filter(a => a !== email);

  admin.setConfig(consts.CONFIG_ADMINS_SECONDAIRES, admins.join(","));
  return "Admin retiré : " + email;
};

admin.getAdminsList = function () {
  const principal = admin.getConfig(consts.CONFIG_ADMIN_PRINCIPAL);
  const list = admin.getConfig(consts.CONFIG_ADMINS_SECONDAIRES);

  return {
    principal: principal,
    secondaires: list ? list.split(",").map(s => s.trim()) : []
  };
};

/* ============================================================
   CRÉATION JOUEUR — PRO 2026
   ============================================================ */

admin.createJoueur = function (nom, prenom) {
  if (!admin.isAdmin()) throw new Error("Accès refusé.");

  const sheet = admin.getSheetByName(consts.SHEET_JOUEURS);
  const id = admin.getNextID(sheet, consts.PREFIX_JOUEUR);

  sheet.appendRow([id, nom, prenom, ""]);
  return id;
};

/* ============================================================
   CRÉATION ENTREPRISE — PRO 2026
   ============================================================ */

admin.createEntreprise = function (nom, patronNom, patronPrenom) {
  if (!admin.isAdmin()) throw new Error("Accès refusé.");

  const joueurID = joueur.findOrCreate(patronNom, patronPrenom);
  const sheet = admin.getSheetByName(consts.SHEET_ENTREPRISES);
  const id = admin.getNextID(sheet, consts.PREFIX_ENTREPRISE);
  const cle = generateKey();

  sheet.appendRow([
    id,
    nom,
    joueurID,
    "",
    "",
    "",
    "",
    cle,
    new Date(),
    "",
    true
  ]);

  return id;
};

/* ============================================================
   CHECK PATRON — PRO 2026
   ============================================================ */

admin.checkIfPlayerIsPatron = function (nom, prenom) {
  const joueurID = joueur.findByName(nom, prenom);
  if (!joueurID) return null;

  const sheet = admin.getSheetByName(consts.SHEET_ENTREPRISES);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === joueurID) {
      return { entreprise: data[i][1], id: data[i][0] };
    }
  }

  return null;
};

/* ============================================================
   MAINTENANCE — PRO 2026
   ============================================================ */

admin.updateSchema = function () {
  if (!admin.isAdmin()) throw new Error("Accès refusé.");
  return createSchemaSheet();
};

admin.updateFunctions = function () {
  if (!admin.isAdmin()) throw new Error("Accès refusé.");
  return createFunctionsSheet();
};

admin.updateConstantes = function () {
  if (!admin.isAdmin()) throw new Error("Accès refusé.");
  return populateConstantes();
};

admin.updateAll = function () {
  if (!admin.isAdmin()) throw new Error("Accès refusé.");

  const logs = [];
  logs.push("SCHEMA : " + admin.updateSchema());
  logs.push("FUNCTIONS : " + admin.updateFunctions());
  logs.push("CONSTANTES : " + admin.updateConstantes());

  return logs.join("\n");
};

admin.resetSystem = function () {
  if (!admin.isAdminPrincipal()) throw new Error("Accès refusé.");
  return createCoreSheet();
};