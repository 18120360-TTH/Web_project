
const express = require('express')
const router = express.Router()
const sitesController = require('../app/controllers/SitesController')
const authController = require('../app/controllers/AuthController')

router.use('/about-us', sitesController.about)
router.use('/ad-search', sitesController.ad_search)
router.use('/my-account', authController.authenCheck, sitesController.my_account)
router.use('/', sitesController.home)

module.exports = router
