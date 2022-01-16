
const express = require('express')
const router = express.Router()
const sitesController = require('../controllers/SitesController')
const authCheckHandler = require('../middleware/AuthCheckHandler')

router.get('/about-us', sitesController.about)
router.get('/my-account', authCheckHandler, sitesController.my_account)
router.post('/my-account/profile-update', authCheckHandler, sitesController.updateProfile)
router.get('/confirmation/:token', sitesController.active_account)
router.get('/verify-email',sitesController.verifyEmailNotify)
router.get('/', sitesController.home)

module.exports = router
