import PropTypes from "prop-types";
import { kebabCase } from "lodash";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import SeoHead from "../components/SeoHead";
import Content, { HTMLContent } from "../components/Content";

// eslint-disable-next-line
export const BlogPostTemplate = ({
    content,
    contentComponent,
    description,
    tags,
    title,
    language,
    slug,
}) => {
    const PostContent = contentComponent || Content;

    return (
        <section className="section">
            <div className="container content">
                <div className="columns">
                    <div className="column is-10 is-offset-1">
                        <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
                            {title}
                        </h1>
                        <p>{description}</p>
                        <PostContent content={content} />
                        {tags && tags.length ? (
                            <div style={{ marginTop: `4rem` }}>
                                <h4>Tags</h4>
                                <ul className="taglist">
                                    {tags.map((tag) => (
                                        <li key={tag + `tag`}>
                                            <Link to={(language === 'fr' ? '' : '/' + language) + "/tags/" + kebabCase(tag) + "/"}>{tag}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
};

BlogPostTemplate.propTypes = {
    content: PropTypes.node.isRequired,
    contentComponent: PropTypes.func,
    description: PropTypes.string,
    title: PropTypes.string,
    language: PropTypes.string,
    slug: PropTypes.string,
};

const BlogPost = ({ data, pageContext }) => {
    const { markdownRemark: post } = data;

    return (
        <Layout path={pageContext.slug}>
            <BlogPostTemplate
                content={post.html}
                contentComponent={HTMLContent}
                description={post.frontmatter.description}
                tags={post.frontmatter.tags}
                title={post.frontmatter.title}
                language={post.frontmatter.language}
                slug={post.frontmatter.slug}
            />
        </Layout>
    );
};

BlogPost.propTypes = {
    data: PropTypes.shape({
        markdownRemark: PropTypes.object,
    }),
};

export default BlogPost;

export const pageQuery = graphql`
    query BlogPostByID($id: String!, $language: String!) {
        markdownRemark(id: { eq: $id }) {
            id
            html
            frontmatter {
                date(formatString: "MMMM DD, YYYY", locale: $language)
                title
                description
                tags
                language
                slug
            }
        }
    }
`;

export const Head = ({ data, pageContext }) => (
    <SeoHead
        language={pageContext.language}
        path={pageContext.slug}
        title={`${data.markdownRemark.frontmatter.title} | Blog`}
        description={`${data.markdownRemark.frontmatter.description}`}
    />
);
