/**
 * @file CaisseBackend.gs
 * @description Backend de la caisse :
 *  - Fournit les données initiales à l’interface
 *  - Gère la lecture des articles / types d’opérations
 *  - Reçoit les données de la caisse et met à jour les stocks
 *  - Enregistre les tickets / opérations comptables (base prête à étendre)
 *
 * Dépend de : Sheets.gs (constantes de feuilles + noms de fonctions)
 *
 * Auteur : Stephen
 * Version : 1.0.0
 */

// ============================================================
// 🧾 LOG D’INITIALISATION
// ============================================================
console.log("[CaisseBackend.gs] Chargement du backend caisse…");
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

/**
 * @function getInitialDataCaisse
 * @description Point d’entrée principal pour l’interface caisse.
 *  - Récupère tous les jeux de données nécessaires au chargement :
 *    * Articles
 *    * Types d’opérations
 *    * Moyens de paiement
 *    * Employés
 *    * Clients
 *  - Retourne un objet JSON sérialisable côté client.
 *
 * Utilisé par : FN_GET_INITIAL_DATA_CAISSE
 */
function getInitialDataCaisse() {
  console.log("[getInitialDataCaisse] Début récupération des données initiales…");

  const ss = SpreadsheetApp.getActive();
  const articlesSheet = ss.getSheetByName(SHEET_ARTICLES);
  const typesOpSheet = ss.getSheetByName(SHEET_TYPES_OP);
  const moyensSheet = ss.getSheetByName(SHEET_MOYENS_PAIEMENT);
  const employesSheet = ss.getSheetByName(SHEET_EMPLOYES);
  const clientsSheet = ss.getSheetByName(SHEET_ANNUAIRE);

  if (!articlesSheet || !typesOpSheet) {
    console.error("[getInitialDataCaisse] ERREUR : Feuilles Articles ou TypeOperations introuvables.");
    throw new Error("Feuilles Articles ou TypeOperations introuvables.");
  }

  // --- Articles ---
  const articlesRange = articlesSheet.getDataRange();
  const articlesValues = articlesRange.getValues(); // [ [Nom, PrixAchat, PrixVente, Stock, Categorie, TypeCaisse, Types], ... ]
  const articlesHeader = articlesValues.shift(); // on enlève l’en-tête

  const articles = articlesValues
    .filter(row => row[0]) // ignorer lignes vides
    .map(row => ({
      nom: row[0],
      prixAchat: row[1],
      prixVente: row[2],
      stock: row[3],
      categorie: row[4],
      typeCaisse: row[5],
      types: row[6]
    }));

  // --- Types d’opérations ---
  const typesOpValues = typesOpSheet.getDataRange().getValues();
  const typesOperations = typesOpValues
    .map(r => r[0])
    .filter(v => v && typeof v === "string");

  // --- Moyens de paiement (optionnel) ---
  let moyensPaiement = [];
  if (moyensSheet) {
    const moyensValues = moyensSheet.getDataRange().getValues();
    moyensPaiement = moyensValues
      .map(r => r[0])
      .filter(v => v && typeof v === "string");
  }

  // --- Employés (optionnel) ---
  let employes = [];
  if (employesSheet) {
    const empValues = employesSheet.getDataRange().getValues();
    employes = empValues
      .slice(1)
      .filter(r => r[0])
      .map(r => ({
        nom: r[0],
        role: r[1] || ""
      }));
  }

  // --- Clients (optionnel) ---
  let clients = [];
  if (clientsSheet) {
    const cliValues = clientsSheet.getDataRange().getValues();
    clients = cliValues
      .slice(1)
      .filter(r => r[0])
      .map(r => ({
        nom: r[0],
        info: r[1] || ""
      }));
  }

  const payload = {
    articles,
    typesOperations,
    moyensPaiement,
    employes,
    clients
  };

  console.log("[getInitialDataCaisse] Données initiales prêtes :", {
    nbArticles: articles.length,
    nbTypesOp: typesOperations.length,
    nbMoyens: moyensPaiement.length,
    nbEmployes: employes.length,
    nbClients: clients.length
  });

  return payload;
}


