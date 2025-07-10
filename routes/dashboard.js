const express = require('express');
const router = express.Router();
const dashboardController = require('./../controllers/dashboard/dashboardController');
const userController = require('./../controllers/dashboard/userController');
const serverController = require('./../controllers/dashboard/serverController');
const planController = require('./../controllers/dashboard/planController');
const paymentController = require('../controllers/dashboard/paymentController');
const AuthValidator = require('../validators/authValidator');
const serverValidator = require('../validators/serverValidator');
const planValidator = require('../validators/planValidator');
const paymentValidator = require('../validators/paymentValidator');
const { verifyToken, checkCredit } = require('../middlewares/auth');

router.use((req, res, next) => {
    if (req.cookies.access_token) {
        return next()
    }
    res.redirect('/auth/login')
})

router.get('/', verifyToken, dashboardController.dashboard.bind(dashboardController))

// Server
router.get('/servers', verifyToken, serverController.getAll.bind(serverController))
router.get('/server/create', verifyToken, serverController.createPage.bind(serverController))
router.post('/server/create', [verifyToken, serverValidator()], serverController.set.bind(serverController))
router.get('/server/:id/edit', verifyToken, serverController.get.bind(serverController))
router.put('/server/:id/edit', [verifyToken, serverValidator()], serverController.update.bind(serverController))
router.delete('/server/:id', verifyToken, serverController.delete.bind(serverController));

// Plan
router.get('/plans', verifyToken, planController.getAll.bind(planController))
router.get('/plan/create', verifyToken, planController.createPage.bind(planController))
router.post('/plan/create', [verifyToken, planValidator()], planController.set.bind(planController))
router.get('/plan/:id/edit', verifyToken, planController.get.bind(planController))
router.put('/plan/:id/edit', [verifyToken, planValidator()], planController.update.bind(planController))
router.delete('/plan/:id', verifyToken, planController.delete.bind(planController));

// Payment
router.get('/payments', verifyToken, paymentController.getAll.bind(paymentController))
router.get('/payment', verifyToken, paymentController.paymentPage.bind(paymentController))
router.post('/pay', verifyToken, paymentController.pay.bind(paymentController))
router.get('/paycallback', verifyToken, paymentController.payCallback.bind(paymentController))
router.get('/payment/:id/edit', verifyToken, paymentController.get.bind(paymentController))
router.put('/payment/:id/edit', [verifyToken, paymentValidator()], paymentController.update.bind(paymentController))

// User
router.get('/users', verifyToken, userController.getAll.bind(userController))
router.get('/user/:id/edit', verifyToken, userController.get.bind(userController))
router.put('/user/:id/edit', [verifyToken, AuthValidator.update()], userController.update.bind(userController))


module.exports = router;