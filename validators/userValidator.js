const { body } = require('express-validator');
const Validator = require('./validators');

class UserValidator extends Validator {
    register() {
        return [
            body('email')
                .trim()
                .not().isEmpty().withMessage('لطفا" ایمیل خود را وارد کنید.')
                .isEmail().withMessage('فرمت ایمیل صحیح نمی باشد.'),
            body('password', 'پسورد باید حداقل 4 و حداکثر 20 کاراکتر داشته باشد')
                .isLength({ min: 4, max: 20 }),
            body('confirm-password')
                .custom((value, { req }) => value === req.body.password)
                .withMessage('تکرار پسورد با پسورد یکسان نیست.'),
            body('privacy')
                .custom((value, { req }) => value)
                .withMessage('لطفاً با قوانین و مقررات موافقت کنید.'),
        ]
    }

    update() {
        return [
            body('password')
                .optional({ nullable: true, checkFalsy: true })
                .isLength({ min: 4, max: 20 }).withMessage('پسورد باید حداقل 4 و حداکثر 20 کاراکتر داشته باشد'),
            body('confirm-password')
                .optional()
                .custom((value, { req }) => value === req.body.password)
                .withMessage('تکرار پسورد با پسورد یکسان نیست.'),
            body('subscriptionExpiration')
                .optional()
                .isInt({ min: 0 }).withMessage('مدت اشتراک باید یک عدد صحیح مثبت باشد'),
            body('server')
                .optional()
                .isString().withMessage('سرور باید یک رشته معتبر باشد'),
        ]
    }

    login() {
        return [
            body('email')
                .trim()
                .not().isEmpty().withMessage('لطفا" ایمیل خود را وارد کنید.')
                .isEmail().withMessage('فرمت ایمیل صحیح نمی باشد.'),
            body('password', 'پسورد باید حداقل 4 و حداکثر 20 کاراکتر داشته باشد')
                .isLength({ min: 4, max: 20 })
        ]
    }
}

module.exports = new UserValidator()