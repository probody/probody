import express from "express"
import jsonwebtoken from 'jsonwebtoken'
import {parsePhoneNumber} from "libphonenumber-js"
import * as AuthValidator from "../../validators/Auth.js"
import User from '../../models/User.model.js'
import RedisHelper from "../../helpers/RedisHelper.js"
import Password from "../../helpers/Password.js";
import SMSApproval from "../../helpers/SMSApproval.js"
import AuthorizedToken from "../../models/AuthorizedToken.model.js"

const router = express.Router()

router.post('/register', AuthValidator.onlyPhone, async (req, res) => {
    try {
        let {phone} = req.body;

        phone = parsePhoneNumber(phone, process.env.PHONE_REGION).number

        const usersRedisKey = 'pending:register:' + phone

        let userNotExistsInMongo = (await User.countDocuments({phone})) === 0,
            userNotExistsInRedis = !Boolean(await RedisHelper.exists(usersRedisKey))

        if (userNotExistsInMongo && !userNotExistsInRedis) {
            return res.status(406).json({
                message: "codeAlreadySent"
            })
        }

        if (userNotExistsInMongo && userNotExistsInRedis) {
            const approval = new SMSApproval(phone)

            await RedisHelper.set(usersRedisKey, JSON.stringify({
                phone,
                approvalCode: approval.code
            }))
            await RedisHelper.expire(usersRedisKey, 15 * 60)

            await approval.send()

            res.json({
                message: "createdUser"
            })
        } else {
            res.status(422).json({
                message: "alreadyExists"
            })
        }
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

router.post('/checkcode', AuthValidator.onlyPhone, async (req, res) => {
    let {phone, code} = req.body

    phone = parsePhoneNumber(phone, process.env.PHONE_REGION).number

    const usersRedisKey = 'pending:register:' + phone
    let userDoc = await RedisHelper.get(usersRedisKey)

    if (!userDoc) {
        return res.status(422).json({
            type: 'Error',
            message: 'userNotFound'
        })
    }

    userDoc = JSON.parse(userDoc)

    if (userDoc.approvalCode !== String(code)) {
        return res.status(406).json({
            type: 'Error',
            message: 'invalidApprovalCode'
        })
    }

    res.send('ok')
})

router.post('/checkcode/reset', AuthValidator.onlyPhone, async (req, res) => {
    let {phone, code} = req.body

    phone = parsePhoneNumber(phone, process.env.PHONE_REGION).number

    const usersRedisKey = 'password_reset:' + phone
    let userDoc = await RedisHelper.get(usersRedisKey)

    if (!userDoc) {
        return res.status(422).json({
            type: 'Error',
            message: 'userNotFound'
        })
    }

    if (userDoc !== String(code)) {
        return res.status(406).json({
            type: 'Error',
            message: 'invalidApprovalCode'
        })
    }

    res.send('ok')
})

router.patch('/approve', AuthValidator.phoneAndPassword, async (req, res) => {
    let {phone, code, password} = req.body

    phone = parsePhoneNumber(phone, process.env.PHONE_REGION).number

    const usersRedisKey = 'pending:register:' + phone
    let userDoc = await RedisHelper.get(usersRedisKey)

    if (!userDoc) {
        return res.status(422).json({
            type: 'Error',
            message: 'userNotFound'
        })
    }

    userDoc = JSON.parse(userDoc)

    if (userDoc.approvalCode !== String(code)) {
        return res.status(406).json({
            type: 'Error',
            message: 'invalidApprovalCode'
        })
    }

    userDoc = await (new User({
        password: (new Password(password)).fingerPrint(),
        phone: userDoc.phone
    })).save()

    await RedisHelper.unlink(usersRedisKey)

    const signedToken = jsonwebtoken.sign({
        data: userDoc._id
    }, process.env.JWT_SECRET, {expiresIn: '30d'})

    await (new AuthorizedToken({
        userId: userDoc._id,
        token: signedToken
    })).save()

    return res.json({
        type: 'Success',
        jwt: signedToken
    })
})

router.post('/resend-sms', AuthValidator.resendSMS, async (req, res) => {
    let {phone, target} = req.body,
        code = '',
        redisKey = ''

    phone = parsePhoneNumber(phone, process.env.PHONE_REGION).number

    if (await RedisHelper.exists('ban:sms:' + phone)) {
        return res.status(425).json({
            type: 'Error',
            message: 'tooEarly'
        })
    }

    switch (target) {
        case 'reset':
            redisKey = `password_reset:${phone}`
            code = await RedisHelper.get(redisKey)

            if (!code) {
                return res.status(422).json({
                    type: 'Error',
                    message: 'codeNotFound'
                })
            }

            await RedisHelper.expire(redisKey, 15 * 60)
            break

        case 'register':
            redisKey = 'pending:register:' + phone
            code = await RedisHelper.get(redisKey)

            if (!code) {
                return res.status(422).json({
                    type: 'Error',
                    message: 'codeNotFound'
                })
            }

            code = (JSON.parse(code)).approvalCode

            await RedisHelper.expire(redisKey, 15 * 60)
    }

    await (new SMSApproval(phone, code)).send()

    return res.status(202).json({
        type: 'Success',
        message: 'SMSResent'
    })
})

router.post('/login', AuthValidator.auth, async (req, res) => {
    try {
        let {password, phone} = req.body;

        phone = parsePhoneNumber(phone, process.env.PHONE_REGION).number

        let userDoc = await User.findOne(Object.assign({phone}, req.query.admin ? {role: {$ne: 'serviceProvider'}} : {role: 'serviceProvider'}))

        if (userDoc) {
            if ((new Password(password)).equal(userDoc.password)) {
                const signedToken = jsonwebtoken.sign({
                    data: userDoc._id
                }, process.env.JWT_SECRET, {expiresIn: '30d'});

                await (new AuthorizedToken({
                    userId: userDoc._id,
                    token: signedToken
                })).save()

                return res.json({
                    type: 'Success',
                    jwt: signedToken
                })
            } else {
                return res.status(401).json({
                    type: 'Error',
                    message: "invalidCredentials",
                    field: 'password'
                });
            }
        }

        res.status(401).json({
            type: 'Error',
            message: "invalidCredentials",
            field: 'phone'
        });
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
})

router.post('/logout', async (req, res) => {
    await AuthorizedToken.findOneAndDelete({token: req.headers['x-auth-token']})

    res.json({
        message: 'loggedOut'
    })
})

router.post('/request-reset', AuthValidator.onlyPhone, async (req, res) => {
    let {phone} = req.body

    phone = parsePhoneNumber(phone, process.env.PHONE_REGION).number

    const usersRedisKey = 'password_reset:' + phone
    let userDoc = await RedisHelper.get(usersRedisKey)

    if (userDoc) {
        return res.status(406).json({
            type: 'Error',
            message: 'codeAlreadySent'
        })
    }

    userDoc = await User.findOne({phone})

    if (!userDoc) {
        return res.status(422).json({
            message: 'accountNotFound'
        })
    }

    const smsOTP = new SMSApproval(phone),
        redisResetKey = `password_reset:${phone}`

    await RedisHelper.set(redisResetKey, smsOTP.code)
    await RedisHelper.expire(redisResetKey, 15 * 60)

    await smsOTP.send()

    res.status(202).json({
        message: 'SMSWasSent'
    })
})

router.patch('/update-password', AuthValidator.phoneAndPassword, async (req, res) => {
    let {phone, code, password} = req.body

    phone = parsePhoneNumber(phone, process.env.PHONE_REGION).number

    const redisResetKey = `password_reset:${phone}`

    if ((await RedisHelper.get(redisResetKey)) !== String(code)) {
        return res.status(401).json({
            type: 'Error',
            message: 'invalidOTP'
        })
    }

    const userDoc = await User.countDocuments({phone})

    if (userDoc === 0) {
        return res.status(422).json({
            type: 'Error',
            message: 'accountNotFound'
        })
    }

    await User.updateOne({phone}, {password: (new Password(password)).fingerPrint()})

    res.status(202).json({
        type: 'Success',
        message: 'passwordUpdated'
    })
})

export default router
