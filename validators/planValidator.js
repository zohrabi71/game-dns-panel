const { body } = require('express-validator');

const planValidator = () => {
    return [
        body('title')
            .notEmpty().withMessage('نام الزامی است.')
            .isString().withMessage('نام باید یک رشته باشد.'),

        body('duration')
            .notEmpty().withMessage('مدت الزامی است.')
            .isInt().withMessage('مدت باید یک عدد باشد.'),

        body('capacity')
            .notEmpty().withMessage('ظرفیت الزامی است.')
            .isInt().withMessage('ظرفیت باید یک عدد باشد.'),

        body('price')
            .notEmpty().withMessage('قیمت الزامی است.')
            .isNumeric().withMessage('قیمت باید یک عدد باشد.'),

        body('discountedPrice')
            .optional({ nullable: true, checkFalsy: true })
            .isNumeric().withMessage('قیمت تخفیف خورده باید یک عدد باشد.')
            .custom((value, { req }) => {
                const originalPrice = parseFloat(req.body.price);
                const discountedPrice = parseFloat(value);
                if (discountedPrice >= originalPrice) {
                    throw new Error('قیمت تخفیف خورده نباید با قیمت برابر یا بیشتر باشد.');
                }
                return true; 
            }),

        body('status')
            .notEmpty().withMessage('وضعیت الزامی است.')
            .isIn(['active', 'disactive']).withMessage('وضعیت باید از بین گزینه های موجود باشد.'),
    ];
};

module.exports = planValidator;
