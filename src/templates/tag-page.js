import * as React from "react";
import { Link, graphql } from "gatsby";
import Layout from "../components/Layout";
import SeoHead from "../components/SeoHead";

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
        const tag = this.props.pageContext.tag;
        const title = this.props.data.site.siteMetadata.title;
        const totalCount = this.props.data.allMarkdownRemark.totalCount;
        const tagHeader = `${totalCount} post${
            totalCount === 1 ? "" : "s"
        } tagged with “${tag}”`;

        return (
            <Layout>
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
                                    <Link to="/tags/">Browse all tags</Link>
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

export const Head = ({ data, pageContext, location }) => (
    <SeoHead
        language={pageContext.language}
        path={location.pathname}
        title={`${pageContext.tag} | ${data.site.siteMetadata.title}`}
    />
);
