/**
 * SYNC PRO++ — GitHub → Google Sheets
 * -----------------------------------
 * Lit ton dépôt GitHub
 * Extrait les constantes et fonctions annotées
 * Met à jour automatiquement les feuilles CONSTANTES, FONCTIONS, MODULES
 */

import fs from "fs";
import path from "path";
import { google } from "googleapis";
import simpleGit from "simple-git";

// -----------------------------
// CONFIG
// -----------------------------
const REPO_URL = "https://github.com/TON_USER/GTARPCaisse.git";
const LOCAL_REPO = "../"; // ton code est juste au-dessus du dossier tools
const SHEET_ID = "1xDdJySIojpnJVXOVtQppQPeL6g8gfkDtJXtlgE-uojE";

// Service account JSON
const SERVICE_ACCOUNT = JSON.parse(fs.readFileSync("./service-account.json"));

// -----------------------------
// GOOGLE SHEETS CLIENT
// -----------------------------
const auth = new google.auth.JWT(
  SERVICE_ACCOUNT.client_email,
  null,
  SERVICE_ACCOUNT.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth });

// -----------------------------
// CLONE OR UPDATE REPO
// -----------------------------
async function cloneOrUpdateRepo() {
  if (!fs.existsSync(LOCAL_REPO + "/appsscript")) {
    console.log("Clonage du dépôt...");
    await simpleGit().clone(REPO_URL, LOCAL_REPO);
  } else {
    console.log("Mise à jour du dépôt...");
    await simpleGit(LOCAL_REPO).pull();
  }
}

// -----------------------------
// SCAN DES FICHIERS
// -----------------------------
function scanFiles(dir) {
  let results = [];

  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(scanFiles(fullPath));
    } else if (file.endsWith(".js") || file.endsWith(".gs")) {
      results.push(fullPath);
    }
  });

  return results;
}

// -----------------------------
// EXTRACTION DES ANNOTATIONS
// -----------------------------
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

// -----------------------------
// MISE À JOUR GOOGLE SHEETS
// -----------------------------
async function updateSheet(range, values) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: "RAW",
    requestBody: { values }
  });
}

// -----------------------------
// MAIN
// -----------------------------
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

  console.log("Constantes trouvées :", constantes.length);
  console.log("Fonctions trouvées :", fonctions.length);

  await updateSheet("CONSTANTES!A2", constantes);
  await updateSheet("FONCTIONS!A2", fonctions);

  console.log("Synchronisation terminée.");
}

main();