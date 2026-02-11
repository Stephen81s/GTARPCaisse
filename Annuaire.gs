/**
 * ============================================================
 *  📄 Annuaire.gs — VERSION 2.0 (RECONSTRUITE)
 *  ------------------------------------------------------------
 *  Gestion complète de l’annuaire clients :
 *    - Lecture (liste ou dictionnaire)
 *    - Ajout sécurisé (anti-doublons)
 *    - Création automatique de la feuille
 *
 *  Feuille : SHEET_ANNUAIRE
 *  Colonnes :
 *    1 = Nom
 *    2 = Prénom
 *    3 = Téléphone
 *
 *  Auteur : Stephen
 *  Version : 2.0
 *  Mis à jour : 2026-02-11
 * ============================================================
 */

console.log("📘 [Annuaire.gs] Module chargé.");



/* ============================================================
 *  🔧 getSheet(name)
 *  ------------------------------------------------------------
 *  Récupère une feuille par son nom.
 * ============================================================ */
function Annuaire_getSheet() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SHEET_ANNUAIRE);

  if (!sh) {
    console.warn(`⚠ [ANNUAIRE] Feuille '${SHEET_ANNUAIRE}' absente → création.`);
    sh = Annuaire_createSheet();
  }

  return sh;
}



/* ============================================================
 *  📄 Annuaire_createSheet()
 *  ------------------------------------------------------------
 *  Crée la feuille Annuaire avec les bonnes colonnes.
 * ============================================================ */
function Annuaire_createSheet() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.insertSheet(SHEET_ANNUAIRE);

  sh.appendRow(["Nom", "Prénom", "Téléphone"]);

  console.log("🟩 [ANNUAIRE] Feuille créée.");
  return sh;
}



/* ============================================================
 *  📚 Annuaire_getList()
 *  ------------------------------------------------------------
 *  Renvoie la liste des clients :
 *    [
 *      { full: "Nom Prénom", tel: "0600000000" },
 *      ...
 *    ]
 * ============================================================ */
function Annuaire_getList() {
  const sh = Annuaire_getSheet();
  const last = sh.getLastRow();

  if (last < 2) return [];

  const rows = sh.getRange(2, 1, last - 1, 3).getValues();

  return rows
    .filter(r => r[0])
    .map(r => ({
      full: `${r[0]} ${r[1]}`.trim(),
      tel: String(r[2] || "").trim()
    }));
}



/* ============================================================
 *  📚 Annuaire_getMap()
 *  ------------------------------------------------------------
 *  Renvoie un dictionnaire :
 *    {
 *      "Nom Prénom": "Téléphone",
 *      ...
 *    }
 * ============================================================ */
function Annuaire_getMap() {
  const sh = Annuaire_getSheet();
  const last = sh.getLastRow();

  if (last < 2) return {};

  const rows = sh.getRange(2, 1, last - 1, 3).getValues();
  const map = {};

  rows.forEach(r => {
    if (!r[0]) return;
    const full = `${r[0]} ${r[1]}`.trim();
    map[full] = String(r[2] || "").trim();
  });

  return map;
}



/* ============================================================
 *  📝 Annuaire_save(fullName, tel)
 *  ------------------------------------------------------------
 *  Ajoute un client si :
 *    - nom/prénom n’existe pas déjà
 *    - téléphone n’existe pas déjà
 * ============================================================ */
function Annuaire_save(fullName, tel) {
  const sh = Annuaire_getSheet();

  const parts = String(fullName || "").trim().split(/\s+/);
  const nom = parts[0] || "";
  const prenom = parts.slice(1).join(" ");

  if (!nom) return { success: false, message: "Nom vide" };

  const telNorm = String(tel || "").trim();
  const fullNorm = `${nom} ${prenom}`.trim().toLowerCase();

  const last = sh.getLastRow();
  if (last >= 2) {
    const rows = sh.getRange(2, 1, last - 1, 3).getValues();

    const exists = rows.some(r => {
      const existingFull = `${String(r[0]).trim()} ${String(r[1]).trim()}`.toLowerCase();
      const existingTel = String(r[2]).trim();
      return existingFull === fullNorm || existingTel === telNorm;
    });

    if (exists) {
      return { success: false, message: "Client déjà existant" };
    }
  }

  sh.appendRow([nom, prenom, telNorm]);
  return { success: true };
}
