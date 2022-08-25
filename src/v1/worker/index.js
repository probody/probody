import express from "express"
import AuthGuard from "../../middlewares/AuthGuard.js"
import Worker from '../../models/Worker.model.js'
import apicache from "apicache";
import Review from "../../models/Review.model.js"
import DefaultProgram from "../../models/DefaultProgram.model.js";
import mongoose from "mongoose";
import Search from "../../helpers/Search.js";

const router = express.Router()

router.post('/', AuthGuard('serviceProvider'), async (req, res) => {
    if (req.body._id) {
        if (await Worker.countDocuments({_id: req.body._id, host: req.user._id}) === 0) {
            return res.status(404).json({message: 'Not found'})
        }
    }

    if (req.body.location) {
        req.body.location = {
            type: "Point",
            coordinates: req.body.location
        }
    }

    req.body.programs = req.body.programs.map(i => {
        i.cost = Number(i.cost)

        return i
    });

    req.body.host = req.user._id

    ;(new Worker(req.body)).validate(async (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                message: "Internal Server Error"
            })
        }

        let parentWorker

        if (req.body._id) {
            const docId = req.body._id

            delete req.body._id
            delete req.body.host

            parentWorker = await Worker.findByIdAndUpdate(docId, req.body)

            await Worker.deleteMany({host: parentWorker._id})
        } else {
            parentWorker = await (new Worker(req.body)).save()
        }

        if (req.body.kind === 'salon') {
            req.body.masters.forEach(master => {
                const masterDoc = {
                        kind: 'master',
                        name: master.name,
                        characteristics: master.characteristics,
                        parent: parentWorker._id,
                        host: req.body.host,
                        photos: master.photos
                    }

                ;(new Worker(masterDoc)).save()
            })
        }

        res.status(202).json({
            message: "createdWorker"
        })
    })
})

