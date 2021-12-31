const express = require('express')
const router = express.Router()
const cartController = require('../controllers/CartController')
const authCheckHandler = require('../middleware/AuthCheckHandler')

router.get('/checkout', authCheckHandler, cartController.getCheckoutView)
router.get('/', cartController.cart)
router.post('/add-items', cartController.addItems)
router.post('/update-items', cartController.updateItems)
router.post('/checkout', authCheckHandler, cartController.checkout)

module.exports = router