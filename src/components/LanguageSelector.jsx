import React from "react"
import css from '../styles/languageselector.module.scss'
import Icon from "./kit/Icon.jsx"
import {cnb} from "cnbuilder";
import {GlobalContext} from "../contexts/Global.js";
import {withRouter} from "next/router.js";
import Popup from "./kit/Popup";

class LanguageSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isPopupOpen: false,
            handleRef: React.createRef()
        }

        this.togglePopup = this.togglePopup.bind(this);
    }

    togglePopup() {
        this.setState({isPopupOpen: !this.state.isPopupOpen})
    }

    componentDidUpdate(prevProps) {
        if (prevProps.router.locale !== this.props.router.locale) {
            this.setState({isPopupOpen: false})
        }
    }

    render() {
        const {locale, theme, isMobile} = this.props.router;

        const availableOptions = this.props.router.locales.filter(i => i !== locale);

        return <div className={css['theme--' + theme]}>
            <div className={cnb(css.root, this.state.isPopupOpen ? css.popupOpen : '')}>
                <div ref={this.state.handleRef} onClick={this.togglePopup}>
                    <span>{locale}</span>
                    <Icon color={'#FFC83A'} name={'chevron_down'}/>
                </div>
                <Popup handleRef={this.state.handleRef} style={isMobile ? {} : {left: -58}} isOpen={this.state.isPopupOpen}
                       onClose={() => this.setState({isPopupOpen: false})}>
                    <ul className={css.list}>
                        {availableOptions.map(lang =>
                            <li key={lang} onClick={() => this.context.setLocale(lang)}>
                                {lang}
                            </li>
                        )}
                    </ul>
                </Popup>
            </div>
        </div>
    }
}

LanguageSelector.contextType = GlobalContext

export default withRouter(LanguageSelector)
