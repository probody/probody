import React from "react"
import css from '../../styles/kit/stats.infoblock.module.scss'
import InfoBlock from "./InfoBlock";
import PropTypes from "prop-types";
import {cnb} from "cnbuilder";
import {GlobalContext} from "../../contexts/Global.js";

export default class StatsInfoBlock extends React.Component {
    static contextType = GlobalContext
    static propTypes = {
        title: PropTypes.string,
        stats: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            accent: PropTypes.bool
        })).isRequired
    }

    render() {
        const {stats} = this.props
        const {theme} = this.context

        return <div className={css['theme--' + theme]}>
            <InfoBlock>
                <h3 style={{marginBottom: 12}}>{this.props.title}</h3>
                <div bp={'grid ' + 12 / stats.length}>
                    {stats.map((stat, index) =>
                        <p className={css.caption} key={index}>{stat.title}</p>
                    )}
                </div>
                <div bp={'grid ' + 12 / stats.length}>
                    {stats.map((stat, index) =>
                        <h1 key={index}
                            className={cnb('number-font', css[stat.accent ? 'accent' : 'default'])}>{stat.value}</h1>
                    )}
                </div>
            </InfoBlock>
        </div>
    }
}
