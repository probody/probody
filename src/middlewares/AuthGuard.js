import AuthorizedToken from "../models/AuthorizedToken.model.js"

export default function AuthGuard(allowedRole /* serviceProvider | admin */) {
    return async function (req, res, next) {
        if (!req.get('X-Auth-Token')) {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }

        let tokenDoc

        switch (allowedRole) {
            case 'serviceProvider':
                tokenDoc = await AuthorizedToken.findOne({token: req.get('X-Auth-Token')}).populate('userId')

                if (!tokenDoc) {
                    return res.status(401).json({
                        message: 'Unauthorized'
                    })
                }

                req.user = tokenDoc.userId
                break

            case 'notClient':
                tokenDoc = await AuthorizedToken.findOne({token: req.get('X-Auth-Token')}).populate('userId')

                if (!tokenDoc || tokenDoc.userId.role === 'serviceProvider') {
                    return res.status(401).json({
                        message: 'Unauthorized'
                    })
                }

                req.user = tokenDoc.userId
                break

            default:
                return res.status(500).json({
                    message: 'Internal server error'
                })
        }

        next()
    }
}
