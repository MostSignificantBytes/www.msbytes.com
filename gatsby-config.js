module.exports = {
    siteMetadata: {
        title: "MSB",
        description: "Most Significant Bytes - Network Neat Work",
    },
    // En-têtes HTTP appliqués par l'adaptateur Netlify (remplace le fichier _headers)
    headers: [
        {
            source: "/static/*",
            headers: [
                { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            ],
        },
        {
            source: "/*",
            headers: [
                { key: "Strict-Transport-Security", value: "max-age=31536000" },
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "X-Frame-Options", value: "DENY" },
            ],
        },
    ],
    plugins: [
        {
            resolve: "gatsby-plugin-sass",
            options: {
                sassOptions: {
                    indentedSyntax: true,
                },
            },
        },
        {
            // keep as first gatsby-source-filesystem plugin for gatsby image support
            resolve: "gatsby-source-filesystem",
            options: {
                path: `${__dirname}/static/img`,
                name: "uploads",
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `${__dirname}/src/pages`,
                name: "pages",
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `${__dirname}/src/img`,
                name: "images",
            },
        },
        `gatsby-plugin-image`,
        "gatsby-plugin-sharp",
        "gatsby-transformer-sharp",
        {
            resolve: "gatsby-transformer-remark",
            options: {
                plugins: [
                    {
                        // v2 : convertit aussi les images du frontmatter (fmImagesToRelative supprimé)
                        resolve: "gatsby-remark-relative-images",
                        options: {
                            staticFolderName: "static",
                        },
                    },
                    {
                        resolve: "gatsby-remark-images",
                        options: {
                            // It's important to specify the maxWidth (in pixels) of
                            // the content container as this plugin uses this as the
                            // base for generating different widths of each image.
                            maxWidth: 2048,
                            // Avec gatsby-remark-relative-images 2.x, les images du corps des
                            // articles sont désormais optimisées : pas de lien vers l'original,
                            // comme avec la version Gatsby 4.
                            linkImagesToOriginal: false,
                        },
                    },
                    {
                        resolve: "gatsby-remark-copy-linked-files",
                        options: {
                            destinationDir: "static",
                        },
                    },
                ],
            },
        },
        {
            resolve: "gatsby-plugin-decap-cms",
            options: {
                modulePath: `${__dirname}/src/cms/cms.js`,
                // React 19 ne fournit plus de fichiers UMD : gatsby-plugin-decap-cms 4.0.4
                // chargeait React, ReactDOM et Decap CMS en scripts externes (UMD).
                // On les intègre au bundle /admin/cms.js ; seul le widget Netlify Identity
                // reste un script externe.
                customizeWebpackConfig: (config) => {
                    const bundled = ["react", "react-dom", "decap-cms-app"];
                    config.externals = config.externals.filter(
                        (external) => !bundled.some((name) => name in external)
                    );
                    config.plugins = config.plugins.map((plugin) => {
                        const name = plugin && plugin.constructor && plugin.constructor.name;
                        if (name === "CopyPlugin") {
                            plugin.patterns = plugin.patterns.filter(
                                (pattern) => !bundled.some((pkg) => pattern.from.includes(`/node_modules/${pkg}/`))
                            );
                        }
                        if (name === "HtmlWebpackTagsPlugin") {
                            return new plugin.constructor({
                                tags: plugin.options.scripts
                                    .map((script) => script.path)
                                    .filter((path) => path === "netlify-identity.js"),
                                append: false,
                            });
                        }
                        return plugin;
                    });
                },
            },
        },
        {
            resolve: 'gatsby-plugin-robots-txt',
            options: {
                host: 'https://www.msbytes.com',
                sitemap: 'https://www.msbytes.com/sitemap.xml',
                policy: [{userAgent: '*', allow: '/'}]
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `MSB`,
                short_name: `MSB`,
                start_url: `/`,
                background_color: `#ffffff`,
                theme_color: `#003399`,
                display: `standalone`,
                icons: [
                    {
                        src: `img/maskable_icon_x48.png`,
                        sizes: `48x48`,
                        type: `image/png`,
                        purpose: `any maskable`,
                    },
                    {
                        src: `img/maskable_icon_x72.png`,
                        sizes: `72x72`,
                        type: `image/png`,
                        purpose: `any maskable`,
                    },
                    {
                        src: `img/maskable_icon_x96.png`,
                        sizes: `96x96`,
                        type: `image/png`,
                        purpose: `any maskable`,
                    },
                    {
                        src: `img/maskable_icon_x128.png`,
                        sizes: `128x128`,
                        type: `image/png`,
                        purpose: `any maskable`,
                    },
                    {
                        src: `img/maskable_icon_x192.png`,
                        sizes: `192x192`,
                        type: `image/png`,
                        purpose: `any maskable`,
                    },
                    {
                        src: `img/maskable_icon_x384.png`,
                        sizes: `384x384`,
                        type: `image/png`,
                        purpose: `any maskable`,
                    },
                    {
                        src: `img/maskable_icon_x512.png`,
                        sizes: `512x512`,
                        type: `image/png`,
                        purpose: `any maskable`,
                    },
                ],
            },
        },
        `gatsby-plugin-offline`,
        {
            resolve: "gatsby-plugin-purgecss", // purges all unused/unreferenced css rules
            options: {
                develop: true, // Activates purging in npm run develop
                purgeOnly: ["/all.sass"], // applies purging only on the bulma css file
            },
        }, // must be after other CSS plugins
        // gatsby-plugin-netlify retiré : sur Netlify, Gatsby 5.12+ installe et utilise
        // automatiquement l'adaptateur gatsby-adapter-netlify.
    ],
};
