import * as React from "react";

import Layout from "../components/Layout";
import SeoHead from "../components/SeoHead";

const NotFoundPage = () => (
    <Layout>
        <div>
            <h1 className="has-text-centered is-size-1">404</h1>
            <div className="columns is-size-1">
                <div className="column"></div>
                <div className="column">
                    <img src="/img/404.jpg" alt="404" />
                </div>
                <div className="column"></div>
            </div>
        </div>
    </Layout>
);

export default NotFoundPage;

export const Head = () => <SeoHead language="fr" path="/" />;
