import React from "react";
import css from '../../styles/kit/mc.module.scss'
import Icon from "./Icon.jsx";
import PropTypes from "prop-types";
import {GlobalContext} from "../../contexts/Global.js";
import Link from "next/link.js";

export default class ShortMasterCard extends React.Component {
    static propTypes = {
        pic: PropTypes.string.isRequired,
        photoCnt: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        link: PropTypes.any.isRequired
    }

    static contextType = GlobalContext

    render() {
        const {theme} = this.context

        return <div className={css['theme--' + theme]}><Link href={this.props.link}>
            <div
                style={{backgroundImage: 'linear-gradient(25deg, #181818 0%, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0) 70%, #181818 100%), url(' + this.props.pic + ')'}}
                className={css.root}>
            <span style={{alignSelf: 'flex-end'}}>
                <Icon name={'pic'}/>
                {this.props.photoCnt}
            </span>
                <span style={{alignSelf: 'flex-start'}}>
                {this.props.name}
            </span>
            </div>
        </Link>
        </div>
    }
}
