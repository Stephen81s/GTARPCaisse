/** ==========================================
 * File: banque_backend.gs
 * Module: BANQUE ENTREPRISES
 * Build: PRO 2026
 * Description: Backend Google Sheets du module Banque
========================================== */

function getComptesUtilisateur(userId) {
  const ss = SpreadsheetApp.getActive();
  const entreprises = ss.getSheetByName("ENTREPRISES").getDataRange().getValues();
  const employes = ss.getSheetByName("EMPLOYES").getDataRange().getValues();

  const userEmployes = employes.filter(r => r[1] == userId);

  const comptes = userEmployes.map(e => {
    const entreprise = entreprises.find(ent => ent[0] == e[0]);
    return {
      entreprise_id: entreprise[0],
      nom: entreprise[1],
      solde: entreprise[2],
      permissions: JSON.parse(e[2])
    };
  });

  return {
    user: userId,
    comptes: comptes
  };
}

function depotEntreprise(entrepriseId, montant, userId, description) {
  montant = Number(montant);
  if (isNaN(montant) || montant <= 0) throw new Error("Montant invalide");

  const ss = SpreadsheetApp.getActive();
  const entreprises = ss.getSheetByName("ENTREPRISES");
  const transactions = ss.getSheetByName("ENTREPRISE_TRANSACTIONS");

  const data = entreprises.getDataRange().getValues();
  const row = data.findIndex(r => r[0] == entrepriseId);

  if (row === -1) throw new Error("Entreprise introuvable");

  const solde = Number(data[row][2]) + montant;
  entreprises.getRange(row + 1, 3).setValue(solde);

  transactions.appendRow([
    new Date(),
    entrepriseId,
    userId,
    montant,
    "DEPOT",
    description
  ]);

  return true;
}

function retraitEntreprise(entrepriseId, montant, userId, description) {
  montant = Number(montant);
  if (isNaN(montant) || montant <= 0) throw new Error("Montant invalide");

  const ss = SpreadsheetApp.getActive();
  const entreprises = ss.getSheetByName("ENTREPRISES");
  const transactions = ss.getSheetByName("ENTREPRISE_TRANSACTIONS");

  const data = entreprises.getDataRange().getValues();
  const row = data.findIndex(r => r[0] == entrepriseId);

  if (row === -1) throw new Error("Entreprise introuvable");

  const soldeActuel = Number(data[row][2]);
  if (soldeActuel < montant) throw new Error("Solde insuffisant");

  const solde = soldeActuel - montant;
  entreprises.getRange(row + 1, 3).setValue(solde);

  transactions.appendRow([
    new Date(),
    entrepriseId,
    userId,
    -montant,
    "RETRAIT",
    description
  ]);

  return true;
}