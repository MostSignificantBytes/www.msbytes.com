// Contenus du site : fichiers Markdown de src/content/<langue>/ (modifiés par le back-office).
// Le schéma est vérifié au build : un fichier invalide arrête la génération avec un message explicite.
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { LANGUAGES } from './utils/languages.mjs'

const TEMPLATES = [
    'index-page', 'product-page', 'about-page', 'blog-page', 'blog-post',
    'contact-page', 'thanks-page', 'tags-page',
]

const pages = defineCollection({
    // Identifiant = chemin du fichier sans extension (ex. « fr/blog/2022-06-15-osi-model »)
    loader: glob({
        pattern: '**/*.md',
        base: './src/content',
        generateId: ({ entry }) => entry.replace(/\.md$/, ''),
    }),
    schema: z.looseObject({
        templateKey: z.enum(TEMPLATES, { error: 'champ « templateKey » absent ou inconnu' }),
        language: z.enum(LANGUAGES, { error: 'champ « language » absent ou inconnu (fr ou en)' }),
        slug: z.string().optional(),
        title: z.string().optional(),
        date: z.coerce.date().optional(),
        tags: z.array(z.string()).optional(),
    }),
})

export const collections = { pages }
