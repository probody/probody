import mongoose from "mongoose"
import Review from "../../models/Review.model.js"
import Worker from "../../models/Worker.model.js";
import express from "express"
import apicache from "apicache"
import AuthGuard from "../../middlewares/AuthGuard.js";
import {v4 as uuidv4} from "uuid";
import RedisHelper from "../../helpers/RedisHelper.js";

const router = express.Router()

router.get('/me', AuthGuard('serviceProvider'), async (req, res) => {
    const salons = await Worker.find({host: req.user._id})

    res.json({
        reviews: await Review.find({target: {$in: salons.map(s => s._id)}}).populate('target', 'name').sort({createdAt: -1}),
    })
})

router.get('/:workerId', apicache.middleware('5 minutes'), async (req, res) => {
    if (!mongoose.mongo.ObjectId.isValid(req.params.workerId)) {
        return res.status(406).json({
            message: 'invalidId'
        })
    }

    if (!req.query.limit || req.query.limit > 20) {
        req.query.limit = 20
    }

    if (!req.query.page) {
        req.query.page = 1
    }

    res.json({
        reviews: await Review.find({target: req.params.workerId, text: {$exists: true}}).populate('target', 'name').limit(req.query.limit).skip((req.query.page - 1) * req.query.limit).sort({createdAt: -1}),
        pageCount: Math.ceil(await Review.countDocuments({target: req.params.workerId}) / req.query.limit),
        // avg: (await Review.aggregate([{$group: {_id: null, averageRate: {$avg: "$avg"}}}]))[0].averageRate
    })
})

router.post('/:workerId', async (req, res) => {
    try {
        const {text,
            interior,
            massage,
            name,
            service} = req.body

        if (!mongoose.mongo.ObjectId.isValid(req.params.workerId)) {
            return res.status(406).json({
                message: 'invalidId'
            })
        }

        const salonDoc = await Worker.findById(req.params.workerId, 'kind')

        if (!salonDoc) {
            return res.status(406).json({
                message: 'Salon not found'
            })
        }

        const reviewData = {
            target: req.params.workerId,
            targetType: salonDoc.kind,

            name,
            text,
            interior,
            massage,
            service
        }

        ;(new Review(reviewData)).validate(async (err) => {
            if (err) {
                console.log(err)

                return res.status(500).json({
                    message: "Internal Server Error"
                })
            }

            const redisKey = 'pending:check:review:' + uuidv4()

            await RedisHelper.set(redisKey, JSON.stringify(reviewData))

            res.status(202).json({
                message: "createdReview"
            })
        })
    }catch (e) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})

router.patch('/:reviewId/answer', AuthGuard('serviceProvider'), async (req, res) => {
    try {
        const {answer, complain} = req.body

        if (!mongoose.mongo.ObjectId.isValid(req.params.reviewId)) {
            return res.status(406).json({
                message: 'invalidId'
            })
        }

        const reviewDoc = await Review.findOne({_id: req.params.reviewId}).populate('target')

        if (!reviewDoc || String(reviewDoc.target.host) !== String(req.user._id)) {
            return res.status(406).json({
                message: 'Review not found'
            })
        }

        if (reviewDoc.answer) {
            return res.status(406).json({
                message: 'Answer already added'
            })
        }

        reviewDoc.answer = answer
        reviewDoc.complain = complain
        await reviewDoc.save()

        res.status(202).json({
            message: "createdAnswer"
        })
    }catch (e) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})

router.get('/', apicache.middleware('60 minutes'), async (req, res) => {
    try {
        res.json({
            avg:  await Review.aggregate([
                {
                    $group: {
                        _id: 'wholeSite',
                        avg: {
                            $avg: '$avg'
                        }
                    }
                }]),
            reviewCnt: await Review.count({
                text: {
                    $exists: true
                }
            }),
            ratingCnt: await Review.count({
                text: {
                    $exists: false
                }
            })
        })
    } catch (e) {
        console.log(e)

        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})

export default router
