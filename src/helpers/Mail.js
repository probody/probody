import nodemailer from 'nodemailer';
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
        host: "mail.probody.kz",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD
        },
    }),
    senderInfo = {
        from: 'ProBody.kz <' + process.env.MAIL_ACCOUNT + '>'
    },
    templates = {
        confirmMail: {
            ...senderInfo,
            subject: 'Confirm your account',
            html: fs.readFileSync(path.resolve('mail/approve.template.html'), 'utf8')
        }
    }

export default class Mail {
    recipients = []
    config = {}

    constructor(type, /* confirmMail */ subsitutions) {
        this.config = templates[type]

        for (let key in subsitutions) {
            this.config.html = this.config.html.replace(`{{${key}}}`, subsitutions[key])
        }
    }

    addRecipient() {
        this.recipients.push(...arguments)

        return this
    }

    async send() {
        return transporter.sendMail(Object.assign({}, this.config, {
            to: this.recipients.join(', ')
        }))
    }
}
