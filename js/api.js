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

    /**
     * Log interne formaté.
     * Essaie d’utiliser un logger global si présent, sinon console.
     */
    function logInfo(scope, message, extra) {
        const prefix = `%c[API][${scope}]`;
        const style = "color:#4CAF50;font-weight:bold;";

        if (window.LOGGER && typeof window.LOGGER.info === "function") {
            window.LOGGER.info(`[API][${scope}] ${message}`, extra || null);
        } else {
            console.log(prefix, style, message, extra || "");
        }
    }

    function logError(scope, message, error) {
        const prefix = `%c[API][${scope}]`;
        const style = "color:#F44336;font-weight:bold;";

        if (window.LOGGER && typeof window.LOGGER.error === "function") {
            window.LOGGER.error(`[API][${scope}] ${message}`, error || null);
        } else {
            console.error(prefix, style, message, error || "");
        }
    }

    // Vérification de la présence de Supabase
    if (typeof supabase === "undefined") {
        logError("INIT", "Supabase n’est pas défini. Vérifie index.html.");
        return;
    }

    logInfo("INIT", "API.JS initialisé, Supabase disponible.");

    // ============================================================
    //  FONCTION GÉNÉRIQUE : SELECT
    // ============================================================

    /**
     * Sélection générique dans une table Supabase.
     *
     * @param {string} table - Nom de la table
     * @param {object} [options] - Options de requête
     * @param {string} [options.columns="*"] - Colonnes à sélectionner
     * @param {Array<{col:string, op:string, value:any}>} [options.filters] - Filtres
     * @param {string} [options.orderBy] - Colonne de tri
     * @param {"asc"|"desc"} [options.orderDir="asc"] - Sens du tri
     * @returns {Promise<Array>} - Données ou []
     */
    async function apiSelect(table, options = {}) {
        const scope = `SELECT:${table}`;

        try {
            let query = supabase.from(table).select(options.columns || "*");

            if (Array.isArray(options.filters)) {
                options.filters.forEach(f => {
                    if (!f || !f.col || typeof f.value === "undefined") return;
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

    /**
     * Insertion générique dans une table.
     *
     * @param {string} table - Nom de la table
     * @param {object|object[]} payload - Objet ou tableau d’objets à insérer
     * @returns {Promise<Array|null>} - Lignes insérées ou null
     */
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

    /**
     * Update générique sur une table.
     *
     * @param {string} table - Nom de la table
     * @param {object} payload - Champs à mettre à jour
     * @param {Array<{col:string, op:string, value:any}>} filters - Filtres
     * @returns {Promise<Array|null>} - Lignes mises à jour ou null
     */
    async function apiUpdate(table, payload, filters) {
        const scope = `UPDATE:${table}`;

        try {
            let query = supabase.from(table).update(payload);

            if (Array.isArray(filters)) {
                filters.forEach(f => {
                    if (!f || !f.col || typeof f.value === "undefined") return;
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

    /**
     * Suppression générique dans une table.
     *
     * @param {string} table - Nom de la table
     * @param {Array<{col:string, op:string, value:any}>} filters - Filtres
     * @returns {Promise<boolean>} - true si OK, false sinon
     */
    async function apiDelete(table, filters) {
        const scope = `DELETE:${table}`;

        try {
            let query = supabase.from(table).delete();

            if (Array.isArray(filters)) {
                filters.forEach(f => {
                    if (!f || !f.col || typeof f.value === "undefined") return;
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
    //  WRAPPERS SPÉCIFIQUES MÉTIER
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
        return apiSelect("employes", {
            columns: "*",
            orderBy: "Nom",
            orderDir: "asc"
        });
    }

    // ---------- CLIENTS / ANNUAIRE ----------

    async function getClients() {
        return apiSelect("annuaire", {
            columns: "*",
            orderBy: "Nom",
            orderDir: "asc"
        });
    }

    // ---------- TYPES D’OPÉRATIONS ----------

    async function getTypesOperations() {
        return apiSelect("type_operations", {
            columns: "*",
            orderBy: "Nom",
            orderDir: "asc"
        });
    }

    // ---------- MOYENS DE PAIEMENT ----------

    async function getMoyensPaiement() {
        return apiSelect("moyens_paiement", {
            columns: "*",
            orderBy: "Nom",
            orderDir: "asc"
        });
    }

    // ---------- OPÉRATIONS DE CAISSE ----------

    /**
     * Enregistre une opération de caisse complète.
     * @param {object} operation - Données de l’opération
     */
    async function enregistrerOperationCaisse(operation) {
        return apiInsert("operations_caisse", operation);
    }

    // ============================================================
    //  EXPORT GLOBAL
    // ============================================================

    window.API = {
        // génériques
        select: apiSelect,
        insert: apiInsert,
        update: apiUpdate,
        delete: apiDelete,

        // métier
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
