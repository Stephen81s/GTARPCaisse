// ============================================================
//  NAVIGATION — Gestion des interfaces
// ============================================================

// Charge toutes les interfaces HTML dans la page
document.addEventListener("DOMContentLoaded", async () => {
    console.log("[NAVIGATION] Chargement des interfaces…");

    const interfaces = [
        "accueil",
        "caisse",
        "ticket",
        "ressource",
        "service"
    ];

    for (const name of interfaces) {
        try {
            const response = await fetch(`interfaces/${name}.html`);
            const html = await response.text();
            document.getElementById("interfaces-container").innerHTML += html;
            console.log(`[NAVIGATION] Interface chargée : ${name}`);
        } catch (err) {
            console.error(`[NAVIGATION] ERREUR : interfaces/${name}.html introuvable`);
        }
    }

    // Affiche automatiquement l'accueil
    showInterface("interface_accueil");
});

// ============================================================
//  Fonction d'affichage d'une interface
// ============================================================

function showInterface(id) {
    console.log(`[NAVIGATION] → Affichage demandé : ${id}`);

    const all = document.querySelectorAll(".interface");
    all.forEach(div => div.style.display = "none");

    const target = document.getElementById(id);
    if (!target) {
        console.error(`[NAVIGATION] ❌ Interface introuvable : ${id}`);
        return;
    }

    target.style.display = "block";
    console.log(`[NAVIGATION] ✔ Interface affichée : ${id}`);
}
