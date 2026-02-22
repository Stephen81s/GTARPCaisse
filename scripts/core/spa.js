/* ============================================================
   SPA.JS — Version GitHub Pages + Local PRO 2026
   ============================================================ */

console.log("🟦 [spa] Module SPA PRO 2026 chargé.");

// Détection automatique du chemin racine
const ROOT = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? ""
    : "/GTARPCaisse";

const spa = {
  cache: {},

  showLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.remove("hidden");
  },

  hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");
  },

  async loadPage(path) {
    console.log(`🟦 [spa] Chargement de la page : ${path}`);

    const frame = document.getElementById("page-frame");
    if (!frame) return;

    this.showLoader();

    const cleanPath = path.replace(/^\/+|\/+$/g, "");
    const pageUrl = `${ROOT}/pages/${cleanPath}.html`;

    if (this.cache[cleanPath]) {
      frame.innerHTML = this.cache[cleanPath];
      this.initPageScript(cleanPath);
      this.hideLoader();
      return;
    }

    try {
      const response = await fetch(pageUrl);
      if (!response.ok) throw new Error(response.status);

      const html = await response.text();
      this.cache[cleanPath] = html;
      frame.innerHTML = html;

      this.initPageScript(cleanPath);

    } catch (err) {
      frame.innerHTML = `
        <div class="error">
          <h2>Erreur de chargement</h2>
          <p>Impossible de charger la page <strong>${cleanPath}</strong>.</p>
        </div>`;
    }

    this.hideLoader();
  },

  initPageScript(path) {
    const scriptUrl = `${ROOT}/scripts/${path}.js`;

    if (document.querySelector(`script[src="${scriptUrl}"]`)) return;

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.onerror = () =>
      console.warn(`⚠️ Aucun script trouvé pour ${scriptUrl}`);
    document.body.appendChild(script);
  },

  async loadSubModule(path, container) {
    const cleanPath = path.replace(/^\/+|\/+$/g, "");
    const htmlPath = `${ROOT}/pages/${cleanPath}.html`;
    const jsPath = `${ROOT}/scripts/${cleanPath}.js`;

    try {
      const html = await fetch(htmlPath).then(r => r.text());
      container.innerHTML = html;
    } catch {
      container.innerHTML = "<p>Erreur : impossible de charger le module.</p>";
      return;
    }

    import(jsPath).catch(() =>
      console.warn(`⚠️ Aucun script pour ${jsPath}`)
    );
  }
};