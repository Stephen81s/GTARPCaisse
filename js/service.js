// ============================================================
//  MODULE SERVICE — LOGIQUE JS
// ============================================================
// ============================================================
//  FONCTION API GÉNÉRIQUE
// ============================================================

async function apiService(action, payload = {}) {
  const body = { action, ...payload };

  console.log("[API-SERVICE] Appel :", action, body);

  const res = await fetch(API_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    console.error("[API-SERVICE] Erreur HTTP :", res.status, res.statusText);
    throw new Error("Erreur API Service");
  }

  const data = await res.json();
  console.log("[API-SERVICE] Réponse :", data);
  return data;
}

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
    const data = await apiService("saveService", {
      nom,
      description,
      prix
    });

    console.log("[SERVICE] Service enregistré :", data);
    alert("Service enregistré avec succès !");
  } catch (e) {
    console.error("[SERVICE] Erreur enregistrement :", e);
    alert("Erreur lors de l'enregistrement du service.");
  }
}


function saveService(data) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("Services");
  if (!sheet) throw "Feuille 'Services' introuvable";

  const nom = data.nom;
  const description = data.description;
  const prix = Number(data.prix);

  sheet.appendRow([new Date(), nom, description, prix]);

  return { status: "ok", message: "Service enregistré" };
}
