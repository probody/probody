import express from "express";
import apicache from "apicache";
import Service from "../../models/Service.model.js";

const router = express.Router()

router.get('/', apicache.middleware('15 minutes'), async (req, res) => {
    res.json(await Service.find({}))
})

export default router
