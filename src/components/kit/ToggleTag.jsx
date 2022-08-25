import React from "react"
import css from '../../styles/kit/tag.module.scss'
import PropTypes from "prop-types"
import Icon from "./Icon.jsx"
import {cnb} from "cnbuilder";
import {GlobalContext} from "../../contexts/Global.js";

export default class ToggleTag extends React.Component {
    static contextType = GlobalContext

    static propTypes = {
        label: PropTypes.string,
        enabled: PropTypes.bool,
        onToggle: PropTypes.func
    }

    static defaultProps = {
        enabled: true,
    }

    render() {
        const {theme} = this.context

        return <div className={css['theme--' + theme]}><div onClick={this.props.onToggle} className={cnb(css.root, css.toggleable, 'non-selectable', this.props.enabled ? css.enabled : css.disabled, this.props.className)}>
            {this.props.icon && <Icon name={this.props.icon}/>}
            <span style={{marginLeft: this.props.icon ? 8 : 0}}>{this.props.label}</span>
        </div></div>
    }
}
