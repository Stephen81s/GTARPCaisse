/**
 * ============================================================
 *  FICHIER : constants.gs
 *  MODULE  : RP BUSINESS SYSTEM — CONSTANTES GLOBALES
 *  VERSION : PRO 2026
 *  AUTHOR  : Stephen
 *  PURPOSE : Centralisation des constantes du système
 * ============================================================
 */

var consts = {

  /* ============================================================
     FEUILLES DU SYSTÈME
     ============================================================ */
  SHEET_JOUEURS: "JOUEURS",
  SHEET_ENTREPRISES: "ENTREPRISES",
  SHEET_CONFIG: "CONFIG",
  SHEET_FUNCTIONS: "FUNCTIONS",
  SHEET_CONSTANTES: "CONSTANTES",

  /* ============================================================
     PREFIXES ID (pour génération d'identifiants uniques)
     ============================================================ */
  PREFIX_JOUEUR: "J",
  PREFIX_ENTREPRISE: "E",

  /* ============================================================
     TYPES / DEFAULTS
     ============================================================ */
  DEFAULT_TYPE_ID: "T001",

  /* ============================================================
     CLÉS DE CONFIGURATION (CONFIG!A:B)
     ============================================================ */
  CONFIG_ADMIN_PRINCIPAL: "Admin_principal",      // email admin principal
  CONFIG_ADMINS_SECONDAIRES: "Admins_secondaires", // liste emails admins secondaires

  /* ============================================================
     PARAMÈTRES GÉNÉRAUX
     ============================================================ */
  TIMEZONE: "Europe/Paris",
  SYSTEM_VERSION: "PRO 2026",
  SYSTEM_NAME: "RP Business System"
};