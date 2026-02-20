/***************************************************************
 * FILE: setup_sheets.gs
 * VERSION: 1.0.0
 * AUTHOR: Stephen + Copilot PRO Architecture
 * DATE: 2026-02-20
 *
 * DESCRIPTION:
 *   Script de reconstruction complète de la BDD GTARPCAISSE.
 *   - Supprime les feuilles inutiles
 *   - Crée toutes les feuilles nécessaires
 *   - Installe toutes les colonnes
 *   - Installe toutes les constantes
 *   - Installe les modules
 *   - Installe les fonctions
 *   - Installe les options
 *   - Initialise USERS, ROLES, LOGS
 *   - Log complet dans LOGS + console
 *
 *   BLOC 1 : LOGGER + OUTILS DE BASE
 ***************************************************************/


/***************************************************************
 * LOGGER PRO 2026
 * Double sortie : LOGS + console
 ***************************************************************/
function logSetup(message) {
  const timestamp = new Date().toISOString();
  const finalMsg = `[SETUP] ${timestamp} — ${message}`;

  // Console (debug)
  console.log(finalMsg);

  // LOGS (si la feuille existe déjà)
  try {
    const ss = SpreadsheetApp.getActive();
    const sheet = ss.getSheetByName("LOGS");
    if (sheet) {
      sheet.appendRow([timestamp, "SETUP", message]);
    }
  } catch (e) {
    console.log("[SETUP] LOGS non disponible au moment du log.");
  }
}


/***************************************************************
 * OUTIL : safeGetSheet(name)
 * Retourne la feuille si elle existe, sinon null
 ***************************************************************/
function safeGetSheet(name) {
  try {
    return SpreadsheetApp.getActive().getSheetByName(name);
  } catch (e) {
    logSetup(`ERREUR safeGetSheet(${name}) : ${e}`);
    return null;
  }
}


/***************************************************************
 * OUTIL : safeCreateSheet(name)
 * Crée la feuille si elle n'existe pas
 ***************************************************************/
function safeCreateSheet(name) {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    logSetup(`Feuille créée : ${name}`);
  } else {
    logSetup(`Feuille déjà existante : ${name}`);
  }

  return sheet;
}


/***************************************************************
 * OUTIL : clearSheet(sheet)
 * Efface tout sauf la ligne d'en-tête
 ***************************************************************/
function clearSheet(sheet) {
  if (!sheet) return;

  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
}


/***************************************************************
 * OUTIL : setHeaders(sheet, headers)
 * Installe les en-têtes PRO (ligne 1)
 ***************************************************************/
function setHeaders(sheet, headers) {
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  logSetup(`En-têtes installés pour ${sheet.getName()}`);
}


/***************************************************************
 * OUTIL : writeConst(key, value)
 * Écrit une constante dans la feuille CONSTANTES
 ***************************************************************/
function writeConst(key, value) {
  const sheet = safeGetSheet("CONSTANTES");
  if (!sheet) {
    logSetup("ERREUR : Feuille CONSTANTES introuvable.");
    return;
  }

  const data = sheet.getDataRange().getValues();
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      return;
    }
  }

  sheet.appendRow([key, value]);
}


/***************************************************************
 * OUTIL : incrementConst(key)
 * Incrémente un compteur d'ID dans CONSTANTES
 ***************************************************************/
function incrementConst(key) {
  const sheet = safeGetSheet("CONSTANTES");
  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === key) {
      const newVal = Number(data[i][1]) + 1;
      sheet.getRange(i + 1, 2).setValue(newVal);
      return newVal;
    }
  }

  logSetup(`ERREUR incrementConst : clé introuvable (${key})`);
  return null;
}


/***************************************************************
 * OUTIL : setup_logStart()
 ***************************************************************/
function setup_logStart() {
  logSetup("=== DÉBUT DU SETUP COMPLET DE LA BDD ===");
}


/***************************************************************
 * OUTIL : setup_logEnd()
 ***************************************************************/
function setup_logEnd() {
  logSetup("=== FIN DU SETUP COMPLET DE LA BDD ===");
}
/***************************************************************
 * BLOC 2 — LISTE OFFICIELLE DES FEUILLES
 * 
 * Objectif :
 *   - Définir TOUTES les feuilles que la BDD doit contenir
 *   - Permettre :
 *       • deleteExtraSheets() → supprime le reste
 *       • createAllSheets() → crée les manquantes
 *       • setupColumns() → installe les colonnes
 *       • setupConstantes() → installe les constantes
 *       • setupModules() / setupFonctions() → s'appuient dessus
 *
 * IMPORTANT :
 *   Ce bloc doit refléter EXACTEMENT les feuilles utilisées
 *   par ton système RP/ERP actuel. Rien de plus, rien de moins.
 ***************************************************************/


/***************************************************************
 * FEUILLES SYSTÈME (NE JAMAIS SUPPRIMER)
 ***************************************************************/
const SYSTEM_SHEETS = [
  "CONSTANTES",
  "LOGS",
  "USERS",
  "USER_ROLES"
];


