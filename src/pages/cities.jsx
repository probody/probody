import React from "react";
import Head from "next/head.js";
import {TITLE_POSTFIX} from "../helpers/constants.js";
import Breadcrumbs from "../components/kit/Breadcrumbs.jsx";
import {GlobalContext} from "../contexts/Global.js";
import ContactUs from "../components/ContactUs";
import UserHelper from "../helpers/UserHelper.js";
import APIRequests from "../helpers/APIRequests.js";
import css from '../styles/cities.module.scss'
import Button from "../components/kit/Button.jsx";
import Icon from "../components/kit/Icon.jsx";

export default class ContactPage extends React.Component {
    static contextType = GlobalContext

    constructor(props) {
        super(props);

        this.state = {
            regions: [],
        }
    }

    componentDidMount() {
        APIRequests.getRegionInfo().then(regions => {
            this.setState({regions})
        })
    }

    render() {
        const {t, isMobile} = this.context

        return <>
            <Head>
                <title>{t('cities')}{TITLE_POSTFIX}</title>
            </Head>

            <Breadcrumbs items={[{
                name: t('mainPage'), href: '/',
            }, {
                name: t('cities'), href: '/cities',
            }]}/>

            <div style={{marginTop: isMobile ? 16 : 48}} className={'responsive-content'}>
                <h1 className={'text-xl'}
                    style={{marginBottom: isMobile ? 24 : 48}}>{t('wePresentDifferentSalons')}</h1>

                <div bp={'grid 12 4@md'} style={{gap: isMobile ? 16 : 32}}>
                    {this.state.regions.map((region, i) =>
                        <div key={i} className={css.city} style={{backgroundImage: 'linear-gradient(#252420b5, #252420b5), url("/regions/' + region.name.toLowerCase() + '.jpg")'}}>
                            <h1>{t('region_' + region.name)}</h1>

                            <div>
                                <div>
                                    <p>{t('salons')}</p>
                                    <span>{region.salonCnt}</span>
                                </div>

                                <div>
                                    <p>{t('privateMasters')}</p>
                                    <span>{region.privateMasterCnt}</span>
                                </div>

                                <Button onClick={() => {
                                    UserHelper.setRegion(region.name)
                                    window.location.pathname = '/'
                                }}>
                                    <Icon name={'arrow_right'} />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{marginTop: isMobile ? 16 : 48}}>
                <ContactUs single={false}/>
            </div>
        </>
    }
}
