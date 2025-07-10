const { body } = require('express-validator');

const planValidator = () => {
    return [
        body('title')
            .notEmpty().withMessage('نام الزامی است.')
            .isString().withMessage('نام باید یک رشته باشد.'),

        body('credit')
            .notEmpty().withMessage('مدت الزامی است.')
            .isInt().withMessage('مدت باید یک عدد باشد.'),

        body('price')
            .notEmpty().withMessage('قیمت الزامی است.')
            .isNumeric().withMessage('قیمت باید یک عدد باشد.'),

        body('discountedPrice')
            .optional({ nullable: true, checkFalsy: true })
            .isNumeric().withMessage('قیمت تخفیف خورده باید یک عدد باشد.'),

        body('status')
            .notEmpty().withMessage('وضعیت الزامی است.')
            .isIn(['active', 'disactive']).withMessage('وضعیت باید از بین گزینه های موجود باشد.'),
    ];
};

module.exports = planValidator;
