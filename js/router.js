async function loadPage(page) {
    const container = document.getElementById("page-container");

    try {
        const res = await fetch(`interfaces/${page}.html`);

        if (!res.ok) {
            container.innerHTML = "<h2>Page introuvable</h2>";
            return;
        }

        const html = await res.text();
        container.innerHTML = html;

    } catch (err) {
        container.innerHTML = "<h2>Erreur de chargement</h2>";
    }
}
