import React from "react"
import PropTypes from "prop-types"
import css from '../../../styles/kit/forms/range.module.scss'
import {GlobalContext} from "../../../contexts/Global.js";
import {cnb} from "cnbuilder";
import {formatPrice} from "../../../helpers/String";

export default class MultipleRangeInput extends React.Component {
    static contextType = GlobalContext

    static propTypes = {
        onUpdate: PropTypes.func.isRequired,
        from: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        to: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.number,
        accent: PropTypes.bool
    }

    static defaultProps = {
        min: 1,
        max: 10,
        step: 1,
        accent: true
    }

    constructor(props) {
        super(props);

        this.state = {
            lowerRange: React.createRef(),
            upperRange: React.createRef()
        }
    }

    componentDidUpdate() {
        const activeBg = this.context.theme === 'light' ? '#252420' : (this.props.accent ? '#FFC83A' : '#f7f7f7'),
            inactiveBg = this.context.theme === 'light' ? '#e4e4e4' : '#454543'

        this.state.lowerRange.current.style.background = `linear-gradient(to right, ${inactiveBg} 0%, ${inactiveBg} ${this.props.from / this.props.max * 100}%, ${activeBg} ${this.props.from / this.props.max * 100}%, ${activeBg} 100%)`
        this.state.upperRange.current.style.background = `linear-gradient(to right, transparent 0%, transparent ${this.props.to / this.props.max * 100}%, ${inactiveBg} ${this.props.to / this.props.max * 100}%, ${inactiveBg} 100%)`
    }

    render() {
        const {theme, t} = this.context

        return <div style={{margin: '2px 0 5px 0'}} className={cnb(css['theme--' + theme], 'non-selectable')}>
            <div className={css.multipleContainer}>
                <input value={this.props.from} step={this.props.step} min={this.props.min} max={this.props.max}
                       className={cnb(css.range, css.multiple)} ref={this.state.lowerRange}
                       type={"range"} onInput={e => this.props.onUpdate(Number(e.target.value))}/>
                <input value={this.props.to} step={this.props.step} min={this.props.min} max={this.props.max}
                       className={cnb(css.range, css.multiple)} style={{background: 'none'}} ref={this.state.upperRange}
                       type={"range"} onInput={e => this.props.onUpdate(undefined, Number(e.target.value))}/>
            </div>

            <div className="flex justify-between">
                <div className={css.limit}>{formatPrice(this.props.from)} {t('kzt')}</div>
                <div className={css.limit}>{formatPrice(this.props.to)} {t('kzt')}</div>
            </div>
        </div>
    }
}
