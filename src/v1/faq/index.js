import express from 'express';
import FAQ from "../../models/FAQ.model.js";
import AuthGuard from "../../middlewares/AuthGuard.js";
import FAQResponse from "../../models/FAQResponse.model.js";
import apicache from "apicache";
import mongoose from "mongoose";
import AuthorizedToken from "../../models/AuthorizedToken.model.js";

const router = express.Router();

router.get('/', async (req, res) => {
    let userId, token = req.get('X-Auth-Token')

    if (token) {
        const userDoc = await AuthorizedToken.findOne({token: req.get('X-Auth-Token')}).populate('userId')

        if (userDoc) {
            userId = userDoc.userId._id
        }
    }

    res.json(userId ? await FAQ.aggregate([{
        $lookup: {
            from: 'faqResponse',
            localField: '_id',
            foreignField: 'faqId',
            as: 'gotResponse',
            pipeline: [{
                $match: {
                    userId: new mongoose.mongo.ObjectId(userId)
                }
            }]
        }
    }, {
        $project: {
            name: 1,
            description: 1,
            gotResponse: {
                $toBool: {
                    $ne: [{
                        $size: '$gotResponse'
                    },
                        0
                    ]
                }
            }
        }
    }]) : await FAQ.find({}))
})

router.get('/:id/quality', apicache.middleware('30 minutes'), async (req, res) => {
    try {
        const satisfiedCnt = await FAQResponse.countDocuments({
                faqId: req.params.id,
                isUseful: true
            }),
            allCnt = await FAQResponse.countDocuments({
                faqId: req.params.id
            })

        res.json({
            quality: allCnt > 0 ? satisfiedCnt / allCnt : 0
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.post('/:id', AuthGuard('serviceProvider'), async (req, res) => {
    try {
        const faqAnswer = await FAQResponse.findOne({faqId: req.params.id, userId: req.user._id})

        if (faqAnswer) {
            return res.status(400).json({message: 'You have already answered this question'})
        }

        await (new FAQResponse({
            faqId: req.params.id,
            userId: req.user._id,
            text: req.body.text,
            isUseful: req.body.isUseful,
        })).save()

        res.json({message: 'Answer added'})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})

export default router;
