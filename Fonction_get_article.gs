/****************************************************
 * Fonction_get_article.gs — VERSION CORRIGÉE
 * --------------------------------------------------
 * Correction : normalisation du champ TypeCaisse
 * pour correspondre au front (legal / illegal)
 ****************************************************/

/****************************************************
 * 🔧 Normalisation du type caisse
 ****************************************************/
function normalizeTypeCaisse(value) {
  if (!value) return "";

  const v = String(value).trim().toLowerCase();

  // On ne garde que les deux valeurs valides
  if (v === "legal") return "legal";
  if (v === "illegal") return "illegal";

  return ""; // valeur inconnue
}

/****************************************************
 * 📦 getArticles()
 * Renvoie TOUTES les données articles pour le front
 ****************************************************/
function getArticles() {
  console.log("===== 📦 [BACKEND] getArticles() =====");

  try {
    const ss = SpreadsheetApp.getActive();
    const sheet = ss.getSheetByName(SHEET_ARTICLES);

    if (!sheet) {
      console.error("💥 [ARTICLES] Feuille Articles introuvable");
      return [];
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      console.warn("📭 [ARTICLES] Aucun article dans la feuille");
      return [];
    }

    // Lecture A → G
    const data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();

    const articles = data
      .filter(r => r[0]) // ignorer lignes vides
      .map(r => ({
        nom: r[0],
        prixAchat: Number(r[1]) || 0,
        prixVente: Number(r[2]) || 0,
        stock: Number(r[3]) || 0,
        categorie: r[4] || "",
        typeCaisse: normalizeTypeCaisse(r[5]), // ✔ CORRIGÉ
        types: r[6] || ""
      }));

    console.log("🟩 [ARTICLES] Nombre d’articles envoyés :", articles.length);
    return articles;

  } catch (err) {
    console.error("💥 [ARTICLES] ERREUR getArticles()", err);
    return [];
  }
}

/****************************************************
 * 📦 getArticleInfo(nomArticle)
 * Renvoie les infos d’un article précis
 ****************************************************/
function getArticleInfo(nomArticle) {
  console.log("===== 🔎 [ARTICLE] getArticleInfo() =====");
  console.log("🔍 Article demandé :", nomArticle);

  try {
    const ss = SpreadsheetApp.getActive();
    const sheet = ss.getSheetByName(SHEET_ARTICLES);

    if (!sheet) {
      console.error("💥 [ARTICLE] Feuille Articles introuvable");
      return null;
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      console.warn("📭 [ARTICLE] Aucun article dans la feuille");
      return null;
    }

    const data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();

    for (let i = 0; i < data.length; i++) {
      const [
        nom,
        prixAchat,
        prixVente,
        stock,
        categorie,
        typeCaisse,
        types
      ] = data[i];

      if (String(nom).trim().toLowerCase() === String(nomArticle).trim().toLowerCase()) {

        const info = {
          nom,
          prixAchat: Number(prixAchat) || 0,
          prixVente: Number(prixVente) || 0,
          stock: Number(stock) || 0,
          categorie: categorie || "",
          typeCaisse: normalizeTypeCaisse(typeCaisse), // ✔ CORRIGÉ
          types: types || ""
        };

        console.log("🟩 [ARTICLE] Article trouvé :", info);
        return info;
      }
    }

    console.warn("⚠️ [ARTICLE] Article non trouvé :", nomArticle);
    return null;

  } catch (err) {
    console.error("💥 [ARTICLE] ERREUR getArticleInfo()", err);
    return null;
  }
}
