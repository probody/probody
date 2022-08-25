import express from "express";
import SupportTicket from "../../models/SupportTicket.model.js";
import {parsePhoneNumber} from "libphonenumber-js";

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        await (new SupportTicket(Object.assign({}, req.body, {
            phone: parsePhoneNumber(req.body.phone, process.env.PHONE_REGION).number
        }))).save()

        res.send('ok')
    } catch (e) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})

export default router
