import React from "react";
import css from '../../styles/kit/mc.module.scss'
import Icon from "./Icon.jsx";
import PropTypes from "prop-types";
import {GlobalContext} from "../../contexts/Global.js";
import {cnb} from "cnbuilder";
import {capitalize} from "../../helpers/String";
import Link from "next/link.js";

export default class MockShortMasterCard extends React.Component {
    static propTypes = {
        cnt: PropTypes.number.isRequired,
        link: PropTypes.any.isRequired,
    }

    static contextType = GlobalContext

    render() {
        const {theme, t} = this.context

        return <div className={css['theme--' + theme]}><Link href={this.props.link}>
            <div
                className={cnb(css.root, css.mock)}>
            <span style={{alignSelf: 'flex-end'}}>
                <Icon name={'plus'} className={css.plusIcon}/>
            </span>
                <span style={{alignSelf: 'flex-start'}}>
                {capitalize(t('nMore', this.props.cnt))}
            </span>
            </div>
        </Link>
        </div>
    }
}
