import React from "react";
import css from "../../styles/kit/modal-content.module.scss";
import Button from "../kit/Button.jsx";
import {GlobalContext} from "../../contexts/Global.js";
import {withRouter} from "next/router.js";
import {isValidPhoneNumber} from "libphonenumber-js";
import APIRequests from "../../helpers/APIRequests.js";
import {cnb} from "cnbuilder";
import Icon from "../kit/Icon.jsx";
import TextInput from "../kit/Form/TextInput.jsx";
import OTPInput from "../kit/Form/OTPInput.jsx";
import UserHelper from "../../helpers/UserHelper.js";

class ForgotModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 0,
            interval: null,
            secondsBeforeResend: 30,
            phone: '+7',
            password: '',
            code: '',
            errors: {
                phone: '',
                password: '',
                code: ''
            }
        }

        this.setField = this.setField.bind(this)
        this.validateCredentials = this.validateCredentials.bind(this)
        this.requestReset = this.requestReset.bind(this)
        this.verifyCode = this.verifyCode.bind(this)
        this.resendCode = this.resendCode.bind(this)
        this.savePassword = this.savePassword.bind(this)
    }

    static contextType = GlobalContext

    setField(field, value) {
        this.setState({
            [field]: value
        })
    }

    validateCredentials(field) {
        switch (field) {
            case 'phone':
                return isValidPhoneNumber(this.state.phone, 'KZ')

            case 'code':
                return this.state.code.length === 5

            case 'password':
                return this.state.password.length >= 6
        }
    }

    async requestReset() {
        await this.setState({
            errors: {
                phone: '',
            }
        })

        try {
            const response = await APIRequests.requestPasswordReset(this.state.phone)

            if (!response.ok) {
                this.setState({
                    errors: {
                        phone: this.context.t('phone_' + (await response.json()).message)
                    }
                })
            } else {
                const intervalId = setInterval(() => {
                    this.setState({
                        secondsBeforeResend: this.state.secondsBeforeResend - 1
                    })

                    if (this.state.secondsBeforeResend === 0) {
                        clearInterval(intervalId)
                    }
                }, 1000)

                this.setState({
                    step: this.state.step + 1
                })
            }
        } catch (e) {
        }
    }

    async verifyCode() {
        await this.setState({
            errors: {
                code: ''
            }
        })

        try {
            const response = await APIRequests.verifyResetCode(this.state.phone, this.state.code)

            if (!response.ok) {
                this.setState({
                    errors: {
                        code: this.context.t('phone_' + (await response.json()).message)
                    }
                })
            } else {
                this.setState({
                    step: this.state.step + 1
                })
            }
        } catch (e) {
        }
    }

    resendCode() {
        this.setState({
            secondsBeforeResend: 30
        })

        APIRequests.resendCode(this.state.phone, 'reset')
    }

    async savePassword() {
        await this.setState({
            errors: {
                password: ''
            }
        })

        try {
            const response = await APIRequests.changePassword(this.state.phone, this.state.code, this.state.password)

            if (response.ok) {
                UserHelper.logIn((await response.json()).jwt)

                this.context.openModal('changedPassword')
            }
        } catch (e) {}
    }

    render() {
        const {t, openModal, theme, isMobile} = this.context

        return <div className={css['theme--' + theme]}>
            <div className={cnb(css.modalHead, isMobile ? css.mobile : css.desktop)}>
                {isMobile && <div>&nbsp;</div>}

                <h2>{t('passwordRestoration')}</h2>

                <Icon name={'close'} onClick={() => openModal('')}/>
            </div>

            <div className={cnb(css.body, isMobile ? css.mobile : css.desktop)}>
                {this.state.step === 0 && <div>
                    <h1>{t('enterYourPhoneNumber')}</h1>
                    <p>{t('wellSendResetCodeThere')}</p>

                    <TextInput error={this.state.errors.phone} style={{marginTop: 12}}
                               label={t('phoneNumber')}
                               placeholder={t('enterYourPhoneNumber')}
                               value={this.state.phone} onUpdate={val => this.setField('phone', val)} type={'phone'}
                               variant={'underline'}/>

                    <Button color={theme === 'dark' ? 'primary' : 'secondary'}
                            isDisabled={!this.validateCredentials('phone')}
                            style={{marginTop: 24}} onClick={this.requestReset}
                            size={'fill'}>
                        <div className={'flex justify-between vertical-center'}>
                            <span>{t('getCode')}</span>
                            <Icon name={'arrow_right'} className={css.arrowRight}/>
                        </div>
                    </Button>
                </div>}

                {this.state.step === 1 && <div>
                    <h1>{t('enterYourCode')}</h1>
                    <p>{t('weHaveSentCodeTo')} {this.state.phone}</p>

                    <OTPInput style={{marginTop: 16}} error={this.state.errors.code} onUpdate={val => this.setField('code', val)} />

                    <div className={'flex justify-center'} style={{marginTop: 32}}>
                        {this.state.secondsBeforeResend > 0 && <span>{t('resendWithin')} 00:{String(this.state.secondsBeforeResend).padStart(2, '0')}</span>}
                        {this.state.secondsBeforeResend <= 0 && <Button size={'small'} onClick={this.resendCode}>{t('resendCode')}</Button>}
                    </div>

                    <Button color={theme === 'dark' ? 'primary' : 'secondary'}
                            isDisabled={!this.validateCredentials('code')}
                            style={{marginTop: 24}} onClick={this.verifyCode}
                            size={'fill'}>

                        <div className={'flex justify-between vertical-center'}>
                            <span>{t('createNewPassword')}</span>
                            <Icon name={'arrow_right'} className={css.arrowRight}/>
                        </div>
                    </Button>
                </div>}

                {this.state.step === 2 && <div>
                    <h1>{t('composeNewPassword')}</h1>
                    <p>{t('passwordCanOnlyContain')}</p>

                    <TextInput autoComplete={'new-password'} style={{marginTop: 16}} type={'password'} label={t('password')} placeholder={t('enterYourPassword')} value={this.state.password} onUpdate={val => this.setField('password', val)} />

                    <Button color={theme === 'dark' ? 'primary' : 'secondary'}
                            isDisabled={!this.validateCredentials('password')}
                            style={{marginTop: 24}} onClick={this.savePassword}
                            size={'fill'}>
                        <div className={'flex justify-between vertical-center'}>
                            <span>{t('savePassword')}</span>
                            <Icon name={'arrow_right'} className={css.arrowRight}/>
                        </div>
                    </Button>
                </div>}
            </div>
        </div>;
    }
}

export default withRouter(ForgotModal);
