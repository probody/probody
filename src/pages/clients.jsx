import React from "react";
import {GlobalContext} from "../contexts/Global.js";
import css from '../styles/pages/clients.module.scss'
import ContactUs from "../components/ContactUs.jsx";
import {cnb} from "cnbuilder";
import Link from "next/link.js";
import Button from "../components/kit/Button.jsx";
import InfoTabPanels from "../components/InfoTabPanels.jsx";
import {withRouter} from "next/router.js";
import Head from "next/head.js";
import {TITLE_POSTFIX} from "../helpers/constants.js";
import Breadcrumbs from "../components/kit/Breadcrumbs.jsx";

class ClientsPage extends React.Component {
    static contextType = GlobalContext

    render() {
        const {t, isMobile, theme} = this.context

        return <div className={css['theme--' + theme]}>
            <Head>
                <title>{t('forVisitors')}{TITLE_POSTFIX}</title>
            </Head>

            <Breadcrumbs items={[{
                name: t('mainPage'), href: '/',
            }, {
                name: t('forVisitors'), href: '/clients',
            }]}/>

            <div bp={'grid'} className={'responsive-content'} style={{marginTop: isMobile ? 16 : 48}}>
                <div bp={'12 5@md'}>
                    <h1 className={'text-xl'}>{t('findUniqueSalons')}</h1>
                    <p className={cnb(css.caption, css.jumbotronText, 'smallOnMobile')}>{t('useAllOpportunities')}</p>
                    <Link href='/'><Button size={'large'}>{t('chooseServices')}</Button></Link>
                </div>

                <div bp={'12 7@md'} className={css.img1}>
                    &nbsp;
                </div>
            </div>

            <div style={{marginTop: isMobile ? 16 : 120}}>
                <InfoTabPanels title={t('howToUsePlatform')} buttonText={t('searchSalons')} onActionClick={() => this.props.router.push('/')} tabs={[
                    {
                        pic: '/illustrations/clients.tab1.svg',
                        title: t('convenientSearch'),
                        shortTitle: t('useSearch'),
                        text: t('convenientSearchDescr')
                    },
                    {
                        pic: '/illustrations/clients.tab2.svg',
                        title: t('convenientFilter'),
                        shortTitle: t('filterResults'),
                        text: t('convenientFilterDescr')
                    },
                    {
                        pic: '/illustrations/clients.tab3.svg',
                        title: t('letYourselfThink'),
                        shortTitle: t('discoverSalons'),
                        text: t('discoverSalonsDescr')
                    },
                    {
                        pic: '/illustrations/clients.tab4.svg',
                        title: t('leaveReviews'),
                        shortTitle: t('leaveReviews'),
                        text: t('leaveReviewsDescr')
                    },
                ]} />
            </div>

            <div style={{marginTop: isMobile ? 64 : 96}}>
                <ContactUs single={false}/>
            </div>
        </div>
    }
}

export default withRouter(ClientsPage)
