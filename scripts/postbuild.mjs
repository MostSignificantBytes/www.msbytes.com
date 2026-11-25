// Étapes après « astro build » :
// 1. plan du site publié aussi sous /sitemap.xml ;
// 2. médias publiés aussi sous /img/ ;
// 3. copie du back-office Sveltia CMS (paquet npm @sveltia/cms, version figée) dans dist/admin, avec sa traduction
//    et ses polices : aucune ressource extérieure au chargement (décision D3).
import fs from 'node:fs'
import path from 'node:path'

const DIST = 'dist'

const files = (dir, test) =>
    fs.readdirSync(dir, { recursive: true })
        .map((name) => path.join(dir, name))
        .filter((file) => test(file) && fs.statSync(file).isFile())

// 1. Plan du site : /sitemap.xml (adresse déclarée dans robots.txt et la Search Console)
fs.copyFileSync(path.join(DIST, 'sitemap-index.xml'), path.join(DIST, 'sitemap.xml'))

// 2. Médias aussi publiés sous /img/ (adresses de l'ancien site et aperçus du back-office) ;
//    les pages utilisent les versions optimisées de /_astro/.
const MEDIA = path.join('src', 'assets', 'img')
fs.mkdirSync(path.join(DIST, 'img'), { recursive: true })
for (const name of fs.readdirSync(MEDIA)) fs.copyFileSync(path.join(MEDIA, name), path.join(DIST, 'img', name))

// 3. Sveltia CMS : script principal et modules chargés à la demande (dossier chunks/, lu à côté du script)
const sveltia = path.join('node_modules', '@sveltia', 'cms', 'dist')
const admin = path.join(DIST, 'admin')
fs.copyFileSync(path.join(sveltia, 'sveltia-cms.js'), path.join(admin, 'sveltia-cms.js'))
fs.cpSync(path.join(sveltia, 'chunks'), path.join(admin, 'chunks'), {
    recursive: true,
    filter: (src) => !src.endsWith('.map'),
})
const version = JSON.parse(fs.readFileSync(path.join('node_modules', '@sveltia', 'cms', 'package.json'))).version

// Traductions de l'interface et polices, servies par le site au lieu des CDN unpkg.com et cdn.jsdelivr.net.
// Les adresses sont remplacées dans le script copié ; le build échoue si l'une d'elles n'y figure pas
// (nouvelle version de Sveltia CMS : vérifier les versions des paquets de polices dans package.json).
const LOCALES = ['fr', 'en-US']
fs.mkdirSync(path.join(admin, 'locales'), { recursive: true })
for (const locale of LOCALES)
    fs.copyFileSync(path.join('node_modules', '@sveltia', 'cms', 'locales', `${locale}.json`), path.join(admin, 'locales', `${locale}.json`))
const pkgVersion = (name) => JSON.parse(fs.readFileSync(path.join('node_modules', name, 'package.json'))).version
const FONTS = [
    ['@fontsource-variable/material-symbols-outlined', 'material-symbols-outlined:vf', 'material-symbols-outlined-latin-wght-normal.woff2', 'latin-wght-normal.woff2'],
    ['@fontsource-variable/source-sans-3', 'source-sans-3:vf', 'source-sans-3-latin-wght-normal.woff2', 'latin-wght-normal.woff2'],
    ['@fontsource/noto-mono', 'noto-mono', 'noto-mono-latin-400-normal.woff2', 'latin-400-normal.woff2'],
]
fs.mkdirSync(path.join(admin, 'fonts'), { recursive: true })
const replacements = [
    [`https://unpkg.com/@sveltia/cms@${version}/locales`, '/admin/locales'],
    // Recherche d'une nouvelle version sur unpkg.com : remplacée par un fichier local (version figée, mises à jour par Dependabot)
    ['`https://unpkg.com/${t}${e?`@${e}`:``}/package.json`', '`/admin/version.json`'],
]
fs.writeFileSync(path.join(admin, 'version.json'), JSON.stringify({ version }))
for (const [pkg, cdnName, file, cdnFile] of FONTS) {
    fs.copyFileSync(path.join('node_modules', pkg, 'files', file), path.join(admin, 'fonts', file))
    replacements.push([`https://cdn.jsdelivr.net/fontsource/fonts/${cdnName}@${pkgVersion(pkg)}/${cdnFile}`, `/admin/fonts/${file}`])
}
const script = path.join(admin, 'sveltia-cms.js')
let code = fs.readFileSync(script, 'utf8')
for (const [from, to] of replacements) {
    if (!code.includes(from)) throw new Error(`Back-office : adresse introuvable dans sveltia-cms.js : ${from}`)
    code = code.replaceAll(from, to)
}
fs.writeFileSync(script, code)
console.log(`Back-office : Sveltia CMS ${version} copié dans ${admin} (traductions ${LOCALES.join(', ')} et ${FONTS.length} polices hébergées)`)
