import express from "express"
import AdminWorkerRouter from "./worker.js"
import AdminVacancyRouter from "./vacancy.js"
import AdminReviewRouter from "./review.js"
// import RedisHelper from "../../helpers/RedisHelper.js";

const router = express.Router()

// router.get('/', async (req, res) => {
//     const workersKey = 'pending:check:worker:*',
//         vacanciesKey = 'pending:check:vacancy:*',
//         reviewsKey = 'pending:check:review:*',
//         uuidExtractor = key => key.split(':')[3]
//
//     res.json({
//         workers: (await RedisHelper.keys(workersKey)).map(uuidExtractor),
//         vacancies: (await RedisHelper.keys(vacanciesKey)).map(uuidExtractor),
//         reviews: (await RedisHelper.keys(reviewsKey)).map(uuidExtractor)
//     })
// })

router.use('/worker', AdminWorkerRouter)
router.use('/vacancy', AdminVacancyRouter)
router.use('/review', AdminReviewRouter)

export default router
