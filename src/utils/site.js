// Fonctions communes aux gabarits.
import { getCollection } from 'astro:content'
import kebabCase from 'lodash/kebabCase.js'
import slugHandler, { slugFromFile } from './slugHandler.js'
import { prefix } from './languages.mjs'

export { kebabCase, prefix }

export const SITE_URL = 'https://www.msbytes.com'
export const SITE_TITLE = 'MSB'
export const SITE_DESCRIPTION = 'Most Significant Bytes - Network Neat Work'

// Toutes les pages de contenu, avec leur adresse (fields.slug sous Gatsby).
let cache
export const getPages = async () => {
    if (!cache) {
        const entries = await getCollection('pages')
        cache = entries.map((entry) => {
            const { language, templateKey } = entry.data
            const slug = entry.data.slug || slugFromFile(entry.id + '.md')
            return { ...entry, path: slugHandler(language, templateKey, slug) }
        })
    }
    return cache
}

// Articles d'une langue, du plus récent au plus ancien.
export const getPosts = async (language) =>
    (await getPages())
        .filter((page) => page.data.templateKey === 'blog-post' && page.data.language === language)
        .sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0))

export const tagPath = (language, tag) => prefix(language) + '/tags/' + kebabCase(tag) + '/'

// Dates affichées comme sous Gatsby : « June 15, 2022 » et « 15 juin 2022 » (UTC).
const MONTHS = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
}
export const formatDate = (date, language) => {
    if (!date) return ''
    const d = date.getUTCDate()
    const m = date.getUTCMonth()
    const y = date.getUTCFullYear()
    if (language === 'fr') return `${d} ${MONTHS.fr[m]} ${y}`
    return `${MONTHS.en[m]} ${String(d).padStart(2, '0')}, ${y}`
}

// Médias du back-office : « /img/x.jpg » dans le frontmatter → image de src/assets/img (optimisée).
const MEDIA = import.meta.glob('/src/assets/img/*.{jpg,jpeg,png,gif,webp,avif,svg}', { eager: true, import: 'default' })
export const media = (value) => {
    if (!value) return null
    if (typeof value !== 'string') return value
    const image = MEDIA['/src/assets/img/' + value.replace(/^\/?img\//, '')]
    if (!image) throw new Error(`Image introuvable dans src/assets/img : ${value}`)
    return image
}
