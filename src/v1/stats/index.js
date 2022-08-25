import express from "express";
import AuthGuard from "../../middlewares/AuthGuard.js";
import Stats from "../../models/Stats.model.js";
import Worker from "../../models/Worker.model.js";

const router = express.Router()

router.put('/:salonId/views', async (req, res) => {
    try {
        const currentDay = new Date()
        currentDay.setHours(0, 0, 0, 0)

        await Stats.updateOne({
                salon: req.params.salonId,
                date: currentDay
            }, {
                $inc: {
                    [`counters.views`]: 1
                }
            },
            {
                upsert: true
            }
        )

        res.status(202).send('ok')
    } catch (e) {
        console.log(e)

        res.status(500).json({
            type: 'Error',
            message: 'Internal Server Error'
        })
    }
})

router.put('/:salonId/:field', async (req, res) => {
    try {
        const currentDay = new Date()
        currentDay.setHours(0, 0, 0, 0)

        await Stats.updateOne({
                salon: req.params.salonId,
                date: currentDay
            }, {
                $inc: {
                    [`counters.actions.${req.params.field}`]: 1
                }
            },
            {
                upsert: true
            }
        )

        res.status(202).send('ok')
    } catch (e) {
        console.log(e)

        res.status(500).json({
            type: 'Error',
            message: 'Internal Server Error'
        })
    }
})

router.get('/', AuthGuard('serviceProvider'), async (req, res) => {
    try {
        const salon = await Worker.findOne({
            host: req.user._id,
            parent: {
                $exists: false
            }
        }, '_id')

        if (Number(req.query.from) > Number(req.query.to)) {
            return
        }

        let currentDay = new Date(Number(req.query.from)),
            stats = await Stats.find({
                salon: salon._id,
                date: {
                    $gte: new Date(Number(req.query.from)),
                    $lte: new Date(Number(req.query.to))
                }
            })

        currentDay.setHours(0, 0, 0, 0)
        currentDay = +currentDay

        while (true) {
            if (currentDay > Number(req.query.to)) {
                break
            }

            //{"counters":{"actions":{"mapClicks":0,"messengerClicks":0,"phoneClicks":0,"photoClicks":0,"priceClicks":0,"reviewClicks":0,"shareClicks":0,"socialClicks":0,"websiteClicks":0},"views":0},"_id":"62d01ea755374e6646cc05bb","date":"2022-07-14T00:00:00.000Z","salon":"62aded50a98de316b5e05219"}
            if (!stats.find(i => +new Date(i.date) === currentDay)) {
                stats.push({"counters":{"actions":{"mapClicks":0,"messengerClicks":0,"phoneClicks":0,"photoClicks":0,"priceClicks":0,"reviewClicks":0,"shareClicks":0,"socialClicks":0,"websiteClicks":0},"views":0},"date":(new Date(currentDay)).toISOString(),"salon":"62aded50a98de316b5e05219"})
            }

            //+1 day
            currentDay += 86400000
        }

        res.json({
            data: stats.sort((a, b) => +new Date(a.date) - +new Date(b.date))
        })
    } catch (e) {
        console.log(e)

        res.status(500).json({
            type: 'Error',
            message: 'Internal Server Error'
        })
    }
})

export default router
