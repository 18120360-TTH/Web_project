const express = require('express')
const router = express.Router()
const cartController = require('../app/controllers/CartController')
const authController = require('../app/controllers/AuthController')

router.use('/checkout', authController.authenCheck, cartController.checkout)
router.use('/', cartController.cart)

module.exports = router