/**
 * @function getArticles
 * @description Fonction dédiée si tu veux une lecture d’articles seule.
 * Utilisé par : FN_GET_ARTICLES
 */
function getArticles() {
  console.log("[getArticles] Lecture des articles…");
  return getInitialDataCaisse().articles;
}


/**
 * @function getTypesOperation
 * @description Fonction dédiée pour lire uniquement les types d’opérations.
 * Utilisé par : FN_GET_TYPES_OP
 */
function getTypesOperation() {
  console.log("[getTypesOperation] Lecture des types d’opérations…");
  return getInitialDataCaisse().typesOperations;
}


/**
 * @function getArticleByName
 * @description Récupère un article précis par son nom.
 * Utilisé par : FN_GET_ARTICLE
 *
 * @param {string} nomArticle - Nom exact de l’article (colonne A).
 * @returns {Object|null} Article ou null si introuvable.
 */
function getArticleByName(nomArticle) {
  console.log("[getArticleByName] Recherche de l’article :", nomArticle);

  if (!nomArticle) return null;

  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_ARTICLES);
  if (!sheet) {
    console.error("[getArticleByName] Feuille Articles introuvable.");
    return null;
  }

  const values = sheet.getDataRange().getValues();
  values.shift(); // en-tête

  for (let row of values) {
    if (row[0] === nomArticle) {
      const article = {
        nom: row[0],
        prixAchat: row[1],
        prixVente: row[2],
        stock: row[3],
        categorie: row[4],
        typeCaisse: row[5],
        types: row[6]
      };
      console.log("[getArticleByName] Article trouvé :", article);
      return article;
    }
  }

  console.warn("[getArticleByName] Aucun article trouvé pour :", nomArticle);
  return null;
}


/**
 * @typedef {Object} LigneCaisse
 * @property {string} nomArticle
 * @property {number} prixUnitaire
 * @property {number} quantite
 * @property {number} remiseMontant
 * @property {string} remiseType - "€" ou "%"
 * @property {number} totalLigne
 * @property {string} typeCaisse - "Legal" / "Illegal"
 */

/**
 * @typedef {Object} PayloadCaisse
 * @property {string} modeOperation - "Vente" / "Achat" / "Restock" / "Destock"
 * @property {LigneCaisse[]} lignes
 * @property {number} totalArticles
 * @property {number} livraisonMontant
 * @property {string} livraisonType - "€" ou "%"
 * @property {number} totalGeneral
 * @property {string} employe - optionnel
 * @property {string} client - optionnel
 * @property {string} moyenPaiement - optionnel
 */


/**
 * @function envoyerDonneesCaisse
 * @description Fonction appelée par l’interface pour valider la caisse.
 *  - Applique la logique métier sur les stocks
 *  - Met à jour la feuille Articles
 *  - (Optionnel) Enregistre un ticket / écriture comptable
 *
 * Utilisé par : FN_ENVOYER_CAISSE
 *
 * @param {PayloadCaisse} payload
 * @returns {Object} Résultat (succès, erreurs, détails)
 */
