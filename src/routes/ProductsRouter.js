
const express = require('express')
const router = express.Router()
const productsController = require('../controllers/ProductsController')

router.get('/product-detail', productsController.detail)
router.post('/product-detail', productsController.review)
router.get('/product-filtered', productsController.filter)
router.get('/product-searched', productsController.search)
router.get('/product-sorted', productsController.sort)
router.get('/category', productsController.category)
router.get('/', productsController.shop)

module.exports = router
