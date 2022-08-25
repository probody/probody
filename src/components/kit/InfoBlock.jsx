import React from "react"
import css from '../../styles/kit/infoblock.module.scss'
import {cnb} from "cnbuilder";
import {GlobalContext} from "../../contexts/Global.js";

export default class InfoBlock extends React.Component {
    static contextType = GlobalContext

    render() {
        const {theme} = this.context

        return <div className={css['theme--' + theme]} style={this.props.rootStyle}><section style={this.props.style} className={cnb('non-selectable', css.infoBlock, this.props.className)}>
            {this.props.children}
        </section></div>
    }
}
