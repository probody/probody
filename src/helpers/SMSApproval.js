import fetch from 'node-fetch'
import RedisHelper from "./RedisHelper.js";

export const APPROVAL_LENGTH = 5

export default class SMSApproval {
    code = ''
    phone = ''

    constructor(phone, code = null) {
        this.phone = phone

        if (!code) {
            this.generateCode()
        } else {
            this.code = code
        }
    }

    generateCode() {
        let code = ''
        const characters = '0123456789',
            charactersLength = characters.length

        for (let i = 0; i < APPROVAL_LENGTH; i++) {
            code += characters.charAt(Math.floor(Math.random() *
                charactersLength))
        }

        this.code = code
    }

    async send() {
        //ban sms resend for 30sec
        const redisBanKey = 'ban:sms:' + this.phone

        await RedisHelper.set(redisBanKey, '')
        await RedisHelper.expire(redisBanKey, 30)

        return fetch(`https://api.mobizon.kz/service/message/sendsmsmessage?recipient=${this.phone}&text=${this.code}%20%E2%80%93%20%D0%92%D0%B0%D1%88%20%D0%BA%D0%BE%D0%B4%20%D0%B4%D0%BB%D1%8F%20%D0%B2%D1%85%D0%BE%D0%B4%D0%B0%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82.%0A%40probody.kz%20%23${this.code}&apiKey=${process.env.SMS_API_KEY}`)
            .catch(console.error)
    }

    get code () {
        return this.code
    }
}
