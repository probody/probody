import React from "react";
import css from '../../styles/kit/modal.module.scss'
import {GlobalContext} from "../../contexts/Global.js";
import {cnb} from "cnbuilder";
import PropTypes from "prop-types";
import Icon from "./Icon.jsx";

export default class Modal extends React.Component {
    static contextType = GlobalContext

    static propTypes = {
        open: PropTypes.bool.isRequired,
        onUpdate: PropTypes.func.isRequired,
        isMobile: PropTypes.bool,
        useNav: PropTypes.bool,
        desktopWidth: PropTypes.number
    }

    static defaultProps = {
        open: false,
        isMobile: true,
        useNav: false,
        desktopWidth: 450
    }

    componentDidMount() {
        if (this.props.open) {
            window.document.body.classList.add('no-scroll')
        }
    }

    componentWillUnmount() {
        if (this.props.open) {
            window.document.body.classList.remove('no-scroll')
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.open) {
            window.document.body.classList.add('no-scroll')
        } else if (prevProps.open && !this.props.open) {
            window.document.body.classList.remove('no-scroll')
        }
    }

    render() {
        const {theme, isMobile} = this.context

        return <div className={css['theme--' + theme]}>
            <div onClick={(e) => {
                if (e.target.classList.contains(css.overlay)) {
                    this.props.onUpdate('')
                }
            }}
                 className={cnb(css.overlay, this.props.isMobile ? css.mobile : css.desktop, this.props.open ? css.visible : '', this.props.useNav ? css.useNav : '')}>
                {this.props.useNav && <div className={css.closeModal} onClick={() => this.props.onUpdate(false)}><Icon name={'close'}/></div>}

                <div style={Object.assign(!isMobile ? {maxWidth: this.props.desktopWidth} : {}, this.props.modalStyle)} className={css.modal}>
                    {this.props.children}
                </div>
            </div>
        </div>
    }
}
