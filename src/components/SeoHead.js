import { withPrefix } from "gatsby";
import useSiteMetadata from "./SiteMetadata";

const SITE_URL = "https://www.msbytes.com";

const HREFLANG_EN = ["en", "en-AU", "en-BZ", "en-CA", "en-CB", "en-GB", "en-IE", "en-JM", "en-NZ", "en-PH", "en-TT", "en-US", "en-ZA", "en-ZW"];
const HREFLANG_FR = ["fr", "fr-BE", "fr-CA", "fr-CH", "fr-FR", "fr-LU", "fr-MC"];

// Balises <head> communes à toutes les pages (API Head de Gatsby, remplace react-helmet).
// La langue de <html> est fixée par gatsby-ssr.js (pré-rendu) et gatsby-browser.js
// (navigation côté client).
// `path` est le chemin de la page (ex. "/en/activities/"), `language` vaut "fr" ou "en".
const SeoHead = ({ language = "fr", path = "/", title, description, children }) => {
    const siteMetadata = useSiteMetadata();
    const pageTitle = title || siteMetadata.title;
    const pageDescription = description || siteMetadata.description;

    const canonicalURL = SITE_URL + path;
    const pathFR = language === "fr" ? path : path.replace("/" + language, "");
    const alternateURLEN = SITE_URL + "/en" + pathFR;
    const alternateURLFR = SITE_URL + pathFR;

    return (
        <>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />

            <link rel="canonical" href={canonicalURL} />
            {HREFLANG_EN.map((hreflang) => (
                <link key={hreflang} rel="alternate" href={alternateURLEN} hrefLang={hreflang} />
            ))}
            {HREFLANG_FR.map((hreflang) => (
                <link key={hreflang} rel="alternate" href={alternateURLFR} hrefLang={hreflang} />
            ))}

            <link rel="apple-touch-icon" sizes="180x180" href={`${withPrefix("/")}img/apple-touch-icon.png`} />
            <link rel="icon" type="image/png" href={`${withPrefix("/")}img/favicon-32x32.png`} sizes="32x32" />
            <link rel="icon" type="image/png" href={`${withPrefix("/")}img/favicon-16x16.png`} sizes="16x16" />
            <link rel="mask-icon" href={`${withPrefix("/")}img/safari-pinned-tab.svg`} color="#ff4400" />
            <meta name="theme-color" content="#fff" />

            <meta property="og:type" content="business.business" />
            <meta property="og:title" content={siteMetadata.title} />
            <meta property="og:url" content="/" />
            <meta property="og:image" content={`${withPrefix("/")}img/og-image.png`} />
            {children}
        </>
    );
};

export default SeoHead;
