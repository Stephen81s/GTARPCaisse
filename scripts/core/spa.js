/* ============================================================
   SPA.JS — Système de navigation dynamique PRO 2026
   Compatible sous‑dossiers illimités
   Charge automatiquement :
   - pages/<path>.html
   - scripts/<path>.js
   - sous‑modules admin via loadSubModule()
   ============================================================ */

console.log("🟦 [spa] Module SPA PRO 2026 chargé.");

const spa = {
  cache: {},

  /* ------------------------------------------------------------
     Affiche le loader global
     ------------------------------------------------------------ */
  showLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.remove("hidden");
  },

  /* ------------------------------------------------------------
     Cache le loader global
     ------------------------------------------------------------ */
  hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");
  },

  /* ------------------------------------------------------------
     Charge une page HTML depuis /pages/<path>.html
     ------------------------------------------------------------ */
  async loadPage(path) {
    console.log(`🟦 [spa] Chargement de la page : ${path}`);

    const frame = document.getElementById("page-frame");
    if (!frame) {
      console.error("❌ [spa] Élément #page-frame introuvable.");
      return;
    }

    this.showLoader();

    const cleanPath = path.replace(/^\/+|\/+$/g, "");
    const pageUrl = `pages/${cleanPath}.html`;

    // Cache
    if (this.cache[cleanPath]) {
      console.log(`🟦 [spa] Page ${cleanPath} chargée depuis le cache.`);
      frame.innerHTML = this.cache[cleanPath];
      this.initPageScript(cleanPath);
      this.hideLoader();
      window.scrollTo(0, 0);
      return;
    }

    try {
      const response = await fetch(pageUrl);
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

      const html = await response.text();
      this.cache[cleanPath] = html;

      frame.innerHTML = html;
      console.log(`🟦 [spa] Page ${cleanPath} chargée avec succès.`);

      this.initPageScript(cleanPath);

    } catch (err) {
      console.error(`❌ [spa] Impossible de charger ${cleanPath} :`, err);
      frame.innerHTML = `
        <div class="error">
          <h2>Erreur de chargement</h2>
          <p>Impossible de charger la page <strong>${cleanPath}</strong>.</p>
        </div>
      `;
    }

    this.hideLoader();
    window.scrollTo(0, 0);
  },

  /* ------------------------------------------------------------
     Charge automatiquement le script correspondant
     ------------------------------------------------------------ */
  initPageScript(path) {
    const scriptUrl = `scripts/${path}.js`;

    console.log(`🟦 [spa] Initialisation du script : ${scriptUrl}`);

    // Vérifie si déjà chargé
    if (document.querySelector(`script[src="${scriptUrl}"]`)) {
      console.log(`🟦 [spa] Script ${scriptUrl} déjà chargé.`);
      return;
    }

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.onload = () => console.log(`🟦 [spa] Script ${scriptUrl} chargé.`);
    script.onerror = () =>
      console.warn(`⚠️ [spa] Aucun script trouvé pour ${scriptUrl} (normal si optionnel).`);

    document.body.appendChild(script);
  },

  /* ------------------------------------------------------------
     Charge un sous-module dans un conteneur spécifique
     Exemple :
       spa.loadSubModule("admin/demandes", zone)
     ------------------------------------------------------------ */
  async loadSubModule(path, container) {
    console.log(`🟧 [spa] Chargement sous-module : ${path}`);

    const cleanPath = path.replace(/^\/+|\/+$/g, "");
    const htmlPath = `pages/${cleanPath}.html`;
    const jsPath = `scripts/${cleanPath}.js`;

    try {
      const html = await fetch(htmlPath).then(r => r.text());
      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = "<p>Erreur : impossible de charger le module.</p>";
      return;
    }

    // Script associé
    import(`../${jsPath}`).catch(() => {
      console.warn(`⚠️ [spa] Aucun script pour ${jsPath}`);
    });
  }
};