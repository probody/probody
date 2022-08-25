import express from "express"
import apicache from 'apicache'
import Search from "../../helpers/Search.js"
import Lead from "../../models/Lead.model.js"
import Worker from "../../models/Worker.model.js"
import Messenger from "../../models/Messenger.model.js"
import Service from "../../models/Service.model.js"
import {isValidPhoneNumber, parsePhoneNumber} from "libphonenumber-js"

const router = express.Router()

router.get('/region', apicache.middleware('15 minutes'), async (req, res) => {
    res.json(await Search.getRegionInfo())
})

router.get('/filter', apicache.middleware('15 minutes'), async (req, res) => {
    try {
        res.json({
            leads: await Lead.find({}),
            services: await Service.find({}),
            messengers: await Messenger.find({}),
            priceRange: (await Worker.aggregate([{
                $match: {
                    parent: {
                        $exists: false
                    }
                }
            }, {
                $sort: {
                    avgCost: 1
                }
            }, {
                $group: {
                    _id: 'priceRange',
                    from: {
                        $first: '$avgCost'
                    },
                    to: {
                        $last: '$avgCost'
                    }
                }
            }]))[0],
            rooms: [
                {
                    _id: 'under5',
                    name: '1-5'
                },
                {
                    _id: '5to10',
                    name: '5-10'
                },
                {
                    _id: 'morethan10',
                    name: '10+'
                }
            ]
        })
    } catch (e) {
        console.log(e)

        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})

router.post('/worker', async (req, res) => {
    try {
        let parsedPN

        try {
            parsedPN = parsePhoneNumber(req.body.query, process.env.PHONE_REGION)
            if (!isValidPhoneNumber(parsedPN.number, process.env.PHONE_REGION)) {
                parsedPN = null
            }
        } catch (e) {
        }

        if (!req.query.limit || req.query.limit > 20) {
            req.query.limit = 20
        }

        if (!req.query.page) {
            req.query.page = 1
        }

        if (req.query.onlyCount === 'true') {
            req.query.limit = 0
        }

        req.body.query = req.body.query.trim().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')

        if (parsedPN && parsedPN.isValid()) {
            req.body.query = '@phone:{' + parsedPN.number.replace('+', '') + '}'
        } else if (req.body.query.length) {
            req.body.query += '*'
        }

        if (req.body.filters) {
            for (let filterName in req.body.filters) {
                if (typeof req.body.filters[filterName] === 'object' || req.body.filters[filterName].length) {
                    if (filterName === 'kind') {
                        req.body.query += ` @${filterName}:{${req.body.filters[filterName]}}`
                    } else if (filterName === 'price') {
                        req.body.query += ` @avgcost:[${req.body.filters[filterName].from || 0} ${req.body.filters[filterName].to || 999999}]`
                    } else if (filterName === 'coords') {
                        req.body.query += ` @location:[${req.body.filters[filterName].join(' ')} 5 km]`
                    } else if (filterName === 'rooms') {
                        req.body.filters[filterName].split(' ').forEach(room => {
                            switch (room) {
                                case '1-5':
                                    req.body.query += ` @rooms:[0 5]`
                                    break
                                case '5-10':
                                    req.body.query += ` @rooms:[5 10]`
                                    break
                                case '10+':
                                    req.body.query += ` @rooms:[10 20]`
                                    break
                            }
                        })
                    } else {
                        req.body.query += ` @${filterName}:${req.body.filters[filterName].toLowerCase()}`
                    }
                }
            }
        }

        if (!req.body.query.length) {
            req.body.query = '*'
        }

        res.json(await Search.findWorker(req.body.query, Object.keys(req.body.filters).hasOwnProperty('coords'), req.query.limit, (req.query.page - 1) * req.query.limit))
    } catch (e) {
        res.status(500).json({
            message: 'Internal server error'
        })
    }
})

export default router
