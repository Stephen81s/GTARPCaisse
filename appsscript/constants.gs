/**
 * ============================================================
 *  FICHIER : constants.gs
 *  MODULE  : RP BUSINESS SYSTEM — CONSTANTES GLOBALES
 *  VERSION : PRO 2026
 *  AUTEUR  : Stephen + Copilot PRO
 * ------------------------------------------------------------
 *  DESCRIPTION :
 *  Centralise toutes les constantes globales du système :
 *    - Noms des feuilles
 *    - Préfixes d'identifiants
 *    - Clés de configuration
 *    - Paramètres généraux
 * ------------------------------------------------------------
 *  LOGS :
 *  🟦 [constants.gs] Module CONSTANTES chargé.
 * ============================================================
 */

console.log("🟦 [constants.gs] Chargement des constantes globales...");

var consts = {};

/* ============================================================
   FEUILLES DU SYSTÈME
   ============================================================ */
consts.SHEET_JOUEURS      = "JOUEURS";
consts.SHEET_ENTREPRISES  = "ENTREPRISES";
consts.SHEET_CONFIG       = "CONFIG";
consts.SHEET_FUNCTIONS    = "FUNCTIONS";
consts.SHEET_CONSTANTES   = "CONSTANTES";

/* ============================================================
   PREFIXES ID (pour génération d'identifiants uniques)
   ============================================================ */
consts.PREFIX_JOUEUR      = "J";
consts.PREFIX_ENTREPRISE  = "E";

/* ============================================================
   TYPES / DEFAULTS
   ============================================================ */
consts.DEFAULT_TYPE_ID    = "T001";

/* ============================================================
   CLÉS DE CONFIGURATION (CONFIG!A:B)
   ============================================================ */
consts.CONFIG_ADMIN_PRINCIPAL     = "Admin_principal";       // email admin principal
consts.CONFIG_ADMINS_SECONDAIRES  = "Admins_secondaires";    // liste emails admins secondaires

/* ============================================================
   PARAMÈTRES GÉNÉRAUX
   ============================================================ */
consts.TIMEZONE        = "Europe/Paris";
consts.SYSTEM_VERSION  = "PRO 2026";
consts.SYSTEM_NAME     = "RP Business System";

console.log("🟩 [constants.gs] Constantes globales chargées avec succès.");