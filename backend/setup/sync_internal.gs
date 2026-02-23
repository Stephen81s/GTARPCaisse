/**
 * ============================================================
 *  SYNC PRO++ — Apps Script → Google Sheets
 *  Architecture PRO 2026 — 100% Apps Script
 *  Auteur : Stephen
 * ------------------------------------------------------------
 *  Fonctionnalités :
 *    - Lit TOUT le code Apps Script du projet
 *    - Découpe les fichiers .gs et .html
 *    - Extrait les constantes annotées JSDoc
 *    - Extrait les fonctions annotées JSDoc
 *    - Réécrit les feuilles CONSTANTES et FONCTIONS
 * ============================================================
 */

function syncProjectToSheets() {
  const ss = SpreadsheetApp.getActive();
  const sheetConst = ss.getSheetByName("CONSTANTES");
  const sheetFunc = ss.getSheetByName("FONCTIONS");

  if (!sheetConst || !sheetFunc) {
    throw new Error("Feuilles CONSTANTES ou FONCTIONS manquantes.");
  }

  // ============================================================
  // 1) Récupération du code source complet
  // ============================================================
  const projectId = ScriptApp.getScriptId();
  const file = DriveApp.getFileById(projectId);
  const content = file.getBlob().getDataAsString();

  // ============================================================
  // 2) Découpage des fichiers
  // ============================================================
  const files = splitFiles(content);

  let constantes = [];
  let fonctions = [];

  // ============================================================
  // 3) Scan de chaque fichier
  // ============================================================
  files.forEach(f => {
    const extracted = extractAnnotations(f.content);
    constantes = constantes.concat(extracted.constantes);
    fonctions = fonctions.concat(extracted.fonctions);
  });

  // ============================================================
  // 4) Injection dans CONSTANTES
  // ============================================================
  sheetConst.getRange(2, 1, sheetConst.getLastRow(), 3).clearContent();
  if (constantes.length > 0) {
    sheetConst.getRange(2, 1, constantes.length, 3).setValues(constantes);
  }

  // ============================================================
  // 5) Injection dans FONCTIONS
  // ============================================================
  sheetFunc.getRange(2, 1, sheetFunc.getLastRow(), 7).clearContent();
  if (fonctions.length > 0) {
    sheetFunc.getRange(2, 1, fonctions.length, 7).setValues(fonctions);
  }

  Logger.log("🚀 SYNC PRO++ terminé.");
}

/**
 * Découpe le code Apps Script en fichiers individuels
 */
function splitFiles(content) {
  const parts = content.split("// ==File==");
  const files = [];

  parts.forEach(p => {
    const match = p.match(/==(.+)==/);
    if (match) {
      const name = match[1].trim();
      const body = p.replace(/==(.+)==/, "").trim();
      files.push({ name, content: body });
    }
  });

  return files;
}

/**
 * Extraction des annotations JSDoc
 */
function extractAnnotations(content) {
  const constRegex = /\/\*\*([\s\S]*?)\*\/\s*(?:const|let|var)\s+(\w+)/g;
  const funcRegex = /\/\*\*([\s\S]*?)\*\/\s*function\s+(\w+)/g;

  const constantes = [];
  const fonctions = [];

  let match;

  // CONSTANTES
  while ((match = constRegex.exec(content)) !== null) {
    const block = match[1];
    const name = match[2];

    const value = block.match(/@value\s+(.+)/)?.[1] || "";
    const description = block.match(/@description\s+(.+)/)?.[1] || "";

    constantes.push([name, value, description]);
  }

  // FONCTIONS
  while ((match = funcRegex.exec(content)) !== null) {
    const block = match[1];
    const name = match[2];

    const module = block.match(/@module\s+(.+)/)?.[1] || "";
    const description = block.match(/@description\s+(.+)/)?.[1] || "";
    const version = block.match(/@version\s+(.+)/)?.[1] || "";
    const active = block.match(/@active\s+(.+)/)?.[1] || "";
    const params = block.match(/@params\s+(.+)/)?.[1] || "";
    const returns = block.match(/@returns\s+(.+)/)?.[1] || "";

    fonctions.push([name, module, description, version, active, params, returns]);
  }

  return { constantes, fonctions };
}