/* ============================================================
   SPA.JS — Système de navigation dynamique PRO 2026
   Gère le chargement des pages HTML dans #page-frame
   ============================================================ */

console.log("🟦 [spa] Module SPA chargé.");

const spa = {
  cache: {},

  /* ------------------------------------------------------------
     Charge une page HTML depuis /pages/page_xxx.html
     ------------------------------------------------------------ */
  async loadPage(pageName) {
    console.log(`🟦 [spa] Chargement de la page : ${pageName}`);

    const frame = document.getElementById("page-frame");
    if (!frame) {
      console.error("❌ [spa] Élément #page-frame introuvable.");
      return;
    }

    // Si la page est déjà en cache → on l'utilise
    if (this.cache[pageName]) {
      console.log(`🟦 [spa] Page ${pageName} chargée depuis le cache.`);
      frame.innerHTML = this.cache[pageName];
      this.initPageScript(pageName);
      return;
    }

    try {
      const response = await fetch(`pages/page_${pageName}.html`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const html = await response.text();

      // Mise en cache
      this.cache[pageName] = html;

      // Injection dans le frame
      frame.innerHTML = html;

      console.log(`🟦 [spa] Page ${pageName} chargée avec succès.`);

      // Exécute le script associé
      this.initPageScript(pageName);

    } catch (err) {
      console.error(`❌ [spa] Impossible de charger la page ${pageName} :`, err);
      frame.innerHTML = `
        <div class="error">
          <h2>Erreur de chargement</h2>
          <p>Impossible de charger la page <strong>${pageName}</strong>.</p>
        </div>
      `;
    }
  },

  /* ------------------------------------------------------------
     Exécute le script JS correspondant à la page
     Exemple : page "accueil" → scripts/accueil.js
     ------------------------------------------------------------ */
  initPageScript(pageName) {
    const scriptName = `scripts/${pageName}.js`;

    console.log(`🟦 [spa] Initialisation du script : ${scriptName}`);

    // Vérifie si le script existe déjà dans le DOM
    if (document.querySelector(`script[src="${scriptName}"]`)) {
      console.log(`🟦 [spa] Script ${scriptName} déjà chargé.`);
      return;
    }

    // Injecte dynamiquement le script
    const script = document.createElement("script");
    script.src = scriptName;
    script.onload = () => console.log(`🟦 [spa] Script ${scriptName} chargé.`);
    script.onerror = () => console.error(`❌ [spa] Échec du chargement du script ${scriptName}.`);

    document.body.appendChild(script);
  }
};