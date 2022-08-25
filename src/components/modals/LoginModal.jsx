import React from "react";
import {GlobalContext} from "../../contexts/Global.js";
import Icon from "../kit/Icon.jsx";
import css from '../../styles/kit/modal-content.module.scss';
import TextInput from "../kit/Form/TextInput";
import Button from "../kit/Button.jsx";
import {isValidPhoneNumber} from "libphonenumber-js";
import APIRequests from "../../helpers/APIRequests.js";
import UserHelper from "../../helpers/UserHelper.js";
import {cnb} from "cnbuilder";

export default class LoginModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            phone: '+7',
            password: '',
            errors: {
                phone: '',
                password: ''
            }
        }

        this.setField = this.setField.bind(this)
        this.validateCredentials = this.validateCredentials.bind(this)
        this.logIn = this.logIn.bind(this)
    }

    static contextType = GlobalContext

    setField(field, value) {
        this.setState({
            [field]: value
        })
    }

    validateCredentials() {
        return isValidPhoneNumber(this.state.phone, 'KZ') && this.state.password.length >= 6
    }

    async logIn() {
        await this.setState({
            errors: {
                phone: '',
                password: ''
            }
        })

        try {
            const response = await APIRequests.logIn(this.state.phone, this.state.password)

            if (response.type === 'Error') {
                if (response.field === 'password') {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            password: this.context.t('passwordIsWrong')
                        }
                    })
                } else {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            phone: this.context.t('phoneIsWrong')
                        }
                    })
                }
            } else {
                UserHelper.logIn(response.jwt)

                this.context.openModal('')
            }
        } catch (e) {
        }
    }

    render() {
        const {t, openModal, theme, isMobile} = this.context

        return <div className={css['theme--' + theme]}>
                <div className={cnb(css.modalHead, isMobile ? css.mobile : css.desktop)}>
                    {isMobile && <div>&nbsp;</div>}

                    <h2>{t(isMobile ? 'logIn' : 'toLogIn')}</h2>

                    <Icon name={'close'} onClick={() => openModal('')}/>
                </div>

                <div className={cnb(css.body, isMobile ? css.mobile : css.desktop)}>
                    <h1>{t('enterYourCredentials')}</h1>
                    <p>{t('forAuth')}</p>

                    <TextInput error={this.state.errors.phone} style={{marginTop: 12}} label={t('phoneNumber')}
                               placeholder={t('enterYourPhoneNumber')}
                               value={this.state.phone} onUpdate={val => this.setField('phone', val)} type={'phone'}
                               variant={'underline'}/>
                    <TextInput error={this.state.errors.password} style={{marginTop: 12}} label={t('password')}
                               placeholder={t('enterYourPassword')} autoComplete={'current-password'}
                               value={this.state.password} onUpdate={val => this.setField('password', val)}
                               type={'password'} variant={'underline'}/>
                    <p onClick={() => openModal('forgot')} className={css.hint}>{t('qForgotPassword')}</p>

                    <Button color={theme === 'dark' ? 'primary' : 'secondary'} isDisabled={!this.validateCredentials()}
                            style={{marginTop: 24}} onClick={this.logIn}
                            size={'fill'}>
                        <div className={'flex justify-between vertical-center'}>
                            <span>{t('logInFull')}</span>
                            <Icon name={'arrow_right'} className={css.arrowRight}/>
                        </div>
                    </Button>

                    <div style={{marginTop: 16}}>
                        <p className={css.caption}>{t('qDontHaveAccount')}</p>
                        <p className={'cursor-pointer'} onClick={() => openModal('register')}>{t('register')}</p>
                    </div>
                </div>
        </div>
    }
}
