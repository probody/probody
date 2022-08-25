import React from "react"
import css from '../../styles/kit/popup.module.scss'
import PropTypes from "prop-types"
import {cnb} from "cnbuilder";
import {GlobalContext} from "../../contexts/Global.js";

export default class Popup extends React.Component {
    static contextType = GlobalContext

    static propTypes = {
        isOpen: PropTypes.bool,
        fullSize: PropTypes.bool,
        onClose: PropTypes.func.isRequired,
        handleRef: PropTypes.object.isRequired
    }

    static defaultProps = {
        isOpen: false,
        fullSize: false
    }

    constructor(props) {
        super(props);

        this.state = {
            wrapperRef: React.createRef()
        }

        this.handleClickOutside = this.handleClickOutside.bind(this)
    }

    componentDidMount() {
        window.document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        window.document.removeEventListener("mousedown", this.handleClickOutside);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.fullSize) {
            if (this.props.isOpen && !prevProps.isOpen) {
                window.document.body.classList.add('no-scroll')
            } else if (!this.props.isOpen && prevProps.isOpen) {
                window.document.body.classList.remove('no-scroll')
            }
        }
    }

    handleClickOutside(e) {
        if (this.state.wrapperRef && !this.state.wrapperRef.current.contains(e.target) && this.props.handleRef && !this.props.handleRef.current.contains(e.target)) {
            this.props.isOpen && this.props.onClose()
        }
    }

    render() {
        const {theme} = this.context
        return <div ref={this.state.wrapperRef} className={css['theme--' + theme]}>
            <div className={cnb(css.root, this.props.fullSize ? css.fullsize : '')}>
                <div style={this.props.style}
                     className={cnb(css.popup, this.props.isOpen ? css.open : '', this.props.fullSize ? css.fullsize : '')}>{this.props.children}</div>
            </div>
        </div>
    }
}
