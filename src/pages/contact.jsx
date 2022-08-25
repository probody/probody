import React from "react";
import Head from "next/head.js";
import {TITLE_POSTFIX} from "../helpers/constants.js";
import Breadcrumbs from "../components/kit/Breadcrumbs.jsx";
import {GlobalContext} from "../contexts/Global.js";
import ContactUs from "../components/ContactUs";

export default class ContactPage extends React.Component {
    static contextType = GlobalContext

    render() {
        const {t, isMobile} = this.context

        return <>
            <Head>
                <title>{t('contacts')}{TITLE_POSTFIX}</title>
            </Head>

            <Breadcrumbs items={[{
                name: t('mainPage'), href: '/',
            }, {
                name: t('contacts'), href: '/contact',
            }]}/>

            <div style={{marginTop: isMobile ? 16 : 48}}>
            <ContactUs single={true} />
            </div>
        </>
    }
}
