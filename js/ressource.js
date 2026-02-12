// ============================================================
//  MODULE RESSOURCE — LOGIQUE JS
// ============================================================
// ============================================================
//  FONCTION API GÉNÉRIQUE
// ============================================================

async function apiRessource(action, payload = {}) {
  const body = { action, ...payload };

  console.log("[API-RESSOURCE] Appel :", action, body);

  const res = await fetch(API_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    console.error("[API-RESSOURCE] Erreur HTTP :", res.status, res.statusText);
    throw new Error("Erreur API Ressource");
  }

  const data = await res.json();
  console.log("[API-RESSOURCE] Réponse :", data);
  return data;
}

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
    const data = await apiRessource("saveRessource", {
      nom,
      quantite,
      type
    });

    console.log("[RESSOURCE] Ressource enregistrée :", data);
    alert("Ressource enregistrée avec succès !");
  } catch (e) {
    console.error("[RESSOURCE] Erreur enregistrement :", e);
    alert("Erreur lors de l'enregistrement de la ressource.");
  }
}
