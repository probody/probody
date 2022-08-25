import React from "react"
import css from '../styles/menu.module.scss'
import Icon from "./kit/Icon.jsx"
import Popup from "./kit/Popup"
import Link from "next/link.js"
import {GlobalContext} from "../contexts/Global.js"
import {withRouter} from "next/router.js"
import Button from "./kit/Button.jsx"
import {cnb} from "cnbuilder"

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            accountView: this.props.router.pathname.startsWith('/account/'),
            handleRef: React.createRef()
        }

        this.toggleMenu = this.toggleMenu.bind(this)
        this.openAccount = this.openAccount.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.router.pathname !== this.props.router.pathname) {
            this.setState({isOpen: false})
        }
    }

    toggleMenu() {
        this.setState({isOpen: !this.state.isOpen})
    }

    openAccount() {
        if (this.context.isMobile) {
            this.setState({
                accountView: true
            })
        } else {
            this.props.router.push('/account/personal')
        }
    }

    render() {
        const {t, isMobile, openModal, theme, isLoggedIn} = this.context

        return <div className={cnb('non-selectable', css['theme--' + theme])}>
            <div id={'hamburger'} className={cnb(css.hamburger, (!isMobile && this.state.isOpen) ? css.opened : '')}
                 ref={this.state.handleRef} onClick={this.toggleMenu}><Icon
                name={(this.state.isOpen && isMobile) ? 'close' : 'hamburger'}/></div>
            <Popup handleRef={this.state.handleRef} onClose={() => this.setState({isOpen: false})}
                   style={isMobile ? {padding: '24px 0 0 0'} : {left: -270}} fullSize={isMobile}
                   isOpen={this.state.isOpen}>
                <div className={css.columnFlex}>
                    {!(this.state.accountView && isMobile) && <ul className={cnb(css.list, isMobile ? css.mobile : '')}>
                        <li onClick={this.openAccount}><span className={'cursor-pointer'}>{t('personalArea')}</span>
                        </li>
                        <li><Link href={'/salon/new'}>{t('addArticle')}</Link></li>
                        <li><Link href={'/blog'}>{t('news')}</Link></li>
                        <li><Link href={'/clients'}>{t('forVisitors')}</Link></li>
                        <li><Link href={'/vacancies'}>{t('salonVacancies')}</Link></li>
                        <li><Link href={'/contact'}>{t('contacts')}</Link></li>
                        <li><Link href={'/about'}>{t('aboutProject')}</Link></li>
                    </ul>}

                    {(this.state.accountView && isMobile) && <>
                        <div className={css.stepBack}>
                            <span onClick={() => this.setState({accountView: false})}><Icon name={'arrow_left'}/>
                                {t('menu')}
                            </span>

                            <h1 style={{marginTop: 32}}>{t('personalArea')}</h1>
                        </div>

                        <ul className={cnb(css.list, isMobile ? css.mobile : '')}>
                            <li><Link href={'/account/personal'}>{t('user')}</Link></li>
                            <li><Link href={'/account/promotion'}>{t('salonAndPromotion')}</Link></li>
                            <li><Link href={'/account/stats'}>{t('stats')}</Link></li>
                            <li><Link href={'/account/reviews'}>{t('reviewsAndRating')}</Link></li>
                            <li><Link href={'/account/vacancies'}>{t('myVacancies')}</Link></li>
                            <li><Link href={'/account/faq'}>{t('needHelp')}</Link></li>
                        </ul>
                    </>}

                    {isMobile && !isLoggedIn && <div className={css.bottomSection}>
                        <Button className={css.btn} onClick={() => {
                            this.toggleMenu()
                            openModal('register')
                        }}>{t('registration')}</Button>
                        <Button className={css.btn} color={'tertiary'} onClick={() => {
                            this.toggleMenu()
                            openModal('login')
                        }}>{t('toLogIn')}</Button>
                    </div>}

                    {isMobile && isLoggedIn && <div className={css.bottomSection}>
                        <Button color={'tertiary'} onClick={() => openModal('logout')}>{t('logout')}</Button>
                    </div>}
                </div>
            </Popup>
        </div>
    }
}

Menu.contextType = GlobalContext

export default withRouter(Menu)