router.get('/mine', AuthGuard('serviceProvider'), async (req, res) => {
    try {
        const mySalon = await Worker.findOne({
                host: req.user._id,
                parent: {$exists: false}
            }, 'region slug raises').populate('region'),
            position = await Search.getSalonPosition(mySalon._id, mySalon.region.name.toLowerCase())

        res.json({position, raises: mySalon.raises, slug: mySalon.slug})
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

router.get('/top3', apicache.middleware('15 minutes'), async (req, res) => {
    const top3Ids = Object.assign({}, ...(await Review.aggregate([{
            $match: {
                targetType: 'master',
                parent: {$exists: false}
            }
        }, {
            $group: {
                _id: '$target',
                averageRate: {$avg: "$avg"}
            }
        }]).sort({averageRate: -1}).limit(3)).map(item => ({[item._id]: item.averageRate}))),
        top3Workers = await Worker.find({_id: {$in: Object.keys(top3Ids)}}).populate('host', 'subscriptionTo')

    res.json(top3Workers)
})

// router.get('/:id/similar', apicache.middleware('15 minutes'), async (req, res) => {
//     if (!mongoose.mongo.ObjectId.isValid(req.params.id)) {
//         return res.status(406).json({
//             message: 'invalidId'
//         })
//     }
//
//     const workerDoc = await Worker.findById(req.params.id, 'location')
//
//     if (!workerDoc) {
//         return res.status(404).json({
//             message: 'workerNotFound'
//         })
//     }
//
//     if (workerDoc.kind === 'master') {
//         res.json(await Worker.find({parent: {$exists: false}}).where('location').near({
//             center: {
//                 coordinates: workerDoc.location.coordinates,
//                 type: 'Point'
//             }
//         }).limit(3))
//     } else {
//         res.json(await Worker.find({
//             kind: 'salon'
//         }).where('location').near({center: {coordinates: workerDoc.location.coordinates, type: 'Point'}}).limit(3))
//     }
// })

router.get('/:slug/suggestions', apicache.middleware('15 minutes'), async (req, res) => {
    try {
        const worker = await Worker.findOne({slug: req.params.slug}, 'parent kind location')

        if (!worker) {
            return res.status(404).json({
                message: 'workerNotFound'
            })
        }

        if (worker.parent) {
            return res.json(await Worker.find({
                parent: worker.parent,
                slug: {
                    $ne: req.params.slug
                }
            }).populate('host', 'subscriptionTo').limit(3))
        }

        return res.json(await Worker.find({
            kind: worker.kind,
            _id: {
                $ne: worker._id
            },
            parent: {
                $exists: false
            }
        }).where('location').near({
            center: {
                coordinates: worker.location.coordinates,
                type: 'Point'
            }
        }).limit(3).populate('host', 'subscriptionTo').exec())
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})

router.get('/:slug', apicache.middleware('5 minutes'), async (req, res) => {
    try {
        const worker = await Worker.findOne({slug: req.params.slug}, "kind parent")

        if (!worker) {
            return res.status(404).json({
                message: 'workerNotFound'
            })
        }

        const aggregationPipeline = [
            {
                $match: {
                    slug: req.params.slug
                }
            },
            {
                $limit: 1
            },
            {
                $lookup: {
                    from: 'workers',
                    localField: '_id',
                    foreignField: 'parent',
                    as: 'masters'
                }
            },
            {
                $lookup: {
                    from: 'regions',
                    localField: 'region',
                    foreignField: '_id',
                    as: 'region'
                }
            },
            {
                $lookup: {
                    from: 'services',
                    localField: 'services',
                    foreignField: '_id',
                    as: 'services'
                }
            },
            {
                $lookup: {
                    from: 'leads',
                    localField: 'leads',
                    foreignField: '_id',
                    as: 'leads'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'host',
                    foreignField: '_id',
                    as: 'host'
                }
            },
            {
                $project: {
                    region: {$arrayElemAt: ['$region', 0]},
                    'host.subscriptionTo': 1,

                    services: 1,
                    leads: 1,
                    kind: 1,
                    location: 1,
                    characteristics: 1,
                    name: 1,
                    slug: 1,
                    workHours: 1,
                    workDays: 1,
                    isVerified: 1,
                    photos: 1,
                    messengers: 1,
                    address: 1,
                    social: 1,
                    programs: 1,
                    description: 1,
                    phone: 1,
                    masters: 1,
                    avgCost: 1,
                    rooms: 1
                }
            }]

        const aggregatedReviews = await Review.aggregate([{
                $match: {
                    target: worker._id
                }
            },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $group: {
                        _id: '$target',
                        avg: {
                            $avg: '$avg'
                        }
                    }
                }]),
            reviewCount = await Review.count({
                target: worker._id,
                text: {
                    $exists: true
                }
            }),
            ratingCount = await Review.count({
                target: worker._id,
                text: {
                    $exists: false
                }
            })

        return res.json({
            worker: worker.parent ? [await Worker.findOne({slug: req.params.slug}).populate('host', 'subscriptionTo').populate({
                path: 'parent',
                populate: [
                    {
                        path: 'services'
                    },
                    {
                        path: 'leads'
                    },
                    {
                        path: 'services'
                    },
                    {
                        path: 'region'
                    }
                ]
            })] : await Worker.aggregate(aggregationPipeline),
            allPrograms: await DefaultProgram.find({}),
            reviews: {
                avg: aggregatedReviews[0]?.avg,
                count: ratingCount + reviewCount,
                reviewCount,
                ratingCount
            }
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

router.get('/:id/map', apicache.middleware('5 minutes'), async (req, res) => {
    try {
        if (!mongoose.mongo.ObjectId.isValid(req.params.id)) {
            return res.status(406).json({
                message: 'invalidId'
            })
        }

        const worker = await Worker.findOne({_id: new mongoose.mongo.ObjectId(req.params.id)}, ['photos', 'slug', 'isVerified', 'name', 'messengers', 'phone', 'address', 'location']).populate('host', 'subscriptionTo')

        if (!worker) {
            return res.status(404).json({
                message: 'workerNotFound'
            })
        }

        return res.json({
            worker,
            review: (await Review.aggregate([{
                $match: {
                    target: worker._id
                }
            }, {
                $group: {
                    _id: '$target',
                    avg: {
                        $avg: '$avg'
                    },
                    count: {
                        $count: {}
                    }
                }
            }]))
        })
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

export default router
