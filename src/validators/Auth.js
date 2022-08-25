import {parsePhoneNumber} from 'libphonenumber-js'
import PostValidator from "../helpers/PostValidator.js";

export async function register(req, res, next) {
    let {password, phone} = req.body;

    req.validation = []

    if (password) {
        if (password.length < 6) {//проверяем пароль
            req.validation.push({text: 'tooShortPassword', field: 'password'})
        }
        if (password.length > 50) {
            req.validation.push({text: 'tooLongPassword', field: 'password'})
        }
    } else {
        req.validation.push({text: 'emptyPassword', field: 'password'})
    }

    if (phone) {
        let parsedPhone
        try {
            parsedPhone = parsePhoneNumber(phone, process.env.PHONE_REGION)

            if (!parsedPhone.isValid()) {//проверка валидности номера телефона
                req.validation.push({text: 'invalidPhone', field: 'phone'})
            }
        } catch (e) {
            req.validation.push({text: 'invalidPhone', field: 'phone'})
        }
    } else {
        req.validation.push({text: 'emptyPhone', field: 'phone'})
    }

    return PostValidator(req, res, next)
}

export async function onlyPhone(req, res, next) {
    let {phone} = req.body;

    req.validation = []

    if (phone) {
        let parsedPhone
        try {
            parsedPhone = parsePhoneNumber(phone, process.env.PHONE_REGION)

            if (!parsedPhone.isValid()) {//проверка валидности номера телефона
                req.validation.push({text: 'invalidPhone', field: 'phone'})
            }
        } catch (e) {
            req.validation.push({text: 'invalidPhone', field: 'phone'})
        }
    } else {
        req.validation.push({text: 'emptyPhone', field: 'phone'})
    }


    return PostValidator(req, res, next)
}

export async function resendSMS(req, res, next) {
    let {phone, target} = req.body;

    req.validation = []

    if (phone) {
        let parsedPhone
        try {
            parsedPhone = parsePhoneNumber(phone, process.env.PHONE_REGION)

            if (!parsedPhone.isValid()) {//проверка валидности номера телефона
                req.validation.push({text: 'invalidPhone', field: 'phone'})
            }
        } catch (e) {
            req.validation.push({text: 'invalidPhone', field: 'phone'})
        }
    } else {
        req.validation.push({text: 'emptyPhone', field: 'phone'})
    }

    if (!['2FA', 'register', 'reset'].includes(target)) {
        req.validation.push({text: 'unknownTarget', field: 'target'})
    }

    return PostValidator(req, res, next)
}

export async function auth(req, res, next) {
    try {
        let {password, phone} = req.body;

        req.validation = []
        if (password) {
            if (password.length < 6) {//проверяем пароль
                req.validation.push({text: 'tooShortPassword', field: 'password'})
            }
            if (password.length > 50) {
                req.validation.push({text: 'tooLongPassword', field: 'password'})
            }
        } else {
            req.validation.push({text: 'emptyPassword', field: 'password'})
        }

        if (phone) {
            const parsedPhone = parsePhoneNumber(phone, process.env.PHONE_REGION)

            if (!parsedPhone.isValid()) {//проверка валидности номера телефона
                req.validation.push({text: 'invalidPhone', field: 'phone'})
            }
        } else {
            req.validation.push({text: 'emptyPhone', field: 'phone'})
        }

        return PostValidator(req, res, next)
    } catch (e) {
        req.validation.push({text: 'invalidPhone', field: 'phone'})

        return PostValidator(req, res, next)
    }
}

export async function phoneAndPassword(req, res, next) {
    try {
        let {password, phone} = req.body;

        req.validation = []
        if (password) {
            if (password.length < 6) {//проверяем пароль
                req.validation.push({text: 'tooShortPassword', field: 'password'})
            }
            if (password.length > 50) {
                req.validation.push({text: 'tooLongPassword', field: 'password'})
            }
        } else {
            req.validation.push({text: 'emptyPassword', field: 'password'})
        }

        if (phone) {
            const parsedPhone = parsePhoneNumber(phone, process.env.PHONE_REGION)

            if (!parsedPhone.isValid()) {//проверка валидности номера телефона
                req.validation.push({text: 'invalidPhone', field: 'phone'})
            }
        } else {
            req.validation.push({text: 'emptyPhone', field: 'phone'})
        }

        return PostValidator(req, res, next)
    } catch (e) {
        req.validation.push({text: 'invalidPhone', field: 'phone'})

        return PostValidator(req, res, next)
    }
}
