
const express = require('express')
const router = express.Router()
const productsController = require('../app/controllers/ProductsController')

router.use('/product-detail', productsController.detail)
router.use('/', productsController.shop)

module.exports = router
