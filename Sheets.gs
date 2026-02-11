/* =====================================================================
   @file        styles.html
   @description Feuille de style principale — module CAISSE

   Auteur       : Stephen
   Version      : 4.1.0
   Mis à jour   : 2026-02-10

   Points clés :
     - Ligne QUADRUPLE (Employé / Client / Téléphone / Paiement)
     - Datalist compatible (client)
     - Thème GitHub Dark
     - Responsive 900px / 600px
     - Lignes d’articles flexibles
   ===================================================================== */


/* 🌙 THÈME GLOBAL ----------------------------------------------------- */

body {
  font-family: Arial, sans-serif;
  background: #0d1117;
  color: #e6edf3;
  margin: 20px;
}

h2.titre-interface {
  color: #58a6ff;
  margin-bottom: 20px;
}


/* 🎛️ SELECTEUR TYPE D’OPÉRATION ------------------------------------- */

.ligne-type {
  text-align: center;
  margin-bottom: 25px;
}

.ligne-type label {
  display: block;
  font-size: 20px;
  color: #58a6ff;
  margin-bottom: 6px;
}

.ligne-type select {
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 6px;
  border: 2px solid #30363d;
  background: #0d1117;
  color: #e6edf3;
}


/* 🧩 LIGNE QUADRUPLE -------------------------------------------------- */

.ligne-quadruple {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 20px !important;
  margin-bottom: 15px;
  width: 100%;
  overflow: visible !important;
}

.ligne-quadruple > div {
  width: 100%;
  overflow: visible !important;
}

.ligne-quadruple label {
  display: block;
  margin-bottom: 4px;
  color: #94a3b8;
}

.ligne-quadruple input,
.ligne-quadruple select {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #30363d;
  background: #0d1117;
  color: #e6edf3;
  box-sizing: border-box;
}


/* 📱 RESPONSIVE QUADRUPLE -------------------------------------------- */

@media (max-width: 900px) {
  .ligne-quadruple {
    grid-template-columns: 1fr 1fr !important;
  }
}

@media (max-width: 600px) {
  .ligne-quadruple {
    grid-template-columns: 1fr !important;
  }
}


/* 🛠️ FIX DATALIST ----------------------------------------------------- */

.client-wrapper {
  position: relative;
  display: block;
  width: 100%;
  overflow: visible !important;
}

#client {
  min-width: 0 !important;
}


/* 🧾 LIGNE ARTICLE ----------------------------------------------------- */

.ligne-article {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border: 1px solid #30363d;
  border-radius: 6px;
  margin-bottom: 10px;
  background: #161b22;
  transition: 0.2s;
}

.ligne-article input,
.ligne-article select {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #30363d;
  background: #0d1117;
  color: #e6edf3;
  width: 100px;
}

.ligne-article .articleInput {
  flex: 1;
  min-width: 180px;
}

.ligne-article .totalLigne {
  font-weight: bold;
  color: #58a6ff;
}

/* Boutons ligne article */
.ligne-article button {
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  background: #1f6feb;
  color: white;
  transition: 0.2s;
}

.ligne-article button:hover {
  background: #1158c7;
}

.ligne-article .supprimerLigne {
  background: #d73a49;
}

.ligne-article .supprimerLigne:hover {
  background: #b92533;
}


/* 🎨 COULEURS DYNAMIQUES ---------------------------------------------- */

.ligne-article.legal {
  border-left: 6px solid #1b5e20;
  background: #a5d6a7;
  color: #000;
}

.ligne-article.illegal {
  border-left: 6px solid #b71c1c;
  background: #ef9a9a;
  color: #000;
}

.ligne-article.violet {
  border-left: 6px solid #4a148c;
  background: #ce93d8;
  color: #000;
}


/* 🔘 BOUTONS GLOBAUX -------------------------------------------------- */

.btn-caisse {
  padding: 10px 15px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: 0.2s;
}

.btn-bleu {
  background: #1f6feb;
  color: white;
}

.btn-bleu:hover {
  background: #1158c7;
}

.btn-rouge {
  background: #d73a49;
  color: white;
}

.btn-rouge:hover {
  background: #b92533;
}


/* 💰 TOTAL GLOBAL ----------------------------------------------------- */

#totalGlobalBox {
  margin-top: 20px;
  padding: 15px;
  background: #11161d;
  border: 2px solid #d73a49;
  border-radius: 8px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  color: #58a6ff;
}


/* STYLE CAISSES HEADER ------------------------------------------------ */

#nav-caisses {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0;
  width: 100%;
  padding-right: 10px;
}

/* Bloc général */
.caisse-nav-box {
  padding: 12px 18px;
  min-width: 140px;
  text-align: center;
  color: black;
}

/* ----- LÉGALE ----- */
.caisse-legal {
  border: 3px solid #0f5e0f;
  border-right: none;
  background: #c8f7c8;
  border-radius: 10px 0 0 10px;
}

/* ----- ILLÉGALE ----- */
.caisse-illegal {
  border: 3px solid #7a0000;
  border-left: none;
  background: #ffcccc;
  border-radius: 0 10px 10px 0;
}

/* ----- TITRE ----- */
.caisse-nav-titre {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

/* ----- MONTANT ----- */
.caisse-nav-montant {
  font-size: 28px;
  font-weight: bold;
}

#nav-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}
