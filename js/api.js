// ============================================================
//  API.JS — VERSION POCKETBASE
//  Point central de communication avec ton backend PocketBase
// ============================================================

// 1. Connexion à PocketBase
const pb = new PocketBase("https://TON-DOMAINE.fly.dev");

console.log("[PB] Initialisation PocketBase :", pb.baseUrl);

// ============================================================
//  2. Fonctions génériques
// ============================================================

// Lire toute une collection
async function pbList(collection, expand = "") {
  return await pb.collection(collection).getFullList({ expand });
}

// Lire un élément
async function pbGet(collection, id, expand = "") {
  return await pb.collection(collection).getOne(id, { expand });
}

// Créer un élément
async function pbCreate(collection, data) {
  return await pb.collection(collection).create(data);
}

// Mettre à jour un élément
async function pbUpdate(collection, id, data) {
  return await pb.collection(collection).update(id, data);
}

// Supprimer un élément
async function pbDelete(collection, id) {
  return await pb.collection(collection).delete(id);
}

// ============================================================
//  3. WRAPPERS PAR MODULE (comme ton ancien système)
// ============================================================

// --- ENTREPRISE ---
function apiEntreprise(action, payload = {}) {
  console.log("[PB-ENTREPRISE] Action :", action);

  switch (action) {
    case "list":
      return pbList("Entreprise");
    case "create":
      return pbCreate("Entreprise", payload);
    case "update":
      return pbUpdate("Entreprise", payload.id, payload.data);
    case "delete":
      return pbDelete("Entreprise", payload.id);
  }
}

// --- EMPLOYES ---
function apiEmployes(action, payload = {}) {
  console.log("[PB-EMPLOYES] Action :", action);

  switch (action) {
    case "list":
      return pbList("Employes", "Entreprise");
    case "create":
      return pbCreate("Employes", payload);
    case "update":
      return pbUpdate("Employes", payload.id, payload.data);
    case "delete":
      return pbDelete("Employes", payload.id);
  }
}

// ============================================================
//  FIN DU FICHIER
// ============================================================

console.log("[PB] API PocketBase chargée avec succès.");
