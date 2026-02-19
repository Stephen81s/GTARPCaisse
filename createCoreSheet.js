/**
 * ============================================================
 *  FICHIER : admin.gs
 *  MODULE  : RP BUSINESS SYSTEM — ADMIN CORE
 *  VERSION : PRO 2026
 *  AUTHOR  : Stephen
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
  if (lastRow < 2) return prefix + "1";

  const lastID = sheet.getRange(lastRow, 1).getValue();
  const num = parseInt(lastID.replace(prefix, ""), 10) + 1;
  return prefix + num;
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
   CRÉATION JOUEUR
   ============================================================ */

admin.createJoueur = function (nom, prenom) {
  if (!admin.isAdmin()) throw new Error("Accès refusé.");

  const sheet = admin.getSheetByName(consts.SHEET_JOUEURS);
  const id = admin.getNextID(sheet, consts.PREFIX_JOUEUR);

  sheet.appendRow([id, nom, prenom, "", new Date()]);
  return id;
};

/* ============================================================
   CRÉATION ENTREPRISE (PRO 2026)
   ============================================================ */

admin.createEntreprise = function (nom, patronNom, patronPrenom) {
  if (!admin.isAdmin()) throw new Error("Accès refusé.");

  const sheetEnt = admin.getSheetByName(consts.SHEET_ENTREPRISES);
  const sheetJ = admin.getSheetByName(consts.SHEET_JOUEURS);

  // Trouver le joueur
  const data = sheetJ.getDataRange().getValues();
  let joueurID = null;

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === patronNom && data[i][2] === patronPrenom) {
      joueurID = data[i][0];
      break;
    }
  }

  if (!joueurID)
    throw new Error("Joueur introuvable : " + patronNom + " " + patronPrenom);

  // Créer l'entreprise
  const id = admin.getNextID(sheetEnt, consts.PREFIX_ENTREPRISE);
  const now = new Date();

  sheetEnt.appendRow([
    id,
    nom,
    joueurID,   // Patron_ID
    "", "", "", "", "",
    now,
    "",
    true
  ]);

  return id;
};

/* ============================================================
   MODULE EMPLOIS — PRO 2026
   ============================================================ */

admin.createEmploi = function (entrepriseID, nom, description) {
  if (!admin.isAdmin()) throw new Error("Accès refusé.");

  const sheet = admin.getSheetByName(consts.SHEET_EMPLOIS);
  const id = admin.getNextID(sheet, consts.PREFIX_EMPLOI);

  sheet.appendRow([
    id,
    entrepriseID,
    nom,
    description || "",
    true
  ]);

  return id;
};

/* ============================================================
   MODULE GRADES — PRO 2026
   ============================================================ */

admin.createGrade = function (emploiID, nom, niveau, salaire) {
  if (!admin.isAdmin()) throw new Error("Accès refusé.");

  const sheet = admin.getSheetByName(consts.SHEET_GRADES);
  const id = admin.getNextID(sheet, consts.PREFIX_GRADE);

  sheet.appendRow([
    id,
    emploiID,
    nom,
    niveau || 1,
    salaire || 0,
    true
  ]);

  return id;
};

/* ============================================================
   MODULE EMPLOYÉS — PRO 2026
   ============================================================ */

admin.assignPlayerToEmploi = function (joueurID, entrepriseID, emploiID, gradeID) {
  if (!admin.isAdmin()) throw new Error("Accès refusé.");

  const sheet = admin.getSheetByName(consts.SHEET_EMPLOYES);
  const id = admin.getNextID(sheet, consts.PREFIX_EMPLOYE);

  sheet.appendRow([
    id,
    joueurID,
    entrepriseID,
    emploiID,
    gradeID,
    new Date(),
    true
  ]);

  return id;
};

/* ============================================================
   CHECK PATRON
   ============================================================ */

admin.checkIfPlayerIsPatron = function (nom, prenom) {
  const sheet = admin.getSheetByName(consts.SHEET_ENTREPRISES);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const patronID = data[i][2];
    const joueurSheet = admin.getSheetByName(consts.SHEET_JOUEURS);
    const joueurs = joueurSheet.getDataRange().getValues();

    for (let j = 1; j < joueurs.length; j++) {
      if (joueurs[j][0] === patronID &&
          joueurs[j][1] === nom &&
          joueurs[j][2] === prenom) {
        return { entreprise: data[i][1], id: data[i][0] };
      }
    }
  }

  return null;
};

/* ============================================================
   MAINTENANCE
   ============================================================ */

admin.updateSchema = function () {
  if (!admin.isAdmin()) throw new Error("Accès refusé.");
  return "Schéma mis à jour.";
};

admin.resetSystem = function () {
  if (!admin.isAdminPrincipal()) throw new Error("Accès refusé.");
  return "Système réinitialisé.";
};

/* ============================================================
   SCAN DES FONCTIONS → FEUILLE FUNCTIONS
   ============================================================ */

admin.updateFunctions = function () {
  if (!admin.isAdmin()) throw new Error("Accès refusé.");

  Logger.log("🟦 Scan des fonctions…");

  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(consts.SHEET_FUNCTIONS);
  if (!sheet) sheet = ss.insertSheet(consts.SHEET_FUNCTIONS);

  sheet.clear();
  sheet.appendRow(["Nom", "Module", "Type", "Description"]);

  const results = [];
  const globalObj = (1, eval)("this");

  // Fonctions globales
  for (let key in globalObj) {
    if (typeof globalObj[key] === "function") {
      if (key.startsWith("on") || key === "include") continue;
      results.push([key, "Code.gs", "UI / GLOBAL", ""]);
    }
  }

  // Fonctions admin
  for (let key in admin) {
    if (typeof admin[key] === "function") {
      results.push([key, "admin.gs", "CORE ADMIN", ""]);
    }
  }

  sheet.getRange(2, 1, results.length, 4).setValues(results);

  return "OK — " + results.length + " fonctions détectées.";
};

/* ============================================================
   SCAN DES CONSTANTES → FEUILLE CONSTANTES
   ============================================================ */

admin.updateConstantes = function () {
  if (!admin.isAdmin()) throw new Error("Accès refusé.");

  Logger.log("🟦 Mise à jour CONSTANTES…");

  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(consts.SHEET_CONSTANTES);
  if (!sheet) sheet = ss.insertSheet(consts.SHEET_CONSTANTES);

  sheet.clear();
  sheet.appendRow(["Nom", "Valeur", "Description"]);

  const rows = [];

  for (let key in consts) {
    rows.push([key, consts[key], ""]);
  }

  sheet.getRange(2, 1, rows.length, 3).setValues(rows);

  return "OK — " + rows.length + " constantes mises à jour.";
};

/* ============================================================
   MISE À JOUR TOTALE
   ============================================================ */

admin.updateAll = function () {
  if (!admin.isAdmin()) throw new Error("Accès refusé.");

  const logs = [];

  logs.push("SCHEMA : " + admin.updateSchema());
  logs.push("FUNCTIONS : " + admin.updateFunctions());
  logs.push("CONSTANTES : " + admin.updateConstantes());

  return logs.join("\n");
};