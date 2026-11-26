// Petit serveur statique pour les tests : sert un dossier construit (dist/ par défaut) comme Netlify,
// adresse « /chemin/ » → « /chemin/index.html », page 404.html (statut 404) pour une adresse inconnue.
// Usage : node tests/serve.mjs [dossier] [port]
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.argv[2] || 'dist')
const port = Number(process.argv[3] || 4321)

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.txt': 'text/plain; charset=utf-8',
    '.yml': 'text/yaml',
    '.webmanifest': 'application/manifest+json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
}

function resolve(urlPath) {
    let file = path.join(root, decodeURIComponent(urlPath.split('?')[0]))
    if (!file.startsWith(root)) return null
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
    return fs.existsSync(file) ? file : null
}

http.createServer((req, res) => {
    const file = resolve(req.url)
    const status = file ? 200 : 404
    const body = file || path.join(root, '404.html')
    res.writeHead(status, { 'Content-Type': TYPES[path.extname(body)] || 'application/octet-stream' })
    fs.createReadStream(body).pipe(res)
}).listen(port, () => console.log(`${root} servi sur http://localhost:${port}`))
