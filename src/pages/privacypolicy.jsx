import React from "react";
import Head from "next/head.js";
import {TITLE_POSTFIX} from "../helpers/constants.js";
import Breadcrumbs from "../components/kit/Breadcrumbs.jsx";
import {GlobalContext} from "../contexts/Global.js";
import InfoBlock from "../components/kit/InfoBlock";
import css from '../styles/pages/pp.module.scss'
import {cnb} from "cnbuilder";
import Icon from "../components/kit/Icon.jsx";
import Link from "next/link.js";

export default class PrivacyPolicyPage extends React.Component {
    static contextType = GlobalContext

    constructor(props) {
        super(props);

        this.state = {
            activeEl: 'section1'
        }

        this.handleScroll = this.handleScroll.bind(this)
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    handleScroll() {
        for (let i = 6; i >= 1; i--) {
            const selector = document.getElementById('section' + i)

            if (window.scrollY >= selector.offsetTop) {
                this.setState({activeEl: 'section' + i})
                break
            }
        }
    }

    render() {
        const {t, isMobile, theme} = this.context

        return <div className={css['theme--' + theme]}>
            <Head>
                <title>{t('privacyPolicy')}{TITLE_POSTFIX}</title>
            </Head>

            <Breadcrumbs items={[{
                name: t('mainPage'), href: '/',
            }, {
                name: t('privacyPolicy'), href: '/privacypolicy',
            }]}/>

            <div className={'relative responsive-content'}>
                <div bp={'grid'} style={{gap: isMobile ? '40px 0' : 32, marginTop: isMobile ? 0 : 28}}>
                    <div bp={'12 4@md'}>
                        {isMobile && <h1 style={{marginBottom: 24, fontSize: 24}}>{t('pp_full')}</h1>}
                        <InfoBlock style={{padding: 0}} rootStyle={{top: 16, position: isMobile ? 'static' : 'sticky'}}>
                            <div className={cnb(css.legend)}>
                                <div className={this.state.activeEl === 'section1' ? css.active : ''}>
                                    <Link href={'#section1'}><span>1. {t('ppLegend_1')}</span></Link>
                                    <span className={css.goTo}>
                                        <Icon name={'arrow_right'}/>
                                    </span>
                                </div>
                                <div className={this.state.activeEl === 'section2' ? css.active : ''}>
                                    <Link href={'#section2'}><span>2. {t('ppLegend_2')}</span></Link>
                                    <span className={css.goTo}>
                                    <Icon name={'arrow_right'}/>
                                </span>
                                </div>
                                <div className={this.state.activeEl === 'section3' ? css.active : ''}>
                                    <Link href={'#section3'}><span>3. {t('ppLegend_3')}</span></Link>
                                    <span className={css.goTo}>
                                    <Icon name={'arrow_right'}/>
                                </span>
                                </div>
                                <div className={this.state.activeEl === 'section4' ? css.active : ''}>
                                    <Link href={'#section4'}><span>4. {t('ppLegend_4')}</span></Link>
                                    <span className={css.goTo}>
                                    <Icon name={'arrow_right'}/>
                                </span>
                                </div>
                                <div className={this.state.activeEl === 'section5' ? css.active : ''}>
                                    <Link href={'#section5'}><span>5. {t('ppLegend_5')}</span></Link>
                                    <span className={css.goTo}>
                                    <Icon name={'arrow_right'}/>
                                </span>
                                </div>
                                <div className={this.state.activeEl === 'section6' ? css.active : ''}>
                                    <Link href={'#section6'}><span>6. {t('ppLegend_6')}</span></Link>
                                    <span className={css.goTo}>
                                    <Icon name={'arrow_right'}/>
                                </span>
                                </div>
                            </div>
                        </InfoBlock>
                    </div>

                    <div bp={'12 8@md'}>
                        {!isMobile && <div className={css.secondlayer}>
                            <div>{t('pp_full')}</div>
                        </div>}

                        <div className={css.ppText}>
                            <div id={'section1'}>
                                <h1 className={'bigger'}>{t('ppLegend_1')}</h1>

                                <p dangerouslySetInnerHTML={{__html: t('ppInfo_1')}}/>
                            </div>

                            <div id={'section2'}>
                                <h1 className={'bigger'}>{t('ppLegend_2')}</h1>

                                <p dangerouslySetInnerHTML={{__html: t('ppInfo_2')}}/>
                            </div>

                            <div id={'section3'}>
                                <h1 className={'bigger'}>{t('ppLegend_3')}</h1>

                                <p dangerouslySetInnerHTML={{__html: t('ppInfo_3')}}/>
                            </div>

                            <div id={'section4'}>
                                <h1 className={'bigger'}>{t('ppLegend_4')}</h1>

                                <p dangerouslySetInnerHTML={{__html: t('ppInfo_4')}}/>
                            </div>

                            <div id={'section5'}>
                                <h1 className={'bigger'}>{t('ppLegend_5')}</h1>

                                <p dangerouslySetInnerHTML={{__html: t('ppInfo_5')}}/>
                            </div>

                            <div id={'section6'}>
                                <h1 className={'bigger'}>{t('ppLegend_6')}</h1>

                                <p dangerouslySetInnerHTML={{__html: t('ppInfo_6')}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
