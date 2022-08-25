import React from "react";
import css from '../../../styles/kit/forms/input.module.scss'
import PropTypes from "prop-types"
import {cnb} from "cnbuilder"
import Icon from "../Icon.jsx";
import {GlobalContext} from "../../../contexts/Global.js";
import ControlledTextArea from "./ControlledTextArea.jsx";
import Numbers from "../../../helpers/Numbers.js";

export default class TextArea extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            locked: false,
            value: '',
            errorMessage: ''
        }

        this.toggleLock = this.toggleLock.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.validate = this.validate.bind(this)
    }

    static contextType = GlobalContext

    componentDidMount() {
        if (this.props.lock) {
            this.setState({locked: true})
        }

        if (this.props.value) {
            this.setState({value: this.props.value})
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({value: this.props.value})
        }
    }

    toggleLock() {
        this.setState({locked: !this.state.locked})
    }

    handleUpdate(e) {
        if (e.target.value.length > this.props.max) {
            return
        }

        if (this.props.min && this.state.errorMessage.length && e.target.value.length >= this.props.min) {
            this.setState({errorMessage: ''})
        }

        if (this.props.value === undefined) {
            this.setState({value: e.target.value})
        } else {
            this.props.onUpdate(e.target.value)
        }
    }

    validate(e) {
        if (e.target.value.length === 0) {
            return
        }

        if (this.props.min && e.target.value.length < this.props.min) {
            this.setState({
                errorMessage: this.context.t('lengthMustNotBeLessThan') + ' ' + this.props.min
            })
        }
    }

    static propTypes = {
        label: PropTypes.string.isRequired,
        lock: PropTypes.bool,
        value: PropTypes.string,
        disabled: PropTypes.bool,
        lines: PropTypes.number,
        variant: PropTypes.string, // 'outlined' || 'underline'
        onUpdate: PropTypes.func,
        max: PropTypes.number,
        min: PropTypes.number,
        placeholder: PropTypes.string.isRequired
    }

    static defaultProps = {
        lock: false,
        variant: 'outlined',
        lines: 5,
        disabled: false,
        max: 100,
        value: ''
    }

    render() {
        const {theme} = this.context
        const inputId = 'textarea-' + Numbers.random(0, 99999)

        return <label htmlFor={inputId}>
            <div style={Object.assign({paddingBottom: this.state.errorMessage ? 36 : 8}, this.props.style)}
                 className={cnb(css['theme--' + theme], this.props.className)}>
                <div style={{marginBottom: 6}}
                    className={cnb(css.inputRoot, this.state.errorMessage.length ? css.errored : '', (this.state.locked || this.props.disabled) ? css.locked : '', this.props.variant === 'underline' ? css.underline : css.outlined)}>
                    <div className={css.label}>{this.props.label}</div>
                    <div className={'fit'}>
                        <ControlledTextArea id={inputId} onBlur={this.validate} rows={this.props.lines}
                                            value={this.state.value} onChange={this.handleUpdate}
                                            disabled={(this.state.locked || this.props.disabled)}
                                            placeholder={this.props.placeholder}/>
                        {this.state.locked ?
                            <Icon onClick={this.toggleLock} className={css.editIcon} name={'edit'}/> : null}
                    </div>
                </div>

                {this.state.errorMessage.length > 0 && <span>
                    <Icon name={'error'}/>
                    {this.state.errorMessage}</span>}

                <div style={{fontSize: 12, userSelect: 'none'}}>{this.state.value.length}/{this.props.max}</div>
            </div>
        </label>
    }
}