function envoyerDonneesCaisse(payload) {
  console.log("[envoyerDonneesCaisse] Réception du payload :", JSON.stringify(payload, null, 2));

  const mode = payload.modeOperation;
  const lignes = payload.lignes || [];

  const ss = SpreadsheetApp.getActive();
  const sheetArticles = ss.getSheetByName(SHEET_ARTICLES);
  if (!sheetArticles) {
    console.error("[envoyerDonneesCaisse] ERREUR : Feuille Articles introuvable.");
    throw new Error("Feuille Articles introuvable.");
  }

  const dataRange = sheetArticles.getDataRange();
  const values = dataRange.getValues();
  const header = values.shift(); // en-tête
  const nomIndex = 0;
  const stockIndex = 3;

  // On construit un index { nomArticle: { rowIndex, stockActuel } }
  const indexArticles = {};
  values.forEach((row, i) => {
    const nom = row[nomIndex];
    if (nom) {
      indexArticles[nom] = {
        rowIndex: i + 2, // +2 car on a shift() + index base 1
        stockActuel: row[stockIndex]
      };
    }
  });

  const erreurs = [];
  const majStock = [];

  // ============================================================
  // 🔁 TRAITEMENT DE CHAQUE LIGNE
  // ============================================================
  lignes.forEach((ligne, idx) => {
    const nomArticle = ligne.nomArticle;
    const quantite = Number(ligne.quantite) || 0;

    if (!nomArticle || quantite <= 0) {
      console.log(`[envoyerDonneesCaisse] Ligne ${idx + 1} ignorée (article vide ou quantité <= 0).`);
      return;
    }

    const ref = indexArticles[nomArticle];
    if (!ref) {
      const msg = `[envoyerDonneesCaisse] Ligne ${idx + 1} : article introuvable dans la feuille Articles : ${nomArticle}`;
      console.warn(msg);
      erreurs.push(msg);
      return;
    }

    let stockActuel = Number(ref.stockActuel) || 0;
    let nouveauStock = stockActuel;

    // --- LOGIQUE STOCK PAR MODE ---
    switch (mode) {
      case "Vente":
        // Vente : stock - qté, blocage si stock <= 0 ou qté > stock
        if (stockActuel <= 0 || quantite > stockActuel) {
          const msgV = `[envoyerDonneesCaisse] BLOQUÉ (Vente) ligne ${idx + 1} : stock insuffisant (stock=${stockActuel}, qté=${quantite}).`;
          console.warn(msgV);
          erreurs.push(msgV);
          return;
        }
        nouveauStock = stockActuel - quantite;
        break;

      case "Achat":
        // Achat : stock + qté, jamais bloqué
        nouveauStock = stockActuel + quantite;
        break;

      case "Restock":
        // Restock : stock + qté, prix = 0, jamais bloqué
        nouveauStock = stockActuel + quantite;
        break;

      case "Destock":
        // Destock : stock - qté, blocage si stock <= 0 ou qté > stock
        if (stockActuel <= 0 || quantite > stockActuel) {
          const msgD = `[envoyerDonneesCaisse] BLOQUÉ (Destock) ligne ${idx + 1} : stock insuffisant (stock=${stockActuel}, qté=${quantite}).`;
          console.warn(msgD);
          erreurs.push(msgD);
          return;
        }
        nouveauStock = stockActuel - quantite;
        break;

      default:
        const msgM = `[envoyerDonneesCaisse] Mode d’opération inconnu : ${mode}`;
        console.error(msgM);
        erreurs.push(msgM);
        return;
    }

    console.log(`[envoyerDonneesCaisse] Ligne ${idx + 1} : ${nomArticle} | stockActuel=${stockActuel} → nouveauStock=${nouveauStock} (mode=${mode})`);

    majStock.push({
      rowIndex: ref.rowIndex,
      nouveauStock
    });
  });

  // Si erreurs bloquantes, on n’applique rien
  if (erreurs.length > 0) {
    console.warn("[envoyerDonneesCaisse] Validation annulée à cause d’erreurs :", erreurs);
    return {
      success: false,
      message: "Certaines lignes sont invalides, aucune mise à jour appliquée.",
      erreurs
    };
  }

  // ============================================================
  // ✅ APPLICATION DES MISES À JOUR DE STOCK
  // ============================================================
  majStock.forEach(item => {
    sheetArticles.getRange(item.rowIndex, stockIndex + 1).setValue(item.nouveauStock);
  });

  console.log("[envoyerDonneesCaisse] Mise à jour des stocks terminée.", majStock);

  // ============================================================
  // 🧾 ENREGISTREMENT TICKET / COMPTA (HOOKS FUTURS)
  // ============================================================
  // Ici tu pourras appeler :
  // - enregistrerTicket(payload)
  // - updateComptaCaisse(payload)
  // Pour l’instant, on log juste.
  console.log("[envoyerDonneesCaisse] (TODO) Enregistrement ticket / compta à implémenter.");

  return {
    success: true,
    message: "Caisse validée et stocks mis à jour.",
    majStock
  };
}
