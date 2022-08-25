import React from "react";
import {cnb} from "cnbuilder";
import css from "../styles/about-us.module.scss";
import InfoBlock from "./kit/InfoBlock.jsx";
import {GlobalContext} from "../contexts/Global.js";
import Icon from "./kit/Icon.jsx";
import PropTypes from "prop-types";

export default class ShareInSocialMedia extends React.Component {
    static contextType = GlobalContext

    static propTypes = {
        thin: PropTypes.bool,
        url: PropTypes.string,
        onClick: PropTypes.func
    }

    static defaultProps = {
        thin: false,
        url: 'https://probody.kz'
    }

    render() {
        const {t, theme, isMobile} = this.context;

        return <InfoBlock
            style={Object.assign({}, this.props.style, (this.props.thin && !isMobile) ? {padding: 20} : {})}>
            <div className={cnb(css['theme--' + theme], css['socialRoot' + (this.props.thin ? '_thin' : '')])}>
                <h3 style={{marginBottom: 12}}>{t('shareInSocial')}</h3>
                <div className={cnb(css.socialBlock)}>
                    <div>
                        <a target={'_blank'} href={`https://vk.com/share.php?url=${this.props.url}`} onClick={() => this.props.onClick && this.props.onClick()}>
                            <div className={css.img}>
                                <Icon name={'vk_' + theme}/>
                            </div>
                        </a>
                    </div>
                    <div>
                        <a target={'_blank'} href={`https://www.facebook.com/sharer/sharer.php?u=${this.props.url}`} onClick={() => this.props.onClick && this.props.onClick()}>
                            <div className={css.img}>
                                <Icon name={'fb_' + theme}/>
                            </div>
                        </a>
                    </div>
                    <div>
                        <a target={'_blank'} href={`https://connect.ok.ru/offer?url=${this.props.url}`} onClick={() => this.props.onClick && this.props.onClick()}>
                            <div className={css.img}>
                                <Icon name={'ok_' + theme}/>
                            </div>
                        </a>
                    </div>
                    <div>
                        <a target={'_blank'} href={`viber://forward?text=${this.props.url}`} onClick={() => this.props.onClick && this.props.onClick()}>
                            <div className={css.img}>
                                <Icon name={'vi_' + theme}/>
                            </div>
                        </a>
                    </div>
                    <div>
                        <a target={'_blank'} href={`https://api.whatsapp.com/send?text=${this.props.url}`} onClick={() => this.props.onClick && this.props.onClick()}>
                            <div className={css.img}>
                                <Icon name={'wa_' + theme}/>
                            </div>
                        </a>
                    </div>
                    <div>
                        <a target={'_blank'} href={`https://t.me/share/url?url=${this.props.url}`} onClick={() => this.props.onClick && this.props.onClick()}>
                            <div className={css.img}>
                                <Icon name={'tg_' + theme}/>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </InfoBlock>
    }
}
