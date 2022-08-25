import React from "react";
import css from '../../../styles/kit/collapsible.module.scss';
import PropTypes from "prop-types";
import Icon from "../Icon.jsx";
import Checkbox from "../Form/Checkbox.jsx";
import {cnb} from "cnbuilder";
import {GlobalContext} from "../../../contexts/Global.js";

export default class Collapsible extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            bodyRef: React.createRef(),
            checkboxRef: React.createRef()
        }

        this.toggle = this.toggle.bind(this);
    }

    static propTypes = {
        children: PropTypes.node.isRequired,
        title: PropTypes.string.isRequired,
        defaultOpen: PropTypes.bool,
        value: PropTypes.bool,
        onOpen: PropTypes.func,
        onUpdate: PropTypes.func,
        count: PropTypes.number
    }

    static defaultProps = {
        selectable: false
    }

    static contextType = GlobalContext

    componentDidMount() {
        if (this.props.defaultOpen) {
            this.setState({
                isOpen: true
            })
        }
    }

    toggle(e) {
        if (!this.state.checkboxRef.current?.contains(e.target)) {
            if (this.props.onOpen && !this.state.isOpen) {
                this.props.onOpen()
            }

            this.setState({isOpen: !this.state.isOpen})
        }
    }

    render() {
        const {theme} = this.context

        return <div className={css['theme--' + theme]}>
            <div onClick={this.toggle} className={cnb(css.head, this.props.value ? css.checked : '')}>
                <div className={'flex grow-1 vertical-center'}>
                    {this.props.selectable && <div ref={this.state.checkboxRef}><Checkbox onUpdate={this.props.onUpdate} value={this.props.value} /></div>}
                    {this.props.count !== undefined && <span className={css.cnt}>{this.props.count}</span>}
                    <span className={'subtitle2 fullwidth'} style={{marginLeft: 12}}>{this.props.title}</span>
                </div>
                <div className={'flex vertical-center'}>
                    <Icon className={cnb(css.chevron, this.state.isOpen ? css.open : '')} name={'chevron_down'}/>
                </div>
            </div>
            <div ref={this.state.bodyRef} className={css.body} style={{
                maxHeight: this.state.isOpen ? this.state.bodyRef.current?.scrollHeight : 0
            }}>
                {this.props.children}
            </div>
        </div>
    }
}
