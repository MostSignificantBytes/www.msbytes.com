// Extensions remark appliquées au Markdown des contenus.
import path from 'node:path'

const MEDIA_DIR = path.resolve('src/assets/img')
const SPACE_NODES = new Set(['paragraph', 'heading', 'tableCell', 'break'])

// Parcours en profondeur (ordre du document) ; `enter` renvoie false pour arrêter.
const walk = (node, enter) => {
    if (enter(node) === false) return false
    for (const child of node.children || []) {
        if (walk(child, enter) === false) return false
    }
    return true
}

// « prune » de underscore.string, utilisé par Gatsby : coupe sans laisser de mot tronqué.
export const prune = (str, length, pruneStr = '…') => {
    if (str.length <= length) return str
    const tmpl = (c) => (c.toUpperCase() !== c.toLowerCase() ? 'A' : ' ')
    let template = str.slice(0, length + 1).replace(/.(?=\W*\w*$)/g, tmpl)
    if (template.slice(template.length - 2).match(/\w\w/)) template = template.replace(/\s*\S+$/, '')
    else template = template.slice(0, template.length - 1).trimEnd()
    return (template + pruneStr).length > str.length ? str : str.slice(0, template.length) + pruneStr
}

// Extrait de 400 caractères (texte brut), calculé comme gatsby-transformer-remark
// (excerpt(pruneLength: 400)) et exposé dans remarkPluginFrontmatter.excerpt. Les images sont ignorées
// (gatsby-remark-images les remplaçait par du HTML avant le calcul de l'extrait).
export function remarkExcerpt() {
    return (tree, file) => {
        const parts = []
        walk(tree, (node) => {
            if (node.type === 'text' || node.type === 'inlineCode') parts.push(node.value)
            else if (SPACE_NODES.has(node.type)) parts.push(' ')
        })
        file.data.astro ??= {}
        file.data.astro.frontmatter ??= {}
        file.data.astro.frontmatter.excerpt = prune(parts.join('').trim(), 400, '…')
    }
}

// Les images du corps des articles sont notées « /img/x.png » (dossier public du back-office) :
// elles sont rattachées à src/assets/img pour être optimisées par Astro (astro:assets).
export function remarkMediaPaths() {
    return (tree, file) => {
        const source = file.path || (file.history && file.history[0])
        if (!source) return
        walk(tree, (node) => {
            if (node.type === 'image' && node.url && node.url.startsWith('/img/')) {
                const target = path.join(MEDIA_DIR, decodeURIComponent(node.url.slice('/img/'.length)))
                let relative = path.relative(path.dirname(source), target).split(path.sep).join('/')
                if (!relative.startsWith('.')) relative = './' + relative
                node.url = relative
            }
        })
    }
}
