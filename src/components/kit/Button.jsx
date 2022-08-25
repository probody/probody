import React from "react"
import {cnb} from "cnbuilder"
import PropTypes from 'prop-types'
import css from '../../styles/kit/button.module.scss'
import Icon from "./Icon.jsx"
import {GlobalContext} from "../../contexts/Global.js";

class Button extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this)
    }

    static contextType = GlobalContext

    static propTypes = {
        color: PropTypes.string, // primary | secondary | tertiary | success | danger | thirdlayer | onTheDark
        iconLeft: PropTypes.string,
        iconRight: PropTypes.string,
        size: PropTypes.string, // small | medium | large | fill
        isDisabled: PropTypes.bool,
        onClick: PropTypes.func,
        focus: PropTypes.bool,
        mapClick: PropTypes.object
    }

    static defaultProps = {
        color: 'primary',
        bordered: false,
        icon: null,
        size: 'medium',
        isDisabled: false,
        focus: true
    }

    handleClick(e) {
        if (this.props.isDisabled) {
            return
        }

        if (this.props.onClick) {
            this.props.onClick(e)
        } else if (this.props.mapClick) {
            this.props.mapClick.current?.click()
        }
    }

    render() {
        const textMargins = {}
        const {theme} = this.context

        if (this.props.children) {
            if (this.props.iconLeft) {
                textMargins.marginLeft = '10px'
            }

            if (this.props.iconRight) {
                textMargins.marginRight = '10px'
            }
        }

        return <div className={css['theme--' + theme]}><button
            onClick={this.handleClick}
            style={this.props.style}
            className={cnb('non-selectable', this.props.className, css.btn, css[this.props.size], css[this.props.color], this.props.isDisabled ? [css['non-focusable'], css.disabled] : '', this.props.focus ? '' : css['non-focusable'], this.props.iconLeft || this.props.iconRight ? css.hasIcon : '')}>
            {this.props.iconLeft && <Icon name={this.props.iconLeft}/>}
            <span className={'va-middle'} style={textMargins}>{this.props.children}</span>
            {this.props.iconRight && <Icon name={this.props.iconRight}/>}
        </button></div>
    }
}

export default Button
