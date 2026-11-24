import * as React from "react";
import { Link, graphql } from "gatsby";
import Layout from "../components/Layout";
import SeoHead from "../components/SeoHead";

// Libellés de la page de tag, par langue
const labels = {
    fr: {
        header: (count, tag) => `${count} article${count > 1 ? "s" : ""} avec le tag « ${tag} »`,
        allTags: "Voir tous les tags",
    },
    en: {
        header: (count, tag) => `${count} post${count === 1 ? "" : "s"} tagged with “${tag}”`,
        allTags: "Browse all tags",
    },
};

class TagRoute extends React.Component {
    render() {
        const posts = this.props.data.allMarkdownRemark.edges;
        const postLinks = posts.map((post) => (
            <li key={post.node.fields.slug}>
                <Link to={post.node.fields.slug}>
                    <h2 className="is-size-2">{post.node.frontmatter.title}</h2>
                </Link>
            </li>
        ));
        const { tag, language } = this.props.pageContext;
        const text = labels[language] || labels.fr;
        const totalCount = this.props.data.allMarkdownRemark.totalCount;
        const tagHeader = text.header(totalCount, tag);

        return (
            <Layout language={language} path={this.props.pageContext.slug}>
                <section className="section">
                    <div className="container content">
                        <div className="columns">
                            <div
                                className="column is-10 is-offset-1"
                                style={{ marginBottom: "6rem" }}
                            >
                                <h3 className="title is-size-4 is-bold-light">{tagHeader}</h3>
                                <ul className="taglist">{postLinks}</ul>
                                <p>
                                    <Link to={(language === "fr" ? "" : "/" + language) + "/tags/"}>{text.allTags}</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        );
    }
}

export default TagRoute;

export const tagPageQuery = graphql`query TagPage($tag: String, $language: String) {
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(
    limit: 1000
    sort: {frontmatter: {date: DESC}}
    filter: {frontmatter: {tags: {in: [$tag]}, language: {eq: $language}}}
  ) {
    totalCount
    edges {
      node {
        fields {
          slug
        }
        frontmatter {
          title
        }
      }
    }
  }
}`;

export const Head = ({ data, pageContext }) => (
    <SeoHead
        language={pageContext.language}
        path={pageContext.slug}
        title={`${pageContext.tag} | ${data.site.siteMetadata.title}`}
    />
);
