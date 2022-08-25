import React from "react";
import css from '../../../styles/kit/collapsible.module.scss';
import PropTypes from "prop-types";
import Icon from "../Icon.jsx";
import {cnb} from "cnbuilder";
import {GlobalContext} from "../../../contexts/Global.js";

export default class PlusCollapsible extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            bodyRef: React.createRef()
        }

        this.toggle = this.toggle.bind(this);
    }

    static propTypes = {
        children: PropTypes.node.isRequired,
        title: PropTypes.string.isRequired,
        defaultOpen: PropTypes.bool
    }

    static defaultProps = {
        defaultOpen: false
    }

    static contextType = GlobalContext

    componentDidMount() {
        if (this.props.defaultOpen) {
            this.setState({
                isOpen: true
            })
        }
    }

    toggle() {
        if (this.state.isOpen === false && this.props.onOpen) {
            this.props.onOpen()
        }

        this.setState({isOpen: !this.state.isOpen})
    }

    componentDidUpdate(prevProps) {
        if (prevProps.defaultOpen !== this.props.defaultOpen) {
            this.setState({
                isOpen: this.props.defaultOpen
            })
        }

        if (prevProps.children[1] !== this.props.children[1] || prevProps.children[2] !== this.props.children[2]) {
            if (this.state.isOpen) {
                this.forceUpdate()
            }
        }
    }

    render() {
        const {theme} = this.context

        return <div className={css['theme--' + theme]}>
            <div onClick={this.toggle} className={cnb(css.transparentHead, 'responsive-content')} style={{padding: '12px 0'}}>
                <div className={'flex grow-1 vertical-center'}>
                    <span className={'subtitle2'}>{this.props.title}</span>
                </div>
                <div className={'flex vertical-center'}>
                    <Icon className={cnb(css.chevron)} name={this.state.isOpen ? 'minus' : 'plus'}/>
                </div>
            </div>
            <div ref={this.state.bodyRef} className={css.body} style={{
                maxHeight: this.state.isOpen ? this.state.bodyRef.current?.scrollHeight : 0,
                overflowY: 'scroll'
            }}>
                {this.props.children}
            </div>

            <div className={css.divider}>
                &nbsp;
            </div>
        </div>
    }
}
