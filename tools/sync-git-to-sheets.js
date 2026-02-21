/**
 * ============================================================
 *  SYNC PRO++ — GitHub → Google Sheets
 *  Architecture PRO 2026
 *  Auteur : Stephen
 * ------------------------------------------------------------
 *  Fonctionnalités :
 *    - Clone / Pull du dépôt GitHub
 *    - Scan des fichiers .js / .gs
 *    - Extraction des annotations JSDoc
 *    - Nettoyage automatique de la feuille CONSTANTES
 *    - Réécriture des constantes attendues
 *    - Mise à jour des feuilles CONSTANTES et FONCTIONS
 * ============================================================
 */

import fs from "fs";
import path from "path";
import { google } from "googleapis";
import simpleGit from "simple-git";

// ------------------------------------------------------------
// CONFIG
// ------------------------------------------------------------
const REPO_URL = "https://github.com/TON_USER/GTARPCaisse.git";
const LOCAL_REPO = "../"; // ton code est juste au-dessus du dossier tools
const SHEET_ID = "1xDdJySIojpnJVXOVtQppQPeL6g8gfkDtJXtlgE-uojE";

// Service account JSON
const SERVICE_ACCOUNT = JSON.parse(fs.readFileSync("./service-account.json"));

// ------------------------------------------------------------
// GOOGLE SHEETS CLIENT
// ------------------------------------------------------------
const auth = new google.auth.JWT({
  email: SERVICE_ACCOUNT.client_email,
  key: SERVICE_ACCOUNT.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const sheets = google.sheets({ version: "v4", auth });

// ------------------------------------------------------------
// CONSTANTES ATTENDUES (PRO 2026)
// ------------------------------------------------------------
const EXPECTED_CONSTANTS = {
  VERSION: "2026",
  ENV: "prod",
  API_URL: "https://monapi.com",
  MAX_ENTREPRISES: "50",

  SHEET_JOUEURS: "Joueurs",
  SHEET_ENTREPRISES: "Entreprises",
  SHEET_ITEMS: "Items",
  SHEET_SERVICES: "Services",
  SHEET_LICENCES: "Licences",
  SHEET_VEHICULES: "Vehicules",
  SHEET_AMENDES: "Amendes",
  SHEET_COMMANDES: "Commandes",
  SHEET_ARTICLES: "Articles",
  SHEET_FAUXPAPIERS: "FauxPapiers"
};

// ------------------------------------------------------------
// CLONE OR UPDATE REPO
// ------------------------------------------------------------
async function cloneOrUpdateRepo() {
  if (!fs.existsSync(LOCAL_REPO + "/appsscript")) {
    console.log("📥 Clonage du dépôt...");
    await simpleGit().clone(REPO_URL, LOCAL_REPO);
  } else {
    console.log("🔄 Mise à jour du dépôt...");
    await simpleGit(LOCAL_REPO).pull();
  }
}

// ------------------------------------------------------------
// SCAN DES FICHIERS
// ------------------------------------------------------------
function scanFiles(dir) {
  let results = [];

  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      if (file === "node_modules" || file.startsWith(".")) return;
      results = results.concat(scanFiles(fullPath));
    } else if (file.endsWith(".js") || file.endsWith(".gs")) {
      results.push(fullPath);
    }
  });

  return results;
}

// ------------------------------------------------------------
// EXTRACTION DES ANNOTATIONS
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// NETTOYAGE DE LA FEUILLE CONSTANTES
// ------------------------------------------------------------
async function cleanConstantsSheet() {
  console.log("🧹 Nettoyage de la feuille CONSTANTES...");

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "CONSTANTES!A2:B999"
  });

  const rows = res.data.values || [];

  // Filtrer les lignes valides
  const cleaned = rows.filter(row => {
    const key = row[0];
    return key && EXPECTED_CONSTANTS.hasOwnProperty(key);
  });

  // Ajouter les constantes manquantes
  for (const key in EXPECTED_CONSTANTS) {
    if (!cleaned.find(r => r[0] === key)) {
      cleaned.push([key, EXPECTED_CONSTANTS[key]]);
    }
  }

  // Réécrire la feuille propre
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: "CONSTANTES!A2",
    valueInputOption: "RAW",
    requestBody: { values: cleaned }
  });

  console.log("✅ CONSTANTES nettoyées et synchronisées.");
}

// ------------------------------------------------------------
// MISE À JOUR GOOGLE SHEETS
// ------------------------------------------------------------
async function updateSheet(range, values) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: "RAW",
    requestBody: { values }
  });
}

// ------------------------------------------------------------
// MAIN
// ------------------------------------------------------------
async function main() {
  await cloneOrUpdateRepo();

  const files = scanFiles(LOCAL_REPO);

  let constantes = [];
  let fonctions = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const extracted = extractAnnotations(content);

    constantes = constantes.concat(extracted.constantes);
    fonctions = fonctions.concat(extracted.fonctions);
  }

  console.log("📌 Constantes trouvées :", constantes.length);
  console.log("📌 Fonctions trouvées :", fonctions.length);

  // Nettoyage automatique
  await cleanConstantsSheet();

  // Mise à jour des feuilles
  await updateSheet("CONSTANTES!A2", constantes);
  await updateSheet("FONCTIONS!A2", fonctions);

  console.log("🚀 Synchronisation terminée.");
}

main();