/***************************************************************
 * FEUILLES DE CONFIGURATION (MODULES + FONCTIONS)
 ***************************************************************/
const CONFIG_SHEETS = [
  "MODULES",
  "FONCTIONS"
];


/***************************************************************
 * FEUILLES D’OPTIONS (catégories, types, paramètres RP)
 * 
 * Ces feuilles sont utilisées pour stocker les types d’articles,
 * services, amendes, faux papiers, items, véhicules, licences…
 ***************************************************************/
const OPTION_SHEETS = [
  "ARTICLES_OPTIONS",
  "SERVICES_ACTIONS",
  "AMENDES_TYPES",
  "FAUX_PAPIERS_TYPES",
  "ITEMS_TYPES",
  "VEHICULES_TYPES",
  "LICENCES_TYPES"
];


/***************************************************************
 * FEUILLES MÉTIER (RP / ERP)
 * 
 * VERSION CORRIGÉE :
 *   → uniquement les feuilles réellement utilisées
 *   → suppression des anciennes feuilles inutiles
 *   → ajout des feuilles manquantes (PERMISSIONS, STOCK, etc.)
 ***************************************************************/
const METIER_SHEETS = [

  // ENTREPRISES
  "ENTREPRISES",
  "EMPLOYES",
  "PERMISSIONS",
  "GRADES",                 // si tu l’utilises encore
  "ENTREPRISE_TRANSACTIONS",// si utilisé pour logs banque

  // ARTICLES
  "ARTICLES",
  "ARTICLES_ENTREPRISES",   // si utilisé

  // STOCK / CRAFT
  "STOCK",
  "CRAFTS",
  "HISTORIQUE",
  "CODES",

  // SERVICES
  "SERVICES",

  // AMENDES
  "AMENDES",

  // FAUX PAPIERS
  "FAUX_PAPIERS",
  "FAUX_PAPIERS_ENTREPRISES",

  // ITEMS / INVENTAIRE
  "ITEMS",
  "INVENTAIRES",

  // VEHICULES
  "VEHICULES",

  // LICENCES
  "LICENCES",

  // FACTURES / COMMANDES
  "FACTURES",
  "COMMANDES",
  "COMMANDES_LIGNES"
];

/***************************************************************
 * LISTE FINALE DES FEUILLES REQUISES
 * (concaténation de toutes les catégories)
 ***************************************************************/
const REQUIRED_SHEETS = [
  ...SYSTEM_SHEETS,
  ...CONFIG_SHEETS,
  ...OPTION_SHEETS,
  ...METIER_SHEETS
];

logSetup("BLOC 2 chargé : liste officielle des feuilles initialisée.");

/***************************************************************
 * BLOC 3 — SUPPRESSION DES FEUILLES INUTILES
 *
 * Objectif :
 *   - Supprimer toutes les feuilles qui ne sont pas dans
 *     REQUIRED_SHEETS (définies dans le BLOC 2)
 *   - Protéger les feuilles système
 *   - Logger chaque suppression
 *
 * Notes :
 *   - On ne supprime JAMAIS : CONSTANTES, LOGS, USERS, USER_ROLES
 *   - On supprime tout le reste
 ***************************************************************/


/***************************************************************
 * OUTIL : isSystemSheet(name)
 * Vérifie si une feuille est une feuille système
 ***************************************************************/
function isSystemSheet(name) {
  return SYSTEM_SHEETS.includes(name);
}


/***************************************************************
 * OUTIL : isRequiredSheet(name)
 * Vérifie si une feuille fait partie de la BDD officielle
 ***************************************************************/
function isRequiredSheet(name) {
  return REQUIRED_SHEETS.includes(name);
}


/***************************************************************
 * FONCTION : deleteExtraSheets()
 * Supprime toutes les feuilles non officielles
 ***************************************************************/
function deleteExtraSheets() {
  logSetup("=== Suppression des feuilles inutiles ===");

  const ss = SpreadsheetApp.getActive();
  const sheets = ss.getSheets();

  sheets.forEach(sheet => {
    const name = sheet.getName();

    // Feuilles système : jamais supprimées
    if (isSystemSheet(name)) {
      logSetup(`Feuille protégée (système) : ${name}`);
      return;
    }

    // Feuilles officielles : on garde
    if (isRequiredSheet(name)) {
      logSetup(`Feuille conservée : ${name}`);
      return;
    }

    // Sinon → suppression
    ss.deleteSheet(sheet);
    logSetup(`Feuille supprimée : ${name}`);
  });

  logSetup("=== Fin suppression feuilles inutiles ===");
}
/***************************************************************
 * BLOC 4 — CRÉATION DES FEUILLES
 *
 * Objectif :
 *   - Créer toutes les feuilles manquantes définies dans
 *     REQUIRED_SHEETS (BLOC 2)
 *   - Logger chaque création
 *   - Ne jamais recréer une feuille existante
 *
 * Notes :
 *   - safeCreateSheet() (BLOC 1) gère la création sécurisée
 ***************************************************************/


/***************************************************************
 * FONCTION : createAllSheets()
 * Crée toutes les feuilles manquantes
 ***************************************************************/
