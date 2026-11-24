import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import PropTypes from "prop-types";
import { graphql, navigate } from "gatsby";

import Layout from "../components/Layout";
import SeoHead from "../components/SeoHead";

// Clé de site reCAPTCHA v2 (« case à cocher ») : variable d'environnement lue au build.
// Sur Netlify : GATSBY_SITE_RECAPTCHA_KEY ; en local : fichier .env.development (non versionné).
const RECAPTCHA_SITE_KEY = process.env.GATSBY_SITE_RECAPTCHA_KEY;

// eslint-disable-next-line
export const ContactPageTemplate = ({
    language,
    slug,
    title,
    name,
    email,
    message,
    send,
    error,
    privacy,
    hasError,
    token,
    handleSubmit,
    handleChange,
    handleReCAPTCHA,
}) => {
    return (
        <section className="section">
            <div className="container">
                <div className="content">
                    <h1>{title}</h1>
                    <form
                        name="contact"
                        method="post"
                        action={(language === 'fr' ? '' : '/' + language) + "/contact/thanks/"}
                        data-netlify="true"
                        data-netlify-honeypot="bot-field"
                        data-netlify-recaptcha="true"
                        onSubmit={handleSubmit}
                    >
                        {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
                        <input type="hidden" name="form-name" value="contact" />
                        <div hidden>
                            <label>
                                Don’t fill this out:{" "}
                                <input name="bot-field" onChange={handleChange} />
                            </label>
                        </div>
                        <div className="field">
                            <label className="label" htmlFor={"name"}>
                                {name}
                            </label>
                            <div className="control">
                                <input
                                    className="input"
                                    type={"text"}
                                    name={"name"}
                                    onChange={handleChange}
                                    id={"name"}
                                    required={true}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label" htmlFor={"email"}>
                                {email}
                            </label>
                            <div className="control">
                                <input
                                    className="input"
                                    type={"email"}
                                    name={"email"}
                                    onChange={handleChange}
                                    id={"email"}
                                    required={true}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label" htmlFor={"message"}>
                                {message}
                            </label>
                            <div className="control">
                                <textarea
                                    className="textarea"
                                    name={"message"}
                                    onChange={handleChange}
                                    id={"message"}
                                    required={true}
                                />
                            </div>
                        </div>
                        {RECAPTCHA_SITE_KEY ? (
                            <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleReCAPTCHA} />
                        ) : null}
                        {hasError ? (
                            <p className="help is-danger" role="alert">{error}</p>
                        ) : null}
                        <p className="help">{privacy}</p>
                        <div className="field">
                            <button className="button is-link" type="submit" disabled={!token}>
                                {send}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

ContactPageTemplate.propTypes = {
    language: PropTypes.string,
    slug: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    message: PropTypes.string,
    send: PropTypes.string,
    error: PropTypes.string,
    privacy: PropTypes.string,
    hasError: PropTypes.bool,
    token: PropTypes.string,
    handleSubmit: PropTypes.func,
    handleChange: PropTypes.func,
    handleReCAPTCHA: PropTypes.func,
};

function encode(data) {
    return Object.keys(data)
        .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");
}

class ContactPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { fields: {}, token: null, hasError: false };
        this.frontmatter = this.props.data.markdownRemark.frontmatter;
    };

    handleChange = (e) => {
        this.setState({ fields: { ...this.state.fields, [e.target.name]: e.target.value } });
    };

    // Jeton reCAPTCHA (null lorsqu'il expire) : le bouton « Envoyer » n'est actif qu'avec un jeton valide.
    handleReCAPTCHA = (token) => {
        this.setState({ token: token || null });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        this.setState({ hasError: false });
        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encode({
                "form-name": form.getAttribute("name"),
                ...this.state.fields,
                "g-recaptcha-response": this.state.token,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                navigate(form.getAttribute("action"));
            })
            .catch(() => this.setState({ hasError: true }));
    };

    render() {
        return (
            <Layout path={this.props.pageContext.slug}>
                <ContactPageTemplate
                    language={this.frontmatter.language}
                    slug={this.frontmatter.slug}
                    title={this.frontmatter.title}
                    name={this.frontmatter.name}
                    email={this.frontmatter.email}
                    message={this.frontmatter.message}
                    send={this.frontmatter.send}
                    error={this.frontmatter.error}
                    privacy={this.frontmatter.privacy}
                    hasError={this.state.hasError}
                    token={this.state.token}
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    handleReCAPTCHA={this.handleReCAPTCHA}
                />
            </Layout>
        );
    };
};

export default ContactPage;

ContactPage.propTypes = {
    data: PropTypes.shape({
        markdownRemark: PropTypes.shape({
            frontmatter: PropTypes.object,
            language: PropTypes.string,
        }),
    }),
};

export const pageQuery = graphql`
    query ContactPageTemplate($language: String!) {
        markdownRemark(
            frontmatter: {
                templateKey: { eq: "contact-page" }
                language: { eq: $language}
            }
        ) {
            frontmatter {
                language
                slug
                title
                name
                email
                message
                send
                error
                privacy
            }
        }
    }
`;

export const Head = ({ pageContext }) => (
    <SeoHead language={pageContext.language} path={pageContext.slug} />
);
