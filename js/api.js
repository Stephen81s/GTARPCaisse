// ============================================================
//  API.JS — VERSION POCKETBASE (OPTIMISÉE)
//  Point central de communication avec PocketBase
// ============================================================

// ============================================================
//  1. Connexion à PocketBase
// ============================================================

const pb = new PocketBase("https://pocketbase-server-t8sv.onrender.com");
console.log("[PB] Initialisation PocketBase :", pb.baseUrl);

// ============================================================
//  2. Fonctions génériques sécurisées
// ============================================================

async function pbList(collection, options = {}) {
  console.log("[PB] LIST :", collection, options);
  try {
    return await pb.collection(collection).getFullList(options);
  } catch (err) {
    console.error(`[PB] ❌ LIST ERROR (${collection}) :`, err);
    throw err;
  }
}

async function pbGet(collection, id, options = {}) {
  console.log("[PB] GET :", collection, id, options);
  try {
    return await pb.collection(collection).getOne(id, options);
  } catch (err) {
    console.error(`[PB] ❌ GET ERROR (${collection}/${id}) :`, err);
    throw err;
  }
}

async function pbCreate(collection, data) {
  console.log("[PB] CREATE :", collection, data);
  try {
    return await pb.collection(collection).create(data);
  } catch (err) {
    console.error(`[PB] ❌ CREATE ERROR (${collection}) :`, err);
    throw err;
  }
}

async function pbUpdate(collection, id, data) {
  console.log("[PB] UPDATE :", collection, id, data);
  try {
    return await pb.collection(collection).update(id, data);
  } catch (err) {
    console.error(`[PB] ❌ UPDATE ERROR (${collection}/${id}) :`, err);
    throw err;
  }
}

async function pbDelete(collection, id) {
  console.log("[PB] DELETE :", collection, id);
  try {
    return await pb.collection(collection).delete(id);
  } catch (err) {
    console.error(`[PB] ❌ DELETE ERROR (${collection}/${id}) :`, err);
    throw err;
  }
}

// ============================================================
//  3. WRAPPERS PAR MODULE
// ============================================================

// --- ENTREPRISE ---
function apiEntreprise(action, payload = {}) {
  switch (action) {
    case "list":   return pbList("Entreprise");
    case "get":    return pbGet("Entreprise", payload.id);
    case "create": return pbCreate("Entreprise", payload);
    case "update": return pbUpdate("Entreprise", payload.id, payload.data);
    case "delete": return pbDelete("Entreprise", payload.id);
  }
}

// --- EMPLOYES ---
function apiEmployes(action, payload = {}) {
  switch (action) {
    case "list":
      return pbList("Employes", { expand: "Entreprise" });
    case "get":
      return pbGet("Employes", payload.id, { expand: "Entreprise" });
    case "create":
      return pbCreate("Employes", payload);
    case "update":
      return pbUpdate("Employes", payload.id, payload.data);
    case "delete":
      return pbDelete("Employes", payload.id);
  }
}

// --- ARTICLES ---
function apiArticles(action, payload = {}) {
  switch (action) {
    case "list":   return pbList("Articles");
    case "get":    return pbGet("Articles", payload.id);
    case "create": return pbCreate("Articles", payload);
    case "update": return pbUpdate("Articles", payload.id, payload.data);
    case "delete": return pbDelete("Articles", payload.id);
  }
}

// --- COMPTA ---
function apiCompta(action, payload = {}) {
  switch (action) {
    case "list":   return pbList("Compta");
    case "get":    return pbGet("Compta", payload.id);
    case "create": return pbCreate("Compta", payload);
    case "update": return pbUpdate("Compta", payload.id, payload.data);
    case "delete": return pbDelete("Compta", payload.id);
  }
}

// --- RESUME ---
function apiResume(action, payload = {}) {
  const expandFields = "Employes,Client,Mode_de_paiment,type_de_mouvement,type_operation";

  switch (action) {
    case "list":
      return pbList("Resume", { expand: expandFields });
    case "get":
      return pbGet("Resume", payload.id, { expand: expandFields });
    case "create":
      return pbCreate("Resume", payload);
    case "update":
      return pbUpdate("Resume", payload.id, payload.data);
    case "delete":
      return pbDelete("Resume", payload.id);
  }
}

// ============================================================
//  4. Point d’entrée générique (compatibilité ancienne API)
// ============================================================

function api(module, action, payload = {}) {
  console.log("[API] Module:", module, "Action:", action, "Payload:", payload);

  switch (module) {
    case "Entreprise": return apiEntreprise(action, payload);
    case "Employes":   return apiEmployes(action, payload);
    case "Articles":   return apiArticles(action, payload);
    case "Compta":     return apiCompta(action, payload);
    case "Resume":     return apiResume(action, payload);
    default:
      console.error("[API] ❌ Module inconnu :", module);
      return Promise.reject("Module inconnu : " + module);
  }
}

console.log("[PB] api.js PocketBase chargé.");
