// Assemble la sortie de `vite build` en une page HTML unique et autonome.
//
// Contrainte de départ : la page doit fonctionner sans aucune requête sortante
// (hébergement sous CSP stricte, lecture hors ligne). Tout est donc inliné —
// styles, script, et la police en data URI. JetBrains Mono est distribuée ici
// en fichier variable : une seule déclaration @font-face couvre toutes les
// graisses, inutile d'embarquer un fichier par graisse.
//
// Usage : npm run build && npm run build:standalone

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const DIST = join(ROOT, 'dist')
const OUT = join(ROOT, 'cyberdeck-simulator.html')

const assets = readdirSync(join(DIST, 'assets'))
const cssFile = assets.find((f) => f.endsWith('.css'))
const jsFile = assets.find((f) => f.endsWith('.js'))
if (!cssFile || !jsFile) throw new Error('Sortie de build introuvable — lance `npm run build` d\'abord.')

const css = readFileSync(join(DIST, 'assets', cssFile), 'utf8')
const js = readFileSync(join(DIST, 'assets', jsFile), 'utf8')
const font = readFileSync(join(HERE, 'fonts', 'jetbrains-mono-latin-var.woff2')).toString('base64')

const fontFace = `@font-face{font-family:'JetBrains Mono';font-style:normal;font-weight:100 800;font-display:swap;src:url(data:font/woff2;base64,${font}) format('woff2');}`

// Une occurrence de </script> dans une chaîne du bundle refermerait la balise.
const safeJs = js.replace(/<\/script/gi, '<\\/script')

const html = `<title>Cyberdeck Simulator — Raspberry Pi &amp; BlackBerry Pi</title>
<style>
${fontFace}
${css}
</style>
<div id="root"></div>
<script type="module">
${safeJs}
</script>
`

writeFileSync(OUT, html)
console.log(`écrit : ${OUT} (${(html.length / 1024).toFixed(0)} Ko)`)
