import express from "express"
import Vacancy from "../../models/Vacancy.model.js"
import AuthGuard from "../../middlewares/AuthGuard.js"
import {v4 as uuidv4} from "uuid";
import RedisHelper from "../../helpers/RedisHelper.js";

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.query.limit || req.query.limit > 20) {
        req.query.limit = 20
    }

    if (!req.query.page) {
        req.query.page = 1
    }

    res.json({
        vacancies: await Vacancy.find({}).populate('region').limit(req.query.limit).skip((req.query.page - 1) * req.query.limit).sort({createdAt: -1}),
        pageCount: Math.ceil(await Vacancy.countDocuments({}) / req.query.limit)
    })
})

router.post('/', AuthGuard('serviceProvider'), async (req, res) => {
    req.body = Object.assign({}, req.body, {
        host: req.user._id
    })

    if (req.body._id) {
        if (await Vacancy.countDocuments({_id: req.body._id, host: req.user._id}) === 0) {
            return res.status(404).json({message: 'Not found'})
        }
    }

    try {
        (new Vacancy(req.body)).validate(async (err) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: "Internal Server Error"
                })
            }

            const redisKey = 'pending:check:vacancy:' + uuidv4()

            await RedisHelper.set(redisKey, JSON.stringify(req.body))

            res.status(202).json({
                message: "createdVacancy"
            })
        })
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})

router.delete('/:slug', AuthGuard('serviceProvider'), async (req, res) => {
    try {
         await Vacancy.deleteOne({
             host: req.user._id,
             slug: req.params.slug.toLowerCase()
         })

        res.send('ok')
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})

router.patch('/:slug', AuthGuard('serviceProvider'), async (req, res) => {
    if (req.body.host !== String(req.user._id)) {
        res.status(403).send('forbidden')
    }

    try {
        (new Vacancy(req.body)).validate(async (err) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: "Internal Server Error"
                })
            }

            const redisKey = 'pending:check:vacancy:' + uuidv4()

            await RedisHelper.set(redisKey, JSON.stringify(req.body))

            res.status(202).json({
                message: "createdVacancy"
            })
        })
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})

router.get('/me', AuthGuard('serviceProvider'), async (req, res) => {
    res.json(await Vacancy.find({host: req.user._id}).populate('region'))
})

router.get('/:slug', async (req, res) => {
    res.json(await Vacancy.findOne({slug: req.params.slug}).populate('region'))
})

export default router;
