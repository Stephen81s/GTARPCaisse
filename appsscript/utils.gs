/**
 * ============================================================
 *  FICHIER : utils.gs
 *  MODULE  : RP BUSINESS SYSTEM — UTILS
 *  VERSION : PRO 2026
 *  AUTEUR  : Stephen + Copilot PRO
 * ------------------------------------------------------------
 *  DESCRIPTION :
 *  Fonctions utilitaires globales utilisées dans tout le
 *  système RP Business :
 *   - Génération d'ID uniques
 *   - Génération de clés entreprise
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

console.log("🟩 [utils.gs] Module UTILS chargé avec succès.");