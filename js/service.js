// ============================================================
//  SERVICE.JS — MODULE SERVICE (SUPABASE)
//  Auteur : Stephen
//  Version : 1.0
//  Description :
//    - Gestion des services RP
//    - Création de services (nom, description, prix)
//    - Enregistrement en base (table services)
// ============================================================


// ============================================================
//  🔧 INITIALISATION DE L’INTERFACE SERVICE
// ============================================================

function initService() {
    log("service", "Initialisation de l’interface…");

    const nom = document.getElementById("serviceNom");
    const desc = document.getElementById("serviceDescription");
    const prix = document.getElementById("servicePrix");
    const btn = document.getElementById("serviceValider");

    if (!nom || !desc || !prix || !btn) {
        logError("service", "Éléments HTML manquants");
        return;
    }

    // Reset interface
    nom.value = "";
    desc.value = "";
    prix.value = "";

    logSuccess("service", "Interface prête");
}


// ============================================================
//  📝 VALIDATION / ENREGISTREMENT DU SERVICE
// ============================================================

async function validerService() {
    log("service", "Validation…");

    const nom = document.getElementById("serviceNom")?.value.trim() || "";
    const description = document.getElementById("serviceDescription")?.value.trim() || "";
    const prix = Number(document.getElementById("servicePrix")?.value || 0);

    // ------------------------------------------------------------
    // 1. Vérification des champs
    // ------------------------------------------------------------
    if (!nom || !description || prix <= 0) {
        logWarn("service", "Champs invalides");
        alert("Merci de remplir tous les champs correctement.");
        return;
    }

    // ------------------------------------------------------------
    // 2. Enregistrement dans Supabase
    // ------------------------------------------------------------
    try {
        const data = await api("service", "create", {
            nom,
            description,
            prix,
            date_creation: new Date().toISOString()
        });

        logSuccess("service", "Service enregistré :", data);
        alert("Service enregistré avec succès !");

        // Reset interface
        initService();

    } catch (err) {
        logError("service", "Erreur enregistrement", err);
        alert("Erreur lors de l'enregistrement du service.");
    }
}


// ============================================================
//  🏁 Confirmation de chargement
// ============================================================

logSuccess("SERVICE.JS chargé et opérationnel");
