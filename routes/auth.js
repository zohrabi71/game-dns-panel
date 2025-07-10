const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController')
const authValidator = require('./../validators/authValidator')

router.post('/register', authValidator.register(), authController.register.bind(authController))
router.post('/login', authValidator.login(), authController.login.bind(authController))
router.get('/logout', authController.logoutForm)

router.use((req, res, next) => {
    if (!req.cookies.access_token) {
        return next()
    }
    res.redirect('/dashboard')
})

router.get('/register', authController.registerForm.bind(authController))
router.get('/login', authController.loginForm.bind(authController))

module.exports = router;