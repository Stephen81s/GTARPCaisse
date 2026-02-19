/**
 * ============================================================
 *  FICHIER : generateKey.gs
 *  MODULE  : RP BUSINESS SYSTEM — UTILITAIRES
 *  AUTEUR  : Stephen
 *  VERSION : PRO 2026
 *
 *  OBJET :
 *      Génère une clé unique au format AAA-123-BBB.
 *      Utilisée pour identifier les entreprises RP.
 *
 *  CARACTÉRISTIQUES :
 *      - 3 lettres + 3 chiffres + 3 lettres
 *      - Génération pseudo‑aléatoire
 *      - Ultra‑logs pour traçabilité
 *
 *  EXEMPLE :
 *      → "QTR-582-LKM"
 * ============================================================
 */

function generateKey() {
  Logger.log("===== GENERATE KEY — START =====");

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  /**
   * Génère une suite de lettres aléatoires.
   */
  function randLetters(n) {
    const result = Array.from({ length: n }, () =>
      letters[Math.floor(Math.random() * letters.length)]
    ).join("");

    Logger.log(`🔤 Lettres générées (${n}) : ${result}`);
    return result;
  }

  /**
   * Génère une suite de chiffres aléatoires.
   */
  function randNumbers(n) {
    const result = Array.from({ length: n }, () =>
      numbers[Math.floor(Math.random() * numbers.length)]
    ).join("");

    Logger.log(`🔢 Chiffres générés (${n}) : ${result}`);
    return result;
  }

  // Construction finale de la clé
  const key = `${randLetters(3)}-${randNumbers(3)}-${randLetters(3)}`;

  Logger.log("🔑 Clé générée : " + key);
  Logger.log("===== GENERATE KEY — END =====");

  return key;
}