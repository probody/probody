import express from "express";
import apicache from "apicache";
import Region from "../../models/Region.model.js";

const router = express.Router()

router.get('/', apicache.middleware('15 minutes'), async (req, res) => {
    res.json(await Region.find({}))
})

export default router
