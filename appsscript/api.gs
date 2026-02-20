/***************************************************************
 * FICHIER : api.gs
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Point d’entrée API pour le frontend
 *   - Toutes les fonctions appelables via google.script.run
 *   - Centralisation des retours JSON
 *
 * NOTES :
 *   - Ce fichier est automatiquement poussé dans Apps Script via CLASP
 *   - Toute modification locale doit être suivie d’un "clasp push"
 *   - Les logs API sont centralisés dans LOGS (Google Sheets)
 ***************************************************************/


/***************************************************************
 * HELPER : FORMATTER LES RÉPONSES
 ***************************************************************/
function apiResponse(success, data = null, error = null) {
  return {
    success: success,
    data: data,
    error: error
  };
}


/***************************************************************
 * API : ENTREPRISES
 ***************************************************************/
function api_getEntreprises() {
  logApi("API → getEntreprises");
  return apiResponse(true, getEntreprises());
}

function api_createEntreprise(nom, type) {
  logApi(`API → createEntreprise : ${nom}`);
  return apiResponse(true, createEntreprise(nom, type));
}

function api_updateEntreprise(id, data) {
  logApi(`API → updateEntreprise : ${id}`);
  return apiResponse(updateEntreprise(id, data));
}

function api_deleteEntreprise(id) {
  logApi(`API → deleteEntreprise : ${id}`);
  return apiResponse(deleteEntreprise(id));
}


/***************************************************************
 * API : JOUEURS
 ***************************************************************/
function api_getJoueurs() {
  logApi("API → getJoueurs");
  return apiResponse(true, getJoueurs());
}

function api_createJoueur(nom, prenom, dateNaissance) {
  logApi(`API → createJoueur : ${nom} ${prenom}`);
  return apiResponse(true, createJoueur(nom, prenom, dateNaissance));
}

function api_updateJoueur(id, data) {
  logApi(`API → updateJoueur : ${id}`);
  return apiResponse(updateJoueur(id, data));
}

function api_deleteJoueur(id) {
  logApi(`API → deleteJoueur : ${id}`);
  return apiResponse(deleteJoueur(id));
}


/***************************************************************
 * API : ARTICLES
 ***************************************************************/
function api_getArticles() {
  logApi("API → getArticles");
  return apiResponse(true, getArticles());
}

function api_getArticleCategories() {
  logApi("API → getArticleCategories");
  return apiResponse(true, getArticleCategories());
}

function api_createArticle(nom, categorie, prix, tva) {
  logApi(`API → createArticle : ${nom}`);
  return apiResponse(true, createArticle(nom, categorie, prix, tva));
}

function api_updateArticle(id, data) {
  logApi(`API → updateArticle : ${id}`);
  return apiResponse(updateArticle(id, data));
}

function api_deleteArticle(id) {
  logApi(`API → deleteArticle : ${id}`);
  return apiResponse(deleteArticle(id));
}


/***************************************************************
 * API : SERVICES
 ***************************************************************/
function api_getServices() {
  logApi("API → getServices");
  return apiResponse(true, getServices());
}

function api_getServiceActions() {
  logApi("API → getServiceActions");
  return apiResponse(true, getServiceActions());
}

function api_createService(entreprise_id, nom, prix) {
  logApi(`API → createService : ${nom}`);
  return apiResponse(true, createService(entreprise_id, nom, prix));
}

function api_updateService(id, data) {
  logApi(`API → updateService : ${id}`);
  return apiResponse(updateService(id, data));
}

function api_deleteService(id) {
  logApi(`API → deleteService : ${id}`);
  return apiResponse(deleteService(id));
}


/***************************************************************
 * API : AMENDES
 ***************************************************************/
function api_getAmendes() {
  logApi("API → getAmendes");
  return apiResponse(true, getAmendes());
}

function api_getAmendeMotifs() {
  logApi("API → getAmendeMotifs");
  return apiResponse(true, getAmendeMotifs());
}

function api_createAmende(joueur_id, motif, montant) {
  logApi(`API → createAmende : ${joueur_id}`);
  return apiResponse(true, createAmende(joueur_id, motif, montant));
}

function api_updateAmende(id, data) {
  logApi(`API → updateAmende : ${id}`);
  return apiResponse(updateAmende(id, data));
}

