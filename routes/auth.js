const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController')
const userValidator = require('./../validators/userValidator')

router.post('/register', userValidator.register(), authController.register.bind(authController))
router.post('/login', userValidator.login(), authController.login.bind(authController))
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