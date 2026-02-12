// ============================================================
//  API.JS — SUPABASE EDITION (CORE)
//  Auteur : Stephen
//  Version : 1.0
//  Description :
//    - Point central de communication avec Supabase
//    - Fonctions génériques CRUD
//    - Wrappers par module (caisse, ticket, ressource, service…)
//    - Compatible avec api(module, action, payload)
// ============================================================


// ============================================================
//  1. Fonctions génériques SUPABASE
// ============================================================

// LIST / SELECT
async function sbList(table, options = {}) {
    log("api", `LIST → ${table}`, options);

    const { data, error } = await supabase
        .from(table)
        .select(options.select || "*")
        .order(options.orderBy || "id", { ascending: true });

    if (error) {
        logError("api", `Erreur LIST ${table}`, error);
        throw error;
    }

    return data;
}

// GET ONE
async function sbGet(table, id, options = {}) {
    log("api", `GET → ${table}/${id}`);

    const { data, error } = await supabase
        .from(table)
        .select(options.select || "*")
        .eq("id", id)
        .single();

    if (error) {
        logError("api", `Erreur GET ${table}/${id}`, error);
        throw error;
    }

    return data;
}

// CREATE
async function sbCreate(table, payload) {
    log("api", `CREATE → ${table}`, payload);

    const { data, error } = await supabase
        .from(table)
        .insert(payload)
        .select()
        .single();

    if (error) {
        logError("api", `Erreur CREATE ${table}`, error);
        throw error;
    }

    return data;
}

// UPDATE
async function sbUpdate(table, id, payload) {
    log("api", `UPDATE → ${table}/${id}`, payload);

    const { data, error } = await supabase
        .from(table)
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        logError("api", `Erreur UPDATE ${table}/${id}`, error);
        throw error;
    }

    return data;
}

// DELETE
async function sbDelete(table, id) {
    log("api", `DELETE → ${table}/${id}`);

    const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", id);

    if (error) {
        logError("api", `Erreur DELETE ${table}/${id}`, error);
        throw error;
    }

    return { status: "ok" };
}



// ============================================================
//  2. WRAPPERS PAR MODULE
// ============================================================

// --- CAISSE / COMPTA ---
function apiCaisse(action, payload = {}) {
    switch (action) {
        case "list":
            return sbList("compta");
        case "get":
            return sbGet("compta", payload.id);
        case "create":
            return sbCreate("compta", payload);
        case "update":
            return sbUpdate("compta", payload.id, payload.data);
        case "delete":
            return sbDelete("compta", payload.id);
    }
}

// --- TICKET ---
function apiTicket(action, payload = {}) {
    switch (action) {
        case "list":
            return sbList("tickets");
        case "get":
            return sbGet("tickets", payload.id);
        case "create":
            return sbCreate("tickets", payload);
        case "update":
            return sbUpdate("tickets", payload.id, payload.data);
        case "delete":
            return sbDelete("tickets", payload.id);
    }
}

// --- RESSOURCE ---
function apiRessource(action, payload = {}) {
    switch (action) {
        case "list":
            return sbList("ressources");
        case "get":
            return sbGet("ressources", payload.id);
        case "create":
            return sbCreate("ressources", payload);
        case "update":
            return sbUpdate("ressources", payload.id, payload.data);
        case "delete":
            return sbDelete("ressources", payload.id);
    }
}

// --- SERVICE ---
function apiService(action, payload = {}) {
    switch (action) {
        case "list":
            return sbList("services");
        case "get":
            return sbGet("services", payload.id);
        case "create":
            return sbCreate("services", payload);
        case "update":
            return sbUpdate("services", payload.id, payload.data);
        case "delete":
            return sbDelete("services", payload.id);
    }
}



// ============================================================
//  3. API GÉNÉRIQUE (compatibilité ancienne version)
// ============================================================

function api(module, action, payload = {}) {
    log("api", `Appel générique → ${module}.${action}`, payload);

    switch (module) {
        case "caisse":     return apiCaisse(action, payload);
        case "ticket":     return apiTicket(action, payload);
        case "ressource":  return apiRessource(action, payload);
        case "service":    return apiService(action, payload);

        default:
            logError("api", `Module inconnu : ${module}`);
            return Promise.reject("Module inconnu : " + module);
    }
}



// ============================================================
//  4. Confirmation de chargement
// ============================================================

logSuccess("API.JS (SUPABASE) chargé et opérationnel");
