# GTARPCaisse — RP Manager PRO 2026

Projet de gestion d'entreprises / caisse pour serveur GTA Roleplay.

## Objectif
Application front + backend (Google Apps Script + Google Sheets) pour gérer : joueurs, entreprises, articles, employés, stocks, amendes et services.

## Structure principale
- `appsscript/` — scripts Google Apps Script (.gs) côté backend
- `pages/` — fragments HTML pour le frontend
- `scripts/` — JS front (SPA)
- `styles/` — CSS
- `tools/` — utilitaires (ex: sync)

## Prérequis
- Node.js (pour outils locaux)
- `clasp` installé et connecté pour déployer sur Google Apps Script
- Accès à une Google Spreadsheet utilisée comme base de données

## Installation locale
1. Cloner le dépôt
   ```bash
   git clone <repo>
   cd GTARPCaisse
   ```
2. Installer les dépendances (si présentes)
   ```bash
   npm install
   ```

## Déploiement Apps Script (via CLASP)
1. Se connecter :
   ```bash
   npm i -g @google/clasp
   clasp login
   ```
2. Lier / configurer le projet si nécessaire
   ```bash
   clasp create --type standalone --title "GTARPCaisse" # ou clasp clone <scriptId>
   clasp push
   ```
3. Déployer en tant que Web App depuis l'interface Apps Script (ou via l'API de déploiement).

## Configuration
- `appsscript/constants.gs` contient l'ID de la spreadsheet et les constantes.
- Ne commite pas les secrets (service account, credentials, .clasp.json). Ils sont listés dans `.gitignore`.
- Pour les clés/API externes, stocker localement et ne pas les ajouter au repo.

## Utilisation principale
- Page de connexion : `pages/login.html` → saisie d'un jeton (clé d'activation) + nom/prénom
- Backend : `appsscript/Code.gs` → fonction d'activation (`ui_activateKey`) qui lit la feuille `KEYS` et marque la clé comme utilisée.
- Le frontend charge les pages via le SPA (`scripts/admin/spa.js`).

## Sécurité & bonnes pratiques
- Ne jamais stocker de jetons sensibles en clair côté client. Valider toute clé côté serveur.
- Ajouter des contrôles d'accès côté Apps Script (vérifier `Session.getActiveUser()` si nécessaire) et limiter les permissions.
- Garder les fichiers de configuration sensibles dans `tools/` et listés dans `.gitignore`.

## Développement
- Ouvrir `index.html` localement pour tester le frontend (SPA)
- Utiliser la console du navigateur pour debug des scripts front
- Utiliser `clasp push` pour envoyer les modifications backend

## Contribuer
- Ouvrir une issue pour proposer une fonctionnalité
- Faire une branche par feature et une PR claire

## Contacts
Auteur : Stephen

---

Si tu veux, je peux :
- Ajouter des instructions d'installation plus détaillées (OAuth, service account)
- Écrire des scripts `npm` pour automatiser `clasp push`
- Générer un guide de déploiement pas-à-pas
