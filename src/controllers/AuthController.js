const AuthServices = require('../services/AuthServices')

class AuthController {
    // [GET]  /login
    loginView(req, res) {
        if (req.query.failed) {
            res.render('auth/login', { msg: 'Username or password is incorrect!' })
        } else {
            res.render('auth/login')
        }
    }

    // [POST] /login
    login(req, res) {
        res.locals.user = req.user
        res.redirect('/')
    }

    // [GET] /logout
    logout(req, res) {
        req.logout()
        res.redirect('/')
    }

    // [GET]  /signup
    signup(req, res) { res.render('auth/signup') }

    // [GET]  /password-recovery
    pass_recover(req, res) { res.render('auth/password-recovery') }

    // [GET]  /password-reset
    pass_reset(req, res) { res.render('auth/password-reset') }

    // [POST] /create-account
    async create_account(req, res) {
        const result = await AuthServices.addNewAccount(req.body)
        res.redirect('/auth/login')
    }
}

module.exports = new AuthController