function createAllSheets() {
  logSetup("=== Création des feuilles manquantes ===");

  REQUIRED_SHEETS.forEach(name => {
    const existing = safeGetSheet(name);

    if (existing) {
      logSetup(`Feuille déjà existante : ${name}`);
    } else {
      safeCreateSheet(name);
      logSetup(`Feuille créée : ${name}`);
    }
  });

  logSetup("=== Fin création des feuilles manquantes ===");
}
/***************************************************************
 * BLOC 5 — INSTALLATION DES COLONNES
 *
 * Objectif :
 *   - Installer les colonnes pour toutes les feuilles de la BDD
 *   - Ajouter les colonnes système (id, created_at, etc.)
 *   - Ajouter les colonnes métier selon chaque module
 *   - Logger chaque installation
 *
 * Notes :
 *   - setHeaders() (BLOC 1) gère l'installation propre des en-têtes
 ***************************************************************/


/***************************************************************
 * COLONNES SYSTÈME (communes à toutes les feuilles métier)
 ***************************************************************/
const SYSTEM_COLUMNS = [
  "id",
  "created_at",
  "created_by",
  "updated_at",
  "updated_by",
  "actif",
  "status"
];


/***************************************************************
 * COLONNES PAR FEUILLE — DÉFINITION OFFICIELLE
 * Chaque entrée définit les colonnes métier spécifiques.
 ***************************************************************/
const COLUMNS_DEFINITION = {

  // --- FEUILLES SYSTÈME ---
  "CONSTANTES": ["key", "value"],
  "LOGS": ["timestamp", "source", "message"],
  "USERS": ["email", "nom", "role", ...SYSTEM_COLUMNS],
  "USER_ROLES": ["role", "description", "actif"],

  // --- CONFIGURATION ---
  "MODULES": ["module", "version", "actif", "description", "dependances"],
  "FONCTIONS": ["fonction", "module", "description", "version", "actif", "parametres", "retour", "notes"],

  // --- OPTIONS ---
  "ARTICLES_OPTIONS": ["option", "valeur", "description"],
  "SERVICES_ACTIONS": ["action", "cout", "duree", "description"],
  "AMENDES_TYPES": ["type", "montant", "niveau"],
  "FAUX_PAPIERS_TYPES": ["type", "prix", "duree"],
  "ITEMS_TYPES": ["type", "rarete", "poids"],
  "VEHICULES_TYPES": ["type", "categorie", "prix"],
  "LICENCES_TYPES": ["type", "prix", "duree"],

  // --- ENTREPRISES ---
  "ENTREPRISES": ["nom", "type", "solde", ...SYSTEM_COLUMNS],
  "EMPLOYES": ["entreprise_id", "joueur_id", "grade_id", ...SYSTEM_COLUMNS],
  "GRADES": ["entreprise_id", "nom", "salaire", ...SYSTEM_COLUMNS],
  "ENTREPRISE_TRANSACTIONS": ["entreprise_id", "montant", "type", "description", ...SYSTEM_COLUMNS],

  // --- ARTICLES ---
  "ARTICLES": ["nom", "categorie", "prix", "tva", ...SYSTEM_COLUMNS],
  "ARTICLES_ENTREPRISES": ["entreprise_id", "article_id", "stock", ...SYSTEM_COLUMNS],

  // --- SERVICES ---
  "SERVICES": ["entreprise_id", "nom", "prix", ...SYSTEM_COLUMNS],

  // --- AMENDES ---
  "AMENDES": ["joueur_id", "type_id", "montant", "raison", ...SYSTEM_COLUMNS],

  // --- FAUX PAPIERS ---
  "FAUX_PAPIERS": ["joueur_id", "type_id", "prix", ...SYSTEM_COLUMNS],
  "FAUX_PAPIERS_ENTREPRISES": ["entreprise_id", "type_id", ...SYSTEM_COLUMNS],

  // --- ITEMS / INVENTAIRE ---
  "ITEMS": ["nom", "type_id", "poids", ...SYSTEM_COLUMNS],
  "INVENTAIRES": ["joueur_id", "item_id", "quantite", ...SYSTEM_COLUMNS],

  // --- VEHICULES ---
  "VEHICULES": ["joueur_id", "type_id", "plaque", "couleur", ...SYSTEM_COLUMNS],

  // --- LICENCES ---
  "LICENCES": ["joueur_id", "type_id", "date_expiration", ...SYSTEM_COLUMNS],

  // --- FACTURES / COMMANDES ---
  "FACTURES": ["entreprise_id", "montant", "description", ...SYSTEM_COLUMNS],
  "COMMANDES": ["entreprise_id", "total", "status", ...SYSTEM_COLUMNS],
  "COMMANDES_LIGNES": ["commande_id", "article_id", "quantite", "prix_unitaire", ...SYSTEM_COLUMNS]
};


/***************************************************************
 * FONCTION : setupColumns()
 * Installe les colonnes pour chaque feuille
 ***************************************************************/
