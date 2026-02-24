/**
 * ==========================================
 * File: schema.gs
 * Project: GTARP Caisse
 * Build: PRO 2026
 * Description: Définition du schéma global BDD
 * ==========================================
 */

const SCHEMA = {

  sheets: {

    CONSTANTES: {
      mode: "keep",
      columns: ["key", "value"]
    },

    LOGS: {
      mode: "append",
      columns: ["timestamp", "source", "message"]
    },

    USERS: {
      mode: "reset",
      columns: ["role","id","jeton","nomRP","prenomRP","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    USER_ROLES: {
      mode: "keep",
      columns: ["role","description","actif"]
    },

    MODULES: {
      mode: "keep",
      columns: ["module","version","actif","description","dependances"]
    },

    FONCTIONS: {
      mode: "keep",
      columns: ["fonction","module","description","version","actif","parametres","retour","notes"]
    },

    CONNEXIONS_EN_ATTENTE: {
      mode: "reset",
      columns: ["id","nomRP","prenomRP","timestamp","ip","status","admin_id","admin_comment","created_at","created_by","updated_at","updated_by"]
    },

    // ============================
    // ENTREPRISES
    // ============================

    ENTREPRISES: {
      mode: "reset",
      columns: ["nom","type","solde","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    EMPLOYES: {
      mode: "reset",
      columns: ["entreprise_id","joueur_id","grade_id","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    GRADES: {
      mode: "reset",
      columns: ["entreprise_id","nom","salaire","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    ENTREPRISE_TRANSACTIONS: {
      mode: "reset",
      columns: ["entreprise_id","montant","type","description","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    // ============================
    // ARTICLES
    // ============================

    ARTICLES: {
      mode: "reset",
      columns: ["nom","categorie","prix","tva","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    ARTICLES_ENTREPRISES: {
      mode: "reset",
      columns: ["entreprise_id","article_id","stock","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    ARTICLES_OPTIONS: {
      mode: "reset",
      columns: ["option","valeur","description"]
    },

    // ============================
    // SERVICES
    // ============================

    SERVICES: {
      mode: "reset",
      columns: ["entreprise_id","nom","prix","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    SERVICES_ACTIONS: {
      mode: "reset",
      columns: ["action","cout","duree","description"]
    },

    // ============================
    // AMENDES
    // ============================

    AMENDES: {
      mode: "reset",
      columns: ["joueur_id","type_id","montant","raison","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    AMENDES_TYPES: {
      mode: "reset",
      columns: ["type","montant","niveau"]
    },

    // ============================
    // FAUX PAPIERS
    // ============================

    FAUX_PAPIERS: {
      mode: "reset",
      columns: ["joueur_id","type_id","prix","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    FAUX_PAPIERS_TYPES: {
      mode: "reset",
      columns: ["type","prix","duree"]
    },

    FAUX_PAPIERS_ENTREPRISES: {
      mode: "reset",
      columns: ["entreprise_id","type_id","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    // ============================
    // ITEMS
    // ============================

    ITEMS: {
      mode: "reset",
      columns: ["nom","type_id","poids","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    ITEMS_TYPES: {
      mode: "reset",
      columns: ["type","rarete","poids"]
    },

    INVENTAIRES: {
      mode: "reset",
      columns: ["joueur_id","item_id","quantite","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    // ============================
    // VEHICULES
    // ============================

    VEHICULES: {
      mode: "reset",
      columns: ["joueur_id","type_id","plaque","couleur","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    VEHICULES_TYPES: {
      mode: "reset",
      columns: ["type","categorie","prix"]
    },

    // ============================
    // LICENCES
    // ============================

    LICENCES: {
      mode: "reset",
      columns: ["joueur_id","type_id","date_expiration","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    LICENCES_TYPES: {
      mode: "reset",
      columns: ["type","prix","duree"]
    },

    // ============================
    // FACTURES & COMMANDES
    // ============================

    FACTURES: {
      mode: "reset",
      columns: ["entreprise_id","montant","description","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    COMMANDES: {
      mode: "reset",
      columns: ["entreprise_id","total","status","created_at","created_by","updated_at","updated_by","actif","status"]
    },

    COMMANDES_LIGNES: {
      mode: "reset",
      columns: ["commande_id","article_id","quantite","prix_unitaire","created_at","created_by","updated_at","updated_by","actif","status"]
    }

  },

  constantes: {
    VERSION: "2026",
    ENV: "prod",
    MAX_ENTREPRISES: 50,
    API_URL: "https://monapi.com"
  },

  fonctions: {
    getUser: {
      module: "USERS",
      description: "Récupère un utilisateur",
      version: "1.0",
      actif: true
    },
    addEntreprise: {
      module: "ENTREPRISES",
      description: "Ajoute une entreprise",
      version: "1.0",
      actif: true
    },
    logAction: {
      module: "SYSTEM",
      description: "Log une action",
      version: "1.0",
      actif: true
    }
  }

};