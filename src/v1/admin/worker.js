import Worker from "../../models/Worker.model.js";
import Search from "../../helpers/Search.js";
import express from "express";
import AuthGuard from "../../middlewares/AuthGuard.js";

const router = express.Router();

// async getPaginatedPromocodes(searchPromocodesDto: SearchPromocodesDto, page: number, sortBy: string, sortDir: string) {
//     const PAGE_SIZE = 20
//     let query = ''
//
//     if (searchPromocodesDto.query) {
//         query = searchPromocodesDto.query
//         delete searchPromocodesDto.query
//     }
//
//     const selector = Object.assign({}, searchPromocodesDto, {
//         $or: [
//             {
//                 code: new RegExp(query, "i")
//             },
//             {
//                 comment: new RegExp(query, "i")
//             }
//         ]
//     })
//
//     return {
//         results: await this.promocodeModel.find(selector).populate('userId').limit(PAGE_SIZE).skip((page - 1) * PAGE_SIZE).sort({[sortBy]: sortDir === 'ASC' ? 1 : -1}),
//         pageCount: Math.ceil(await this.promocodeModel.countDocuments(selector) / PAGE_SIZE)
//     }
// }
router.post('/search', AuthGuard('notClient'), async (req, res) => {
    const PAGE_SIZE = 10
    let query = '',
        conditions = {}

    if (req.body.query) {
        query = req.body.query
        delete req.body.query
    }

    switch (req.body.tab) {
        case 'all':
            conditions = {approvalState: 'waiting'}
            break

        case 'salons':
            conditions = {kind: 'salon', approvalState: 'waiting'}
            break

        case 'salonMasters':
            conditions = {parent: {$exists: true}, kind: 'master', approvalState: 'waiting'}
            break

        case 'privateMasters':
            conditions = {parent: {$exists: false}, kind: 'master', approvalState: 'waiting'}
            break

        case 'paused':
            conditions = {paused: true}
            break

        case 'archive':
            conditions = {approvalState: {$ne: 'waiting'}, hideFromArchive: false}
            break
    }

    delete req.body.tab

    const selector = Object.assign(conditions, {
        $and: [
            {
                name: new RegExp(query, "i")
            }
        ]
    })

    res.json({
        results: await Worker.aggregate([
            {
                $match: selector
            },
            {
                $skip: (Math.max(Number(req.query.page), 1) - 1) * PAGE_SIZE
            },
            {
                $limit: PAGE_SIZE
            },
            {
                $sort: {[req.query.sortBy]: req.query.sortDir === 'ASC' ? 1 : -1}
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
                    from: 'workers',
                    localField: 'parent',
                    foreignField: '_id',
                    as: 'parent'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'host',
                    foreignField: '_id',
                    as: 'host'
                }
            }
        ]),
        pageCount: Math.ceil(await Worker.countDocuments(selector) / PAGE_SIZE)
    })
})

// router.get('/:uuid/view', async (req, res) => {
//     try {
//         const redisKey = 'pending:check:worker:' + req.params.uuid,
//             doc = JSON.parse(await RedisHelper.get(redisKey))
//
//         if (!doc) {
//             return res.status(404).json({
//                 message: 'Entity not found'
//             })
//         }
//
//         res.status(200).json({
//             data: doc
//         })
//     } catch (err) {
//         console.error(err)
//
//         res.status(500).json({
//             message: 'Internal Server Error'
//         })
//     }
// })

// router.patch('/:workerId/approve', async (req, res) => {
//     try {
//         const worker = await Worker.findOneAndUpdate({_id: req.params.workerId})
//
//         if (!worker.parent) {
//             const populatedDoc = await Worker.findById(req.params.workerId).populate('services', 'name').populate('leads', 'name').populate('region', 'name')
//
//             await Search.addWorker('search:worker:', populatedDoc._id, populatedDoc.kind, populatedDoc.name, populatedDoc.phone, populatedDoc.lastRaise, populatedDoc.avgCost, populatedDoc.rooms, populatedDoc.description, populatedDoc.leads, populatedDoc.services, populatedDoc.programs, populatedDoc.region.name, populatedDoc.messengers, populatedDoc.location.coordinates)
//         }
//
//         res.status(202).json({
//             message: 'approvedWorker'
//         })
//     } catch (err) {
//         console.error(err)
//
//         res.status(500).json({
//             message: 'Internal Server Error'
//         })
//     }
// })

// router.patch('/:uuid/decline', async (req, res) => {
//     try {
//         const redisKey = 'pending:check:worker:' + req.params.uuid,
//             doc = JSON.parse(await RedisHelper.get(redisKey))
//
//         if (!doc) {
//             return res.status(500).json({
//                 message: 'Internal Server Error'
//             })
//         }
//
//         // maybe, we'll have to notify the user here...
//         await RedisHelper.unlink(redisKey)
//         await RedisHelper.unlink('haspw:' + doc.host)
//
//         res.status(202).json({
//             message: 'declinedWorker'
//         })
//     } catch (err) {
//         console.error(err)
//
//         res.status(500).json({
//             message: 'Internal Server Error'
//         })
//     }
// })

// router.patch('/:uuid/editandapprove', async (req, res) => {
//     try {
//         const redisKey = 'pending:check:worker:' + req.params.uuid,
//             doc = JSON.parse(await RedisHelper.get(redisKey))
//
//         if (!doc) {
//             return res.status(500).json({
//                 message: 'Internal Server Error'
//             })
//         }
//
//         Object.assign(doc, req.body)
//
//         // maybe, we'll have to notify the user here...
//         const mongoDoc = new Worker(doc)
//
//         mongoDoc.validate(async (err) => {
//             if (err) {
//                 return res.status(500).json({
//                     message: 'Internal Server Error'
//                 })
//             }
//
//             await mongoDoc.save()
//             await Search.addWorker('search:worker:', mongoDoc._id, doc.kind, doc.name, doc.phone, doc.lastRaise, doc.rooms, doc.description, doc.leads, doc.services, doc.programs, (await Region.findById(doc.region)).name)
//             await RedisHelper.unlink(redisKey)
//             await RedisHelper.unlink('haspw:' + doc.host)
//
//             res.status(202).json({
//                 message: 'approvedWorker'
//             })
//         })
//     } catch (err) {
//         console.error(err)
//
//         res.status(500).json({
//             message: 'Internal Server Error'
//         })
//     }
// })

export default router
