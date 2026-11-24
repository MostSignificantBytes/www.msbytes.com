import * as React from "react";
import { kebabCase } from "lodash";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "./all.sass";

const TemplateWrapper = ({ children }) => {
    var language = children.props.language;
    if(!language) {
        language = 'fr'
    }

    var slug;
    if (children.props.slug) {

        slug = children.props.slug;

        var slugParts = slug.split('+');
        var slugHandled;

        slugParts.forEach((slugPart) => {
            slugPart = kebabCase(slugPart);
        })
        
        slugHandled = slugParts.join('/');

        if (slugHandled !== '/') {
            slugHandled = slugHandled + '/';
        }

        if (language !== 'fr') {
            slugHandled = '/' + language + slugHandled;
        }

        slug = slugHandled;

    } else if (!slug && children._owner) {

        slug = children._owner.key;

    } else if(!slug) {

        slug = '/';

    }

    return (
        <div>
            <Navbar language={language} slug={slug}/>
            <div>{children}</div>
            <Footer language={language}/>
        </div>
    );
};

export default TemplateWrapper;
