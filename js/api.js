// ============================================================
// API.JS — Accès Supabase (utilise la variable globale)
// ============================================================

log("API", "Initialisation de l'API…");

// Exemple de fonction API
async function apiGet(table) {
    log("API", `SELECT * FROM ${table}`);

    const { data, error } = await supabase.from(table).select("*");

    if (error) {
        logError("API", error.message);
        return null;
    }

    logSuccess("API", `Données récupérées (${table})`);
    return data;
}

logSuccess("API", "API.JS (SUPABASE) chargé et opérationnel");
