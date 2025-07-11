const express = require('express');
const router = express.Router();
const error = require('./../middlewares/error')

router.use('/auth', require('./auth'));

router.use('/dashboard', require('./dashboard'))

router.use(error)

router.all('*', async (req, res, next) => {
    try {
        res.status(404).render('errors/404')
    } catch (err) {
        next(err);
    }
});

router.use((err, req, res, next) => {
    const code = err.status || 500;
    const message = err.message || "";
    const stack = err.stack || "";

    if (process.env.NODE_ENV === 'development') {
        return res.render('errors/developer', { message, stack })
    } else {
        return res.render(`errors/${code}`, { message });
    }
})

module.exports = router;