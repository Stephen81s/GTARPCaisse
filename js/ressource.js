// ============================================================
//  MODULE RESSOURCE — LOGIQUE JS (SUPABASE)
// ============================================================

// ============================================================
//  INITIALISATION DU MODULE RESSOURCE
// ============================================================

function initRessource() {
  console.log("[RESSOURCE] Initialisation…");

  const nom = document.getElementById("ressourceNom");
  const quantite = document.getElementById("ressourceQuantite");
  const type = document.getElementById("ressourceType");

  if (!nom || !quantite || !type) {
    console.error("[RESSOURCE] ERREUR : éléments HTML manquants");
    return;
  }

  console.log("[RESSOURCE] Interface prête.");
}

// ============================================================
//  VALIDATION / ENREGISTREMENT DE LA RESSOURCE
// ============================================================

async function validerRessource() {
  console.log("[RESSOURCE] Validation…");

  const nom = document.getElementById("ressourceNom")?.value || "";
  const quantite = Number(document.getElementById("ressourceQuantite")?.value || 0);
  const type = document.getElementById("ressourceType")?.value || "legal";

  if (!nom || quantite <= 0) {
    console.warn("[RESSOURCE] Champs invalides");
    alert("Merci de remplir tous les champs correctement.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("ressources")
      .insert({
        nom,
        quantite,
        type,
        date_creation: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    console.log("[RESSOURCE] Ressource enregistrée :", data);
    alert("Ressource enregistrée avec succès !");

  } catch (e) {
    console.error("[RESSOURCE] Erreur enregistrement :", e);
    alert("Erreur lors de l'enregistrement de la ressource.");
  }
}
