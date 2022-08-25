import '../styles/globals.scss'
import React from "react"

import MainLayout from "../layouts/MainLayout.jsx";

const layouts = {
    Main: MainLayout
}

class ProbodyApp extends React.Component {
    render() {
        const {Component: Page, pageProps} = this.props,
            Layout = layouts[Page.layout] || layouts.Main;

        return <Layout router={this.props.router}>
            <Page {...pageProps} />
        </Layout>
    }
}

export default React.memo(ProbodyApp)
