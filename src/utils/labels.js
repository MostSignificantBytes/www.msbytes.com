// Textes fixes de l'interface, par langue (hors contenus gérés par le back-office).
export default {
    fr: {
        tagHeader: (count, tag) => `${count} article${count > 1 ? 's' : ''} avec le tag « ${tag} »`,
        allTags: 'Voir tous les tags',
        tags: 'Tags',
    },
    en: {
        tagHeader: (count, tag) => `${count} post${count === 1 ? '' : 's'} tagged with “${tag}”`,
        allTags: 'Browse all tags',
        tags: 'Tags',
    },
}
