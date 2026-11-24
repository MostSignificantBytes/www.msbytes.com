// Langue du document <html> pré-rendu (remplace <Helmet><html lang /></Helmet>) :
// le français est servi à la racine, l'anglais sous /en/.
exports.onRenderBody = ({ pathname, setHtmlAttributes }) => {
    const language = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
    setHtmlAttributes({ lang: language });
};
