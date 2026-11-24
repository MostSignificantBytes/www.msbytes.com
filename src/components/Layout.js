import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import slugHandler from "../utils/slugHandler";
import "./all.sass";

// La langue et le chemin de la page sont lus dans les props du gabarit enfant
// (language, slug du frontmatter). Les pages sans frontmatter (404, pages de tag)
// les transmettent directement à Layout (props language et path).
const TemplateWrapper = ({ children, language, path }) => {
    const pageLanguage = language || (children.props && children.props.language) || "fr";

    let pagePath = path;
    if (!pagePath) {
        pagePath = children.props && children.props.slug
            ? slugHandler(pageLanguage, null, children.props.slug)
            : "/";
    }

    return (
        <div>
            <Navbar language={pageLanguage} slug={pagePath}/>
            <div>{children}</div>
            <Footer language={pageLanguage}/>
        </div>
    );
};

export default TemplateWrapper;
