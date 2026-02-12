// ============================================================
//  RESSOURCE.JS — MODULE RESSOURCE (SUPABASE)
//  Auteur : Stephen
//  Version : 1.0
//  Description :
//    - Gestion des ressources RP
//    - Création de ressources (nom, quantité, type)
//    - Enregistrement en base (table ressources)
// ============================================================


// ============================================================
//  🔧 INITIALISATION DE L’INTERFACE RESSOURCE
// ============================================================

function initRessource() {
    log("ressource", "Initialisation de l’interface…");

    const nom = document.getElementById("ressourceNom");
    const quantite = document.getElementById("ressourceQuantite");
    const type = document.getElementById("ressourceType");
    const btn = document.getElementById("ressourceValider");

    if (!nom || !quantite || !type || !btn) {
        logError("ressource", "Éléments HTML manquants");
        return;
    }

    // Reset interface
    nom.value = "";
    quantite.value = "";
    type.value = "legal";

    logSuccess("ressource", "Interface prête");
}


// ============================================================
//  📝 VALIDATION / ENREGISTREMENT DE LA RESSOURCE
// ============================================================

async function validerRessource() {
    log("ressource", "Validation…");

    const nom = document.getElementById("ressourceNom")?.value.trim() || "";
    const quantite = Number(document.getElementById("ressourceQuantite")?.value || 0);
    const type = document.getElementById("ressourceType")?.value || "legal";

    // ------------------------------------------------------------
    // 1. Vérification des champs
    // ------------------------------------------------------------
    if (!nom || quantite <= 0) {
        logWarn("ressource", "Champs invalides");
        alert("Merci de remplir tous les champs correctement.");
        return;
    }

    // ------------------------------------------------------------
    // 2. Enregistrement dans Supabase
    // ------------------------------------------------------------
    try {
        const data = await api("ressource", "create", {
            nom,
            quantite,
            type,
            date_creation: new Date().toISOString()
        });

        logSuccess("ressource", "Ressource enregistrée :", data);
        alert("Ressource enregistrée avec succès !");

        // Reset interface
        initRessource();

    } catch (err) {
        logError("ressource", "Erreur enregistrement", err);
        alert("Erreur lors de l'enregistrement de la ressource.");
    }
}


// ============================================================
//  🏁 Confirmation de chargement
// ============================================================

logSuccess("RESSOURCE.JS chargé et opérationnel");