function setupColumns() {
  logSetup("=== Installation des colonnes ===");

  REQUIRED_SHEETS.forEach(name => {
    const sheet = safeGetSheet(name);
    if (!sheet) {
      logSetup(`ERREUR : Feuille introuvable pour colonnes : ${name}`);
      return;
    }

    const cols = COLUMNS_DEFINITION[name];
    if (!cols) {
      logSetup(`ERREUR : Aucune définition de colonnes pour ${name}`);
      return;
    }

    setHeaders(sheet, cols);
    logSetup(`Colonnes installées pour ${name}`);
  });

  logSetup("=== Fin installation des colonnes ===");
}

/***************************************************************
 * BLOC 6 — INSTALLATION DES CONSTANTES
 *
 * Objectif :
 *   - Centraliser toutes les constantes système
 *   - Installer les noms de feuilles, compteurs, paramètres
 *   - Éviter les doublons et collisions
 ***************************************************************/


/***************************************************************
 * CONSTANTES : NOMS DES FEUILLES
 ***************************************************************/
const CONST_SHEET_NAMES = {
  SHEET_CONSTANTES: "CONSTANTES",
  SHEET_LOGS: "LOGS",
  SHEET_USERS: "USERS",
  SHEET_USER_ROLES: "USER_ROLES",
  SHEET_MODULES: "MODULES",
  SHEET_FONCTIONS: "FONCTIONS",

  // Options
  SHEET_ARTICLES_OPTIONS: "ARTICLES_OPTIONS",
  SHEET_SERVICES_ACTIONS: "SERVICES_ACTIONS",
  SHEET_AMENDES_TYPES: "AMENDES_TYPES",
  SHEET_FAUX_PAPIERS_TYPES: "FAUX_PAPIERS_TYPES",
  SHEET_ITEMS_TYPES: "ITEMS_TYPES",
  SHEET_VEHICULES_TYPES: "VEHICULES_TYPES",
  SHEET_LICENCES_TYPES: "LICENCES_TYPES",

  // Métier
  SHEET_ENTREPRISES: "ENTREPRISES",
  SHEET_EMPLOYES: "EMPLOYES",
  SHEET_GRADES: "GRADES",
  SHEET_ENTREPRISE_TRANSACTIONS: "ENTREPRISE_TRANSACTIONS",

  SHEET_ARTICLES: "ARTICLES",
  SHEET_ARTICLES_ENTREPRISES: "ARTICLES_ENTREPRISES",

  SHEET_SERVICES: "SERVICES",

  SHEET_AMENDES: "AMENDES",

  SHEET_FAUX_PAPIERS: "FAUX_PAPIERS",
  SHEET_FAUX_PAPIERS_ENTREPRISES: "FAUX_PAPIERS_ENTREPRISES",

  SHEET_ITEMS: "ITEMS",
  SHEET_INVENTAIRES: "INVENTAIRES",

  SHEET_VEHICULES: "VEHICULES",

  SHEET_LICENCES: "LICENCES",

  SHEET_FACTURES: "FACTURES",
  SHEET_COMMANDES: "COMMANDES",
  SHEET_COMMANDES_LIGNES: "COMMANDES_LIGNES"
};


/***************************************************************
 * CONSTANTES : COMPTEURS D’ID
 ***************************************************************/
const CONST_COUNTERS = {
  NEXT_ENTREPRISE_ID: 1,
  NEXT_EMPLOYE_ID: 1,
  NEXT_GRADE_ID: 1,
  NEXT_ARTICLE_ID: 1,
  NEXT_SERVICE_ID: 1,
  NEXT_AMENDE_ID: 1,
  NEXT_FAUXPAPIER_ID: 1,
  NEXT_ITEM_ID: 1,
  NEXT_VEHICULE_ID: 1,
  NEXT_LICENCE_ID: 1,
  NEXT_FACTURE_ID: 1,
  NEXT_COMMANDE_ID: 1
};


/***************************************************************
 * CONSTANTES : PARAMÈTRES SYSTÈME (VERSION FUSIONNÉE)
 ***************************************************************/
const CONST_SYSTEM = {

  // Version système
  SYSTEM_VERSION: "PRO-2026",

  // TVA par défaut
  DEFAULT_TVA: 20,

  // Rôle par défaut
  DEFAULT_ROLE: "joueur",

  // Statuts génériques
  STATUS_ACTIVE: "active",
  STATUS_INACTIVE: "inactive",
  STATUS_PENDING: "pending",

  // Email administrateur principal
  ADMIN_EMAIL: "admin@gtarp.fr",

  // URL WebApp (mise à jour auto après déploiement)
  WEBAPP_URL: "",

  // Activation des logs Discord
  ENABLE_DISCORD_LOGS: true
};


/***************************************************************
 * CONSTANTES DISCORD — Webhooks pour les logs RP
 ***************************************************************/
const CONST_DISCORD = {
  LOGS_BANQUE: "",
  LOGS_CRAFT: "",
  LOGS_STOCK: "",
  LOGS_EMPLOYES: "",
  LOGS_PERMISSIONS: "",
  LOGS_ENTREPRISE: ""
};


/***************************************************************
 * FONCTION : setupConstantes()
 ***************************************************************/
