// Langues du site. Pour ajouter une langue : l'ajouter ici, créer src/content/<langue>/,
// compléter src/data/navbar.js et les libellés de src/utils/labels.js.
export const LANGUAGES = ['fr', 'en']
export const DEFAULT_LANGUAGE = 'fr'

// Préfixe des adresses d'une langue : '' pour le français, '/en' pour l'anglais.
export const prefix = (language) => (language === DEFAULT_LANGUAGE ? '' : '/' + language)

// Langue d'une adresse (« /en/about/ » → en).
export const languageOfPath = (path) => {
    const first = path.split('/')[1]
    return LANGUAGES.includes(first) && first !== DEFAULT_LANGUAGE ? first : DEFAULT_LANGUAGE
}

// Adresse sans préfixe de langue (« /en/about/ » → « /about/ »).
export const unprefixed = (path) => {
    const language = languageOfPath(path)
    return language === DEFAULT_LANGUAGE ? path : path.slice(language.length + 1)
}
