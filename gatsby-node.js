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
            const slug = slugHandler(
                language,
                templateKey,
                edge.node.frontmatter.slug
            )
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

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions
    if (node.internal.type === `MarkdownRemark`) {
        createNodeField({
            name: `slug`,
            node,
            value: slugHandler(
                node.frontmatter.language,
                node.frontmatter.templateKey,
                node.frontmatter.slug
            ),
        })
    }
}
