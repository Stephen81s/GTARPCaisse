/**
 * ============================================================
 *  populateTypes()
 *  Auteur : Stephen
 *  Description :
 *      Remplit automatiquement l’onglet TYPES avec la liste
 *      PRO des types RP (Public, Légal, Criminel, Gang, Clandestin).
 * ============================================================
 */
function populateTypes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("TYPES");
  sheet.clear();
  sheet.appendRow(["Type_ID", "Nom", "Categorie"]);

  const types = [
    // PUBLIC
    ["T001", "Police", "Public"],
    ["T002", "Sheriff", "Public"],
    ["T003", "EMS", "Public"],
    ["T004", "Pompiers", "Public"],
    ["T005", "Gouvernement", "Public"],
    ["T006", "Mairie", "Public"],
    ["T007", "Justice", "Public"],
    ["T008", "Douanes", "Public"],
    ["T009", "FIB", "Public"],

    // LEGAL
    ["T010", "Taxi", "Légal"],
    ["T011", "Garage", "Légal"],
    ["T012", "Concessionnaire", "Légal"],
    ["T013", "Auto-école", "Légal"],
    ["T014", "Agence immobilière", "Légal"],
    ["T015", "Banque", "Légal"],
    ["T016", "Transport", "Légal"],
    ["T017", "Livraison", "Légal"],
    ["T018", "Restauration", "Légal"],
    ["T019", "Bar / Boîte", "Légal"],
    ["T020", "Sécurité privée", "Légal"],
    ["T021", "Construction", "Légal"],
    ["T022", "Agriculture", "Légal"],
    ["T023", "Mine", "Légal"],
    ["T024", "Pêche", "Légal"],
    ["T025", "Recyclage", "Légal"],

    // CRIMINEL
    ["T030", "Mafia italienne", "Criminel"],
    ["T031", "Mafia russe", "Criminel"],
    ["T032", "Mafia albanaise", "Criminel"],
    ["T033", "Cartel mexicain", "Criminel"],
    ["T034", "Cartel colombien", "Criminel"],
    ["T035", "Yakuza", "Criminel"],
    ["T036", "Triades", "Criminel"],
    ["T037", "Bratva", "Criminel"],

    // GANGS
    ["T040", "Ballas", "Gang"],
    ["T041", "Families", "Gang"],
    ["T042", "Vagos", "Gang"],
    ["T043", "Marabunta", "Gang"],
    ["T044", "Bloods", "Gang"],
    ["T045", "Crips", "Gang"],
    ["T046", "Gang biker", "Gang"],

    // CLANDESTIN
    ["T050", "Hackers", "Clandestin"],
    ["T051", "Mercenaires", "Clandestin"],
    ["T052", "Groupes occultes", "Clandestin"],
    ["T053", "Groupes anarchistes", "Clandestin"],
    ["T054", "Groupes survivalistes", "Clandestin"]
  ];

  sheet.getRange(2, 1, types.length, 3).setValues(types);
  Logger.log("📌 TYPES remplis automatiquement (" + types.length + " entrées)");
}