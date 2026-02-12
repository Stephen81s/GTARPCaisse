<!-- ============================================================
     PAGE : CAISSE — SUPABASE EDITION
     MODULE : Gestion des opérations de caisse
     AUTEUR : Stephen
     DESCRIPTION :
       - Interface de saisie des opérations de caisse
       - Aucun script ici (géré par router.js + api.js)
       - Contenu statique uniquement
============================================================ -->

<div id="interface_caisse" class="interface page-wrapper">

    <!-- ============================
         🏷️ TITRE PRINCIPAL
    ============================= -->
    <h1 class="page-title">📦 Gestion de la Caisse</h1>


    <!-- ============================================================
         SECTION : INFORMATIONS GÉNÉRALES
         - Type d’opération
         - Employé
         - Client
         - Paiement
    ============================================================ -->
    <section class="section-bloc">

        <h2 class="section-title">Informations générales</h2>

        <div class="ligne-full">
            <label for="typeOperation">Type d’opération :</label>
            <select id="typeOperation"></select>
        </div>

        <div class="ligne-triple">

            <div>
                <label for="employe">Employé :</label>
                <select id="employe"></select>
            </div>

            <div>
                <label for="client">Client :</label>
                <select id="client"></select>
            </div>

            <div>
                <label for="paiement">Paiement :</label>
                <select id="paiement"></select>
            </div>

        </div>

    </section>


    <!-- ============================================================
         SECTION : ARTICLES
         - Ajout de lignes
         - Calculs automatiques (via JS)
    ============================================================ -->
    <section class="section-bloc">

        <h2 class="section-title">🧾 Articles</h2>

        <!-- Liste dynamique des articles -->
        <datalist id="articlesList"></datalist>

        <!-- Template invisible pour duplication -->
        <div class="template-ligne" style="display:none; gap:10px;">

            <!-- Article -->
            <input class="articleInput" list="articlesList" placeholder="Article">

            <!-- Prix unitaire -->
            <input class="prixUnitaire" type="number" placeholder="PU" readonly>

            <!-- Quantité -->
            <input class="quantite" type="number" min="1" value="1">

            <!-- Remise -->
            <div style="display:flex; gap:5px;">
                <input class="remiseMontant" type="number" placeholder="Remise">
                <select class="remiseType">
                    <option value="€">€</option>
                    <option value="%">%</option>
                </select>
            </div>

            <!-- Total ligne -->
            <input class="totalLigne" type="number" placeholder="Total" readonly>

            <!-- Actions -->
            <button class="dupliquerLigne">⧉</button>
            <button class="supprimerLigne">✖</button>

        </div>

        <!-- Conteneur des lignes réelles -->
        <div id="lignesReelles"></div>

        <!-- Boutons d’action -->
        <div class="ligne-boutons">
            <button id="ajouterLigne">➕ Ajouter une ligne</button>
        </div>

    </section>


    <!-- ============================================================
         SECTION : LIVRAISON
    ============================================================ -->
    <section class="section-bloc">

        <h2 class="section-title">🚚 Livraison</h2>

        <div class="ligne-double">
            <input id="livraisonMontant" type="number" placeholder="Montant">
            <select id="livraisonType">
                <option value="€">€</option>
                <option value="%">%</option>
            </select>
        </div>

    </section>


    <!-- ============================================================
         SECTION : TOTAL
    ============================================================ -->
    <section class="section-bloc">

        <h2 class="section-title">🧮 Total</h2>

        <div id="totalGlobalBox">
            Total final : <span id="totalArticle">0.00</span> €
        </div>

        <div class="ligne-boutons">
            <button id="validerCaisse">✔ Valider la caisse</button>
        </div>

    </section>

</div>
