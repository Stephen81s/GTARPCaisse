// ==========================================
// File: SCHEMA_MANAGER.gs
// Project: GTARP Caisse
// Module: SCHEMA Manager (Static)
// Build: PRO 2026
// ==========================================

function getSheetSchema(sheetName) {
  return SCHEMA.sheets[sheetName];
}

function getConst(key) {
  return SCHEMA.constantes[key];
}

function getFunctionSchema(name) {
  return SCHEMA.fonctions[name];
}