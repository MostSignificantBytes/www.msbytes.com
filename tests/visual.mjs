// Comparaison visuelle de deux versions construites du site (par exemple la branche cible et la pull request).
// Capture pleine page de chaque page à 375, 800 et 1 280 px, compare au pixel et produit un rapport :
// <sortie>/rapport.md (résumé), <sortie>/<largeur>_<page>-{avant,apres,ecarts}.png pour chaque page modifiée.
// Usage : node tests/visual.mjs <dist-avant> <dist-apres> [sortie]
// Le rapport est informatif : une différence voulue (nouvelle page, changement de présentation) est normale.
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { chromium } from '@playwright/test'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'

const [before, after, out = 'rapport-visuel'] = process.argv.slice(2)
if (!before || !after) {
    console.error('Usage : node tests/visual.mjs <dist-avant> <dist-apres> [sortie]')
    process.exit(2)
}
const WIDTHS = [375, 800, 1280]
const PORTS = { avant: 4411, apres: 4412 }
fs.mkdirSync(out, { recursive: true })

const pagesOf = (dist) =>
    fs.readdirSync(dist, { recursive: true })
        .filter((f) => f.endsWith('index.html') && !f.startsWith('admin'))
        .map((f) => '/' + f.replace(/\\/g, '/').replace(/index\.html$/, ''))
const pagesBefore = new Set(pagesOf(before))
const pagesAfter = new Set(pagesOf(after))
const common = [...pagesAfter].filter((p) => pagesBefore.has(p)).sort().concat('/page-inexistante/')
const added = [...pagesAfter].filter((p) => !pagesBefore.has(p)).sort()
const removed = [...pagesBefore].filter((p) => !pagesAfter.has(p)).sort()

const servers = [
    spawn(process.execPath, ['tests/serve.mjs', before, PORTS.avant], { stdio: 'ignore' }),
    spawn(process.execPath, ['tests/serve.mjs', after, PORTS.apres], { stdio: 'ignore' }),
]
await new Promise((r) => setTimeout(r, 800))

async function shoot(page, url) {
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager')))
    await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
            window.scrollTo(0, y)
            await new Promise((r) => setTimeout(r, 30))
        }
        window.scrollTo(0, 0)
    })
    await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 15000 })
    await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))))
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(150)
    return PNG.sync.read(await page.screenshot({ fullPage: true }))
}

// Deux captures de hauteurs différentes : complétées en blanc à la même taille avant comparaison
function pad(img, width, height) {
    if (img.width === width && img.height === height) return img
    const res = new PNG({ width, height })
    res.data.fill(255)
    PNG.bitblt(img, res, 0, 0, img.width, img.height, 0, 0)
    return res
}

const changed = []
let compared = 0
const browser = await chromium.launch(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {})
try {
    for (const width of WIDTHS) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
        const page = await context.newPage()
        for (const p of common) {
            const a = await shoot(page, `http://localhost:${PORTS.avant}${p}`)
            const b = await shoot(page, `http://localhost:${PORTS.apres}${p}`)
            const w = Math.max(a.width, b.width)
            const h = Math.max(a.height, b.height)
            const [pa, pb] = [pad(a, w, h), pad(b, w, h)]
            const diff = new PNG({ width: w, height: h })
            const pixels = pixelmatch(pa.data, pb.data, diff.data, w, h, { threshold: 0.1 })
            compared++
            if (pixels > 0) {
                const name = `${width}_${p.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'accueil'}`
                fs.writeFileSync(path.join(out, `${name}-avant.png`), PNG.sync.write(a))
                fs.writeFileSync(path.join(out, `${name}-apres.png`), PNG.sync.write(b))
                fs.writeFileSync(path.join(out, `${name}-ecarts.png`), PNG.sync.write(diff))
                changed.push({ page: p, width, pixels, ratio: (100 * pixels) / (w * h), heights: [a.height, b.height] })
            }
        }
        await context.close()
    }
} finally {
    await browser.close()
    servers.forEach((s) => s.kill())
}

const lines = [
    '## Comparaison visuelle',
    '',
    `${common.length} pages × ${WIDTHS.length} largeurs (${WIDTHS.join(', ')} px) : ${compared} captures comparées, ` +
        `**${changed.length} différente(s)**.`,
    '',
]
if (changed.length) {
    lines.push('| Page | Largeur | Pixels différents | Part | Hauteur avant → après |', '|---|---|---|---|---|')
    for (const c of changed) {
        lines.push(`| ${c.page} | ${c.width} px | ${c.pixels} | ${c.ratio.toFixed(2)} % | ${c.heights[0]} → ${c.heights[1]} px |`)
    }
    lines.push('', 'Captures avant / après / écarts : artefact « rapport-visuel » de l\'exécution.')
}
if (added.length) lines.push('', `Pages nouvelles : ${added.join(', ')}`)
if (removed.length) lines.push('', `Pages supprimées : ${removed.join(', ')}`)
const report = lines.join('\n') + '\n'
fs.writeFileSync(path.join(out, 'rapport.md'), report)
console.log(report)
