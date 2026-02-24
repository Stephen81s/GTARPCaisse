// ==========================================
// File: loginRP.gs
// Project: GTARP Caisse
// Module: Authentification RP
// Build: PRO 2026
// ==========================================

// Stockage global de l'utilisateur connecté
var globalUser = null;

function loginRP(nomRP, prenomRP) {
  const schema = SCHEMA.sheets.USERS;
  const cols = schema.columns;

  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName("USERS");
  const data = sh.getDataRange().getValues();
  const header = data.shift();

  // Index dynamiques
  const idx = {};
  cols.forEach(c => idx[c] = header.indexOf(c));

  // Recherche utilisateur existant
  let rowIndex = data.findIndex(r =>
    r[idx.nomRP] === nomRP &&
    r[idx.prenomRP] === prenomRP
  );

  const now = new Date();
  const jeton = Utilities.getUuid();

  // --- Mise à jour utilisateur existant ---
  if (rowIndex !== -1) {
    const row = rowIndex + 2;

    sh.getRange(row, idx.jeton + 1).setValue(jeton);
    sh.getRange(row, idx.updated_at + 1).setValue(now);
    sh.getRange(row, idx.updated_by + 1).setValue(nomRP + " " + prenomRP);
    sh.getRange(row, idx.actif + 1).setValue(1);
    sh.getRange(row, idx.status + 1).setValue("connecté");

    const user = {
      id: sh.getRange(row, idx.id + 1).getValue(),
      nomRP,
      prenomRP,
      role: sh.getRange(row, idx.role + 1).getValue(),
      jeton
    };

    // Stockage global
    globalUser = user;

    return user;
  }

  // --- Création nouvel utilisateur ---
  const newId = "USR_" + (data.length + 1).toString().padStart(3, "0");

  const newRow = [];
  cols.forEach(col => {
    switch (col) {
      case "id": newRow.push(newId); break;
      case "nomRP": newRow.push(nomRP); break;
      case "prenomRP": newRow.push(prenomRP); break;
      case "role": newRow.push("Client"); break;
      case "jeton": newRow.push(jeton); break;
      case "created_at": newRow.push(now); break;
      case "created_by": newRow.push("system"); break;
      case "updated_at": newRow.push(now); break;
      case "updated_by": newRow.push(nomRP + " " + prenomRP); break;
      case "actif": newRow.push(1); break;
      case "status": newRow.push("nouveau"); break;
      default: newRow.push("");
    }
  });

  sh.appendRow(newRow);

  const user = {
    id: newId,
    nomRP,
    prenomRP,
    role: "Client",
    jeton
  };

  // Stockage global
  globalUser = user;

  return user;
}

// ==========================================
// Retourne le rôle de l'utilisateur connecté
// ==========================================
function getUserRole() {
  return globalUser ? globalUser.role : "Client";
}