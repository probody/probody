export default function PostValidator(req, res, next) {
    if (req.validation.length > 0) {//если хоть одна валидация не прошла, отправляем ошибку, иначе пускаем дальше
        res.status(406).json({
            type: 'Validation error',
            data: req.validation
        })
    } else {
        next()
    }
}
