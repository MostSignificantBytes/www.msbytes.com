// Calcul du chemin d'une page à partir du frontmatter.
// Exemples : ("fr", "+") → "/" ; ("en", "+blog+2022-06-15-osi-model") → "/en/blog/2022-06-15-osi-model/".
// Les segments ne sont pas normalisés (pas de kebabCase) : les URL publiées restent inchangées.
import { prefix } from './languages.mjs'

const slugHandler = (language, templateKey, slug) => {
    let slugHandled = slug.split('+').join('/')
    if (slugHandled !== '/') {
        slugHandled = slugHandled + '/'
    }
    return prefix(language) + slugHandled
}

// Chemin « + » déduit de l'emplacement du fichier lorsque le frontmatter n'a pas de slug
// (article créé par le back-office) : fr/blog/2026-12-01-x.md → "+blog+2026-12-01-x" ; en/index.md → "+".
export const slugFromFile = (relativePath) => {
    const parts = relativePath.replace(/\.md$/, '').split('/').slice(1) // retire le dossier de langue
    if (parts[parts.length - 1] === 'index') parts.pop()
    return '+' + parts.join('+')
}

export default slugHandler
