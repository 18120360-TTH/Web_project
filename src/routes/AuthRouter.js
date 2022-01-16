const express = require('express')
const passport = require('passport')
const authController = require('../controllers/AuthController')
const cartController = require('../controllers/CartController')
const initPassportLocal = require('../middleware/PassportHandler')
const authCheckHandler = require('../middleware/AuthCheckHandler')

const router = express.Router()

initPassportLocal()

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/auth/login?failed=true' }),
    cartController.mergeCart,
    authController.login,
)

router.post('/create-account', authController.create_account)
router.post('/info-to-recover', authController.send_mail_recover_password)
router.post('/recover-password', authController.recover_password)

router.get('/login', authController.loginView)
router.get('/signup', authController.signup)
router.get('/password-recovery-request', authController.pass_recover_request)
router.get('/password-recover-notify',authController.password_recover_notify)
router.get('/password-recovery/:token', authController.password_recovery)


router.use(authCheckHandler)
router.post('/reset-password', authController.reset_password)
router.get('/logout', authController.logout)
router.get('/password-reset', authController.pass_reset)


module.exports = router