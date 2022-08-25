import React from "react";
import PropTypes from "prop-types";
import css from '../../styles/kit/parameterview.module.scss';
import {GlobalContext} from "../../contexts/Global.js";
import {declination} from "../../helpers/String.js";

class ParameterView extends React.Component {
    static propTypes = {
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        hair: PropTypes.string.isRequired,
        eyes: PropTypes.string.isRequired,
        age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        bust: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    }

    render() {
        const {t, theme} = this.context
        return <div className={css['theme--' + theme]}>
            <div className={css.root} bp={'grid 4 2@md'}>
                <div>
                    <div className={css.label}>{t('age')}</div>
                    <div className={css.value}>{this.props.age}&nbsp;{declination(this.props.age, t('yearDeclination'))}</div>
                </div>
                <div>
                    <div className={css.label}>{t('weight')}</div>
                    <div className={css.value}>{this.props.weight}&nbsp;{t('kg')}</div>
                </div>
                <div>
                    <div className={css.label}>{t('bust')}</div>
                    <div className={css.value}>{this.props.bust}&nbsp;{t('size')}</div>
                </div>
                <div>
                    <div className={css.label}>{t('height')}</div>
                    <div className={css.value}>{this.props.height}&nbsp;{t('cm')}</div>
                </div>
                <div>
                    <div className={css.label}>{t('eyes')}</div>
                    <div className={css.value}>{this.props.eyes}</div>
                </div>
                <div>
                    <div className={css.label}>{t('hair')}</div>
                    <div className={css.value}>{this.props.hair}</div>
                </div>
            </div>
        </div>
    }
}

ParameterView.contextType = GlobalContext

export default ParameterView
