// Fichier technique, supprimé après le build par scripts/postbuild.mjs : pour chaque adresse du plan du site,
// les fichiers de contenu dont elle dépend. Il sert à calculer la date de dernière modification (<lastmod>).
import { getPages, getPosts, tagPath } from '../utils/site.js'
import { LANGUAGES } from '../utils/languages.mjs'

export async function GET() {
    const sources = {}
    const add = (url, ids) => { sources[url] = [...new Set([...(sources[url] || []), ...ids])] }
    for (const page of await getPages()) {
        const { templateKey, language } = page.data
        const posts = (await getPosts(language)).map((post) => post.id)
        // Accueil, liste des articles et liste des mots-clés reprennent les articles de la langue
        add(page.path, ['index-page', 'blog-page', 'tags-page'].includes(templateKey) ? [page.id, ...posts] : [page.id])
    }
    for (const language of LANGUAGES)
        for (const post of await getPosts(language))
            for (const tag of post.data.tags || []) add(tagPath(language, tag), [post.id])
    return new Response(JSON.stringify(sources, null, 1))
}
