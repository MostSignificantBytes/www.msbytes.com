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
    // Liste des langues centralisée (src/utils/languages.mjs) ; les chemins sont calculés par slugHandler
    i18n: {
        locales: LANGUAGES,
        defaultLocale: DEFAULT_LANGUAGE,
        routing: { prefixDefaultLocale: false },
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
    vite: {
        css: {
            preprocessorOptions: {
                sass: {
                    // Bulma 0.9.4 utilise @import et la division « / » : avertissements Dart Sass masqués
                    quietDeps: true,
                    silenceDeprecations: ['import', 'slash-div', 'global-builtin', 'color-functions', 'if-function'],
                },
            },
        },
    },
})
