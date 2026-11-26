// Contrôles du site construit (dist/), sans navigateur : lancé par « npm test » et à chaque pull request.
// - chaque page a une langue, un titre, une adresse canonique, une zone principale et un seul titre h1 ;
// - chaque lien, image ou fichier interne mène à un fichier publié (pas de lien cassé) ;
// - fichiers techniques présents (plan du site, robots.txt, manifeste, back-office) ;
// - le plan du site liste toutes les pages publiées, et seulement elles.
import fs from 'node:fs'
import path from 'node:path'

const DIST = 'dist'
const SITE = 'https://www.msbytes.com'
const errors = []
const fail = (msg) => errors.push(msg)

const all = fs.readdirSync(DIST, { recursive: true }).map((f) => path.join(DIST, f))
const pages = all.filter((f) => f.endsWith('.html') && !f.startsWith(path.join(DIST, 'admin')) && !path.basename(f).startsWith('google'))

const exists = (urlPath) => {
    const file = path.join(DIST, decodeURIComponent(urlPath))
    if (!fs.existsSync(file)) return false
    return fs.statSync(file).isDirectory() ? fs.existsSync(path.join(file, 'index.html')) : true
}

const pageUrl = (file) => '/' + path.relative(DIST, file).replace(/\\/g, '/').replace(/index\.html$/, '')

let links = 0
for (const file of pages) {
    const url = pageUrl(file)
    const html = fs.readFileSync(file, 'utf8')
    if (!/<html lang="(fr|en)"/.test(html)) fail(`${url} : attribut lang absent ou inattendu`)
    if (!/<title>[^<]+<\/title>/.test(html)) fail(`${url} : titre absent`)
    if (/chrome-extension:|moz-extension:/.test(html)) fail(`${url} : référence à une extension de navigateur (fichier enregistré depuis un navigateur ?)`)
    if (!/<main[\s>]/.test(html)) fail(`${url} : zone principale <main> absente`)
    const h1 = (html.match(/<h1[\s>]/g) || []).length
    if (h1 !== 1) fail(`${url} : ${h1} titres h1 (1 attendu)`)
    if (!url.startsWith('/404') && !html.includes(`<link rel="canonical" href="${SITE}${url}"`)) fail(`${url} : adresse canonique absente ou fausse`)

    for (const [, attr, value] of html.matchAll(/\s(href|src|srcset)="([^"]+)"/g)) {
        for (const candidate of attr === 'srcset' ? value.split(',').map((s) => s.trim().split(/\s+/)[0]) : [value]) {
            if (!candidate.startsWith('/') || candidate.startsWith('//')) continue
            links++
            const target = candidate.split('#')[0].split('?')[0]
            if (target && !exists(target)) fail(`${url} : lien interne cassé ${candidate}`)
        }
    }
}

for (const f of ['sitemap.xml', 'sitemap-0.xml', 'robots.txt', 'manifest.webmanifest', '404.html', 'favicon.ico',
    '.well-known/security.txt', 'admin/index.html', 'admin/config.yml', 'admin/init.js', 'admin/sveltia-cms.js']) {
    if (!fs.existsSync(path.join(DIST, f))) fail(`fichier absent : ${f}`)
}

// security.txt (RFC 9116) : date d'expiration à renouveler, au plus tard un mois avant l'échéance
const securityTxt = path.join(DIST, '.well-known', 'security.txt')
if (fs.existsSync(securityTxt)) {
    const expires = /^Expires: (.+)$/m.exec(fs.readFileSync(securityTxt, 'utf8'))
    const delay = expires ? (new Date(expires[1]) - Date.now()) / 86400000 : NaN
    if (!(delay > 30)) fail(`security.txt : date « Expires » absente ou à moins de 30 jours (${expires?.[1]}) : la repousser d'un an`)
}

// Plan du site : toutes les pages publiées (hors 404) et seulement elles
const listed = [...fs.readFileSync(path.join(DIST, 'sitemap-0.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ''))
const published = pages.map(pageUrl).filter((u) => !u.startsWith('/404'))
for (const u of published) if (!listed.includes(u)) fail(`plan du site : ${u} absent`)
for (const u of listed) if (!published.includes(u)) fail(`plan du site : ${u} ne correspond à aucune page`)

// Back-office : traduction, polices et recherche de version servies par le site, pas par un CDN
// (décision D3 de la note Sveltia CMS ; adresses remplacées par scripts/postbuild.mjs)
const cms = fs.readFileSync(path.join(DIST, 'admin', 'sveltia-cms.js'), 'utf8')
for (const cdn of [/unpkg\.com\/@sveltia\/cms@[^/]+\/locales/, /cdn\.jsdelivr\.net\/npm\/@fontsource/, /unpkg\.com\/\$\{t\}/]) {
    if (cdn.test(cms)) fail(`back-office : adresse ${cdn.source} encore présente`)
}

console.log(`${pages.length} pages, ${links} liens internes, ${listed.length} adresses dans le plan du site`)
if (errors.length) {
    console.error(errors.map((e) => '✗ ' + e).join('\n'))
    console.error(`${errors.length} erreur(s)`)
    process.exit(1)
}
console.log('✓ site construit conforme')
