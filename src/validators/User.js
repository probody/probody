import PostValidator from "../helpers/PostValidator.js";

export async function updateUser(req, res, next) {
    const {field, value} = req.body;

    req.validation = []

    if (field) { //проверяем наличие ключа
        if (!['avatar', 'nickName', 'email', 'internalRole'].includes(field)) {//проверяем на валидность ключ
            req.validation.push({text: 'invalidField', field: 'field'})
        } else {//ключ правильный, проверяем на валидность значение
            switch (field) {
                case 'avatar':
                case 'nickName':
                    if (typeof value !== 'string') {
                        req.validation.push({text: 'invalidValue', field})
                        break
                    }

                    if (field.length > 256) {
                        req.validation.push({text: 'tooLongValue', field})
                    } else if (field.length < 3) {
                        req.validation.push({text: 'tooShortValue', field})
                    }
                    break

                case 'email':
                    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                        req.validation.push({text: 'invalidValue', field})
                        break
                    }
                    break

                case 'internalRole':
                    if (!['admin', 'owner', 'manager', 'master'].includes(value)) {
                        req.validation.push({text: 'invalidValue', field})
                        break
                    }
            }
        }
    } else {
        req.validation.push({text: 'emptyField', field: 'field'})
    }

    return PostValidator(req, res, next)
}
