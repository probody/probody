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
import Image from "next/image";
import Icon from "../components/kit/Icon.jsx";

class ClientsPage extends React.Component {
    static contextType = GlobalContext

    render() {
        const {t, isMobile, theme} = this.context

        return <div className={css['theme--' + theme]}>
            <Head>
                <title>{t('salonAds')}{TITLE_POSTFIX}</title>
            </Head>

            <Breadcrumbs items={[{
                name: t('mainPage'), href: '/',
            }, {
                name: t('salonAds'), href: '/providers',
            }]}/>

            <div bp={'grid'} className={'responsive-content'} style={{marginTop: isMobile ? 16 : 48}}>
                <div bp={'12 5@md'}>
                    <h1 className={'text-xl'}>{t('weMakeSearchEasier')}</h1>
                    <p className={cnb(css.caption, css.jumbotronText, 'smallOnMobile')}>{t('coupleOfSimpleActions')}</p>
                    <Link href='/salon/new'><Button size={'large'}>{t('createYourSalon')}</Button></Link>
                </div>

                <div bp={'12 7@md'} className={css.img2}>
                    &nbsp;
                </div>
            </div>

            <div className="responsive-content">
                <div bp={'grid 12 4@md'} style={{margin: '80px 0 64px 0', gap: isMobile ? '38px 0' : '0 83px'}}>
                    <div>
                        <Image src={'/illustrations/providers.feature1.svg'} width={140} height={124}/>
                        <h2 style={{marginBottom: 12}}>{t('multilingualInterface')}</h2>
                        <p className={cnb(css.caption, 'smallOnMobile')}>{t('multilingualInterfaceDescr')}</p>
                    </div>

                    <div>
                        <Image src={'/illustrations/providers.feature2.svg'} width={140} height={124}/>
                        <h2 style={{marginBottom: 12}}>{t('watchStats')}</h2>
                        <p className={cnb(css.caption, 'smallOnMobile')}>{t('watchStatsDescr')}</p>
                    </div>

                    <div>
                        <Image src={'/illustrations/providers.feature3.svg'} width={140} height={124}/>
                        <h2 style={{marginBottom: 12}}>{t('roundclockSupport')}</h2>
                        <p className={cnb(css.caption, 'smallOnMobile')}>{t('roundclockSupportDescr')}</p>
                    </div>
                </div>

                <div style={{margin: isMobile ? '64px 0' : '96px 0'}}>
                    <h1 className={'bigger'} style={{marginBottom: isMobile ? 16 : 32}}>
                        {t('modernPlatform')}
                    </h1>

                    <div bp={'grid'} style={{gap: isMobile ? '16px 0' : '0 64px'}}>
                        <div bp={'12 5@md'} className={css.slCard}>
                            <h2>{t('youllReceiveGuestsFrom')}</h2>

                            <ul style={{margin: isMobile ? '16px 0 24px 0' : '24px 0 48px 0'}} className={css.iconList}>
                                <li>
                                    <Icon name={'tg_light'} />
                                    <span>{t('tg')}</span>
                                </li>
                                <li>
                                    <Icon name={'inst_light'} />
                                    <span>{t('instagram')}</span>
                                </li>
                                <li>
                                    <Icon name={'youtube'} />
                                    <span>{t('youtube')}</span>
                                </li>
                                <li>
                                    <Icon name={'google'} />
                                    <span>{t('google')}</span>
                                </li>
                                <li>
                                    <Icon name={'yandex'} />
                                    <span>{t('yandex')}</span>
                                </li>
                                <li>
                                    <Icon name={'user_cloud'} />
                                    <span>{t('clientBase')}</span>
                                </li>
                            </ul>

                            <Link href='/salon/new'><Button size={'large'}>{t('createYourSalon')}</Button></Link>
                        </div>
                        <div bp={'12 7@md first last@md'} className={css.img3}>
                            &nbsp;
                        </div>
                    </div>
                </div>
            </div>

            <div style={{marginTop: isMobile ? 16 : 120}}>
                <InfoTabPanels title={t('howToUsePlatform')} buttonText={t('createYourSalon')}
                               onActionClick={() => this.props.router.push('/salon/new')} tabs={[
                    {
                        pic: '/illustrations/providers.tab1.svg',
                        title: t('weDeclineEscort'),
                        shortTitle: t('finishRegister'),
                        text: t('declineEscortDescr')
                    },
                    {
                        pic: '/illustrations/providers.tab2.svg',
                        title: t('tellAboutYourself'),
                        shortTitle: t('fillSalonInfo'),
                        text: t('declineEscortDescr')
                    },
                    {
                        pic: '/illustrations/providers.tab3.svg',
                        title: t('advertYourself'),
                        shortTitle: t('goFurther'),
                        text: t('goFurtherDescr')
                    }
                ]}/>
            </div>

            <div style={{marginTop: isMobile ? 64 : 96}}>
                <ContactUs single={false}/>
            </div>
        </div>
    }
}

export default withRouter(ClientsPage)