function setupConstantes() {
  logSetup("=== Installation des CONSTANTES ===");

  const sheet = safeGetSheet("CONSTANTES");
  if (!sheet) {
    logSetup("ERREUR : Feuille CONSTANTES introuvable.");
    return;
  }

  // Réinitialisation propre
  setHeaders(sheet, ["key", "value"]);

  // Noms des feuilles
  Object.keys(CONST_SHEET_NAMES).forEach(key => {
    writeConst(key, CONST_SHEET_NAMES[key]);
  });

  // Compteurs d’ID
  Object.keys(CONST_COUNTERS).forEach(key => {
    writeConst(key, CONST_COUNTERS[key]);
  });

  // Paramètres système
  Object.keys(CONST_SYSTEM).forEach(key => {
    writeConst(key, CONST_SYSTEM[key]);
  });

  // Webhooks Discord
  Object.keys(CONST_DISCORD).forEach(key => {
    writeConst(key, CONST_DISCORD[key]);
  });

  logSetup("=== Fin installation des CONSTANTES ===");
}

/***************************************************************
 * BLOC 7 — INSTALLATION DES MODULES
 *
 * Objectif :
 *   - Installer la feuille MODULES avec tous les modules RP/ERP
 *   - Définir version, description, dépendances, statut actif
 *   - Permettre au backend de lire la configuration des modules
 *   - Logger chaque installation
 *
 * Notes :
 *   - Chaque module peut être activé/désactivé sans toucher au code
 ***************************************************************/


/***************************************************************
 * DÉFINITION OFFICIELLE DES MODULES
 * Chaque module est une entrée du tableau MODULES_DEFINITION.
 ***************************************************************/
const MODULES_DEFINITION = [
  {
    module: "systeme",
    version: "1.0.0",
    actif: "yes",
    description: "Module système (logs, constantes, utilisateurs)",
    dependances: ""
  },
  {
    module: "entreprises",
    version: "1.0.0",
    actif: "yes",
    description: "Gestion des entreprises, employés, grades, transactions",
    dependances: "systeme"
  },
  {
    module: "articles",
    version: "1.0.0",
    actif: "yes",
    description: "Catalogue d’articles et gestion des stocks",
    dependances: "entreprises"
  },
  {
    module: "services",
    version: "1.0.0",
    actif: "yes",
    description: "Gestion des services proposés par les entreprises",
    dependances: "entreprises"
  },
  {
    module: "amendes",
    version: "1.0.0",
    actif: "yes",
    description: "Gestion des amendes RP",
    dependances: "systeme"
  },
  {
    module: "faux_papiers",
    version: "1.0.0",
    actif: "yes",
    description: "Gestion des faux papiers RP",
    dependances: "entreprises"
  },
  {
    module: "items",
    version: "1.0.0",
    actif: "yes",
    description: "Gestion des items et inventaires",
    dependances: "systeme"
  },
  {
    module: "vehicules",
    version: "1.0.0",
    actif: "yes",
    description: "Gestion des véhicules RP",
    dependances: "systeme"
  },
  {
    module: "licences",
    version: "1.0.0",
    actif: "yes",
    description: "Gestion des licences RP",
    dependances: "systeme"
  },
  {
    module: "factures",
    version: "1.0.0",
    actif: "yes",
    description: "Gestion des factures entreprises",
    dependances: "entreprises"
  },
  {
    module: "commandes",
    version: "1.0.0",
    actif: "yes",
    description: "Gestion des commandes et lignes de commande",
    dependances: "articles"
  }
];


/***************************************************************
 * FONCTION : setupModules()
 * Installe la feuille MODULES avec toutes les entrées
 ***************************************************************/
function setupModules() {
  logSetup("=== Installation des MODULES ===");

  const sheet = safeGetSheet("MODULES");
  if (!sheet) {
    logSetup("ERREUR : Feuille MODULES introuvable.");
    return;
  }

  // Réinitialisation propre
  setHeaders(sheet, ["module", "version", "actif", "description", "dependances"]);

  // Remplissage
  MODULES_DEFINITION.forEach(mod => {
    sheet.appendRow([
      mod.module,
      mod.version,
      mod.actif,
      mod.description,
      mod.dependances
    ]);

    logSetup(`Module installé : ${mod.module} (v${mod.version})`);
  });

  logSetup("=== Fin installation des MODULES ===");
}
/***************************************************************
 * BLOC 8 — INSTALLATION DES FONCTIONS
 *
 * Objectif :
 *   - Installer la feuille FONCTIONS avec la liste complète
 *     des fonctions backend du système
 *   - Documenter module, version, paramètres, retour, statut
 *   - Permettre au backend de vérifier si une fonction est active
 *   - Logger chaque installation
 *
 * Notes :
 *   - Cette feuille sert de documentation interne + contrôle système
 *   - Le backend peut désactiver une fonction sans toucher au code
 ***************************************************************/


