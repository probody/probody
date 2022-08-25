import React from "react";
import css from '../styles/pages/about.module.scss'
import ContactUs from "../components/ContactUs.jsx";
import {GlobalContext} from "../contexts/Global.js";
import Button from "../components/kit/Button.jsx";
import {cnb} from "cnbuilder";
import Link from "next/link.js";

export default class AboutUsPage extends React.Component {
    static contextType = GlobalContext

    render() {
        const {isMobile, t, theme} = this.context

        return <div className={cnb(css['theme--' + theme])}>
            <div bp={'grid'} className={'responsive-content'} style={{marginTop: isMobile ? 16 : 48}}>
                <div bp={'12 5@md'}>
                    <h1 className={'text-xl'}>{t('whoWeAre')}</h1>
                    <p className={cnb(css.caption, css.jumbotronText, 'smallOnMobile')}>{t('seachNewClients')}</p>
                    <Link href='/'><Button size={'large'}>{t('chooseServices')}</Button></Link>
                </div>

                <div bp={'12 7@md'} className={css.img1}>
                    &nbsp;
                </div>
            </div>

            <div className={'responsive-content'} style={{marginTop: isMobile ? 64 : 96}}>
                <h1 className={'bigger'} style={{marginBottom: isMobile ? 20 : 37}}>{t('whatWeDo')}</h1>

                <div bp={'grid 12 6@md'} style={{gap: isMobile ? '12px 0' : 32}}>
                    <div className={css.featureBlock}>
                        <div>&nbsp;</div>
                        <div>
                            <p className="lack">{t('feature1Title')}</p>
                            <p className={'additional-text'}>
                                {t('feature1Descr')}
                            </p>
                        </div>
                    </div>

                    <div className={css.featureBlock}>
                        <div>&nbsp;</div>
                        <div>
                            <p className="lack">{t('feature2Title')}</p>
                            <p className={'additional-text'}>
                                {t('feature2Descr')}
                            </p>
                        </div>
                    </div>

                    <div className={css.featureBlock}>
                        <div>&nbsp;</div>
                        <div>
                            <p className="lack">{t('feature3Title')}</p>
                            <p className={'additional-text'}>
                                {t('feature3Descr')}
                            </p>
                        </div>
                    </div>

                    <div className={css.featureBlock}>
                        <div>&nbsp;</div>
                        <div>
                            <p className="lack">{t('feature4Title')}</p>
                            <p className={'additional-text'}>
                                {t('feature4Descr')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{marginTop: isMobile ? 64 : 96}}>
                <ContactUs single={false}/>
            </div>
        </div>
    }
}
