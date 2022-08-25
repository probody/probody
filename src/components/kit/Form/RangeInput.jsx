import React from "react"
import PropTypes from "prop-types"
import css from '../../../styles/kit/forms/range.module.scss'
import {GlobalContext} from "../../../contexts/Global.js";
import {cnb} from "cnbuilder";

export default class RangeInput extends React.Component {
    static contextType = GlobalContext

    static propTypes = {
        onUpdate: PropTypes.func.isRequired,
        value: PropTypes.number.isRequired,
        min: PropTypes.number,
        max: PropTypes.number,
        accent: PropTypes.bool
    }

    static defaultProps = {
        min: 1,
        max: 10
    }

    constructor(props) {
        super(props);

        this.state = {
            rangeRef: React.createRef()
        }
    }

    componentDidUpdate() {
        const activeBg = this.context.theme === 'light' ? '#252420' : this.props.accent ? '#FFC83A' : '#f7f7f7',
            inactiveBg = this.context.theme === 'light' ? '#e4e4e4' : '#454543'

        this.state.rangeRef.current.style.background = `linear-gradient(to right, ${activeBg} 0%, ${activeBg} ${this.props.value / this.props.max * 100}%, ${inactiveBg} ${this.props.value / this.props.max * 100}%, ${inactiveBg} 100%)`
    }

    render() {
        const {theme} = this.context

        return <div style={{margin: '2px 0 5px 0'}} className={cnb(css['theme--' + theme], 'non-selectable')}>
            <div className="flex justify-between">
                <div className={css.limit}>{this.props.min}</div>
                <div className={css.limit}>{this.props.max}</div>
            </div>

            <div className="relative">
                <span className={css.current} style={{
                    left: `calc(${(this.props.value - this.props.min) * 100 / (this.props.max - this.props.min)}% + ${-((this.props.value - this.props.min) * 100 / (this.props.max - this.props.min)) * 0.3}px)`
                }}>{this.props.value}</span>
                <input value={this.props.value} step={1} min={this.props.min} max={this.props.max} className={css.range}
                       type={"range"} onInput={e => this.props.onUpdate(Number(e.target.value))} ref={this.state.rangeRef}/>
            </div>
        </div>
    }
}
