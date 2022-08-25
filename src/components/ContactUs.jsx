import React from "react";
import {GlobalContext} from "../contexts/Global.js";
import PropTypes from "prop-types";
import InfoBlock from "./kit/InfoBlock";
import TextInput from "./kit/Form/TextInput";
import TextArea from "./kit/Form/TextArea";
import Button from "./kit/Button.jsx";
import APIRequests from "../helpers/APIRequests.js";
import {isValidNumber} from "libphonenumber-js";
import css from '../styles/contactus.module.scss'
import Icon from "./kit/Icon.jsx";
import Modal from "./kit/Modal.jsx";
import {withRouter} from "next/router.js";
import {cnb} from "cnbuilder";
import Link from "next/link.js";

class ContactUs extends React.Component {
    static contextType = GlobalContext

    static propTypes = {
        single: PropTypes.bool
    }

    constructor(props) {
        super(props);

        this.state = {
            phone: '+7',
            messageText: '',
            successDialogOpen: false
        }

        this.sendMessage = this.sendMessage.bind(this)
        this.validateInputs = this.validateInputs.bind(this)
        this.closeSuccessDialog = this.closeSuccessDialog.bind(this)
    }

    validateInputs() {
        return this.state.messageText.length !== 0 && isValidNumber(this.state.phone);
    }

    sendMessage() {
        if (!this.validateInputs()) {
            return
        }

        APIRequests.leaveSupportMessage(this.state.phone, this.state.messageText).then(() => this.setState({
            phone: '+7',
            messageText: '',
            successDialogOpen: true
        }))
    }

    closeSuccessDialog() {
        this.setState({
            successDialogOpen: false
        })
    }

    render() {
        const {t, isMobile, theme} = this.context
        return <>
            <Modal open={this.state.successDialogOpen} isMobile={false} desktopWidth={375}
                   onUpdate={this.closeSuccessDialog}>
                <div>
                    <div className={css.modalBody}>
                        <p>{t('thanks')}</p>
                        <h1>{t('yourRequestIsSent')}</h1>

                        <p style={{paddingTop: 16}}>{t('wellContactYouShort')}</p>

                        <Button size={'fill'} onClick={() => this.props.router.push('/')}>{t('toMainPage')}</Button>

                        <Icon name={'close'} className={css.modalClose} onClick={this.closeSuccessDialog}/>
                    </div>
                </div>
            </Modal>

            <div bp={'grid'} className={cnb('responsive-content', css['theme--' + theme])} style={{gap: isMobile ? '64px 0' : 16}}>
                <div bp={'12 8@md'} style={{maxWidth: isMobile ? 'unset' : "calc(100% - 135px)"}}>
                    <h1 className={'text-xl'}
                        style={{marginBottom: 12}}>{this.props.single ? t('wellBeHappyToHearYou') : t('ifYouHaveQuestions')}</h1>
                    <p style={{marginBottom: 32}} className={'text-disabled smallOnMobile'}>{t('pleaseSelectMessageChannel')}</p>

                    <InfoBlock style={{padding: isMobile ? 20 : 40}}>
                        <div bp={'grid 12 6@md'} style={{gap: isMobile ? '24px 0' : '28px 55px'}}>
                            <div className={css.contactBlock}>
                                <div className={css.caption}>{t('callUs')}</div>
                                <Link href={'tel:+77629878791'}><p>+7 (762) 987-87-91</p></Link>
                            </div>

                            <div className={css.contactBlock}>
                                <div className={css.caption}>{t('goToTGbot')}</div>
                                <a target={'_blank'} href="https://t.me/probodykzbot">@probodykzbot</a>
                            </div>

                            <div className={css.contactBlock}>
                                <div className={css.caption}>{t('writeToWA')}</div>
                                <a target={'_blank'} href="https://wa.me/77629878791">+7 (762) 987-87-91</a>
                            </div>

                            <div className={css.contactBlock}>
                                <div className={css.caption}>{t('writeToEmail')}</div>
                                <a target={'_blank'} href="mailto:info@probody.kz">info@probody.kz</a>
                            </div>
                        </div>
                        <div className={css.spacer}></div>

                        <p style={{marginBottom: 20}} className={css.textDisabled}>{t('youCanFindAnswer')}</p>

                        <Button size={'large'} color={'onTheDark'} onClick={() => this.props.router.push('/account/faq')}>{t('faq')}</Button>
                    </InfoBlock>
                </div>
                <div bp={'12 4@md'}>
                    <h2 className="subtitle2" style={{marginBottom: 8}}>{t('rapidConnection')}</h2>
                    <p className={'text-disabled smallOnMobile'} style={{marginBottom: 16}}>{t('wellContactYou')}</p>
                    <TextInput style={{marginBottom: 12}} label={t('yourPhoneNumber')} placeholder={''} type={'phone'}
                               value={this.state.phone} onUpdate={phone => this.setState({phone})}/>
                    <TextArea label={t('message')} max={200} placeholder={t('enterMessageText')} type={'phone'}
                              value={this.state.messageText} onUpdate={messageText => this.setState({messageText})}/>

                    <Button size={'large'} style={{marginTop: 16}}
                            onClick={this.sendMessage}>{t('sendMessageLong')}</Button>
                </div>
            </div>
        </>
    }
}

export default withRouter(ContactUs)
