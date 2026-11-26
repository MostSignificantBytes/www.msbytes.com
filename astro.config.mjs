// Configuration Astro du site www.msbytes.com (site statique, français à la racine, anglais sous /en/).
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import { unified } from '@astrojs/markdown-remark'
import { remarkExcerpt, remarkMediaPaths } from './src/utils/remark.mjs'
import { LANGUAGES, DEFAULT_LANGUAGE } from './src/utils/languages.mjs'

export default defineConfig({
    site: 'https://www.msbytes.com',
    output: 'static',
    // URL terminées par « / », comme sous Gatsby (dossier/index.html)
    trailingSlash: 'always',
    build: { format: 'directory' },
    // Styles des composants limités par une classe (.astro-xxxx), plus courte qu'un attribut
    scopedStyleStrategy: 'class',
    // Liste des langues centralisée (src/utils/languages.mjs) ; les chemins sont calculés par slugHandler
    i18n: {
        locales: LANGUAGES,
        defaultLocale: DEFAULT_LANGUAGE,
        routing: { prefixDefaultLocale: false },
    },
    // Politique de sécurité du contenu (CSP) : balise <meta> ajoutée à chaque page par Astro, avec les
    // empreintes (sha256) des scripts et styles qu'il produit. Seul service extérieur autorisé : Google
    // reCAPTCHA (page Contact). Styles en attribut (images) autorisés. Le back-office (public/admin/)
    // n'est pas une page Astro : il n'est pas concerné.
    security: {
        csp: {
            directives: [
                "default-src 'self'",
                "img-src 'self' data:",
                "font-src 'self'",
                "connect-src 'self'",
                // reCAPTCHA ; app.netlify.com : barre d'outils ajoutée par Netlify aux aperçus et à la recette
                'frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/ https://app.netlify.com',
                "form-action 'self'",
                "base-uri 'self'",
                "object-src 'none'",
            ],
            scriptDirective: {
                resources: ["'self'", 'https://www.google.com/recaptcha/', 'https://www.gstatic.com/recaptcha/'],
            },
            styleDirective: {
                resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }],
            },
        },
    },
    integrations: [
        sitemap({
            // Pages techniques exclues, comme avec @netlify/plugin-sitemap
            filter: (page) => !/\/(admin|404)\//.test(page),
        }),
    ],
    markdown: {
        // Rendu Markdown par remark/rehype (comme gatsby-transformer-remark) :
        // pas de typographie automatique (guillemets, tirets), pas de coloration syntaxique.
        processor: unified({
            gfm: true,
            smartypants: false,
            remarkPlugins: [remarkExcerpt, remarkMediaPaths],
        }),
        syntaxHighlight: false,
    },
})