function api_deleteAmende(id) {
  logApi(`API → deleteAmende : ${id}`);
  return apiResponse(deleteAmende(id));
}


/***************************************************************
 * API : FAUX PAPIERS
 ***************************************************************/
function api_getFauxPapiers() {
  logApi("API → getFauxPapiers");
  return apiResponse(true, getFauxPapiers());
}

function api_getFauxPapiersTypes() {
  logApi("API → getFauxPapiersTypes");
  return apiResponse(true, getFauxPapiersTypes());
}

function api_createFauxPapier(joueur_id, type, prix) {
  logApi(`API → createFauxPapier : ${joueur_id}`);
  return apiResponse(true, createFauxPapier(joueur_id, type, prix));
}

function api_updateFauxPapier(id, data) {
  logApi(`API → updateFauxPapier : ${id}`);
  return apiResponse(updateFauxPapier(id, data));
}

function api_deleteFauxPapier(id) {
  logApi(`API → deleteFauxPapier : ${id}`);
  return apiResponse(deleteFauxPapier(id));
}


/***************************************************************
 * API : ITEMS
 ***************************************************************/
function api_getItems() {
  logApi("API → getItems");
  return apiResponse(true, getItems());
}

function api_getItemTypes() {
  logApi("API → getItemTypes");
  return apiResponse(true, getItemTypes());
}

function api_createItem(nom, type, rarete) {
  logApi(`API → createItem : ${nom}`);
  return apiResponse(true, createItem(nom, type, rarete));
}

function api_updateItem(id, data) {
  logApi(`API → updateItem : ${id}`);
  return apiResponse(updateItem(id, data));
}

function api_deleteItem(id) {
  logApi(`API → deleteItem : ${id}`);
  return apiResponse(deleteItem(id));
}


/***************************************************************
 * API : VEHICULES
 ***************************************************************/
function api_getVehicules() {
  logApi("API → getVehicules");
  return apiResponse(true, getVehicules());
}

function api_getVehiculeTypes() {
  logApi("API → getVehiculeTypes");
  return apiResponse(true, getVehiculeTypes());
}

function api_createVehicule(joueur_id, modele, type, plaque) {
  logApi(`API → createVehicule : ${modele}`);
  return apiResponse(true, createVehicule(joueur_id, modele, type, plaque));
}

function api_updateVehicule(id, data) {
  logApi(`API → updateVehicule : ${id}`);
  return apiResponse(updateVehicule(id, data));
}

function api_deleteVehicule(id) {
  logApi(`API → deleteVehicule : ${id}`);
  return apiResponse(deleteVehicule(id));
}


/***************************************************************
 * API : LICENCES
 ***************************************************************/
function api_getLicences() {
  logApi("API → getLicences");
  return apiResponse(true, getLicences());
}

function api_getLicenceTypes() {
  logApi("API → getLicenceTypes");
  return apiResponse(true, getLicenceTypes());
}

function api_createLicence(joueur_id, type, prix, duree) {
  logApi(`API → createLicence : ${joueur_id}`);
  return apiResponse(true, createLicence(joueur_id, type, prix, duree));
}

function api_updateLicence(id, data) {
  logApi(`API → updateLicence : ${id}`);
  return apiResponse(updateLicence(id, data));
}

function api_deleteLicence(id) {
  logApi(`API → deleteLicence : ${id}`);
  return apiResponse(deleteLicence(id));
}


/***************************************************************
 * API : COMMANDES
 ***************************************************************/
function api_getCommandes() {
  logApi("API → getCommandes");
  return apiResponse(true, getCommandes());
}

function api_getCommandeStatuts() {
  logApi("API → getCommandeStatuts");
  return apiResponse(true, getCommandeStatuts());
}

function api_createCommande(joueur_id, entreprise_id, montant, statut) {
  logApi(`API → createCommande : ${joueur_id} → ${entreprise_id}`);
  return apiResponse(true, createCommande(joueur_id, entreprise_id, montant, statut));
}

function api_updateCommande(id, data) {
  logApi(`API → updateCommande : ${id}`);
  return apiResponse(updateCommande(id, data));
}

function api_deleteCommande(id) {
  logApi(`API → deleteCommande : ${id}`);
  return apiResponse(deleteCommande(id));
}