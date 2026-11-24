const _ = require('lodash')
const path = require('path')
const slugHandler = require('./src/utils/slugHandler')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ actions, graphql }) => {
    const { createPage, createRedirect } = actions

    return graphql(`
        {
            allMarkdownRemark(limit: 1000) {
                edges {
                    node {
                        id
                        fields {
                            slug
                        }
                        frontmatter {
                            slug
                            language
                            tags
                            templateKey
                        }
                    }
                }
            }
        }
    `).then((result) => {
        if (result.errors) {
            result.errors.forEach((e) => console.error(e.toString()))
            return Promise.reject(result.errors)
        }

        const posts = result.data.allMarkdownRemark.edges
        posts.forEach((edge) => {
            const id = edge.node.id
            const language = edge.node.frontmatter.language
            const templateKey = edge.node.frontmatter.templateKey
            // Chemin calculé dans onCreateNode (slug du frontmatter, ou emplacement du fichier)
            const slug = edge.node.fields.slug
            createPage({
                path: slug,
                tags: edge.node.frontmatter.tags,
                component: path.resolve(
                    `src/templates/${String(templateKey)}.js`
                ),
                // additional data can be passed via context
                context: {
                    id,
                    language,
                    templateKey,
                    slug,
                },
            })
        })

        // Tag pages: tags collected per language, without duplicates
        const tags = {}
        posts.forEach((edge) => {
            if (_.get(edge, `node.frontmatter.tags`)) {
                const language = _.get(edge, `node.frontmatter.language`)
                tags[language] = (tags[language] || []).concat(edge.node.frontmatter.tags)
            }
        })
        const locales = Object.keys(tags)
        locales.forEach((locale) => {
            tags[locale] = _.uniq(tags[locale])
        })

        // Make tag pages
        locales.forEach((locale) => {
            tags[locale].forEach((localizedTag) => {
                const tagPath = (locale === 'fr' ? '' : '/' + locale) + '/tags/' + _.kebabCase(localizedTag) + '/'

                createPage({
                    path: tagPath,
                    component: path.resolve(`src/templates/tag-page.js`),
                    context: {
                        tag: localizedTag,
                        language: locale,
                        slug: tagPath,
                    },
                })
            })
        })
    })
}

// Chemin « + » déduit de l'emplacement du fichier lorsque le frontmatter n'a pas de slug
// (cas d'un article créé par le back-office, correction C05) :
// src/pages/fr/blog/2026-12-01-x.md → "+blog+2026-12-01-x" ; src/pages/en/index.md → "+".
const slugFromFile = (relativePath) => {
    const parts = relativePath.replace(/\.md$/, '').split('/').slice(1) // retire le dossier de langue
    if (parts[parts.length - 1] === 'index') parts.pop()
    return '+' + parts.join('+')
}

exports.onCreateNode = ({ node, actions, getNode, reporter }) => {
    const { createNodeField } = actions
    if (node.internal.type === `MarkdownRemark`) {
        const file = getNode(node.parent)
        const where = file && file.relativePath ? file.relativePath : node.id
        const { language, templateKey } = node.frontmatter
        if (!language) {
            reporter.panicOnBuild(
                `Le fichier ${where} n'a pas de champ « language » (fr ou en) dans son en-tête : la page ne peut pas être générée.`
            )
            return
        }
        const slug = node.frontmatter.slug || (file && file.relativePath ? slugFromFile(file.relativePath) : null)
        if (!slug) {
            reporter.panicOnBuild(`Impossible de déterminer le chemin du fichier ${where} (champ « slug » absent).`)
            return
        }
        createNodeField({
            name: `slug`,
            node,
            value: slugHandler(language, templateKey, slug),
        })
    }
}
