import React from "react"
import {GlobalContext} from "../contexts/Global"
import css from '../styles/navbar.module.scss'
import ThemeSwitcher from "./ThemeSwitcher.jsx";
import {cnb} from "cnbuilder"
import LanguageSelector from "./LanguageSelector.jsx"
import Menu from "./Menu.jsx"
import Link from "next/link.js"
import HybridSearchInput from "./kit/Form/HybridSearchInput"
import Icon from "./kit/Icon.jsx"
import Image from "next/image"

class Navbar extends React.Component {
    render() {
        const {t, theme, openModal, isLoggedIn} = this.context

        return <div className={css['theme--' + theme]}>
            {this.context.isMobile ?
                <nav style={{justifyContent: 'space-around'}} className={cnb(css.navbar, css.mobile)} bp={'flex'}>
                    <ThemeSwitcher/>
                    <span onClick={() => {
                        document.location.pathname === '/' && document.location.reload()
                    }}><Link href={'/'}><Image width={130} height={15} className={'cursor-pointer'} src={'/text_logo--' + theme + '.svg'}
                                          alt={'logo'}/></Link></span>
                    <div className={'flex'}>
                        <LanguageSelector/>
                        <div style={{marginLeft: 8}}><Menu/></div>
                    </div>
                </nav>
                :
                <nav className={cnb('container', css.navbar, css.pc, 'non-selectable')} bp={'grid'}>
                     <span onClick={() => {
                         document.location.pathname === '/' && document.location.reload()
                     }}><Link href={'/'}><Image width={174} height={20} className={'cursor-pointer'} src={'/text_logo--' + theme + '.svg'}
                                                alt={'logo'}/></Link></span>
                    <div bp={'fill'} style={{margin: '0 16px'}}>
                        <HybridSearchInput searchPlaceholder={t('searchPlaceholder')}
                                           geoPlaceholder={t('geoPlaceholder')}/>
                    </div>
                    {!isLoggedIn && <div className={'flex'}>
                        <span className={'cursor-pointer lack'} onClick={() => openModal('login')}>{t('toLogIn')}</span>
                        <div style={{margin: '0 8px'}} className={css.rightSplitter}>&nbsp;</div>
                        <span className={'cursor-pointer lack'}
                              onClick={() => openModal('register')}>{t('registration')}</span>
                    </div>}
                    {isLoggedIn && <div className={'flex cursor-pointer justify-center lack'}>
                        <Icon name={'round_user'} className={css.personalAreaIcon} />
                        <Link href={'/account/promotion'}>{t('personalArea')}</Link></div>}

                    <LanguageSelector/>
                    <Menu/>
                    <ThemeSwitcher/>
                </nav>
            }
        </div>
    }
}

Navbar.contextType = GlobalContext

export default Navbar
