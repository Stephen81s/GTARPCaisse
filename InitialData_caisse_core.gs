/**
 * @file InitialData_caisse_core.gs
 * @description Fournit toutes les données nécessaires à l’interface CAISSE.
 *              Version robuste : détecte automatiquement la première ligne valide.
 *              Fonctionne même si les données commencent en ligne 2, 3, 4…
 *
 * Auteur : Stephen
 * Version : 2.0.0
 * Mis à jour : 2026-02-10 • 00:31 (CET)
 *
 * Dépendances :
 *   - SHEET_TYPES_OP
 *   - SHEET_EMPLOYES
 *   - SHEET_ARTICLES
 *   - SHEET_MOYENS_PAIEMENT
 *   - SHEET_ANNUAIRE
 *   - SHEET_COMPTA
 *
 * Sécurité :
 *   - try/catch sur chaque bloc
 *   - logs détaillés
 *   - lecture intelligente (ignore lignes vides)
 *
 * Historique interne :
 *   📁 Fichier reconstruit entièrement (version robuste)
 */


/****************************************************
 * 📌 Fonction utilitaire : lecture robuste
 * --------------------------------------------------
 * Lit toute la feuille, enlève la ligne de titres,
 * ignore les lignes vides, détecte automatiquement
 * la première ligne valide.
 ****************************************************/
function lireDonnees(sheet, nbColonnes) {
  const last = sheet.getLastRow();
  if (last < 2) return [];

  const data = sheet.getRange(1, 1, last, nbColonnes).getValues();

  return data
    .slice(1)        // enlève la ligne de titres
    .filter(r => r[0]); // ignore lignes vides
}


/****************************************************
 * 🚀 getInitialDataCaisse()
 ****************************************************/
function getInitialDataCaisse() {
  console.log("===== 🚀 DÉBUT getInitialDataCaisse() =====");

  const ss = SpreadsheetApp.getActive();


  /****************************************************
   * 1) TYPES D’OPÉRATION
   ****************************************************/
  let typesOperation = [];
  try {
    const sh = ss.getSheetByName(SHEET_TYPES_OP);
    if (!sh) throw new Error("Feuille TypeOperations introuvable");

    const rows = lireDonnees(sh, 1);

    typesOperation = rows.map((r, i) => ({
      id: i + 1,
      nom: String(r[0]).trim()
    }));

    console.log("🟩 Types d’opération chargés :", typesOperation);

  } catch (err) {
    console.error("💥 ERREUR chargement types d’opération :", err);
  }


  /****************************************************
   * 2) EMPLOYÉS
   ****************************************************/
  let employes = [];
  try {
    const sh = ss.getSheetByName(SHEET_EMPLOYES);
    if (!sh) throw new Error("Feuille Employées introuvable");

    const rows = lireDonnees(sh, 3);

    employes = rows.map(r => ({
      id: r[0],
      nom: `${r[1]} ${r[2]}`.trim()
    }));

    console.log("🟩 Employés chargés :", employes);

  } catch (err) {
    console.error("💥 ERREUR chargement employés :", err);
  }


  /****************************************************
   * 3) ARTICLES
   ****************************************************/
  let articles = [];
  try {
    const sh = ss.getSheetByName(SHEET_ARTICLES);
    if (!sh) throw new Error("Feuille Articles introuvable");

    const rows = lireDonnees(sh, 7);

    articles = rows.map(r => ({
      nom: r[0],
      prixAchat: Number(r[1]) || 0,
      prixVente: Number(r[2]) || 0,
      stock: Number(r[3]) || 0,
      categorie: r[4] || "",
      typeCaisse: r[5] || "",
      types: r[6] || ""
    }));

    console.log("🟩 Articles chargés :", articles.length);

  } catch (err) {
    console.error("💥 ERREUR chargement articles :", err);
  }


  /****************************************************
   * 4) MOYENS DE PAIEMENT
   ****************************************************/
  let paiements = [];
  try {
    const sh = ss.getSheetByName(SHEET_MOYENS_PAIEMENT);
    if (!sh) throw new Error("Feuille MoyenPaiments introuvable");

    const rows = lireDonnees(sh, 1);

    paiements = rows.map(r => r[0]);

    console.log("🟩 Moyens de paiement chargés :", paiements);

  } catch (err) {
    console.error("💥 ERREUR chargement moyens de paiement :", err);
  }


  /****************************************************
   * 5) CLIENTS
   ****************************************************/
  let clients = [];
  try {
    const sh = ss.getSheetByName(SHEET_ANNUAIRE);
    if (!sh) throw new Error("Feuille Annuaire introuvable");

    const rows = lireDonnees(sh, 3);

    clients = rows.map(r => ({
      nom: r[0],
      prenom: r[1],
      tel: r[2],
      full: `${r[0]} ${r[1]}`.trim()
    }));

    console.log("🟩 Clients chargés :", clients.length);

  } catch (err) {
    console.error("💥 ERREUR chargement clients :", err);
  }


  /****************************************************
   * 6) COMPTA
   ****************************************************/
  let compta = { legal: 0, illegal: 0, global: 0 };
  try {
    const sh = ss.getSheetByName(SHEET_COMPTA);
    if (!sh) throw new Error("Feuille Compta introuvable");

    compta = {
      legal: sh.getRange("B1").getValue(),
      illegal: sh.getRange("B2").getValue(),
      global: sh.getRange("B3").getValue()
    };

    console.log("🟩 Compta chargée :", compta);

  } catch (err) {
    console.error("💥 ERREUR chargement compta :", err);
  }


  /****************************************************
   * ASSEMBLAGE FINAL
   ****************************************************/
  const data = {
    typesOperation,
    employes,
    articles,
    paiements,
    clients,
    compta
  };

  console.log("===== 🟩 FIN getInitialDataCaisse() =====");
  return data;
}
