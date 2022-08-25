import React, {useEffect, useState} from "react";
import UserHelper from "../helpers/UserHelper";
import {useRouter} from "next/router";
import APIRequests from "../helpers/APIRequests";
import Head from "next/head";
import {TITLE_POSTFIX} from "../helpers/constants";
import TextInput from "../components/kit/form/TextInput";

export default function AdminLoginPage() {
    const router = useRouter()
    const [validationErrors, setValidationErrors] = useState({
        phone: '',
        password: ''
    })

    const [credentials, setCredentials] = useState({
        phone: '+7',
        password: ''
    })

    useEffect(() => {
        if (UserHelper.isLoggedIn() && router.pathname === '/') {
            router.push('/workers')
        }
    }, [router])

    async function logIn() {
        setValidationErrors({
            phone: '',
            password: ''
        })

        try {
            const response = await APIRequests.logIn(credentials.phone, credentials.password)

            if (['Validation error', 'Error'].includes(response.type)) {
                if (response.field === 'password') {
                    this.setState({
                            ...validationErrors,
                            password: 'Неверный пароль'
                        })
                } else {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            phone: 'Аккаунт не найден'
                        }
                    })
                }
            } else {
                UserHelper.logIn(response.jwt)

                router.push('/workers')
            }
        } catch (e) {
        }
    }

    return <>
        <Head>
            <title>Вход{TITLE_POSTFIX}</title>
        </Head>

        <div className={'fill'} style={{background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>
            <div className="card" style={{borderRadius: 20, maxWidth: 420}}>
                <div className="card-body" style={{padding: 30}}>
                    <form onSubmit={e => {
                        e.preventDefault()
                        logIn()
                    }}>
                        <h1 className={'textSubtitle1'}>Вход в админ-панель probody.kz</h1>
                        <p className="textM" style={{marginTop: 16, marginBottom: 24}}>Введите свой номер телефона <br/>и пароль для входа на сервис</p>
                        <TextInput style={{marginBottom: 12}} label={'Номер телефона'} placeholder={''} value={credentials.phone} type={'phone'} onUpdate={val => setCredentials({
                            ...credentials,
                            phone: val
                        })} />
                        <TextInput style={{marginBottom: 24}} label={'Пароль'} placeholder={'Пароль'} value={credentials.password} type={'password'} onUpdate={val => setCredentials({
                            ...credentials,
                            password: val
                        })} />
                        <div className="grid">
                        <button className={'btn btn-accent1-primary d-flex items-center justify-between'} type={'submit'}>
                            <span>Войти в аккаунт</span>
                            <svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.91016 16.9201L8.43016 10.4001C9.20016 9.63008 9.20016 8.37008 8.43016 7.60008L1.91016 1.08008" stroke="#252420" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}
