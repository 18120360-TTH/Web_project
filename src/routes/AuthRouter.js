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

router.get('/login', authController.loginView)
router.get('/signup', authController.signup)

router.use(authCheckHandler)
router.get('/logout', authController.logout)
router.get('/password-recovery', authController.pass_recover)
router.get('/password-reset', authController.pass_reset)

module.exports = router