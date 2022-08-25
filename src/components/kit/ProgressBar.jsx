import React from "react";
import PropTypes from "prop-types";
import css from '../../styles/kit/progressbar.module.scss';
import {cnb} from "cnbuilder";
import {GlobalContext} from "../../contexts/Global.js";

export default class ProgressBar extends React.Component {
    static propTypes = {
        value: PropTypes.number.isRequired,
        mobile: PropTypes.bool
    }

    static contextType = GlobalContext;

    static defaultProps = {
        mobile: false
    }

    render() {
        const {theme} = this.context

        return <div className={css['theme--' + theme]}>
            <div className={cnb(css.root, this.props.mobile ? css.mobile : '')}>
                <div className={css.progress} style={{width: this.props.value * 100 + '%'}}>&nbsp;</div>
            </div>
        </div>
    }
}
