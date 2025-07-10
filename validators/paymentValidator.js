const { body } = require('express-validator');

const paymentValidator = () => {
    return [
        body('status')
            .notEmpty().withMessage('وضعیت الزامی است.')
            .isIn(['pending', 'completed', 'failed', 'refunded']).withMessage('وضعیت باید از بین گزینه های موجود باشد.'),
    ];
};

module.exports = paymentValidator;
