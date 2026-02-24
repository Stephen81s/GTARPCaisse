// ===============================
// File: build.js
// Purpose: Generate /dist with headers for all files
// ===============================

import fs from 'fs'
import path from 'path'

const SRC = './src'
const DIST = './dist'

// Nettoyer dist
fs.rmSync(DIST, { recursive: true, force: true })
fs.mkdirSync(DIST)

// Génère un header selon le type
function makeHeader(filename, sourcePath, type) {
  if (type === 'html') {
    return `<!-- ===============================
     File: ${filename}
     Source: ${sourcePath}
     =============================== -->\n\n`
  }

  if (type === 'css' || type === 'js') {
    return `/* ===============================
   File: ${filename}
   Source: ${sourcePath}
   =============================== */\n\n`
  }

  if (type === 'gs') {
    return `// ===============================
// File: ${filename}
// Source: ${sourcePath}
// ===============================\n\n`
  }

  return ''
}

// Parcours récursif
function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      scan(fullPath)
    } else {
      processFile(fullPath)
    }
  }
}

// Traitement des fichiers
function processFile(filePath) {
  const ext = path.extname(filePath)
  const base = path.basename(filePath, ext)
  const relative = filePath.replace('./', '')

  // HTML
  if (ext === '.html') {
    const content = fs.readFileSync(filePath, 'utf8')
    const header = makeHeader(`${base}.html`, relative, 'html')
    fs.writeFileSync(`${DIST}/${base}.html`, header + content)
    return
  }

  // CSS → .css.html
  if (ext === '.css') {
    const content = fs.readFileSync(filePath, 'utf8')
    const header = makeHeader(`${base}.css`, relative, 'css')
    fs.writeFileSync(`${DIST}/${base}.css.html`, header + content)
    return
  }

  // JS → .js.html
  if (ext === '.js') {
    const content = fs.readFileSync(filePath, 'utf8')
    const header = makeHeader(`${base}.js`, relative, 'js')
    fs.writeFileSync(`${DIST}/${base}.js.html`, header + content)
    return
  }

  // GS
  if (ext === '.gs') {
    const content = fs.readFileSync(filePath, 'utf8')
    const header = makeHeader(`${base}.gs`, relative, 'gs')
    fs.writeFileSync(`${DIST}/${base}.gs`, header + content)
    return
  }
}

scan(SRC)

console.log('✔ Build terminé — /dist prêt pour clasp push')