
const express = require('express')
const router = express.Router()
const productsController = require('../app/controllers/ProductsController')

router.use('/product-detail', productsController.detail)
router.use('/product-filtered', productsController.filter)
router.use('/product-searched', productsController.search)
router.use('/product-sorted', productsController.sort)
router.use('/category', productsController.category)
router.use('/', productsController.shop)

module.exports = router
