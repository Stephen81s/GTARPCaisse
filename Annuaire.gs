/**
 * ============================================================
 *  📄 Annuaire.gs — VERSION RECONSTRUITE & COMMENTÉE
 *  ------------------------------------------------------------
 *  Module centralisé de gestion de l’annuaire clients :
 *    - Lecture des clients (liste ou dictionnaire)
 *    - Ajout d’un client (nom, prénom, téléphone)
 *    - Création automatique de la feuille si absente
 *
 *  Utilisé par l’interface caisse pour :
 *    - remplir la liste déroulante des clients
 *    - auto-remplir le téléphone
 *    - enregistrer un nouveau client
 *
 *  Auteur      : Stephen
 *  Version     : 1.4.0 (reconstruite)
 *  Mis à jour  : 2026-02-11
 * ============================================================
 */

console.log("📘 [Annuaire.gs] Module Annuaire chargé.");



/* ============================================================
 *  🧩 getSheet(name)
 *  ------------------------------------------------------------
 *  Récupère une feuille par son nom.
 *  - Log complet
 *  - Erreur explicite si la feuille n'existe pas
 * ============================================================ */
function getSheet(name) {
  console.log(`📄 [ANNUAIRE] getSheet() → Recherche de la feuille : "${name}"`);

  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(name);

  if (!sh) {
    console.error(`❌ [ANNUAIRE] Feuille introuvable : ${name}`);
    throw new Error("Feuille introuvable : " + name);
  }

  console.log(`🟩 [ANNUAIRE] Feuille trouvée : "${name}"`);
  return sh;
}



/* ============================================================
 *  📞 getAnnuaireClients(sheet)
 *  ------------------------------------------------------------
 *  Renvoie la liste des clients sous forme :
 *    [
 *      { full: "Nom Prénom", tel: "0600000000" },
 *      ...
 *    ]
 *
 *  - Lecture robuste
 *  - Logs détaillés
 * ============================================================ */
function getAnnuaireClients(sheet) {
  console.log("===== 📞 [ANNUAIRE] DÉBUT getAnnuaireClients() =====");

  try {
    if (!sheet) {
      console.warn("⚠ [ANNUAIRE] Feuille NULL → retour []");
      return [];
    }

    const lastRow = sheet.getLastRow();
    console.log(`📏 [ANNUAIRE] Nombre total de lignes : ${lastRow}`);

    if (lastRow < 2) {
      console.log("📭 [ANNUAIRE] Aucun client trouvé.");
      return [];
    }

    // Lecture des colonnes A → C (Nom, Prénom, Téléphone)
    const rows = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
    console.log("📥 [ANNUAIRE] Lignes brutes lues :", rows.length);

    const clients = rows
      .filter(r => r[0] && String(r[0]).trim() !== "")
      .map(r => ({
        full: `${String(r[0]).trim()} ${String(r[1] || "").trim()}`.trim(),
        tel: String(r[2] || "").trim()
      }));

    console.log("📌 [ANNUAIRE] Clients extraits :", clients.length);
    console.log("===== 🟩 [ANNUAIRE] FIN getAnnuaireClients() =====");

    return clients;

  } catch (err) {
    console.error("💥 [ANNUAIRE] ERREUR getAnnuaireClients()", err);
    return [];
  }
}



/* ============================================================
 *  📚 getAnnuaireClientsMap()
 *  ------------------------------------------------------------
 *  Renvoie un dictionnaire optimisé pour le frontend :
 *    {
 *      "Nom Prénom": "Téléphone",
 *      ...
 *    }
 *
 *  - Idéal pour auto-remplir le téléphone
 *  - Logs détaillés
 * ============================================================ */
