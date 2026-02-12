console.log("%c[ROUTER] Initialisation…", "color:#9C27B0;font-weight:bold;");

async function loadPage(pageName) {
    console.log("%c[ROUTER] Chargement page : " + pageName, "color:#9C27B0;");

    const container = document.getElementById("page-container");

    try {
        const response = await fetch(`interfaces/${pageName}.html`);
        const html = await response.text();
        container.innerHTML = html;

        console.log("%c[ROUTER] Page chargée : " + pageName, "color:#4CAF50;");
    } catch (err) {
        container.innerHTML = "<h2>Erreur</h2><p>Impossible de charger la page.</p>";
        console.error("[ROUTER] Erreur :", err);
    }
}
