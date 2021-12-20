
const express = require('express')
const router = express.Router()
const sitesController = require('../controllers/SitesController')
const authController = require('../controllers/AuthController')

router.get('/about-us', sitesController.about)
router.get('/ad-search', sitesController.ad_search)
router.get('/my-account', authController.authenCheck, sitesController.my_account)
router.post('/my-account/profile-update', authController.authenCheck, sitesController.updateProfile)
router.get('/', sitesController.home)

module.exports = router
