// ==========================================
// File: push.js
// Purpose: Build + Flatten + Push (NO HEADER)
// Author: Stephen (PRO 2026)
// ==========================================

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DIST = './dist';
const BUILD = './build';

// ==========================================
// Supprime build/
// ==========================================
function rmDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// ==========================================
// Copie dist → build (SANS MODIFIER LES FICHIERS)
// ==========================================
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      // On copie tel quel, sans rien ajouter
      const content = fs.readFileSync(srcPath, 'utf8');
      fs.writeFileSync(destPath, content, 'utf8');
    }
  }
}

// ==========================================
// Aplati build/
// ==========================================
function flatten(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      flatten(fullPath);
      fs.rmdirSync(fullPath);
    } else {
      if (dir !== BUILD) {
        let target = path.join(BUILD, entry.name);

        if (fs.existsSync(target)) {
          const ext = path.extname(entry.name);
          const base = path.basename(entry.name, ext);
          let counter = 1;

          while (fs.existsSync(target)) {
            target = path.join(BUILD, `${base}_${counter}${ext}`);
            counter++;
          }
        }

        fs.renameSync(fullPath, target);
      }
    }
  }
}

// ==========================================
// EXECUTION
// ==========================================
console.log("[PUSH] Nettoyage build...");
rmDir(BUILD);

console.log("[PUSH] Copie dist → build (sans modification)...");
copyDir(DIST, BUILD);

console.log("[PUSH] Flatten build...");
flatten(BUILD);

console.log("[PUSH] Push vers Apps Script...");
execSync('clasp push', { cwd: BUILD, stdio: 'inherit' });

console.log("[PUSH] ✔ Push terminé PRO 2026 (aucune modification des fichiers)");