function getAnnuaireClientsMap() {
  console.log("===== 📚 [ANNUAIRE] DÉBUT getAnnuaireClientsMap() =====");

  try {
    const sheet = getSheet(SHEET_ANNUAIRE);

    const lastRow = sheet.getLastRow();
    console.log(`📏 [ANNUAIRE] Nombre total de lignes : ${lastRow}`);

    if (lastRow < 2) {
      console.log("📭 [ANNUAIRE] Aucun client → {}");
      return {};
    }

    const rows = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
    console.log("📥 [ANNUAIRE] Lignes brutes lues :", rows.length);

    const map = {};

    rows.forEach(r => {
      const nom = String(r[0] || "").trim();
      const prenom = String(r[1] || "").trim();
      const tel = String(r[2] || "").trim();

      if (!nom) return;

      const full = `${nom} ${prenom}`.trim();
      map[full] = tel;
    });

    console.log("📌 [ANNUAIRE] Dictionnaire généré :", map);
    console.log("===== 🟩 [ANNUAIRE] FIN getAnnuaireClientsMap() =====");

    return map;

  } catch (err) {
    console.error("💥 [ANNUAIRE] ERREUR getAnnuaireClientsMap()", err);
    return {};
  }
}



/* ============================================================
 *  📝 saveClientToAnnuaire(fullName, tel)
 *  ------------------------------------------------------------
 *  Ajoute un client si :
 *    - nom/prénom n’existe pas déjà
 *    - téléphone n’existe pas déjà
 *
 *  - Logs complets
 *  - Normalisation du nom
 *  - Vérification des doublons
 * ============================================================ */
function saveClientToAnnuaire(fullName, tel) {
  console.log("===== 📝 [ANNUAIRE] DÉBUT saveClientToAnnuaire() =====");
  console.log("📥 [ANNUAIRE] Données reçues :", { fullName, tel });

  try {
    const sheet = getSheet(SHEET_ANNUAIRE) || createAnnuaireSheet();

    // Découpage du nom complet
    const parts = String(fullName || "").trim().split(/\s+/);
    const nom = parts[0] || "";
    const prenom = parts.slice(1).join(" ") || "";

    console.log(`🧩 [ANNUAIRE] Nom détecté : "${nom}", Prénom : "${prenom}"`);

    if (!nom) {
      console.warn("⚠ [ANNUAIRE] Nom vide → insertion annulée.");
      return { success: false, message: "Nom vide" };
    }

    const lastRow = sheet.getLastRow();
    const newFull = `${nom} ${prenom}`.trim().toLowerCase();
    const telNorm = String(tel || "").trim();

    console.log(`🔍 [ANNUAIRE] Vérification doublons pour : "${newFull}" / Tel : "${telNorm}"`);

    // Vérification des doublons
    if (lastRow >= 2) {
      const data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();

      const exists = data.some(row => {
        const existingFull = `${String(row[0]).trim()} ${String(row[1]).trim()}`.toLowerCase();
        const existingTel = String(row[2]).trim();
        return existingFull === newFull || existingTel === telNorm;
      });

      if (exists) {
        console.warn("⚠ [ANNUAIRE] Client déjà existant → aucune insertion.");
        return { success: false, message: "Client déjà existant" };
      }
    }

    // Insertion
    sheet.appendRow([nom, prenom, telNorm]);
    console.log("🟩 [ANNUAIRE] Nouveau client ajouté :", newFull);

    console.log("===== 🟩 [ANNUAIRE] FIN saveClientToAnnuaire() =====");
    return { success: true };

  } catch (err) {
    console.error("💥 [ANNUAIRE] ERREUR saveClientToAnnuaire()", err);
    return { success: false, message: "Erreur interne" };
  }
}



/* ============================================================
 *  📄 createAnnuaireSheet()
 *  ------------------------------------------------------------
 *  Crée la feuille Annuaire si elle n’existe pas.
 *  - Ajoute les titres
 *  - Log complet
 * ============================================================ */
function createAnnuaireSheet() {
  console.log("📄 [ANNUAIRE] Création de la feuille Annuaire…");

  try {
    const ss = SpreadsheetApp.getActive();
    const sheet = ss.insertSheet(SHEET_ANNUAIRE);

    sheet.appendRow(["Nom", "Prénom", "Téléphone"]);

    console.log("🟩 [ANNUAIRE] Feuille Annuaire créée.");
    return sheet;

  } catch (err) {
    console.error("💥 [ANNUAIRE] ERREUR création Annuaire :", err);
    return null;
  }
}
