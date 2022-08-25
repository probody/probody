import {createHmac} from "crypto"

export default class Password {
    constructor(rawPassword) {
        this.rawPassword = rawPassword
    }

    fingerPrint() {
        return createHmac('sha256', process.env.PASSWORD_SALT)
            .update(this.rawPassword)
            .digest('hex')
    }

    equal(hash) {
        return this.fingerPrint() === hash
    }
}
