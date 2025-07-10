const { body } = require('express-validator');
const Validator = require('./validators');

class AuthValidator extends Validator {
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
            body('credit')
                .optional()
                .isInt({ min: 0 }).withMessage('Credit must be a positive integer'),
            body('server')
                .optional()
                .isInt().withMessage('Server must be a valid string'),
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

module.exports = new AuthValidator()