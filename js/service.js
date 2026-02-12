// ============================================================
//  MODULE SERVICE — LOGIQUE JS (SUPABASE)
// ============================================================

// ============================================================
//  INITIALISATION DU MODULE SERVICE
// ============================================================

function initService() {
  console.log("[SERVICE] Initialisation…");

  const nom = document.getElementById("serviceNom");
  const desc = document.getElementById("serviceDescription");
  const prix = document.getElementById("servicePrix");

  if (!nom || !desc || !prix) {
    console.error("[SERVICE] ERREUR : éléments HTML manquants");
    return;
  }

  console.log("[SERVICE] Interface prête.");
}

// ============================================================
//  VALIDATION / ENREGISTREMENT DU SERVICE
// ============================================================

async function validerService() {
  console.log("[SERVICE] Validation…");

  const nom = document.getElementById("serviceNom")?.value || "";
  const description = document.getElementById("serviceDescription")?.value || "";
  const prix = Number(document.getElementById("servicePrix")?.value || 0);

  if (!nom || !description || prix <= 0) {
    console.warn("[SERVICE] Champs invalides");
    alert("Merci de remplir tous les champs correctement.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("services")
      .insert({
        nom,
        description,
        prix,
        date_creation: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    console.log("[SERVICE] Service enregistré :", data);
    alert("Service enregistré avec succès !");

  } catch (e) {
    console.error("[SERVICE] Erreur enregistrement :", e);
    alert("Erreur lors de l'enregistrement du service.");
  }
}