/***************************************************************
 * DÉFINITION OFFICIELLE DES FONCTIONS BACKEND
 * Chaque entrée représente une fonction Apps Script réelle.
 *
 * Format :
 *   fonction      : nom exact de la fonction backend
 *   module        : module auquel elle appartient
 *   description   : rôle de la fonction
 *   version       : version de la fonction
 *   actif         : yes/no
 *   parametres    : liste des paramètres attendus
 *   retour        : type de retour
 ***************************************************************/
const FONCTIONS_DEFINITION = [

  // --- SYSTEME ---
  {
    fonction: "getConst",
    module: "systeme",
    description: "Retourne la valeur d'une constante système",
    version: "1.0.0",
    actif: "yes",
    parametres: "key",
    retour: "string"
  },
  {
    fonction: "setConst",
    module: "systeme",
    description: "Met à jour une constante système",
    version: "1.0.0",
    actif: "yes",
    parametres: "key, value",
    retour: "void"
  },
  {
    fonction: "incrementConst",
    module: "systeme",
    description: "Incrémente un compteur d’ID",
    version: "1.0.0",
    actif: "yes",
    parametres: "key",
    retour: "number"
  },

  // --- ENTREPRISES ---
  {
    fonction: "createEntreprise",
    module: "entreprises",
    description: "Crée une nouvelle entreprise",
    version: "1.0.0",
    actif: "yes",
    parametres: "nom, type",
    retour: "entreprise_id"
  },
  {
    fonction: "getEntreprises",
    module: "entreprises",
    description: "Retourne la liste des entreprises",
    version: "1.0.0",
    actif: "yes",
    parametres: "",
    retour: "tableau"
  },
  {
    fonction: "updateEntreprise",
    module: "entreprises",
    description: "Met à jour une entreprise",
    version: "1.0.0",
    actif: "yes",
    parametres: "entreprise_id, data",
    retour: "void"
  },

  // --- EMPLOYES ---
  {
    fonction: "createEmploye",
    module: "entreprises",
    description: "Ajoute un employé à une entreprise",
    version: "1.0.0",
    actif: "yes",
    parametres: "entreprise_id, joueur_id, grade_id",
    retour: "employe_id"
  },

  // --- ARTICLES ---
  {
    fonction: "createArticle",
    module: "articles",
    description: "Crée un article global",
    version: "1.0.0",
    actif: "yes",
    parametres: "nom, categorie, prix, tva",
    retour: "article_id"
  },
  {
    fonction: "getArticles",
    module: "articles",
    description: "Retourne la liste des articles",
    version: "1.0.0",
    actif: "yes",
    parametres: "",
    retour: "tableau"
  },

  // --- SERVICES ---
  {
    fonction: "createService",
    module: "services",
    description: "Crée un service pour une entreprise",
    version: "1.0.0",
    actif: "yes",
    parametres: "entreprise_id, nom, prix",
    retour: "service_id"
  },

  // --- AMENDES ---
  {
    fonction: "createAmende",
    module: "amendes",
    description: "Crée une amende RP",
    version: "1.0.0",
    actif: "yes",
    parametres: "joueur_id, type_id, montant, raison",
    retour: "amende_id"
  },

  // --- FAUX PAPIERS ---
  {
    fonction: "createFauxPapier",
    module: "faux_papiers",
    description: "Crée un faux papier RP",
    version: "1.0.0",
    actif: "yes",
    parametres: "joueur_id, type_id, prix",
    retour: "faux_papier_id"
  },

  // --- ITEMS ---
  {
    fonction: "createItem",
    module: "items",
    description: "Crée un item global",
    version: "1.0.0",
    actif: "yes",
    parametres: "nom, type_id, poids",
    retour: "item_id"
  },

  // --- VEHICULES ---
  {
    fonction: "createVehicule",
    module: "vehicules",
    description: "Crée un véhicule RP",
    version: "1.0.0",
    actif: "yes",
    parametres: "joueur_id, type_id, plaque, couleur",
    retour: "vehicule_id"
  },

  // --- LICENCES ---
  {
    fonction: "createLicence",
    module: "licences",
    description: "Attribue une licence à un joueur",
    version: "1.0.0",
    actif: "yes",
    parametres: "joueur_id, type_id, date_expiration",
    retour: "licence_id"
  },

  // --- COMMANDES ---
  {
    fonction: "createCommande",
    module: "commandes",
    description: "Crée une commande entreprise",
    version: "1.0.0",
    actif: "yes",
    parametres: "entreprise_id, total",
    retour: "commande_id"
  }
];


/***************************************************************
 * FONCTION : setupFonctions()
 * Installe la feuille FONCTIONS avec toutes les entrées
 ***************************************************************/
