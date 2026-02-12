/**
 * ============================================================
 *  CAISSE.JS — MODULE DE GESTION DE LA CAISSE
 *  Auteur      : Stephen
 *  Description : Gestion complète de la caisse :
 *                - Chargement des données Supabase
 *                - Gestion des lignes d’articles
 *                - Calculs automatiques
 *                - Validation et enregistrement
 *
 *  Architecture :
 *    - Fonctionne dans un <iframe> (interfaces/caisse.html)
 *    - Utilise window.API (api.js)
 *    - Aucun accès direct à Supabase ici
 *
 *  Objectifs :
 *    - Code clair, modulaire, robuste
 *    - Logs cohérents et filtrables
 * ============================================================
 */

(function () {
    "use strict";

    // ============================================================
    //  OUTILS DE LOG
    // ============================================================

    function log(scope, msg, extra) {
        console.log(`%c[CAISSE][${scope}]`, "color:#9C27B0;font-weight:bold;", msg, extra || "");
    }

    function logError(scope, msg, err) {
        console.error(`%c[CAISSE][${scope}]`, "color:#E53935;font-weight:bold;", msg, err || "");
    }

    // ============================================================
    //  INITIALISATION AUTOMATIQUE LORSQUE L’IFRAME CHARGE LA PAGE
    // ============================================================

    window.addEventListener("load", () => {
        const frame = document.getElementById("page-frame");
        if (!frame) return;

        frame.addEventListener("load", () => {
            const url = frame.contentWindow.location.href;
            if (url.includes("caisse.html")) {
                initCaisse(frame.contentDocument);
            }
        });
    });

    // ============================================================
    //  INITIALISATION DE LA PAGE CAISSE
    // ============================================================

    async function initCaisse(doc) {
        log("INIT", "Initialisation de la page caisse…");

        try {
            await chargerListes(doc);
            initialiserBoutons(doc);
            ajouterLigne(doc); // première ligne par défaut

            log("INIT", "Page caisse prête.");
        } catch (err) {
            logError("INIT", "Erreur lors de l'initialisation", err);
        }
    }

    // ============================================================
    //  CHARGEMENT DES DONNÉES SUPABASE
    // ============================================================

    async function chargerListes(doc) {
        log("DATA", "Chargement des listes…");

        const [articles, employes, clients, types, paiements] = await Promise.all([
            API.getArticles(),
            API.getEmployes(),
            API.getClients(),
            API.getTypesOperations(),
            API.getMoyensPaiement()
        ]);

        remplirSelect(doc.getElementById("typeOperation"), types, "Nom");
        remplirSelect(doc.getElementById("employe"), employes, "Nom");
        remplirSelect(doc.getElementById("client"), clients, "Nom");
        remplirSelect(doc.getElementById("paiement"), paiements, "Nom");

        // datalist des articles
        const datalist = doc.getElementById("articlesList");
        datalist.innerHTML = "";
        articles.forEach(a => {
            const opt = doc.createElement("option");
            opt.value = a.Nom;
            datalist.appendChild(opt);
        });

        log("DATA", "Listes chargées.");
    }

    function remplirSelect(select, data, label) {
        select.innerHTML = "";
        data.forEach(item => {
            const opt = document.createElement("option");
            opt.value = item.id;
            opt.textContent = item[label];
            select.appendChild(opt);
        });
    }

    // ============================================================
    //  GESTION DES LIGNES D’ARTICLES
    // ============================================================

    function initialiserBoutons(doc) {
        doc.getElementById("ajouterLigne").onclick = () => ajouterLigne(doc);
        doc.getElementById("validerCaisse").onclick = () => validerCaisse(doc);
    }

    function ajouterLigne(doc) {
        const template = doc.querySelector(".template-ligne");
        const clone = template.cloneNode(true);
        clone.style.display = "flex";

        // boutons
        clone.querySelector(".dupliquerLigne").onclick = () => dupliquerLigne(doc, clone);
        clone.querySelector(".supprimerLigne").onclick = () => supprimerLigne(doc, clone);

        // recalcul automatique
        clone.querySelectorAll("input, select").forEach(el => {
            el.oninput = () => recalculer(doc);
        });

        doc.getElementById("lignesReelles").appendChild(clone);
        recalculer(doc);
    }

    function dupliquerLigne(doc, ligne) {
        const clone = ligne.cloneNode(true);

        clone.querySelector(".dupliquerLigne").onclick = () => dupliquerLigne(doc, clone);
        clone.querySelector(".supprimerLigne").onclick = () => supprimerLigne(doc, clone);

        clone.querySelectorAll("input, select").forEach(el => {
            el.oninput = () => recalculer(doc);
        });

        doc.getElementById("lignesReelles").appendChild(clone);
        recalculer(doc);
    }

    function supprimerLigne(doc, ligne) {
        ligne.remove();
        recalculer(doc);
    }

    // ============================================================
    //  CALCULS AUTOMATIQUES
    // ============================================================

    function recalculer(doc) {
        let total = 0;

        const lignes = doc.querySelectorAll("#lignesReelles .template-ligne");
        lignes.forEach(ligne => {
            const pu = parseFloat(ligne.querySelector(".prixUnitaire").value) || 0;
            const qte = parseInt(ligne.querySelector(".quantite").value) || 1;
            const remise = parseFloat(ligne.querySelector(".remiseMontant").value) || 0;
            const typeRemise = ligne.querySelector(".remiseType").value;

            let totalLigne = pu * qte;

            if (typeRemise === "%") {
                totalLigne -= totalLigne * (remise / 100);
            } else {
                totalLigne -= remise;
            }

            totalLigne = Math.max(0, totalLigne);
            ligne.querySelector(".totalLigne").value = totalLigne.toFixed(2);

            total += totalLigne;
        });

        // livraison
        const livMontant = parseFloat(doc.getElementById("livraisonMontant").value) || 0;
        const livType = doc.getElementById("livraisonType").value;

        if (livType === "%") {
            total += total * (livMontant / 100);
        } else {
            total += livMontant;
        }

        doc.getElementById("totalArticle").textContent = total.toFixed(2);
    }

    // ============================================================
    //  VALIDATION DE LA CAISSE
    // ============================================================

    async function validerCaisse(doc) {
        log("VALIDATION", "Validation de la caisse…");

        const operation = {
            typeOperation: doc.getElementById("typeOperation").value,
            employe: doc.getElementById("employe").value,
            client: doc.getElementById("client").value,
            paiement: doc.getElementById("paiement").value,
            total: parseFloat(doc.getElementById("totalArticle").textContent),
            date: new Date().toISOString()
        };

        const lignes = extraireLignes(doc);

        const payload = {
            operation,
            lignes
        };

        log("VALIDATION", "Payload généré :", payload);

        const result = await API.enregistrerOperationCaisse(payload);

        if (!result) {
            logError("VALIDATION", "Échec de l’enregistrement.");
            return;
        }

        log("VALIDATION", "Opération enregistrée avec succès.");

        // Mise à jour des stocks
        await mettreAJourStocks(lignes);

        log("VALIDATION", "Stocks mis à jour.");
    }

    function extraireLignes(doc) {
        const lignes = [];

        doc.querySelectorAll("#lignesReelles .template-ligne").forEach(ligne => {
            lignes.push({
                article: ligne.querySelector(".articleInput").value,
                prixUnitaire: parseFloat(ligne.querySelector(".prixUnitaire").value) || 0,
                quantite: parseInt(ligne.querySelector(".quantite").value) || 1,
                total: parseFloat(ligne.querySelector(".totalLigne").value) || 0
            });
        });

        return lignes;
    }

    async function mettreAJourStocks(lignes) {
        for (const l of lignes) {
            const articles = await API.select("articles", {
                filters: [{ col: "Nom", value: l.article }]
            });

            if (articles.length === 0) continue;

            const article = articles[0];
            const nouveauStock = Math.max(0, article.Stock - l.quantite);

            await API.updateArticleStock(article.id, nouveauStock);
        }
    }

})();
