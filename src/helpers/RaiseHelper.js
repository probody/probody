import Worker from '../models/Worker.model.js'
import Search from "./Search.js";

const CHECK_INTERVAL = 1000 * 60

export default class RaiseHelper {
    static runPlanner() {
        setTimeout(RaiseHelper.planner, CHECK_INTERVAL)
    }

    static async planner() {
        const paidSalons = await Worker.aggregate([
            {
                '$match': {
                    'parent': {
                        '$exists': false
                    },
                    'raises.0': {
                        '$exists': true
                    }
                }
            }, {
                '$project': {
                    'lastRaise': 1,
                    'raises': 1
                }
            }
        ])

        // paidSalons = [
        //     {
        //         "_id": "62aded50a98de316b5e05219",
        //         "lastRaise": "2022-07-22T16:03:26.262Z",
        //         "raises": [
        //             "2022-08-23T00:00:00.000Z",
        //             "2022-07-23T00:00:00.000Z",
        //             "2021-07-23T00:00:00.000Z"
        //         ]
        //     }
        // ]

        for (const salonKey in paidSalons) {
            const lastRaiseTS = +new Date(paidSalons[salonKey].lastRaise),
                pendingRaises = paidSalons[salonKey].raises
                    .sort((a, b) => +new Date(a) - +new Date(b))
                    .filter(i => (+new Date(i) > lastRaiseTS) && (+new Date(i) < +new Date))

            if (pendingRaises.length) {
                await Worker.updateOne({_id: paidSalons[salonKey]._id}, {$set: {lastRaise: new Date(pendingRaises[0])}})
                await Search.setLastRaise(paidSalons[salonKey]._id, +new Date(pendingRaises[0]))
            }
        }

        return setTimeout(RaiseHelper.planner, CHECK_INTERVAL)
    }
}