function setupFonctions() {
  logSetup("=== Installation des FONCTIONS ===");

  const sheet = safeGetSheet("FONCTIONS");
  if (!sheet) {
    logSetup("ERREUR : Feuille FONCTIONS introuvable.");
    return;
  }

  // Réinitialisation propre
  setHeaders(sheet, [
    "fonction",
    "module",
    "description",
    "version",
    "actif",
    "parametres",
    "retour",
    "notes"
  ]);

  // Remplissage
  FONCTIONS_DEFINITION.forEach(fn => {
    sheet.appendRow([
      fn.fonction,
      fn.module,
      fn.description,
      fn.version,
      fn.actif,
      fn.parametres,
      fn.retour,
      ""
    ]);

    logSetup(`Fonction installée : ${fn.fonction} (module ${fn.module})`);
  });

  logSetup("=== Fin installation des FONCTIONS ===");
}
/***************************************************************
 * BLOC 9 — INSTALLATION DES OPTIONS
 *
 * Objectif :
 *   - Installer toutes les options RP dans les feuilles dédiées
 *   - Centraliser les catégories, types, actions, etc.
 *   - Permettre au backend de lire dynamiquement les options
 *   - Logger chaque installation
 *
 * Notes :
 *   - Chaque feuille d’options est remplie avec des valeurs
 *     par défaut, modifiables ensuite via l’admin panel.
 ***************************************************************/


/***************************************************************
 * DÉFINITION OFFICIELLE DES OPTIONS
 * Chaque entrée correspond à une feuille d’options.
 ***************************************************************/
const OPTIONS_DEFINITION = {

  // --- ARTICLES ---
  "ARTICLES_OPTIONS": [
    ["categorie", "nourriture", "Articles consommables"],
    ["categorie", "boisson", "Boissons diverses"],
    ["categorie", "outil", "Outils et matériel"],
    ["categorie", "arme", "Armes légères"]
  ],

  // --- SERVICES ---
  "SERVICES_ACTIONS": [
    ["action", "nettoyage", "Nettoyage complet du véhicule"],
    ["action", "reparation", "Réparation mécanique"],
    ["action", "livraison", "Livraison d’articles"],
    ["action", "maintenance", "Maintenance générale"]
  ],

  // --- AMENDES ---
  "AMENDES_TYPES": [
    ["type", "excès_vitesse", "1"],
    ["type", "stationnement_genant", "1"],
    ["type", "conduite_dangereuse", "2"],
    ["type", "agression", "3"]
  ],

  // --- FAUX PAPIERS ---
  "FAUX_PAPIERS_TYPES": [
    ["type", "carte_identite", "1500"],
    ["type", "permis_conduire", "2000"],
    ["type", "passeport", "3000"]
  ],

  // --- ITEMS ---
  "ITEMS_TYPES": [
    ["type", "consommable", "1"],
    ["type", "materiel", "2"],
    ["type", "rare", "5"]
  ],

  // --- VEHICULES ---
  "VEHICULES_TYPES": [
    ["type", "compact", "A", "15000"],
    ["type", "berline", "B", "25000"],
    ["type", "sportive", "C", "60000"],
    ["type", "utilitaire", "D", "30000"]
  ],

  // --- LICENCES ---
  "LICENCES_TYPES": [
    ["type", "arme", "5000", "365"],
    ["type", "chasse", "3000", "365"],
    ["type", "peche", "1000", "365"]
  ]
};


/***************************************************************
 * FONCTION : setupOptions()
 * Installe toutes les options dans les feuilles dédiées
 ***************************************************************/
function setupOptions() {
  logSetup("=== Installation des OPTIONS ===");

  Object.keys(OPTIONS_DEFINITION).forEach(sheetName => {
    const sheet = safeGetSheet(sheetName);

    if (!sheet) {
      logSetup(`ERREUR : Feuille d’options introuvable : ${sheetName}`);
      return;
    }

    // Récupération des en-têtes existants
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Réinitialisation propre
    clearSheet(sheet);

    // Remplissage
    OPTIONS_DEFINITION[sheetName].forEach(optionRow => {
      const row = [];

      // On mappe chaque valeur sur les colonnes existantes
      headers.forEach((col, index) => {
        row[index] = optionRow[index] || "";
      });

      sheet.appendRow(row);
    });

    logSetup(`Options installées pour ${sheetName}`);
  });

  logSetup("=== Fin installation des OPTIONS ===");
}
/***************************************************************
 * BLOC 10 — INITIALISATION DES FEUILLES SYSTÈME
 *
 * Objectif :
 *   - Initialiser USERS avec un compte admin
 *   - Initialiser USER_ROLES avec les rôles système
 *   - Initialiser LOGS avec une première entrée
 *   - Initialiser les FEUILLES RP (entreprises, employés, stock…)
 *   - Garantir que le système démarre avec une base propre
 *
 * Notes :
 *   - L’email admin est défini dans CONSTANTES (ADMIN_EMAIL)
 *   - Les rôles sont centralisés dans USER_ROLES
 ***************************************************************/


/***************************************************************
 * RÔLES SYSTÈME OFFICIELS
 ***************************************************************/
const SYSTEM_ROLES = [
  ["admin", "Accès total au système", "yes"],
  ["entreprise", "Gestion entreprise (RP)", "yes"],
  ["employe", "Employé d’entreprise", "yes"],
  ["joueur", "Utilisateur standard RP", "yes"]
];


/***************************************************************
 * BLOC 10A — FEUILLES RP (Entreprises)
 *
 * Objectif :
 *   - Créer toutes les feuilles nécessaires au système RP
 *   - Ne pas recréer les feuilles existantes
 ***************************************************************/
