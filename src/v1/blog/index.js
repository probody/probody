import express from "express";
import BlogArticle from "../../models/BlogArticle.model.js";
import AuthGuard from "../../middlewares/AuthGuard.js";

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.query.limit || req.query.limit > 20) {
        req.query.limit = 20
    }

    if (!req.query.page) {
        req.query.page = 1
    }

    res.json({
        articles: await BlogArticle.find({}).limit(req.query.limit).skip((req.query.page - 1) * req.query.limit).sort({createdAt: -1}),
        pageCount: Math.ceil(await BlogArticle.countDocuments({}) / req.query.limit)
    })
})

router.get('/:slug', async (req, res) => {
    const blogArticle = await BlogArticle.findOne({slug: req.params.slug}).populate('tags')

    res.json(Object.assign({}, blogArticle, await BlogArticle.find({$text: {$search: blogArticle.text}}, {score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore'}}).limit(3)))
})

router.post('/', AuthGuard('admin'), async (req, res) => {
    try {
        const {title,
            photos,
            tag,
            text} = req.body

        const doc = await (new BlogArticle({
            title,
            photos,
            text,
            tags: [tag]
        })).save()

        res.status(200).json({
            message: 'Created',
            link: `/blog/${doc.slug}`
        })
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})

export default router;
