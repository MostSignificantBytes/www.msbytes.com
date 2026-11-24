// Langue du document <html> lors de la navigation côté client
// (le pré-rendu est traité par gatsby-ssr.js) : anglais sous /en/, français ailleurs.
exports.onRouteUpdate = ({ location }) => {
    const pathname = location.pathname;
    document.documentElement.lang = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
};
