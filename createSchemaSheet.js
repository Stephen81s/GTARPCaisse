/**
 * ============================================================
 *  FICHIER : createSchemaSheet.gs
 *  MODULE  : RP BUSINESS SYSTEM — SCHEMA DYNAMIQUE
 *  AUTEUR  : Stephen
 *  VERSION : PRO 2026
 * ============================================================
 */

function createSchemaSheet() {

  Logger.log("===== CREATE SCHEMA SHEET — START =====");

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("SCHEMA");

  // Création ou reset
  if (!sheet) {
    sheet = ss.insertSheet("SCHEMA");
    Logger.log("✔️ Création de l’onglet SCHEMA");
  } else {
    sheet.clear();
    Logger.log("♻️ Réinitialisation de l’onglet SCHEMA");
  }

  // Headers SCHEMA
  const headers = [
    "Feuille",
    "Colonne",
    "Description",
    "Type",
    "Obligatoire",
    "Généré_auto",
    "Modifiable_par",
    "Clé",
    "Relation",
    "Notes"
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");

  /**
   * ============================================================
   *  MATRICE OFFICIELLE — PRO 2026
   * ============================================================
   */
  const referenceMatrix = {

    // ------------------------------------------------------------
    // ENTREPRISES — PRO 2026
    // ------------------------------------------------------------
    "ENTREPRISES": {
      "Entreprise_ID": {desc:"Identifiant unique", type:"string", obligatoire:"oui", auto:"oui", modif:"admin", cle:"PK", relation:"", notes:"Format ENT001"},
      "Nom": {desc:"Nom de l’entreprise", type:"string", obligatoire:"oui", auto:"non", modif:"admin", cle:"", relation:"", notes:""},
      "Patron_ID": {desc:"Joueur patron", type:"string", obligatoire:"oui", auto:"non", modif:"admin", cle:"FK", relation:"JOUEURS.Joueur_ID", notes:""},
      "Type": {desc:"Type RP", type:"string", obligatoire:"non", auto:"non", modif:"admin", cle:"", relation:"", notes:"Optionnel"},
      "Categorie": {desc:"Catégorie RP", type:"string", obligatoire:"non", auto:"non", modif:"admin", cle:"", relation:"", notes:"Optionnel"},
      "Description": {desc:"Description RP", type:"string", obligatoire:"non", auto:"non", modif:"admin", cle:"", relation:"", notes:""},
      "Logo_URL": {desc:"Logo de l’entreprise", type:"string", obligatoire:"non", auto:"non", modif:"admin", cle:"", relation:"", notes:""},
      "Cle": {desc:"Clé interne", type:"string", obligatoire:"non", auto:"non", modif:"admin", cle:"unique", relation:"", notes:"Optionnel"},
      "Date_activation": {desc:"Date de création", type:"date", obligatoire:"oui", auto:"auto", modif:"system", cle:"", relation:"", notes:""},
      "Date_expiration": {desc:"Expiration", type:"date", obligatoire:"non", auto:"non", modif:"admin", cle:"", relation:"", notes:""},
      "Actif": {desc:"Entreprise active", type:"bool", obligatoire:"oui", auto:"auto", modif:"admin", cle:"", relation:"", notes:""}
    },

    // ------------------------------------------------------------
    // JOUEURS — PRO 2026
    // ------------------------------------------------------------
    "JOUEURS": {
      "Joueur_ID": {desc:"Identifiant unique", type:"string", obligatoire:"oui", auto:"oui", modif:"admin", cle:"PK", relation:"", notes:"Format J001"},
      "Nom": {desc:"Nom RP", type:"string", obligatoire:"oui", auto:"non", modif:"admin/patron", cle:"", relation:"", notes:""},
      "Prenom": {desc:"Prénom RP", type:"string", obligatoire:"oui", auto:"non", modif:"admin/patron", cle:"", relation:"", notes:""},
      "Entreprise_ID": {desc:"Entreprise du joueur", type:"string", obligatoire:"non", auto:"non", modif:"admin", cle:"FK", relation:"ENTREPRISES.Entreprise_ID", notes:"Optionnel"}
    },

    // ------------------------------------------------------------
    // EMPLOIS — PRO 2026
    // ------------------------------------------------------------
    "EMPLOIS": {
      "Emploi_ID": {desc:"Identifiant unique", type:"string", obligatoire:"oui", auto:"oui", modif:"admin", cle:"PK", relation:"", notes:"Format EMP001"},
      "Entreprise_ID": {desc:"Référence entreprise", type:"string", obligatoire:"oui", auto:"non", modif:"admin", cle:"FK", relation:"ENTREPRISES.Entreprise_ID", notes:""},
      "Nom": {desc:"Nom de l’emploi", type:"string", obligatoire:"oui", auto:"non", modif:"admin/patron", cle:"", relation:"", notes:""},
      "Description": {desc:"Description RP", type:"string", obligatoire:"non", auto:"non", modif:"admin/patron", cle:"", relation:"", notes:""},
      "Actif": {desc:"Emploi actif", type:"bool", obligatoire:"oui", auto:"auto", modif:"admin", cle:"", relation:"", notes:""}
    },

    // ------------------------------------------------------------
    // GRADES — PRO 2026
    // ------------------------------------------------------------
    "GRADES": {
      "Grade_ID": {desc:"Identifiant unique", type:"string", obligatoire:"oui", auto:"oui", modif:"admin", cle:"PK", relation:"", notes:"Format GR001"},
      "Emploi_ID": {desc:"Référence emploi", type:"string", obligatoire:"oui", auto:"non", modif:"admin", cle:"FK", relation:"EMPLOIS.Emploi_ID", notes:""},
      "Nom": {desc:"Nom du grade", type:"string", obligatoire:"oui", auto:"non", modif:"admin/patron", cle:"", relation:"", notes:""},
      "Niveau": {desc:"Niveau hiérarchique", type:"number", obligatoire:"oui", auto:"non", modif:"admin/patron", cle:"", relation:"", notes:"1 = bas, 5 = haut"},
      "Salaire": {desc:"Salaire RP", type:"number", obligatoire:"non", auto:"non", modif:"admin/patron", cle:"", relation:"", notes:""},
      "Actif": {desc:"Grade actif", type:"bool", obligatoire:"oui", auto:"auto", modif:"admin", cle:"", relation:"", notes:""}
    },

    // ------------------------------------------------------------
    // EMPLOYES — PRO 2026
    // ------------------------------------------------------------
    "EMPLOYES": {
      "Employe_ID": {desc:"Identifiant unique", type:"string", obligatoire:"oui", auto:"oui", modif:"admin", cle:"PK", relation:"", notes:"Format EMPJ001"},
      "Joueur_ID": {desc:"Référence joueur", type:"string", obligatoire:"oui", auto:"non", modif:"admin/patron", cle:"FK", relation:"JOUEURS.Joueur_ID", notes:""},
      "Entreprise_ID": {desc:"Référence entreprise", type:"string", obligatoire:"oui", auto:"non", modif:"admin/patron", cle:"FK", relation:"ENTREPRISES.Entreprise_ID", notes:""},
      "Emploi_ID": {desc:"Référence emploi", type:"string", obligatoire:"oui", auto:"non", modif:"admin/patron", cle:"FK", relation:"EMPLOIS.Emploi_ID", notes:""},
      "Grade_ID": {desc:"Référence grade", type:"string", obligatoire:"oui", auto:"non", modif:"admin/patron", cle:"FK", relation:"GRADES.Grade_ID", notes:""},
      "Date_embauche": {desc:"Date d’embauche", type:"date", obligatoire:"oui", auto:"auto", modif:"system", cle:"", relation:"", notes:""},
      "Actif": {desc:"Employé actif", type:"bool", obligatoire:"oui", auto:"auto", modif:"admin", cle:"", relation:"", notes:""}
    },

    // ------------------------------------------------------------
    // TYPES
    // ------------------------------------------------------------
    "TYPES": {
      "Type_ID": {desc:"Identifiant unique", type:"string", obligatoire:"oui", auto:"oui", modif:"admin", cle:"PK", relation:"", notes:""},
      "Nom": {desc:"Nom du type RP", type:"string", obligatoire:"oui", auto:"non", modif:"admin", cle:"", relation:"", notes:""},
      "Categorie": {desc:"Catégorie RP", type:"string", obligatoire:"oui", auto:"non", modif:"admin", cle:"", relation:"", notes:""}
    },

    // ------------------------------------------------------------
    // CONFIG
    // ------------------------------------------------------------
    "CONFIG": {
      "Parametre": {desc:"Nom du paramètre", type:"string", obligatoire:"oui", auto:"non", modif:"admin", cle:"PK", relation:"", notes:""},
      "Valeur": {desc:"Valeur du paramètre", type:"string", obligatoire:"oui", auto:"non", modif:"admin", cle:"", relation:"", notes:""}
    },

    // ------------------------------------------------------------
    // LOGS
    // ------------------------------------------------------------
    "LOGS": {
      "Date": {desc:"Date/heure", type:"datetime", obligatoire:"oui", auto:"auto", modif:"system", cle:"", relation:"", notes:""},
      "Action": {desc:"Type d’action", type:"string", obligatoire:"oui", auto:"auto", modif:"system", cle:"", relation:"", notes:""},
      "Entreprise": {desc:"ID entreprise", type:"string", obligatoire:"non", auto:"auto", modif:"system", cle:"", relation:"", notes:""},
      "Joueur": {desc:"ID joueur", type:"string", obligatoire:"non", auto:"auto", modif:"system", cle:"", relation:"", notes:""},
      "Auteur": {desc:"Admin ou Patron", type:"string", obligatoire:"oui", auto:"auto", modif:"system", cle:"", relation:"", notes:""}
    }
  };

  // ============================================================
  // Construction dynamique du SCHEMA
  // ============================================================
  const allSheets = ss.getSheets();
  const output = [];

  allSheets.forEach(sh => {
    const name = sh.getName();
    if (name === "SCHEMA") return;

    const cols = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];

    cols.forEach(col => {
      const ref = referenceMatrix[name]?.[col];

      output.push([
        name,
        col,
        ref?.desc || "",
        ref?.type || "string",
        ref?.obligatoire || "non",
        ref?.auto || "non",
        ref?.modif || "admin",
        ref?.cle || "",
        ref?.relation || "",
        ref?.notes || ""
      ]);
    });
  });

  sheet.getRange(2, 1, output.length, headers.length).setValues(output);

  Logger.log(`✔️ ${output.length} colonnes documentées`);
  Logger.log("===== CREATE SCHEMA SHEET — END =====");
}