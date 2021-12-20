const express = require('express')
const router = express.Router()
const cartController = require('../controllers/CartController')
const authController = require('../controllers/AuthController')

router.get('/checkout', authController.authenCheck, cartController.getCheckoutView)
router.get('/', cartController.cart)
router.post('/add-items', cartController.addItems)
router.post('/update-items', cartController.updateItems)
router.post('/checkout', authController.authenCheck, cartController.checkout)

module.exports = router