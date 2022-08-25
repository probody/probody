import React from "react";
import PropTypes from "prop-types";
import InfoBlock from "./InfoBlock";
import css from '../../styles/kit/program.module.scss'
import {GlobalContext} from "../../contexts/Global.js";
import Button from "./Button.jsx";
import Icon from "./Icon.jsx";
import {cnb} from "cnbuilder";
import {formatPrice} from "../../helpers/String.js";
import Link from "next/link.js";

class Program extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        classicCnt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        eroticCnt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        relaxCnt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        link: PropTypes.string,
    }

    render() {
        const {t, theme} = this.context
        // maxWidth: 425, minWidth: 350
        return <div className={css['theme--' + theme]}><InfoBlock>
            <p className="subtitle2" style={{marginBottom: 16}}>{this.props.title}</p>
            <p style={{overflowWrap: 'anywhere'}}>{this.props.description}</p>
            <ul className={css.massageList}>
                {this.props.eroticCnt > 0 && <li>{this.props.eroticCnt}&nbsp;{t('eroticMassage')}</li>}
                {this.props.classicCnt > 0 && <li>{this.props.classicCnt}&nbsp;{t('classicMassage')}</li>}
                {this.props.relaxCnt > 0 && <li>{this.props.relaxCnt}&nbsp;{t('relaxMassage')}</li>}
            </ul>
            <div style={{
                borderBottom: '1px solid #616161',
                width: '100%',
                marginBottom: 16,
                height: 0,
            }}>&nbsp;</div>
            <div className={cnb('flex', 'justify-between', css.secondSection)}>
                <div>
                    <div className={'items-center'} style={{marginBottom: 12}}>
                        <Icon style={{width: 20, height: 20, marginRight: 5, marginLeft: -3}} name={'clock'}/>
                        <p className={'subtitle2 number-font'}>{this.props.duration}&nbsp;{t('minutesShort')}</p>
                    </div>
                    <div className={'items-center'}>
                        <Icon style={{width: 14, height: 14, marginRight: 8}} name={'kzt'} />
                        <p className={'subtitle2 number-font'}>{formatPrice(this.props.price)}</p>
                    </div>
                </div>
                <div className={css.flexEnd}>
                    {this.props.link && <a href={this.props.link} target={'_blank'} onClick={this.props.onClick}><Button size={'medium'}>{t('apply')}</Button></a>}
                </div>
            </div>
        </InfoBlock></div>
    }
}
Program.contextType = GlobalContext

export default Program
