import React from "react";
import css from '../../../styles/kit/forms/imageinput.module.scss';
import Button from "../Button.jsx";
import PropTypes from "prop-types";
import {GlobalContext} from "../../../contexts/Global.js";
import {cnb} from "cnbuilder";

export default class MockImageInput extends React.Component {
    static propTypes = {
        onClick: PropTypes.func
    }

    static contextType = GlobalContext

    render() {
        const {theme} = this.context
        return <div className={cnb(css['theme--' + theme], 'grid')}>
            <div onClick={this.props.onClick} className={'inline-block relative'}>
                <div className={css.root}>
                    &nbsp;
                </div>

                <Button className={css.mockPlus} focus={false} size={'x-small'} iconLeft={'plus'}/>
            </div>
        </div>
    }
}
