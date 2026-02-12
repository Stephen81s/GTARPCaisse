/**
 * ============================================================
 *  API.JS — COUCHE D’ACCÈS SUPABASE
 *  Auteur      : Stephen
 *  Description : Fonctions centralisées pour lire / écrire
 *                dans la base Supabase de l’interface GTARP.
 *
 *  Hypothèses  :
 *    - `supabase` est déjà initialisé dans index.html
 *    - logger.js est chargé (optionnel, fallback console)
 *
 *  Objectifs   :
 *    - AUCUNE redéclaration de `supabase` ici
 *    - Logs clairs, cohérents, filtrables
 *    - API unique, simple à utiliser partout
 * ============================================================
 */

(function () {
    "use strict";

    // ============================================================
    //  OUTILS DE LOG
    // ============================================================

    function logInfo(scope, message, extra) {
        const prefix = `%c[API][${scope}]`;
        const style = "color:#4CAF50;font-weight:bold;";

        if (window.LOGGER?.info) {
            window.LOGGER.info(`[API][${scope}] ${message}`, extra || null);
        } else {
            console.log(prefix, style, message, extra || "");
        }
    }

    function logError(scope, message, error) {
        const prefix = `%c[API][${scope}]`;
        const style = "color:#F44336;font-weight:bold;";

        if (window.LOGGER?.error) {
            window.LOGGER.error(`[API][${scope}] ${message}`, error || null);
        } else {
            console.error(prefix, style, message, error || "");
        }
    }

    // Vérification de Supabase
    if (typeof supabase === "undefined") {
        logError("INIT", "Supabase n’est pas défini. Vérifie index.html.");
        return;
    }

    logInfo("INIT", "API.JS initialisé, Supabase disponible.");

    // ============================================================
    //  FONCTION GÉNÉRIQUE : SELECT
    // ============================================================

    async function apiSelect(table, options = {}) {
        const scope = `SELECT:${table}`;

        try {
            let query = supabase.from(table).select(options.columns || "*");

            if (Array.isArray(options.filters)) {
                options.filters.forEach(f => {
                    if (!f?.col || f.value === undefined) return;
                    const op = f.op || "eq";
                    if (typeof query[op] === "function") {
                        query = query[op](f.col, f.value);
                    }
                });
            }

            if (options.orderBy) {
                query = query.order(options.orderBy, {
                    ascending: (options.orderDir || "asc") === "asc"
                });
            }

            const { data, error } = await query;

            if (error) {
                logError(scope, "Erreur Supabase", error);
                return [];
            }

            logInfo(scope, `OK (${data.length} ligne(s))`);
            return data || [];
        } catch (err) {
            logError(scope, "Exception JS", err);
            return [];
        }
    }

    // ============================================================
    //  FONCTION GÉNÉRIQUE : INSERT
    // ============================================================

    async function apiInsert(table, payload) {
        const scope = `INSERT:${table}`;

        try {
            const rows = Array.isArray(payload) ? payload : [payload];

            const { data, error } = await supabase
                .from(table)
                .insert(rows)
                .select();

            if (error) {
                logError(scope, "Erreur Supabase", error);
                return null;
            }

            logInfo(scope, `OK (${data.length} ligne(s) insérée(s))`, data);
            return data;
        } catch (err) {
            logError(scope, "Exception JS", err);
            return null;
        }
    }

    // ============================================================
    //  FONCTION GÉNÉRIQUE : UPDATE
    // ============================================================

    async function apiUpdate(table, payload, filters) {
        const scope = `UPDATE:${table}`;

        try {
            let query = supabase.from(table).update(payload);

            if (Array.isArray(filters)) {
                filters.forEach(f => {
                    if (!f?.col || f.value === undefined) return;
                    const op = f.op || "eq";
                    if (typeof query[op] === "function") {
                        query = query[op](f.col, f.value);
                    }
                });
            }

            const { data, error } = await query.select();

            if (error) {
                logError(scope, "Erreur Supabase", error);
                return null;
            }

            logInfo(scope, `OK (${data.length} ligne(s) mise(s) à jour)`, data);
            return data;
        } catch (err) {
            logError(scope, "Exception JS", err);
            return null;
        }
    }

    // ============================================================
    //  FONCTION GÉNÉRIQUE : DELETE
    // ============================================================

    async function apiDelete(table, filters) {
        const scope = `DELETE:${table}`;

        try {
            let query = supabase.from(table).delete();

            if (Array.isArray(filters)) {
                filters.forEach(f => {
                    if (!f?.col || f.value === undefined) return;
                    const op = f.op || "eq";
                    if (typeof query[op] === "function") {
                        query = query[op](f.col, f.value);
                    }
                });
            }

            const { error } = await query;

            if (error) {
                logError(scope, "Erreur Supabase", error);
                return false;
            }

            logInfo(scope, "OK (suppression effectuée)");
            return true;
        } catch (err) {
            logError(scope, "Exception JS", err);
            return false;
        }
    }

    // ============================================================
    //  WRAPPERS SPÉCIFIQUES MÉTIER (corrigés selon TES tables)
    // ============================================================

    // ---------- ARTICLES ----------
    async function getArticles() {
        return apiSelect("articles", {
            columns: "*",
            orderBy: "Nom",
            orderDir: "asc"
        });
    }

    async function updateArticleStock(articleId, nouveauStock) {
        return apiUpdate("articles", { Stock: nouveauStock }, [
            { col: "id", op: "eq", value: articleId }
        ]);
    }

    // ---------- EMPLOYÉS ----------
    async function getEmployes() {
        return apiSelect("employées", {
            columns: "*",
            orderBy: "nom",
            orderDir: "asc"
        });
    }

    // ---------- CLIENTS ----------
    async function getClients() {
        return apiSelect("annuaire", {
            columns: "*",
            orderBy: "nom",
            orderDir: "asc"
        });
    }

    // ---------- TYPES D’OPÉRATIONS ----------
    async function getTypesOperations() {
        return apiSelect("typeoperations", {
            columns: "*",
            orderBy: "nom",
            orderDir: "asc"
        });
    }

    // ---------- MOYENS DE PAIEMENT ----------
    async function getMoyensPaiement() {
        return apiSelect("moyenpaiements", {
            columns: "*",
            orderBy: "nom",
            orderDir: "asc"
        });
    }

    // ---------- OPÉRATIONS DE CAISSE ----------
    async function enregistrerOperationCaisse(operation) {
        return apiInsert("operations_caisse", operation);
    }

    // ============================================================
    //  EXPORT GLOBAL
    // ============================================================

    window.API = {
        select: apiSelect,
        insert: apiInsert,
        update: apiUpdate,
        delete: apiDelete,

        getArticles,
        updateArticleStock,
        getEmployes,
        getClients,
        getTypesOperations,
        getMoyensPaiement,
        enregistrerOperationCaisse
    };

    logInfo("INIT", "API exposée sur window.API");

})();
