// ============================================================
//  MODULE TICKET — LOGIQUE JS
// ============================================================

// ⚠️ Mets ici ton vrai WebApp Apps Script
const API_URL = "https://script.google.com/macros/s/TON_WEBAPP_ID/exec";

// ============================================================
//  FONCTION API GÉNÉRIQUE
// ============================================================

async function apiTicket(action, payload = {}) {
  const body = { action, ...payload };

  console.log("[API-TICKET] Appel :", action, body);

  const res = await fetch(API_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    console.error("[API-TICKET] Erreur HTTP :", res.status, res.statusText);
    throw new Error("Erreur API Ticket");
  }

  const data = await res.json();
  console.log("[API-TICKET] Réponse :", data);
  return data;
}

// ============================================================
//  INITIALISATION DU MODULE TICKET
// ============================================================

function initTicket() {
  console.log("[TICKET] Initialisation…");

  const client = document.getElementById("ticketClient");
  const employe = document.getElementById("ticketEmploye");
  const desc = document.getElementById("ticketDescription");
  const montant = document.getElementById("ticketMontant");

  if (!client || !employe || !desc || !montant) {
    console.error("[TICKET] ERREUR : éléments HTML manquants");
    return;
  }

  chargerEmployesTicket();
}

// ============================================================
//  CHARGEMENT DES EMPLOYÉS
// ============================================================

async function chargerEmployesTicket() {
  console.log("[TICKET] Chargement employés…");

  try {
    const data = await apiTicket("getEmployes");
    const select = document.getElementById("ticketEmploye");
    if (!select) return;

    select.innerHTML = "";
    data.forEach(emp => {
      const opt = document.createElement("option");
      opt.value = emp.id || emp.nom;
      opt.textContent = emp.nom;
      select.appendChild(opt);
    });

  } catch (e) {
    console.error("[TICKET] Erreur employés :", e);
  }
}

// ============================================================
//  VALIDATION DU TICKET
// ============================================================

async function validerTicket() {
  console.log("[TICKET] Validation du ticket…");

  const client = document.getElementById("ticketClient")?.value || "";
  const employe = document.getElementById("ticketEmploye")?.value || "";
  const description = document.getElementById("ticketDescription")?.value || "";
  const montant = Number(document.getElementById("ticketMontant")?.value || 0);

  if (!client || !description || montant <= 0) {
    console.warn("[TICKET] Champs invalides");
    alert("Merci de remplir tous les champs correctement.");
    return;
  }

  try {
    const data = await apiTicket("createTicket", {
      client,
      employe,
      description,
      montant
    });

    console.log("[TICKET] Ticket créé :", data);
    alert("Ticket créé avec succès !");
  } catch (e) {
    console.error("[TICKET] Erreur création ticket :", e);
    alert("Erreur lors de la création du ticket.");
  }
}
