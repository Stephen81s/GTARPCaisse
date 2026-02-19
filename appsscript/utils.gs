/**
 * ============================================================
 *  FICHIER : utils.gs
 *  MODULE  : RP BUSINESS SYSTEM — UTILS
 *  VERSION : PRO 2026
 *  AUTEUR  : Stephen + Copilot PRO
 * ------------------------------------------------------------
 *  DESCRIPTION :
 *    Fonctions utilitaires globales utilisées dans tout le
 *    système RP Business :
 *      - Génération d'ID uniques
 *      - Génération de clés entreprise
 *      - Normalisation
 *      - Helpers divers
 * ------------------------------------------------------------
 *  LOGS :
 *  🟦 [utils.gs] Module UTILS chargé.
 * ============================================================
 */

console.log("🟦 [utils.gs] Chargement du module UTILS...");

var utils = {};


/* ============================================================
   GENERATE ID — ID UNIQUE AVEC TIMESTAMP + RANDOM
   ============================================================ */
/**
 * Génère un ID unique basé sur :
 *  - un préfixe
 *  - un timestamp complet (yyyyMMddHHmmss)
 *  - un nombre aléatoire sur 3 chiffres
 *
 * Exemple : ENT_20260219160512_042
 */
utils.generateID = function (prefix) {
  console.log("🔧 [utils] generateID() — Préfixe :", prefix);

  const now = new Date();
  const stamp = Utilities.formatDate(
    now,
    Session.getScriptTimeZone(),
    "yyyyMMddHHmmss"
  );

  const rand = Math.floor(Math.random() * 1000);
  const id = prefix + "_" + stamp + "_" + Utilities.formatString("%03d", rand);

  console.log("🔧 [utils] ID généré :", id);
  return id;
};


/* ============================================================
   GENERATE ENTREPRISE KEY — CLÉ ENTREPRISE 10 CARACTÈRES
   ============================================================ */
/**
 * Génère une clé entreprise aléatoire de 10 caractères,
 * composée de lettres non ambiguës + chiffres.
 *
 * Exemple : 9ZK4H7Q2LM
 */
utils.generateEntrepriseKey = function () {
  console.log("🔧 [utils] generateEntrepriseKey()");

  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let key = "";

  for (let i = 0; i < 10; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  console.log("🔧 [utils] Clé entreprise générée :", key);
  return key;
};


/* ============================================================
   NORMALISATION — CHAÎNES / NOMS / ESPACES
   ============================================================ */
/**
 * Nettoie une chaîne :
 *  - trim()
 *  - supprime espaces multiples
 *  - met en forme standard
 */
utils.normalizeString = function (str) {
  if (!str) return "";
  return String(str)
    .trim()
    .replace(/\s+/g, " ");
};

/**
 * Normalise un nom propre :
 *  - trim
 *  - première lettre majuscule
 *  - reste en minuscule
 */
utils.normalizeName = function (str) {
  const s = utils.normalizeString(str);
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};


/* ============================================================
   VALIDATION — EMAIL / NOMBRE / BOOL
   ============================================================ */
utils.isValidEmail = function (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
};

utils.toBool = function (value) {
  return value === true || value === "true" || value === 1;
};


/* ============================================================
   DATES — FORMATAGE
   ============================================================ */
utils.formatDate = function (date) {
  if (!(date instanceof Date)) return "";
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
};


/* ============================================================
   LOGGING — FORMAT PRO 2026
   ============================================================ */
utils.log = function (module, message) {
  Logger.log("[" + module + "] " + message);
};


console.log("🟩 [utils.gs] Module UTILS chargé avec succès.");