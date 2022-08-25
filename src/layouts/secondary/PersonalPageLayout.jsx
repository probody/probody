import React from "react";
import PropTypes from "prop-types";
import css from "../../styles/accountpage.module.scss";
import Link from "next/link.js";
import {GlobalContext} from "../../contexts/Global.js";
import Button from "../../components/kit/Button.jsx";
import Breadcrumbs from "../../components/kit/Breadcrumbs.jsx";

export default class PersonalPageLayout extends React.Component {
    static propTypes = {
        children: PropTypes.any.isRequired,
        page: PropTypes.string.isRequired
    }

    static contextType = GlobalContext

    render() {
        const {t, theme, isMobile, openModal} = this.context

        return <div>
            <div>
                <Breadcrumbs items={[
                    {
                        name: t('mainPage'),
                        href: '/',
                    },
                    {
                        name: t('profile_' + this.props.page),
                        href: '/account/' + this.props.page,
                    },
                ]}/>
            </div>

            <div className={css['theme--' + theme]} bp={'grid'} style={{gap: isMobile ? 0 : 48}}>
                <div bp={'4 hide show@md'} className={'relative'}>
                    <div className={css.menu}>
                        <ul className={css.list}>
                            <li className={this.props.page === 'personal' ? css.active : ''}><Link href={'/account/personal'}>{t('user')}</Link></li>
                            <li className={this.props.page === 'promotion' ? css.active : ''}><Link href={'/account/promotion'}>{t('salonAndPromotion')}</Link></li>
                            <li className={this.props.page === 'stats' ? css.active : ''}><Link href={'/account/stats'}>{t('stats')}</Link></li>
                            <li className={this.props.page === 'reviews' ? css.active : ''}><Link href={'/account/reviews'}>{t('reviewsAndRating')}</Link></li>
                            <li className={this.props.page === 'vacancies' ? css.active : ''}><Link href={'/account/vacancies'}>{t('myVacancies')}</Link></li>
                            <li className={this.props.page === 'faq' ? css.active : ''}><Link href={'/account/faq'}>{t('needHelp')}</Link></li>
                        </ul>

                        <div className={css.stretchBtn} style={{marginTop: 32}}>
                            <Button color={'thirdlayer'} onClick={() => openModal('logout')}>{t('logout')}</Button>
                        </div>
                    </div>
                </div>
                <div bp={'12 8@md'}>
                    {this.props.children}
                </div>
            </div>
        </div>
    }
}
