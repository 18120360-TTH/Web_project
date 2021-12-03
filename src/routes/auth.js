const express = require('express')
const router = express.Router()
const authController = require('../app/controllers/AuthController')

router.use('/login', authController.login)
router.use('/signup', authController.signup)
router.use('/password-recovery', authController.pass_recover)
router.use('/password-reset', authController.pass_reset)

/* router.get('/signup', authController.signup)
router.post('/signup/new-account', authController.create_account)
 */
router.post('/create-account', authController.create_account)

module.exports = router