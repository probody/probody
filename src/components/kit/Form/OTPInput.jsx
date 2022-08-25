import React from "react";
import css from '../../../styles/kit/forms/OTPInput.module.scss';
import {GlobalContext} from "../../../contexts/Global.js";
import PropTypes from "prop-types";
import Icon from "../Icon.jsx";
import {cnb} from "cnbuilder";

export default class OTPInput extends React.Component {
    static contextType = GlobalContext

    constructor(props) {
        super(props);

        this.state = {
            values: ['', '', '', '', ''],
            errored: false,
            errorMsg: '',
            refs: [React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()],
        }

        this.handleInputFrom = this.handleInputFrom.bind(this);
        this.handleSecondaryFocus = this.handleSecondaryFocus.bind(this);
    }

    static propTypes = {
        onUpdate: PropTypes.func.isRequired,
    }

    async componentDidUpdate(prevProps) {
        if (this.props.error !== prevProps.error) {
            if (prevProps.error && !this.props.error.length) {
                await this.setState({errored: false, success: false, errorMsg: ''})
            } else {
                await this.setState({errored: true, errorMsg: this.props.error})
            }
        }
    }

    async handleInputFrom(index, event) {
        if (event.target.value.length > 0 && isNaN(Number(event.target.value[0]))) {
            return
        }

        const {values} = this.state;

        await this.setState({values: values.slice(0, index).concat(event.target.value.split('').length > 0 ? event.target.value.split('') : '').concat(values.slice(index + 1)).slice(0, 5)});

        if (index < 4 && event.target.value.length > 0) {
            this.state.refs[index + 1].current.focus();
        }

        this.props.onUpdate(this.state.values.join(''));
    }

    handleKeyDown(index, key) {
        if (key === 'Backspace' && this.state.values[index].length === 0) {
            this.state.refs[index - 1].current.focus();
        }
    }

    handleSecondaryFocus() {
        if (this.state.values.every(v => v.length === 0)) {
            this.state.refs[0].current.focus();
        }
    }

    render() {
        const {t, theme} = this.context

        return <div className={css['theme--' + theme]} style={this.props.style}>
            <div className={cnb(css.root, this.state.errored ? css.errored : '')}>
                <span className={css.subtitle}>{t('verificationCode')}</span>

                <div className="flex justify-between" style={{gap: 4}}>
                    <input pattern="\d*" type={'number'} value={this.state.values[0]} ref={this.state.refs[0]}
                           onInput={e => this.handleInputFrom(0, e)} autoComplete={'one-time-code'}
                           autoFocus={true}/>
                    <input pattern="\d*" type={'number'} value={this.state.values[1]} ref={this.state.refs[1]} onFocus={this.handleSecondaryFocus}
                           onKeyDown={e => this.handleKeyDown(1, e.key)} onInput={e => this.handleInputFrom(1, e)}
                           maxLength={1}/>
                    <input pattern="\d*" type={'number'} value={this.state.values[2]} ref={this.state.refs[2]} onFocus={this.handleSecondaryFocus}
                           onKeyDown={e => this.handleKeyDown(2, e.key)} onInput={e => this.handleInputFrom(2, e)}
                           maxLength={1}/>
                    <input pattern="\d*" type={'number'} value={this.state.values[3]} ref={this.state.refs[3]} onFocus={this.handleSecondaryFocus}
                           onKeyDown={e => this.handleKeyDown(3, e.key)} onInput={e => this.handleInputFrom(3, e)}
                           maxLength={1}/>
                    <input pattern="\d*" type={'number'} value={this.state.values[4]} ref={this.state.refs[4]} onFocus={this.handleSecondaryFocus}
                           onKeyDown={e => this.handleKeyDown(4, e.key)} onInput={e => this.handleInputFrom(4, e)}
                           maxLength={1}/>
                </div>
            </div>

            {this.state.errored && <span>
                    <Icon name={'error'} />
                {this.state.errorMsg}</span>}
        </div>
    }
}
