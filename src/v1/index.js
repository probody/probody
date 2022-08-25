import express from "express"
import AuthGuard from "../middlewares/AuthGuard.js"
import AuthRouter from "./auth/index.js"
import WorkerRouter from "./worker/index.js"
import AdminRouter from "./admin/index.js"
import SearchRouter from "./search/index.js"
import ProgramRouter from "./program/index.js"
import UserRouter from './user/index.js'
import ReviewRouter from "./review/index.js"
import VacancyRouter from "./vacancy/index.js"
import LeadRouter from "./lead/index.js"
import BlogRouter from "./blog/index.js"
import ServiceRouter from "./service/index.js"
import RegionRouter from "./region/index.js"
import FAQRouter from './faq/index.js'
import StatsRouter from './stats/index.js'
import SupportRouter from "./support/index.js";

const router = express.Router()

router.use('/auth', AuthRouter)
router.use('/admin', AdminRouter)
router.use('/worker', WorkerRouter)
router.use('/program', ProgramRouter)
router.use('/service', ServiceRouter)
router.use('/user', UserRouter)
router.use('/lead', LeadRouter)
router.use('/search', SearchRouter)
router.use('/review', ReviewRouter)
router.use('/faq', FAQRouter)
router.use('/region', RegionRouter)
router.use('/vacancy', VacancyRouter)
router.use('/blog', BlogRouter)
router.use('/stats', StatsRouter)
router.use('/support', SupportRouter)

export default router
