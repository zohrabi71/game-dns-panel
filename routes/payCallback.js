const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/dashboard/paymentController');
const { verifyToken, checkCredit } = require('../middlewares/auth');

router.get('/', verifyToken, paymentController.payCallback.bind(paymentController))
module.exports = router;