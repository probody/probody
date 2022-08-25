import express from "express";
import apicache from "apicache";
import Lead from "../../models/Lead.model.js";

const router = express.Router()

router.get('/', apicache.middleware('15 minutes'), async (req, res) => {
    res.json(await Lead.find({}))
})

export default router