function setupRPSheets() {
  logSetup("=== Initialisation des FEUILLES RP ===");

  const ss = SpreadsheetApp.getActive();

  const rpSheets = [
    { name: "ENTREPRISES", header: ["ID", "Nom", "Type", "Solde", "PatronCode"] },
    { name: "EMPLOYES", header: ["CodeJoueur", "Nom", "Prenom", "EntrepriseID", "Role"] },
    { name: "PERMISSIONS", header: ["EntrepriseID", "Role", "Banque", "Caisse", "Craft", "Stock", "Articles", "Employes", "Config"] },
    { name: "STOCK", header: ["EntrepriseID", "Item", "Quantite"] },
    { name: "ARTICLES", header: ["EntrepriseID", "Article", "Prix", "Categorie"] },
    { name: "CRAFTS", header: ["EntrepriseID", "Produit", "Ingredient", "Quantite"] },
    { name: "HISTORIQUE", header: ["Date", "EntrepriseID", "Employe", "Type", "Details", "Montant"] },
    { name: "CODES", header: ["Code", "RoleGlobal", "EntrepriseID"] }
  ];

  rpSheets.forEach(s => {
    let sh = ss.getSheetByName(s.name);

    if (!sh) {
      sh = ss.insertSheet(s.name);
      sh.appendRow(s.header);
      logSetup("🟩 Feuille RP créée : " + s.name);
    } else {
      logSetup("🟦 Feuille RP déjà existante : " + s.name);
    }
  });

  logSetup("=== Fin initialisation FEUILLES RP ===");
}


/***************************************************************
 * BLOC 10B — FONCTION : setupSystemSheets()
 * Initialise USERS, USER_ROLES, LOGS
 ***************************************************************/
function setupSystemSheets() {
  logSetup("=== Initialisation des FEUILLES SYSTÈME ===");

  /***********************************************************
   * 1) INITIALISATION DE USER_ROLES
   ***********************************************************/
  const rolesSheet = safeGetSheet("USER_ROLES");
  if (!rolesSheet) {
    logSetup("ERREUR : Feuille USER_ROLES introuvable.");
  } else {
    setHeaders(rolesSheet, ["role", "description", "actif"]);
    SYSTEM_ROLES.forEach(roleRow => {
      rolesSheet.appendRow(roleRow);
      logSetup(`Rôle installé : ${roleRow[0]}`);
    });
  }


  /***********************************************************
   * 2) INITIALISATION DE USERS
   ***********************************************************/
  const usersSheet = safeGetSheet("USERS");
  if (!usersSheet) {
    logSetup("ERREUR : Feuille USERS introuvable.");
  } else {
    setHeaders(usersSheet, ["email", "nom", "role", "id", "created_at", "created_by", "updated_at", "updated_by", "actif", "status"]);

    const adminEmail = CONST_SYSTEM.ADMIN_EMAIL || "admin@gtarp.fr";
    const now = new Date().toISOString();

    usersSheet.appendRow([
      adminEmail,
      "Administrateur",
      "admin",
      "USR001",
      now,
      "system",
      now,
      "system",
      "yes",
      "active"
    ]);

    logSetup(`Utilisateur admin initialisé : ${adminEmail}`);
  }


  /***********************************************************
   * 3) INITIALISATION DE LOGS
   ***********************************************************/
  const logsSheet = safeGetSheet("LOGS");
  if (!logsSheet) {
    logSetup("ERREUR : Feuille LOGS introuvable.");
  } else {
    setHeaders(logsSheet, ["timestamp", "source", "message"]);
    logsSheet.appendRow([new Date().toISOString(), "SETUP", "Initialisation des logs"]);
    logSetup("Feuille LOGS initialisée.");
  }

  logSetup("=== Fin initialisation des FEUILLES SYSTÈME ===");
}
/***************************************************************
 * BLOC 11 — FONCTION PRINCIPALE
 *
 * Objectif :
 *   - Orchestrer l’intégralité du setup de la BDD
 *   - Appeler chaque bloc dans l’ordre logique
 *   - Logger début et fin du processus
 ***************************************************************/
function setup_rebuildFullDatabase() {
  setup_logStart();

  try {
    logSetup("=== DÉMARRAGE DU SETUP COMPLET ===");

    // 1) Suppression des feuilles inutiles
    deleteExtraSheets();

    // 2) Création de toutes les feuilles manquantes
    createAllSheets();

    // 3) Installation des colonnes
    setupColumns();

    // 4) Installation des constantes
    setupConstantes();

    // 5) Installation des modules
    setupModules();

    // 6) Installation des fonctions
    setupFonctions();

    // 7) Installation des options
    setupOptions();

    // 8) Initialisation des feuilles RP (Entreprises)
    setupRPSheets();

    // 9) Initialisation des feuilles système (USERS, ROLES, LOGS)
    setupSystemSheets();

    logSetup("=== SETUP COMPLET TERMINÉ AVEC SUCCÈS ===");

  } catch (e) {
    logSetup("ERREUR CRITIQUE DURANT LE SETUP : " + e);
    throw e;
  }

  setup_logEnd();
}