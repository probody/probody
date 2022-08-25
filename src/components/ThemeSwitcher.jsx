import React from "react"
import css from '../styles/themeswitcher.module.scss'
import Icon from "./kit/Icon.jsx"
import {cnb} from "cnbuilder";
import {GlobalContext} from "../contexts/Global.js";

class ThemeSwitcher extends React.Component {
    render() {
        const {theme, toggleTheme} = this.context;

        return <div className={css['theme--' + theme]}>
            <div onClick={toggleTheme} className={css.root}>
                <div className={cnb(css.icon, css[theme])}>
                    <Icon name={theme === 'light' ? 'sun' : 'moon'}/>
                </div>
            </div>
        </div>
    }
}

ThemeSwitcher.contextType = GlobalContext

export default ThemeSwitcher
