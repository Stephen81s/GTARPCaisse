/***************************************************************
 * FICHIER : articles.gs
 * ARCHITECTURE : PRO 2026
 * AUTEUR : Stephen
 *
 * DESCRIPTION :
 *   - Gestion complète des articles RP
 *   - CRUD : Create, Read, Update, Delete
 *   - Gestion des catégories via ARTICLES_OPTIONS
 *   - Utilise la BDD Google Sheets (feuille ARTICLES)
 *
 * NOTES :
 *   - Ce fichier est automatiquement poussé dans Apps Script via CLASP
 *   - Toute modification locale doit être suivie d’un "clasp push"
 *   - Les logs sont centralisés dans LOGS (Google Sheets)
 ***************************************************************/


/***************************************************************
 * CONSTANTES LOCALES
 ***************************************************************/
const SHEET_ARTICLES = "ARTICLES";
const SHEET_ARTICLES_OPTIONS = "ARTICLES_OPTIONS";


/***************************************************************
 * LECTURE DES ARTICLES
 ***************************************************************/
function getArticles() {
  logSystem("Lecture des articles");

  const data = readSheet(SHEET_ARTICLES);
  return data.filter(a => a.actif === "yes");
}


/***************************************************************
 * LECTURE DES CATÉGORIES D’ARTICLES
 ***************************************************************/
function getArticleCategories() {
  logSystem("Lecture des catégories d’articles");

  const data = readSheet(SHEET_ARTICLES_OPTIONS);

  // On ne retourne que les catégories
  return data
    .filter(opt => opt.option === "categorie")
    .map(opt => ({
      value: opt.valeur,
      description: opt.description
    }));
}


/***************************************************************
 * CRÉATION D’UN ARTICLE
 ***************************************************************/
function createArticle(nom, categorie, prix, tva) {
  logSystem(`Création article : ${nom}`);

  const id = generateArticleId();
  const now = new Date().toISOString();

  const row = [
    id,            // id
    nom,           // nom
    categorie,     // categorie
    prix,          // prix
    tva,           // tva
    now,           // created_at
    "system",      // created_by
    now,           // updated_at
    "system",      // updated_by
    "yes",         // actif
    "active"       // status
  ];

  writeRow(SHEET_ARTICLES, row);

  return id;
}


/***************************************************************
 * GÉNÉRATION D’ID ARTICLE
 ***************************************************************/
function generateArticleId() {
  const key = "NEXT_ARTICLE_ID";
  let next = parseInt(getConst(key), 10);

  const id = "ART" + String(next).padStart(3, "0");

  setConst(key, next + 1);

  return id;
}


/***************************************************************
 * MISE À JOUR D’UN ARTICLE
 ***************************************************************/
function updateArticle(id, data) {
  logSystem(`Mise à jour article : ${id}`);

  const sheet = getSheet(SHEET_ARTICLES);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];

  const idIndex = headers.indexOf("id");

  for (let i = 1; i < values.length; i++) {
    if (values[i][idIndex] === id) {

      // Mise à jour des colonnes
      Object.keys(data).forEach(key => {
        const colIndex = headers.indexOf(key);
        if (colIndex !== -1) {
          values[i][colIndex] = data[key];
        }
      });

      // updated_at / updated_by
      values[i][headers.indexOf("updated_at")] = new Date().toISOString();
      values[i][headers.indexOf("updated_by")] = "system";

      // Écriture
      sheet.getRange(1, 1, values.length, headers.length).setValues(values);
      return true;
    }
  }

  return false;
}


/***************************************************************
 * SUPPRESSION LOGIQUE D’UN ARTICLE
 ***************************************************************/
function deleteArticle(id) {
  logSystem(`Suppression article : ${id}`);

  return updateArticle(id, {
    actif: "no",
    status: "inactive"
  });
}