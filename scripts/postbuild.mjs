// Étapes après « astro build » :
// 1. purge des styles inutilisés de Bulma (comme gatsby-plugin-purgecss), d'après le HTML et les scripts générés ;
// 2. plan du site publié aussi sous /sitemap.xml ;
// 3. médias publiés aussi sous /img/ ;
// 4. copie du back-office Sveltia CMS (paquet npm @sveltia/cms, version figée) dans dist/admin (décision D3).
import fs from 'node:fs'
import path from 'node:path'
import { PurgeCSS } from 'purgecss'

const DIST = 'dist'

const files = (dir, test) =>
    fs.readdirSync(dir, { recursive: true })
        .map((name) => path.join(dir, name))
        .filter((file) => test(file) && fs.statSync(file).isFile())

// 1. Purge CSS
const css = files(path.join(DIST, '_astro'), (f) => f.endsWith('.css'))
const content = [
    ...files(DIST, (f) => f.endsWith('.html') && !f.startsWith(path.join(DIST, 'admin'))),
    ...files(path.join(DIST, '_astro'), (f) => f.endsWith('.js')),
]
const results = await new PurgeCSS().purge({
    content,
    css,
    // Classes ajoutées par script (menu mobile) ou par reCAPTCHA
    safelist: { standard: ['is-active', 'is-danger'], greedy: [/^g-recaptcha/] },
    keyframes: true,
    fontFace: true,
})
for (const result of results) {
    const before = fs.statSync(result.file).size
    fs.writeFileSync(result.file, result.css)
    console.log(`Styles purgés : ${path.basename(result.file)} ${Math.round(before / 1024)} Ko → ${Math.round(result.css.length / 1024)} Ko`)
}

// 2. Plan du site : /sitemap.xml (adresse déclarée dans robots.txt et la Search Console)
fs.copyFileSync(path.join(DIST, 'sitemap-index.xml'), path.join(DIST, 'sitemap.xml'))

// 3. Médias aussi publiés sous /img/ (adresses de l'ancien site et aperçus du back-office) ;
//    les pages utilisent les versions optimisées de /_astro/.
const MEDIA = path.join('src', 'assets', 'img')
fs.mkdirSync(path.join(DIST, 'img'), { recursive: true })
for (const name of fs.readdirSync(MEDIA)) fs.copyFileSync(path.join(MEDIA, name), path.join(DIST, 'img', name))

// 4. Sveltia CMS : script principal et modules chargés à la demande (dossier chunks/, lu à côté du script)
const sveltia = path.join('node_modules', '@sveltia', 'cms', 'dist')
const admin = path.join(DIST, 'admin')
fs.copyFileSync(path.join(sveltia, 'sveltia-cms.js'), path.join(admin, 'sveltia-cms.js'))
fs.cpSync(path.join(sveltia, 'chunks'), path.join(admin, 'chunks'), {
    recursive: true,
    filter: (src) => !src.endsWith('.map'),
})
const version = JSON.parse(fs.readFileSync(path.join('node_modules', '@sveltia', 'cms', 'package.json'))).version
console.log(`Back-office : Sveltia CMS ${version} copié dans ${admin}`)
