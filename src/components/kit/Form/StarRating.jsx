import React from "react"
import PropTypes from "prop-types";
import Icon from "../Icon.jsx";
import css from '../../../styles/kit/forms/starrating.module.scss'
import {GlobalContext} from "../../../contexts/Global.js";
import {cnb} from "cnbuilder";

export default class StarRating extends React.Component {
    static contextType = GlobalContext

    static propTypes = {
        value: PropTypes.number.isRequired,
        onUpdate: PropTypes.func.isRequired
    }

    render() {
        const {theme} = this.context

        return <div className={css['theme--' + theme]}>
            <div className={cnb('flex', 'gap-12', css.root)}>
                <Icon name={'star'} className={this.props.value >= 1 ? css.active : ''} onClick={() => this.props.onUpdate(1)}/>
                <Icon name={'star'} className={this.props.value >= 2 ? css.active : ''} onClick={() => this.props.onUpdate(2)}/>
                <Icon name={'star'} className={this.props.value >= 3 ? css.active : ''} onClick={() => this.props.onUpdate(3)}/>
                <Icon name={'star'} className={this.props.value >= 4 ? css.active : ''} onClick={() => this.props.onUpdate(4)}/>
                <Icon name={'star'} className={this.props.value >= 5 ? css.active : ''} onClick={() => this.props.onUpdate(5)}/>
            </div>
        </div>
    }
}
