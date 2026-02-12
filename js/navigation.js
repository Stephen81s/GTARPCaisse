// ============================================================
//  NAVIGATION — Gestion des interfaces
// ============================================================

// ============================================================
//  Chargement dynamique des interfaces HTML
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
    console.log("[NAVIGATION] Chargement des interfaces…");

    const interfaces = [
        "accueil",
        "caisse",
        "ticket",
        "ressource",
        "service"
    ];

    const container = document.getElementById("interfaces-container");
    if (!container) {
        console.error("[NAVIGATION] ❌ Conteneur 'interfaces-container' introuvable");
        return;
    }

    for (const name of interfaces) {
        try {
            const response = await fetch(`interfaces/${name}.html`);

            if (!response.ok) {
                console.error(`[NAVIGATION] ❌ Fichier introuvable : interfaces/${name}.html`);
                continue;
            }

            const html = await response.text();
            container.insertAdjacentHTML("beforeend", html);

            console.log(`[NAVIGATION] ✔ Interface chargée : ${name}`);

        } catch (err) {
            console.error(`[NAVIGATION] ❌ Erreur lors du chargement de ${name}.html`, err);
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
    all.forEach(div => {
        div.style.display = "none";
    });

    const target = document.getElementById(id);
    if (!target) {
        console.error(`[NAVIGATION] ❌ Interface introuvable : ${id}`);
        return;
    }

    target.style.display = "block";
    console.log(`[NAVIGATION] ✔ Interface affichée : ${id}`);
}
