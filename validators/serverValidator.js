const { body } = require('express-validator');

const serverValidator = () => {
    return [
        body('title')
            .notEmpty().withMessage('نام الزامی است.')
            .isString().withMessage('نام باید یک رشته باشد.'),

        body('location')
            .notEmpty().withMessage('مکان الزامی است.')
            .isString().withMessage('مکان باید یک رشته باشد.'),

        body('ip')
            .notEmpty().withMessage('آدرس IP الزامی است.')
            .isIP().withMessage('فرمت آدرس IP نامعتبر است.'),

        body('status')
            .notEmpty().withMessage('وضعیت الزامی است.')
            .isIn(['online', 'offline', 'maintenance']).withMessage('وضعیت باید از بین گزینه های موجود باشد.'),

        body('capacity')
            .notEmpty().withMessage('ظرفیت الزامی است.')
            .isInt({ min: 1 }).withMessage('ظرفیت باید یک عدد صحیح مثبت باشد.')
    ]
}

module.exports = serverValidator