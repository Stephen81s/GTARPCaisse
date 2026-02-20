/* ============================================================
   SPA.JS — Système de navigation dynamique PRO 2026
   Compatible sous‑dossiers illimités
   Charge automatiquement :
   - pages/<path>.html
   - scripts/<path>.js
   ============================================================ */

console.log("🟦 [spa] Module SPA PRO 2026 chargé.");

const spa = {
  cache: {},

  /* ------------------------------------------------------------
     Charge une page HTML depuis /pages/<path>.html
     Exemple :
       spa.loadPage("admin/activation")
       spa.loadPage("entreprise/banque")
       spa.loadPage("accueil")
     ------------------------------------------------------------ */
  async loadPage(path) {
    console.log(`🟦 [spa] Chargement de la page : ${path}`);

    const frame = document.getElementById("page-frame");
    if (!frame) {
      console.error("❌ [spa] Élément #page-frame introuvable.");
      return;
    }

    // Normalisation du chemin
    const cleanPath = path.replace(/^\/+|\/+$/g, "");
    const pageUrl = `pages/${cleanPath}.html`;

    // Cache
    if (this.cache[cleanPath]) {
      console.log(`🟦 [spa] Page ${cleanPath} chargée depuis le cache.`);
      frame.innerHTML = this.cache[cleanPath];
      this.initPageScript(cleanPath);
      return;
    }

    try {
      const response = await fetch(pageUrl);

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const html = await response.text();

      // Mise en cache
      this.cache[cleanPath] = html;

      // Injection
      frame.innerHTML = html;

      console.log(`🟦 [spa] Page ${cleanPath} chargée avec succès.`);

      // Script associé
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
  },

  /* ------------------------------------------------------------
     Charge automatiquement le script correspondant :
       pages/admin/activation.html → scripts/admin/activation.js
       pages/entreprise/banque.html → scripts/entreprise/banque.js
       pages/accueil.html → scripts/accueil.js
     ------------------------------------------------------------ */
  initPageScript(path) {
    const scriptUrl = `scripts/${path}.js`;

    console.log(`🟦 [spa] Initialisation du script : ${scriptUrl}`);

    // Vérifie si déjà chargé
    if (document.querySelector(`script[src="${scriptUrl}"]`)) {
      console.log(`🟦 [spa] Script ${scriptUrl} déjà chargé.`);
      return;
    }

    // Injection dynamique
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.onload = () => console.log(`🟦 [spa] Script ${scriptUrl} chargé.`);
    script.onerror = () => console.warn(`⚠️ [spa] Aucun script trouvé pour ${scriptUrl} (normal si optionnel).`);

    document.body.appendChild(script);
  }
};