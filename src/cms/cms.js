import CMS from 'decap-cms-app'

import AboutPagePreview from './preview-templates/AboutPagePreview'
import BlogPostPreview from './preview-templates/BlogPostPreview'
import ProductPagePreview from './preview-templates/ProductPagePreview'
import IndexPagePreview from './preview-templates/IndexPagePreview'
import ThanksPagePreview from './preview-templates/ThanksPagePreview'

// Initialisation manuelle (option manualInit de gatsby-plugin-decap-cms) : la configuration
// est lue dans static/admin/config.yml ; seule la branche de travail est adaptée.
// Sur l'adresse de recette (recette--<site>.netlify.app), les brouillons visent la branche
// « recette » afin de recetter le back-office sans toucher à la production (correction C12).
const host = window.location.hostname
const branch = host.startsWith('recette--') ? 'recette' : 'master'
CMS.init({ config: { backend: { branch } } })

// Aperçus enregistrés sous les noms réels des fichiers et collections de config.yml (C08)
const previews = {
    index: IndexPagePreview,
    activities: ProductPagePreview,
    about: AboutPagePreview,
    story: AboutPagePreview,
    legal: AboutPagePreview,
    thanks: ThanksPagePreview,
    blog: BlogPostPreview,
}
Object.entries(previews).forEach(([name, Preview]) => {
    ;['FR', 'EN'].forEach((lang) => CMS.registerPreviewTemplate(name + lang, Preview))
})
