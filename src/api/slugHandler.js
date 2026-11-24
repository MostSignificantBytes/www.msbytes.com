// Calcul du chemin d'une page à partir du frontmatter (syntaxe CommonJS :
// fonction utilisée à la fois par gatsby-node.js et par les composants).
// Exemples : ("fr", "+") → "/" ; ("en", "+blog+2022-06-15-osi-model") → "/en/blog/2022-06-15-osi-model/".
// Les segments ne sont pas normalisés (pas de kebabCase) : les URL publiées restent inchangées.
const slugHandler = (language, templateKey, slug) => {
    let slugHandled = slug.split('+').join('/');

    if (slugHandled !== '/') {
        slugHandled = slugHandled + '/';
    }

    if (language !== 'fr') {
        slugHandled = '/' + language + slugHandled;
    }

    return slugHandled;
};

module.exports = slugHandler;
