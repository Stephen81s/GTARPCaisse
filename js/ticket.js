// ============================================================
//  MODULE TICKET — LOGIQUE JS (SUPABASE)
// ============================================================

// ============================================================
//  CHARGEMENT DES EMPLOYÉS
// ============================================================

async function chargerEmployesTicket() {
  console.log("[TICKET] Chargement employés…");

  const select = document.getElementById("ticketEmploye");
  if (!select) {
    console.error("[TICKET] ERREUR : select employé introuvable");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("employes")
      .select("id, nom")
      .order("nom", { ascending: true });

    if (error) throw error;

    select.innerHTML = "";
    data.forEach(emp => {
      const opt = document.createElement("option");
      opt.value = emp.id;
      opt.textContent = emp.nom;
      select.appendChild(opt);
    });

    console.log("[TICKET] Employés chargés :", data);

  } catch (e) {
    console.error("[TICKET] Erreur employés :", e);
  }
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
    const { data, error } = await supabase
      .from("tickets")
      .insert({
        client,
        employe,
        description,
        montant,
        date: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    console.log("[TICKET] Ticket créé :", data);
    alert("Ticket créé avec succès !");

  } catch (e) {
    console.error("[TICKET] Erreur création ticket :", e);
    alert("Erreur lors de la création du ticket.");
  }
}
